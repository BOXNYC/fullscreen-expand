/**
 * @fileoverview Implementation of fullscreen-expand component.
 * @author joe@box.biz (Joseph Weitzel)
 */
 
(function(){
  
  // Make sure we have Enabler
  if (typeof Enabler !== 'object')
    return console.error('Enabler.fullscreenExpand: Enabler not an object.');
  
  /**
    * Checks for fullscreen availability,
    * and makes expanded fullscreen.
    */
  function EnablerFullscreen() {
    
    // Private variables
    var self = this,
        options = {
          useMobileInnerHeight: false,
          onFullscreenExpandStart: function(){},
          onFullscreenExpandFinish: function(){},
          onFullscreenCollapseStart: function(){},
          onFullscreenCollapseFinish: function(){},
          onError: function(){}
        };
    
    function fullscreenCollapseFinishHandler(event) {
      options.onFullscreenCollapseFinish.call(self, {
        originalEvent: event
      });
      gwd.isFullscreen = gwd.fullscreenCalled = false;
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
    };
    
    function fullscreenCollapseStartHandler(event) {
      options.onFullscreenCollapseStart.call(self, {
        originalEvent: event
      });
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
      Enabler.finishFullscreenCollapse();
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, fullscreenCollapseStartHandler);
    };
    
    function fullscreenExpandFinishHandler(event) {
      options.onFullscreenExpandFinish.call(self, {
        originalEvent: event
      });
      Enabler.setFloatingPixelDimensions(1, 1);
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, fullscreenExpandFinishHandler);
    };
    
    function fullscreenExpandStartHandler(event) {
      options.onFullscreenExpandStart.call(self, {
        left: event.left,
        top: event.top,
        originalEvent: event
      });
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, fullscreenExpandFinishHandler);
      Enabler.finishFullscreenExpand();
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, fullscreenExpandStartHandler);
    };
    
    function updateMobileInnerHeight(width, height) {
      // Process innerheight based on device...
      return height;
    };
    
    function fullscreenDimentions(dimentions) {
      var height = updateMobileInnerHeight(dimentions.width, dimentions.height);
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, fullscreenExpandStartHandler);
      Enabler.requestFullscreenExpand(dimentions.width, height);
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fullscreenDimentions);
    };
    
    function fullscreenSupportHandler(event) {
      var ok = false;
      if (event.supported) {
        if (options.useMobileInnerHeight) {
          Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_DIMENSIONS, fullscreenDimentions);
          Enabler.queryFullscreenDimensions();
        } else {
          Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, fullscreenExpandStartHandler);
          Enabler.requestFullscreenExpand();
        }
        ok = true;
      }
      if (!ok) onError('Fullscreen not supported!');
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenSupportHandler);
    };
    
    function politeLoadHandler() {
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenSupportHandler);
      Enabler.queryFullscreenSupport();
      Enabler.removeEventListener(studio.events.StudioEvent.PAGE_LOADED, politeLoadHandler);
    };
    
    function enablerInitHandler() {
      if (Enabler.isPageLoaded()) {
        politeLoadHandler();
      } else {
        Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeLoadHandler);
      };
      Enabler.removeEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
    };
    
    this.expand = function(ops) {
      ops = ops || {};
      // Update options
      for(var op in ops) options[op] = ops[op];
      // Start fullscreen chain
      if (Enabler.isInitialized()) {
        enablerInitHandler();
      } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
      };
    };
    
    this.collapse = function() {
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, fullscreenCollapseStartHandler);
      Enabler.requestFullscreenCollapse();
    };
    
    function onError(event) {
      console.error('Enabler.fullscreen:', event);
      options.onError.call(self, event);
    };
    
  };
  
  Enabler.fullscreen = new EnablerFullscreen();
  
}());