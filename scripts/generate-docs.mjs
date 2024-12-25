import * as OpenAPI from "fumadocs-openapi";
import { rimrafSync } from "rimraf";

const out = "./src/content/docs/api-route";

// clean generated files
rimrafSync(out, {
  filter(v) {
    return !v.endsWith("index.mdx") && !v.endsWith("meta.json");
  },
});

void OpenAPI.generateFiles({
  // input files
  input: ["./src/config/pastebin.yml"],
  output: out,
  groupBy: "tag",
});
