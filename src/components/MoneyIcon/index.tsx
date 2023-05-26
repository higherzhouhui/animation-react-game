import React, { CSSProperties } from "react";

type IProps = {
  number: number | string;
  className?: CSSProperties | string;
  id?: string;
  onClick?: () => void;
};
const MoneyIcon = (props: IProps) => {
  const { number, className, id, onClick } = props;
  return <div className={`icon-money${number} ${className}`} id={id} onClick={onClick}></div>;
};

export default MoneyIcon;
