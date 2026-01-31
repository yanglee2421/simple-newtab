import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
} from "@mui/material";
import { ScrollToTopButton } from "@/components/scroll";

export const Component = () => {
  const blur = useSyncStore((s) => s.blur);
  const alpha = useSyncStore((s) => s.alpha);
  const preset = useSyncStore((s) => s.preset);

  const setSyncStore = useSyncStore.setState;

  return (
    <>
      <ScrollToTopButton />
      <Box sx={{ padding: 3 }}>
        <Card>
          <CardHeader title="Particles Preset" />
          <CardContent>
            <Grid container spacing={3}>
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
                  <FormControlLabel
                    control={<Radio value="snow" />}
                    label="Snow"
                  />
                  <FormControlLabel
                    control={<Radio value={"links"} />}
                    label="Links"
                  />
                  <FormControlLabel
                    control={<Radio value={"bubbles"} />}
                    label="Bubbles"
                  />
                  <FormControlLabel
                    control={<Radio value={""} />}
                    label="None"
                  />
                </RadioGroup>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormLabel>Alpha</FormLabel>
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
                <FormLabel>Blur</FormLabel>
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
      </Box>
    </>
  );
};
