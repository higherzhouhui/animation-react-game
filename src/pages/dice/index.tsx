import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./index.module.scss";
import { gameArray } from "./game";
import { initLotteryParams, ILotteryHistory } from "@/model/game";
import { getLotteryResultHistoryByName, getissue, lotteryBet, backAllGameCoin } from "@/server/game";
import { IIssue } from "../../model/game";
import { Tabs } from "antd-mobile";
import _ from "lodash";
import "./recingLogout.scss";
import { Local, createHash, getParams } from "@/common";
import useAction from "@/state/useAction";
import { useTranslation } from "react-i18next";

const GameBg = React.lazy(() => import("@/components/GameBg"));
const Footer = React.lazy(() => import("@/components/Footer"));
const Header = React.lazy(() => import("@/components/Header"));
const DiceIcon = React.lazy(() => import("@/components/DiceIcon"));
const Chip = React.lazy(() => import("@/components/Chip"));

let expect = "";
const Dice = () => {
  const { t } = useTranslation();
  const {
    state: {
      user: { userInfo },
      chip: { selfChip },
    },
    dispatch,
  } = useAction.useContextReducer();

  let lotteryName = "tz";
  const [downTime, downTimeSet] = useState<number>(-1);
  const tabelRef = "tabelArea";
  const ChipRef = useRef(null) as any;
  const [money, moneySet] = useState(Local(lotteryName + "money") || 5);
  const moneySelectList = [5, 10, 20, 50, 100, 200, 500];
  const [chipActiveKey, chipActiveKeySet] = useState("0");
  const [betAble, betAbleSet] = useState(false); //是否可以下注
  const [lastRecord, lastRecordSet] = useState<ILotteryHistory>({
    expect: "",
    id: 0,
    lotteryName: "",
    lotteryResult: [],
    nickName: "",
  });
  const [showResult, showResultSet] = useState<string[]>([]);

  // 一件回收
  const getBackAllGameCoin = () => {
    backAllGameCoin<number>({
      uid: userInfo.uid,
    }).then((res) => {
      console.log("一键回收", userInfo, res);
      // 余额回收完自动再次刷新
      setTimeout(() => {
        dispatch({ type: "user/freshUserInfo", payload: { type: "SetFollowAble" } });
      }, 700);
    });
  };
  useEffect(() => {
    console.log("--------------money", userInfo);
    if (userInfo.uid != 0 && userInfo.goldCoin <= 1) {
      getBackAllGameCoin();
    } else if (userInfo.uid != 0) {
      setTimeout(() => {
        dispatch({ type: "chip/SetFollowAble", payload: true });
      }, 1000);
    }
  }, [userInfo.uid]);

  const init = useCallback(() => {
    getIssue();
  }, []);
  useEffect(() => {
    init();
  }, [init]);
  //获取期号
  const getIssue = async (isFinish?: boolean) => {
    const setDelay = () => {
      return new Promise((resolve) => {
        setTimeout(
          () => {
            resolve(1);
          },
          isFinish ? 3000 : 0
        );
      });
    };
    try {
      const res = await getissue<IIssue>({ name: lotteryName });
      expect = res.expect;
      downTimeSet(res.down_time);
      Promise.all([setDelay()]).then(() => {
        getLotteryResultHistoryByName<ILotteryHistory[]>().then((last) => {
          const result: ILotteryHistory = _.head(last.filter((item: { lotteryName: string }) => item.lotteryName === lotteryName));
          lastRecordSet(result);
          if (showResult.length === 0) {
            showResultSet(result.lotteryResult);
          } else {
            setTimeout(() => {
              showResultSet(result.lotteryResult);
            }, 4000);
          }
          if (isFinish) {
            // ChipRef.current.handleStartAni();
            // dispatch({ type: "user/freshUserInfo" });
          } else {
            ChipRef.current.startGame();
            betAbleSet(() => true);
            if (res.down_time > 56) {
              ChipRef.current.clearCoin();
            }
          }
        });
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (downTime > 0 && downTime <= 60) {
      setTimeout(() => {
        downTimeSet(downTime - 1);
      }, 1000);
    } else if (downTime === 0) {
      getIssue(true);
    }
  }, [downTime]);

  //开始下注
  const handleBet = async (index: number, key: string = chipActiveKey, followMoney?: any, follow?: boolean) => {
    let my = followMoney || money;
    if (!(betAble || follow)) return;
    if (Number(userInfo.goldCoin) < my) {
      let device = getParams("device");
      if (device === "android") {
        (window as any).fbsandroid.leadRecharge("");
      } else if (device === "ios") {
        (window as any).webkit.messageHandlers.leadRecharge.postMessage("");
      } else {
        window.parent.postMessage({ type: "leadRecharge" }, "*");
      }
      return false;
    }
    let hash = createHash(16);
    window.$bus.emit("voice", "goldOut");
    ChipRef.current.addData({
      index,
      money: my,
      type: "right",
      step: "show",
      hash,
    });
    let { num, lname, type, type_text } = gameArray[Number(key)].tabel[index];
    try {
      const res = await lotteryBet(
        initLotteryParams({
          num,
          uid: userInfo.uid,
          lotteryName,
          lname,
          type,
          type_text,
          money: my,
          liveId: Local("liveId"),
          expect,
        })
      );
      if (!(res instanceof Error)) {
        dispatch({ type: "user/freshUserInfo" });
      } else {
        ChipRef.current.delData({ hash });
      }
    } catch (error) {
      ChipRef.current.delData({ hash });
    }
  };

  //跟投
  const handleFollow = (data: any) => {
    let key = gameArray[data.index].tabel.findIndex((a) => a.num == data.num);
    chipActiveKeySet(() => `${data.index}`);
    moneySet(() => data.money);
    setTimeout(() => {
      handleBet(key, data.index, data.money, true);
    }, 1000);
  };
  return (
    <GameBg
      handleFollow={handleFollow}
      lotteryName={lotteryName}
      expect={expect}
      header={
        <Header downTime={downTime} betAble={betAble} lotteryName={lotteryName}>
          <div className={style.prev}>
            {showResult.map((val, key) => (
              <DiceIcon number={val} key={key} />
            ))}
          </div>
        </Header>
      }
      footer={<Footer money={money} moneySet={moneySet} moneySelectList={moneySelectList} lotteryName={lotteryName} />}>
      {/* 游戏正体 */}
      <div className={`${style.gameContent} gameContentBody`}>
        <Tabs
          className="recingTab"
          activeKey={chipActiveKey}
          onChange={(e) => {
            if (betAble) {
              chipActiveKeySet(e);
            }
          }}>
          {gameArray.map((val, key) => {
            return (
              <Tabs.Tab title={val.type} key={key}>
                <div className={style.tabel} style={{ gridTemplateColumns: `repeat(${val.layout},1fr)` }}>
                  {/* 数据遍历渲染 */}
                  {val.tabel.map((item, index) => {
                    let self = selfChip.filter((item: any) => {
                      return item.type === tabelRef + key;
                    })[0].list;
                    let selfArr = self.map((a: any) => a.index);

                    return (
                      <div className={`${style.tabelBox} ${tabelRef + key} ${selfArr.includes(index) ? style.active : ""}`} key={index} onClick={() => handleBet(index)}>
                        {val.icon === "icon" ? (
                          <div className={style.clipBox}>
                            {(item.name as number[]).map((v, k) => {
                              return <div className={`icon-icon-dice${v} ${style.iconBall}`} key={k}></div>;
                            })}
                          </div>
                        ) : (
                          <div className={`icon-dice-ball${item.name} ${style.text}`}>{item.name}</div>
                        )}
                        <div className={style.odds}>{item.odds}</div>
                      </div>
                    );
                  })}
                  {/* 投注盘 */}
                  {chipActiveKey === `${key}` && <Chip key={tabelRef + key} grid={tabelRef + key} offsetTop={100} ref={ChipRef} downTime={downTime} moneySelectList={moneySelectList} type="dice" chipPoint={lastRecord.lotteryResult} gameItem={val} lotteryName={lotteryName} betAble={betAble} betAbleSet={betAbleSet} expect={expect} />}
                </div>
              </Tabs.Tab>
            );
          })}
        </Tabs>
      </div>
    </GameBg>
  );
};

export default Dice;
