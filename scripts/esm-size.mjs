#!/usr/bin/env node
/**
 * Bundles a few typical applications against the built package (via its own
 * `exports`, so `sideEffects` applies) and prints the minified and gzipped
 * size each one ships. Run `npm run build` first.
 */
import fs from "node:fs";
import zlib from "node:zlib";
import { build } from "vite";

const scenarios = {
    "default import (everything)": `
        import OpenSeadragon from "openseadragon";
        OpenSeadragon({ id: "v", tileSources: "info.json" });`,
    "viewer + canvas + IIIF": `
        import { Viewer, CanvasDrawer, IIIFTileSource, register } from "openseadragon";
        register(CanvasDrawer, IIIFTileSource);
        new Viewer({ id: "v", drawer: "canvas", tileSources: "info.json" });`,
    "viewer + webgl + canvas + DZI + IIIF + navigator": `
        import { Viewer, WebGLDrawer, CanvasDrawer, DziTileSource, IIIFTileSource, Navigator, register } from "openseadragon";
        register(WebGLDrawer, CanvasDrawer, DziTileSource, IIIFTileSource, Navigator);
        new Viewer({ id: "v", showNavigator: true, tileSources: "info.json" });`,
};

const dir = "build/esm-size";
fs.mkdirSync(dir, { recursive: true });

for (const [name, code] of Object.entries(scenarios)) {
    const entry = `${dir}/entry.js`;
    fs.writeFileSync(entry, code);
    const [output] = await build({
        configFile: false,
        logLevel: "error",
        build: {
            write: false,
            minify: true,
            target: "es2015",
            lib: { entry, name: "App", formats: ["iife"], fileName: "out" },
        },
    });
    const js = output.output[0].code;
    const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
    console.log(`${name.padEnd(50)} ${kb(js.length).padStart(9)} min ${kb(zlib.gzipSync(js).length).padStart(8)} gzip`);
}
fs.rmSync(dir, { recursive: true });
