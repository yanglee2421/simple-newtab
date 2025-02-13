import React from "react";
import { useIndexedStore } from "@/hooks/useIndexedStore";
import { base64ToObjectUrl } from "@/lib/utils";
import { Box } from "@mui/material";

export const Home = () => {
  const [href, setHref] = React.useState("");

  const backgroundImage = useIndexedStore((s) => s.backgroundImage);

  React.useEffect(() => {
    const val = base64ToObjectUrl(backgroundImage);
    setHref(val);

    return () => {
      URL.revokeObjectURL(val);
    };
  }, [backgroundImage]);

  return (
    <Box>
      <img src={href} alt="" />
    </Box>
  );
};
