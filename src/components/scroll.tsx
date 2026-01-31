import { ArrowUpwardOutlined } from "@mui/icons-material";
import { Zoom, Fab } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";

const useScrollToTop = () => {
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);

  const anchorEl = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = anchorEl.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowScrollToTop(false);
      } else {
        setShowScrollToTop(true);
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [anchorEl, showScrollToTop] as const;
};

type ScrollToTopProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  show: boolean;
};

export const ScrollToTop = (props: ScrollToTopProps) => {
  return (
    <Zoom in={props.show} unmountOnExit>
      <Fab
        sx={{ position: "fixed", bottom: 36, right: 36 }}
        size="small"
        color="primary"
        onClick={() => {
          props.ref.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }}
      >
        <ArrowUpwardOutlined />
      </Fab>
    </Zoom>
  );
};

ScrollToTop.useScrollToTop = useScrollToTop;

export const ScrollToTopButton = () => {
  const [ref, show] = useScrollToTop();

  return (
    <>
      <div ref={ref}></div>
      {createPortal(<ScrollToTop ref={ref} show={show} />, document.body)}
    </>
  );
};
