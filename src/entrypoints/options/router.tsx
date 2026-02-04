import {
  createHashRouter,
  Link,
  Navigate,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
  useLocation,
  useParams,
} from "react-router";
import React from "react";
import { FullScreenProgress } from "@/components/FullScreenProgress";
import { RootRoute } from "./root";

const DEFAULT_LANG = "en";
const LANGS = new Set(["en", "zh"]);

const calculateLocale = (fallbackLocale: string, localeSegment: string) => {
  if (LANGS.has(localeSegment)) {
    return localeSegment;
  }

  if (LANGS.has(fallbackLocale)) {
    return fallbackLocale;
  }

  return DEFAULT_LANG;
};

const calculateLocalePathname = (pathname: string, locale: string) => {
  const isStartWithSlash = pathname.startsWith("/");

  if (!isStartWithSlash) {
    throw new Error("pathname must start with slash!");
  }

  const segments = pathname.split("/");
  const localeSegment = segments.at(1) || "";

  if (locale === localeSegment) {
    return pathname;
  }

  /**
   * Locale segment already exists
   * just replace it
   */
  if (LANGS.has(localeSegment)) {
    return segments.with(1, locale).join("/");
  }

  /**
   * Locale segment does not exist
   * add it
   */
  return ["", ...segments].with(1, locale).join("/");
};

const LangRoute = () => {
  const params = useParams();
  const location = useLocation();
  const fallbackLang = useSyncStore((store) => store.lang);

  const langInPath = params.lang;
  if (!langInPath) throw new Error("Invalid params lang");

  const lang = calculateLocale(fallbackLang, langInPath);

  React.useEffect(() => {
    useSyncStore.setState((draft) => {
      draft.lang = lang;
    });
  }, [lang]);

  if (lang === langInPath) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={{
        pathname: calculateLocalePathname(location.pathname, lang),
        search: location.search,
        hash: location.hash,
      }}
      state={location.state}
      replace
    />
  );
};

const createRoutes = (): RouteObject[] => {
  return [
    {
      Component: RootRoute,
      HydrateFallback: FullScreenProgress,
      children: [
        {
          index: true,
          loader: async ({ request }) => {
            const url = new URL(request.url);
            const fallbackLocale = useSyncStore.getState().lang;

            url.pathname = calculateLocalePathname(
              url.pathname,
              fallbackLocale,
            );

            throw redirect(url.href);
          },
          Component: () => {
            const location = useLocation();
            const lang = useSyncStore((store) => store.lang);

            return (
              <Navigate
                to={{
                  pathname: calculateLocalePathname(location.pathname, lang),
                  search: location.search,
                  hash: location.hash,
                }}
                state={location.state}
                replace
              />
            );
          },
        },
        {
          path: ":lang",
          loader: async ({ request, params }) => {
            const localeSegment = params.lang;
            if (!localeSegment) throw new Error("Invalid lang params!");

            const fallbackLocale = useSyncStore.getState().lang;
            const locale = calculateLocale(fallbackLocale, localeSegment);

            if (locale === localeSegment) {
              return;
            }

            const url = new URL(request.url);

            url.pathname = calculateLocalePathname(
              url.pathname,
              fallbackLocale,
            );

            throw redirect(url.href);
          },
          Component: LangRoute,
          children: [
            {
              path: "*",
              Component: () => {
                return (
                  <Link
                    to={{
                      pathname: "/",
                    }}
                  >
                    Take me home
                  </Link>
                );
              },
            },
            {
              index: true,
              lazy: () => import("./home"),
            },
            {
              path: "quotes",
              lazy: () => import("./quotes"),
            },
          ],
        },
      ],
    },
  ];
};

const routes = createRoutes();
const router = createHashRouter(routes);

export const OptionsRouter = () => {
  return <RouterProvider router={router} />;
};
