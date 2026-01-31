import Dexie from "dexie";
import type { EntityTable } from "dexie";

export type Background = {
  id: number;
  image: File;
};

type Quote = {
  id: number;
  content: string;
  anthor: string;
};

export const db = new Dexie("database") as Dexie & {
  backgrounds: EntityTable<Background, "id">;
  quotes: EntityTable<Quote, "id">;
};

// Schema declaration:
db.version(3).stores({
  // primary key "id" automatically generated
  backgrounds: "++id",
  quotes: "++id, content, anthor",
});
