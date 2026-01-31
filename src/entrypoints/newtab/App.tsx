import {
  alpha,
  Box,
  CardContent,
  CardHeader,
  Drawer,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Typography,
  useTheme,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CloseOutlined,
  RestoreOutlined,
  Settings,
  Wallpaper,
} from "@mui/icons-material";
import React from "react";
import { loadSlim } from "@tsparticles/slim";
import { useLiveQuery } from "dexie-react-hooks";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { loadBubblesPreset } from "@tsparticles/preset-bubbles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { db } from "@/utils/db";
import snowVillage from "./snowVillage.jpg";
import { FullScreenProgress } from "@/components/FullScreenProgress";

export const App = () => {
  useSubscribeSyncStoreChange();

  return (
    <QueryProvider>
      <NewTab />
    </QueryProvider>
  );
};

const NewTab = () => {
  const [show, setShow] = React.useState(false);
  const [showContextMenu, setShowContentMenu] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const alphaVal = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);
  const preset = useSyncStore((s) => s.preset);
  const gallery = useSyncStore((store) => store.gallery);

  const set = useSyncStore.setState;

  const handleContextMenuClose = () => {
    setShowContentMenu(false);
    setMouseX(0);
    setMouseY(0);
  };

  const handleNextWallpare = () => {
    handleContextMenuClose();
    set((draft) => {
      const index = draft.gallery.indexOf(draft.wallpaperId);
      const length = draft.gallery.length || 1;
      const nextIndex = (index + 1) % length;
      const nextId = draft.gallery.at(nextIndex) || 0;

      draft.wallpaperId = nextId;
    });
  };

  const handleSettingsClick = () => {
    handleContextMenuClose();
    setShow(true);
  };

  return (
    <React.Suspense fallback={<FullScreenProgress />}>
      <Background />
      <ContentWrapper
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContentMenu((previous) => !previous);
          setMouseX(e.clientX);
          setMouseY(e.clientY);
        }}
      >
        <Content />
        <Menu
          open={showContextMenu}
          onClose={handleContextMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={{
            left: mouseX,
            top: mouseY,
          }}
        >
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="设置" />
          </MenuItem>
          {gallery.length > 1 && (
            <MenuItem onClick={handleNextWallpare}>
              <ListItemIcon>
                <Wallpaper />
              </ListItemIcon>
              <ListItemText primary="下一张壁纸" />
            </MenuItem>
          )}
        </Menu>
      </ContentWrapper>
      <Drawer open={show} onClose={() => setShow(false)} anchor="bottom">
        <CardHeader
          title="Settings"
          action={
            <>
              <IconButton
                onClick={() => {
                  set(useSyncStore.getInitialState());
                }}
              >
                <RestoreOutlined />
              </IconButton>
              <IconButton
                onClick={() => {
                  setShow(false);
                }}
              >
                <CloseOutlined color="error" />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <Grid container spacing={6}>
            <Grid size={12}>
              <FormLabel>Particles Preset</FormLabel>
              <RadioGroup
                value={preset}
                onChange={(e, value) => {
                  void e;
                  switch (value) {
                    case "snow":
                    case "links":
                    case "bubbles":
                    case "":
                      set((d) => {
                        d.preset = value;
                      });
                  }
                }}
                row
              >
                <FormControlLabel
                  control={<Radio value="snow" />}
                  label="Snow"
                />
                <FormControlLabel
                  control={<Radio value={"links"} />}
                  label="Links"
                />
                <FormControlLabel
                  control={<Radio value={"bubbles"} />}
                  label="Bubbles"
                />
                <FormControlLabel control={<Radio value={""} />} label="None" />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormLabel>Alpha</FormLabel>
              <Slider
                value={alphaVal}
                onChange={(e, value) => {
                  if (typeof value !== "number") {
                    return e;
                  }

                  set((d) => {
                    d.alpha = value;
                  });
                }}
                max={100}
                min={0}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormLabel>Blur</FormLabel>
              <Slider
                value={blur}
                onChange={(e, value) => {
                  if (typeof value !== "number") {
                    return e;
                  }

                  set((d) => {
                    d.blur = value;
                  });
                }}
                max={100}
                min={0}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Drawer>
    </React.Suspense>
  );
};

const ContentWrapper = styled("div")({});

const createAssetsHref = (path: string) => {
  return new URL(path, import.meta.url).href;
};

const createPasticlesInitializer = () => {
  return initParticlesEngine(async (e) => {
    await loadSnowPreset(e);
    await loadLinksPreset(e);
    await loadBubblesPreset(e);
    await loadSlim(e);
  });
};

const StyledBackgroundImage = styled("div")({
  position: "fixed",
  zIndex: 1,

  backgroundSize: "cover",
  backgroundPosition: "50%",
});

const StyledBackgroundImageWrapper = styled("div")({
  position: "relative",
  zIndex: 0,
  isolation: "isolate",
});

const Particle = () => {
  const preset = useSyncStore((store) => store.preset);

  return <Particles options={{ preset, background: { opacity: 0 } }} />;
};

