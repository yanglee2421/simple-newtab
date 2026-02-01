import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import {
  Add,
  Delete,
  FormatQuote,
  HistoryEdu,
  KeyboardReturn,
  Restore,
  Save,
} from "@mui/icons-material";
import { z } from "zod";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { db } from "@/utils/db";

const calculatePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

const { formContext, fieldContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  formContext,
  fieldContext,
  formComponents: {
    Button,
  },
  fieldComponents: {
    TextField,
  },
});

const schema = z.object({
  content: z.string().min(1),
  anthor: z.string(),
});

export const Component = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(24);

  const formId = React.useId();

  const quotes = useLiveQuery(() => {
    return db.quotes
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  }, [pageIndex, pageSize]);

  const form = useAppForm({
    defaultValues: {
      content: "",
      anthor: "",
    },
    onSubmit: async ({ value }) => {
      await db.quotes.add({
        content: value.content,
        anthor: value.anthor,
      });
    },
    validators: {
      onChange: schema,
    },
  });

  const count = useLiveQuery(() => {
    return db.quotes.count();
  });

  const renderListRows = () => {
    if (!quotes) return null;

    return quotes.map((quote) => (
      <ListItem
        key={quote.id}
        secondaryAction={
          <IconButton
            onClick={() => {
              db.quotes.delete(quote.id);
            }}
          >
            <Delete />
          </IconButton>
        }
      >
        <ListItemIcon>
          <FormatQuote />
        </ListItemIcon>
        <ListItemText primary={quote.content} secondary={quote.anthor} />
      </ListItem>
    ));
  };

  return (
    <Stack spacing={3} sx={{ paddingBlock: 3 }}>
      <Card>
        <CardHeader title="Quotes" subheader="新增句子" action={<Add />} />
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await form.handleSubmit();
              form.reset();
            }}
            id={formId}
            noValidate
          >
            <Grid container spacing={3}>
              <Grid size={12}>
                <form.AppField name="content">
                  {(contentField) => (
                    <contentField.TextField
                      value={contentField.state.value}
                      onChange={(e) => {
                        contentField.handleChange(e.target.value);
                      }}
                      onBlur={contentField.handleBlur}
                      error={contentField.state.meta.errors.length > 0}
                      helperText={contentField.state.meta.errors.at(0)?.message}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                type="submit"
                                form={formId}
                                tabIndex={5}
                              >
                                <KeyboardReturn />
                              </IconButton>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="start">
                              <FormatQuote />
                            </InputAdornment>
                          ),
                          slotProps: {
                            input: {
                              tabIndex: 1,
                            },
                          },
                        },
                      }}
                      label="语录"
                    />
                  )}
                </form.AppField>
              </Grid>
              <Grid size={12}>
                <form.AppField name="anthor">
                  {(anthorField) => (
                    <anthorField.TextField
                      value={anthorField.state.value}
                      onChange={(e) => {
                        anthorField.handleChange(e.target.value);
                      }}
                      onBlur={anthorField.handleBlur}
                      error={anthorField.state.meta.errors.length > 0}
                      helperText={anthorField.state.meta.errors.at(0)?.message}
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                type="submit"
                                form={formId}
                                tabIndex={6}
                              >
                                <KeyboardReturn />
                              </IconButton>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="start">
                              <HistoryEdu />
                            </InputAdornment>
                          ),
                          slotProps: {
                            input: {
                              tabIndex: 2,
                            },
                          },
                        },
                      }}
                      label="作者"
                    />
                  )}
                </form.AppField>
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" form={formId} tabIndex={3} startIcon={<Save />}>
            Submit
          </Button>
          <Button
            type="reset"
            form={formId}
            tabIndex={4}
            startIcon={<Restore />}
          >
            Reset
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardHeader title="已存储的" subheader="以下是已存入的句子" />
        <List disablePadding>{renderListRows()}</List>
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
    </Stack>
  );
};
