import { Local } from "@/common";

type IChipType = {
  type: string;
  list: IBallAddItem[];
  lotteryName?: string;
  downTime?: number;
};
const initCustomerChip = () => {
  let cache = Local(`${location.pathname.replace("/", "")}Data`);
  console.log("获取缓存");
  if (cache) {
    return cache.data;
  } else
    return [
      { type: "tabelArea0", list: [] },
      { type: "tabelArea1", list: [] },
      { type: "tabelArea2", list: [] },
      { type: "tabelArea3", list: [] },
      { type: "tabelArea4", list: [] },
      { type: "tabelArea5", list: [] },
      { type: "tabelArea6", list: [] },
      { type: "tabelArea7", list: [] },
      { type: "tabelArea8", list: [] },
      { type: "tabelArea9", list: [] },
    ];
};

const initSelfChip = () => {
  let cache = Local(`${location.pathname.replace("/", "")}SelfData`);
  console.log("获取缓存");
  if (cache) {
    return cache.data;
  } else
    return [
      { type: "tabelArea0", list: [] },
      { type: "tabelArea1", list: [] },
      { type: "tabelArea2", list: [] },
      { type: "tabelArea3", list: [] },
      { type: "tabelArea4", list: [] },
      { type: "tabelArea5", list: [] },
      { type: "tabelArea6", list: [] },
      { type: "tabelArea7", list: [] },
      { type: "tabelArea8", list: [] },
      { type: "tabelArea9", list: [] },
    ];
};

const state: {
  customerChip: IChipType[];
  selfChip: IChipType[];
  followAble: boolean; //是否可以跟投
} = {
  customerChip: initCustomerChip(),
  selfChip: initSelfChip(),
  followAble: false,
};
const model = {
  initChip() {
    state.customerChip = initCustomerChip();
    state.selfChip = initSelfChip();
  },
  //设置模拟投注筹码
  SetCustomerChip(payload: IChipType) {
    let { lotteryName, downTime } = payload;
    let index = state.customerChip.findIndex((v) => payload.type === v.type);
    state.customerChip[index].list = payload.list;
    Local(
      `${lotteryName!}Data`,
      {
        type: lotteryName,
        data: state.customerChip.map((v) => {
          v.list.map((val) => (val.duration = 0));
          return v;
        }),
      },
      downTime!
    );
  },
  //设置自己投注筹码
  SetSelfChip(payload: IChipType) {
    let { lotteryName, downTime } = payload;
    let index = state.selfChip.findIndex((v) => payload.type === v.type);
    state.selfChip[index].list = payload.list;

    Local(
      `${lotteryName!}SelfData`,
      {
        type: lotteryName,
        data: state.selfChip.map((v) => {
          v.list.map((val) => (val.duration = 0));
          return v;
        }),
      },
      downTime!
    );
  },
  //清空数据
  clearData() {
    state.customerChip = [
      { type: "tabelArea0", list: [] },
      { type: "tabelArea1", list: [] },
      { type: "tabelArea2", list: [] },
      { type: "tabelArea3", list: [] },
      { type: "tabelArea4", list: [] },
      { type: "tabelArea5", list: [] },
      { type: "tabelArea6", list: [] },
      { type: "tabelArea7", list: [] },
      { type: "tabelArea8", list: [] },
      { type: "tabelArea9", list: [] },
      { type: "tabelArea10", list: [] },
    ];
    state.selfChip = [
      { type: "tabelArea0", list: [] },
      { type: "tabelArea1", list: [] },
      { type: "tabelArea2", list: [] },
      { type: "tabelArea3", list: [] },
      { type: "tabelArea4", list: [] },
      { type: "tabelArea5", list: [] },
      { type: "tabelArea6", list: [] },
      { type: "tabelArea7", list: [] },
      { type: "tabelArea8", list: [] },
      { type: "tabelArea9", list: [] },
      { type: "tabelArea10", list: [] },
    ];
  },
  SetFollowAble(e: boolean) {
    state.followAble = e;
  },
};
export default {
  state,
  model,
};
