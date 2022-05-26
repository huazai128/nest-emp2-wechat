import { lazy } from 'react'
import { RouteProps } from 'react-router-dom';

const Hello = lazy(() => import('@src/page/Hello'));
const Login = lazy(() => import('@src/page/Login'));
const List = lazy(() => import('@src/page/List'));

export const routes: RouteProps[] = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/list',
        component: List,
    },
    {
        path: '/',
        component: Hello,
    },

]