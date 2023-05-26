import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import React, { Suspense } from "react";

let onRouterBefore: any;
let RouterLoading: any;

//路由导航，设置redirect重定向 和 auth权限
function Guard({ element, meta }: any) {
    const { pathname } = useLocation();
    const nextPath = onRouterBefore ? onRouterBefore(meta, pathname) : pathname;
    if (nextPath && nextPath !== pathname) {
        element = <Navigate to={nextPath} replace={true} />;
    }
    return element;
}


// 路由懒加载
function lazyLoadRouters(page: any, meta: any) {
    meta = meta || {};
    const LazyElement = React.lazy(page);
    const GetElement = () => {
        return (
            <Suspense fallback={<RouterLoading />}>
                <LazyElement />
            </Suspense>
        );
    };
    return <Guard element={<GetElement />} meta={meta} />;
}

function transRoutes(routes: any) {
    const list: any[] = [];
    routes.forEach((route: any) => {
        const obj = { ...route };
        if (obj.redirect) {
            obj.element = <Navigate to={obj.redirect} replace={true} />
        }
        if (obj.page) {
            obj.element = lazyLoadRouters(obj.page, obj.meta)
        }
        if (obj.children) {
            obj.children = transRoutes(obj.children)
        }
        ['redirect', 'page', 'meta'].forEach(name => delete obj[name]);
        list.push(obj)
    });
    return list
}
function RouterGuard(params: any) {
    onRouterBefore = params.onRouterBefore;
    RouterLoading = () => params.loading || <></>;
    return useRoutes(transRoutes(params.routers));
}
export default RouterGuard;