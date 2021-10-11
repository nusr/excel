interface IJSONObject {
  name: string;
  attributes: Record<string, string>;
  children: IJSONObject[];
  value: string;
}

function getData(list: NodeListOf<ChildNode>, parent: IJSONObject) {
  if (!list) {
    return [];
  }
  for (const item of list) {
    const data: IJSONObject = {
      name: item.nodeName,
      value: item.nodeType === 3 ? item.nodeValue || "" : "",
      children: [],
      attributes: {},
    };
    // for (const v of Object.keys(item.attributes)) {
    // data.attributes[v] = item.attributes[v];
    // }
    getData(item.childNodes, data);
    parent.children.push(data);
  }
}
export function parseXMLToJSON(content: string): IJSONObject {
  const xml = new DOMParser().parseFromString(content.trim(), "text/xml");
  console.dir(xml);
  const root: IJSONObject = {
    children: [],
    name: "xml",
    value: "",
    attributes: {},
  };
  getData(xml.childNodes, root);
  console.log(root);
  return root;
}
