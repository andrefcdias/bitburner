import * as esbuild from "esbuild";

async function watch() {
  let ctx = await esbuild.context({
    platform: "neutral",
    entryPoints: ["src/*.ts"],
    outdir: "dist/",
    bundle: true,
    allowOverwrite: true,
    minify: false,
  });
  await ctx.watch();
  console.log("Watching...");
}
watch();
