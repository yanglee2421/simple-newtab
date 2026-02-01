import { DarkMode, DesktopWindows, LightMode } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React from "react";

const createModes = () => {
  return ["light", "dark", "system"] as const;
};

type ModeIconProps = {
  mode: Mode;
};

const ModeIcon = (props: ModeIconProps) => {
  const { mode } = props;

  switch (mode) {
    case "light":
      return <LightMode />;
    case "dark":
      return <DarkMode />;
    case "system":
    default:
      return <DesktopWindows />;
  }
};

export const ModeToggle = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const mode = useSyncStore((store) => store.mode);
  const modes = createModes();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (mode: Mode) => {
    handleMenuClose();

    useSyncStore.setState((draft) => {
      draft.mode = mode;
    });
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <ModeIcon mode={mode} />
      </IconButton>
      <Menu
        open={!!anchorEl}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {modes.map((mode) => {
          return (
            <MenuItem
              key={mode}
              onClick={() => {
                handleModeChange(mode);
              }}
            >
              <ListItemIcon>
                <ModeIcon mode={mode} />
              </ListItemIcon>
              <ListItemText
                primary={mode}
                slotProps={{
                  primary: {
                    textTransform: "capitalize",
                  },
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
