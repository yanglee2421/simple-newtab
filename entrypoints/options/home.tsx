import {
  Box,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
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
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { db } from "@/lib/db";
import { ScrollToTopButton } from "@/components/scroll";
import { devLog } from "@/lib/utils";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { createPortal } from "react-dom";
import type { Background } from "@/lib/db";
import {
  useBackgrounds,
  useImageObjectURL,
  useObjectURL,
  objectURLStore,
} from "@/hooks/useImageObjectURL";
import { useQueryClient } from "@tanstack/react-query";

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

const calculateIsHTMLEl = (el: unknown): el is HTMLElement => {
  return el instanceof HTMLElement;
};

const calculateActiveWidth = (data: unknown) => {
  const value = Reflect.get(Object(data), "width");

  if (typeof value !== "number") {
    return 0;
  }

  return value;
};

const calculateContainerId = (data: unknown) => {
  const containerId = Reflect.get(Object(data), "containerId");

  if (typeof containerId !== "string") {
    return "";
  }

  return containerId;
};

const StyledImg = styled("img")({
  objectFit: "cover",
  objectPosition: "center",

  position: "absolute",
  insetInlineStart: "50%",
  insetBlockStart: "50%",
  zIndex: 0,

  translate: "-50% -50% -10px",

  userSelect: "none",
});

const SquareBox = styled("div")({
  aspectRatio: "1/1",

  userSelect: "none",
});

const FullBox = styled("div")({
  inlineSize: "100%",
  blockSize: "100%",

  userSelect: "none",
});

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

  const timeRef = React.useRef(0);

  const [boxRef, entry] = useResizeObserver<HTMLDivElement>();
  const query = useImageObjectURL(props.id);
  const url = useObjectURL(query.data?.image);

  const inlineSize = useResizeObserver.inlineSize(entry?.borderBoxSize);
  const blockSize = useResizeObserver.blockSize(entry?.borderBoxSize);

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
        aspectRatio: "1/1",
        borderRadius: 1,
      }}
    >
      {!!url && (
        <StyledImg
          src={url}
          alt={`background #${props.id}`}
          width={imageWidth || void 0}
          height={imageHeight || void 0}
          draggable={false}
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;

            cancelAnimationFrame(timeRef.current);
            timeRef.current = requestAnimationFrame(() => {
              setNaturalWidth(naturalWidth);
              setNaturalHeight(naturalHeight);
            });
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
  const backgrounds = useBackgrounds(pageIndex, pageSize);
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
          {backgrounds?.map((backgroundImage) => (
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
      <CardContent></CardContent>
      <CardActions>
        <Pagination />
      </CardActions>
    </Card>
  );
};

const ImageGrid = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gap: 12,
    [theme.breakpoints.up("xs")]: {
      gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    },
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    },
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(6,minmax(0,1fr))",
    },
    [theme.breakpoints.up("xl")]: {
      gridTemplateColumns: "repeat(8,minmax(0,1fr))",
    },
  };
});

type DroppableWrapperProps = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
};

