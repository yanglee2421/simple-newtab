import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import React from "react";
import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities";
import { Add } from "@mui/icons-material";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
  snapCenterToCursor,
} from "@dnd-kit/modifiers";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import { ScrollToTopButton } from "@/components/scroll";
import { useQueries } from "@tanstack/react-query";
import { useBackground } from "@/hooks/useBackground";
import type { IndexableTypeArray } from "dexie";

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

const calcualteUnactivedBackgroundIds = (
  activatedIds: number[],
  unactivatedSortedIds: number[],
  paginationQueryResult?: IndexableTypeArray,
) => {
  if (!Array.isArray(paginationQueryResult)) {
    return [];
  }

  const paginationQueryIds = paginationQueryResult.filter(
    (id) => typeof id === "number",
  );
  const unfilteredIds = Array.from(
    new Set(unactivatedSortedIds.slice().concat(paginationQueryIds)),
  );
  const unactivatedIds = unfilteredIds.filter(
    (id) => !activatedIds.includes(id),
  );

  return unactivatedIds;
};

const databaseIdsInitializer = (): number[] => [];

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

const FullBox = styled("div")({
  inlineSize: "100%",
  blockSize: "100%",

  userSelect: "none",
});

const ImageGrid = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gap: 4,
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

const useBorderBoxSize = <TEl extends Element>() => {
  const [inlineSize, setInlineSize] = React.useState(0);
  const [blockSize, setBlockSize] = React.useState(0);

  const animationIdRef = React.useRef(0);
  const ref = React.useRef<TEl>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(
      ([
        {
          borderBoxSize: [{ inlineSize, blockSize }],
        },
      ]) => {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = requestAnimationFrame(() => {
          React.startTransition(() => {
            setInlineSize(Math.floor(inlineSize));
            setBlockSize(Math.floor(blockSize));
          });
        });
      },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observer.disconnect();
    };
  }, []);

  return [ref, inlineSize, blockSize] as const;
};

type ImageCellProps = {
  id: number;
};

const ImageCell = (props: ImageCellProps) => {
  const [boxRef, inlineSize, blockSize] = useBorderBoxSize<HTMLDivElement>();
  const background = useBackground(props.id);
  const imageHref = useObjectURL(background.data?.file);

  const isShowImage = !!imageHref;
  const naturalWidth = background.data?.width || 0;
  const naturalHeight = background.data?.height || 0;

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
      {isShowImage && (
        <StyledImg
          src={imageHref}
          alt={`background #${props.id}`}
          width={imageWidth || void 0}
          height={imageHeight || void 0}
          draggable={false}
        />
      )}
    </FullBox>
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
  const [databaseIds, setDatabaseIds] = React.useState(databaseIdsInitializer);

  const fileInputId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const gallery = useSyncStore((store) => store.gallery);

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  const paginationKeys = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .keys();
  }, [pageIndex, pageSize]);

  const unactivedIds = calcualteUnactivedBackgroundIds(
    gallery,
    databaseIds,
    paginationKeys,
  );

  const queries = useQueries({
    queries: Array.from(new Set(unactivedIds.concat(gallery)), (id) => {
      return {
        queryKey: ["database", "backgrounds", id],
        queryFn: async () => {
          const background = await db.backgrounds.get(+id);

          if (!background) {
            throw new Error(`#${id} background not found`);
          }

          const bitmap = await createImageBitmap(background.image);
          const width = bitmap.width;
          const height = bitmap.height;

          bitmap.close();

          return {
            id: background.id,
            file: background.image,
            width,
            height,
          };
        },
      };
    }),
  });

  const objectURLStore = React.use(ObjectURLContext);

  React.useEffect(() => {
    queries.forEach((query) => {
      if (query.isSuccess) {
        objectURLStore.subscribe(query.data.file, Boolean);
      }
    });

    return () => {
      queries.forEach((query) => {
        if (query.isSuccess) {
          objectURLStore.unsubscribe(query.data.file, Boolean);
        }
      });
    };
  }, [queries, objectURLStore]);

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
            modifiers={[
              snapCenterToCursor,
              restrictToFirstScrollableAncestor,
              restrictToWindowEdges,
            ]}
            collisionDetection={pointerWithin}
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
              if (!over) return;

              const activeContainer = calculateContainerId(active.data.current);
              if (!activeContainer) return;

              const overContainer = calculateContainerId(over.data.current);
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
                setDatabaseIds((prev) =>
                  prev.filter((id) => !Object.is(id, active.id)),
                );

                return;
              }
            }}
            onDragEnd={({ active, over }) => {
              setActiveId(0);

              if (!over) return;

              const activeContainer = calculateContainerId(active.data.current);
              const overContainer = calculateContainerId(over.data.current);

              if (activeContainer !== overContainer) {
                return;
              }

              if (activeContainer === "gallery") {
                useSyncStore.setState((draft) => {
                  const formIndex = draft.gallery.indexOf(+active.id);
                  const toIndex = draft.gallery.indexOf(+over.id);

                  draft.gallery = arrayMove(draft.gallery, formIndex, toIndex);
                });
              }

              if (activeContainer === "database") {
                const formIndex = unactivedIds.indexOf(+active.id);
                const toIndex = unactivedIds.indexOf(+over.id);
                const sortResult = arrayMove(unactivedIds, formIndex, toIndex);

                setDatabaseIds(sortResult);
              }
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
                  items={unactivedIds}
                  strategy={rectSortingStrategy}
                >
                  {unactivedIds.map((id) => (
                    <SortableWrapper key={id} id={id} containerId={"database"}>
                      <ImageCell id={id} />
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
    case "color":
      return <ColorPanel />;
    case "gallery":
    default:
      return <GalleryPanel />;
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
                            draft.backgroundType = value;
                        }
                      });
                    }}
                    select
                    size="small"
                    sx={{ minInlineSize: 160 }}
                  >
                    <MenuItem value="color">纯色</MenuItem>
                    <MenuItem value="gallery">图片</MenuItem>
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
