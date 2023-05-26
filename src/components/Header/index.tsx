import React, { ReactNode } from "react";
import style from "./index.module.scss";
import { getParams } from "@/common";

type IProps = {
  children: ReactNode;
  downTime: number;
  betAble: boolean;
  lotteryName: string;
};
const Header = (props: IProps) => {
  let device = getParams("device");
  const { children, downTime, betAble, lotteryName } = props;

  //展示游戏规则
  const showRule = () => {
    if (device === "android") {
      (window as any).fbsandroid.openRule("");
    } else if (device === "ios") {
      (window as any).webkit.messageHandlers.openRule.postMessage("");
    } else {
      window.parent.postMessage({ type: "openRule" }, "*");
    }
  };

  // 展示游戏开奖记录
  const showRecord = () => {
    console.log("开奖记录");
    if (device === "android") {
      (window as any).fbsandroid.funcShowRecord("");
    } else if (device === "ios") {
      (window as any).webkit.messageHandlers.funcShowRecord.postMessage("");
    } else {
      window.parent.postMessage({ type: "funcShowRecord" }, "*");
    }
  };
  return (
    <div className={style.gameHead}>
      <div className={style.left}>
        <div className={`${style.iconRule} icon-rule moneyHideTopFixed`} onClick={() => showRule()}></div>
        <div className={`${style.iconRule} icon-podium`} onClick={() => showRecord()}></div>
        <div className={`${style.iconRule} icon-people peopleHideTopFixed`}></div>
        <div className={style.iconClock} style={{ opacity: betAble ? 1 : 0 }}>
          <div className={`${style.clockAni} icon-clock`}></div>
          <div className={style.box}>{downTime < 0 ? "" : downTime}</div>
        </div>
      </div>
      <div className={style.right}>
        {/* <div className={`${style.iconPodium} icon-podium`}></div> */}
        {children}
      </div>
    </div>
  );
};

export default Header;
