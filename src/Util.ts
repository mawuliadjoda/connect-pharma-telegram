export function convertToFRecimal(value) {
    const valueString = String(value);
    if (!valueString?.includes(".")) return valueString;
    const latTab = valueString?.split(".");
    const decimalPart = latTab ? latTab[0] : 0;
    const floatingPart = latTab ? latTab[1] : 0;
    return `${decimalPart},${floatingPart}`;
}


export type WebAppData = {
    message: string,
    email: string,
    tel: string,
    hasEmail?: boolean,
    frontendUrl?: string,
    step: WebAppDataStep
}

export enum WebAppDataStep {
    CREATE_ACOUNT = 'CREATE_ACOUNT',
    LOGIN = 'LOGIN',
}
