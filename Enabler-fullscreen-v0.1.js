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
        left: event.left,
        top: event.top,
        originalEvent: event
      });
      gwd.isFullscreen = gwd.fullscreenCalled = false;
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
    };
    
    function fullscreenCollapseStartHandler(event) {
      options.onFullscreenCollapseStart.call(self, {
        left: event.left,
        top: event.top,
        originalEvent: event
      });
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
      Enabler.finishFullscreenCollapse();
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, fullscreenCollapseStartHandler);
    };
    
    function fullscreenExpandFinishHandler(event) {
      options.onFullscreenExpandFinish.call(self, {
        left: event.left,
        top: event.top,
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


/*

(function(){
  
  // Make sure we have gwd object
  if (typeof gwd === typeof undefined)
    return console.error('gwd.fullscreenExpand: gwd undefined');
  
  gwd.fullscreenExpand = function(options){
    
    options = options || {};
    
    var defaultOptions = {
      onFullscreenExpandStart: [function(){
        var bannerPage = document.getElementById('banner-page');
        gwd.expandOffset = {left: event.left, top: event.top};
        if(gwd.expandOffset.top) bannerPage.style.top = gwd.expandOffset.top + 'px';
        if(gwd.expandOffset.left) bannerPage.style.left = gwd.expandOffset.left + 'px';
      }]
    };
    for(var option in options) defaultOptions[option] = options[option];
    
    Enabler.fullscreenExpand(defaultOptions);
  };

}());


*/




/*


(function() {
  
  gwd.fsdebug = false;
  
  if (typeof gwd !== 'object') {
    console.error('gwd is not an object. It is:', typeof gwd);
    return;
  }
  
  if (typeof Enabler !== 'object') {
    console.error('gwd is not an object. It is:', typeof Enabler);
    return;
  }
  
  function fslog() {
    if (gwd.fsdebug) console.log.apply(console, arguments);
  }
  
  function fullscreenSupportHandler(event) {
    fslog('fullscreenSupportHandler');
    if (event.supported) Enabler.requestFullscreenExpand();
    else console.error('Fullscreen not supported!', onError());
  };
  
  function fullscreenExpandStartHandler(event) {
    fslog('fullscreenExpandStartHandler');
    var bannerPage = document.getElementById('banner-page');
    gwd.expandOffset = {left: event.left, top: event.top};
    if(gwd.expandOffset.top) bannerPage.style.top = gwd.expandOffset.top + 'px';
    if(gwd.expandOffset.left) bannerPage.style.left = gwd.expandOffset.left + 'px';
    Enabler.finishFullscreenExpand();
  };
  
  function fullscreenExpandFinishHandler(event) {
    fslog('fullscreenExpandFinishHandler');
    Enabler.setFloatingPixelDimensions(1, 1);
    document.body.classList.add('fullscreen');
    gwd.isFullscreen = true;
  };
  
  function fullscreenCollapseStartHandler(event) {
    fslog('fullscreenCollapseStartHandler');
    var bannerPage = document.getElementById('banner-page');
    bannerPage.style.left = '0px';
    bannerPage.style.top = '0px';
    Enabler.finishFullscreenCollapse();
  };
  
  function fullscreenCollapseFinishHandler(event) {
    fslog('fullscreenCollapseFinishHandler');
    document.body.classList.remove('fullscreen');
    gwd.isFullscreen = gwd.fullscreenCalled = false;
  };
  
  gwd.isFullscreen = false;
  gwd.fullscreenCalled = false;
  gwd.expandOffset = {left: 0, top: 0};
  gwd.fullscreenStyle = false;
  gwd.expandToFullscreen = function(onError) {
    onError = onError || function(){};
    if (!gwd.fullscreenStyle) {
      var expandedPage = document.getElementById('expanded-page');
      if (expandedPage) {
        expandedPage.setAttribute('data-gwd-width', '100%');
        expandedPage.setAttribute('data-gwd-height', '100%');
      }
      gwd.fullscreenStyle = document.createElement('style');
      gwd.fullscreenStyle.innerHTML = '\
      .expanded, #expanded-page, .gwd-page-content.expanded {\
        width: 100%; height: 100%; \
        width: 100vw; height: 100vh; \
      } \
      #btn-close { left: auto; right: 0px; }';
      var heads = document.getElementsByTagName('head');
      if (heads.length) heads[0].appendChild(gwd.fullscreenStyle);
    }
    function politeLoadHandler(event) {
      if (gwd.fullscreenCalled || gwd.isFullscreen) return;
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, fullscreenExpandStartHandler);
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, fullscreenExpandFinishHandler);
      Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenSupportHandler);
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, fullscreenExpandStartHandler);
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, fullscreenExpandFinishHandler);
      Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenSupportHandler);
      Enabler.queryFullscreenSupport();
      gwd.fullscreenCalled = true;
      setTimeout(function(){
        if (!gwd.isFullscreen) onError();
      }, 1000);
    };
    function enablerInitHandler() {
      if (Enabler.isPageLoaded()) {
        politeLoadHandler();
      } else {
        Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeLoadHandler);
      };
    };
    if (Enabler.isInitialized()) {
      enablerInitHandler();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
    };
  };
  
  gwd.collapseFullscreen = function(onError) {
    if (!gwd.fullscreenCalled || !gwd.isFullscreen) return;
    onError = onError || function(){};
    Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, fullscreenCollapseStartHandler);
    Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, fullscreenCollapseStartHandler);
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
    Enabler.requestFullscreenCollapse();
    setTimeout(function(){
      if (gwd.isFullscreen) onError();
    }, 1000);
  };

}());


*/
