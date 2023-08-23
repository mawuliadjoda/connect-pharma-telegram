"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAppDataStep = exports.convertToFRecimal = void 0;
function convertToFRecimal(value) {
    const valueString = String(value);
    if (!(valueString === null || valueString === void 0 ? void 0 : valueString.includes(".")))
        return valueString;
    const latTab = valueString === null || valueString === void 0 ? void 0 : valueString.split(".");
    const decimalPart = latTab ? latTab[0] : 0;
    const floatingPart = latTab ? latTab[1] : 0;
    return `${decimalPart},${floatingPart}`;
}
exports.convertToFRecimal = convertToFRecimal;
var WebAppDataStep;
(function (WebAppDataStep) {
    WebAppDataStep["CREATE_ACOUNT"] = "CREATE_ACOUNT";
    WebAppDataStep["LOGIN"] = "LOGIN";
})(WebAppDataStep || (exports.WebAppDataStep = WebAppDataStep = {}));
//# sourceMappingURL=Util.js.map