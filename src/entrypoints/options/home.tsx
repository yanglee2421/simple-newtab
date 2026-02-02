import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Slider,
  Stack,
  styled,
  TextField,
  ToggleButton,
  toggleButtonClasses,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AcUnit,
  AddPhotoAlternate,
  BubbleChart,
  Colorize,
  Delete,
  DoNotDisturb,
  LinearScale,
} from "@mui/icons-material";
import {
  CollisionDetection,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  defaultAnimateLayoutChanges,
  AnimateLayoutChanges,
} from "@dnd-kit/sortable";
import {
  snapCenterToCursor,
  restrictToWindowEdges,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import React from "react";
import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities";
import { useLiveQuery } from "dexie-react-hooks";
import { useQueries } from "@tanstack/react-query";
import { db } from "@/utils/db";
import { useBackground } from "@/hooks/useBackground";
import { ScrollToTopButton } from "@/components/scroll";
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
  trashedIds: number[],
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
    (id) => ![...activatedIds, ...trashedIds].includes(id),
  );

  return unactivatedIds;
};

const collisionDetection: CollisionDetection = (args) => {
  if (args.pointerCoordinates) {
    return pointerWithin(args);
  }

  return rectIntersection(args);
};

const idsInitializer = (): number[] => [];

const arrayRemove = (array: number[], id: number) => {
  return array.filter((el) => !Object.is(el, id));
};

const arrayAdd = (array: number[], id: number) => {
  return Array.from(new Set([...array, id]));
};

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const result = defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  return result;
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

const StyledImageContainer = styled("div")({
  position: "relative",

  inlineSize: "100%",
  blockSize: "100%",
  borderRadius: 1,

  overflow: "hidden",
  aspectRatio: "1/1",
  userSelect: "none",
});

const StyledImageGrid = styled("div")(({ theme }) => {
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
      gridTemplateColumns: "repeat(5,minmax(0,1fr))",
    },
    [theme.breakpoints.up("xl")]: {
      gridTemplateColumns: "repeat(6,minmax(0,1fr))",
    },
  };
});

const StyledDroppable = styled("div")({
  minHeight: 160,
});

const StyledDroppableWrapper = styled("div")(({ theme }) => {
  return {
    borderColor: theme.palette.divider,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,

    padding: theme.spacing(2),
  };
});

const StyledSortable = styled("div")({
  touchAction: "none",
});

const StyledTrash = styled("div")(({ theme }) => {
  return {
    position: "fixed",
    zIndex: theme.zIndex.modal,
    insetInline: 0,
    insetBlockStart: 0,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    height: theme.spacing(20),

    color: theme.palette.error.contrastText,
  };
});

