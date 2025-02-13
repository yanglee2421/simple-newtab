import { SettingsOutlined } from "@mui/icons-material";
import wxtLogo from "/wxt.svg";
import { browser } from "wxt/browser";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";

const wxtLogoHref = new URL(wxtLogo, import.meta.url).href;

export function App() {
  return (
    <Card sx={{ width: 300 }}>
      <CardHeader
        avatar={<img src={wxtLogoHref} width={28} alt="" />}
        title="Simple Newtab"
        subheader="Simple but not Simplistic"
        action={
          <IconButton onClick={() => browser.runtime.openOptionsPage()}>
            <SettingsOutlined />
          </IconButton>
        }
      />
      <CardContent>
        <Typography>Hello, welcome to Simple Newtab!</Typography>
      </CardContent>
      <CardActions>
        <Button sx={{ display: "none" }}>Close</Button>
      </CardActions>
    </Card>
  );
}
