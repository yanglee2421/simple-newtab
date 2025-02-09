import wxtLogo from "/wxt.svg";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
