import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix Prettier dynamic require warnings by externalizing it on the server
    if (isServer) {
      config.externals = [...(config.externals || []), "prettier"];
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      "@fumari/json-schema-to-typescript/node_modules/prettier": "prettier",
    };

    return config;
  },
};

export default withMDX(config);
