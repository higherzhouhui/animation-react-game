import { IUserInfo } from "@/model/user";
import createContextReducer from "context-reducer";

const getData = () => {
  const modulesFiles = (require as any).context("./modules", true, /\.ts$/);
  const modules = modulesFiles.keys().reduce(
    (modules: any, modulePath: string) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
      const value = modulesFiles(modulePath);
      modules.state[moduleName] = value.default.state;
      modules.model[moduleName] = value.default.model;
      return modules;
    },
    { state: {}, model: {} }
  );
  return modules;
};

/** 初始state值 */
const stateDefault: any = {
  ...getData().state,
};
export const reducer = (
  state: {
    chip: any;
    user: {
      userInfo: IUserInfo;
    };
    [x: string]: any;
  },
  action: any
) => {
  try {
    const { type, payload } = action;
    const [model, event] = type.split("/");
    // mutations
    getData().model[model][event](payload);
    return getData().state;
  } catch (error) {
    return state;
  }
};

export default createContextReducer({ reducer, stateDefault });
