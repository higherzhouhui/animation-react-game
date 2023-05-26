import _ from "lodash";

export type IList = {
  ludanType: number;
  pointString: string;
  resultType: 1;
  resultReward: string;
  issue: string;
};

export type IUseList = {
  issue: string;
  value: string;
};

export const setDataList = (list: IList[]) => {
  let min = _.min(list.map((a) => Number(a.pointString.split(",")[0])));
  let data = list.map((a) => {
    return {
      value: `${a.resultType}`,
      x: Number(a.pointString.split(",")[0]) - min,
      y: a.pointString.split(",")[1],
      issue: a.issue,
    };
  });
  let result = data.reduce((sum: any, item) => {
    if (!sum[item.x]) sum[item.x] = Array(6).fill("");
    sum[item.x][item.y] = {
      value: item.value.replace("1", "blue").replace("2", "red"),
      issue: item.issue,
    };
    return sum;
  }, []);
  let res: IUseList[][] = exchangeArray(result.concat(Array(_.max([0, 20 - result.length])).fill(Array(6).fill(""))));
  return res;
};

const exchangeArray = (arr: any) => {
  let newArray: any = [];
  arr.forEach((item: any, index: any) => {
    item.forEach((item: any, iindex: any) => {
      if (!newArray[iindex]) newArray[iindex] = [];
      newArray[iindex][index] = item;
    });
  });
  return newArray;
};
