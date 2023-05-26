const routes = [
  {
    path: "*",
    redirect: "/ft",
  },
  {
    path: "/ft",
    page: () => import("./pages/game/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/race1m",
    page: () => import("./pages/recing/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/tz",
    page: () => import("./pages/dice/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/xocdia",
    page: () => import("./pages/XocDia/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/jsks",
    page: () => import("./pages/Jsks/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/toubao",
    page: () => import("./pages/Toubao/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/WayBill",
    page: () => import("./pages/GameTrade/waybill"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/saiche",
    page: () => import("./pages/race1m/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/yuxx",
    page: () => import("./pages/yuxx/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/txssc",
    page: () => import("./pages/txssc/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/pk10",
    page: () => import("./pages/pk10/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/xyft",
    page: () => import("./pages/xyft/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/yflhc",
    page: () => import("./pages/yflhc/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/daohang",
    page: () => import("./pages/guide/index"),
    meta: {
      auth: false,
    },
  },
];

//全局路由守卫
const onRouteBefore = (meta: any, to: any) => {
  return to;
};

export default routes;

export { onRouteBefore };
