import React, { useCallback, useEffect, useState } from "react";
import style from "./style/recingAni.module.scss";
import _ from "lodash";
import { TypeInitCar, initCar } from "@/model/game";
import { RandomNum } from "@/common";
import { useTranslation } from "react-i18next";

const RecingAni = (props: { carResult: string[] }) => {
  const { t } = useTranslation();
  const { carResult } = props;
  const [carList, carListSet] = useState<TypeInitCar[]>(initCar()); //赛车数据结构
  const [showTer, showTerSet] = useState(false); //展示终点线，结束赛道边缘动画
  const [startTime, startTimeSet] = useState(0);
  const [showPlatform, showPlatformSet] = useState(false); //展示最后的颁奖台

  const init = useCallback(() => {
    window.$bus.emit("voice", "raceVoice");
  }, []);
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (startTime > 0) {
      setTimeout(() => {
        startTimeSet(startTime - 1);
      }, 1000);
    } else if (startTime === 0) {
      startAni(carResult, 1);
    }
  }, [startTime]);
  /**
   * 开始动画
   * @param arr 结果排序数组
   * @param wheel 动画轮数
   */
  const startAni = (arr: string[], wheel: number) => {
    let list = [...carList];
    list = list.map((val) => {
      val.offsetX = RandomNum(24 * (wheel - 1), 24 * wheel);
      return val;
    });
    carListSet(list);
    if (wheel < 3) {
      setTimeout(() => {
        startAni(arr, wheel + 1);
      }, 1000);
    } else {
      spurtAni(arr, 0);
      showTerSet(true);
    }
  };

  /**
   * 赛车冲刺动画
   * @param arr 结果排序数组
   * @param index 依次冲刺
   */
  const spurtAni = (arr: string[], index: number) => {
    let list = [...carList];
    let key = Number(arr[index]) - 1;
    list[key].offsetX = 100;
    carListSet(list);
    if (index < 9) {
      setTimeout(() => {
        spurtAni(arr, index + 1);
      }, 130);
    } else {
      //游戏结束
      setTimeout(() => {
        showPlatformSet(true);
      }, 1000);
    }
  };

  return (
    <div className={style.aniBody}>
      {showPlatform ? (
        <div className={style.platForm}>
          {/* 领奖台 */}
          {carResult
            .filter((v: string, k: number) => k < 3)
            .map((val: string, index: number) => {
              return (
                <div className={`icon-dice-car${val}x2 ${style.car}`} key={index}>
                  <div className={`icon-${index + 1}st ${style.rank}`}></div>
                </div>
              );
            })}
        </div>
      ) : (
        <>
          {/* 赛道边缘背景 */}
          <div className={`${style.trackBg} ${!showTer ? style.trackBgAni : ""}`}></div>
          <div className={`${style.block} ${showTer ? style.showTer : ""}`}>
            {/* 赛道背景 */}
            {startTime > 0 ? (
              <div className={style.centerDownTime}>{t("ting_zhi_tz", { num: startTime })}</div>
            ) : (
              <div className={style.carList}>
                {carList.map((val) => {
                  return (
                    <div className={`icon-dice-car${val.name} ${style.car}`} style={{ transform: `translate3d(${((-1 * val.offsetX) / 100) * (window.innerWidth - 50)}px,0,0)` }} key={val.name}>
                      <div className={`${style.fire} icon-dice-fire`}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RecingAni;
