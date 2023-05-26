import { getParams } from "@/common";
import React from "react";

const GameClose = () => {
  return (
    <div
      className="icon-game-close"
      onClick={() => {
        let device = getParams("device");
        if (device === "android") {
          (window as any).fbsandroid.closeGame("");
        } else if (device === "ios") {
          (window as any).webkit.messageHandlers.closeGame.postMessage("");
        } else {
          window.parent.postMessage({ type: "closeGame" }, "*");
        }
      }}></div>
  );
};

export default GameClose;
