import i18n from "i18next";
import zh from "./zh.json";
import vie from "./vie.json";
import {
    initReactI18next
} from 'react-i18next';
import { getParams, Local } from "../common";

i18n.use(initReactI18next).init({
    resources: {
        CN: {
            translation: zh,
        },
        YN: {
            translation: vie,
        },
        JP: {
            translation: vie,
        },
    },
    //默认语言
    lng: getParams('lang') || Local('lang') || "YN",
    interpolation: {
        escapeValue: false,
    },
})

export default i18n