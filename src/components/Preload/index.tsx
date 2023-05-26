import React from "react";
import style from "./index.module.scss";

const requireContext = require.context("../../assets/image/background", true, /^\.\/.*\.(png|jpg)$/);
const images = requireContext.keys().map(requireContext);
const Preload = () => {
  return ["/rece1m", "/tz"].includes(location.pathname) ? (
    <div className={style.preloadBody}>
      {images.map((v: any, index: number) => {
        return <img src={v} alt="" key={index} />;
      })}
    </div>
  ) : (
    <></>
  );
};

export default Preload;