const DroppableWrapper = (props: DroppableWrapperProps) => {
  const droppable = useDroppable({
    id: props.id,
    data: {
      containerId: props.id,
    },
  });

  return (
    <Box
      ref={(el) => {
        const isHTMLEl = calculateIsHTMLEl(el);
        if (!isHTMLEl) return;

        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
      sx={{
        minHeight: 100,
      }}
    >
      {props.children}
    </Box>
  );
};

type GalleryDragOverlayProps = {
  children?: React.ReactNode;
};

const GalleryDragOverlay = (props: GalleryDragOverlayProps) => {
  return createPortal(
    <DragOverlay>{props.children}</DragOverlay>,
    document.body,
  );
};

type SortableWrapperProps = {
  id: UniqueIdentifier;
  containerId: UniqueIdentifier;
  children?: React.ReactNode;
};

const SortableWrapper = (props: SortableWrapperProps) => {
  const [ref, entry] = useResizeObserver();
  const sortable = useSortable({
    id: props.id,
    data: {
      width: useResizeObserver.inlineSize(entry?.borderBoxSize),
      containerId: props.containerId,
    },
  });

  return (
    <div
      ref={(el) => {
        ref.current = el;
        sortable.setNodeRef(el);

        return () => {
          ref.current = null;
          sortable.setNodeRef(null);
        };
      }}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        opacity: sortable.isDragging ? 0.25 : void 0,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {props.children}
    </div>
  );
};

const GalleryPanel = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier>(0);
  const [width, setWidth] = React.useState(0);

  const fileInputId = React.useId();

  const backgrounds = useBackgrounds(pageIndex, pageSize);

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  const gallery = useSyncStore((store) => store.gallery);

  const galleryBackgrounds = useLiveQuery(() => {
    return db.backgrounds
      .where("id")
      .anyOf(...gallery)
      .toArray();
  }, [gallery]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const queryClient = useQueryClient();

  const onGalleryBackgroundsChange = React.useEffectEvent(
    (galleryBackgrounds: Background[]) => {
      galleryBackgrounds.forEach((background) => {
        queryClient.setQueryData(
          ["database", "backgrounds", background.id],
          background,
        );
      });
    },
  );

  React.useEffect(() => {
    if (!galleryBackgrounds) return;

    onGalleryBackgroundsChange(galleryBackgrounds);

    galleryBackgrounds.forEach((background) => {
      objectURLStore.subscribe(background.image, Boolean);
    });

    return () => {
      galleryBackgrounds.forEach((background) => {
        objectURLStore.unsubscribe(background.image, Boolean);
      });
    };
  }, [galleryBackgrounds]);

  React.useEffect(() => {
    if (!backgrounds) return;

    backgrounds.forEach((background) => {
      objectURLStore.subscribe(background.image, Boolean);
    });

    return () => {
      backgrounds.forEach((background) => {
        objectURLStore.unsubscribe(background.image, Boolean);
      });
    };
  }, [backgrounds]);

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
        <Stack spacing={0}>
          <DndContext
            sensors={sensors}
            modifiers={[snapCenterToCursor]}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            onDragStart={({ active }) => {
              setActiveId(active.id);
              setWidth(calculateActiveWidth(active.data.current));
            }}
            onDragOver={({ active, over }) => {
              devLog(false, active, over);
              if (!over) return;

              const activeContainer = calculateContainerId(active.data.current);
              const overContainer = calculateContainerId(over.data.current);

              if (!activeContainer) return;
              if (!overContainer) return;

              // Same container, only move element
              if (activeContainer === overContainer) {
                return;
              }

              // Cut element from activeContainer to overContainer
              if (overContainer === "gallery") {
                useSyncStore.setState((draft) => {
                  draft.gallery = [...draft.gallery, +active.id];
                });

                return;
              }

              if (overContainer === "database") {
                useSyncStore.setState((draft) => {
                  draft.gallery = draft.gallery.filter(
                    (id) => !Object.is(id, active.id),
                  );
                });

                return;
              }
            }}
            onDragEnd={() => {
              setActiveId(0);
            }}
            onDragCancel={() => {
              setActiveId(0);
            }}
          >
            <DroppableWrapper id="gallery">
              <ImageGrid>
                <SortableContext items={gallery} strategy={rectSortingStrategy}>
                  {gallery?.map((image) => (
                    <SortableWrapper
                      key={image}
                      id={image}
                      containerId={"gallery"}
                    >
                      <ImageCell id={image} />
                    </SortableWrapper>
                  ))}
                </SortableContext>
              </ImageGrid>
            </DroppableWrapper>
            <Divider>Databse</Divider>
            <DroppableWrapper id="database">
              <ImageGrid>
                <SortableContext
                  items={
                    backgrounds?.filter((image) => {
                      return !gallery.includes(image.id);
                    }) || []
                  }
                  strategy={rectSortingStrategy}
                >
                  {backgrounds
                    ?.filter((image) => {
                      return !gallery.includes(image.id);
                    })
                    .map((image) => (
                      <SortableWrapper
                        key={image.id}
                        id={image.id}
                        containerId={"database"}
                      >
                        <Deleteable
                          onDelete={() => {
                            db.backgrounds.delete(image.id);
                          }}
                        >
                          <ImageCell id={image.id} />
                        </Deleteable>
                      </SortableWrapper>
                    ))}
                </SortableContext>
              </ImageGrid>
            </DroppableWrapper>
            <GalleryDragOverlay>
              {!!activeId && (
                <Box sx={{ width }}>
                  <ImageCell id={+activeId} />
                </Box>
              )}
            </GalleryDragOverlay>
          </DndContext>
        </Stack>
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

type BackgroundTypePanelProps = {
  backgroundType: string;
};

const BackgroundTypePanel = ({ backgroundType }: BackgroundTypePanelProps) => {
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
        <BackgroundTypePanel backgroundType={backgroundType} />
      </Stack>
    </>
  );
};
