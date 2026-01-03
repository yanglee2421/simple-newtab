import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  styled,
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
import { devLog } from "@/lib/utils";

const calculatePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const renderBackgroundTypePanel = (backgroundType: string) => {
  switch (backgroundType) {
    case "image":
      return <ImagePanel />;
    case "color":
      return null;
    case "gallery":
      return null;
    default:
      return null;
  }
};

const calculateImageWidth = (
  inlineSize: number,
  naturalWidth: number,
  naturalHeight: number,
) => {
  if (naturalWidth > naturalHeight) {
    return 0;
  }

  return inlineSize;
};

const calculateImageHeight = (
  blockSize: number,
  naturalWidth: number,
  naturalHeight: number,
) => {
  if (naturalHeight > naturalWidth) {
    return 0;
  }

  return blockSize;
};

const StyleImg = styled("img")({
  objectFit: "cover",
  objectPosition: "center",

  position: "absolute",
  insetInlineStart: "50%",
  insetBlockStart: "50%",
  translate: "-50% -50%",
});

type ImageCellProps = {
  image: File;
  selected: boolean;
  id: number;
};

const ImageCell = (props: ImageCellProps) => {
  const [inlineSize, setInlineSize] = React.useState(0);
  const [blockSize, setBlockSize] = React.useState(0);
  const [naturalWidth, setNaturalWidth] = React.useState(0);
  const [naturalHeight, setNaturalHeight] = React.useState(0);
  const [openMenu, setOpenMenu] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const boxRef = React.useRef<HTMLDivElement>(null);

  const imageWidth = calculateImageWidth(
    inlineSize,
    naturalWidth,
    naturalHeight,
  );
  const imageHeight = calculateImageHeight(
    blockSize,
    naturalWidth,
    naturalHeight,
  );

  React.useEffect(() => {
    const el = boxRef.current;

    if (!el) return;

    devLog(false, el);

    const observer = new ResizeObserver(
      ([
        {
          contentBoxSize: [{ inlineSize, blockSize }],
        },
      ]) => {
        setInlineSize(inlineSize);
        setBlockSize(blockSize);
      },
    );
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <ButtonBase
        ref={boxRef}
        component="div"
        onClick={() => {
          useSyncStore.setState((draft) => {
            draft.imageId = props.id;
          });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpenMenu(true);
          setMouseX(e.clientX);
          setMouseY(e.clientY);
        }}
        sx={{
          aspectRatio: "1/1",
          overflow: "hidden",
          borderRadius: 1,

          position: "relative",

          borderColor: (theme) => theme.palette.primary.main,
          borderStyle: "solid",
          borderWidth: props.selected ? 4 : 0,
        }}
      >
        <StyleImg
          src={URL.createObjectURL(props.image)}
          alt=""
          width={imageWidth || void 0}
          height={imageHeight || void 0}
          draggable={false}
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;

            devLog(false, naturalWidth, naturalHeight);
            setNaturalWidth(naturalWidth);
            setNaturalHeight(naturalHeight);
          }}
        />
      </ButtonBase>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: mouseY,
          left: mouseX,
        }}
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenMenu(false);
            db.backgrounds.delete(props.id);
          }}
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const ImagePanel = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);

  const fileInputId = React.useId();

  const imageId = useSyncStore((s) => s.imageId);

  const backgroundImages = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }, [pageIndex, pageSize]);

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  return (
    <Card>
      <CardHeader
        title="图片"
        action={
          <IconButton component="label" htmlFor={fileInputId}>
            <FindInPageOutlined />
            <input
              type="file"
              id={fileInputId}
              hidden
              value=""
              onChange={async (e) => {
                const file = e.target.files?.item(0);
                if (!file) return;

                const imageId = await db.backgrounds.add({ image: file });
                useSyncStore.setState((draft) => {
                  draft.imageId = imageId;
                });
              }}
              accept="image/*"
            />
          </IconButton>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,minmax(0,1fr))",
              sm: "repeat(3,minmax(0,1fr))",
              md: "repeat(4,minmax(0,1fr))",
              lg: "repeat(6,minmax(0,1fr))",
              xl: "repeat(8,minmax(0,1fr))",
            },
            gap: 0.5,
          }}
        >
          {backgroundImages?.map((backgroundImage) => (
            <ImageCell
              id={backgroundImage.id}
              image={backgroundImage.image}
              selected={Object.is(imageId, backgroundImage.id)}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Pagination
          page={pageIndex + 1}
          count={calculatePageCount(count || 0, pageSize)}
          onChange={(_, page) => {
            setPageIndex(page - 1);
          }}
          variant="outlined"
        />
      </CardActions>
    </Card>
  );
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
        {renderBackgroundTypePanel(backgroundType)}
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
