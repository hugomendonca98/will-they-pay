import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const svgDir = path.join(root, "assets/wtp-icons/svg");
const labelsFile = path.join(root, "assets/wtp-icons/copy/icon-labels.json");
const labels = JSON.parse(fs.readFileSync(labelsFile, "utf8"));

function toExportName(file) {
  return file
    .replace(/\.svg$/, "")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

const files = fs.readdirSync(svgDir).filter((f) => f.endsWith(".svg")).sort();
const names = files.map((f) => f.replace(/\.svg$/, ""));

let body = `// Generated from assets/wtp-icons/svg — run: node scripts/generate-wtp-icons.mjs\n\n`;
body += `export const WTP_ICON_NAMES = ${JSON.stringify(names)} as const;\n`;
body += `export type WtpIconName = (typeof WTP_ICON_NAMES)[number];\n\n`;
body += `export const WTP_ICON_PATHS: Record<WtpIconName, string> = {\n`;

for (const file of files) {
  const name = file.replace(/\.svg$/, "");
  const svg = fs.readFileSync(path.join(svgDir, file), "utf8");
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim()
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin");
  body += `  "${name}": \`${inner.replace(/`/g, "\\`")}\`,\n`;
}
body += `};\n`;

const iconsDir = path.join(root, "src/components/icons");
fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(iconsDir, "wtp-icon-paths.ts"), body);

const metaOut = path.join(iconsDir, "icon-labels.ts");
let meta = `import type { WtpIconName } from "./wtp-icon-paths";\n\n`;
meta += `export type WtpIconLabel = {\n  label: string;\n  ariaLabel: string;\n  tooltip: string | null;\n};\n\n`;
meta += `export const WTP_ICON_LABELS: Record<WtpIconName, WtpIconLabel> = ${JSON.stringify(
  Object.fromEntries(Object.entries(labels).filter(([k]) => !k.startsWith("_"))),
  null,
  2,
)} as const;\n`;
fs.writeFileSync(metaOut, meta);

let index = `import { createWtpIcon } from "./create-wtp-icon";\n\n`;
for (const file of files) {
  const exportName = `Icon${toExportName(file)}`;
  const name = file.replace(/\.svg$/, "");
  index += `export const ${exportName} = createWtpIcon("${name}");\n`;
}
index += `\nexport { WtpIcon, type WtpIconProps } from "./create-wtp-icon";\n`;
index += `export type { WtpIconName } from "./wtp-icon-paths";\n`;
index += `export { WTP_ICON_LABELS } from "./icon-labels";\n`;
fs.writeFileSync(path.join(iconsDir, "index.ts"), index);

console.log(`Generated ${files.length} icons.`);
