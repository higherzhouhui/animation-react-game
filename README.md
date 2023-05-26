# react-game

跟投定义

[
{
type: "FOUR_WHITE",
},
{
type: "THREE_WHITE_ONE_RED",
},
{
type: "TWO_RED_TWO_WHITE",
},
{
type: "SINGLE",
},
{
type: "DOUBLED",
},
{
type: "FOUR_RED",
},
{
type: "THREE_RED_ONE_WHITE",
},
{
type: "FOUR_RED_OR_FOUR_WHITE",
}
]

跟投触发 js 方法：postMsg()
/\*\*

-
- @string type "follow:跟投"
- @number money "单个注点金额"
- @number times "倍率"
- @TypeGame gameList "注点数组"
- TypeGame:"FOUR_WHITE":4 白
-           "THREE_WHITE_ONE_RED":3白1红
-           "TWO_RED_TWO_WHITE":2白2红
-           "SINGLE":单
-           "DOUBLED":双
-           "FOUR_RED":4红
-           "THREE_RED_ONE_WHITE":3红1白
-           "FOUR_RED_OR_FOUR_WHITE":4红4白
- 例：postMsg({
  type:"follow",
  money:5,
  times:3,
  gameList:["FOUR_WHITE","FOUR_RED","FOUR_RED_OR_FOUR_WHITE"]
  })
  \*/

赛车游戏 60 秒，赛车游戏 0 秒后停止下注 5 秒，然后从 55 秒计时
动画结束后有“游戏开始”提示

/\*\*

- 赛车游戏
- @param token // 登陆 token
- @param liveId //直播间 id
- @param device //固定字符串:"ios","android"
  \*/
  "/recing?token=token&liveId=liveId&device=device"

/\*\*

- 骰子游戏
- @param token // 登陆 token
- @param liveId //直播间 id
- @param device //固定字符串:"ios","android"
  \*/
  "/dice?token=token&liveId=liveId&device=device"
