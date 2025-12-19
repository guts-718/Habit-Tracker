import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateWeeklyMarkdown } from "./weeklyExport.js";
import { getWeekMeta } from "./weekMeta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runWeeklyExport() {
  const { week, start, end } = getWeekMeta();
  const content = await generateWeeklyMarkdown();

  const reportsDir = path.join(
    __dirname,
    "../../reports/weekly"
  );

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `week-${week}_${start}_to_${end}.md`;
  const filepath = path.join(reportsDir, filename);

  fs.writeFileSync(filepath, content, "utf-8");

  console.log(`📄 Weekly report generated: ${filename}`);
}
