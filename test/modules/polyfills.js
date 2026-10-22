/* global QUnit, $, testLog */

( function() {

    QUnit.module( 'Polyfills', {
        beforeEach: function() {
            testLog.reset();
        }
    } );

    // ----------
    QUnit.test( 'pageScroll', function(assert) {
        // Setup
        const origWidth = $( "body" ).width(),
            origHeight = $( "body" ).height();
        $( "body" ).width( origWidth + 10000 );
        $( "body" ).height( origHeight + 10000 );
        $( document ).scrollLeft( 0 );
        $( document ).scrollTop( 0 );
        // End setup

        let scroll = OpenSeadragon.getPageScroll();
        assert.equal( scroll.x, 0, "Scroll should be 0 at beginning." );
        assert.equal( scroll.y, 0, "Scroll should be 0 at beginning." );

        $( document ).scrollLeft( 200 );
        $( document ).scrollTop( 100 );
        scroll = OpenSeadragon.getPageScroll();
        assert.equal( scroll.x, 200, "getPageScroll after scrolling." );
        assert.equal( scroll.y, 100, "getPageScroll after scrolling." );

        OpenSeadragon.setPageScroll( new OpenSeadragon.Point( 100, 200 ) );
        assert.equal( $( document ).scrollLeft(), 100, "setPageScroll." );
        assert.equal( $( document ).scrollTop(), 200, "setPageScroll." );

        $( document ).scrollLeft( 20000 );
        $( document ).scrollTop( 20000 );
        const actualScrollLeft = $( document ).scrollLeft();
        const actualScrollTop = $( document ).scrollTop();
        OpenSeadragon.setPageScroll( new OpenSeadragon.Point( 0, 0 ) );
        OpenSeadragon.setPageScroll( new OpenSeadragon.Point( 20000, 20000 ) );
        assert.equal( $( document ).scrollLeft(), actualScrollLeft, "setPageScroll above limits clamps." );
        assert.equal( $( document ).scrollTop(), actualScrollTop, "setPageScroll above limits clamps." );

        // Teardown
        $( "body" ).width( origWidth );
        $( "body" ).height( origHeight );
        $( document ).scrollLeft( 0 );
        $( document ).scrollTop( 0 );
    } );

} )();
