import { initUser, Local, mTime, getParams } from "@/common";
import { IBtiParams, IGameContent, IGameFollow } from "@/model/game";
import { getBalance, userBet, backAllGameCoin } from "@/server/game";
import { Button, Input, Popover, Popup, Toast } from "antd-mobile";
import React, { Dispatch, SetStateAction, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gameData } from "./data/gameData";
import style from "./style/footer.module.scss";
type IProps = {
  gameIndex: number[];
  delSelect: (num: number) => void;
  refs: any;
  downTime: number;
  gameIndexSet: Dispatch<SetStateAction<number[]>>;
  isFollowSet: Dispatch<SetStateAction<boolean>>;
  isFollow: boolean;
  issue: string;
};
let times: any;
const BetFooter = (props: IProps, ref: any) => {
  const { gameIndex, delSelect, refs, downTime, gameIndexSet, isFollow, isFollowSet, issue } = props;
  const { t } = useTranslation();

  let [selectMoney, setSelectMoney] = useState(Local("xdMoney") || 5);
  let [btiPerIndex, setBtiPerIndex] = useState(0);
  let [showMoneyList, setShowMoneyList] = useState(false);
  let [showCheckBti, setShowCheckBti] = useState(false);
  let [moneyListIndex, setMoneyListIndex] = useState(0);
  let [setMonetValue, hdsetMonetValue] = useState<string>("");
  let [followType, followTypeSet] = useState(""); //是否设置为跟投状态
  const [balance, balanceSet] = useState<number>(0);

  useImperativeHandle(ref, () => {
    return {
      //抛出关闭金额弹窗事件
      closeMoneyList: (e: boolean) => {
        setShowMoneyList(e);
      },
    };
  });

  let [moneyList, setMonetList] = useState([5, 10, 20, 50, 100, 200, 500, 0]);
  let btiPer = [1, 2, 5, 10, 20]; //投注倍率

  const init = useCallback(() => {
    getInitData();
  }, []);

  useEffect(() => {
    init();
    // getInitDataLx()
    window.$bus.addListener("ctrl", devicePost);

    window.$bus.addListener("moneys", getInitDataLx);
    return () => {
      window.$bus.removeListener("ctrl", devicePost);

      window.$bus.removeListener("moneys", getInitDataLx);

      clearTimeout(times);
    };
  }, [init]);

  //与app进行通讯
  const devicePost = (data: IGameFollow) => {
    console.log("通讯成功");
    switch (data.type) {
      //跟投
      case "follow":
        followTypeSet("follow");
        let indexArray = JSON.parse(data.gameList as unknown as string).map((val: string) => {
          let index = gameData.findIndex((v) => v.type === val);
          return index;
        });
        let bp = btiPer.findIndex((v) => v === data.times);
        gameIndexSet(indexArray);
        setSelectMoney(data.money % 5 === 0 ? data.money : 5);
        setBtiPerIndex(bp < 0 ? 0 : bp);
        setShowCheckBti(true);
        isFollowSet(true);
        break;
      //获取余额
      case "getBalance":
        getInitData();
        break;
    }
  };

  const getInitDataLx = () => {
    initUser().then((userId: any) => {
      getBalance<number>({ userId }).then((res) => {
        console.log("获取当前余额轮询", res);
        balanceSet(res);
        // 余额小于1键回收
        // if (res <= 1) getBackAllGameCoin()
      });
    });
  };

  const getInitData = () => {
    // 获取用户余额
    initUser().then((userId: any) => {
      getBalance<number>({ userId }).then((res) => {
        console.log("获取当前余额", res);
        balanceSet(res);
        // 余额小于1键回收
        if (res <= 1) getBackAllGameCoin();
      });
    });
  };

  // 一件回收
  const getBackAllGameCoin = () => {
    backAllGameCoin<number>({
      uid: Local("userId"),
    }).then((res) => {
      // 余额回收完自动再次刷新
      getBalance<number>({ userId: Local("userId") }).then((res1) => {
        balanceSet(res1);
      });
    });
  };
  //去投注，弹出投注框
  const toBti = () => {
    if (selectGameList.length === 0) return Toast.show(t("leastOne"));
    setShowCheckBti(true);
  };
  //选择金额
  const handleSelectMoney = (index: number) => {
    setMoneyListIndex(index);
    setSelectMoney(Number(moneyList[index]));
    Local("xdMoney", Number(moneyList[index]));
    setShowMoneyList(false);
  };
  // 提交投注信息
  const confirmBti = async () => {
    if (moneyTotal > balance) {
      let device = getParams("device");
      if (device === "android") {
        (window as any).fbsandroid.leadRecharge("");
      } else if (device === "ios") {
        (window as any).webkit.messageHandlers.leadRecharge.postMessage("");
      } else {
        window.parent.postMessage({ type: "leadRecharge" }, "*");
      }
      return false;
      // return Toast.show(t("yu_e_bu_zu"));
    }
    let params: IBtiParams = {
      userId: Local("userId"),
      userBetList: [],
      spData: { liveId: Local("liveId"), times: btiPer[btiPerIndex] },
    };
    selectGameList.map((item) => {
      params.userBetList.push({
        betMoney: selectMoney * btiPer[btiPerIndex],
        betOptional: item.type,
      });
    });
    const res = await userBet(params);
    if (!(res instanceof Error)) {
      getInitData();
      Toast.show(t("betSuccess"));
      setShowCheckBti(false);
      gameIndexSet([]);
    }
  };

  const changeMoneyInput = () => {
    if (Number(setMonetValue) % 5 > 0) return Toast.show(t("enterFivePer"));
    if (!setMonetValue) return Toast.show(t("ui_enter_amount"));
    setShowMoneyList(false);
    setSelectMoney(Number(setMonetValue));
    moneyList[7] = Number(setMonetValue);
    setMonetList(moneyList);
    setMoneyListIndex(7);
  };

  // 选择的游戏
  const selectGameList = useMemo(() => {
    let array: IGameContent[] = [];
    gameIndex.map((item) => {
      let ar = gameData.filter((_val, key) => {
        return key === item;
      });
      array.push(...ar);
    });
    if (array.length === 0) setShowCheckBti(false);
    return array;
  }, [gameIndex]);

  //计算总金额
  const moneyTotal = useMemo(() => {
    return selectGameList.reduce((sum: number) => {
      sum += selectMoney * btiPer[btiPerIndex];
      return sum;
    }, 0);
  }, [selectGameList, btiPerIndex, selectMoney]);

  return (
    <>
      <div className={`${style.btiFooter} ${style.disFlexb}`}>
        <div className={`${style.left} ${style.disFlex}`}>
          <div className={style.money}>
            <img src={require("@/assets/image/icon-gold.png")} className={style.iconGold} />
            {balance}
          </div>
          <Button
            onClick={() => {
              let device = getParams("device");
              if (device === "android") {
                (window as any).fbsandroid.funcRecharge("");
              } else if (device === "ios") {
                (window as any).webkit.messageHandlers.funcRecharge.postMessage("");
              } else {
                window.parent.postMessage({ type: "jumpCharge" }, "*");
              }
            }}
            className={style.chargeBtn}>
            {t("ui_dep")}
          </Button>
        </div>
        <div className={`${style.right} ${style.disFlex}`}>
          <div className={style.cm}>
            <Popover
              content={
                <div className={style.moneySelectBody}>
                  <div className={style.moneyList}>
                    {moneyList.map((num, index) => {
                      if (index < 7) {
                        return (
                          <div className={`${style.moneybox} ${moneyListIndex === index ? style.active : ""}`} onClick={() => handleSelectMoney(index)} key={`cm${index}`}>
                            {num}
                          </div>
                        );
                      } else {
                        return (
                          <Input
                            value={setMonetValue}
                            onChange={hdsetMonetValue}
                            className={style.moneyInput}
                            type="number"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") changeMoneyInput();
                            }}
                            onBlur={() => changeMoneyInput()}
                            style={{ "--color": "#494949", "--text-align": "center" }}
                            key={`cm${index}`}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              }
              trigger="click"
              placement="top"
              visible={showMoneyList}
              className="tmPopover"
              getContainer={document.getElementById("popoverBody")}>
              <div className={style.disFlex} onClick={() => setShowMoneyList(!showMoneyList)}>
                {selectMoney}
                <img src={require("@/assets/image/jiantou-shang.png")} className={`${style.jiantou} ${showMoneyList ? style.trans : ""}`} />
              </div>
            </Popover>
          </div>
          <Button
            className={style.btiBtn}
            onClick={() => {
              setShowMoneyList(false);
              toBti();
            }}>
            {" "}
            {t("bet")}{" "}
          </Button>
        </div>
      </div>

      {/* 投注确认弹框 */}
      <Popup visible={showCheckBti} onMaskClick={() => setShowCheckBti(false)} bodyClassName={style.windowBottom} className="betWindow" getContainer={refs.current} mask={false}>
        <div className={style.checkBtiForm}>
          <div
            className={style.closeIcon}
            onClick={() => {
              if (followType === "follow") {
                let device = getParams("device");
                if (device === "android") {
                  (window as any).fbsandroid.onClose("");
                } else if (device === "ios") {
                  (window as any).webkit.messageHandlers.onClose.postMessage("");
                } else {
                  setShowCheckBti(false);
                }
              } else setShowCheckBti(false);
            }}>
            <img src={require("../../../assets/image/ic_close.png")} alt="" />
          </div>
          <div className={style.title}>{t("bet")}</div>
          <div className={style.info}>
            {t("you_xi_mc")} {issue} {t("fengpan")} {mTime(downTime)}
          </div>
          <div className={style.overBti}>
            {selectGameList.map((item, index) => (
              <div className={style.box} key={`od${index}`}>
                <div className={`${style.big} ${style.red}`}>
                  <span>{item.typeText}</span>
                </div>
                <div className={style.closeImg} onClick={() => delSelect(gameIndex[index])}>
                  <img src={require("@/assets/image/ic_close.png")} />
                </div>
                <div className={style.lit}>
                  {t("you_xi_mc")} 1x{btiPer[btiPerIndex]}
                </div>
                <div className={`${style.big} ${style.red}`}>
                  {selectMoney}X{btiPer[btiPerIndex]}
                </div>
              </div>
            ))}
          </div>
          {/* 倍率 */}
          <div className={style.btiPer}>
            {btiPer.map((num, index) => (
              <div className={`${style.box} ${btiPerIndex === index ? style.active : ""}`} key={`bp${num}`} onClick={() => setBtiPerIndex(index)}>
                X{num}
              </div>
            ))}
          </div>
          <div className={style.disFlexb}>
            <div className={style.disFlex}>
              {t("num")}:<span className={style.red}>{selectGameList.length}</span>
            </div>
            <div className={style.disFlex}>
              {t("total")}:<span className={style.red}>{moneyTotal}</span>
            </div>
          </div>
          <div className={style.disFlexb}>
            <div className={style.lit}>
              {t("balance")}:<span className={style.red}>{balance}</span>
            </div>
            <Button className={style.btiBtn} onClick={() => confirmBti()} loading="auto">
              {t("bet")}
            </Button>
          </div>
        </div>
      </Popup>
      <div
        id="popoverBody"
        style={{ pointerEvents: showMoneyList ? "unset" : "none" }}
        onClick={() => {
          setShowMoneyList(false);
        }}></div>
    </>
  );
};

export default forwardRef(BetFooter);
