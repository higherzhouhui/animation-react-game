import React from "react";
import style from "./index.module.scss";

const TxsscIcon = (props: { num: string | number; size?: number; className?: string }) => {
  let { num, size, className } = props;
  size = size || 24;

  return (
    <div className={`${style.numIcon} ${className}`} style={{ width: size, height: size }}>
      {num}
    </div>
  );
};

export default TxsscIcon;