const BackgroundImage = () => {
  const blur = useSyncStore((store) => store.blur);
  const backgroundImage = useCurrentBgHref();

  const blurValue = blur / 5;

  return (
    <StyledBackgroundImageWrapper>
      <StyledBackgroundImage
        style={{
          inset: -2 * blurValue,
          filter: `blur(${blurValue}px)`,
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
    </StyledBackgroundImageWrapper>
  );
};

const Background = () => {
  React.use(particlesInit);

  return (
    <>
      <BackgroundImage />
      <Mask />
      <Particle />
    </>
  );
};

const Mask = () => {
  const alpha = useSyncStore((store) => store.alpha);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        backgroundColor: `rgba(0,0,0,${alpha / 100})`,
      }}
    />
  );
};

const particlesInit = createPasticlesInitializer();

const onAnimationFrame = (cb: () => void) => {
  let animate = 0;

  const run = () => {
    animate = requestAnimationFrame(run);
    cb();
  };

  run();

  return () => cancelAnimationFrame(animate);
};

const useLocaleTime = (locales?: Intl.LocalesArgument) => {
  return React.useSyncExternalStore(onAnimationFrame, () =>
    getTimeString(locales),
  );
};

const getTimeString = (locales?: Intl.LocalesArgument) => {
  return new Date().toLocaleTimeString(locales, {
    timeStyle: "short",
    hour12: false,
  });
};

const useLocaleDate = (locales?: Intl.LocalesArgument) => {
  return React.useSyncExternalStore(
    onAnimationFrame,
    () => getDateString(locales),
    () => getDateString(locales),
  );
};

const getDateString = (locales?: Intl.LocalesArgument) => {
  return new Date().toLocaleDateString(locales, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
};

const calculateIsChinese = () => {
  return /^zh\b/i.test(navigator.language);
};

const calculateChineseLunar = (date: Date) => {
  const isChinese = calculateIsChinese();
  if (!isChinese) return "";

  const dateFormater = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateFormater.format(date);
};

const Clock = () => {
  const time = useLocaleTime();
  const date = useLocaleDate();
  const theme = useTheme();

  const lunar = calculateChineseLunar(new Date());

  return (
    <Box>
      <Typography
        component={"time"}
        variant="h1"
        sx={{
          color: theme.palette.common.white,
          textAlign: "center",
          display: "block",
          userSelect: "none",
        }}
      >
        {time}
      </Typography>
      <Typography
        component={"time"}
        variant="subtitle1"
        sx={{
          color: alpha(
            theme.palette.common.white,
            1 - theme.palette.action.activatedOpacity,
          ),
          textAlign: "center",
          display: "block",
          userSelect: "none",
        }}
      >
        {date}
      </Typography>
      <React.Activity mode={lunar ? "visible" : "hidden"}>
        <Typography
          component={"time"}
          variant="subtitle2"
          sx={{
            color: alpha(
              theme.palette.common.white,
              1 - theme.palette.action.activatedOpacity,
            ),
            textAlign: "center",
            display: "block",
            userSelect: "none",
          }}
        >
          {lunar}
        </Typography>
      </React.Activity>
    </Box>
  );
};

const Quotes = () => {
  const quote = useLiveQuery(async () => {
    const count = await db.quotes.count();
    const index = Math.floor(Math.random() * count);
    return db.quotes.offset(index).limit(1).first();
  }, []);

  if (!quote) return null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          marginTop: "auto",
        }}
      >
        <Typography
          sx={{
            color: (theme) => alpha(theme.palette.common.white, 1),
            lineHeight: "20px",
          }}
          variant="overline"
        >
          「&nbsp;{quote.content}&nbsp;」
        </Typography>
        <Typography
          sx={{
            lineHeight: "20px",
            color: (theme) => alpha(theme.palette.common.white, 1),
            opacity: quote.anthor ? 1 : 0,
          }}
          variant="overline"
        >
          -{quote.anthor}-
        </Typography>
      </Box>
    </>
  );
};

const Content = () => {
  return (
    <ContentContainer>
      <ColckWrapper>
        <Clock />
      </ColckWrapper>
      <Quotes />
    </ContentContainer>
  );
};

const ContentContainer = styled("div")({
  position: "relative",
  zIndex: 1,
  inlineSize: "100dvw",
  blockSize: "100dvh",

  display: "flex",
  flexDirection: "column",
});

const ColckWrapper = styled("div")({
  marginBlockStart: "calc(100dvh/55*21)",
  transform: "translate3d(0,-50%,0)",
});

const useCurrentBgHref = () => {
  const wallpaperId = useSyncStore((store) => store.wallpaperId);
  const gallery = useSyncStore((store) => store.gallery);

  const id = calculateBackgroundId(gallery, wallpaperId);

  const background = useBackground(id);

  const objectURL = useObjectURL(background.data?.file);
  if (!objectURL) return createAssetsHref(snowVillage);

  return objectURL;
};

const calculateBackgroundId = (gallery: number[], wallpaperId: number) => {
  const isIncludesWallpaperId = gallery.includes(wallpaperId);
  if (isIncludesWallpaperId) return wallpaperId;

  if (gallery.length > 0) {
    return gallery[0];
  }

  return 0;
};
