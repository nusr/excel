import JSZip from "jszip";

import { parseXMLToJSON } from "./parseXML";

export async function readXLSXfile(
  file: Blob
): Promise<Record<string, string>> {
  const zip = await JSZip.loadAsync(file);
  const files: string[] = [];
  zip.forEach((_, zipEntry) => {
    if (!zipEntry.dir) {
      files.push(zipEntry.name);
    }
  });
  const entries: Record<string, string> = {};
  const list = await Promise.all(
    files.map((file) => {
      return zip.file(file)?.async("string") || "";
    })
  );
  list.reduce((sum, cur, i) => {
    if (cur) {
      sum[files[i]] = cur;
    }
    return sum;
  }, entries);
  // console.log(entries);
  console.dir(parseXMLToJSON(entries['docProps/core.xml']));
  return entries;
}
