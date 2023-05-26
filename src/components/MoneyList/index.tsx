import React from "react";
import MoneyIcon from "../MoneyIcon";
import style from "./index.module.scss";
import { Local } from "@/common";

const MoneyList = (props: { money: number; moneySet: any; moneyList: number[]; lotteryName: string }) => {
  const { money, moneySet, moneyList, lotteryName } = props;
  return (
    <div className={style.list}>
      {moneyList.map((item) => {
        return (
          <MoneyIcon
            number={item}
            key={item}
            className={`${style.moneyIcon} ${money === item ? `${style.active} bottomMoney` : ""}`}
            onClick={() => {
              Local(lotteryName + "money", item);
              moneySet(item);
            }}></MoneyIcon>
        );
      })}
    </div>
  );
};

export default MoneyList;
