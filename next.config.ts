import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/#about",
        permanent: false,
      },
      {
        source: "/skills",
        destination: "/#skills",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/#projects",
        permanent: false,
      },
      {
        source: "/contact",
        destination: "/#contact",
        permanent: false,
      },
      {
        source: "/contact-me",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/add",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/add/new",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
