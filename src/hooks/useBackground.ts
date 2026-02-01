import { db } from "@/utils/db";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const fetchBackground = (id: number) =>
  queryOptions({
    queryKey: ["database", "backgrounds", id],
    queryFn: async () => {
      const background = await db.backgrounds.get(id);

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
    staleTime: 1000 * 60 * 5,
  });

export const useBackground = (id: number) => {
  return useQuery(fetchBackground(id));
};
