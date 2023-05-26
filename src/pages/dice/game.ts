import _ from "lodash";
import i18n from "@/lang/i18n";
import { IGameArrayType } from "@/model/game";

const sumArr = (arr: string[]) => {
  return arr.reduce((sum: number, current: any) => {
    sum += Number(current);
    return sum;
  }, 0);
};

export const gameArray: IGameArrayType[] = [
  {
    type: i18n.t("tou_bao"),
    layout: 3,
    tabel: [
      {
        name: i18n.t("da"),
        num: "大",
        lname: "tz",
        type: "HE",
        type_text: "和值",
        odds: 1.97,
        winFn: (e) => {
          return sumArr(e) > 10;
        },
      },
      {
        name: i18n.t("shun_zi"),
        num: "RSZ",
        lname: "RSZ",
        type: "RSZ",
        type_text: "任意顺子",
        odds: 7.5,
        winFn: (e) => {
          let arr = _.orderBy(e);
          return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2;
        },
      },
      {
        name: i18n.t("xiao"),
        num: "小",
        lname: "tz",
        type: "HE",
        type_text: "和值",
        odds: 1.97,
        winFn: (e) => {
          return sumArr(e) < 11;
        },
      },
      {
        name: i18n.t("dan"),
        num: "单",
        lname: "tz",
        type: "HE",
        type_text: "和值",
        odds: 1.97,
        winFn: (e) => {
          return sumArr(e) % 2 === 1;
        },
      },
      {
        name: i18n.t("bao_zi"),
        num: "QW",
        lname: "全围",
        type: "QW",
        type_text: "全围",
        odds: 30,
        winFn: (e) => {
          return _.uniq(e).length === 1;
        },
      },
      {
        name: i18n.t("shuang"),
        num: "双",
        lname: "tz",
        type: "HE",
        type_text: "和值",
        odds: 1.97,
        winFn: (e) => {
          return sumArr(e) % 2 === 0;
        },
      },
    ],
  },
  {
    type: i18n.t("bao_zi"),
    icon: "icon",
    layout: 3,
    tabel: [
      {
        name: [1, 1, 1],
        num: "1",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 1;
        },
      },
      {
        name: [2, 2, 2],
        num: "2",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 2;
        },
      },
      {
        name: [3, 3, 3],
        num: "3",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 3;
        },
      },
      {
        name: [4, 4, 4],
        num: "4",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 4;
        },
      },
      {
        name: [5, 5, 5],
        num: "5",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 5;
        },
      },
      {
        name: [6, 6, 6],
        num: "6",
        lname: "豹子",
        type: "BZ",
        type_text: "豹子",
        odds: 180,
        winFn: (e) => {
          return sumArr(_.uniq(e)) === 6;
        },
      },
    ],
  },
  {
    type: i18n.t("shun_zi"),
    icon: "icon",
    layout: 2,
    tabel: [
      {
        name: [1, 2, 3],
        num: "1,2,3",
        lname: "SZ",
        type: "SZ",
        type_text: "顺子",
        odds: 30,
        winFn: (e) => {
          let arr = _.orderBy(e);
          return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 1;
        },
      },
      {
        name: [2, 3, 4],
        num: "2,3,4",
        lname: "SZ",
        type: "SZ",
        type_text: "顺子",
        odds: 30,
        winFn: (e) => {
          let arr = _.orderBy(e);
          return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 2;
        },
      },
      {
        name: [3, 4, 5],
        num: "3,4,5",
        lname: "SZ",
        type: "SZ",
        type_text: "顺子",
        odds: 30,
        winFn: (e) => {
          let arr = _.orderBy(e);
          return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 3;
        },
      },
      {
        name: [4, 5, 6],
        num: "4,5,6",
        lname: "SZ",
        type: "SZ",
        type_text: "顺子",
        odds: 30,
        winFn: (e) => {
          let arr = _.orderBy(e);
          return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 4;
        },
      },
    ],
  },
];
