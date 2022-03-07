const transform = require("@svgr/core").transform;
const fs = require("fs");
const babel = require("@babel/core");
const fileRegex = /\.svg$/;

function defaultTemplate(variables, { tpl }) {
  return tpl`
${variables.imports};

${variables.interfaces};

export const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
 
`;
}

export function compileFileToJS(src, id, options) {
  // 读取文件内容
  const buf = fs.readFileSync(id, "utf-8");
  const svgXml = buf.toString();
  const base64 = Buffer.from(svgXml).toString("base64");
  const ops = Object.assign(
    {},
    { icon: true, template: defaultTemplate },
    options
  );
  const jsx = transform.sync(svgXml, ops, {
    componentName: "ReactComponent",
    filePath: id,
  });
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
    name: "transform-svg",
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
