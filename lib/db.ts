import Dexie from "dexie";
import type { EntityTable } from "dexie";

type Background = {
  id: number;
  image: File;
};

export const db = new Dexie("database") as Dexie & {
  backgrounds: EntityTable<Background, "id">;
};

// Schema declaration:
db.version(1).stores({
  // primary key "id" automatically generated
  backgrounds: "++id",
});
