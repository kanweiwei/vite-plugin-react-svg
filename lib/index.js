"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@svgr/core");
var fs = require('fs');
var babel = require('@babel/core');
var fileRegex = /\.svg$/;
function defaultTemplate(_a, opts, _b) {
    var template = _a.template;
    var imports = _b.imports, interfaces = _b.interfaces, componentName = _b.componentName, props = _b.props, jsx = _b.jsx, exports = _b.exports;
    var plugins = ['jsx'];
    if (opts.typescript) {
        plugins.push('typescript');
    }
    var typeScriptTpl = template.smart({ plugins: plugins });
    return typeScriptTpl.ast(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    ", "\n\n    export function ", "(", ") {\n      return (\n        ", "\n      );\n    }\n  "], ["\n    ", "\n\n    ", "\n\n    export function ", "(", ") {\n      return (\n        ", "\n      );\n    }\n  "])), imports, interfaces, componentName, props, jsx);
}
function compileFileToJS(src, id) {
    // 读取文件内容
    var buf = fs.readFileSync(id, 'utf-8');
    var svgXml = buf.toString();
    var base64 = new Buffer(svgXml).toString('base64');
    var jsx = core_1.default.sync(svgXml, { icon: true, template: defaultTemplate }, { componentName: 'ReactComponent' });
    var component = "\n    " + jsx + "\n\n    const svg = \"data:image/svg+xml;base64," + base64 + "\";\n\n    export default svg;\n\n    ";
    var result = babel.transformSync(component, {
        babelrc: false,
        ast: true,
        presets: [['@babel/preset-react']],
        sourceFileName: id,
        configFile: false,
    });
    return result.code;
}
function svgPlugin() {
    return {
        nane: 'transfrom-svg',
        transform: function (src, id) {
            if (fileRegex.test(id)) {
                return {
                    code: compileFileToJS(src, id),
                    map: null,
                };
            }
        },
    };
}
exports.default = svgPlugin;
var templateObject_1;