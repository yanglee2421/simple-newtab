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
  ListItemText,
  Pagination,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { AddOutlined, DeleteOutlined, SaveOutlined } from "@mui/icons-material";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { z } from "zod";
import { db } from "@/lib/db";

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
    },
    onSubmit: async ({ value }) => {
      await db.quotes.add({
        content: value.content,
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
    if (!quotes) {
      return null;
    }

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
        <ListItemText primary={quote.content} secondary={`#${quote.id}`} />
      </ListItem>
    ));
  };

  return (
    <Stack spacing={3}>
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
                      variant="standard"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton type="submit" form={formId}>
                                <SaveOutlined />
                              </IconButton>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddOutlined />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                </form.AppField>
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <CardActions></CardActions>
      </Card>
      <Pagination
        page={pageIndex + 1}
        count={calculatePageCount(count || 0, pageSize)}
        onChange={(_, page) => {
          setPageIndex(page - 1);
        }}
      />
      <Paper>
        <List subheader={"Quote"} disablePadding>
          {renderListRows()}
        </List>
      </Paper>
    </Stack>
  );
};
