import { IBtiParams, IBackAllGameCoin, ILotteryParams } from "@/model/game";
import request from "./server";
import { FullRequest } from "@/common";
import { Toast } from "antd-mobile";

/**
 *  获取用户余额
 * @param data
 * @returns
 */
export const getBalance = <T>(data: { userId: string | number }) => request<T>("/service-game-platform/auth/v1/ft/getBalance", "get", data);

/**
 * 获取上次开盘记录
 * @returns
 */
export const getLastOpenRecord = <T>() => request<T>("/service-game-platform/auth/v1/ft/getLastOpenRecord");

/**
 * 分页获取开盘记录
 * @param data
 * @returns
 */
export const pageOpenRecord = <T>(data: { pageNum: number; pageSize: number; orderBy: string }) => request<T>("/service-game-platform/auth/v1/ft/pageOpenRecord", "GET", data);

/**
 * 分页获取投注记录
 * @param data
 * @returns
 */
export const pageUserBetRecord = <T>(data: { userId?: number | string; pageNum: number; pageSize: number }) => request<T>("/service-game-platform/auth/v1/ft/pageUserBetRecord", "GET", data);

/**
 * 获取封盘倒计时
 * @returns
 */
export const getOpenCountdown = <T>() => request<T>("/service-game-platform/auth/v1/ft/getOpenCountdown");

/**
 * 用户投注
 * @param data
 * @returns
 */
export const userBet = <T>(data: IBtiParams) => request<T>("/service-game-platform/auth/v1/ft/userBet", "post", data);

/**
 * 一键回收反弹
 * @returns
 */
export const backAllGameCoin = <T>(data: IBackAllGameCoin) => request<T>(`/api/center-client/sys/user/backAllGameCoinForFT`, "GET", data);
/**
 * 一键回收
 * @returns
 */
export const BackMoney = <T>(data: IBackAllGameCoin) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/center-client/sys/user/backAllGameCoin`, "POST", params, true, headers);
};

/**
 * 彩票投注
 * @param data
 */
export const lotteryBet = async <T>(data: ILotteryParams) => {
  let { params, headers } = FullRequest(data);
  const res = await request<T>(`/api/lottery-client/lottery/lotteryBet`, "POST", params, true, headers);
  if (res instanceof Error && res.message) {
    Toast.show({
      content: res.message,
      getContainer: document.getElementById("msgContainer"),
    });
  }
  return res;
};

/**
 * 获取彩票期号
 * @param data
 * @param name  彩票名称
 */
export const getissue = <T>(data: { name: string }) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/lottery/getissue`, "POST", params, true, headers);
};

/**
 * 获取上期开奖记录
 */
export const getLotteryResultHistoryByName = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/lottery/getAllLotteryLatestResult`, "POST", params, true, headers);
};

/**
 * 获取路单
 */
export const GetWayBill = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/gameRecord/queryGameRecord`, "POST", params, true, headers);
};

/**
 * 获取开奖记录
 */
export const GetHistoryByName = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/lottery/getLotteryResultHistoryByName`, "POST", params, true, headers);
};

/**
 * 获取投注记录
 */
export const GetBetHistoryByName = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/lottery/getBetHistorByUidAndName`, "POST", params, true, headers);
};

/**
 * 获取游戏列表
 */
export const GetCpList = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/config-client/config-client/config/cp/list`, "GET", params, true, headers);
};

/**
 * type 游戏类型
 * queryType  选项类型 1 大小 2 单双 3 龙虎
 * ludanType  路单类型 1 大路 2 大眼路 3 小路 4 小强路
 * issue 期号
 * language
 */
type IGetGoodWayParams = {
  type: string;
  issue: string | number;
  language: string;
};
export const GetGoodWay = <T>(data: IGetGoodWayParams) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/lottery-client/gameRecord/queryGoodGameRecord`, "post", params, true, headers);
};

/**
 * 问路
 */
type IGetAskWayParams = {
  type: string;
  issue: string;
  queryType: number;
  resultType: number;
};
export const GetAskWay = <T>(data: IGetAskWayParams) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`api/lottery-client/gameRecord/queryAskWay`, "post", params, true, headers);
};

/**
 * 大小单双百分比
 */
type IGetPerParams = {
  type: string;
  queryType: number;
};
export const GetPer = <T>(data: IGetPerParams) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`api/lottery-client/gameRecord/queryResultStatistics`, "post", params, true, headers);
};
