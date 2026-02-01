import {
  alpha,
  Box,
  Typography,
  useTheme,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Settings, Wallpaper } from "@mui/icons-material";
import React from "react";
import { loadSlim } from "@tsparticles/slim";
import { useLiveQuery } from "dexie-react-hooks";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { loadBubblesPreset } from "@tsparticles/preset-bubbles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { browser } from "wxt/browser";
import { db } from "@/utils/db";
import snowVillage from "./snowVillage.jpg";
import { usePrefetchQuery } from "@tanstack/react-query";

const calculateBackgroundId = (gallery: number[], wallpaperId: number) => {
  const isIncludesWallpaperId = gallery.includes(wallpaperId);
  if (isIncludesWallpaperId) return wallpaperId;

  if (gallery.length > 0) {
    return gallery[0];
  }

  return 0;
};

const calculateNextIndex = (index: number, length: number) => {
  const indexPlusOne = index + 1;
  const minLength = Math.max(length, 1);

  return indexPlusOne % minLength;
};

const calculateAssetsHref = (path: string) => {
  return new URL(path, import.meta.url).href;
};

const calculateMaskColor = (alpha: number) => {
  return `rgba(0,0,0,${alpha / 100})`;
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

const particlesInitializer = () => {
  return initParticlesEngine(async (e) => {
    await loadSnowPreset(e);
    await loadLinksPreset(e);
    await loadBubblesPreset(e);
    await loadSlim(e);
  });
};

const particlesPromise = particlesInitializer();

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
  inset: 0,
});

const StyledMask = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: 0,
});

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

const useBackgroundImage = () => {
  const wallpaperId = useSyncStore((store) => store.wallpaperId);
  const gallery = useSyncStore((store) => store.gallery);

  const id = calculateBackgroundId(gallery, wallpaperId);

  const background = useBackground(id);

  const objectURL = useObjectURL(background.data?.file);
  if (!objectURL) return calculateAssetsHref(snowVillage);

  return objectURL;
};

const NewTab = () => {
  const [showContextMenu, setShowContentMenu] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const maskRef = React.useRef<HTMLDivElement>(null);

  const alpha = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);
  const preset = useSyncStore((s) => s.preset);
  const gallery = useSyncStore((store) => store.gallery);
  const backgroundImage = useBackgroundImage();
  const wallpaperId = useSyncStore((store) => store.wallpaperId);

  const backgroundId = calculateBackgroundId(gallery, wallpaperId);
  const currentIndex = gallery.indexOf(backgroundId);
  const nextIndex = calculateNextIndex(currentIndex, gallery.length);
  const nextId = gallery.at(nextIndex) || 0;

  usePrefetchQuery(fetchBackground(nextId));

  const set = useSyncStore.setState;

  const handleContextMenuClose = () => {
    setShowContentMenu(false);
    setMouseX(0);
    setMouseY(0);
  };

  const handleNextWallpare = async () => {
    handleContextMenuClose();

    const el = maskRef.current;
    const duration = 250;

    const animationOne = await el?.animate(
      [
        { backgroundColor: calculateMaskColor(alpha) },
        { backgroundColor: calculateMaskColor(100) },
      ],
      { duration },
    ).finished;

    animationOne?.commitStyles?.();

    set((draft) => {
      const currentId = calculateBackgroundId(draft.gallery, draft.wallpaperId);
      const index = draft.gallery.indexOf(currentId);
      const length = draft.gallery.length;
      const nextIndex = calculateNextIndex(index, length);
      const nextId = draft.gallery.at(nextIndex) || 0;

      draft.wallpaperId = nextId;
    });

    const animationTwo = await el?.animate(
      [
        { backgroundColor: calculateMaskColor(100) },
        { backgroundColor: calculateMaskColor(alpha) },
      ],
      { duration },
    ).finished;

    animationTwo?.commitStyles?.();
  };

  const handleSettingsClick = async () => {
    handleContextMenuClose();
    await browser.runtime.openOptionsPage();
  };

  return (
    <>
      <Background
        alpha={alpha}
        blur={blur}
        backgroundImage={backgroundImage}
        preset={preset}
        ref={maskRef}
      />
      <ContentContainer
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContentMenu((previous) => !previous);
          setMouseX(e.clientX);
          setMouseY(e.clientY);
        }}
      >
        <ColckWrapper>
          <Clock />
        </ColckWrapper>
        <Quotes />
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
      </ContentContainer>
    </>
  );
};

type BackgroundProps = {
  preset: string;
  alpha: number;
  blur: number;
  backgroundImage: string;
  ref: React.Ref<HTMLDivElement>;
};

const Background = (props: BackgroundProps) => {
  const { preset, alpha, blur, backgroundImage, ref } = props;

  const blurValue = blur / 5;

  return (
    <>
      <StyledBackgroundImageWrapper>
        <StyledBackgroundImage
          style={{
            inset: -2 * blurValue,
            filter: `blur(${blurValue}px)`,
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      </StyledBackgroundImageWrapper>
      <StyledMask
        ref={ref}
        style={{
          backgroundColor: calculateMaskColor(alpha),
        }}
      />
      <React.Suspense>
        <ParticleMask preset={preset} />
      </React.Suspense>
    </>
  );
};

type ParticleMaskProps = {
  preset: string;
};

const ParticleMask = ({ preset }: ParticleMaskProps) => {
  React.use(particlesPromise);

  return <Particles options={{ preset, background: { opacity: 0 } }} />;
};

const Clock = () => {
  const time = useTimeString();
  const date = useDateString();
  const theme = useTheme();

  const lunar = calculateChineseLunar(new Date());

  return (
    <>
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
    </>
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
            userSelect: "none",
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
            userSelect: "none",
          }}
          variant="overline"
        >
          -{quote.anthor}-
        </Typography>
      </Box>
    </>
  );
};

export const App = () => {
  useSubscribeSyncStoreChange();

  return (
    <QueryProvider>
      <NewTab />
    </QueryProvider>
  );
};
