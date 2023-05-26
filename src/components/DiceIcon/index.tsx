import React, { CSSProperties } from "react";

type IProps = {
  number: number | string;
  className?: CSSProperties;
};

const DiceIcon = (props: IProps) => {
  const { number, className } = props;
  return <div className={`icon-icon-dice${number} ${className}`}></div>;
};

export default DiceIcon;
