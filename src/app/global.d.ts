import { Database as DB } from "~/lib/repository/api/database.types";

declare global {
  type Database = DB;
}