const StyledColorInput = styled("input")({
  position: "absolute",

  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  borderWidth: 0,

  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

const TRASH_ID = "TRASH_ID";

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

type TrashProps = {
  id: string;
};

const Trash = (props: TrashProps) => {
  const theme = useTheme();
  const droppable = useDroppable({
    id: props.id,
    data: {
      containerId: props.id,
    },
  });

  return createPortal(
    <StyledTrash
      ref={(el) => {
        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
      style={{
        backgroundColor: droppable.isOver
          ? theme.palette.error.dark
          : theme.palette.error.light,
      }}
    >
      <Delete fontSize="large" color="inherit" />
    </StyledTrash>,
    document.body,
  );
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
    <StyledImageContainer ref={boxRef}>
      {isShowImage && (
        <StyledImg
          src={imageHref}
          alt={`background #${props.id}`}
          width={imageWidth || void 0}
          height={imageHeight || void 0}
          draggable={false}
        />
      )}
    </StyledImageContainer>
  );
};

type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const ColorPicker = (props: ColorPickerProps) => {
  const inputId = React.useId();

  return (
    <Button
      variant="outlined"
      component="label"
      htmlFor={inputId}
      startIcon={<Colorize style={{ color: props.value }} />}
    >
      <StyledColorInput
        type="color"
        id={inputId}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      点击选取颜色
    </Button>
  );
};

const ColorPanel = () => {
  const backgroundColor = useSyncStore((store) => store.backgroundColor);

  return (
    <Card>
      <CardHeader title="纯色" />
      <CardContent>
        <ColorPicker
          value={backgroundColor}
          onChange={(e) => {
            useSyncStore.setState((draft) => {
              draft.backgroundColor = e;
            });
          }}
        />
      </CardContent>
      <CardActions>
        <Pagination />
      </CardActions>
    </Card>
  );
};

type DroppableProps = {
  id: UniqueIdentifier;
  children?: React.ReactNode;
};

const Droppable = (props: DroppableProps) => {
  const droppable = useDroppable({
    id: props.id,
    data: {
      containerId: props.id,
    },
  });

  return (
    <StyledDroppable
      ref={(el) => {
        const isHTMLEl = calculateIsHTMLEl(el);
        if (!isHTMLEl) return;

        droppable.setNodeRef(el);

        return () => {
          droppable.setNodeRef(null);
        };
      }}
    >
      {props.children}
    </StyledDroppable>
  );
};

type SortableProps = {
  id: UniqueIdentifier;
  containerId: UniqueIdentifier;
  children?: React.ReactNode;
};

const Sortable = (props: SortableProps) => {
  const theme = useTheme();
  const [ref, inlineSize] = useBorderBoxSize();
  const sortable = useSortable({
    id: props.id,
    data: {
      width: inlineSize,
      containerId: props.containerId,
    },
    animateLayoutChanges,
  });

  return (
    <StyledSortable
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
        outlineColor: sortable.isDragging
          ? theme.palette.action.active
          : void 0,
      }}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {props.children}
    </StyledSortable>
  );
};

const GalleryPanel = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier>(0);
  const [width, setWidth] = React.useState(0);
  const [databaseIds, setDatabaseIds] = React.useState(idsInitializer);
  const [enableDropAnimation, setEnableDropAnimation] = React.useState(true);
  const [trashedIds, setTrashedIds] = React.useState(idsInitializer);

  const debounceRef = React.useRef(0);

  const fileInputId = React.useId();

  const gallery = useSyncStore((store) => store.gallery);
  const theme = useTheme();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const count = useLiveQuery(() => {
    return db.backgrounds.count();
  });

  const paginationKeys = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .keys();
  }, [pageIndex, pageSize]);

  const paginationIds =
    paginationKeys?.filter((id) => typeof id === "number") || [];

  const [oPaginationKeys, oPaginationKeysAction] = React.useOptimistic(
    paginationIds,
    arrayRemove,
  );

  const unactivedIds = calcualteUnactivedBackgroundIds(
    gallery,
    trashedIds,
    databaseIds,
    oPaginationKeys,
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

  const handleRemove = (id: number) => {
    cancelAnimationFrame(debounceRef.current);
    debounceRef.current = requestAnimationFrame(() => {
      React.startTransition(async () => {
        oPaginationKeysAction(id);
        useSyncStore.setState((draft) => {
          draft.gallery = arrayRemove(draft.gallery, id);
        });
        setDatabaseIds((previous) => arrayRemove(previous, id));
        setTrashedIds((previous) => arrayAdd(previous, id));
        await db.backgrounds.delete(id);
      });
    });
  };

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
        title="图片"
        subheader="尝试拖动下方的图像👋 or 点击右侧的图标按钮➡️"
        action={
          <IconButton component="label" htmlFor={fileInputId}>
            <AddPhotoAlternate />
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
      <Divider />
      <CardContent>
        <Stack spacing={0}>
          <DndContext
            sensors={sensors}
            modifiers={[
              snapCenterToCursor,
              restrictToFirstScrollableAncestor,
              restrictToWindowEdges,
            ]}
            collisionDetection={collisionDetection}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
            onDragStart={({ active }) => {
              setActiveId(active.id);
              setWidth(calculateActiveWidth(active.data.current));
              setEnableDropAnimation(true);
            }}
            onDragOver={({ active, over }) => {
              if (!over) return;

              const activeId = +active.id;
              const activeContainer = calculateContainerId(active.data.current);
              if (!activeContainer) return;

              const overContainer = calculateContainerId(over.data.current);
              if (!overContainer) return;

              if (overContainer === TRASH_ID) {
                return;
              }

              /**
               * Same container
               */
              if (activeContainer === overContainer) {
                return;
              }

              // Cut element from activeContainer to overContainer
              if (overContainer === "gallery") {
                React.startTransition(() => {
                  useSyncStore.setState((draft) => {
                    draft.gallery = arrayAdd(draft.gallery, activeId);
                  });
                });

                return;
              }

              if (overContainer === "database") {
                React.startTransition(() => {
                  useSyncStore.setState((draft) => {
                    draft.gallery = arrayRemove(draft.gallery, activeId);
                  });
                  setDatabaseIds((prev) => arrayRemove(prev, activeId));
                });

                return;
              }
            }}
            onDragEnd={({ active, over }) => {
              setActiveId(0);
              setWidth(0);

              if (!over) return;

              const activeId = +active.id;
              const activeContainer = calculateContainerId(active.data.current);
              if (!activeContainer) return;

              const overId = +over.id;
              const overContainer = calculateContainerId(over.data.current);
              if (!overContainer) return;

              if (overContainer === TRASH_ID) {
                setEnableDropAnimation(false);
                handleRemove(activeId);
                return;
              }

              if (activeContainer !== overContainer) {
                return;
              }

              if (activeContainer === "gallery") {
                useSyncStore.setState((draft) => {
                  const formIndex = draft.gallery.indexOf(activeId);
                  const toIndex = draft.gallery.indexOf(overId);

                  draft.gallery = arrayMove(draft.gallery, formIndex, toIndex);
                });

                return;
              }

              if (activeContainer === "database") {
                const formIndex = unactivedIds.indexOf(activeId);
                const toIndex = unactivedIds.indexOf(overId);
                const sortResult = arrayMove(unactivedIds, formIndex, toIndex);

                setDatabaseIds(sortResult);

                return;
              }
            }}
            onDragCancel={() => {
              setActiveId(0);
              setWidth(0);
            }}
          >
            {!!activeId && <Trash id={TRASH_ID} />}
            <StyledDroppableWrapper
              style={{
                backgroundColor: gallery.includes(+activeId)
                  ? theme.palette.action.hover
                  : void 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  paddingBlockEnd: 1.5,
                }}
              >
                已使用的图像
              </Typography>
              <Droppable id="gallery">
                <StyledImageGrid>
                  <SortableContext
                    items={gallery}
                    strategy={rectSortingStrategy}
                  >
                    {gallery.map((image) => (
                      <Sortable key={image} id={image} containerId={"gallery"}>
                        <ImageCell id={image} />
                      </Sortable>
                    ))}
                  </SortableContext>
                </StyledImageGrid>
              </Droppable>
            </StyledDroppableWrapper>
            <Divider>分隔线</Divider>
            <StyledDroppableWrapper
              style={{
                backgroundColor: unactivedIds.includes(+activeId)
                  ? theme.palette.action.hover
                  : void 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  paddingBlockEnd: 1.5,
                }}
              >
                已保存的图像
              </Typography>
              <Droppable id="database">
                <StyledImageGrid>
                  <SortableContext
                    items={unactivedIds}
                    strategy={rectSortingStrategy}
                  >
                    {unactivedIds.map((id) => (
                      <Sortable key={id} id={id} containerId={"database"}>
                        <ImageCell id={id} />
                      </Sortable>
                    ))}
                  </SortableContext>
                </StyledImageGrid>
              </Droppable>
            </StyledDroppableWrapper>
            {createPortal(
              <DragOverlay
                dropAnimation={
                  enableDropAnimation ? defaultDropAnimation : null
                }
                zIndex={theme.zIndex.modal + 1}
              >
                <div style={{ width }}>
                  <ImageCell id={+activeId} />
                </div>
              </DragOverlay>,
              document.body,
            )}
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
  const blur = useSyncStore((s) => s.blur);
  const alpha = useSyncStore((s) => s.alpha);
  const preset = useSyncStore((s) => s.preset);
  const backgroundType = useSyncStore((store) => store.backgroundType);
  const theme = useTheme();

  const setSyncStore = useSyncStore.setState;

  const primaryText =
    backgroundType === "color" ? "设置背景为纯色" : "设置背景为图片";

  const secondaryText =
    backgroundType === "color"
      ? "设置背景为纯色时，背景仅展示被选中的颜色，不显示背景图"
      : "设置背景为图片时，若使用多张图片可在新标签页切换下一张壁纸";

  return (
    <>
      <ScrollToTopButton />
      <Stack spacing={3} sx={{ paddingBlock: 3 }}>
        <Card>
          <CardHeader
            title="背景类型"
            subheader="图片 or 纯色🤔"
            action={
              <TextField
                value={backgroundType}
                onChange={(e) => {
                  setSyncStore((draft) => {
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
          />
          <List disablePadding>
            <ListItem>
              <ListItemText primary={primaryText} secondary={secondaryText} />
            </ListItem>
          </List>
        </Card>
        <BackgroundTypePanel backgroundType={backgroundType} />
        <Card>
          <CardHeader title="遮罩和粒子" />
          <CardContent>
            <Grid container spacing={1.5}>
              <Grid size={12}>
                <FormLabel>粒子特效</FormLabel>
                <div
                  style={{
                    paddingBlockStart: 13,
                  }}
                >
                  <ToggleButtonGroup
                    value={preset}
                    onChange={(_, value) => {
                      switch (value) {
                        case "snow":
                        case "links":
                        case "bubbles":
                        case "":
                          setSyncStore((d) => {
                            d.preset = value;
                          });
                      }
                    }}
                    exclusive
                    sx={{
                      gap: 2,
                      [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
                        {
                          borderTopRightRadius: theme.shape.borderRadius,
                          borderBottomRightRadius: theme.shape.borderRadius,
                        },
                      [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
                        {
                          borderTopLeftRadius: theme.shape.borderRadius,
                          borderBottomLeftRadius: theme.shape.borderRadius,
                          borderLeft: `1px solid ${theme.palette.divider}`,
                        },
                      [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
                        {
                          borderLeft: `1px solid ${theme.palette.action.disabledBackground}`,
                        },
                    }}
                  >
                    <ToggleButton value={"snow"}>
                      <AcUnit />
                    </ToggleButton>
                    <ToggleButton value={"links"}>
                      <LinearScale />
                    </ToggleButton>
                    <ToggleButton value={"bubbles"}>
                      <BubbleChart />
                    </ToggleButton>
                    <ToggleButton value={""}>
                      <DoNotDisturb />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormLabel>遮罩亮度</FormLabel>
                <Slider
                  value={alpha}
                  onChange={(_, value) => {
                    if (typeof value !== "number") {
                      return;
                    }

                    setSyncStore((d) => {
                      d.alpha = value;
                    });
                  }}
                  max={100}
                  min={0}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormLabel>背景模糊</FormLabel>
                <Slider
                  value={blur}
                  onChange={(_, value) => {
                    if (typeof value !== "number") {
                      return;
                    }

                    setSyncStore((d) => {
                      d.blur = value;
                    });
                  }}
                  max={100}
                  min={0}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};
