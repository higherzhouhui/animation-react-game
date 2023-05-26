import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { gameData } from "./components/data/gameData";
import { getLastOpenRecord, getOpenCountdown } from "@/server/game";
import _ from "lodash";
import { ILastHistory } from "@/model/game";
import { getParams } from "@/common";

const BetHead = React.lazy(() => import("./components/betHead"));
const BetFooter = React.lazy(() => import("./components/footer"));
const Ball = React.lazy(() => import("./components/ball"));

let timeout: NodeJS.Timeout | undefined;

const Game = () => {
  const [gameIndex, gameIndexSet] = useState<number[]>([]); //选中游戏序号
  const [downTime, downTimeSet] = useState<number>(0);
  const [lastHis, lastHisSet] = useState<number[] | string[]>([]);
  const [isFollow, isFollowSet] = useState<boolean>(false); //表示跟投模式
  const [issue, issueSet] = useState<string>("");

  const parentRef = useRef(null);
  const footerRef = useRef<any>(null);
  const init = useCallback(() => {
    //初始化用户信息
    getGameDetail();
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
  }, []);

  useEffect(() => {
    init();
    document.body.setAttribute("style", "background:#4e4e4e");
    return () => {
      document.body.setAttribute("style", "background:unset");
    };
  }, [init]);
  /**
   * 初始化游戏数据
   */
  const getGameDetail = (delay?: boolean) => {
    // 获取封盘倒计时
    getOpenCountdown<{
      openCountdown: number;
      openNumber: string;
    }>().then((res) => {
      console.log("res倒计时", res);
      handleDownTime(res.openCountdown > 0 ? res.openCountdown : 60);
      issueSet(res.openNumber);
    });
    setTimeout(
      () => {
        //获取上次已开盘记录
        getLastOpenRecord<ILastHistory>().then((res) => {
          lastHisSet(res.openResult);
          window.$bus.emit("moneys"); //余额刷新
        });
      },
      delay ? 5000 : 0
    );
  };

  /**
   * 倒计时事件
   * @param
   */
  const handleDownTime = (time: number) => {
    downTimeSet(time);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      let t = time - 1;
      if (t < 0) {
        downTimeSet(0);
        getGameDetail(true);
      } else {
        downTimeSet(t);
        handleDownTime(t);
      }
    }, 1000);
  };

  //选择游戏
  const handleSelect = (index: number) => {
    footerRef.current.closeMoneyList(false);

    let arr = [...gameIndex];
    if (arr.includes(index)) {
      _.pull(arr, index);
    } else {
      arr.push(index);
    }
    gameIndexSet(arr.sort((a, b) => a - b));
  };
  // 去除以选中游戏
  const delSelect = (index: number) => {
    let arr = [...gameIndex];
    _.pull(arr, index);
    gameIndexSet(arr);
  };

  return (
    <>
      {/* 番摊6 */}
      <div className={style.liveRoomPopup} ref={parentRef}>
        <BetHead downTime={downTime}>
          <Ball list={lastHis} />
        </BetHead>
        <div className={style.gameContent}>
          {gameData.map((item, index) => {
            return (
              <div key={item.type} className={`${style.typeBox} ${gameIndex.includes(index) ? style.active : ""}`} data-layout={item.type_show?.length} onClick={() => handleSelect(index)}>
                {!!item.type_show && <Ball list={item.type_show} />}
                {item.name && <div className={style.itemName}>{item.name}</div>}
                <div className={style.value}>{item.value}</div>
              </div>
            );
          })}
        </div>
        <BetFooter gameIndex={gameIndex} delSelect={delSelect} refs={parentRef} downTime={downTime} gameIndexSet={gameIndexSet} isFollowSet={isFollowSet} isFollow={isFollow} issue={issue} ref={footerRef} />
      </div>
    </>
  );
};

export default Game;
