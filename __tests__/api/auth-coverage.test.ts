import fs from "fs";
import path from "path";

function findRouteFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file === "route.ts" || file === "route.js") {
      fileList.push(filePath);
    }
  });
  return fileList;
}

describe("Auth Coverage Audit", () => {
  const apiDir = path.join(process.cwd(), "app/api");
  const excludedPaths = [
    "app/api/auth",
    "app/api/health/route.ts",
    "app/api/api-keys/validate/route.ts",
  ];

  it("should ensure all protected API routes call requireAuth()", () => {
    const routes = findRouteFiles(apiDir);
    const unprotectedRoutes: string[] = [];

    routes.forEach((route) => {
      const relativePath = path.relative(process.cwd(), route).replace(/\\/g, "/");
      const isExcluded = excludedPaths.some((excluded) => relativePath.startsWith(excluded));

      if (isExcluded) return;

      const content = fs.readFileSync(route, "utf8");
      if (!content.includes("requireAuth(")) {
        unprotectedRoutes.push(relativePath);
      }
    });

    expect(unprotectedRoutes).toEqual([]);
  });
});
