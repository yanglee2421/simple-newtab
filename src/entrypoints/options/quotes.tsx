import {
  Box,
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
  AddOutlined,
  DeleteOutlined,
  FormatQuoteOutlined,
  HistoryEduOutlined,
  KeyboardReturnOutlined,
  RestoreOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { z } from "zod";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { db } from "@/utils/db";

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

const calculatePageCount = (count: number, pageSize: number) => {
  return Math.ceil(count / pageSize);
};

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
            color="error"
          >
            <DeleteOutlined />
          </IconButton>
        }
      >
        <ListItemIcon>
          <FormatQuoteOutlined />
        </ListItemIcon>
        <ListItemText primary={quote.content} secondary={quote.anthor} />
      </ListItem>
    ));
  };

  return (
    <Stack spacing={3} sx={{ paddingBlock: 3 }}>
      <Card>
        <CardHeader title="Quotes" action={<AddOutlined />} />
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
                                <KeyboardReturnOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="start">
                              <FormatQuoteOutlined />
                            </InputAdornment>
                          ),
                          slotProps: {
                            input: {
                              tabIndex: 1,
                            },
                          },
                        },
                      }}
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
                                <KeyboardReturnOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="start">
                              <HistoryEduOutlined />
                            </InputAdornment>
                          ),
                          slotProps: {
                            input: {
                              tabIndex: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </form.AppField>
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            form={formId}
            tabIndex={3}
            startIcon={<SaveOutlined />}
          >
            Submit
          </Button>
          <Button
            type="reset"
            form={formId}
            tabIndex={4}
            startIcon={<RestoreOutlined />}
          >
            Reset
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <Box>
            <Pagination
              page={pageIndex + 1}
              count={calculatePageCount(count || 0, pageSize)}
              onChange={(_, page) => {
                setPageIndex(page - 1);
              }}
            />
          </Box>
        </CardContent>
        <List disablePadding>{renderListRows()}</List>
      </Card>
    </Stack>
  );
};
