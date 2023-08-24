export function convertToFRecimal(value) {
    const valueString = String(value);
    if (!valueString?.includes(".")) return valueString;
    const latTab = valueString?.split(".");
    const decimalPart = latTab ? latTab[0] : 0;
    const floatingPart = latTab ? latTab[1] : 0;
    return `${decimalPart},${floatingPart}`;
}

export enum STEP {
    INIT = 'INIT',
    SHARE_LOCATION = 'SHARE_LOCATION',
    SHARE_CONTACT = 'SHARE_CONTACT',
}

export interface SessionData {
    messageCount: number;
    choice: string;
    step: STEP,
    data: {
        latitude: string,
        longitude: string,
        contact: string
    }
    // ... more session data go here
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


export const initSession = () => {
    return {
        messageCount: 0,
        choice: '',
        step: STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
}