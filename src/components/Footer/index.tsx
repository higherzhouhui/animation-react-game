import React, { useRef, useState } from "react";
import style from "./index.module.scss";
import "./common.scss";
import { Button, Popover } from "antd-mobile";
import useAction from "@/state/useAction";
import { useTranslation } from "react-i18next";
import { Local, getParams } from "@/common";
const MoneyIcon = React.lazy(() => import("@/components/MoneyIcon"));

const Footer = (props: { money: number; moneySet: React.Dispatch<React.SetStateAction<number>>; moneySelectList: number[]; lotteryName: string }) => {
  const { t } = useTranslation();
  const { money, moneySet, moneySelectList, lotteryName } = props;
  const popoverRef = useRef(null) as any;
  const {
    state: {
      user: { userInfo },
    },
  } = useAction.useContextReducer();

  return (
    <div className={style.footer}>
      <div className={style.left}>
        <div className="icon-coin leftBottomIconFixed"></div>
        <div className={style.money}>{userInfo.goldCoin}</div>
        <Button
          className={style.depBtn}
          onClick={() => {
            let device = getParams("device");
            if (device === "android") {
              (window as any).fbsandroid.funcRecharge("");
            } else if (device === "ios") {
              (window as any).webkit.messageHandlers.funcRecharge.postMessage("");
            } else {
              window.parent.postMessage({ type: "jumpCharge" }, "*");
            }
          }}>
          {t("ui_dep")}
        </Button>
      </div>
      <div className={style.right}>
        <Popover
          className="moneySelect"
          ref={popoverRef}
          content={
            <div className={style.money}>
              {moneySelectList.map((val, key) => {
                return (
                  <div
                    className={style.box}
                    onClick={() => {
                      moneySet(() => {
                        Local(lotteryName + "money", val);
                        return val;
                      });
                      popoverRef.current?.hide();
                    }}
                    key={key}>
                    {val}
                  </div>
                );
              })}
            </div>
          }
          trigger="click"
          placement="top">
          <div className={style.disFlex}>
            <MoneyIcon number={money} className="bottomMoney" />
            <div className={`${style.jiantou} icon-shang`}></div>
          </div>
        </Popover>
        {/* <Button className={style.betBtn}>{t("bet")}</Button> */}
      </div>
    </div>
  );
};

export default Footer;
