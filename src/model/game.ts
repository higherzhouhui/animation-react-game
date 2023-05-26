import { Local } from "@/common";

// 番摊游戏数据主体
export type IGameContent = {
  value: number;
  type_show?: string[];
  type: string;
  name?: string;
  typeName: string;
  typeText: string;
};
// 游戏记录
export type IGameRecord = {
  list: IGameRecordList[];
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
};
// 游戏记录列表
export type IGameRecordList = {
  createTime: string;
  createUser: string;
  createUserId: string;
  deleteTime: number;
  id: number;
  isOpen: boolean;
  openNumber: string;
  openOptional: string;
  openResult: string[];
  openSingleOrDoubled: boolean;
  openTime: string;
  sortIdx: number;
  tenantSys: string;
  updateTime: string;
  updateUser: string;
  updateUserId: string;
};

export type IBtiParams = {
  userId: string;
  userBetList: {
    betMoney: number;
    betOptional?: string;
  }[];
  spData: { liveId: string; times: string | number };
};

export type ILastHistory = {
  createTime: string;
  createUser: string;
  createUserId: string;
  deleteTime: number;
  id: number;
  isOpen: boolean;
  jackpotId: number;
  openOptional: IGameType;
  openResult: string[] | number[];
  openSingleOrDoubled: string;
  openTime: string;
  sortIdx: number;
  tenantSys: string;
  updateTime: string;
  updateUser: string;
  updateUserId: string;
};

export type IGameType = "FOUR_WHITE" | "THREE_WHITE_ONE_RED" | "TWO_RED_TWO_WHITE" | "SINGLE" | "DOUBLED" | "FOUR_RED" | "THREE_RED_ONE_WHITE" | "FOUR_RED_OR_FOUR_WHITE";

export type IGameFollow = {
  gameList: IGameType[];
  money: number;
  times: 3;
  type: "follow" | "getBalance";
};

export type IBackAllGameCoin = {
  uid: number;
};

export type TypeInitCar = { name: number | string; offsetX: number };

export const initCar = (): TypeInitCar[] => [
  { name: "1", offsetX: 0 },
  { name: "2", offsetX: 0 },
  { name: "3", offsetX: 0 },
  { name: "4", offsetX: 0 },
  { name: "5", offsetX: 0 },
  { name: "6", offsetX: 0 },
  { name: "7", offsetX: 0 },
  { name: "8", offsetX: 0 },
  { name: "9", offsetX: 0 },
  { name: "10", offsetX: 0 },
];

//彩票下注
export type ILotteryParams = {
  uid: number | string;
  deviceType: "1";
  isStop: 0;
  playNum: {
    num: string;
    name: string;
    rebate: 0;
    type: string;
    type_text: string;
    money: number;
    notes: 1;
  }[];
  liveId?: string | number;
  expect: [
    {
      expect: string;
      isLHC: false;
      multiple: 1;
    }
  ];
  times: 1;
  lotteryName: string;
  isHemai: 0;
};

/**
 * 根据金额，游戏名称返回游戏投注所需数据组装格式
 * @param option
 * @param num 注点名称，如大小单双/1/2/3/4/5/6
 * @param uid 用户id
 * @param lotteryName 彩票格式字段
 * @param type 定义的投注类型简写；如：BZ(豹子),HZ(和值)
 * @param type_text 定义的投注类型中文
 * @param money 金额
 * @param liveId 直播间id
 * @param expect 期号
 *
 */
export const initLotteryParams = (option: { num: string; uid: number; lotteryName: string; type: string; type_text: string; money: number; liveId?: string; expect: string; lname?: string }): ILotteryParams => {
  const { uid, num, lotteryName, type, type_text, money, liveId, expect, lname } = option;
  let params: ILotteryParams = {
    uid,
    deviceType: "1",
    isStop: 0,
    playNum: [
      {
        num,
        name: lname || lotteryName,
        rebate: 0,
        type,
        type_text,
        money,
        notes: 1,
      },
    ],
    expect: [
      {
        expect,
        isLHC: false,
        multiple: 1,
      },
    ],
    times: 1,
    lotteryName: lotteryName,
    isHemai: 0,
  };
  if (liveId) params.liveId = liveId;
  return params;
};

// 彩票期数接口返回定义
export type IIssue = {
  down_time: number;
  expect: string;
  name: string;
  nickName: string;
  timelong: string;
};

export type ILotteryHistory = {
  expect: string;
  id: number;
  lotteryName: string;
  lotteryResult: string[];
  nickName: string;
};

export type IGameArrayType = {
  type: string;
  layout: number;
  icon?: string;
  tabel: {
    name: any;
    odds: number;
    winFn: (e: string[]) => boolean;
    num: string;
    lname: string;
    type: string;
    type_text: string;
    ball?: string[];
  }[];
};

export type IFollowGame = { money: string; type: string; num: string; lotteryType: string; lotteryName: string };

export type IGameIssue = { down_time: number; expect: string; name: string; nickName: string; timelong: string };

export type ICpList = { chinese: string; gameType: number; icon: string; id: number; name: string; playMethod: string };

export type ILotteryResult = {
  expect: string;
  id: number;
  lotteryResult: string[];
};

export type ILotteryResult2 = {
  awardStatus: number;
  betAmount: number;
  createTime: number;
  expect: string;
  icon: string;
  lotteryId: number;
  lotteryName: string;
  nickName: string;
  payMethd: number;
  playNumReq: {
    awardMount: number;
    expect: string;
    id: number;
    liveId: number;
    lotteryName: string;
    money: number;
    notes: number;
    num: string;
    numShoW: number;
    realProfitAmount: number;
    rebate: number;
    type: string;
    type_text: string;
    type_textShow: string;
  };
  realProfitAmount: number;
  resultList: string[] | number[];
  times: number;
  uid: number;
  updateTime: number;
  winningNumbers: string;
};

export type IGoodWayList = () => {
  goodLuVO: {
    endIssue: string;
    flagFinish: boolean;
    issueNumber: number;
    startIssue: string;
  };
  ludanTypeName: string;
  queryGameRecordVOS: { createTime: number; curResultOpen: number; description: string; id: number; issue: string; ludanType: number; name: string; playMethod: number; result: string; selectType: number; status: number; updateTime: number; x: number; y: number }[];
  queryTypeName: string;
};
