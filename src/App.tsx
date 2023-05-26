import React from "react";
import { ConfigProvider, Toast } from "antd-mobile";
import RouterGuard from "./react-router-guard";
import routes, { onRouteBefore } from "./routes";
import "./assets/style/index.css";
import "./assets/style/common.scss";
import "./assets/sprite/sprite.css";
import "./lang/i18n";
import enUS from "antd-mobile/es/locales/en-US";
import { BrowserRouter } from "react-router-dom";
import EventEmitter from "events";
import EventStore from "./state/event";
window.$bus = new EventEmitter();

const Preload = React.lazy(() => import("./components/Preload")); //预加载
const PlayVoice = React.lazy(() => import("./components/PlayVoice")); //播放声音
const App = () => {
  Toast.config({ position: "center", maskClickable: true });

  return (
    <ConfigProvider locale={enUS}>
      <BrowserRouter basename="/">
        <RouterGuard
          routers={routes}
          onRouterBefore={onRouteBefore}
          loading={
            <div>
              <img src={require("./assets/image/empty.gif")} alt="" className="loadingPng" />
            </div>
          }
        />
      </BrowserRouter>
      <EventStore />
      <Preload />
      <PlayVoice />
    </ConfigProvider>
  );
};

export default App;
