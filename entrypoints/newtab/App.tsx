import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  FormLabel,
  Grid2,
  IconButton,
  Slider,
} from "@mui/material";
import React from "react";
import snowVillage from "./snowVillage.jpg";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { useSyncStore } from "@/hooks/useSyncStore";
import { SettingsOutlined } from "@mui/icons-material";
import { browser } from "wxt/browser";
import { MuiProvider } from "@/components/MuiProvider";

const particlesInit = initParticlesEngine(async (e) => {
  await loadSnowPreset(e);
  await loadSlim(e);
});
const snowNode = (
  <Particles options={{ preset: "snow", background: { opacity: 0 } }} />
);

const bgHref = new URL(snowVillage, import.meta.url).href;

type BackgroundImageProps = { blur: number };

const BackgroundImage = ({ blur }: BackgroundImageProps) => (
  <Box
    sx={{
      position: "absolute",
      inset: -2 * blur,
      zIndex: 0,
      backgroundImage: `url(${bgHref})`,
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

type SnowBgProps = React.PropsWithChildren;

const SnowBg = (props: SnowBgProps) => {
  React.use(particlesInit);

  const alphaVal = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <MemoBackgroundImage blur={blur} />
      <MemoMask alpha={alphaVal} />
      {snowNode}
      <Box sx={{ position: "relative", zIndex: 2 }}>{props.children}</Box>
    </Box>
  );
};

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

const Clock = () => {
  const time = useLocaleTime();

  return <time>{time}</time>;
};

export const App = () => {
  console.log(browser);

  const alphaVal = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);
  const set = useSyncStore((s) => s.set);

  return (
    <MuiProvider>
      <React.Suspense>
        <Box
          sx={{
            position: "relative",
            zIndex: (t) => t.zIndex.fab,
            color: (t) => t.palette.primary.main,
          }}
        >
          <Clock />
        </Box>
        <SnowBg>
          <Card>
            <CardHeader
              action={
                <IconButton
                  onClick={async () => {
                    set((d) => {
                      d.alpha = (d.alpha + 10) % 110;
                    });
                  }}
                >
                  <SettingsOutlined color="action" />
                </IconButton>
              }
            />
            <CardContent>
              <Grid2 container spacing={6}>
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
                  />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </SnowBg>
      </React.Suspense>
    </MuiProvider>
  );
};
