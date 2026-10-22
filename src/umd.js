/*
 * OpenSeadragon - namespace build
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

import * as utils from "./openseadragon.js";
import * as classes from "./index.js";
import { fullScreenApi } from "./fullscreen.js";

/**
 * The script-tag global: a callable that creates a {@link Viewer}, carrying
 * every utility and class as a property.
 * @param {Partial<utils.Options>} options
 */
function OpenSeadragon(options) {
    return new classes.Viewer(options);
}
Object.assign(OpenSeadragon, utils, classes, fullScreenApi);
Object.defineProperty(OpenSeadragon, "pixelDensityRatio", { get: () => utils.pixelDensityRatio });

classes.register(
    classes.HTMLDrawer,
    classes.CanvasDrawer,
    classes.WebGLDrawer,
    classes.DziTileSource,
    classes.IIIFTileSource,
    classes.IIPTileSource,
    classes.IrisTileSource,
    classes.OsmTileSource,
    classes.TmsTileSource,
    classes.ZoomifyTileSource,
    classes.LegacyTileSource,
    classes.ImageTileSource,
    classes.Navigator,
    classes.ReferenceStrip
);

export default OpenSeadragon;
