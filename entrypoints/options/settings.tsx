import {
  Box,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Slider,
  TextField,
} from "@mui/material";
import { FindInPageOutlined } from "@mui/icons-material";
import { db } from "@/lib/db";
import {
  useSyncStore,
  useSubscribeSyncStoreChange,
} from "@/hooks/useSyncStore";
import { ScrollToTopButton } from "@/components/scroll";

export const Component = () => {
  const blur = useSyncStore((s) => s.blur);
  const alpha = useSyncStore((s) => s.alpha);
  const preset = useSyncStore((s) => s.preset);
  useSubscribeSyncStoreChange();

  const setSyncStore = useSyncStore.setState;

  return (
    <>
      <ScrollToTopButton />
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Background Image"
              fullWidth
              value={""}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton component="label">
                        <FindInPageOutlined />
                        <input
                          type="file"
                          value={""}
                          onChange={(e) => {
                            const file = e.target.files?.item(0);
                            if (!file) return;

                            db.backgrounds.add({ image: file });
                          }}
                          hidden
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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
              onDragOver={(e) => {
                e.preventDefault();
              }}
            />
          </Grid>
          <Grid size={12}>
            <FormLabel>Particles Preset</FormLabel>
            <RadioGroup
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
              row
            >
              <FormControlLabel control={<Radio value="snow" />} label="Snow" />
              <FormControlLabel
                control={<Radio value={"links"} />}
                label="Links"
              />
              <FormControlLabel
                control={<Radio value={"bubbles"} />}
                label="Bubbles"
              />
              <FormControlLabel control={<Radio value={""} />} label="None" />
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormLabel>Alpha</FormLabel>
            <Slider
              value={alpha}
              onChange={(_, value) => {
                if (typeof value !== "number") return;

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
            <FormLabel>Blur</FormLabel>
            <Slider
              value={blur}
              onChange={(_, value) => {
                if (typeof value !== "number") return;

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
      </Box>
    </>
  );
};
