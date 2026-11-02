import { vi } from "vitest";
import {
  generateHTML,
  extractCustomData,
  formatCustomData,
  paste,
  PLAIN_FORMAT,
  HTML_FORMAT,
  CUSTOM_FORMAT,
  copyOrCut,
  IMAGE_FORMAT,
  parseCustomData,
} from "../copy";

describe("generateHTML", () => {
  it.each([
    "</style><script>alert(1)</script><style>",
    '</StYlE><img src=x onerror="alert(1)">',
    '</style ><svg onload="alert(1)"></svg>',
    '</style></head><body onload="alert(1)"><style>',
  ])("keeps stylesheet markup inert after serialization: %s", (style) => {
    const result = generateHTML(style, "<tr><td>safe</td></tr>");
    const parsed = new DOMParser().parseFromString(result, "text/html");

    expect(parsed.querySelectorAll("style")).toHaveLength(1);
    expect(parsed.head.querySelector("style")?.textContent).toBe(
      style.replaceAll("<", "\\3c "),
    );
    expect(
      parsed.querySelector("script, img, svg, [onerror], [onload]"),
    ).toBeNull();
    expect(parsed.body.querySelector("td")?.textContent).toBe("safe");
  });

  it("preserves Excel metadata, cell formatting and escaped custom data", () => {
    const customData = {
      range: {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 2,
        sheetId: "</style><img src=x>&",
      },
      type: "copy",
    };
    const result = generateHTML(
      ".cell { color: red; }",
      '<colgroup><col width="80"></colgroup><tr><td class="cell" colspan="2" style="font-weight: bold">A &amp; B<br>C</td></tr>',
      formatCustomData(JSON.stringify(customData)),
    );
    const parsed = new DOMParser().parseFromString(result, "text/html");

    expect(parsed.documentElement.getAttribute("xmlns:x")).toBe(
      "urn:schemas-microsoft-com:office:excel",
    );
    expect(
      parsed.head
        .querySelector('meta[http-equiv="Content-Type"]')
        ?.getAttribute("content"),
    ).toBe("text/html; charset=utf-8");
    expect(
      parsed.head.querySelector('meta[name="ProgId"]')?.getAttribute("content"),
    ).toBe("Excel.Sheet");
    expect(
      parsed.head
        .querySelector('meta[name="Generator"]')
        ?.getAttribute("content"),
    ).toBe("Microsoft Excel 15");
    expect(parsed.head.querySelector("style")?.textContent).toBe(
      ".cell { color: red; }",
    );
    expect(parsed.querySelector("col")?.getAttribute("width")).toBe("80");
    const cell = parsed.querySelector("td");
    expect(cell?.className).toBe("cell");
    expect(cell?.colSpan).toBe(2);
    expect(cell?.style.fontWeight).toBe("bold");
    expect(cell?.innerHTML).toBe("A &amp; B<br>C");
    expect(parsed.querySelector("img")).toBeNull();
    expect(extractCustomData(result)).toEqual(customData);
  });

  it("preserves line breaks inside copied cells and prevents styles from closing the style element", () => {
    const html = generateHTML(
      'td { font-family: "</style><img src=x>"; }',
      "<tr><td>first\nsecond</td></tr>",
    );
    const template = document.createElement("template");
    template.innerHTML = html;
    expect(template.content.querySelector("td")?.textContent).toBe(
      "first\nsecond",
    );
    expect(template.content.querySelector("img")).toBeNull();
  });
  it("should generate HTML with given style and content", () => {
    const style = "body { background-color: red; }";
    const content = "<tr><td>Test</td></tr>";
    const result = generateHTML(style, content);

    expect(result).toContain("<style>body { background-color: red; }</style>");
    expect(result).toContain(
      "<table><tbody><tr><td>Test</td></tr></tbody></table>",
    );
  });

  it("sanitizes untrusted cell content and custom data", () => {
    const result = generateHTML(
      "",
      '<tr><td onclick="alert(1)">safe<img src=x onerror="alert(1)"></td></tr><script>alert(1)</script>',
      '<caption onmouseover="alert(1)">safe metadata</caption>',
    );
    const template = document.createElement("template");
    template.innerHTML = result;

    expect(template.content.querySelector("td")?.textContent).toBe("safe");
    expect(template.content.querySelector("img, script")).toBeNull();
    expect(
      template.content.querySelector("[onclick], [onerror], [onmouseover]"),
    ).toBeNull();
  });

  it("should include custom data if provided", () => {
    const style = "body { background-color: red; }";
    const content = "<tr><td>Test</td></tr>";
    const customData = JSON.stringify({
      range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: "test" },
      type: "cut",
    });
    const result = generateHTML(style, content, formatCustomData(customData));

    expect(result).toContain(
      '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
    );
  });

  it("should not include custom data if not provided", () => {
    const style = "body { background-color: red; }";
    const content = "<tr><td>Test</td></tr>";
    const result = generateHTML(style, content);

    expect(result).not.toContain("<caption>");
    expect(result).not.toContain("</caption>");
  });

  it("should generate valid HTML structure", () => {
    const style = "body { background-color: red; }";
    const content = "<tr><td>Test</td></tr>";
    const result = generateHTML(style, content);

    expect(result).toContain("<html");
    expect(result).toContain("</html>");
    expect(result).toContain("<head>");
    expect(result).toContain("</head>");
    expect(result).toContain("<body>");
    expect(result).toContain("</body>");
  });
});

