import { execSync } from "node:child_process";
import fs from "node:fs";
import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";
import pkg from "./package.json" with { type: "json" };

const outDir = "build/openseadragon";

function gitDescribe() {
    try {
        return execSync("git describe --tags --always --dirty", { encoding: "utf8" }).trim();
    } catch {
        return "unknown";
    }
}

const banner = [
    `//! ${pkg.name} ${pkg.version}`,
    `//! Built on ${new Date().toISOString().slice(0, 10)}`,
    `//! Git commit: ${gitDescribe()}`,
    "//! http://openseadragon.github.io",
    "//! License: http://openseadragon.github.io/license/",
    "",
].join("\n");

const copyImages = {
    name: "copy-images",
    closeBundle() {
        fs.cpSync("images", `${outDir}/images`, { recursive: true });
    },
};

const define = { __OSD_VERSION__: JSON.stringify(pkg.version) };

// One file per source module, so an application's bundler can drop the
// drawers, tile sources and viewer features it never registers.
const esmConfig = {
    publicDir: false,
    define,
    build: {
        outDir: "build/esm",
        minify: false,
        target: "es2015",
        sourcemap: true,
        lib: {
            entry: { esm: "src/esm.js" },
            formats: ["es"],
        },
        rolldownOptions: {
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
};

export default defineConfig(({ mode }) => {
    const min = mode === "min";
    const coverage = mode === "coverage";
    if (mode === "esm") {
        return esmConfig;
    }
    return {
        publicDir: false,
        define,
        plugins: coverage
            ? [istanbul({ include: "src/*", forceBuildInstrument: true, requireEnv: false })]
            : [copyImages],
        build: {
            outDir: coverage ? "instrumented" : outDir,
            // The min build runs second and must keep the unminified files.
            emptyOutDir: !min,
            minify: min,
            // Matches the ES2015 syntax the source is linted to, so the minifier
            // does not emit newer operators such as ||=.
            target: "es2015",
            sourcemap: true,
            lib: {
                entry: "src/umd.js",
                name: "OpenSeadragon",
                formats: ["umd"],
                fileName: () => (min ? "openseadragon.min.js" : "openseadragon.js"),
            },
            rolldownOptions: {
                output: {
                    postBanner: banner,
                    exports: "default",
                },
            },
        },
    };
});
