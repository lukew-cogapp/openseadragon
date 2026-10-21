// @ts-check
/*
 * OpenSeadragon - registry
 *
 * Copyright (C) 2009 CodePlex Foundation
 * Copyright (C) 2010-2025 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of CodePlex Foundation nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import $ from "./openseadragon.js";
import { DrawerBase } from "./drawerbase.js";

// The viewer only knows the drawers, tile sources and optional features
// registered here, so a bundler can leave out the ones an application never
// registers. The UMD build registers everything.
/** @type {Function[]} */
const drawers = [];
/** @type {Function[]} */
const tileSources = [];
/** @type {Object<string, Function>} */
const viewerFeatures = {};

/**
 * Makes drawers, tile sources, the Navigator and the ReferenceStrip available
 * to viewers. Tile sources are tried in registration order when detecting the
 * type of a tile source configuration.
 * @function OpenSeadragon.register
 * @param {...(Function & {viewerFeature?: string})} classes
 * @since 7.0.0
 */
function register(...classes) {
    for (const Class of classes) {
        if (Class.prototype instanceof DrawerBase) {
            drawers.push(Class);
        } else if (Class.viewerFeature) {
            viewerFeatures[Class.viewerFeature] = Class;
        } else if ($.isFunction(Class.prototype.supports)) {
            tileSources.push(Class);
        } else {
            $.console.error("register: %s is not a drawer, tile source or viewer feature", Class);
        }
    }
}

// Classes assigned straight onto the namespace, as plugins written for
// earlier versions do, are still found after the registered ones.
/**
 * @param {Function[]} registered
 * @param {function(Function, string): boolean} isMatch
 * @returns {Function[]}
 */
function candidates(registered, isMatch) {
    const namespace = /** @type {Record<string, any>} */ ($);
    const extra = Object.keys($).filter((key) =>
        $.isFunction(namespace[key]) && !registered.includes(namespace[key]) && isMatch(namespace[key], key));
    return registered.concat(extra.map((key) => namespace[key]));
}

/** @param {Function} Drawer */
function drawerType(Drawer) {
    return Drawer.prototype.getType.call(Drawer);
}

/** @param {Function} Class */
function isDrawer(Class) {
    return Class.prototype instanceof DrawerBase && $.isFunction(Class.prototype.getType);
}

/**
 * The drawer types 'auto' expands to: ['canvas'] on iOS-like devices, where
 * the WebGL drawer is slower, otherwise ['webgl', 'canvas'] so canvas is tried
 * if WebGL fails. Types that are not registered are left out.
 * @private
 * @returns {string[]}
 */
function getAutoDrawerCandidates() {
    // Modern iPads report themselves as Mac, so also check for a coarse pointer.
    const isPrimaryTouch = window.matchMedia('(pointer: coarse)').matches;
    const isIOSDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent) && isPrimaryTouch;
    const types = isIOSDevice ? ['canvas'] : ['webgl', 'canvas'];
    return types.filter((type) => determineDrawer(type));
}

/**
 * Find drawer
 * @function OpenSeadragon.determineDrawer
 * @param {String} id - a drawer type, or 'auto'
 * @returns {Function|null}
 */
function determineDrawer(id) {
    if (id === 'auto') {
        id = getAutoDrawerCandidates()[0];
    }
    return candidates(drawers, isDrawer).find((Drawer) => isDrawer(Drawer) && drawerType(Drawer) === id) || null;
}

/**
 * Determines the TileSource implementation by calling `supports` on each
 * registered tile source.
 * @private
 * @param {OpenSeadragon.TileSource|OpenSeadragon.Viewer} tileSource - `this` for the `supports` call
 * @param {Object|Array<any>|Document} data - the tile source configuration object
 * @param {String} url - the url where the tile source configuration object was
 *      loaded from, if any.
 * @returns {Function|null}
 */
function determineTileSourceType(tileSource, data, url) {
    const isTileSource = /** @param {Function} Class @param {string} key */ (Class, key) => /.+TileSource$/.test(key) && $.isFunction(Class.prototype.supports);
    const found = candidates(tileSources, isTileSource).find(
        (TileSource) => TileSource.prototype.supports.call(tileSource, data, url));
    if (!found) {
        $.console.error("No TileSource was able to open %s %s", url, data);
    }
    return found || null;
}

export { register, determineDrawer, getAutoDrawerCandidates, determineTileSourceType, viewerFeatures };
