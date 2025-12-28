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
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import {
  ContentPasteGoOutlined,
  DeleteOutlined,
  FindInPageOutlined,
} from "@mui/icons-material";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { ScrollToTopButton } from "@/components/scroll";

const makePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

export const Component = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);

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
          <CardHeader title="Background List" />
          <CardContent>
            <Pagination
              page={pageIndex + 1}
              count={makePageCount(count || 0, pageSize)}
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
