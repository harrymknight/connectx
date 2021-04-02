import { RouteConfig } from './utils'
import { Login } from './login';
import { Root } from './root'
import { Host } from './host'
import { Profile } from './profile';
import { Matches } from './matches';
import { Match } from './match';
import { Lobby } from './lobby';
import { Play } from './play';

const ROUTES: RouteConfig[] = [
    {
        path: "/login",
        key: "LOGIN",
        exact: true,
        component: Login,
    },
    { 
        path: "/", 
        key: "ROOT", 
        private: true,
        component: Root,
        routes: [
            {
                path: "/profile",
                key: "PROFILE",
                private: true,
                exact: true,
                component: Profile,
            },
            {
                path: "/host",
                key: "HOST",
                private: true,
                exact: true,
                component: Host
            },
            {
                path: "/matches",
                key: "MATCHES",
                private: true,
                exact: true,
                component: Matches
            },
            {
                path: "/:matchName",
                key: "MATCH",
                private: true,
                component: Match,
                routes: [
                    {
                        path: "/:matchName/lobby",
                        key: "LOBBY",
                        private: true,
                        exact: true,
                        component: Lobby,
                    },
                    {
                        path: "/:matchName/play",
                        key: "PLAY",
                        private: true,
                        exact: true,
                        component: Play,
                    }
                ]
            }
        ]
    }
];

export default ROUTES