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
import wxtLogo from "@/assets/wxt.svg";
import type { Branding, Navigation } from "@toolpad/core";

const calculateAssetsHref = (path: string) => {
  return new URL(path, import.meta.url).href;
};

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

const calculatePath = (...args: unknown[]) => {
  return args.join("/");
};
const createNavition = (lang: string): Navigation => [
  {
    kind: "header",
    title: "设置",
  },
  {
    segment: calculatePath(lang),
    title: "背景设置",
    icon: <Image />,
  },
  {
    segment: calculatePath(lang, "quotes"),
    title: "每日一言",
    icon: <FormatQuote />,
  },
];

const createBranding = (): Branding => {
  const logoHref = calculateAssetsHref(wxtLogo);

  return {
    title: "标签页设置",
    logo: <img src={logoHref} alt="logo" width={24} height={24} />,
  };
};

const BRANDING: Branding = createBranding();

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
