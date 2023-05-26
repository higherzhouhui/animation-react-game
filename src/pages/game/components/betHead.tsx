import { getParams, mTime } from "@/common";
import { IGameRecord, IGameRecordList } from "@/model/game";
import { pageOpenRecord } from "@/server/game";
import { InfiniteScroll, Loading, Popup } from "antd-mobile";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style/betHead.module.scss";

const Ball = React.lazy(() => import("./ball"));

export default function BetHead(props: { children: any; downTime: number }) {
  const [pageNum, pageNumSet] = useState(1); //开奖记录翻页数
  const [hasMore, hasMoreSet] = useState(true); //是否到最后一页
  const [showRecord, showRecordSet] = useState(false); //展示记录弹窗
  const [recordList, recordListSet] = useState<IGameRecordList[]>([]); //记录列表

  const { t } = useTranslation();
  const { downTime } = props;

  // 点击右上角获取历史投注记录
  const handleGetResult = async () => {
    const res = await pageOpenRecord<IGameRecord>({
      pageNum,
      pageSize: 10,
      orderBy: "id desc",
    });
    if (!(res instanceof Error)) {
      if (res.pageNum == res.pages) {
        hasMoreSet(false);
      } else {
        pageNumSet(pageNum + 1);
      }
      recordListSet([...recordList, ...res.list]);
    }
  };

  return (
    <>
      <div className={`${style.betHead} ${style.disFlexs}`}>
        <div className={style.top}>
          <div className={`${style.disFlex} ${style.head}`}>
            <img src={require("@/assets/image/game1.png")} />
            {t("you_xi_mc")}
          </div>
          <div className={style.right}>
            <div
              className={style.box}
              onClick={() => {
                let device = getParams("device");
                if (device === "android") {
                  (window as any).fbsandroid.openRule("");
                } else if (device === "ios") {
                  (window as any).webkit.messageHandlers.openRule.postMessage("");
                } else {
                  window.parent.postMessage({ type: "openRule" }, "*");
                }
              }}>
              <img src={require("../../../assets/image/rule.png")} alt="" />
              quy tắc
            </div>
            <div
              className={style.box}
              onClick={() => {
                let device = getParams("device");
                console.log("开奖记录");
                if (device === "android") {
                  (window as any).fbsandroid.funcShowRecord("");
                } else if (device === "ios") {
                  (window as any).webkit.messageHandlers.funcShowRecord.postMessage("");
                } else {
                  window.parent.postMessage({ type: "funcShowRecord" }, "*");
                }
                // hasMoreSet(true);
                // pageNumSet(1);
                // recordListSet([]);
                // showRecordSet(true);
              }}>
              <img src={require("../../../assets/image/report.png")} alt="" />
              mở thưởng
            </div>
          </div>
        </div>
        <div className={style.bottom}>
          <div className={style.disFlexb}>
            <div className={style.disFlex}>
              {t("fengpan")}：{downTime > 0 ? <div className={style.yellow}>{mTime(downTime)}</div> : <Loading />}
            </div>
            {props.children}
          </div>
        </div>
      </div>

      {/* 展示开奖结果 */}
      {showRecord && (
        <Popup
          visible={showRecord}
          onMaskClick={() => {
            showRecordSet(false);
          }}
          className="recordBody"
          bodyClassName="recordBody">
          <div className={style.closeIcon} onClick={() => showRecordSet(false)}>
            <img src={require("../../../assets/image/jiantou-shang.png")} alt="" />
          </div>
          <div className={style.recordList}>
            <div className={style.title}>{t("you_xi_mc")}</div>
            <div className={style.list}>
              {recordList.map((val, key) => {
                return (
                  <div className={style.box} key={key}>
                    <dt>{t("kai_jiang_qs", { value: val.openNumber })}</dt>
                    <div className={style.disFlex}>
                      <Ball list={val.openResult} />
                    </div>
                  </div>
                );
              })}
              <InfiniteScroll loadMore={handleGetResult} hasMore={hasMore} />
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
