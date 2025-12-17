import Database from "better-sqlite3";
import path from "path";
import fn from "./migrate.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to SQLite DB
const dbPath = path.join(__dirname, "../../data/discipline.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

fn(db);
// Export single shared DB instance
export default db;
