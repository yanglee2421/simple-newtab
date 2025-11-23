import {
  createHashRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useParams,
} from "react-router";
import {
  NotificationsProvider,
  DialogsProvider,
  DashboardLayout,
} from "@toolpad/core";
import { ImageOutlined, SettingsOutlined } from "@mui/icons-material";
import React from "react";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { Navigation } from "@toolpad/core";
import { Container, useTheme } from "@mui/material";

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

const path = (...args: unknown[]) => args.join("/");

const langToNavition = (lang: string): Navigation => [
  {
    kind: "header",
    title: "Fontend",
  },
  {
    segment: path(lang),
    title: "Dashboard",
    icon: <ImageOutlined />,
  },
  {
    segment: path(lang, "settings"),
    title: "Settings",
    icon: <SettingsOutlined />,
  },
];

const useNavigation = () => {
  const params = useParams();
  const lang = params.lang;
  return React.useMemo<Navigation>(() => langToNavition(String(lang)), [lang]);
};

const BRANDING = {
  title: "Simple NewTab",
};

const RootRoute = () => {
  const theme = useTheme();
  const params = useParams();
  const location = useLocation();
  const navigation = useNavigation();
  const langState = useSyncStore((s) => s.lang);

  const langParams = params.lang;
  const langMatched = getMatchedLang(langParams, langState);

  React.useEffect(() => {
    useSyncStore.setState((darft) => {
      darft.lang = langMatched;
    });
  }, [langMatched]);

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
    <ReactRouterAppProvider
      navigation={navigation}
      branding={BRANDING}
      theme={theme}
    >
      <NotificationsProvider
        slotProps={{
          snackbar: {
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 1000 * 3,
          },
        }}
      >
        <DialogsProvider>
          <DashboardLayout>
            <Container>
              <Outlet />
            </Container>
          </DashboardLayout>
        </DialogsProvider>
      </NotificationsProvider>
      <ScrollRestoration />
    </ReactRouterAppProvider>
  );
};

const routes: RouteObject[] = [
  {
    id: "root",
    path: ":lang?",
    Component: RootRoute,
    children: [
      {
        index: true,
        lazy: () => import("./home"),
      },
      {
        path: "settings",
        lazy: () => import("./settings"),
      },
    ],
  },
];

const router = createHashRouter(routes);

export const OptionsRouter = () => {
  return <RouterProvider router={router} />;
};
