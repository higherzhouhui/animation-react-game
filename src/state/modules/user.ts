import { IUserInfo, initUser } from "@/model/user";
import { getUserAsserGold, getUserInfo } from "@/server/user";
import { BackMoney } from "../../server/game";

const state: {
  userInfo: IUserInfo;
  isBack: boolean;
} = {
  userInfo: initUser,
  isBack: false,
};
const model = {
  async freshUserInfo(obj: { type: string } = { type: "" }) {
    if (state.userInfo.uid > 0) {
      const res: any = await getUserAsserGold();
      state.userInfo.goldCoin = res.goldCoin;
      window.parent.postMessage({ type: "freshMoney", money: state.userInfo.goldCoin }, "*");
    } else {
      const res = await getUserInfo<IUserInfo>();
      state.userInfo = res;
      if (obj.type === "SetFollowAble") {
        window.$bus.emit("store", { type: "SetFollowAble" });
      }
      //一键回收逻辑
      if (Number(res.goldCoin) < 1 && !state.isBack) {
        BackMoney<any>({ uid: state.userInfo.uid }).then((e) => {
          state.userInfo.goldCoin = e.allBalance;
          state.isBack = true;
          window.parent.postMessage({ type: "freshMoney", money: state.userInfo.goldCoin }, "*");
        });
      }
    }
  },
};
export default {
  state,
  model,
};
