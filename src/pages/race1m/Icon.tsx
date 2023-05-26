import React from "react";
import style from "./index.module.scss";

const Icon = (props: { size?: number; num: number; className: any }) => {
  let { size, num, className } = props;
  size = size || 24;
  return (
    <div className={`${style.gameIcon} ${className}`} style={{ width: size, height: size }}>
      <img src={require(`@/assets/image/race1m/background/ball${num}.png`)} alt="" />
    </div>
  );
};

export default Icon;
