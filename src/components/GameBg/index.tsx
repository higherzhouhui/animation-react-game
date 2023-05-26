import React, { ReactNode, useCallback, useEffect, useState } from "react";
import style from "./index.module.scss";
import { IFollowGame } from "../../model/game";
import { getParams } from "@/common";
import useAction from "@/state/useAction";

type IProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  topHeight?: number;
  lotteryName: string;
  handleFollow: (data: any) => void;
  expect: string;
};

let ready = false;
let hasFollow = false;

const GameBg = (props: IProps) => {
  const { children, header, footer, topHeight, handleFollow, lotteryName, expect } = props;
  const {
    state: {
      user: { userInfo },
      chip: { followAble },
    },
  } = useAction.useContextReducer();

  const [followRank, followRankSet] = useState<any>({});
  const [readyStatus, readyStatusSet] = useState(false);

  const init = useCallback(() => {
    //初始化用户信息
    let device = getParams("device");
    if (device === "android") {
      try {
        (window as any).fbsandroid.onReady("");
        console.log("--------安卓onReady------");
      } catch (err) {
        console.log(err);
        console.log("--------安卓onReady失败------");
      }
    } else if (device === "ios") {
      try {
        (window as any).webkit.messageHandlers.onReady.postMessage("");
        console.log("--------ios-onReady------");
      } catch (err) {
        console.log(err);
        console.log("--------ios-onReady失败------");
      }
    } else {
      console.log("-------onReady--------");
    }
    readyStatusSet(true);
  }, []);

  useEffect(() => {
    if (expect && !ready) {
      ready = true;
      init();
    }
    window.$bus.addListener("ctrl", devicePost);
    return () => {
      window.$bus.removeListener("ctrl", devicePost);
    };
  }, [expect]);

  // 跟投队列
  useEffect(() => {
    if (Object.keys(followRank).length > 0 && userInfo.uid > 0 && followAble && readyStatus) {
      if (hasFollow) return;
      hasFollow = true;
      setTimeout(() => {
        handleFollow(followRank);
      }, 500);
    }
  }, [followRank, userInfo.goldCoin, followAble, readyStatus]);

  const devicePost = (data: IFollowGame) => {
    switch (data.type) {
      case "follow":
        if (data.lotteryName === "race1m" && lotteryName === "race1m") {
          if (["GJ", "GJDXDS", "GYHDXDS"].includes(data.lotteryType)) {
            //冠军单码
            let index = 0;
            //冠军大小单双
            if (data.lotteryType === "GYHDXDS") {
              index = 1;
            }
            //冠亚大小单双
            else if (data.lotteryType === "GJDXDS") {
              index = 2;
            }
            followRankSet({ lotteryType: data.lotteryType, num: data.num, index, money: data.money });
          }
        }
        if (data.lotteryName === "tz" && lotteryName === "tz") {
          if (["HE", "RSZ", "QW", "BZ", "SZ"].includes(data.lotteryType)) {
            let index = 0;
            //冠军大小单双
            if (data.lotteryType === "BZ") {
              index = 1;
            }
            //冠亚大小单双
            else if (data.lotteryType === "SZ") {
              index = 2;
            }
            followRankSet({ lotteryType: data.lotteryType, num: data.num, index, money: data.money });
          }
        }
        break;
    }
  };

  return (
    <div className={style.gameBody}>
      <div className={style.top} style={{ height: `${topHeight || 345}px` }}>
        <div className={style.header}>{header}</div>
        <div className={style.content}>{children}</div>
      </div>
      <div className={style.footer}>{footer}</div>
    </div>
  );
};

export default GameBg;
