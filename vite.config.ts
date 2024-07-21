import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      routes: async (defineRoutes) => {
        return defineRoutes((route) => {
          route("/", "routes/index.tsx");

          route("resume/:resumeId", "routes/$resumeId.tsx");
          route(
            "resume/:resumeId/work-experience/new",
            "routes/work-experience-new.tsx"
          );

          route(
            "resume/:resumeId/work-experience/:workExperienceId/edit",
            "routes/work-experience-edit.tsx"
          );

          route(
            "resume/:resumeId/work-experience/:workExperienceId/delete",
            "routes/work-experience-delete.tsx"
          );

          route("resume/new", "routes/resume.new.tsx");
        });
      },
    }),
    tsconfigPaths(),
  ],
});
