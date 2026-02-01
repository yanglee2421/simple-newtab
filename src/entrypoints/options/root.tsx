import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
  useParams,
} from "react-router";
import {
  NotificationsProvider,
  DialogsProvider,
  DashboardLayout,
} from "@toolpad/core";
import React from "react";
import { Container, useTheme } from "@mui/material";
import { Image, FormatQuote } from "@mui/icons-material";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
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

const calculatePath = (...args: unknown[]) => args.join("/");

const createNavition = (lang: string): Navigation => [
  {
    kind: "header",
    title: "Fontend",
  },
  {
    segment: calculatePath(lang),
    title: "Background",
    icon: <Image />,
  },
  {
    segment: calculatePath(lang, "quotes"),
    title: "Quotes",
    icon: <FormatQuote />,
  },
];

const BRANDING = {
  title: "Simple NewTab",
};

const useNavigation = () => {
  const params = useParams();
  const lang = params.lang;
  return React.useMemo<Navigation>(() => createNavition(String(lang)), [lang]);
};

const DashboardToolbar = () => {
  return <ModeToggle />;
};

export const RootRoute = () => {
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
