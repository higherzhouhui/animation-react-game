import axios from "axios";
import { Toast } from "antd-mobile";
import i18n from "@/lang/i18n";

const baseUrl = "";
const isNoBodyMethod = (method: string) => ["get", "delete"].includes(method.toLowerCase());
axios.defaults.withCredentials = true;
const pending = new Map();
const addPending = (config: any) => {
  const key = [config.method, config.url].join("&");
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pending.has(key)) pending.set(key, cancel);
  });
};

const delay = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, time * 1000);
  });
};
const removePending = (config: any) => {
  const key = [config.method, config.url].join("&");
  if (pending.has(key)) {
    const cancel = pending.get(key);
    cancel(key);
    pending.delete(key);
  }
};

type IMethod = "GET" | "POST" | "DELETE" | "get" | "post";

const getGameLang = () => {
  switch (i18n.language) {
    case "JP":
      return "ja-JP";
    case "YN":
      return "vi-VN";
    case "CN":
      return "zh-CN";
    default:
      return "zh-CN";
  }
};

const getSys = () => {
  switch (i18n.language) {
    case "YN":
      return "fbs-yn";
    case "JP":
      return "kaijibet";
    default:
      return "fbs-yn";
  }
};

// 添加请求拦截器
axios.interceptors.request.use((config: any) => {
  config.data = config.data || {};
  let params = { ...config.data };
  params.timestamp = new Date().getTime();
  config.url = baseUrl + config.url;
  config.headers = Object.assign(config.headers, {
    "Accept-Language": getGameLang(),
    tenantSys: getSys(),
  });
  if (isNoBodyMethod(config.method)) {
    config.params = params;
  }
  if (config.hasRemovePending) {
    // // 先判斷是否有重複的請求要取消
    removePending(config);
  }
  addPending(config);
  return config;
});
//响应拦截
axios.interceptors.response.use(
  (res) => {
    removePending(res);
    try {
      const json = res.data;
      //返回数据
      if (json.code === 200) {
        return json.data;
      } else if (json.code === 0) {
        return json.data;
      } else if (json.data) {
        return json.data;
      } else {
        // Toast.show(json.msg);
        return new Error(json.msg);
      }
    } catch (error: any) {
      return new Error(error);
    }
  },
  async (error) => {
    try {
      if (error.config.reTry > 0) {
        await delay(3);
        return request(error.config.url, error.config.method, error.config.data, error.config.hasConfig, error.config.headers, error.config.reTry - 1);
      } else {
        console.log(error);
        // if (error.response && error.response.data) Toast.show(error.response.data.msg || error.response.data.message);
        // else Toast.show(error.message || i18n.t("wang_luo_yc"));
        return Promise.reject(error);
      }
    } catch (err: any) {
      // Toast.show(err || i18n.t("wang_luo_yc"));
      return Promise.reject(err);
    }
  }
);

const doRequest = <T>(options: { url: string; method: IMethod; data: any; hasConfig: boolean; headers: any; reTry: number; [x: string]: any }) => {
  options.timeout = 15000;
  return axios.request(options) as Promise<T>;
};

const request = <T>(url: string, method: IMethod = "get", data: any = {}, hasConfig = true, headers: any = {}, reTry = 3): Promise<T> => {
  return doRequest<T>({ url, method, data, hasConfig, headers, reTry });
};

export default request;
