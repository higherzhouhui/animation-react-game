import React, { useMemo } from "react";
import style from "./index.module.scss";

const YuxxIcon = (props: { num: number | string; size?: number; border?: number }) => {
  let { num, size, border } = props;
  size = size || 24;
  const icon = useMemo(() => {
    let name = "";
    switch (Number(num)) {
      case 1:
        name = "lu";
        break;
      case 2:
        name = "hulu";
        break;
      case 3:
        name = "ji";
        break;
      case 4:
        name = "yu";
        break;
      case 5:
        name = "xie";
        break;
      case 6:
        name = "xia";
        break;
    }
    return require(`../../assets/image/yuxx/background/${name}.png`);
  }, [num]);
  return (
    <div className={style.YuxxIcon} style={{ width: size, height: size, padding: border, background: border && border > 0 ? "#fff" : "transparent" }}>
      <img src={icon} />
    </div>
  );
};

export default YuxxIcon;
