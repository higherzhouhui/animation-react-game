import React, { useMemo, useState } from "react";
import style from "./index.module.scss";
import { Mask } from "antd-mobile";
import { ICpList } from "@/model/game";

const Rule = (IProps: { visible: any; visibleSet: any; lotteryName: string; cpList: ICpList[] }) => {
  const { visible, visibleSet, cpList, lotteryName } = IProps;
  const rule = useMemo(() => {
    const [data] = cpList.filter((a) => a.name === lotteryName);
    return data || {};
  }, [cpList, lotteryName]);

  return (
    <div className={style.Rule} style={{ zIndex: visible ? 9999 : -1 }}>
      <Mask visible={visible} onMaskClick={() => visibleSet(false)} opacity={0}>
        <div className={style.overlayContent}>
          <div className={style.content}>
            <div className={style.title}>{rule.chinese}</div>
            <div className={style.text}>{rule.playMethod}</div>
          </div>
          <div className={`icon-mask-close ${style.close}`} onClick={() => visibleSet(false)}></div>
        </div>
      </Mask>
    </div>
  );
};

export default Rule;
