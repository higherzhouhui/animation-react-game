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
        return _.head(e) > 5;
      },
      num: "大",
      lname: "race1m",
      type: "GJDXDS",
      type_text: "冠军大小单双",
    },
    {
      name: "",
      odds: 2.12,
      winFn: (e) => {
        let gy = _.dropRight([...e], 8);
        return sumArr(gy) > 11;
      },
      num: "大",
      lname: "race1m",
      type: "GYHDXDS",
      type_text: "冠亚和大小单双",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return _.head(e) < 6;
      },
      num: "小",
      lname: "race1m",
      type: "GJDXDS",
      type_text: "冠军大小单双",
    },
    {
      name: "",
      odds: 1.78,
      winFn: (e) => {
        let gy = _.dropRight([...e], 8);
        return sumArr(gy) < 12;
      },
      num: "小",
      lname: "race1m",
      type: "GYHDXDS",
      type_text: "冠亚和大小单双",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return _.head(e) % 2 === 1;
      },
      num: "单",
      lname: "race1m",
      type: "GJDXDS",
      type_text: "冠军大小单双",
    },
    {
      name: "",
      odds: 1.78,
      winFn: (e) => {
        let gy = _.dropRight([...e], 8);
        return sumArr(gy) % 2 === 1;
      },
      num: "单",
      lname: "race1m",
      type: "GYHDXDS",
      type_text: "冠亚和大小单双",
    },
    {
      name: "",
      odds: 1.97,
      winFn: (e) => {
        return _.head(e) % 2 === 0;
      },
      num: "双",
      lname: "race1m",
      type: "GJDXDS",
      type_text: "冠军大小单双",
    },
    {
      name: "",
      odds: 2.12,
      winFn: (e) => {
        let gy = _.dropRight([...e], 8);
        return sumArr(gy) % 2 === 0;
      },
      num: "双",
      lname: "race1m",
      type: "GYHDXDS",
      type_text: "冠亚和大小单双",
    },
    { name: 1, odds: 9.89, winFn: (e) => _.head(e) == 1, num: "1", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 2, odds: 9.89, winFn: (e) => _.head(e) == 2, num: "2", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 3, odds: 9.89, winFn: (e) => _.head(e) == 3, num: "3", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 4, odds: 9.89, winFn: (e) => _.head(e) == 4, num: "4", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 5, odds: 9.89, winFn: (e) => _.head(e) == 5, num: "5", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 6, odds: 9.89, winFn: (e) => _.head(e) == 6, num: "6", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 7, odds: 9.89, winFn: (e) => _.head(e) == 7, num: "7", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 8, odds: 9.89, winFn: (e) => _.head(e) == 8, num: "8", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 9, odds: 9.89, winFn: (e) => _.head(e) == 9, num: "9", lname: "race1m", type: "GJ", type_text: "猜冠军" },
    { name: 10, odds: 9.89, winFn: (e) => _.head(e) == 10, num: "10", lname: "race1m", type: "GJ", type_text: "猜冠军" },
  ],
};
