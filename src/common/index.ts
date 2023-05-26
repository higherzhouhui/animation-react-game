import md5 from "@/util/md5";
import { t } from "i18next";

export const Local = (name: string, value?: any, time?: number) => {
  try {
    let date = Number(new Date().getTime() / 1000);
    if (value === null) {
      localStorage.removeItem(name);
    } else if (value !== undefined) {
      if (time) {
        localStorage.setItem(name, JSON.stringify({ value, time: date + time }));
      } else {
        localStorage.setItem(name, JSON.stringify({ value }));
      }
    } else {
      const v = localStorage.getItem(name);
      if (v) {
        if (JSON.parse(v) && JSON.parse(v).time) {
          if (JSON.parse(v).time - date > 0) {
            return JSON.parse(v).value;
          } else {
            localStorage.removeItem(name);
            return undefined;
          }
        } else return JSON.parse(v).value;
      } else return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

export const Session = (name: string, value?: any, time?: number) => {
  let date = Number(new Date().getTime() / 1000);
  if (value === null) {
    sessionStorage.removeItem(name);
  } else if (value !== undefined) {
    if (time) {
      sessionStorage.setItem(name, JSON.stringify({ value, time: date + time }));
    } else {
      sessionStorage.setItem(name, JSON.stringify({ value }));
    }
  } else {
    const v = sessionStorage.getItem(name);
    if (v) {
      if (JSON.parse(v).time) {
        if (JSON.parse(v).time - date > 0) {
          return JSON.parse(v).value;
        } else {
          sessionStorage.removeItem(name);
          return undefined;
        }
      } else return JSON.parse(v).value;
    } else return undefined;
  }
};
export const FreeTime = (value: string | number | Date, g = "y-m-d") => {
  if (!value) return "";
  let time = new Date(value);

  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let i = time.getMinutes();
  let s = time.getSeconds();
  return g
    .replace("y", y.toString())
    .replace("m", m > 9 ? m.toString() : "0" + m)
    .replace("d", d > 9 ? d.toString() : "0" + d)
    .replace("h", h > 9 ? h.toString() : "0" + h)
    .replace("i", i > 9 ? i.toString() : "0" + i)
    .replace("s", s > 9 ? s.toString() : "0" + s);
};

// 金钱格式
export const moneyType = (text: number | string) => {
  text = Math.floor(parseFloat(String(text)) * 100) / 100;
  return !isNaN(text) ? text.toLocaleString() : "0.00";
};

export const mTime = (time: number) => {
  if (time < 55) {
    function zoreTime(n: number) {
      return n > 9 ? n : "0" + n;
    }
    return `${zoreTime(Math.floor(time / 60))}:${zoreTime(time % 60)}`;
  } else return t("fengpanzhong");
};

/**
 * 初始化用户信息
 */
export const initUser = async () => {
  Local("userId", getParams("userId"));
  Local("liveId", getParams("liveId"));
  Local("lang", getParams("lang"));
  Local("autoUpBalance", getParams("autoUpBalance"));
  return getParams("userId");
};

/**
 * 获取链接参数
 * @param name
 * @returns 传参获取单个值，或者获取全部object
 */
export const getParams = (name?: string) => {
  let pa = location.search.replace("?", "").split("&");
  let arr = pa.reduce((sum: { [x: string]: any }, item, index) => {
    let sj = item.split("=");
    sum[sj[0]] = sj[1];
    return sum;
  }, {});
  return name ? arr[name] : arr;
};

/**
 * 获取范围随机数
 * @param Min 最小
 * @param Max 最大
 */
export const RandomNum = (Min: number, Max: number) => {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.floor(Rand * Range);
  return num;
};

/**
 * 完善/api接口公共请求参数
 * @param data
 */
export const FullRequest = (data = {}) => {
  let timeStamp = new Date().getTime();
  let udid = Local("finger");
  let obj = {
    udid: udid,
    language: "YN",
    timestamp: timeStamp,
    sign: md5(udid + "jgyh,kasd" + timeStamp),
    paySign: md5(udid.substring(0, 6) + "8qiezi" + timeStamp),
    currentUserAppVersion: "2.0.5",
    channel: "",
    version: "1.0.0",
    os: getParams("os") || "5", //5是h5
    platForm: "h5",
    deviceType: "1",
    token: Local("token"),
  };
  let headers = {
    "X-UDID": udid,
    "X-Timestamp": obj.timestamp,
    "X-Language": obj.language,
    "X-Sign": obj.sign,
    Authorization: `HSBox ${obj.token}`,
  };
  return { params: { ...data, ...obj }, headers };
};

/**
 * 获取范围内随机数
 * @param m
 * @param n
 */
export const randNumber = (m: number, n: number) => {
  return Math.ceil(Math.random() * (n - m + 1) + m - 1);
};

/**
 * 获取指定长度哈希值
 * @param hashLength 生成长度
 */
export const createHash = (hashLength: number = 5) => {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
};
