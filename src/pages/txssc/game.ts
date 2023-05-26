import _ from "lodash";
import { IGameArrayType } from "@/model/game";
import i18n from "@/lang/i18n";

export const gameArray: IGameArrayType = {
  type: "XocDia",
  layout: 5,
  tabel: [
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.last(e) > 4,
      num: "0|大",
      lname: i18n.t("da"),
      type: "7.1",
      type_text: "个位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.last(e) < 5,
      num: "0|小",
      lname: i18n.t("xiao"),
      type: "7.1",
      type_text: "个位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.last(e) % 2 == 1,
      num: "0|单",
      lname: i18n.t("dan"),
      type: "7.1",
      type_text: "个位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.last(e) % 2 == 0,
      num: "0|双",
      lname: i18n.t("shuang"),
      type: "7.1",
      type_text: "个位",
    },
    {
      name: "txssc",
      odds: 1.99,
      winFn: (e) => e[0] > e[1],
      num: "龙",
      lname: i18n.t("long"),
      type: "9.1",
      type_text: "龙虎万千",
    },
    {
      name: "txssc",
      odds: 1.99,
      winFn: (e) => e[1] > e[0],
      num: "虎",
      lname: i18n.t("hu"),
      type: "9.1",
      type_text: "龙虎万千",
    },
    {
      name: "txssc",
      odds: 10.18,
      winFn: (e) => e[0] == e[1],
      num: "和",
      lname: i18n.t("he"),
      type: "9.1",
      type_text: "龙虎万千",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.nth(e, -2) > 4,
      num: "大|0",
      lname: i18n.t("da"),
      type: "7.1",
      type_text: "十位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.nth(e, -2) < 5,
      num: "小|0",
      lname: i18n.t("xiao"),
      type: "7.1",
      type_text: "十位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.nth(e, -2) % 2 == 1,
      num: "单|0",
      lname: i18n.t("dan"),
      type: "7.1",
      type_text: "十位",
    },
    {
      name: "txssc",
      odds: 1.97,
      winFn: (e) => _.nth(e, -2) % 2 == 0,
      num: "双|0",
      lname: i18n.t("shuang"),
      type: "7.1",
      type_text: "十位",
    },
  ],
};
