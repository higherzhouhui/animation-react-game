import React, { useCallback, useEffect, useState } from "react";
import style from "./common.module.scss";
import { randNumber } from "@/common";

const Money = (props: { data: IBallAddItem; area: ITableArea[]; keys: number; lotteryName?: string }) => {
  const {
    data: { money, index, type, step, duration },
    area,
    keys,
    lotteryName,
  } = props;
  // 根据各种情况获取位置
  const initCoor = () => {
    switch (type) {
      case "top":
      case "left":
        return {
          left: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetLeft || 150,
          top: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetTop || 20,
        };
      // if (lotteryName === "tz") {
      //   return {
      //     left: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetLeft || 150,
      //     top: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetTop || 20,
      //   };
      // } else {
      //   return {
      //     left: (document.getElementsByClassName("moneyHideTopFixed")[0] as any).offsetLeft || 0,
      //     top: (document.getElementsByClassName("moneyHideTopFixed")[0] as any).offsetTop || 0,
      //   };
      // }
      case "right":
        let moneyBox = document.getElementsByClassName("rightBottom")[0] as any;
        let moneyo = document.getElementsByClassName("bottomMoney")[0] as any;
        let left = moneyo.offsetLeft + (moneyBox ? moneyBox.offsetLeft : 0);
        let top = moneyo.offsetTop + (moneyBox ? moneyBox.offsetTop : 0);
        return {
          left: left || 0,
          top: top || 0,
        };
      case "topLeft":
        if (lotteryName === "tz") {
          return {
            left: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetLeft || 0,
            top: (document.getElementsByClassName("peopleHideTopFixed")[0] as any).offsetTop || 0,
          };
        } else {
          return {
            left: (document.getElementsByClassName("moneyHideTopFixed")[0] as any).offsetLeft || 0,
            top: (document.getElementsByClassName("moneyHideTopFixed")[0] as any).offsetTop || 0,
          };
        }
      case "left":
      // 飞入到自己的钱包
      // return {
      //   left: (document.getElementsByClassName("leftBottomIconFixed")[0] as any).offsetLeft || 0,
      //   top: (document.getElementsByClassName("leftBottomIconFixed")[0] as any).offsetTop || 0,
      // };
    }
  };

  const { left: l, top: t } = initCoor()!;

  const [left, leftSet] = useState(l);
  const [top, topSet] = useState(t);
  const [opacity, opacitySet] = useState(0);
  const [transRotate, transRotateSet] = useState(randNumber(0, 270));

  const init = useCallback(() => {
    setTimeout(() => {
      initArea();
    }, 10);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // 设置位置
  const initArea = () => {
    if (!area[index]) return;
    try {
      leftSet(() => {
        let lw = 0;
        let rw = 0;
        switch (lotteryName) {
          case "txssc":
            if (index === 0 || index === 2) {
              lw = area[index].width / 4;
            }
            if (index === 8 || index === 10) {
              rw = area[index].width / 4;
            }
            break;
          case "yuxx":
            if (index === 6 || index === 8 || index === 10) {
              lw = area[index].width / 2;
            }
            if (index === 7 || index === 9 || index === 11) {
              rw = area[index].width / 2;
            }
            break;
          case "saiche":
          case "xocdia":
          case "toubao":
          case "jsks":
            if (index === 0 || index === 2) {
              lw = area[index].width / 2;
            }
            if (index === 1 || index === 3) {
              rw = area[index].width / 2;
            }
            break;
          case "pk10":
            if (index === 0 || index === 1) {
              lw = area[index].width / 2;
            }
            if (index === 2 || index === 3) {
              rw = area[index].width / 2;
            }
            break;
          case "xyft":
            if (index === 2) {
              lw = area[index].width / 3;
            }
            if (index === 3) {
              rw = area[index].width / 3;
            }
            break;
          case "yflhc":
            if (index === 0 || index === 3) {
              lw = area[index].width / 3;
            }
            if (index === 2 || index === 6) {
              rw = area[index].width / 3;
            }
            break;
        }
        let l = randNumber(area[index].centerX - area[index].width / 2 + lw, area[index].centerX + area[index].width / 2 - 28 - rw);
        return l;
      });
      topSet(() => {
        if (["tz", "race1m"].includes(lotteryName!)) {
          return area[index].centerY + randNumber(-5, 5);
        } else {
          let h = 18;
          switch (lotteryName) {
            case "saiche":
              h = 35;
              break;
            case "toubao":
            case "txssc":
              h = 25;
              break;
            case "yuxx":
              h = 30;
              break;
            case "jsks":
              h = 30;
              break;
            case "pk10":
              h = 30;
              break;
            case "xyft":
              h = 30;
            case "yflhc":
              h = 30;
              if (index === 2 || index === 3) h = 60;
              break;
          }
          return randNumber(area[index].centerY - area[index].height / 2 + h, area[index].centerY + area[index].height / 2 - 14);
        }
      });
      opacitySet(1);
    } catch (error) {
      leftSet(0);
      topSet(0);
      opacitySet(0);
    }
    transRotateSet(randNumber(270, 450));
  };

  //隐藏区域
  const hideArea = () => {
    const { left: lt, top: tp } = initCoor()!;
    leftSet(lt);
    topSet(tp);
    opacitySet(-2);
  };

  useEffect(() => {
    if (step === "back") initArea();
    if (step === "hide") hideArea();
  }, [step]);

  return <div className={`icon-money${money} ${style.fixedMoney}`} data-index={`money${index}`} data-key={`money${keys}`} style={{ left: left || 0, top: top, opacity: opacity, transform: `rotate(${transRotate}deg) translate3d(0,0,0)`, transitionDuration: `${duration}s`, zIndex: keys }}></div>;
};

export default Money;
