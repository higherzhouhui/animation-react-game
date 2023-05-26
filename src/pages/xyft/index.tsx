import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import style from "./index.module.scss";
import LoadingGame from "@/components/LoadingGame";
import _ from "lodash";
import { gameArray } from "./game";
import { Tabs, Toast } from "antd-mobile";
import MoneyList from "@/components/MoneyList";
import Chip from "@/components/Chip";
import { getLotteryResultHistoryByName, getissue, GetCpList, lotteryBet } from "@/server/game";
import { ICpList, IIssue, ILotteryHistory, initLotteryParams } from "@/model/game";
import { Local, createHash } from "@/common";
import useAction from "@/state/useAction";
import { useTranslation } from "react-i18next";
import Rule from "@/components/Rule";
import History from "@/components/History";
import LeftBottom from "../../components/GameLeftBottom/index";
import GameClose from "@/components/GameClose";

const Ball = React.lazy(() => import("@/pages/game/components/ball"));
let lotteryName = "xyft";
const Xyft = () => {
  const {
    state: {
      user: { userInfo },
      chip: { selfChip },
    },
    dispatch,
  } = useAction.useContextReducer();
  const { t } = useTranslation();
  const [money, moneySet] = useState(Local(lotteryName + "money") || 5);
  const moneySelectList = [5, 10, 20, 50, 100, 200, 500];
  const { loading, dom: Load } = LoadingGame(lotteryName, () => {
    init();
  });
  const [tabelGrid, tabelGridSet] = useState({ width: 0, height: 0 });
  const [downTime, downTimeSet] = useState<number>(-1);
  const ChipRef = useRef(null) as any;
  const [showResult, showResultSet] = useState<string[]>([]);
  const [betAble, betAbleSet] = useState(false); //是否可以下注
  const [ruleVisible, ruleVisibleSet] = useState(false); //展示规则
  const [historyVisible, historyVisibleSet] = useState(false); //展示历史记录
  const [gameActiveTab, gameActiveTabSet] = useState(0);
  const [cpList, cpListSet] = useState<ICpList[]>([]);
  const [issueData, issueDataSet] = useState<IIssue>({
    down_time: 0,
    expect: "",
    name: "",
    nickName: "",
    timelong: "",
  });
  const [lastRecord, lastRecordSet] = useState<ILotteryHistory>({
    expect: "",
    id: 0,
    lotteryName: "",
    lotteryResult: [],
    nickName: "",
  });

  const onResize = () => {
    let width = document.getElementById("tabelGrid")?.clientWidth!;
    let height = document.getElementById("tabelGrid")?.clientHeight!;
    tabelGridSet(() => ({
      width,
      height,
    }));
  };

  //倒计时
  useEffect(() => {
    if (downTime > 0 && downTime <= 60) {
      setTimeout(() => {
        downTimeSet(downTime - 1);
      }, 1000);
    } else if (downTime === 0) {
      getIssue(true);
    }
  }, [downTime]);

  const init = useCallback(() => {
    getIssue();
    getGameList();
    setTimeout(() => {
      onResize();
    }, 30);
  }, []);
  useEffect(() => {
    if (!loading) init();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [init, loading]);

  const issueDetail: ICpList = useMemo(() => {
    let [data] = cpList.filter((a) => a.name === lotteryName);
    if (data) return data;
    else return { chinese: "", gameType: 0, icon: "", id: 0, name: "", playMethod: "" };
  }, [cpList]);

  //获取游戏列表
  const getGameList = async () => {
    const res = await GetCpList<ICpList[]>();
    if (!(res instanceof Error)) {
      cpListSet(res);
    }
  };

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
      const res = await getissue<IIssue>({ name: lotteryName });
      downTimeSet(res.down_time);
      issueDataSet(res);
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

  //开始下注
  const handleBet = async (index: number, kk: number) => {
    if (!betAble) return;
    if (Number(userInfo.goldCoin) < money) return Toast.show({ content: t("yu_e_bu_zu"), getContainer: document.getElementById("msgContainer") });
    let hash = createHash(16);
    window.$bus.emit("voice", "goldOut");
    ChipRef.current.addData({
      index,
      money,
      type: "right",
      step: "show",
      hash,
    });
    let { num, lname, type, type_text } = gameArray[kk].tabel[index];
    try {
      const res = await lotteryBet(
        initLotteryParams({
          num,
          uid: userInfo.uid,
          lotteryName,
          lname,
          type,
          type_text,
          money,
          expect: issueData.expect,
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

  return (
    <div id="gameBody" className={style.gameBody}>
      {loading ? (
        Load
      ) : (
        <div className={style.table}>
          {/* 左上角 */}
          <div className={style.leftTop}>
            <div className={style.box}>
              <img src={issueDetail.icon} alt="" />
              <div className={style.text}>{issueDetail.chinese}</div>
            </div>
            <div className={style.box}>
              <div className="icon-peoples peopleHideTopFixed moneyHideTopFixed"></div>
              <div className={style.text}>Người chơi</div>
            </div>
            <div className={style.iconClock} style={{ opacity: betAble ? 1 : 0 }}>
              <div className={`${style.clockAni} icon-clock-big`}></div>
              <div className={style.number}>{downTime > 0 ? downTime : ""}</div>
            </div>
          </div>
          {/* 右上角 */}
          <div className={style.rightTop}>
            <div className={style.result}>
              <div className={`icon-game-podium ${style.leftIcon}`}></div>
              {lastRecord.lotteryResult.map((a: any, b: number) => (
                <img src={require(`@/assets/image/race1m/background/ball${a}.png`)} alt="" key={b} className={style.icon} />
              ))}
            </div>
            <GameClose />
          </div>
          {/* 左边 */}
          <div className={style.leftArea}>
            <div className={style.box} onClick={() => ruleVisibleSet(true)}>
              <div className="icon-rule2"></div>
            </div>
            <div className={style.box} onClick={() => historyVisibleSet(true)}>
              <div className="icon-score2"></div>
            </div>
          </div>
          {/* 左下角 */}
          <LeftBottom />
          {/* 右下角 */}
          <div className={`${style.rightBottom} rightBottom`}>
            <MoneyList money={money} moneySet={moneySet} moneyList={moneySelectList} lotteryName={lotteryName} />
          </div>
          {/* 桌子布局 */}
          <Tabs
            className="xyftTabs"
            activeKey={`${gameActiveTab}`}
            onChange={(e) => {
              if (!betAble) return;
              gameActiveTabSet(Number(e));
            }}>
            {gameArray.map((it, kk) => {
              return (
                <Tabs.Tab title={it.type} key={kk}>
                  {gameActiveTab === kk && (
                    <div className={style.tabelGrid} id="tabelGrid" style={{ width: tabelGrid.width > 0 ? tabelGrid.width : "100%", height: tabelGrid.height > 0 ? tabelGrid.height : "100%" }}>
                      <img
                        src={require(`@/assets/image/xyft/background/game-table${kk > 4 ? 2 : 1}.png`)}
                        alt=""
                        className={style.tableImg}
                        style={{ maxWidth: _.max([document.documentElement.clientWidth, document.documentElement.clientHeight]), maxHeight: _.min([document.documentElement.clientWidth, document.documentElement.clientHeight]) }}
                        onLoad={(e: any) => {
                          setTimeout(() => {
                            tabelGridSet(() => ({
                              width: e.target.width,
                              height: e.target.height,
                            }));
                          }, 100);
                        }}
                      />
                      <div
                        className={`${style.grid} tableGrid ${style["grid" + (kk > 4 ? 2 : 1)]}`}
                        style={{
                          width: `${tabelGrid.width * 0.78}px`,
                          height: `${tabelGrid.height * 0.65}px`,
                          paddingTop: `${tabelGrid.height * 0.14}px`,
                        }}>
                        {it.tabel.map((item, index) => {
                          let s: any[] = _.uniq(selfChip[gameActiveTab].list.map((a: { index: any }) => a.index));
                          return (
                            <div key={index} className={`${style.box} ${s.includes(index) ? style.selected : ""} tabelArea${kk}`} onClick={() => handleBet(index, kk)}>
                              {item.ball && <Ball list={item.ball} className={style.ballGrid} />}
                              <div className={`${style.text} ${!item.ball ? style.odds1 : ""}`}>{item.odds}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* 筹码盘 */}
                  {gameActiveTab === kk && <Chip grid={"tabelArea" + kk} offsetTop={(document.documentElement.clientHeight - tabelGrid.height) / 2} ref={ChipRef} downTime={downTime} moneySelectList={moneySelectList} type={lotteryName} chipPoint={lastRecord.lotteryResult} gameItem={it} lotteryName={lotteryName} betAble={betAble} betAbleSet={betAbleSet} expect={issueData.expect} hasVer />}
                </Tabs.Tab>
              );
            })}
          </Tabs>
          {/* 游戏规则 */}
          <Rule visible={ruleVisible} visibleSet={ruleVisibleSet} lotteryName={lotteryName} cpList={cpList} />
          <History visible={historyVisible} visibleSet={historyVisibleSet} lotteryName={lotteryName} />
        </div>
      )}
    </div>
  );
};

export default Xyft;
