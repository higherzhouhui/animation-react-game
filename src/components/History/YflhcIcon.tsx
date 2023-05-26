import React from "react";
import TxsscIcon from "./txsscIcon";
import style from "./index.module.scss";
import _ from "lodash";

const YflhcIcon = (props: { array: string[] | number[] }) => {
  const { array } = props;

  return (
    <>
      {array
        .filter((val, key) => key < 6)
        .map((a, b) => (
          <TxsscIcon num={a} key={b} />
        ))}
      <span className={style.whiteFont}>+</span>
      <TxsscIcon num={_.nth(array, 6)} className={_.nth(array, 7) == "1" ? style.redBall : _.nth(array, 7) == "2" ? style.greenBall : _.nth(array, 7) == "3" ? style.blueBall : ""} />
    </>
  );
};

export default YflhcIcon;
