import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Drawer,
  FormLabel,
  Grid2,
  IconButton,
  Slider,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import snowVillage from "./snowVillage.jpg";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { useSyncStore } from "@/hooks/useSyncStore";
import { CloseOutlined, SettingsOutlined } from "@mui/icons-material";
import { MuiProvider } from "@/components/MuiProvider";
import { useIndexedStore } from "@/hooks/useIndexedStore";

const particlesInit = initParticlesEngine(async (e) => {
  await loadSnowPreset(e);
  await loadSlim(e);
});
const snowNode = (
  <Particles options={{ preset: "snow", background: { opacity: 0 } }} />
);

const bgHref = new URL(snowVillage, import.meta.url).href;

type BackgroundImageProps = { blur: number; backgroundImage: string };

const BackgroundImage = ({ blur, backgroundImage }: BackgroundImageProps) => (
  <Box
    sx={{
      position: "absolute",
      inset: -2 * blur,
      zIndex: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      filter: `blur(${blur}px)`,
    }}
  />
);

const MemoBackgroundImage = React.memo(BackgroundImage);

type MaskProps = { alpha: number };

const Mask = ({ alpha: alphaVal }: MaskProps) => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 1,
      backgroundColor: (t) => alpha(t.palette.common.black, alphaVal / 100),
    }}
  />
);

const MemoMask = React.memo(Mask);

type SnowBgProps = React.PropsWithChildren<{
  alpha: number;
  blur: number;
  backgroundImage: string;
}>;

const SnowBg = (props: SnowBgProps) => {
  React.use(particlesInit);

  const alpha = React.useDeferredValue(props.alpha);
  const blur = React.useDeferredValue(props.blur);
  const backgroundImage = React.useDeferredValue(props.backgroundImage);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        inlineSize: "100%",
        blockSize: "100%",
      }}
    >
      <MemoBackgroundImage blur={blur} backgroundImage={backgroundImage} />
      <MemoMask alpha={alpha} />
      {snowNode}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          inlineSize: "100%",
          blockSize: "100%",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const MemoSnowBg = React.memo(SnowBg);

function onAnimationFrame(cb: () => void) {
  let animate = 0;

  const run = () => {
    animate = requestAnimationFrame(run);
    cb();
  };

  run();

  return () => cancelAnimationFrame(animate);
}

function useLocaleTime(locales?: Intl.LocalesArgument) {
  return React.useSyncExternalStore(
    onAnimationFrame,
    () => getTimeString(locales),
    () => getTimeString(locales)
  );
}

function getTimeString(locales?: Intl.LocalesArgument) {
  return new Date().toLocaleTimeString(locales, {
    timeStyle: "short",
    hour12: false,
  });
}

function useLocaleDate(locales?: Intl.LocalesArgument) {
  return React.useSyncExternalStore(
    onAnimationFrame,
    () => getDateString(locales),
    () => getDateString(locales)
  );
}

function getDateString(locales?: Intl.LocalesArgument) {
  return new Date().toLocaleDateString(locales, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
}

const Clock = () => {
  const time = useLocaleTime();
  const date = useLocaleDate();
  const theme = useTheme();

  return (
    <Box sx={{ marginBlockStart: 28 }}>
      <Typography
        component={"time"}
        variant="h1"
        sx={{
          color: theme.palette.common.white,
          textAlign: "center",
          display: "block",
        }}
      >
        {time}
      </Typography>
      <Typography
        component={"time"}
        variant="subtitle1"
        sx={{
          color: theme.palette.common.white,
          textAlign: "center",
          display: "block",
        }}
      >
        {date}
      </Typography>
    </Box>
  );
};

const MemoClock = React.memo(Clock);

export const App = () => {
  const [show, setShow] = React.useState(false);

  const alphaVal = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);
  const set = useSyncStore((s) => s.set);
  const backgroundImage = useIndexedStore((s) => s.backgroundImage);
  const setIndexed = useIndexedStore((s) => s.set);

  const backgroundImageVal = backgroundImage || bgHref;

  return (
    <MuiProvider>
      <React.Suspense>
        <MemoSnowBg
          alpha={alphaVal}
          blur={blur}
          backgroundImage={backgroundImageVal}
        >
          <Box sx={{ display: "flex", paddingInline: 5, paddingBlock: 3 }}>
            <Box sx={{ marginInlineStart: "auto" }} />
            <IconButton onClick={() => setShow(true)}>
              <SettingsOutlined />
            </IconButton>
          </Box>
          <MemoClock />
          <Drawer open={show} onClose={() => setShow(false)} anchor="bottom">
            <Card>
              <CardHeader
                title="Settings"
                action={
                  <IconButton
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <CloseOutlined color="error" />
                  </IconButton>
                }
              />
              <CardContent>
                <Grid2 container spacing={6}>
                  <Grid2 size={12}>
                    <input type="color" />
                  </Grid2>
                  <Grid2 size={12}>
                    <FormLabel>Background Image</FormLabel>
                    <div>
                      <input
                        type="file"
                        value={""}
                        onChange={(e) => {
                          const file = e.target.files?.item(0);
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const data = e.target?.result;
                            if (typeof data !== "string") return;
                            setIndexed((d) => {
                              d.backgroundImage = data;
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormLabel>Alpha</FormLabel>
                    <Slider
                      value={alphaVal}
                      onChange={(e, value) => {
                        if (typeof value !== "number") return e;
                        set((d) => {
                          d.alpha = value;
                        });
                      }}
                      max={100}
                      min={0}
                      valueLabelDisplay="auto"
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <FormLabel>Blur</FormLabel>
                    <Slider
                      value={blur}
                      onChange={(e, value) => {
                        if (typeof value !== "number") return e;
                        set((d) => {
                          d.blur = value;
                        });
                      }}
                      max={100}
                      min={0}
                      valueLabelDisplay="auto"
                    />
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>
          </Drawer>
        </MemoSnowBg>
      </React.Suspense>
    </MuiProvider>
  );
};
