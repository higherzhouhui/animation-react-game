import { FullRequest } from "@/common";
import request from "./server";

/**
 *  获取用户信息
 * @param data
 * @returns
 */
export const getUserInfo = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/center-client/sys/user/get/info`, "POST", params, true, headers);
};

/**
 *
 * @param data 刷新游戏金额
 */
export const getUserAsserGold = <T>(data = {}) => {
  let { params, headers } = FullRequest(data);
  return request<T>(`/api/center-client/sys/user/getUserAsserGold`, "POST", params, true, headers);
};
