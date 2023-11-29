import * as esbuild from "esbuild";

let ctx = await esbuild.context({
  platform: "neutral",
  entryPoints: ["src/*.ts"],
  outdir: "dist/",
  bundle: true,
  allowOverwrite: true,
  minify: false,
});

async function watch() {
  await ctx.watch();

  console.log("Watching for changes...");
}

watch();
