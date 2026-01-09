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
import { Add, Delete, FindInPageOutlined } from "@mui/icons-material";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
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
  arrayMove,
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

const StyledImg = styled("img")({
  objectFit: "cover",
  objectPosition: "center",

  position: "absolute",
  insetInlineStart: "50%",
  insetBlockStart: "50%",
  zIndex: 0,

  translate: "-50% -50% -10px",
});

const SquareBox = styled("div")({
  aspectRatio: "1/1",
});

const FullBox = styled("div")({
  inlineSize: "100%",
  blockSize: "100%",
});

const useResizeObserver = () => {
  const [inlineSize, setInlineSize] = React.useState(0);
  const [blockSize, setBlockSize] = React.useState(0);

  const boxRef = React.useRef<HTMLDivElement>(null);
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

  return { inlineSize, blockSize, boxRef };
};

type SelectableProps = React.PropsWithChildren & {
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Selectable = (props: SelectableProps) => {
  if (props.disabled) {
    return <FullBox>{props.children}</FullBox>;
  }

  return (
    <ButtonBase
      sx={{
        inlineSize: "100%",
        blockSize: "100%",

        position: "relative",
      }}
      onClick={props.onClick}
    >
      {props.children}
      {props.selected && (
        <Box
          sx={{
            borderColor: (theme) => theme.palette.primary.main,
            borderStyle: "solid",
            borderWidth: 4,

            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        ></Box>
      )}
    </ButtonBase>
  );
};

type DeleteableProps = React.PropsWithChildren & {
  onDelete: () => void;
};

const Deleteable = (props: DeleteableProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
    <FullBox
      onContextMenu={(e) => {
        e.preventDefault();
        setOpenMenu((prev) => !prev);
        setMouseX(e.clientX);
        setMouseY(e.clientY);
      }}
    >
      {props.children}
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: mouseY,
          left: mouseX,
        }}
        open={openMenu}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
            props.onDelete();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </FullBox>
  );
};

type ImageCellProps = {
  id: number;
};

const ImageCell = (props: ImageCellProps) => {
  const [naturalWidth, setNaturalWidth] = React.useState(0);
  const [naturalHeight, setNaturalHeight] = React.useState(0);

  const { boxRef, inlineSize, blockSize } = useResizeObserver();
  const background = useLiveQuery(() => {
    return db.backgrounds.get(props.id);
  }, [props.id]);

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

  return (
    <FullBox
      ref={boxRef}
      sx={{
        position: "relative",

        overflow: "hidden",

        borderRadius: 1,
      }}
    >
      {background && (
        <StyledImg
          src={URL.createObjectURL(background.image)}
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
      )}
    </FullBox>
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
            <SquareBox key={backgroundImage.id}>
              <Deleteable
                onDelete={() => {
                  db.backgrounds.delete(backgroundImage.id);
                }}
              >
                <Selectable
                  selected={Object.is(imageId, backgroundImage.id)}
                  onClick={() => {
                    useSyncStore.setState((draft) => {
                      draft.imageId = backgroundImage.id;
                    });
                  }}
                >
                  <ImageCell id={backgroundImage.id} />
                </Selectable>
              </Deleteable>
            </SquareBox>
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
        ></Box>
      </CardContent>
      <CardActions>
        <Pagination />
      </CardActions>
    </Card>
  );
};

// const calculateIsHTMLElement = (el: unknown): el is HTMLElement => {
//   return el instanceof HTMLElement;
// };

type DraggableProps = React.PropsWithChildren & {
  id: number;
};

const Draggable = (props: DraggableProps) => {
  const draggable = useDraggable({
    id: props.id,
  });

  return (
    <FullBox
      ref={(el) => {
        draggable.setNodeRef(el);

        return () => {
          draggable.setNodeRef(null);
        };
      }}
      sx={{
        position: "relative",
        zIndex: 1000,
      }}
      style={{
        transform: CSS.Transform.toString({
          scaleX: 1,
          scaleY: 1,
          x: draggable.transform?.x || 0,
          y: draggable.transform?.y || 0,
        }),
      }}
      {...draggable.attributes}
      {...draggable.listeners}
    >
      {props.children}
    </FullBox>
  );
};

type SortableProps = React.PropsWithChildren & {
  id: number;
};

const Sortable = (props: SortableProps) => {
  const sortable = useSortable({
    id: props.id,
  });

  return (
    <Grid
      size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 1 }}
      sx={{
        zIndex: sortable.isDragging ? (theme) => theme.zIndex.tooltip : "auto",
      }}
      ref={(el) => {
        sortable.setNodeRef(el);

        return () => {
          sortable.setNodeRef(null);
        };
      }}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {props.children}
    </Grid>
  );
};

const DroppableImageGrid = (props: React.PropsWithChildren) => {
  const droppable = useDroppable({
    id: "image-grid",
  });

  return (
    <Grid
      ref={(el) => {
        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
      container
      spacing={2}
    >
      {props.children}
    </Grid>
  );
};

const DroppableGalleryGrid = (props: React.PropsWithChildren) => {
  const droppable = useDroppable({
    id: "gallery-grid",
  });

  const gallery = useSyncStore((store) => store.gallery);

  return (
    <Grid
      ref={(el) => {
        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
      container
      spacing={1}
    >
      <SortableContext items={gallery} strategy={horizontalListSortingStrategy}>
        {props.children}
      </SortableContext>
    </Grid>
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
  devLog(true, gallery);

  return (
    <Card>
      <CardHeader
        title="幻灯片放映"
        action={
          <IconButton component="label" htmlFor={fileInputId}>
            <Add />
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
            devLog(true, e);

            useSyncStore.setState((draft) => {
              if (!e.over) return;
              draft.gallery = arrayMove(
                Array.from(new Set([...draft.gallery, e.active.id as number])),
                draft.gallery.indexOf(e.active.id as number),
                draft.gallery.indexOf(e.over.id as number),
              );
            });
          }}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <DroppableGalleryGrid>
            {gallery?.map((id) => (
              <Sortable key={id} id={id}>
                <SquareBox>
                  <ImageCell id={id} />
                </SquareBox>
              </Sortable>
            ))}
          </DroppableGalleryGrid>
          <DroppableImageGrid>
            {backgroundImages
              ?.filter((backgroundImage) => {
                return !gallery.includes(backgroundImage.id);
              })
              .map((backgroundImage) => (
                <SquareBox key={backgroundImage.id}>
                  <Deleteable
                    onDelete={() => {
                      db.backgrounds.delete(backgroundImage.id);
                    }}
                  >
                    <Draggable id={backgroundImage.id}>
                      <ImageCell id={backgroundImage.id} />
                    </Draggable>
                  </Deleteable>
                </SquareBox>
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
