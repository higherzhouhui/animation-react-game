import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import style from "./waybill.module.scss";
import _ from "lodash";
import { GetAskWay, GetCpList, GetPer, GetWayBill, getissue } from "@/server/game";
import { useCopy } from "@/common/copy";
import { getParams } from "@/common";
import { useTranslation } from "react-i18next";
import { Modal } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { IList, setDataList } from "./data";
import { getFinger } from "@/util/finger";
import { GetGoodWay } from "../../server/game";
import { IGoodWayList, IIssue } from "@/model/game";

type IPerData = {
  result1Rate: string;
  result2Rate: string;
  totalResult1: number;
  totalResult2: number;
};

const WayBill = () => {
  const history = useNavigate();
  const copy = useCopy();
  const { t } = useTranslation();

  const [queryType, queryTypeSet] = useState(1); // 1:大小，2:单双
  //四种路列表
  const [list, listSet] = useState<IList[]>([]);
  const [goodWay, goodWaySet] = useState<IGoodWayList[]>([]);
  const [cplist, cplistSet] = useState<any>([]);
  const [cplistActive, cplistActiveSet] = useState(0);
  const [askWay, askWaySet] = useState<IList[]>([]);
  const [issue, issueSet] = useState<IIssue>({
    down_time: 0,
    expect: "",
    name: "",
    nickName: "",
    timelong: "",
  });
  // 控制游戏列表弹窗
  const [showOptions, setShowOptions] = useState(false);
  // 当前期号与上一级结果
  const issueInfo = useMemo(() => {
    if (list.length > 0) {
      let last = _.last(list.filter((a) => a.ludanType === 1));
      return {
        issue: last.issue,
        result: JSON.parse(last.resultReward),
      };
    } else {
      return {
        issue: "",
        result: [],
      };
    }
  }, [list]);

  // 进度条百分比
  const [percentage, percentageSet] = useState<IPerData>({
    result1Rate: "50%",
    result2Rate: "50%",
    totalResult1: 50,
    totalResult2: 50,
  });
  // 路子图与好路tab切换
  const [currentTab, setCurrentTab] = useState("luzitu");
  // 倒计时
  const [downTime, setDownTime] = useState(0);
  // 将数值转为时间格式
  const numberToOlock = (time: number) => {
    if (time < 5) {
      return t("fengpan");
    }
    let minute: any = Math.floor(time / 60);
    let second: any = time - minute * 60;
    if (second < 10) {
      second = "0" + second;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    return `${minute}:${second}`;
  };
  const countTime = useRef<any>();
  // 问路预判
  const [predictType, predictTypeSet] = useState(0); //0未选中，1小/单，2大/双

  const getData = async () => {
    let params = { type: cplist[cplistActive].name, queryType };
    let query = getParams();
    const res = await GetWayBill<IList[]>(Object.assign(params, query));
    if (!(res instanceof Error)) {
      listSet(res);
      setTimeout(() => {
        for (let item of document.getElementsByClassName("scrollRight")) {
          item.scrollTo(99999, 0);
        }
      }, 100);
    }
  };
  const list1 = useMemo(() => {
    return setDataList([...list, ...askWay].filter((a) => a.ludanType === 1));
  }, [list, askWay]);
  const list2 = useMemo(() => {
    return setDataList([...list, ...askWay].filter((a) => a.ludanType === 2));
  }, [list, askWay]);
  const list3 = useMemo(() => {
    return setDataList([...list, ...askWay].filter((a) => a.ludanType === 3));
  }, [list, askWay]);
  const list4 = useMemo(() => {
    return setDataList([...list, ...askWay].filter((a) => a.ludanType === 4));
  }, [list, askWay]);
  const [playOptions, setPlayOptions] = useState([
    { label: t("冠亚和"), key: "gyh" },
    { label: t("冠军两面"), key: "gjlm" },
  ]);
  const currentGame = useMemo(() => {
    if (cplist.length > 0) {
      return cplist[cplistActive];
    } else return {};
  }, [cplist, cplistActive]);
  // 返回时间
  const handleBack = () => {
    let { device } = getParams();
    if (device === "android") {
      (window as any).fbsandroid.closeBrowser();
    } else if (device === "ios") {
      (window as any).webkit.messageHandlers.closeBrowser.postMessage("");
    } else {
      history(-1);
    }
  };
  const handleHiddenOption = () => {
    setShowOptions(false);
  };
  const handlePredict = async (type: number) => {
    if (type === predictType) {
      predictTypeSet(0);
      askWaySet([]);
    } else {
      predictTypeSet(type);
      const res = await GetAskWay<IList[]>({ type: issue.name, issue: `${Number(issue.expect) - 1}`, queryType, resultType: type });
      askWaySet(res);
    }
  };
  const handleShowHint = () => {
    Modal.show({
      content: (
        <div className="hintContainer">
          <div className="hintTitle">{t("问路说明")}</div>
          <div className="desc">{t("模拟下一期开奖后路子图的绘制情况")}</div>
          <div className="desc">{t("如")}:</div>
          <div className="result">
            <div className="top">
              {t("下期")}
              <span>{t("大")}</span>
            </div>
            <div className="bot">
              <div className="hollow" />
              <div className="solid" />
              <div className="line" />
            </div>
          </div>
          <div className="desc">{t("表示下一期如果开大,则")}</div>
          <div className="desc">
            {t("大眼路为")}
            <div className="hollow" />,
          </div>
          <div className="desc">
            {t("小路为")}
            <div className="solid" />,
          </div>
          <div className="desc">
            {t("小强路为")}
            <div className="line" />.
          </div>
        </div>
      ),
      closeOnMaskClick: true,
      showCloseButton: true,
    });
  };

  useEffect(() => {
    getFinger().then(() => {
      if (cplist.length > 0) {
        getData();
        getIssue();
        getPerData();
      }
    });
  }, [queryType, cplist, cplistActive]);

  // 获取游戏列表
  const getCpList = async () => {
    const res = await GetCpList<any>();
    let cl = res.filter((a: { ludanUrl: any }) => a.ludanUrl);
    cplistSet(cl);
    let type = getParams("type");
    if (type) {
      let index = cl.findIndex((a: { name: any }) => a.name === type);
      if (index >= 0) cplistActiveSet(index);
    }
  };

  // 获取好路
  const getGoodWay = async () => {
    const res = await GetGoodWay<IGoodWayList[]>({
      type: issue.name,
      issue: `${Number(issue.expect) - 1}`,
      language: "YN",
    });
    goodWaySet(res);

    setTimeout(() => {
      for (let item of document.getElementsByClassName("scrollRight")) {
        item.scrollTo(99999, 0);
      }
    }, 100);
  };

  // 获取期号
  const getIssue = async () => {
    const res = await getissue<IIssue>({ name: cplist[cplistActive].name });
    issueSet(res);
  };

  //获取百分比
  const getPerData = async () => {
    const res = await GetPer<IPerData>({ type: cplist[cplistActive].name, queryType });
    if (!(res instanceof Error)) {
      percentageSet(res);
    }
  };

  const onLoad = useCallback(() => {
    getCpList();
  }, []);

  useEffect(() => {
    getFinger().then(() => {
      onLoad();
    });
  }, [onLoad]);

  useEffect(() => {
    // 监听当前选中的游戏的变化
    countTime.current = issue.down_time;
    const timer = setInterval(() => {
      countTime.current -= 1;
      setDownTime(countTime.current);
      if (countTime.current === 0) {
        countTime.current = Number(issue.timelong) * 60;
        getData();
        getIssue();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentGame, issue]);

  return (
    <div className={style.container}>
      {showOptions ? <div className={style.wholeScreen} onClick={() => handleHiddenOption()} /> : null}
      <div className={style.top}>
        <div className={style.title}>
          <div className={style.left}>
            <img src={require("@/assets/image/waybill/back.png")} alt="back" className={style.backBtn} onClick={() => handleBack()} />
            <div className={style.currentGame} onClick={() => setShowOptions(!showOptions)}>
              <img src={currentGame.icon} className={style.logo} />
              <span>{currentGame.chinese}</span>
              <img src={require("@/assets/image/waybill/arrow.png")} className={style.arrow} />
              {showOptions ? (
                <div className={style.optionWrapper}>
                  {cplist.map((item: any, index: number) => {
                    return (
                      <div className={style.optionList} key={index} onClick={(e) => cplistActiveSet(index)}>
                        <img src={item.icon} alt="logo" className={style.logo} />
                        <div>{item.chinese}</div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className={style.right}>
            <div className={style.desc}>
              <p className={style.first}>{t("投注中")}</p>
              <p className={style.sub}>
                {issue.expect}
                {t("期")}
              </p>
            </div>
            <div className={style.countTimeWrapper}>{numberToOlock(downTime)}</div>
          </div>
        </div>
        <div className={style.result}>
          {issue.expect && (
            <div className={style.myTitle}>
              {Number(issue.expect) - 1}
              {t("期")}
            </div>
          )}
          <div className={style.allNumber}>
            {issueInfo.result.map((item: any, index: number) => {
              const addZere = (e: number) => {
                return e > 9 ? e : "0" + e;
              };
              return (
                <div className={`${style.color} color${addZere(item)}`} key={index}>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={style.tabs}>
        <div className={`${style.tab} ${currentTab === "luzitu" ? style.activeTab : ""}`} onClick={() => setCurrentTab("luzitu")}>
          {t("路子图")}
        </div>
        <div
          className={`${style.tab} ${currentTab === "haolu" ? style.activeTab : ""}`}
          onClick={() => {
            setCurrentTab("haolu");
            getGoodWay();
          }}>
          {t("好路")}
        </div>
      </div>
      {currentTab === "luzitu" ? (
        <div className={style.content}>
          <div className={style.fliterComponent}>
            <div className={style.selections}>
              <select>
                {playOptions.map((item, index) => {
                  return <option key={item.key} label={item.label}></option>;
                })}
              </select>
            </div>

            <div className={style.playTabs}>
              <div
                className={`${style.playTab} ${queryType === 1 ? style.playTabActive : ""}`}
                onClick={() => {
                  queryTypeSet(1);
                }}>
                {t("大小")}
              </div>
              <div
                className={`${style.playTab} ${queryType === 2 ? style.playTabActive : ""}`}
                onClick={() => {
                  queryTypeSet(2);
                }}>
                {t("单双")}
              </div>
            </div>
          </div>
          <div className={style.wrapper}>
            <div className={`${style.wayBody} scrollRight`}>
              {list1.map((item: any[], index: number) => {
                return (
                  <div key={index} className={style.grid}>
                    {item.map((val: any, key: any) => (
                      <div className={`${style.box} ${style[val?.value]}`} key={`${index}-${key}`} onClick={() => copy(val?.issue)}>
                        <div className={style.issue}>{val?.issue}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.majorContainer}>
            <div className={style.leftSide}>
              <div className={style.wrapper}>
                <div className={`${style.majorResult} scrollRight`}>
                  {list2.map((item: any[], index: number) => {
                    return (
                      <div key={index} className={style.grid}>
                        {item.map((val: any, key: any) => (
                          <div className={`${style.box} ${style[val?.value]}`} key={`${index}-${key}`} onClick={() => copy(val?.issue)}>
                            <div className={style.issue}>{val?.issue}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={style.wrapper}>
                <div className={`${style.majorResultCircle} scrollRight`}>
                  {list3.map((item: any[], index: number) => {
                    return (
                      <div key={index} className={style.grid}>
                        {item.map((val: any, key: any) => (
                          <div className={`${style.box} ${style[val?.value]}`} key={`${index}-${key}`} onClick={() => copy(val?.issue)}>
                            <div className={style.issue}>{val?.issue}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={style.wrapper}>
                <div className={`${style.majorResultLine} scrollRight`}>
                  {list4.map((item: any[], index: number) => {
                    return (
                      <div key={index} className={style.grid}>
                        {item.map((val: any, key: any) => (
                          <div className={`${style.box} ${style[val?.value]}`} key={`${index}-${key}`} onClick={() => copy(val?.issue)}>
                            <div className={style.issue}>{val?.issue}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={style.rightSide}>
              <div className={style.qtitle}>
                {t("问路")}
                <span
                  className={style.qwh}
                  onClick={() => {
                    handleShowHint();
                  }}>
                  ?
                </span>
              </div>
              <div
                className={`${style.chooseIssue} ${predictType === 2 ? style.chooseActive : ""}`}
                onClick={() => {
                  handlePredict(2);
                }}>
                <div className={style.qtop}>
                  {t("下期")}
                  <span> {t("大")}</span>
                </div>
                <div className={style.qbot}>
                  <div className={style.hollow} />
                  <div className={style.solid} />
                  <div className={style.line} />
                </div>
              </div>
              <div
                className={`${style.chooseIssue} ${predictType === 1 ? style.chooseActive : ""}`}
                onClick={() => {
                  handlePredict(1);
                }}>
                <div className={style.qtop}>
                  {t("下期")}
                  <span> {t("小")}</span>
                </div>
                <div className={style.qbot}>
                  <div className={`${style.hollow} ${style.hotherColor}`} />
                  <div className={`${style.solid} ${style.otherColor}`} />
                  <div className={`${style.line} ${style.otherColor}`} />
                </div>
              </div>
              <div className={style.proportion}>
                <div className={style.proTitle}>
                  <span className={style.proLeft}>{t("大")}</span>
                  <span className={style.proRight}>{t("小")}</span>
                </div>
                <div className={style.proTitle}>
                  <span>{percentage.result1Rate}</span>
                  <span>{percentage.result2Rate}</span>
                </div>
                <div className={style.progress}>
                  <div className={style.big} style={{ width: percentage.result1Rate }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.placeBet}>{t("投注")}</div>
        </div>
      ) : (
        <div className={style.content}>
          {goodWay.map((item: any, index) => {
            let arr = setDataList(item.queryGameRecordVOS.map((a: any) => ({ pointString: `${a.x},${a.y}`, issue: a.issue, resultType: a.curResultOpen })));
            return (
              <div className={style.wrapper} key={index}>
                <div className={style.wtitle}>
                  <div className={style.wleft}>{item.ludanTypeName}</div>
                  <div className={style.wright}>
                    {t("持续")}
                    <span>{15}</span>
                    {t("期")}
                  </div>
                </div>
                <div className={style.wdesc}>{item.queryTypeName}</div>
                <div className={`${style.wayBody} scrollRight`}>
                  {arr.map((item: any[], index: number) => {
                    return (
                      <div key={index} className={style.grid}>
                        {item.map((val: any, key: any) => (
                          <div className={`${style.box} ${style[val?.value]}`} key={`${index}-${key}`} onClick={() => copy(val?.issue)}>
                            <div className={style.issue}>{val?.issue}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WayBill;
