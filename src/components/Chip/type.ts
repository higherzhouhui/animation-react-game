// 桌块
type ITableArea = {
  width: number; //每个元素宽
  height: number; //每个元素高
  top: number; //每个元素y坐标
  left: number; //每个元素x坐标
  centerX: number; //每个元素x中心坐标
  centerY: number; //每个元素y中心坐标
  rdY: number; //筹码推荐区域坐标
};

type IBallAddItem = {
  index: number;
  money: number;
  type: string;
  step: "show" | "back" | "hide";
  duration: number;
  hash?: string;
};
