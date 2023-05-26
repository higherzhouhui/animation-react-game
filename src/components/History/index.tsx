import React, { useCallback, useEffect, useState } from "react";
import style from "./index.module.scss";
import { InfiniteScroll, Mask, Tabs } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { GetBetHistoryByName, GetHistoryByName } from "@/server/game";
import useAction from "@/state/useAction";
import { FreeTime } from "@/common";
import { LeftOutline } from "antd-mobile-icons";
import { ILotteryResult, ILotteryResult2 } from "@/model/game";
import IconGroup from "./IconGroup";

let hasHis2 = false;
let hasPage = false;
const History = (props: { visible: any; visibleSet: any; lotteryName: string }) => {
  const { t } = useTranslation();
  const {
    state: {
      user: { userInfo },
    },
  } = useAction.useContextReducer();

  const { visible, visibleSet, lotteryName } = props;
  const [list1, list1Set] = useState<ILotteryResult[]>([]);
  const [list2, list2Set] = useState<ILotteryResult2[]>([]);
  const [showDetail, showDetailSet] = useState(false);
  const [detail2, detail2Set] = useState<ILotteryResult2>({ playNumReq: {}, resultList: [] } as any);
  const [tabActive, tabActiveKey] = useState("kjjl");
  const [hasMoreData, hasMoreDataSet] = useState(true);
  // const [page, pageSet] = useState(0);
  let paseNum = 0;
  const getList = async () => {
    const res = await GetHistoryByName<ILotteryResult[]>({ lotteryName: lotteryName, page: 0 });
    if (!(res instanceof Error)) {
      list1Set(res);
    }
  };
  const setScroll = () => {
    if (hasHis2) return;
    hasHis2 = true;
    let bottoms = document.getElementById("bottom") as HTMLElement;
    let observer = new IntersectionObserver((nodes) => {
      const tgt = nodes[0];
      if (tgt.isIntersecting) {
        if (!hasMoreData) return;
        if (!hasPage) {
          resetLiset2();
          hasPage = true;
        }
        getList2();
      }
    });
    observer.observe(bottoms);
  };
  const resetLiset2 = () => {
    list2Set([]);
    paseNum = 0;
    hasMoreDataSet(true);
  };
  const getList2 = async () => {
    const res = await GetBetHistoryByName<ILotteryResult2[]>({ uid: userInfo.uid, page: paseNum, lotteryName: lotteryName });
    if (!(res instanceof Error)) {
      // pageSet((e) => e + 1);
      paseNum++;
      if (res.length > 0) {
        // hasMoreSet(true);
        hasMoreDataSet(true);
        list2Set((data) => {
          return [...data, ...res];
        });
      } else {
        // hasMoreSet(false);
        hasMoreDataSet(false);
      }
    }
  };

  useEffect(() => {
    hasPage = false;
    resetLiset2();
    if (tabActive === "kjjl") getList();
    if (tabActive === "tzjl") setScroll();
  }, [tabActive, userInfo.uid]);

  //中奖结果图标
  const lotterResultIconList = [{ icon: "icon-noopen-icon" }, { icon: "icon-lose-icon" }, { icon: "icon-win-icon" }];
  // 开奖记录
  const history1 = () => {
    return (
      <>
        {list1.map((item, index) => {
          return (
            <div className={style.box1} key={index}>
              <div className={style.qihao}>{item.expect}</div>
              <IconGroup detail={item.lotteryResult} lotteryName={lotteryName} />
            </div>
          );
        })}
      </>
    );
  };
  // 投注记录
  const history2 = () => {
    return showDetail ? (
      <div>
        {/* 投注详情顶部 */}
        <div className={style.detail2BodyStyle_title_icons}>
          <img src={detail2?.icon} alt="" />
          <div>{detail2.nickName}</div>
          <div className={style.detail2BodyStyle_q}>{detail2.expect}</div>
          <div className={`${lotterResultIconList[detail2.awardStatus]?.icon} ${style.winLoseIcon}`}></div>
        </div>
        <div className={style["glist-body"]}>
          <div className={style.glist}>
            <div className={style.label}>{t("rp_bet_amount")}:</div>
            <div className={style.content}>{detail2.betAmount}</div>
          </div>
          <div className={style.glist}>
            <div className={style.label}>{t("beishu")}:</div>
            <div className={style.content}>{detail2.times}</div>
          </div>
          <div className={style.glist}>
            <div className={style.label}>{t("xzsj")}:</div>
            <div className={style.content}>{FreeTime(detail2.createTime, "h:i d-m-y")}</div>
          </div>
          <div className={style.glist}>
            <div className={style.label}>{t("xzxq")}:</div>
            <div className={style.content}>{detail2.playNumReq.num}</div>
          </div>
          <div className={style.glist}>
            <div className={style.label}>{t("ui_win_amount_colon")}</div>
            <div className={style.content}>{detail2.realProfitAmount || 0}</div>
          </div>

          <div className={style.glist}>
            <div className={style.label}>{t("pjfs")}:</div>
            <div className={style.content}>{detail2.payMethd == 0 ? t("weipaijiang") : detail2.payMethd == 1 ? t("zidongpaijiang") : t("buchongpaijiang")}</div>
          </div>
          <div className={style.glist}>
            <div className={style.label}>{t("ui_time_amount")}:</div>
            <div className={style.content}>{detail2.updateTime != null ? FreeTime(detail2.updateTime, "h:i d-m-y") : ""}</div>
          </div>
          <div className={`${style.glist} ${style.glist2} ${detail2.lotteryName == "yncp30s" ? style.glist3 : ""}`}>
            <div className={style.label}>{t("ui_result_colon")}</div>
            <div className={style.content}>
              <div style={{ display: "flex" }}>
                <IconGroup detail={detail2.resultList || []} lotteryName={lotteryName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={style.myHisBody}>
        <div className={style["list-body"]}>
          {list2.map((item, index) => (
            <div
              className={style.list}
              key={`bet${index}`}
              onClick={() => {
                detail2Set(item);
                showDetailSet(true);
              }}>
              <img src={item.icon} alt="" className={style.icon} />
              <div className={style.myHisTop}>
                <dd>{item.nickName}</dd>
                <dt>{FreeTime(item.createTime, "y-m-d h:i")}</dt>
              </div>
              <div className={style.myHisTop2}>
                <div className={`${lotterResultIconList[item.awardStatus]?.icon} ${style.winlose}`}></div>
                <span>{t("bet")}</span>
                <span className={style.num}>{item.betAmount}</span>
              </div>
            </div>
          ))}
          <div id="bottom" className={style.nomore}>
            {hasMoreData ? "Loading" : "No More"}
          </div>
          {/* {list2.length > 0 && <InfiniteScroll loadMore={getList2} hasMore={hasMore} />} */}
        </div>
      </div>
    );
  };
  return (
    <div className={style.Rule} style={{ zIndex: visible ? 9999 : -1 }}>
      <Mask visible={visible} onMaskClick={() => visibleSet(false)} opacity={0}>
        <div className={style.overlayContent}>
          <div className={style.content}>
            <div className={style.list}>
              {showDetail && (
                <div className={style.back}>
                  <div className={style.icon} onClick={() => showDetailSet(false)}>
                    <LeftOutline color="#fff" />
                  </div>
                  <div>{t("xzxq")}</div>
                </div>
              )}
              <Tabs className="histab" activeKey={tabActive} onChange={tabActiveKey}>
                <Tabs.Tab title={t("kjjl")} key="kjjl">
                  {history1()}
                </Tabs.Tab>
                <Tabs.Tab title={t("tzjl")} key="tzjl">
                  {history2()}
                </Tabs.Tab>
              </Tabs>
            </div>
          </div>
          <div
            className={`icon-mask-close ${style.close}`}
            onClick={() => {
              showDetailSet(false);
              visibleSet(false);
            }}></div>
        </div>
      </Mask>
    </div>
  );
};

export default History;
