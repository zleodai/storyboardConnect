import postgres from "postgres";
import { getDatabaseUrl } from "./env";

export const sql = postgres(getDatabaseUrl(), {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require",
});
