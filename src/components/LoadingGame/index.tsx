import React, { useCallback, useEffect, useState } from "react";
import style from "./index.module.scss";
import _ from "lodash";
import { preload } from "./preload";
import sprite from "../../assets/sprite/sprite.png";

const LoadingGame = (gameName: string, onRelink: () => void) => {
  let modulesFiles: any;
  if (gameName === "ft") modulesFiles = (require as any).context("../../assets/image/ft/background", true, /\.(jpg|png)$/);
  if (gameName === "jsks") modulesFiles = (require as any).context("../../assets/image/jsks/background", true, /\.(jpg|png)$/);
  if (gameName === "tz") modulesFiles = (require as any).context("../../assets/image/tz/background", true, /\.(jpg|png)$/);
  if (gameName === "race1m") modulesFiles = (require as any).context("../../assets/image/race1m/background", true, /\.(jpg|png)$/);
  if (gameName === "txssc") modulesFiles = (require as any).context("../../assets/image/txssc/background", true, /\.(jpg|png)$/);
  if (gameName === "yuxx") modulesFiles = (require as any).context("../../assets/image/yuxx/background", true, /\.(jpg|png)$/);
  if (gameName === "pk10") modulesFiles = (require as any).context("../../assets/image/pk10/background", true, /\.(jpg|png)$/);
  if (gameName === "xyft") modulesFiles = (require as any).context("../../assets/image/xyft/background", true, /\.(jpg|png)$/);
  if (gameName === "yflhc") modulesFiles = (require as any).context("../../assets/image/yflhc/background", true, /\.(jpg|png)$/);

  const [loading, loadingSet] = useState(true);
  const [step, stepSet] = useState(1);

  const onResize = () => {
    const width = document.documentElement.clientWidth; //获取当前手机屏宽
    const height = document.documentElement.clientHeight; //手机褡高
    //如果宽小于高，就是代表竖屏
    const contentDOM = document.getElementById("gameBody") as any; //获取lingan_1元素
    if (width < height) {
      contentDOM.style.width = height + "px"; //设置该元素的宽等于屏高
      contentDOM.style.height = width + "px"; //设置该元素的高等于屏宽
      contentDOM.style.top = (height - width) / 2 + "px";
      contentDOM.style.left = 0 - (height - width) / 2 + "px";
      contentDOM.style.transform = "rotate(90deg)"; //让该元素旋转90度，使其横屏展示
    } else {
      contentDOM.style.width = width + "px"; //设置该元素的宽等于屏高
      contentDOM.style.height = height + "px"; //设置该元素的高等于屏宽
      contentDOM.style.top = 0;
      contentDOM.style.left = 0;
      contentDOM.style.transform = "rotate(0deg)"; //让该元素旋转90度，使其横屏展示
    }
    preload({
      files: [...modulesFiles.keys().map((e: string) => require(`../../assets/image/${gameName}/background` + e.replace("./", "/"))), sprite],
      progress: function (precent: any) {
        stepSet(_.min([precent, 100]));
      },
      complete: () => {
        loadingSet(false);
      },
    });
  };

  const orientationChange = () => {
    location.reload();
  };

  const onLoad = useCallback(() => {
    onResize();
  }, []);

  useEffect(() => {
    onLoad();
    window.addEventListener("orientationchange", orientationChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("online", onRelink);
  }, [onLoad]);

  const EnterFullScreen = () => {
    let dom = document.documentElement as any;
    if (dom.RequestFullScreen) {
      dom.RequestFullScreen();
    }
    if (dom.mozRequestFullScreen) {
      dom.mozRequestFullScreen();
    }
    if (dom.webkitRequestFullScreen) {
      dom.webkitRequestFullScreen();
    }
    if (dom.msRequestFullscreen) {
      dom.msRequestFullscreen();
    }
  };

  return {
    loading,
    dom: (
      <>
        {loading && (
          <div className={style.bg} onClick={() => EnterFullScreen()}>
            <div className={style.step}>
              <div className={style.box} style={{ width: `${(step / 100) * 540}px` }}>
                <div className={style.text}>{step}%</div>
              </div>
            </div>
          </div>
        )}
      </>
    ),
  };
};

export default LoadingGame;
