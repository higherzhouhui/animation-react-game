import _ from "lodash";
import { IGameArrayType } from "@/model/game";

const sumArr = (arr: string[]) => {
  return arr.reduce((sum: number, current: any) => {
    sum += Number(current);
    return sum;
  }, 0);
};

//判断同号
const checkUniq = (arr: string[]) => {
  let uniq = 0;
  arr.reduce((sum: number[], item) => {
    if (sum.includes(Number(item))) uniq = Number(item);
    sum.push(Number(item));
    return sum;
  }, []);
  return uniq;
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
      lname: "jsks",
      type: "1",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) < 11;
      },
      num: "小",
      lname: "jsks",
      type: "1",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) % 2 === 1;
      },
      num: "单",
      lname: "jsks",
      type: "1",
      type_text: "和值",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return sumArr(e) % 2 === 0;
      },
      num: "双",
      lname: "jsks",
      type: "1",
      type_text: "和值",
    },
    {
      name: [1],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(1);
      },
      num: "1",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [2],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(2);
      },
      num: "2",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [3],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(3);
      },
      num: "3",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [4],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(4);
      },
      num: "4",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [5],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(5);
      },
      num: "5",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [6],
      odds: 1.97,
      winFn: (e) => {
        return e.map((a) => Number(a)).includes(6);
      },
      num: "6",
      lname: "jsks",
      type: "7",
      type_text: "三军",
    },
    {
      name: [1, 1],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 1,
      num: "1,1",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
    {
      name: [2, 2],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 2,
      num: "2,2",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
    {
      name: [3, 3],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 3,
      num: "3,3",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
    {
      name: [4, 4],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 4,
      num: "4,4",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
    {
      name: [5, 5],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 5,
      num: "5,5",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
    {
      name: [6, 6],
      odds: 12.8,
      winFn: (e) => checkUniq(e) === 6,
      num: "6,6",
      lname: "jsks",
      type: "6",
      type_text: "二同号复选",
    },
  ],
};
