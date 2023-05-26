import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import goldOut from "../../assets/media/goldOut.mp3";
import goldTake from "../../assets/media/goldTake.mp3";
import raceVoice from "../../assets/media/raceVoice.mp3";
import { createRoot } from "react-dom/client";
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
        addVoiceDom(goldOut);
        break;
      // 收回筹码音效
      case "goldTake":
        addVoiceDom(goldTake);
        break;
      case "raceVoice":
        addVoiceDom(raceVoice);
        break;
    }
  };

  const addVoiceDom = (src: any) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    // ReactDOM.render(<audio src={src} autoPlay></audio>, div);
    const root = createRoot(div);
    root.render(<audio src={src} autoPlay></audio>);
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(div);
    }, 6000);
  };

  return <></>;
};

export default PlayVoice;
