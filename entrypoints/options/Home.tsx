import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
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
import { DeleteOutlined, FindInPageOutlined } from "@mui/icons-material";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { db } from "@/lib/db";
import { ScrollToTopButton } from "@/components/scroll";
import { devLog } from "@/lib/utils";

const calculatePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
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
  clickable?: boolean;
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
    devLog(false, el);

    if (!el) return;

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
          if (!props.clickable) return;
          useSyncStore.setState((draft) => {
            draft.imageId = props.id;
          });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpenMenu((prev) => !prev);
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
          cursor: props.clickable ? "context-menu" : "default",
        }}
        disableRipple={!props.clickable}
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
      </ButtonBase>
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
              key={backgroundImage.id}
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
        />
      </CardActions>
    </Card>
  );
};

const ColorPanel = () => {
  return (
    <Card>
      <CardHeader title="纯色" action={<input type="color" />} />
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
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.success.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.warning.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.error.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
          <ButtonBase
            sx={{
              backgroundColor: (theme) => theme.palette.info.main,

              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 1,
            }}
          ></ButtonBase>
        </Box>
      </CardContent>
      <CardActions>
        <Pagination />
      </CardActions>
    </Card>
  );
};

const calculateIsHTMLElement = (el: unknown): el is HTMLElement => {
  return el instanceof HTMLElement;
};

type SortableImageCellProps = {
  id: number;
};

const SortableImageCell = (props: SortableImageCellProps) => {
  const [inlineSize, setInlineSize] = React.useState(0);
  const [blockSize, setBlockSize] = React.useState(0);
  const [naturalWidth, setNaturalWidth] = React.useState(0);
  const [naturalHeight, setNaturalHeight] = React.useState(0);

  const boxRef = React.useRef<HTMLElement>(null);

  const sortable = useSortable({
    id: props.id,
  });

  const backgroundImage = useLiveQuery(() => {
    return db.backgrounds.get(props.id);
  });

  React.useEffect(() => {
    const el = boxRef.current;
    devLog(false, el);

    if (!el) return;

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

  devLog(true, sortable.transform, sortable.transition);

  return (
    <Box
      ref={(el) => {
        const isHTMLEl = calculateIsHTMLElement(el);
        if (!isHTMLEl) return;

        sortable.setNodeRef(el);
        boxRef.current = el;

        return () => {
          sortable.setNodeRef(null);
          boxRef.current = null;
        };
      }}
      sx={{
        aspectRatio: "1/1",
        overflow: "hidden",
        borderRadius: 1,

        position: "relative",
      }}
      component={"div"}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      <StyleImg
        src={backgroundImage ? URL.createObjectURL(backgroundImage.image) : ""}
        alt=""
        width={imageWidth || void 0}
        height={imageHeight || void 0}
        draggable={false}
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;

          devLog(false, naturalWidth, naturalHeight);
          setNaturalWidth(naturalWidth);
          setNaturalHeight(naturalHeight);

          URL.revokeObjectURL(e.currentTarget.src);
        }}
      />
    </Box>
  );
};

const DroppableImageGrid = (props: React.PropsWithChildren) => {
  const droppable = useDroppable({
    id: "image-grid",
  });

  return (
    <Box
      ref={(el) => {
        const isHTMLEl = calculateIsHTMLElement(el);
        if (!isHTMLEl) return;

        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
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
      {props.children}
    </Box>
  );
};

const DroppableGalleryGrid = (props: React.PropsWithChildren) => {
  const droppable = useDroppable({
    id: "gallery-grid",
  });

  const gallery = useSyncStore((store) => store.gallery);

  return (
    <Box
      ref={(el) => {
        const isHTMLEl = calculateIsHTMLElement(el);
        if (!isHTMLEl) return;

        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
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
      <SortableContext items={gallery} strategy={horizontalListSortingStrategy}>
        {props.children}
      </SortableContext>
    </Box>
  );
};

const GalleryPanel = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);

  const fileInputId = React.useId();

  const backgroundImages = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }, [pageIndex, pageSize]);

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const gallery = useSyncStore((store) => store.gallery);
  devLog(false, gallery);

  return (
    <Card>
      <CardHeader
        title="幻灯片放映"
        action={
          <IconButton component="label" htmlFor={fileInputId}>
            <FindInPageOutlined />
            <input
              type="file"
              id={fileInputId}
              hidden
              value=""
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                devLog(true, files);

                for (const file of files) {
                  await db.backgrounds.add({ image: file });
                }
              }}
              accept="image/*"
              multiple
            />
          </IconButton>
        }
      />
      <CardContent>
        <DndContext
          onDragEnd={(e) => {
            devLog(false, e);
          }}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <DroppableGalleryGrid>
            {gallery?.map((id) => (
              <SortableImageCell key={id} id={id} />
            ))}
          </DroppableGalleryGrid>
          <DroppableImageGrid>
            {backgroundImages?.map((backgroundImage) => (
              <SortableImageCell
                key={backgroundImage.id}
                id={backgroundImage.id}
              />
            ))}
          </DroppableImageGrid>
        </DndContext>
      </CardContent>
      <CardActions>
        <Pagination
          page={pageIndex + 1}
          count={calculatePageCount(count || 0, pageSize)}
          onChange={(_, page) => {
            setPageIndex(page - 1);
          }}
        />
      </CardActions>
    </Card>
  );
};

const renderBackgroundTypePanel = (backgroundType: string) => {
  switch (backgroundType) {
    case "image":
      return <ImagePanel />;
    case "color":
      return <ColorPanel />;
    case "gallery":
      return <GalleryPanel />;
    default:
      return null;
  }
};

export const Component = () => {
  const backgroundType = useSyncStore((store) => store.backgroundType);

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
      </Stack>
    </>
  );
};
