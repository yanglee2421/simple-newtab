import Dexie from "dexie";
import type { EntityTable } from "dexie";

type Background = {
  id: number;
  image: File;
};

type Quote = {
  id: number;
  content: string;
};

export const db = new Dexie("database") as Dexie & {
  backgrounds: EntityTable<Background, "id">;
  quotes: EntityTable<Quote, "id">;
};

// Schema declaration:
db.version(2).stores({
  // primary key "id" automatically generated
  backgrounds: "++id",
  quotes: "++id, content",
});
