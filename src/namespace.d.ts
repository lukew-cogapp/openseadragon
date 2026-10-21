// JSDoc in src names types as OpenSeadragon.X, the namespace the UMD build
// exposes. These aliases resolve those names to the modules that define them.
declare namespace OpenSeadragon {
    type ButtonState = (typeof import("./button.js").ButtonState)[keyof typeof import("./button.js").ButtonState];
    type Button = import("./button.js").Button;
    type ButtonGroup = import("./buttongroup.js").ButtonGroup;
    type CanvasDrawer = import("./canvasdrawer.js").CanvasDrawer;
    type ControlAnchor = (typeof import("./control.js").ControlAnchor)[keyof typeof import("./control.js").ControlAnchor];
    type Control = import("./control.js").Control;
    type ControlDock = import("./controldock.js").ControlDock;
    type DataTypeConverter = import("./datatypeconverter.js").DataTypeConverter;
    type TypeConverter = import("./datatypeconverter.js").TypeConverter;
    type TypeDestructor = import("./datatypeconverter.js").TypeDestructor;
    type ConversionStep = import("./datatypeconverter.js").ConversionStep;
    type DisplayRect = import("./displayrectangle.js").DisplayRect;
    type DrawerBase = import("./drawerbase.js").DrawerBase;
    type BaseDrawerOptions = import("./drawerbase.js").BaseDrawerOptions;
    type DziTileSource = import("./dzitilesource.js").DziTileSource;
    type EventSource = import("./eventsource.js").EventSource;
    type Event = import("./eventsource.js").Event;
    type EventHandler = import("./eventsource.js").EventHandler;
    type AsyncEventHandler = import("./eventsource.js").AsyncEventHandler;
    type HTMLDrawer = import("./htmldrawer.js").HTMLDrawer;
    type IIIFTileSource = import("./iiiftilesource.js").IIIFTileSource;
    type IIPTileSource = import("./iiptilesource.js").IIPTileSource;
    type ImageJob = import("./imageloader.js").ImageJob;
    type BatchImageJob = import("./imageloader.js").BatchImageJob;
    type ImageLoader = import("./imageloader.js").ImageLoader;
    type ImageTileSource = import("./imagetilesource.js").ImageTileSource;
    type IrisTileSource = import("./iristilesource.js").IrisTileSource;
    type LegacyTileSource = import("./legacytilesource.js").LegacyTileSource;
    type Mat3 = import("./matrix3.js").Mat3;
    type MouseTracker = import("./mousetracker.js").MouseTracker;
    type Navigator = import("./navigator.js").Navigator;
    type Options = import("./openseadragon.js").Options;
    type GestureSettings = import("./openseadragon.js").GestureSettings;
    type WebGLDrawerOptions = import("./openseadragon.js").WebGLDrawerOptions;
    type DrawerOptions = import("./openseadragon.js").DrawerOptions;
    type NavImages = import("./openseadragon.js").NavImages;
    type AsyncNullaryFunction<T> = import("./openseadragon.js").AsyncNullaryFunction<T>;
    type AsyncUnaryFunction<T, A> = import("./openseadragon.js").AsyncUnaryFunction<T, A>;
    type AsyncBinaryFunction<T, A, B> = import("./openseadragon.js").AsyncBinaryFunction<T, A, B>;
    type OsmTileSource = import("./osmtilesource.js").OsmTileSource;
    type OverlayPlacement = (typeof import("./overlay.js").OverlayPlacement)[keyof typeof import("./overlay.js").OverlayPlacement];
    type OverlayRotationMode = (typeof import("./overlay.js").OverlayRotationMode)[keyof typeof import("./overlay.js").OverlayRotationMode];
    type Overlay = import("./overlay.js").Overlay;
    type Placement = (typeof import("./placement.js").Placement)[keyof typeof import("./placement.js").Placement];
    type Point = import("./point.js").Point;
    type PriorityQueue = import("./priorityqueue.js").PriorityQueue;
    type Rect = import("./rectangle.js").Rect;
    type ReferenceStrip = import("./referencestrip.js").ReferenceStrip;
    type Spring = import("./spring.js").Spring;
    type Tile = import("./tile.js").Tile;
    type CacheRecord = import("./tilecache.js").CacheRecord;
    type InternalCacheRecord = import("./tilecache.js").InternalCacheRecord;
    type TileCache = import("./tilecache.js").TileCache;
    type TiledImage = import("./tiledimage.js").TiledImage;
    type TileSource = import("./tilesource.js").TileSource;
    type TileSourceOptions = import("./tilesource.js").TileSourceOptions;
    type TmsTileSource = import("./tmstilesource.js").TmsTileSource;
    type Viewer = import("./viewer.js").Viewer;
    type TileSourceSpecifier = import("./viewer.js").TileSourceSpecifier;
    type Viewport = import("./viewport.js").Viewport;
    type WebGLDrawer = import("./webgldrawer.js").WebGLDrawer;
    type World = import("./world.js").World;
    type ZoomifyTileSource = import("./zoomifytilesource.js").ZoomifyTileSource;
    type BROWSERS = (typeof import("./openseadragon.js").default.BROWSERS)[keyof typeof import("./openseadragon.js").default.BROWSERS];
    type Promise<T> = globalThis.Promise<T>;
    namespace MouseTracker {
        type EventProcessInfo = import("./mousetracker.js").EventProcessInfo;
        type GesturePoint = import("./mousetracker.js").GesturePoint;
    }
    namespace Overlay {
        type OnDrawCallback = import("./overlay.js").OnDrawCallback;
    }
    namespace TiledImage {
        type DrawTileInfo = import("./tiledimage.js").DrawTileInfo;
        type Issue = import("./tiledimage.js").Issue;
    }
}
