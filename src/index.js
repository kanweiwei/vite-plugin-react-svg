import svgr from "@svgr/core";

import fs from "fs";
import babel from "@babel/core";
const fileRegex = /\.svg$/;

function defaultTemplate(
  { template },
  opts,
  { imports, interfaces, componentName, props, jsx, exports }
) {
  const plugins = ["jsx"];
  if (opts.typescript) {
    plugins.push("typescript");
  }
  const typeScriptTpl = template.smart({ plugins });
  return typeScriptTpl.ast`
    ${imports}

    ${interfaces}

    export function ${componentName}(${props}) {
      return (
        ${jsx}
      );
    }
  `;
}

function compileFileToJS(src, id, options) {
  // 读取文件内容
  const buf = fs.readFileSync(id, "utf-8");
  const svgXml = buf.toString();
  const base64 = new Buffer(svgXml).toString("base64");
  const ops = Object.assign({},{ icon: true, template: defaultTemplate }, options);
  const jsx = svgr.sync(
    svgXml,
    ops,
    { componentName: "ReactComponent" }
  );
  const component = `
    ${jsx}

    const svg = "data:image/svg+xml;base64,${base64}";

    export default svg;

    `;
  const result = babel.transformSync(component, {
    babelrc: false,
    ast: true,
    presets: [["@babel/preset-react"]],
    sourceFileName: id,
    configFile: false,
  });
  return result.code;
}

export default function svgPlugin(options) {
  return {
    nane: "transfrom-svg",
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src, id, options),
          map: null,
        };
      }
    },
  };
}
