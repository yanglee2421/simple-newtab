import { Background, db } from "@/lib/db";
import { ObjectURLStore } from "@/lib/objectURL";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";

export const useImageObjectURL = (id: number) => {
  return useQuery({
    queryKey: ["database", "backgrounds", id],
    queryFn: async () => {
      const background = await db.backgrounds.get(id);

      if (!background) {
        return null;
      }

      return background;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useXX = (pageIndex: number, pageSize: number) => {
  const queryClient = useQueryClient();

  const backgrounds = useLiveQuery(() => {
    return db.backgrounds
      .offset(pageIndex * pageSize)
      .limit(pageSize)
      .toArray();
  });

  const onBackgroundsChange = React.useEffectEvent(
    (backgrounds: Background[]) => {
      backgrounds.forEach((background) => {
        queryClient.setQueryData(
          ["database", "backgrounds", background.id],
          background,
        );
      });
    },
  );

  React.useEffect(() => {
    if (!backgrounds) return;

    onBackgroundsChange(backgrounds);
  }, [backgrounds]);
};

const objectURLStore = new ObjectURLStore();

export const useObjectURL = (blob?: Blob) => {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (!blob) {
        return Boolean;
      }

      objectURLStore.subscribe(blob, onStoreChange);

      return () => {
        objectURLStore.unsubscribe(blob, onStoreChange);
      };
    },
    () => {
      if (!blob) {
        return null;
      }

      return objectURLStore.getSnapshot(blob);
    },
  );
};
