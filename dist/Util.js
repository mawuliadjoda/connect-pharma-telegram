"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSession = exports.WebAppDataStep = exports.STEP = exports.convertToFRecimal = void 0;
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
var STEP;
(function (STEP) {
    STEP["INIT"] = "INIT";
    STEP["SHARE_LOCATION"] = "SHARE_LOCATION";
    STEP["SHARE_CONTACT"] = "SHARE_CONTACT";
})(STEP || (exports.STEP = STEP = {}));
var WebAppDataStep;
(function (WebAppDataStep) {
    WebAppDataStep["CREATE_ACOUNT"] = "CREATE_ACOUNT";
    WebAppDataStep["LOGIN"] = "LOGIN";
})(WebAppDataStep || (exports.WebAppDataStep = WebAppDataStep = {}));
const initSession = () => {
    return {
        messageCount: 0,
        choice: '',
        step: STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
};
exports.initSession = initSession;
//# sourceMappingURL=Util.js.map