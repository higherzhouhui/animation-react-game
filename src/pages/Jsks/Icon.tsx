import React from "react";
import style from "./index.module.scss";

const Icon = (props: { size?: number; num: number }) => {
  let { size, num } = props;
  size = size || 24;
  return (
    <div className={style.gameIcon} style={{ width: size, height: size }}>
      <img src={require(`@/assets/image/jsks/background/jsks-tz${num}.png`)} alt="" />
    </div>
  );
};

export default Icon;
