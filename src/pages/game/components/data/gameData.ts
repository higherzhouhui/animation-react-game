import i18n from "@/lang/i18n";
import { IGameContent } from "@/model/game";
import _ from "lodash";
// 游戏 番摊

export const gameData: IGameContent[] = [
  {
    value: 15,
    type_show: ["WHITE", "WHITE", "WHITE", "WHITE"],
    type: "FOUR_WHITE",
    typeName: "betOptional",
    typeText: i18n.t("4bai"),
  },
  {
    value: 3.8,
    type_show: ["WHITE", "RED", "WHITE", "WHITE"],
    type: "THREE_WHITE_ONE_RED",
    typeName: "betOptional",
    typeText: i18n.t("3bai1hong"),
  },
  {
    value: 2.5,
    type_show: ["WHITE", "RED", "RED", "WHITE"],
    type: "TWO_RED_TWO_WHITE",
    typeName: "betOptional",
    typeText: i18n.t("2hong2bai"),
  },
  {
    name: i18n.t("xiao"),
    value: 1.96,
    type: "SMALL",
    typeName: "betOptional",
    typeText: i18n.t("xiao"),
  },
  {
    name: i18n.t("da"),
    value: 1.96,
    type: "BIG",
    typeName: "betOptional",
    typeText: i18n.t("da"),
  },
  {
    name: i18n.t("shuang"),
    value: 1.96,
    type: "DOUBLED",
    typeName: "betOptional",
    typeText: i18n.t("shuang"),
  },
  {
    name: i18n.t("dan"),
    value: 1.96,
    type: "SINGLE",
    typeName: "betOptional",
    typeText: i18n.t("dan"),
  },
  {
    value: 15,
    type_show: ["RED", "RED", "RED", "RED"],
    type: "FOUR_RED",
    typeName: "betOptional",
    typeText: i18n.t("4hong"),
  },
  {
    value: 3.8,
    type_show: ["RED", "RED", "RED", "WHITE"],
    type: "THREE_RED_ONE_WHITE",
    typeName: "betOptional",
    typeText: i18n.t("3hong1bai"),
  },
  {
    value: 7.5,
    type_show: ["RED", "RED", "RED", "RED", "WHITE", "WHITE", "WHITE", "WHITE"],
    type: "FOUR_RED_OR_FOUR_WHITE",
    typeName: "betOptional",
    typeText: i18n.t("4hong4bai"),
  },
];

//根据名称获取type
export const getTypeByName = (name: string) => {
  return _.head(gameData.filter((v) => v.type === name))?.type_show || [];
};
