import _ from "lodash";
import { IGameArrayType } from "@/model/game";
import i18n from "@/lang/i18n";

export const gameArray: IGameArrayType = {
  type: "yflhc",
  layout: 5,
  tabel: [
    {
      name: i18n.t("hong"),
      odds: 2.82,
      winFn: (e) => _.nth(e, 7) == "1",
      num: "红",
      lname: "yflhc",
      type: "TMSB",
      type_text: "特码色波",
    },
    {
      name: i18n.t("lv"),
      odds: 2.97,
      winFn: (e) => _.nth(e, 7) == "2",
      num: "绿",
      lname: "yflhc",
      type: "TMSB",
      type_text: "特码色波",
    },
    {
      name: i18n.t("lan"),
      odds: 2.97,
      winFn: (e) => _.nth(e, 7) == "3",
      num: "蓝",
      lname: "yflhc",
      type: "TMSB",
      type_text: "特码色波",
    },
    {
      name: i18n.t("da"),
      odds: 1.97,
      winFn: (e) => _.nth(e, 6) > 25,
      num: "大",
      lname: "yflhc",
      type: "TMLM",
      type_text: "特码两面",
    },
    {
      name: i18n.t("xiao"),
      odds: 1.97,
      winFn: (e) => _.nth(e, 6) < 25,
      num: "小",
      lname: "yflhc",
      type: "TMLM",
      type_text: "特码两面",
    },
    {
      name: i18n.t("dan"),
      odds: 1.97,
      winFn: (e) => _.nth(e, 6) % 2 === 1,
      num: "单",
      lname: "yflhc",
      type: "TMLM",
      type_text: "特码两面",
    },
    {
      name: i18n.t("shuang"),
      odds: 1.97,
      winFn: (e) => _.nth(e, 6) % 2 === 0,
      num: "双",
      lname: "yflhc",
      type: "TMLM",
      type_text: "特码两面",
    },
  ],
};