describe("extractCustomData", () => {
  it("round-trips metadata containing HTML characters without injecting markup", () => {
    const custom = {
      range: {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: "<img src=x>&",
      },
      type: "copy",
      floatElementUuid: "",
    };
    const html = formatCustomData(JSON.stringify(custom));
    expect(html).not.toContain("<img");
    expect(extractCustomData(html)).toEqual(custom);
  });
  it.each([
    "null",
    "[]",
    "{}",
    '{"type":"copy","range":null}',
    '{"type":"cut","range":{"row":-1,"col":0,"rowCount":1,"colCount":1,"sheetId":"test"}}',
  ])("rejects invalid metadata: %s", (text) => {
    expect(parseCustomData(text)).toBeNull();
  });
  it("should extract custom data from HTML", () => {
    const html =
      '<html><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption></html>';
    const result = extractCustomData(html);
    expect(result).toEqual({
      range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: "test" },
      type: "cut",
    });
  });

  it("extracts metadata from untrusted HTML without preserving executable markup", () => {
    const html =
      '<html><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption><img src=x onerror="alert(1)"><script>alert(1)</script></html>';

    expect(extractCustomData(html)).toEqual({
      range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: "test" },
      type: "cut",
    });
  });

  it("should return null if custom data start flag is missing", () => {
    const html = "<html></caption></html>";
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it("should return null if custom data end flag is missing", () => {
    const html =
      '<html><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it("should return null if custom data flags are not in correct order", () => {
    const html =
      '<html></caption><caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</html>';
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it("should return null if custom data is empty", () => {
    const html = "<html><caption></caption></html>";
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });

  it("should return null if custom data is invalid JSON", () => {
    const html = "<html><caption>invalid json</caption></html>";
    const result = extractCustomData(html);
    expect(result).toBeNull();
  });
});

describe("paste", () => {
  afterEach(() => vi.restoreAllMocks());
  beforeEach(() => {
    // @ts-ignore
    vi.spyOn(global, "Blob").mockImplementation(function (data: string[]) {
      return { text: () => Promise.resolve(data[0]) };
    });
  });

  test.each(["copy", "cut"] as const)(
    "%s falls back to copying the readonly textarea when the async clipboard API is unavailable",
    async () => {
      const clipboard = navigator.clipboard;
      const descriptor = Object.getOwnPropertyDescriptor(
        document,
        "execCommand",
      );
      const execCommand = vi.fn(() => true);
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      try {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: undefined,
        });
        Object.defineProperty(document, "execCommand", {
          configurable: true,
          value: execCommand,
        });
        await copyOrCut({
          [PLAIN_FORMAT]: "fallback content",
          [HTML_FORMAT]: "",
          [CUSTOM_FORMAT]: null,
          [IMAGE_FORMAT]: null,
        });
        expect(execCommand).toHaveBeenCalledWith("copy");
        expect(document.querySelector("textarea")).toBeNull();
      } finally {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: clipboard,
        });
        if (descriptor)
          Object.defineProperty(document, "execCommand", descriptor);
        else Reflect.deleteProperty(document, "execCommand");
        log.mockRestore();
      }
    },
  );
  test.each([false, undefined])(
    "logs unsuccessful fallback copying: %s",
    async (success) => {
      const clipboard = navigator.clipboard;
      const descriptor = Object.getOwnPropertyDescriptor(
        document,
        "execCommand",
      );
      const log = vi.spyOn(console, "log").mockImplementation(() => {});
      try {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: undefined,
        });
        Object.defineProperty(document, "execCommand", {
          configurable: true,
          value: success === undefined ? undefined : vi.fn(() => success),
        });
        await copyOrCut({
          [PLAIN_FORMAT]: "content",
          [HTML_FORMAT]: "",
          [CUSTOM_FORMAT]: null,
          [IMAGE_FORMAT]: null,
        });
        expect(log).toHaveBeenLastCalledWith(
          new Error("Clipboard copying failed"),
        );
        expect(document.querySelector("textarea")).toBeNull();
      } finally {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: clipboard,
        });
        if (descriptor)
          Object.defineProperty(document, "execCommand", descriptor);
        else Reflect.deleteProperty(document, "execCommand");
      }
    },
  );
  test("restores focus and removes the fallback textarea even when execCommand throws", async () => {
    const clipboard = navigator.clipboard;
    const descriptor = Object.getOwnPropertyDescriptor(document, "execCommand");
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: () => {
          throw new Error("denied");
        },
      });
      await copyOrCut({
        [PLAIN_FORMAT]: "content",
        [HTML_FORMAT]: "",
        [CUSTOM_FORMAT]: null,
        [IMAGE_FORMAT]: null,
      });
      expect(document.activeElement).toBe(input);
      expect(document.querySelector("textarea")).toBeNull();
    } finally {
      input.remove();
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: clipboard,
      });
      if (descriptor)
        Object.defineProperty(document, "execCommand", descriptor);
      else Reflect.deleteProperty(document, "execCommand");
      log.mockRestore();
    }
  });
  test("falls back to readText when rich clipboard reading is denied", async () => {
    vi.spyOn(navigator.clipboard, "read").mockRejectedValue(
      new Error("denied"),
    );
    vi.spyOn(navigator.clipboard, "readText").mockResolvedValue(
      "plain fallback",
    );
    vi.spyOn(console, "log").mockImplementation(() => {});
    expect((await paste())[PLAIN_FORMAT]).toBe("plain fallback");
  });
  test.each([HTML_FORMAT, IMAGE_FORMAT])(
    "preserves readable clipboard formats when %s fails",
    async (failedType) => {
      const metadata = {
        range: { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: "test" },
        type: "copy",
      };
      const html = generateHTML(
        "",
        "<tr><td>plain</td></tr>",
        formatCustomData(JSON.stringify(metadata)),
      );
      const image = new Blob(["image"], { type: IMAGE_FORMAT });
      const error = new Error(`Cannot read ${failedType}`);
      const item = new ClipboardItem({
        [PLAIN_FORMAT]: new Blob(["plain"], { type: PLAIN_FORMAT }),
        [HTML_FORMAT]: new Blob([html], { type: HTML_FORMAT }),
        [IMAGE_FORMAT]: image,
      });
      const getType = item.getType.bind(item);
      vi.spyOn(item, "getType").mockImplementation((type) =>
        type === failedType
          ? Promise.reject(error)
          : Promise.resolve(getType(type)),
      );
      vi.spyOn(navigator.clipboard, "read").mockResolvedValue([item]);
      const readText = vi.spyOn(navigator.clipboard, "readText");
      const log = vi.spyOn(console, "log").mockImplementation(() => {});

      expect(await paste()).toEqual({
        [PLAIN_FORMAT]: "plain",
        [HTML_FORMAT]: failedType === HTML_FORMAT ? "" : html,
        [CUSTOM_FORMAT]: failedType === HTML_FORMAT ? null : metadata,
        [IMAGE_FORMAT]: failedType === IMAGE_FORMAT ? null : image,
      });
      expect(log).toHaveBeenCalledWith(error);
      expect(readText).not.toHaveBeenCalled();
    },
  );
  test("keeps reading other formats when plain text is unavailable", async () => {
    const html = "<table><tr><td>rich text</td></tr></table>";
    const item = new ClipboardItem({
      [PLAIN_FORMAT]: new Blob(["plain"], { type: PLAIN_FORMAT }),
      [HTML_FORMAT]: new Blob([html], { type: HTML_FORMAT }),
    });
    const getType = item.getType.bind(item);
    vi.spyOn(item, "getType").mockImplementation((type) =>
      type === PLAIN_FORMAT
        ? Promise.reject(new Error("denied"))
        : Promise.resolve(getType(type)),
    );
    vi.spyOn(navigator.clipboard, "read").mockResolvedValue([item]);
    vi.spyOn(console, "log").mockImplementation(() => {});

    expect((await paste())[HTML_FORMAT]).toBe(html);
  });
  test("falls back to readText when all advertised formats fail", async () => {
    const item = new ClipboardItem({
      [PLAIN_FORMAT]: new Blob(["plain"], { type: PLAIN_FORMAT }),
      [HTML_FORMAT]: new Blob(["html"], { type: HTML_FORMAT }),
    });
    vi.spyOn(item, "getType").mockRejectedValue(new Error("denied"));
    vi.spyOn(navigator.clipboard, "read").mockResolvedValue([item]);
    vi.spyOn(navigator.clipboard, "readText").mockResolvedValue(
      "plain fallback",
    );
    vi.spyOn(console, "log").mockImplementation(() => {});

    expect((await paste())[PLAIN_FORMAT]).toBe("plain fallback");
  });
  test("empty", async () => {
    const result = await paste();
    expect(result).toEqual({
      [PLAIN_FORMAT]: "",
      [HTML_FORMAT]: "",
      [CUSTOM_FORMAT]: null,
      [IMAGE_FORMAT]: null,
    });
  });
  test("extract", async () => {
    await copyOrCut({
      [PLAIN_FORMAT]: "plain",
      [HTML_FORMAT]:
        '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
      [CUSTOM_FORMAT]: null,
      [IMAGE_FORMAT]: null,
    });
    const result = await paste();
    expect(result).toEqual({
      [PLAIN_FORMAT]: "plain",
      [HTML_FORMAT]:
        '<caption>{"range":{"row":1,"col":1,"colCount":1,"rowCount":1,"sheetId":"test"},"type":"cut"}</caption>',
      [CUSTOM_FORMAT]: {
        range: { row: 1, col: 1, colCount: 1, rowCount: 1, sheetId: "test" },
        type: "cut",
      },
      [IMAGE_FORMAT]: null,
    });
  });
});
