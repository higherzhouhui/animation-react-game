import React, { Suspense, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { randNumber } from "../../common/index";
import style from "./common.module.scss";
import useAction from "@/state/useAction";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const Money = React.lazy(() => import("./money"));
const boxAniList = ["dice", "jsks", "xocdia", "tz"]; //有蛊盅动画的游戏type

type IProps = {
  grid: string;
  offsetTop: number; //距页面顶部顶部偏移量
  downTime: number; //顶部倒计时
  moneySelectList: number[];
  type: string;
  chipPoint: string[];
  gameItem: any;
  lotteryName?: string;
  betAble: boolean;
  betAbleSet: React.Dispatch<React.SetStateAction<boolean>>;
  expect: string;
  showAniSet?: any;
  hasVer?: boolean; //是否兼容竖屏，新开发全屏游戏需要兼容
};
let winFixed: number[] = [];
let time = 0;
let selfWin: number[] = [];

const Chip = (props: IProps, refs: any) => {
  const { state, dispatch } = useAction.useContextReducer();
  const { offsetTop, downTime, moneySelectList, type, chipPoint, gameItem, lotteryName, betAble, betAbleSet, expect, showAniSet, hasVer } = props;
  const [childArea, childAreaSet] = useState<ITableArea[]>([]);
  const [pageLoaded, pageLoadedSet] = useState(false); //页面是否加载完成
  const [coinData, coinDataSet] = useState<IBallAddItem[]>(state.chip.customerChip.filter((item: { type: string }) => item.type === props.grid)[0].list); //模拟筹码数组
  const [selfCoinData, selfCoinDataSet] = useState<IBallAddItem[]>(state.chip.selfChip.filter((item: { type: string }) => item.type === props.grid)[0].list); //下注筹码数组
  const [winArr, winArrSet] = useState<number[]>([]); //开奖的桌子
  const [showWin, showWinSet] = useState(false); //展示赢动画
  const [showChipPoint, showChipPointSet] = useState(false); //展示骰蛊点数
  const [showStart, showStartSet] = useState(false);
  const [showEnd, showEndSet] = useState(false);
  const [startTime, startTimeSet] = useState(5); //开始游戏倒计时
  const [endTime, endTimeSet] = useState(5); //结束游戏倒计时

  let isVer = hasVer && document.documentElement.clientWidth < document.documentElement.clientHeight;

  const { t } = useTranslation();

  //抛出添加筹码动画
  useImperativeHandle(
    refs,
    () => ({
      addData,
      delData,
      handleStartAni,
      startGame: () => {},
      clearCoin,
    }),
    []
  );

  //开始动画
  const handleStartAni = () => {
    dispatch({ type: "user/freshUserInfo" });
    showEndSet(false);
    showChipPointSet(true);
    setTimeout(
      () => {
        window.$bus.emit("voice", "goldTake");
        takeBack(coinData, coinDataSet);
        takeBack(selfCoinData, selfCoinDataSet);
        handleStartDownTime();
      },
      boxAniList.includes(type!) ? 5000 : 0
    );
  };

  const handleStartDownTime = (dt: number = 6) => {
    showStartSet(true);
    let st = dt - 1;
    if (st > 0) {
      startTimeSet(() => st);
      setTimeout(() => {
        handleStartDownTime(st);
      }, 1000);
    } else {
      showStartSet(false);
      betAbleSet(true);
      clearCoin();
    }
  };

  //倒计时，根据倒计时区间设置动画
  useEffect(() => {
    time = downTime;
    if (downTime % 5 === 0 && downTime > 0 && betAble) {
      mockAdd();
    } else if (downTime === 0) {
      if (betAble) {
        handleEndDownTime();
        showEndSet(true);
        betAbleSet(false);
      }
    }
  }, [downTime]);

  //结束倒计时
  const handleEndDownTime = (dt: number = 6) => {
    let et = dt - 1;
    if (et > 0) {
      endTimeSet(() => et);
      setTimeout(() => {
        handleEndDownTime(et);
      }, 1000);
    } else {
      showEndSet(false);
      if (showAniSet) {
        showAniSet(true);
        setTimeout(() => {
          showAniSet(false);
          handleStartAni();
        }, 7000);
      } else {
        handleStartAni();
      }
    }
  };

  //   页面初始化
  const init = useCallback(() => {
    setTimeout(() => {
      initTabel();
    }, 250);
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  const chipPointResult = useMemo(() => {
    let array = chipPoint.map((v) => {
      return {
        point: v,
        rand: randNumber(2, 5) - 1,
      };
    });
    if (chipPoint.length > 0) {
      //设置开奖桌子
      let win = gameItem.tabel.map((item: { winFn: (arg0: string[]) => any }, index: any) => {
        if (item.winFn(chipPoint)) return index;
        return false;
      });
      winFixed = _.without(win, false);
      winArrSet(() => _.without(win, false));
    }
    return array;
  }, [chipPoint, gameItem]);

  //   设置每个区域坐标系
  const initTabel = () => {
    let tableGrid = document.getElementsByClassName("tableGrid")[0];
    let elem = document.querySelectorAll(`.${props.grid}`);
    let left = (document.documentElement.clientWidth - tableGrid?.clientWidth || 0) / 2;
    let top = (document.documentElement.clientHeight - tableGrid?.clientHeight || 0) / 2;
    if (isVer) {
      left = (document.documentElement.clientWidth - tableGrid?.clientHeight || 0) / 2;
      top = (document.documentElement.clientHeight - tableGrid?.clientWidth || 0) / 2;
    }
    let area = [...childArea];
    const pianyi = (item: any, index: number) => {
      let gridLeft = 0;
      let gridTop = offsetTop;
      let ot = 0;
      //独立游戏微调
      if (hasVer) {
        gridLeft = left;
        gridTop = top;
        ot = item.offsetHeight / 4; //独立游戏顶部偏移
      }
      let data = {
        width: item.offsetWidth,
        height: item.offsetHeight,
        left: item.offsetLeft,
        top: item.offsetTop + gridTop,
        centerX: item.offsetWidth / 2 + item.offsetLeft + gridLeft,
        centerY: item.offsetHeight / 2 + item.offsetTop + gridTop - ot,
        rdY: item.offsetTop + gridTop + 20,
      };
      // 竖屏
      if (isVer) {
        data.left = top + item.offsetLeft;
        data.top = left + item.offsetTop;
        data.centerX = item.offsetWidth / 2 + data.left;
        data.centerY = item.offsetHeight / 2 + data.top - item.offsetHeight / 4;
        data.rdY = data.top + item.offsetHeight / 4;
      }
      return data;
    };
    elem.forEach((item: any, index: number) => {
      area.push(pianyi(item, index));
    });
    childAreaSet(area);
  };

  //及时更新模拟数据
  const updateCustomerChip = (array: IBallAddItem[]) => {
    let arr: IBallAddItem[] = JSON.parse(JSON.stringify(array));
    dispatch({
      type: "chip/SetCustomerChip",
      payload: {
        lotteryName,
        downTime: time,
        type: props.grid,
        list: arr,
      },
    });
  };
  //及时更新模拟数据
  const updateSelfChip = (array: IBallAddItem[]) => {
    let arr: IBallAddItem[] = JSON.parse(JSON.stringify(array));
    dispatch({
      type: "chip/SetSelfChip",
      payload: {
        lotteryName,
        downTime: time,
        type: props.grid,
        list: arr,
        expect,
      },
    });
  };

  //设置区域
  useEffect(() => {
    if (childArea.length > 0) {
      pageLoadedSet(true);
    }
  }, [childArea]);

  //增加数据
  const addData = (e: IBallAddItem) => {
    let arr = [
      {
        index: e.index,
        money: e.money,
        type: e.type,
        step: e.step,
        hash: e.hash,
        duration: randNumber(7, 11) / 10,
      },
    ];
    selfCoinDataSet((data) => {
      let result = [...data, ...arr];
      updateSelfChip(result);
      selfWin = result.map((a) => a.index);
      return result;
    });
  };

  //删除数据
  const delData = (item: { hash: string }) => {
    const { hash } = item;
    selfCoinDataSet((data) => {
      let ar = JSON.parse(JSON.stringify(data));
      _.remove(ar, (e: IBallAddItem) => e.hash === hash);
      updateSelfChip(ar);
      selfWin = ar.map((a: { index: any }) => a.index);
      return ar;
    });
  };

  //模拟数据
  const mockAdd = () => {
    let arr = [...coinData];
    let elem = document.querySelectorAll(`.${props.grid}`);
    for (let i = 0; i < randNumber(3, 6); i++) {
      setTimeout(() => {
        let num = randNumber(1, elem.length) - 1;
        let moneyIndex = randNumber(1, moneySelectList.length) - 1;
        arr.push({
          index: num,
          money: moneySelectList[moneyIndex],
          type: "top",
          step: "show",
          duration: randNumber(7, 11) / 10,
        });
        coinDataSet(arr);
        updateCustomerChip(arr);
      }, 100 * i);
    }
  };

  //收回筹码
  const takeBack = (data: IBallAddItem[], dataSetFn: React.Dispatch<React.SetStateAction<IBallAddItem[]>>) => {
    showChipPointSet(false);
    showWinSet(true);
    dataSetFn((isData: IBallAddItem[]) => {
      let arr: IBallAddItem[] = JSON.parse(JSON.stringify(isData));
      arr = arr.map((item) => {
        if (!winFixed.includes(item.index)) item.index = winFixed[randNumber(1, winFixed.length) - 1];
        item.step = "back";
        item.duration = randNumber(7, 11) / 10;
        return item;
      });
      updateCustomerChip(arr);
      return arr;
    });
    setTimeout(() => {
      hideCion(coinData, coinDataSet);
      hideCion(selfCoinData, selfCoinDataSet);
      showWinSet(false);
    }, 1000);
  };

  //隐藏筹码
  const hideCion = (data: IBallAddItem[], dataSetFn: React.Dispatch<React.SetStateAction<IBallAddItem[]>>) => {
    dataSetFn((isData: IBallAddItem[]) => {
      let arr: IBallAddItem[] = JSON.parse(JSON.stringify(isData));
      arr = arr.map((item) => {
        if (selfWin.includes(item.index)) {
          item.type = "left";
        } else item.type = "topLeft";
        item.step = "hide";
        item.duration = randNumber(7, 11) / 10;
        return item;
      });
      updateCustomerChip(arr);
      return arr;
    });
  };

  // 初始化筹码
  const clearCoin = () => {
    coinDataSet([]);
    selfCoinDataSet([]);
    selfWin = [];
    dispatch({ type: "chip/clearData" });
  };

  return (
    <div>
      {/* 赢图标 */}
      {winArr.map((item, index) => {
        let arr = childArea[item] || {};
        let order = 70; //大图小图阀值，小于这个数字的赢图标为小图
        const getArea = () => {
          let data = {
            width: (childArea.length === 10 ? arr.width : arr.width / 1.5) || 0,
            height: (childArea.length === 10 ? arr.height : arr.height / 1.5) || 0,
            left: arr.left + (childArea.length === 10 ? 0 : arr.width / 4) || 0,
            top: arr.top + arr.height / 4 || 0,
          };
          switch (type) {
            case "xocdia":
            case "tz":
            case "race1m":
            case "jsks":
            case "txssc":
            case "yuxx":
            case "pk10":
            case "xyft":
            case "yflhc":
              data.width = arr.width * 0.9;
              data.left = (arr.centerX || 0) - (data.width || 0) / 2;
              break;
          }
          data.width = _.min([data.width, 170]);
          return data;
        };
        return <div key={`index-${index}`} className={`${lotteryName === "race1m" ? style.raceWin : style.winIcon} ${showWin ? style.show : ""} ${getArea().width < order ? style.smallWin : ""}`} style={getArea()}></div>;
      })}
      {/* 骰蛊动画 */}
      {boxAniList.includes(type) && (
        <div className={`${style.chipBox} ${showChipPoint ? style.showAni : ""}`} style={{ top: ["jsks", "xocdia", "tz"].includes(type) ? 15 : -80 }}>
          <img src={require("../../assets/image/background/lid.png")} alt="" className={style.lid} />
          <img src={require("../../assets/image/background/base.png")} alt="" className={style.base} />
          {type === "xocdia" ? (
            <div className={style.xocdiaBall}>
              {chipPointResult.map((a, b) => {
                return <div key={b} className={`${style[a.point]} ${style.point} ${style.ftBox}`}></div>;
              })}
            </div>
          ) : (
            chipPointResult.map((val, key) => {
              return <div className={`${style[`box${key + 1}`]} icon-icon-dice${val.point}-${val.rand}`} key={key}></div>;
            })
          )}
        </div>
      )}
      {/* 模拟金额筹码位置 */}
      {pageLoaded &&
        coinData.map((item, index) => {
          return (
            <Suspense key={index}>
              <Money data={item} area={childArea} keys={index} lotteryName={lotteryName} />
            </Suspense>
          );
        })}
      {/* 下注金额筹码位置 */}
      {pageLoaded &&
        selfCoinData.map((item, index) => {
          return (
            <Suspense key={index}>
              <Money data={item} area={childArea} keys={50 + index} key={item.hash} lotteryName={lotteryName} />
            </Suspense>
          );
        })}
      {showEnd && (
        <div className={`${style.stepIcon} icon-stepAni`}>
          {t("ting_zhi_xia_zhu")}
          &ensp;{endTime}s
        </div>
      )}
      {showStart && (
        <div className={`${style.stepIcon} icon-stepAni`}>
          {t("kai_shi_xia_zhu")}
          &ensp;{startTime}s
        </div>
      )}
      <div id="msgContainer" className={isVer ? "isVer" : ""}></div>
    </div>
  );
};

export default forwardRef(Chip);
