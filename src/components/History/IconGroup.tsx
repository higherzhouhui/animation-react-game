import React from "react";
import style from "./index.module.scss";
import Ball from "@/pages/game/components/ball";
import TxsscIcon from "./txsscIcon";
import YuxxIcon from "./yuxxIcon";
import YflhcIcon from "./YflhcIcon";

const IconGroup = (props: { detail: string[] | number[]; lotteryName: string }) => {
  const { detail, lotteryName } = props;

  return (
    <>
      {lotteryName === "ft" && <Ball list={detail} className={style.ftResult} />}
      {["jsks", "tz"].includes(lotteryName) && (
        <div className={style.disFlex}>
          {detail.map((a, b) => (
            <div className={`icon-icon-dice${a}`} style={{ marginRight: 3 }} key={b}></div>
          ))}
        </div>
      )}
      {["race1m", "xyft"].includes(lotteryName) && (
        <div className={style.disFlex}>
          {detail.map((a, b) => (
            <img src={require(`@/assets/image/race1m/background/ball${a}.png`)} alt="" key={b} className={style.ballIcon} />
          ))}
        </div>
      )}
      {["txssc", "pk10"].includes(lotteryName) && (
        <div className={style.disFlex}>
          {detail.map((a, b) => (
            <TxsscIcon num={a} key={b} />
          ))}
        </div>
      )}
      {["yuxx"].includes(lotteryName) && (
        <div className={style.disFlex}>
          {detail.map((a, b) => (
            <YuxxIcon num={a} key={b} border={2} />
          ))}
        </div>
      )}
      {["yflhc"].includes(lotteryName) && (
        <div className={style.disFlex}>
          <YflhcIcon array={detail} />
        </div>
      )}
    </>
  );
};

export default IconGroup;
