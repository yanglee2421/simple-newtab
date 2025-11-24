import {
  alpha,
  Box,
  CardContent,
  CardHeader,
  Drawer,
  Fab,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Typography,
  useTheme,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  CloseOutlined,
  RestoreOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { FindInPageOutlined } from "@mui/icons-material";
import React from "react";
import { loadSlim } from "@tsparticles/slim";
import { useLiveQuery } from "dexie-react-hooks";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { loadBubblesPreset } from "@tsparticles/preset-bubbles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  useSubscribeSyncStoreChange,
  useSyncStore,
} from "@/hooks/useSyncStore";
import { db } from "@/lib/db";
import type { Preset } from "@/hooks/useSyncStore";
import snowVillage from "./snowVillage.jpg";

const particlesInit = initParticlesEngine(async (e) => {
  await loadSnowPreset(e);
  await loadLinksPreset(e);
  await loadBubblesPreset(e);
  await loadSlim(e);
});

type ParticleProps = {
  preset: Preset;
};

const Particle = (props: ParticleProps) => (
  <Particles options={{ preset: props.preset, background: { opacity: 0 } }} />
);

const snowVillageHref = new URL(snowVillage, import.meta.url).href;

type BackgroundImageProps = { blur: number; backgroundImage: string };

const BackgroundImage = ({ blur, backgroundImage }: BackgroundImageProps) => {
  return (
    <Box sx={{ position: "relative", zIndex: 0, isolation: "isolate" }}>
      <Box
        sx={{
          position: "fixed",
          inset: -2 * blur,
          zIndex: 1,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          filter: `blur(${blur}px)`,
        }}
      />
    </Box>
  );
};

type MaskProps = { alpha: number };

const Mask = ({ alpha: alphaVal }: MaskProps) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      backgroundColor: `rgba(0,0,0,${alphaVal / 100})`,
    }}
  />
);

type SnowBgProps = {
  alpha: number;
  blur: number;
  backgroundImage: string;
  preset: Preset;
};

const Background = (props: SnowBgProps) => {
  React.use(particlesInit);

  const alpha = React.useDeferredValue(props.alpha);
  const blur = React.useDeferredValue(props.blur);
  const backgroundImage = React.useDeferredValue(props.backgroundImage);
  const preset = React.useDeferredValue(props.preset);

  return (
    <>
      <BackgroundImage blur={blur} backgroundImage={backgroundImage} />
      <Mask alpha={alpha} />
      {preset && <Particle preset={preset} />}
    </>
  );
};

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
  return React.useSyncExternalStore(
    onAnimationFrame,
    () => getTimeString(locales),
    () => getTimeString(locales)
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
    () => getDateString(locales)
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

const Clock = () => {
  const time = useLocaleTime();
  const date = useLocaleDate();
  const theme = useTheme();

  return (
    <Box>
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

const Content = () => {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        inlineSize: "100dvw",
        blockSize: "100dvh",

        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          marginBlockStart: "calc(100dvh/55*21)",
          transform: "translate3d(0,-50%,0)",
        }}
      >
        <Clock />
      </Box>
    </Box>
  );
};

const useCurrentBgHref = () => {
  const imageId = useSyncStore((s) => s.imageId);

  console.log(imageId);

  const background = useLiveQuery(() => {
    return db.backgrounds.get(imageId);
  }, [imageId]);

  if (!background) {
    return snowVillageHref;
  }

  return URL.createObjectURL(background.image);
};

export const App = () => {
  const [show, setShow] = React.useState(false);

  const alphaVal = useSyncStore((s) => s.alpha);
  const blur = useSyncStore((s) => s.blur);
  const preset = useSyncStore((s) => s.preset);
  const theme = useTheme();
  const currentBgHref = useCurrentBgHref();
  useSubscribeSyncStoreChange();

  const set = useSyncStore.setState;
  const muiBgColor = theme.palette.background.default;

  return (
    <React.Suspense>
      <Background
        alpha={alphaVal}
        blur={blur}
        backgroundImage={currentBgHref}
        preset={preset}
      />
      <Content />
      <Fab
        onClick={() => setShow(true)}
        color="inherit"
        sx={{
          backdropFilter: "blur(20px)",
          backgroundColor: alpha(muiBgColor, 0.6),
          color: theme.palette.getContrastText(alpha(muiBgColor, 0.6)),
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },

          position: "fixed",
          insetInlineEnd: 12,
          insetBlockStart: 12,
        }}
        size="small"
      >
        <SettingsOutlined color="inherit" />
      </Fab>
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
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <TextField
                label="Background Image"
                fullWidth
                value={currentBgHref}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton component="label">
                          <FindInPageOutlined />
                          <input
                            type="file"
                            value={""}
                            onChange={(e) => {
                              const file = e.target.files?.item(0);
                              if (!file) return;

                              db.backgrounds.add({
                                image: file,
                              });
                            }}
                            hidden
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
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
                  if (typeof value !== "number") return e;
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
                  if (typeof value !== "number") return e;
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

const totalWidth = 1200;
const span = 8;
const columns = 12;
const columnSpacing = 16;

console.log(
  (totalWidth * span) / columns - (columns - span) * (columnSpacing / columns)
);
