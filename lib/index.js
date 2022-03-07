"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFileToJS = void 0;
var transform = require("@svgr/core").transform;
var fs = require("fs");
var babel = require("@babel/core");
var fileRegex = /\.svg$/;
function defaultTemplate(variables, _a) {
    var tpl = _a.tpl;
    return tpl(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n", ";\n\n", ";\n\nexport const ", " = (", ") => (\n  ", "\n);\n \n"], ["\n", ";\n\n", ";\n\nexport const ", " = (", ") => (\n  ", "\n);\n \n"])), variables.imports, variables.interfaces, variables.componentName, variables.props, variables.jsx);
}
function compileFileToJS(src, id, options) {
    // 读取文件内容
    var buf = fs.readFileSync(id, "utf-8");
    var svgXml = buf.toString();
    var base64 = Buffer.from(svgXml).toString("base64");
    var ops = Object.assign({}, { icon: true, template: defaultTemplate }, options);
    var jsx = transform.sync(svgXml, ops, {
        componentName: "ReactComponent",
        filePath: id,
    });
    var component = "\n    " + jsx + "\n\n    const svg = \"data:image/svg+xml;base64," + base64 + "\";\n\n    export default svg;\n\n    ";
    var result = babel.transformSync(component, {
        babelrc: false,
        ast: true,
        presets: [["@babel/preset-react"]],
        sourceFileName: id,
        configFile: false,
    });
    return result.code;
}
exports.compileFileToJS = compileFileToJS;
function svgPlugin(options) {
    return {
        name: "transform-svg",
        transform: function (src, id) {
            if (fileRegex.test(id)) {
                return {
                    code: compileFileToJS(src, id, options),
                    map: null,
                };
            }
        },
    };
}
exports.default = svgPlugin;
var templateObject_1;
