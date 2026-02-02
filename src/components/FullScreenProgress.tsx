import { CircularProgress, styled } from "@mui/material";

const ProgressWrapper = styled("div")({
  position: "fixed",
  insetInlineStart: 0,
  insetBlockStart: 0,
  inlineSize: "100dvw",
  blockSize: "100dvh",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const FullScreenProgress = () => {
  return (
    <ProgressWrapper>
      <CircularProgress />
    </ProgressWrapper>
  );
};
