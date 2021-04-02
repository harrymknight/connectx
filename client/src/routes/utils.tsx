import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useUser } from "../contexts/auth";

export interface RouteConfig {
  path: string;
  key: string;
  exact?: boolean;
  private?: boolean;
  routes?: RouteConfig[];
  component: React.FC<any>;
}

/**
 * A wrapper for <Route> that redirects to the login
 * screen if you're not yet authenticated.
 */
function PrivateRoute(route: RouteConfig) {
  const user = useUser();
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={props =>
        user ? (
          <route.component {...props} routes={route.routes} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )}
    />
  );
}

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes(route: RouteConfig) {
  return (
    route.private ? (
      <PrivateRoute {...route} />
    ) : (
      <Route
      path={route.path}
      exact={route.exact}
      render={props => <route.component {...props} routes={route.routes} />}
    />
    )
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property)
 */
export function RenderRoutes({ routes }: any) {
  return (
    <Switch>
      {routes.map((route: any, _i: any) => {
        return <RouteWithSubRoutes {...route} />
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
}