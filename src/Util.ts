export function convertToFRecimal(value) {
    const valueString = String(value);
    if (!valueString?.includes(".")) return valueString;
    const latTab = valueString?.split(".");
    const decimalPart = latTab ? latTab[0] : 0;
    const floatingPart = latTab ? latTab[1] : 0;
    return `${decimalPart},${floatingPart}`;
}
