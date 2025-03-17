import {
  AddOutlined,
  NorthOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Toolbar,
} from "@mui/material";
import React from "react";

export const About = () => {
  const [html, setHtml] = React.useState("");
  const [list, setList] = React.useState<string[]>([]);

  return (
    <Paper
      data-contentfixed
      sx={{
        borderWidth: 1,
        borderColor: (t) => t.palette.divider,
        borderStyle: "solid",

        flexGrow: 1,
        minBlockSize: 0,

        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar>
        <IconButton>
          <SearchOutlined />
        </IconButton>
      </Toolbar>
      <Divider />
      <Box sx={{ flex: 1, minBlockSize: 0, overflowY: "auto", padding: 3 }}>
        {list.map((i, idx) => (
          <Box key={i}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  marginBlockStart: idx ? 3 : 0,
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{ visibility: idx % 2 === 1 ? "hidden" : void 0 }}
                ></Avatar>
                <Paper
                  sx={{
                    bgcolor: (t) => t.palette.primary.main,
                    color: (t) => t.palette.primary.contrastText,

                    padding: 3,

                    flex: 1,
                    minInlineSize: 0,
                    wordBreak: "break-all",
                  }}
                >
                  <Box
                    sx={{
                      minBlockSize: (t) =>
                        `calc(${t.typography.body1.lineHeight} * ${t.typography.body1.fontSize})`,
                    }}
                  >
                    <span>{i}</span>
                  </Box>
                </Paper>
                <Avatar
                  sx={{ visibility: idx % 2 === 0 ? "hidden" : void 0 }}
                ></Avatar>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box
        component={"div"}
        contentEditable
        sx={{
          minHeight: 60,
          maxHeight: 300,
          overflowY: "auto",

          padding: 3,

          outline: "none",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={(e) => {
          console.log(e.currentTarget.textContent);

          setHtml(e.currentTarget.textContent || "");
        }}
      ></Box>
      <Box sx={{ padding: 3, display: "flex" }}>
        <IconButton onClick={() => {}}>
          <AddOutlined />
        </IconButton>
        <Box sx={{ marginInlineStart: "auto" }} />
        <Button
          onClick={() => {
            setHtml("");
            setList((p) => p.concat(html));
          }}
          variant="contained"
          startIcon={<NorthOutlined />}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};
