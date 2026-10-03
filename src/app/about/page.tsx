import Home from "../page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Hamza Lemghari",
  description:
    "Learn more about Hamza Lemghari, a full-stack software developer.",
};

export default function AboutPage() {
  return <Home />;
}
