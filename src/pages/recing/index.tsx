import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./style/index.module.scss";
import { gameArray } from "./game";
import { Tabs, Toast } from "antd-mobile";
import "./style/recingLogout.scss";
import { IIssue, ILotteryHistory, initLotteryParams } from "@/model/game";
import { getissue, lotteryBet, backAllGameCoin } from "@/server/game";
import { getLotteryResultHistoryByName } from "@/server/game";
import _ from "lodash";
import { Local, createHash, getParams } from "@/common";
import useAction from "@/state/useAction";
import { useTranslation } from "react-i18next";

const GameBg = React.lazy(() => import("@/components/GameBg"));
const Footer = React.lazy(() => import("@/components/Footer"));
const Header = React.lazy(() => import("@/components/Header"));
const Chip = React.lazy(() => import("@/components/Chip"));
const RecingAni = React.lazy(() => import("./recingAni"));

let expect = "";
const Recing = () => {
  const { t } = useTranslation();
  const {
    state: {
      user: { userInfo },
      chip: { selfChip },
    },
    dispatch,
  } = useAction.useContextReducer();
  let lotteryName = "race1m";
  const tabelRef = "tabelArea";
  const [downTime, downTimeSet] = useState<number>(-1);
  const [money, moneySet] = useState(Local(lotteryName + "money") || 5);
  const moneySelectList = [5, 10, 20, 50, 100, 200, 500];
  const ChipRef = useRef(null) as any;
  const [chipActiveKey, chipActiveKeySet] = useState("0");
  const [showAni, showAniSet] = useState(false);
  const [betAble, betAbleSet] = useState(false); //是否可以下注
  const [lastRecord, lastRecordSet] = useState<ILotteryHistory>({
    expect: "",
    id: 0,
    lotteryName: "",
    lotteryResult: [],
    nickName: "",
  });
  const [showResult, showResultSet] = useState<string[]>([]);

  const init = useCallback(() => {
    getIssue();
  }, []);
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
  useEffect(() => {
    init();
  }, [init]);

  //获取期号
  const getIssue = async (isAni?: boolean) => {
    const setDelay = () => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () => {
            resolve(1);
          },
          isAni ? 3000 : 0
        );
      });
    };

    try {
      const res = await getissue<IIssue>({ name: "race1m" });
      expect = res.expect;
      downTimeSet(res.down_time);
      Promise.all([setDelay()]).then((e) => {
        getLotteryResultHistoryByName<ILotteryHistory[]>().then((last) => {
          const result: ILotteryHistory = _.head(last.filter((item: { lotteryName: string }) => item.lotteryName === lotteryName));
          lastRecordSet(result);
          if (showResult.length === 0) {
            showResultSet(result.lotteryResult);
          } else {
            setTimeout(() => {
              showResultSet(result.lotteryResult);
            }, 6000);
          }
          if (isAni) {
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
          expect: expect,
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
      topHeight={374}
      expect={expect}
      header={
        <Header downTime={downTime} lotteryName={lotteryName} betAble={betAble}>
          <div className={style.prev}>
            {showResult.map((val, key) => (
              <img src={require(`../../assets/image/icon/dice-ball${val}.png`)} alt="" key={key} />
            ))}
          </div>
        </Header>
      }
      footer={<Footer money={money} moneySet={moneySet} moneySelectList={moneySelectList} lotteryName={lotteryName} />}>
      {/* 游戏正体 */}
      <div className={style.gameContent}>
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
                  {val.tabel.map((item, index) => {
                    let self = selfChip.filter((item: any) => {
                      return item.type === tabelRef + key;
                    })[0].list;
                    let selfArr = self.map((a: any) => a.index);
                    return (
                      <div className={`${style.tabelBox} ${tabelRef + key} ${selfArr.includes(index) ? style.active : ""}`} key={index} onClick={() => handleBet(index)}>
                        {val.icon === "dice-ball" ? <div className={`icon-dice-ball${item.name} ${style.iconBall}`}></div> : <div className={`icon-dice-ball${item.name} ${style.text}`}>{item.name}</div>}
                        <div className={style.odds}>{item.odds}</div>
                      </div>
                    );
                  })}
                  {/* 投注盘 */}
                  {chipActiveKey === `${key}` && <Chip key={tabelRef + key} grid={tabelRef + key} offsetTop={100} ref={ChipRef} downTime={downTime} moneySelectList={moneySelectList} type="recing" chipPoint={lastRecord.lotteryResult} gameItem={val} lotteryName={lotteryName} betAble={betAble} betAbleSet={betAbleSet} expect={expect} showAniSet={showAniSet} />}
                </div>
              </Tabs.Tab>
            );
          })}
        </Tabs>
        <div className={style.table}></div>
      </div>
      {showAni && <RecingAni carResult={lastRecord.lotteryResult} />}
    </GameBg>
  );
};

export default Recing;
