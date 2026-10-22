import { expectType, expectError } from 'tsd';
import { Viewer, CanvasDrawer, WebGLDrawer, IIIFTileSource, DziTileSource, Navigator, ReferenceStrip,
    TileSourceCollection, Point, register, determineDrawer, extend, getElementSize } from '..';

register(CanvasDrawer, WebGLDrawer, IIIFTileSource, DziTileSource, Navigator, ReferenceStrip);
expectError(register(Point));
expectError(register("canvas"));

expectType<(abstract new (...args: any[]) => import('..').DrawerBase) | null>(determineDrawer("canvas"));

const viewer = new Viewer({ id: "viewer", drawer: "canvas", tileSources: "info.json" });
expectType<Viewer>(viewer);
expectType<Point>(viewer.viewport.getCenter());

new TileSourceCollection(256, []);

expectType<any>(extend({}, { a: 1 }));
expectType<Point>(getElementSize("viewer"));
