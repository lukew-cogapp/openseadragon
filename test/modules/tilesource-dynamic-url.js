/* global QUnit, testLog, Util */

//Testing of TileSource with getTileUrl that returns a function

(function() {
    let ASSERT = null;
    let done = null;
    let DYNAMIC_URL = "";
    let viewer = null;
    let restoreXhr = null;
    const OriginalTileGetUrl = OpenSeadragon.Tile.prototype.getUrl;
    // These variables allow tracking when the first request for data has finished
    let firstUrlPromise = null;
    let isFirstUrlPromiseResolved = false;
    let firstUrlPromiseResolver = null;

    /**
     * Set up shared variables for test
     */
    const configure = function(assert, url, assertAsyncDone) {
        ASSERT = assert;
        DYNAMIC_URL = url;
        done = assertAsyncDone;
        firstUrlPromise = new Promise(resolve => {
            firstUrlPromiseResolver = () => {
                isFirstUrlPromiseResolved = true;
                resolve();
            };
        });
    };

    const DynamicUrlTestTileSource = class extends OpenSeadragon.TileSource {};

    OpenSeadragon.extend( DynamicUrlTestTileSource.prototype, {
        supports: function(_data, url){
            return !!url && url.indexOf('dynamic') !== -1;
        },

        configure: function(_data, url, postData){
            //some default data to trigger painting
            return {
                postData: postData,
                tilesUrl: url,
                fileFormat: "jpg",
                sizeData: {Width: 55, Height: 55},
                width: 55,
                height: 55,
                tileSize: 55,
                tileOverlap: 55,
                minLevel: 1,
                maxLevel: 1,
                displayRects: []
            };
        },

        // getTileUrl return a function that must be called by Tile.getUrl
        getTileUrl: function(_level, _x, _y) {
            // Assert that custom tile source is called correctly
            ASSERT.ok(true, 'DynamicUrlTileSource.getTileUrl called');
            return () => DYNAMIC_URL;
        },

        tileExists: function (_level, _x, _y) {
            return true;
        }
    });
    OpenSeadragon.register(DynamicUrlTestTileSource);

    QUnit.module('TileSourceDynamicUrl', {
        beforeEach: function () {
            testLog.reset();
            $("#qunit-fixture").html("<div id='example'></div>");

            let hasCompletedImageInfoRequest = false;
            restoreXhr = Util.fakeXhr(function(request) {
                //first AJAX firing is the image info getter, second is the first tile request: can exit
                if (hasCompletedImageInfoRequest) {
                    // Assert dynamic url from tileSource is called
                    ASSERT.equal(request.url, DYNAMIC_URL, 'Called dynamic url correctly: ' + DYNAMIC_URL);
                    // If we've only queried for one url, resolve that promise to set up second query
                    // Otherwise close viewer
                    if (isFirstUrlPromiseResolved) {
                        viewer.close();
                        done();
                    } else {
                        firstUrlPromiseResolver();
                    }
                    return false;
                }
                hasCompletedImageInfoRequest = true;
                return true;
            });

            // Override Tile::getUrl to ensure getUrl is called successfully.
            OpenSeadragon.Tile.prototype.getUrl = function () {
                // if ASSERT is still truthy, call ASSERT.ok. If the viewer
                // has already been destroyed and ASSERT has set to null, ignore this
                if (ASSERT) {
                    ASSERT.ok(true, 'Tile.getUrl called');
                }
                return OriginalTileGetUrl.apply(this, arguments);
            };
        },

        afterEach: function () {
            ASSERT = null;

            if (viewer){
                viewer.destroy();
            }

            viewer = null;

            restoreXhr();
            OpenSeadragon.Tile.prototype.getUrl = OriginalTileGetUrl;
        }
    });


    /**
     * Create viewer for test
     */
    const testUrlCall = function(tileSourceUrl) {
        const timeWatcher = Util.timeWatcher(ASSERT, 7000);

        viewer = OpenSeadragon({
            id: 'example',
            prefixUrl: '/build/openseadragon/images/',
            tileSources: tileSourceUrl,
            loadTilesWithAjax: true,
        });

        const failHandler = function (event) {
            testPostData(event.postData, "event: 'open-failed'");
            viewer.removeHandler('open-failed', failHandler);
            viewer.close();
        };
        viewer.addHandler('open-failed', failHandler);

        const readyHandler = function (event) {
            //relies on Tilesource contructor extending itself with options object
            testPostData(event.postData, "event: 'ready'");
            viewer.removeHandler('ready', readyHandler);
        };
        viewer.addHandler('ready', readyHandler);


        const openHandler = function(_event) {
            viewer.removeHandler('open', openHandler);
            ASSERT.ok(true, 'Open event was sent');
            viewer.addHandler('close', closeHandler);
            viewer.world.draw();
        };

        const closeHandler = function(_event) {
            viewer.removeHandler('close', closeHandler);
            $('#example').empty();
            ASSERT.ok(true, 'Close event was sent');
            timeWatcher.done();
        };
        viewer.addHandler('open', openHandler);

        return viewer;
    };

    // ----------
    QUnit.test('TileSource.getTileUrl supports returning a function', function(assert) {
        const done = assert.async();
        configure(assert, 'dynamicUrl', done);
        const viewer = testUrlCall('dynamicUrl');
        firstUrlPromise.then(() => {
            // after querying with first dynamic url, update the url and trigger new request
            DYNAMIC_URL = 'dynamicUrl2';
            delete viewer.world.getItemAt(0).tilesMatrix[1][0][0];
        })
    });
})();
