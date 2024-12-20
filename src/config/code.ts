import { type Options as PrettierOptions } from "prettier";
import prettierParserBabel from "prettier/plugins/babel";
import prettierParserTypescript from "prettier/plugins/typescript";
import prettierPluginEstree from "prettier/plugins/estree";

export const languages: {
  [key: string]: string | undefined;
} = {
  Apex: "apex",
  Azcli: "azcli",
  BAT: "bat",
  C: "c",
  Clojure: "clojure",
  CoffeeScript: "coffeescript",
  "C++ (cpp)": "cpp",
  "C# (csharp)": "csharp",
  CSS: "css",
  Dockerfile: "dockerfile",
  "F# (fsharp)": "fsharp",
  Go: "go",
  GraphQL: "graphql",
  Handlebars: "handlebars",
  HTML: "html",
  INI: "ini",
  Java: "java",
  JavaScript: "javascript",
  JSON: "json",
  Kotlin: "kotlin",
  Less: "less",
  Lua: "lua",
  Markdown: "markdown",
  msdax: "msdax",
  MySQL: "mysql",
  "Objective-C": "objective-c",
  Pascal: "pascal",
  Perl: "perl",
  PGSQL: "pgsql",
  PHP: "php",
  "Plain Text": "plaintext",
  Postiats: "postiats",
  Powerquery: "powerquery",
  PowerShell: "powershell",
  Pug: "pug",
  Python: "python",
  R: "r",
  Razor: "Razor",
  Redis: "Redis",
  Redshift: "Redshift",
  Ruby: "Ruby",
  Rust: "Rust",
  sb: "sb",
  Scheme: "scheme",
  SCSS: "scss",
  Shell: "shell",
  Sol: "sol",
  SQL: "sql",
  st: "st",
  Swift: "swift",
  tcl: "tcl",
  TypeScript: "typescript",
  vb: "vb",
  XML: "xml",
  YAML: "yml",
};

export function parser(options: PrettierOptions): {
  [key: string]: {
    provider: "prettier";
    options: PrettierOptions;
  };
} {
  return {
    javascript: {
      provider: "prettier",
      options: {
        parser: "babel",
        plugins: [prettierParserBabel, prettierPluginEstree],
        ...options,
      },
    },
    typescript: {
      provider: "prettier",
      options: {
        parser: "babel",
        plugins: [prettierParserTypescript, prettierPluginEstree],
        ...options,
      },
    },
  };
}
