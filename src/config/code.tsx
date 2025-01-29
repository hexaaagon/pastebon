import { type Options as PrettierOptions } from "prettier";
import prettierPluginEstree from "prettier/plugins/estree";

import prettierParserBabel from "prettier/plugins/babel";
import prettierParserCss from "prettier/plugins/postcss";
import prettierParserGraphql from "prettier/plugins/graphql";
import prettierParserHtml from "prettier/plugins/html";
import prettierParserMarkdown from "prettier/plugins/markdown";
import prettierParserTypescript from "prettier/plugins/typescript";
import prettierParserYaml from "prettier/plugins/yaml";

// @ts-expect-error - no types
import prettierParserPhp from "@prettier/plugin-php/standalone";
import prettierParserXml from "@prettier/plugin-xml";
import prettierParserJava from "prettier-plugin-java";
import prettierParserSql from "prettier-plugin-sql";

import { type LucideIcon, File, FileType2 } from "lucide-react";
import {
  type IconType,
  SiC,
  SiClojure,
  SiCoffeescript,
  SiCplusplus,
  SiCss3,
  SiDocker,
  SiFsharp,
  SiGo,
  SiGraphql,
  SiHandlebarsdotjs,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiLess,
  SiLua,
  SiMarkdown,
  SiMysql,
  SiPerl,
  SiPostgresql,
  SiPhp,
  SiPug,
  SiPython,
  SiR,
  SiRedis,
  SiRuby,
  SiRust,
  SiGnubash,
  SiSqlite,
  SiSwift,
  SiTypescript,
  SiXml,
  SiYaml,
} from "@icons-pack/react-simple-icons";
import React from "react";

export const languages: [string, string, React.ReactNode][] = [
  ["Apex", "apex", <File key="apex" />],
  ["Azcli", "azcli", <File key="azcli" />],
  ["BAT", "bat", <File key="bat" />],
  ["C", "c", <SiC key="c" />],
  ["Clojure", "clojure", <SiClojure key="clojure" />],
  ["CoffeeScript", "coffeescript", <SiCoffeescript key="coffeescript" />],
  ["C++ (cpp)", "cpp", <SiCplusplus key="cpp" />],
  ["C# (csharp)", "csharp", <File key="csharp" />], // https://github.com/simple-icons/simple-icons/issues/11236
  ["CSS", "css", <SiCss3 key="css" />],
  ["Dockerfile", "dockerfile", <SiDocker key="dockerfile" />],
  ["F# (fsharp)", "fsharp", <SiFsharp key="fsharp" />],
  ["Go", "go", <SiGo key="go" />],
  ["GraphQL", "graphql", <SiGraphql key="graphql" />],
  ["Handlebars", "handlebars", <SiHandlebarsdotjs key="handlebars" />],
  ["HTML", "html", <SiHtml5 key="html" />],
  ["INI", "ini", <File key="ini" />],
  ["Java", "java", <File key="java" />], // https://github.com/simple-icons/simple-icons/issues/7374
  ["JavaScript", "javascript", <SiJavascript key="javascript" />],
  ["JSON", "json", <SiJson key="json" />],
  ["Kotlin", "kotlin", <SiKotlin key="kotlin" />],
  ["Less", "less", <SiLess key="less" />],
  ["Lua", "lua", <SiLua key="lua" />],
  ["Markdown", "markdown", <SiMarkdown key="markdown" />],
  ["msdax", "msdax", <File key="msdax" />],
  ["MySQL", "mysql", <SiMysql key="mysql" />],
  ["Objective-C", "objective-c", <File key="c" />],
  ["Pascal", "pascal", <File key="pascal" />],
  ["Perl", "perl", <SiPerl key="perl" />],
  ["PostgresQL (pgsql)", "pgsql", <SiPostgresql key="pgsql" />],
  ["PHP", "php", <SiPhp key="php" />],
  ["Plain Text", "plaintext", <FileType2 key="plaintext" />],
  ["Postiats", "postiats", <File key="postiats" />],
  ["Powerquery", "powerquery", <File key="powerquery" />],
  ["PowerShell", "powershell", <File key="powershell" />], // https://github.com/simple-icons/simple-icons/issues/11236
  ["Pug", "pug", <SiPug key="pug" />],
  ["Python", "python", <SiPython key="python" />],
  ["R", "r", <SiR key="r" />],
  ["Razor", "Razor", <File key="Razor" />],
  ["Redis", "Redis", <SiRedis key="Redis" />],
  ["Redshift", "Redshift", <File key="Redshift" />],
  ["Ruby", "Ruby", <SiRuby key="Ruby" />],
  ["Rust", "Rust", <SiRust key="Rust" />],
  ["sb", "sb", <File key="sb" />],
  ["Scheme", "scheme", <File key="scheme" />],
  ["SCSS", "scss", <File key="scss" />],
  ["Shell", "shell", <SiGnubash key="shell" />],
  ["Sol", "sol", <File key="sol" />],
  ["SQL", "sql", <SiSqlite key="sql" />],
  ["st", "st", <File key="st" />],
  ["Swift", "swift", <SiSwift key="swift" />],
  ["tcl", "tcl", <File key="tcl" />],
  ["TypeScript", "typescript", <SiTypescript key="typescript" />],
  ["vb", "vb", <File key="vb" />],
  ["XML", "xml", <SiXml key="xml" />],
  ["YAML", "yaml", <SiYaml key="yaml" />],
];

export const languageValues = languages.map((lang) => lang[1]) as [
  string,
  ...string[],
];

export function parser(options?: PrettierOptions): {
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
    json: {
      provider: "prettier",
      options: {
        parser: "json",
        plugins: [prettierParserBabel, prettierPluginEstree],
        ...options,
      },
    },
    css: {
      provider: "prettier",
      options: {
        parser: "css",
        plugins: [prettierParserCss],
        ...options,
      },
    },
    graphql: {
      provider: "prettier",
      options: {
        parser: "graphql",
        plugins: [prettierParserGraphql],
        ...options,
      },
    },
    html: {
      provider: "prettier",
      options: {
        parser: "html",
        plugins: [prettierParserHtml],
        ...options,
      },
    },
    markdown: {
      provider: "prettier",
      options: {
        parser: "markdown",
        plugins: [prettierParserMarkdown],
        ...options,
      },
    },
    typescript: {
      provider: "prettier",
      options: {
        parser: "typescript",
        plugins: [prettierParserTypescript, prettierPluginEstree],
        ...options,
      },
    },
    yaml: {
      provider: "prettier",
      options: {
        parser: "yaml",
        plugins: [prettierParserYaml],
        ...options,
      },
    },

    php: {
      provider: "prettier",
      options: {
        parser: "php",
        plugins: [prettierParserPhp],
        ...options,
      },
    },
    xml: {
      provider: "prettier",
      options: {
        parser: "xml",
        plugins: [prettierParserXml],
        ...options,
      },
    },
    java: {
      provider: "prettier",
      options: {
        parser: "java",
        plugins: [prettierParserJava],
        ...options,
      },
    },
    sql: {
      provider: "prettier",
      options: {
        parser: "sql",
        plugins: [prettierParserSql],
        ...options,
      },
    },
  };
}
