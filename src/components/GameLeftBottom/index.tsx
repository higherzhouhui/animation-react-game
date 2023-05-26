import React, { useState } from "react";
import useAction from "@/state/useAction";
import style from "./index.module.scss";
import { Button } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { getParams } from "@/common";

const LeftBottom = () => {
  const {
    state: {
      user: { userInfo },
    },
    dispatch,
  } = useAction.useContextReducer();
  const { t } = useTranslation();
  const [loading, loadingSet] = useState(false);

  const handleTrans = async () => {
    loadingSet((e) => {
      if (!e) {
        setTimeout(() => {
          loadingSet(false);
        }, 1000);
      }
      return !e;
    });
    dispatch({ type: "user/freshUserInfo" });
  };

  return (
    <div className={style.leftBottom}>
      <div className={`${style.icon} icon-coin`}></div>
      {userInfo.goldCoin}
      <Button
        className={style.recharge}
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
      <div className={`${style.icon} icon-trans ${loading ? style.transAni : ""}`} onClick={() => handleTrans()}></div>
    </div>
  );
};

export default LeftBottom;
