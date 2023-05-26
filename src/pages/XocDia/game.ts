import _ from "lodash";
import { IGameArrayType } from "@/model/game";

export const gameArray: IGameArrayType = {
  type: "XocDia",
  layout: 5,
  tabel: [
    {
      name: 1,
      odds: 1.97,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length > 2;
      },
      num: "1",
      lname: "XocDia",
      type: "BIG",
      type_text: "猜冠军",
    },
    {
      name: 2,
      odds: 1.97,
      winFn: (e) => {
        return e.filter((a) => a === "WHITE").length > 2;
      },
      num: "2",
      lname: "XocDia",
      type: "SMALL",
      type_text: "猜冠军",
    },
    {
      name: 3,
      odds: 1.97,
      winFn: (e) => {
        return e.filter((a) => a === "WHITE").length % 2 === 1;
      },
      num: "3",
      lname: "XocDia",
      type: "SINGLE",
      type_text: "猜冠军",
    },
    {
      name: 4,
      odds: 1.97,
      winFn: (e) => {
        return e.filter((a) => a === "WHITE").length % 2 === 0;
      },
      num: "4",
      lname: "XocDia",
      type: "DOUBLED",
      type_text: "猜冠军",
    },
    {
      name: 5,
      odds: 15,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length === 4;
      },
      num: "5",
      lname: "XocDia",
      type: "FOUR_RED",
      type_text: "猜冠军",
      ball: ["RED", "RED", "RED", "RED"],
    },
    {
      name: 6,
      odds: 15,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length === 0;
      },
      num: "6",
      lname: "XocDia",
      type: "FOUR_WHITE",
      type_text: "猜冠军",
      ball: ["WHITE", "WHITE", "WHITE", "WHITE"],
    },
    {
      name: 7,
      odds: 3.8,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length === 1;
      },
      num: "7",
      lname: "XocDia",
      type: "THREE_WHITE_ONE_RED",
      type_text: "猜冠军",
      ball: ["WHITE", "RED", "WHITE", "WHITE"],
    },
    {
      name: 8,
      odds: 3.8,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length === 3;
      },
      num: "8",
      lname: "XocDia",
      type: "THREE_RED_ONE_WHITE",
      type_text: "猜冠军",
      ball: ["RED", "RED", "RED", "WHITE"],
    },
    {
      name: 9,
      odds: 2.5,
      winFn: (e) => {
        return e.filter((a) => a === "RED").length === 2;
      },
      num: "8",
      lname: "XocDia",
      type: "TWO_RED_TWO_WHITE",
      type_text: "猜冠军",
      ball: ["WHITE", "RED", "RED", "WHITE"],
    },
    {
      name: 10,
      odds: 7.5,
      winFn: (e) => {
        return _.uniq(e).length === 1;
      },
      num: "8",
      lname: "XocDia",
      type: "FOUR_RED_OR_FOUR_WHITE",
      type_text: "猜冠军",
      ball: ["RED", "RED", "RED", "RED", "WHITE", "WHITE", "WHITE", "WHITE"],
    },
  ],
};
