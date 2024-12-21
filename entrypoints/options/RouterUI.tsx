import {
  createHashRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
  useLocation,
  useParams,
} from "react-router";
import React from "react";
import { Layout } from "./Layout";

const LANGS = new Set(["en", "zh"]);
const FALLBACK_LANG = "en";
const getMatchedLang = (path = "", state: string) => {
  if (LANGS.has(path)) {
    return path;
  }

  if (LANGS.has(state)) {
    return state;
  }

  return FALLBACK_LANG;
};

const routes: RouteObject[] = [
  {
    id: "root",
    path: ":lang?",
    Component() {
      const params = useParams();
      const langParams = params.lang;
      const langState = useSyncStore((s) => s.lang);
      const set = useSyncStore((s) => s.set);
      const langMatched = getMatchedLang(langParams, langState);
      const location = useLocation();

      React.useEffect(() => {
        set((d) => {
          d.lang = langMatched;
        });
      }, [langMatched, set]);

      if (langMatched !== langParams) {
        return (
          <Navigate
            to={{
              pathname: `/${langMatched + location.pathname}`,
              search: location.search,
              hash: location.hash,
            }}
            state={location.state}
            replace
          />
        );
      }

      return (
        <Layout key={location.pathname}>
          <Outlet />
        </Layout>
      );
    },
    children: [
      {
        id: "home",
        index: true,
        Component() {
          return <div>Home</div>;
        },
      },
      {
        id: "about",
        path: "about",
        Component() {
          return <div>About</div>;
        },
      },
    ],
  },
];

const router = createHashRouter(routes);

export const RouterUI = () => {
  return <RouterProvider router={router} />;
};
