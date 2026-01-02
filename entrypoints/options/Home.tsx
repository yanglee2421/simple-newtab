import {
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import {
  AddOutlined,
  ContentPasteGoOutlined,
  DeleteOutlined,
  FindInPageOutlined,
} from "@mui/icons-material";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { ScrollToTopButton } from "@/components/scroll";

const calculatePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

export const Component = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);

  const fileInputId = React.useId();

  const backgroundType = useSyncStore((store) => store.backgroundType);
  const imageId = useSyncStore((s) => s.imageId);

  const itemData = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }, [pageIndex, pageSize]);

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  const images = itemData || [];

  const setSync = useSyncStore.setState;

  return (
    <>
      <ScrollToTopButton />
      <Stack spacing={3} sx={{ paddingBlock: 3 }}>
        <Card>
          <CardHeader title="背景设置" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={12}></Grid>
            </Grid>
            <List disablePadding>
              <ListItem
                secondaryAction={
                  <TextField
                    value={backgroundType}
                    onChange={(e) => {
                      setSync((draft) => {
                        const value = e.target.value;

                        switch (value) {
                          case "gallery":
                          case "color":
                          case "image":
                            draft.backgroundType = value;
                        }
                      });
                    }}
                    select
                    size="small"
                    sx={{ minInlineSize: 160 }}
                  >
                    <MenuItem value="image">图片</MenuItem>
                    <MenuItem value="color">纯色</MenuItem>
                    <MenuItem value="gallery">幻灯片</MenuItem>
                  </TextField>
                }
              >
                <ListItemText
                  primary="个性化设置背景"
                  secondary="图片背景适用于当前桌面。纯色或幻灯片背景则适用于所有桌面。"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Import Images" />
          <CardContent>
            <Grid container>
              <Grid size={12}>
                <TextField
                  fullWidth
                  value={""}
                  onChange={() => {}}
                  onPaste={(e) => {
                    const files = e.clipboardData.files;

                    for (const file of files) {
                      db.backgrounds.add({
                        image: file,
                      });
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    const files = e.dataTransfer.files;

                    for (const file of files) {
                      db.backgrounds.add({
                        image: file,
                      });
                    }
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContentPasteGoOutlined />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton component="label">
                            <input
                              type="file"
                              name=""
                              id=""
                              hidden
                              value={""}
                              onChange={(e) => {
                                const files = e.target.files;
                                if (!files) return;

                                for (const file of files) {
                                  db.backgrounds.add({ image: file });
                                }
                              }}
                              accept="image/*"
                              multiple
                            />
                            <FindInPageOutlined />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Background List"
            action={
              <IconButton component="label" htmlFor={fileInputId}>
                <AddOutlined />
                <input
                  type="file"
                  name=""
                  id={fileInputId}
                  hidden
                  value={""}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;

                    for (const file of files) {
                      db.backgrounds.add({ image: file });
                    }
                  }}
                  accept="image/*"
                  multiple
                />
              </IconButton>
            }
          />
          <CardContent>
            <Pagination
              page={pageIndex + 1}
              count={calculatePageCount(count || 0, pageSize)}
              onChange={(_, page) => {
                setPageIndex(page - 1);
              }}
              variant="outlined"
            />
            <ImageList cols={3} gap={8}>
              {images.map((item) => (
                <ImageListItem
                  key={item.id}
                  component={ButtonBase}
                  onClick={() => {
                    setSync((draft) => {
                      draft.imageId = item.id;
                    });
                  }}
                  sx={{
                    borderWidth: Object.is(imageId, item.id) ? 3 : 0,
                    borderStyle: "solid",
                    borderColor: (theme) => theme.palette.primary.main,
                    position: "relative",
                  }}
                >
                  <object data="" type="">
                    <IconButton
                      color="error"
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        db.backgrounds.delete(item.id);
                      }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </object>

                  <img
                    src={URL.createObjectURL(item.image)}
                    alt={""}
                    onLoad={(e) => {
                      URL.revokeObjectURL(e.currentTarget.src);
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};
