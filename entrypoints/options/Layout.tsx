import {
  HomeOutlined,
  InfoOutlined,
  MenuOutlined,
  TranslateOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  alpha,
  styled,
  Link,
  Typography,
  Icon,
} from "@mui/material";
import React from "react";
import { useParams, NavLink, Link as RouterLink } from "react-router";
import wxtLogo from "/wxt.svg";

const wxtLogoHref = new URL(wxtLogo, import.meta.url).href;

const github_url = import.meta.env.VITE_GITHUB_URL;
const ASIDE_SIZE = 72;

const Aside = styled("aside")(({ theme }) => ({
  position: "fixed",
  zIndex: theme.zIndex.appBar - 1,

  inlineSize: "100dvw",
  blockSize: "100dvh",
  paddingBlockStart: theme.spacing(14),

  [theme.breakpoints.up("sm")]: {
    maxInlineSize: theme.spacing(ASIDE_SIZE),
    paddingBlockStart: theme.spacing(16),
  },

  overflow: "hidden",

  backgroundColor: theme.palette.background.default,
}));

const Nav = styled("nav")(({ theme }) => ({
  blockSize: "100%",

  overflow: "auto",
  borderInlineEnd: `1px solid ${theme.palette.divider}`,
}));

const Content = styled("div")(({ theme }) => ({
  display: "none",
  flexDirection: "column",

  paddingBlockStart: theme.spacing(14),
  minBlockSize: "100dvh",
  "&:has([data-contentfixed=true])": {
    blockSize: "100dvh",
  },

  [theme.breakpoints.up("sm")]: {
    display: "flex",
    paddingInlineStart: theme.spacing(ASIDE_SIZE),
    paddingBlockStart: theme.spacing(16),
  },
}));

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,

  padding: theme.spacing(3),
  paddingBlockEnd: theme.spacing(0),

  "&:has([data-contentfixed=true])": {
    minBlockSize: 0,

    display: "flex",
    flexDirection: "column",

    paddingBlockEnd: theme.spacing(3),
  },
}));

const LinkWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  "& a": {
    textDecoration: "none",
    color: theme.palette.text.primary,

    display: "flex",
    gap: theme.spacing(3),
    alignItem: "center",

    padding: theme.spacing(5),

    [theme.breakpoints.up("sm")]: {
      paddingInline: theme.spacing(3),
      paddingBlock: theme.spacing(3),
    },
  },
  "& a:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& a[aria-current=page]": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.activatedOpacity
    ),
  },
}));

const list = [
  {
    to: "/",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    to: "/about",
    label: "About",
    icon: <InfoOutlined />,
  },
];

const NavMenu = () => {
  const params = useParams();

  return (
    <LinkWrapper>
      {list.map((i) => (
        <NavLink key={i.to} to={`/${params.lang + i.to}`} end>
          {i.icon}
          <Typography variant="body1" component="span">
            {i.label}
          </Typography>
          <ChevronRightOutlined sx={{ marginInlineStart: "auto" }} />
        </NavLink>
      ))}
    </LinkWrapper>
  );
};

type Props = React.PropsWithChildren;

export const Layout = (props: Props) => {
  const [showMenuInMobile, update] = React.useState(false);

  return (
    <>
      <AppBar
        elevation={0}
        sx={(theme) => ({
          bgcolor: "transparent",
          borderBlockEnd: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.default, 0.6),
          backdropFilter: "blur(8px)",
        })}
      >
        <Toolbar>
          <Icon
            component={RouterLink}
            to="/"
            fontSize="large"
            color="primary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <img
              src={wxtLogoHref}
              alt=""
              style={{ width: "100%", height: "100%", display: "flex" }}
            />
          </Icon>
          <IconButton
            onClick={() => update((p) => !p)}
            sx={{ display: { sm: "none" } }}
          >
            <MenuOutlined />
          </IconButton>
          <Box sx={{ marginInlineStart: "auto" }}></Box>
          <IconButton>
            <TranslateOutlined />
          </IconButton>
          <Avatar />
        </Toolbar>
      </AppBar>
      <Aside sx={{ maxInlineSize: showMenuInMobile ? "none" : 0 }}>
        <Nav>
          <NavMenu />
        </Nav>
      </Aside>
      <Content sx={{ display: showMenuInMobile ? "none" : "flex" }}>
        <Main>{props.children}</Main>
      </Content>
    </>
  );
};
