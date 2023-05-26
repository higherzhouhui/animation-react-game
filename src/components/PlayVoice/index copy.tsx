import React, { useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import goldOut from "../../assets/media/goldOut.mp3";
import goldTake from "../../assets/media/goldTake.mp3";
import raceVoice from "../../assets/media/raceVoice.mp3";
import { getParams } from "../../common/index";
const PlayVoice = () => {
  useEffect(() => {
    window.$bus.addListener("voice", EventPlayVioce);
    return () => {
      window.$bus.removeListener("voice", EventPlayVioce);
    };
  }, []);

  const EventPlayVioce = (type: string) => {
    switch (type) {
      // 筹码下注音效
      case "goldOut":
        // if (getParams("device") === "android") {
        //   (window as any).fbsandroid.playVoice("goldOut");
        // } else
        addVoiceDom(goldOut);
        break;
      // 收回筹码音效
      case "goldTake":
        // if (getParams("device") === "android") {
        //   (window as any).fbsandroid.playVoice("goldTake");
        // } else
        addVoiceDom(goldTake);
        break;
      case "raceVoice":
        // if (getParams("device") === "android") {
        //   (window as any).fbsandroid.playVoice("raceVoice");
        // } else
        addVoiceDom(raceVoice);
        break;
    }
  };

  const addVoiceDom = (src: any) => {
    const div = document.createElement("div");
    const root = ReactDOMClient.createRoot(div);
    // document.body.appendChild(div);
    let addDom = <audio src={src} autoPlay controls style={{ opacity: 0, pointerEvents: "none", position: "absolute" }} hidden className="addDom"></audio>;
    root.render(addDom);
    for (let item of document.getElementsByClassName("addDom") as any) {
      item.volume = 1;
    }
    // setTimeout(() => {
    //   // root.unmountComponentAtNode(div);
    //   // document.body.removeChild(div);
    // }, 6000);
  };

  return <>{/* <audio src={raceVoice} autoPlay></audio> */}</>;
};

export default PlayVoice;
