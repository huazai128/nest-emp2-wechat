import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import { RouterCompProps, SwitchRouterProps } from '@src/types'
import { routes } from '@src/routes';

export default function RouterComp(props: RouterCompProps) {
    return (
        <Router>
            <Suspense fallback={props?.fallback ?? null}>
                <SwitchRouter
                    routes={routes}
                    onChange={props?.onChange}
                />
            </Suspense>
        </Router>
    )
}

export const SwitchRouter = ({ routes, onChange }: SwitchRouterProps) => {
    const location = useLocation()
    useEffect(() => {
        onChange?.()
    }, [location, onChange])
    return (
        <Switch>
            {routes &&
                routes?.length > 0 &&
                routes.map((route, i) => (route?.component ? <Route key={i} {...route} /> : null))}
        </Switch>
    )
}
