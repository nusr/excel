/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const url = require("url");
const path = require("path");
const http = require("http");
const zlib = require("zlib");
const childProcess = require("child_process");
const updateMd = require("../scripts/update-md");
const buildLog = (message, other = "") => {
  console.log(`build: ${message}, ${other}`);
};
function getMimeType(ext) {
  const types = {
    "application/javascript": ["js", "mjs"],
    "application/json": ["json", "map"],
    "text/css": ["css"],
    "text/csv": ["csv"],
    "text/html": ["html", "htm", "shtml"],
    "text/markdown": ["markdown", "md"],
    "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"],
  };

  const mimes = Object.entries(types).reduce(
    (all, [type, exts]) =>
      Object.assign(all, ...exts.map((ext) => ({ [ext]: type }))),
    {}
  );
  return mimes[ext] || "application/octet-stream";
}

function openBrowser(url) {
  let cmd;
  const args = [];
  if (process.platform === "darwin") {
    try {
      childProcess.execSync(
        `osascript openChrome.applescript "${encodeURI(url)}"`,
        {
          cwd: __dirname,
          stdio: "ignore",
        }
      );
      return true;
    } catch (error) {
      console.log(error);
    }
    cmd = "open";
  } else if (process.platform === "win32") {
    cmd = "cmd.exe";
    args.push("/c", "start", '""', "/b");
    url = url.replace(/&/g, "^&");
  } else {
    cmd = "xdg-open";
  }
  args.push(url);
  childProcess.spawn(cmd, args);
}

function staticService({
  root = "dist",
  startPage = "index.html",
  port = 9999,
} = {}) {
  buildLog("staticService start");
  const rootPath = path.join(process.cwd(), root);
  const utf8 = (file) => Buffer.from(file, "binary").toString("utf8");

  const sendError = (res, status) => {
    res.writeHead(status);
    res.write(`${status}`);
    res.end();
  };

  const sendFile = (res, status, file, ext, encoding = "binary") => {
    if (["js", "css", "html", "json", "xml", "svg"].includes(ext)) {
      res.setHeader("content-encoding", "gzip");
      file = zlib.gzipSync(utf8(file));
      encoding = "utf8";
    }
    res.writeHead(status, { "content-type": getMimeType(ext) });
    res.write(file, encoding);
    res.end();
  };

  const renderStaticFile = (res, pathname) => {
    const uri = path.join(rootPath, pathname);
    const basename = pathname.split("/").pop();
    const ext = basename.split('.').pop();
    if (!fs.existsSync(uri)) {
      return sendError(res, 404);
    }
    fs.readFile(uri, "binary", (error, file) => {
      if (error) {
        return sendError(res, 500);
      }
      return sendFile(res, 200, file, ext);
    });
  };

  const renderHtml = (res, pathname) => {
    const index = path.join(rootPath, startPage);
    fs.readFile(index, "binary", (error, file) => {
      if (error) {
        return sendError(error, 500);
      }
      const status = pathname === "/" ? 301 : 200;
      return sendFile(res, status, file, "html");
    });
  };
  const handleFormula = (res, data) => {
    const result = url.parse(data, true);
    const formulas = JSON.parse(result.query.data);
    updateMd.handleFormula(formulas);
    res.writeHead(200);
    res.end();
  };
  buildLog("createServer");
  const server = http.createServer((req, res) => {
    const result = url.parse(req.url, true);
    const pathname = decodeURI(result.pathname);
    res.setHeader("access-control-allow-origin", "*");
    const basename = pathname.split("/").pop();
    if (basename.indexOf(".") < 0) {
      if (pathname.startsWith("/formula")) {
        return handleFormula(res, req.url);
      } else {
        return renderHtml(res, pathname);
      }
    } else {
      return renderStaticFile(res, pathname);
    }
  });
  server.listen(port);
  const openUrl = `http://localhost:${port}`;
  buildLog(openUrl);
  return openUrl;
}

module.exports = {
  staticService,
  openBrowser,
  buildLog,
};
