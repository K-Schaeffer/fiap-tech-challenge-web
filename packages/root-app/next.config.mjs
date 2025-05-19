import { NextFederationPlugin } from "@module-federation/nextjs-mf";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.output.publicPath = "/_next/";
    config.plugins.push(
      new NextFederationPlugin({
        name: "rootApp",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          landingApp: `landingApp@${process.env.LANDING_APP_REMOTE_ENTRY}`,
          dashboardApp: `dashboardApp@${process.env.DASHBOARD_APP_REMOTE_ENTRY}`,
        },
        shared: {
          "@mui/core-downloads-tracker": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/icons-material": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/system": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/utils": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/material-pigment-css": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/material-nextjs": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/styled-engine": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/private-theming": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@mui/material": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@material-ui/core": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
          "@material-ui/styles": {
            singleton: true,
            requiredVersion: "6.4.0",
          },
        },
      })
    );
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
    unoptimized: false,
  },
};

export default nextConfig;
