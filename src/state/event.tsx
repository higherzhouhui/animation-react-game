import React, { useCallback, useEffect } from "react";
import useStore from "./useAction";
import { Local, getParams } from "@/common";
import { getFinger } from "@/util/finger";

const EventStore = () => {
  const { state, dispatch } = useStore.useContextReducer();

  //初始化，获取链接里面的登陆信息，设备信息等
  const initParams = () => {
    let { token, liveId, device, lang } = getParams();
    Local("token", token);
    Local("liveId", liveId);
    Local("device", device);
    Local("lang", lang);
  };

  const init = useCallback(() => {
    initParams();
    getFinger().then(() => {
      if (!["/ft", "/waybill"].includes(location.pathname.toLocaleLowerCase())) {
        dispatch({ type: "user/freshUserInfo" });
      }
    });
  }, []);

  useEffect(() => {
    init();
    window.$bus.addListener("store", storeEvent);
    return () => {
      window.$bus.removeListener("store", storeEvent);
    };
  }, [init]);

  const storeEvent = (context: { type: string; payload: any }) => {
    const { type, payload } = context;
    switch (type) {
      // 检查是否登录,获取用户信息
      case "setUserInfo":
        dispatch({ type: "userinfo/setUserInfo", payload });
        break;
      case "SetFollowAble":
        dispatch({ type: "chip/SetFollowAble", payload: true });
        break;
    }
  };

  return <></>;
};

export default EventStore;
