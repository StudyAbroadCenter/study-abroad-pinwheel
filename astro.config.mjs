import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://studyabroadcenter.github.io",
  base: "/study-abroad-pinwheel",
  output: "static",
  integrations: [sitemap()],
});
