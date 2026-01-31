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
import {
  FormatQuoteOutlined,
  ImageOutlined,
  LightModeOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { Container, IconButton, useTheme } from "@mui/material";
import React from "react";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { FullScreenProgress } from "@/components/FullScreenProgress";
import type { Navigation } from "@toolpad/core";

const calculateLanguage = (langInParams = "", langInStore: string) => {
  const LANGS = new Set(["en", "zh"]);
  const FALLBACK_LANG = "en";

  if (LANGS.has(langInParams)) {
    return langInParams;
  }

  if (LANGS.has(langInStore)) {
    return langInStore;
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
    title: "Background",
    icon: <ImageOutlined />,
  },
  {
    segment: path(lang, "quotes"),
    title: "Quotes",
    icon: <FormatQuoteOutlined />,
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

const DashboardToolbar = () => {
  return (
    <>
      <IconButton>
        <LightModeOutlined />
      </IconButton>
    </>
  );
};

const RootRoute = () => {
  const theme = useTheme();
  const params = useParams();
  const location = useLocation();
  const navigation = useNavigation();
  const langInStore = useSyncStore((s) => s.lang);

  const langInParams = params.lang;
  const language = calculateLanguage(langInParams, langInStore);

  React.useEffect(() => {
    useSyncStore.setState((darft) => {
      darft.lang = language;
    });
  }, [language]);

  if (language !== langInParams) {
    return (
      <Navigate
        to={{
          pathname: `/${language + location.pathname}`,
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
          <DashboardLayout
            slots={{
              toolbarActions: DashboardToolbar,
            }}
          >
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

const createRoutes = (): RouteObject[] => {
  return [
    {
      id: "root",
      path: ":lang?",
      Component: RootRoute,
      HydrateFallback: FullScreenProgress,
      loader: async () => {},
      children: [
        {
          index: true,
          lazy: () => import("./home"),
        },
        {
          path: "quotes",
          lazy: () => import("./quotes"),
        },
        {
          path: "settings",
          lazy: () => import("./settings"),
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
