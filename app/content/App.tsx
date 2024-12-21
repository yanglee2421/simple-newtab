import { ChevronRightOutlined, MenuOutlined } from "@mui/icons-material";
import {
  Box,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ThemeProvider,
} from "@mui/material";
import React from "react";

const UI = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [videos, setVideos] = React.useState<HTMLVideoElement[]>([]);

  React.useEffect(() => {
    const videos = document.querySelectorAll("video");
    setVideos(Array.from(videos));
  }, []);

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />}
        sx={{ position: "fixed", bottom: 32, right: 32 }}
      >
        <SpeedDialAction
          onClick={() => setOpen(true)}
          icon={<MenuOutlined />}
          tooltipTitle="Action 1"
        />
      </SpeedDial>
      <Drawer
        open={open}
        onClose={handleClose}
        variant="persistent"
        anchor="right"
        sx={{ width: 384, flexShrink: 0, "& .MuiDrawer-paper": { width: 384 } }}
      >
        <Box sx={{ paddingInline: 5, paddingBlock: 3 }}>
          <IconButton onClick={handleClose}>
            <ChevronRightOutlined />
          </IconButton>
        </Box>
        <Divider />
        {videos.map((video, index) => (
          <Slider
            key={index}
            defaultValue={video.playbackRate * 100}
            onChange={(e, val) => {
              void e;
              if (typeof val === "number") {
                video.playbackRate = val / 100;
              }
            }}
            min={25}
            max={300}
            step={5}
            marks
            valueLabelDisplay="auto"
          />
        ))}
      </Drawer>
    </>
  );
};

const theme = createTheme({
  spacing(abs: number) {
    return abs * 4;
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UI />
    </ThemeProvider>
  );
};
