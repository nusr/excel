import type { ClipboardType } from "@/types";

function select(element: HTMLTextAreaElement) {
  const isReadOnly = element.hasAttribute("readonly");
  if (!isReadOnly) {
    element.setAttribute("readonly", "");
  }
  element.select();
  element.setSelectionRange(0, element.value.length);

  if (!isReadOnly) {
    element.removeAttribute("readonly");
  }
  return element.value;
}

export function isSupported(action = ["copy", "cut"]) {
  const actions = typeof action === "string" ? [action] : action;
  let support = !!document.queryCommandSupported;

  actions.forEach((action) => {
    support = support && !!document.queryCommandSupported(action);
  });

  return support;
}

function createFakeElement(value: string) {
  const isRTL = document.documentElement.getAttribute("dir") === "rtl";
  const fakeElement = document.createElement("textarea");
  // Prevent zooming on iOS
  fakeElement.style.fontSize = "12pt";
  // Reset box model
  fakeElement.style.border = "0";
  fakeElement.style.padding = "0";
  fakeElement.style.margin = "0";
  // Move element out of screen horizontally
  fakeElement.style.position = "absolute";
  fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
  // Move element to the same position vertically
  let yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElement.style.top = `${yPosition}px`;

  fakeElement.setAttribute("readonly", "");
  fakeElement.value = value;

  return fakeElement;
}

function writeDataToClipboard(textData: Record<ClipboardType, string>) {
  const result: Record<string, Blob> = {};
  const keyList = Object.keys(textData) as ClipboardType[];
  for (const key of keyList) {
    result[key] = new Blob([textData[key]], { type: key });
  }
  const data = [new ClipboardItem(result)];
  return navigator.clipboard.write(data);
}

const fakeCopyAction = (
  value: string,
  container: HTMLElement,
  type: "copy" | "cut"
) => {
  const fakeElement = createFakeElement(value);
  container.appendChild(fakeElement);
  const selectedText = select(fakeElement);
  document.execCommand(type);
  fakeElement.remove();

  return selectedText;
};

export async function copy(textData: Record<ClipboardType, string>) {
  try {
    await writeDataToClipboard(textData);
    return textData["text/plain"];
  } catch (error) {
    console.error(error);
    return fakeCopyAction(textData["text/plain"], document.body, "copy");
  }
}

export async function cut(textData: Record<ClipboardType, string>) {
  try {
    await writeDataToClipboard(textData);
    return textData["text/plain"];
  } catch (error) {
    console.error(error);
    return fakeCopyAction(textData["text/plain"], document.body, "cut");
  }
}
export function paste() {
  return navigator.clipboard.readText();
}
