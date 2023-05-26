import _ from "lodash";
import { IGameArrayType } from "@/model/game";

const sumArr = (arr: string[]) => {
  return arr.reduce((sum: number, current: any) => {
    sum += Number(current);
    return sum;
  }, 0);
};

export const gameArray: IGameArrayType = {
  type: "XocDia",
  layout: 5,
  tabel: [
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) > 10;
      },
      num: "大",
      lname: "tz",
      type: "HE",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) % 2 === 1;
      },
      num: "单",
      lname: "tz",
      type: "HE",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) < 11;
      },
      num: "小",
      lname: "tz",
      type: "HE",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) % 2 === 0;
      },
      num: "双",
      lname: "tz",
      type: "HE",
      type_text: "和值",
    },
    {
      name: [1, 1, 1],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 1;
      },
      num: "1",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },
    {
      name: [2, 2, 2],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 2;
      },
      num: "2",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },

    {
      name: [3, 3, 3],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 3;
      },
      num: "3",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },

    {
      name: [4, 4, 4],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 4;
      },
      num: "4",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },
    {
      name: [5, 5, 5],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 5;
      },
      num: "5",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },
    {
      name: [6, 6, 6],
      odds: 180,
      winFn: (e) => {
        return _.uniq(e).join(",") == 6;
      },
      num: "6",
      lname: "豹子",
      type: "BZ",
      type_text: "豹子",
    },
    {
      name: "",
      odds: 29,
      winFn: (e) => _.uniq(e).length == 1,
      num: "QW",
      lname: "全围",
      type: "QW",
      type_text: "全围",
    },
    {
      name: "",
      odds: 29,
      winFn: (e) => {
        let arr = _.orderBy(e);
        return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2;
      },
      num: "RSZ",
      lname: "RSZ",
      type: "RSZ",
      type_text: "任意顺子",
    },
    {
      name: [1, 2, 3],
      odds: 180,
      winFn: (e) => {
        let arr = _.orderBy(e);
        return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 1;
      },
      num: "1,2,3",
      lname: "SZ",
      type: "SZ",
      type_text: "顺子",
    },
    {
      name: [2, 3, 4],
      odds: 180,
      winFn: (e) => {
        let arr = _.orderBy(e);
        return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 2;
      },
      num: "2,3,4",
      lname: "SZ",
      type: "SZ",
      type_text: "顺子",
    },
    {
      name: [3, 4, 5],
      odds: 180,
      winFn: (e) => {
        let arr = _.orderBy(e);
        return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 3;
      },
      num: "3,4,5",
      lname: "SZ",
      type: "SZ",
      type_text: "顺子",
    },
    {
      name: [4, 5, 6],
      odds: 180,
      winFn: (e) => {
        let arr = _.orderBy(e);
        return arr[0] / 2 + arr[2] / 2 == arr[1] && _.uniq(arr).length === 3 && arr[2] - arr[0] === 2 && arr[0] == 4;
      },
      num: "4,5,6",
      lname: "SZ",
      type: "SZ",
      type_text: "顺子",
    },
  ],
};
