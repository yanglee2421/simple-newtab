import {
  Box,
  ButtonBase,
  IconButton,
  ImageList,
  ImageListItem,
  Pagination,
} from "@mui/material";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { ScrollToTopButton } from "@/components/scroll";
import { DeleteOutlined } from "@mui/icons-material";

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
      <Box sx={{ paddingBlock: 3 }}>
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
                  sx={{ position: "absolute", right: 0, top: 0, zIndex: 10 }}
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
      </Box>
    </>
  );
};
