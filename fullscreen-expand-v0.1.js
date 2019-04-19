
/**
 * @fileoverview Implementation of fullscreen-expand component.
 * @author joe@box.biz (Joseph Weitzel)
 */

(function(){
  
  if (typeof gwd !== 'object') gwd = {};
  if (typeof gwd.actions !== 'object') gwd.actions = {};
  if (typeof gwd.actions.fullscreenExpand !== 'object') gwd.actions.fullscreenExpand = {};
  
  if (typeof Enabler === 'undefined') return console.error('gwd.actions.fullscreenExpand: Enabler undefined.');
  if (typeof Enabler.fullscreen.expand !== 'function')
    return console.error('gwd.actions.fullscreenExpand: Enabler.fullscreen.expand is not a method.');
  
  function fslog() {
    console.log.apply(console, arguments);
  };
  
  function onFullscreenExpandStart(e) {
    fslog('onFullscreenExpandStart');
  };
  
  function onFullscreenExpandFinish(e) {
    fslog('onFullscreenExpandFinish');
    document.body.classList.add('fullscreen');
  };
  
  function onFullscreenCollapseFinish(e) {
    fslog('fullscreenCollapseFinishHandler');
    document.body.classList.remove('fullscreen');
    gwd.isFullscreen = gwd.fullscreenCalled = false;
    Enabler.removeEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, fullscreenCollapseFinishHandler);
  };
  
  function onFullscreenCollapseStart(e) {
    fslog('onFullscreenCollapseStart');
    var bannerPage = document.getElementById('banner-page');
    bannerPage.style.left = '0px';
    bannerPage.style.top = '0px';
  };
  
  function onError(e) {
    
  };
  
  function addFullscreenStyles() {
    if (typeof gwd.fullscreenStyle !== 'undefined') return;
    var expandedPage = document.getElementById('expanded-page');
    if (expandedPage) {
      expandedPage.setAttribute('data-gwd-width', '100%');
      expandedPage.setAttribute('data-gwd-height', '100%');
    }
    gwd.fullscreenStyle = document.createElement('style');
    gwd.fullscreenStyle.innerHTML = '.expanded, #expanded-page, .gwd-page-content.expanded { \
      width: 100%; height: 100%; \
      width: 100vw; height: 100vh; \
    }';
    var heads = document.getElementsByTagName('head');
    if (heads.length) heads[0].appendChild(gwd.fullscreenStyle);
    fslog('added fullscreen styles');
  };
  
  
  gwd.actions.fullscreenExpand.expand = function(target, useMobileInnerHeight){
    addFullscreenStyles();
    Enabler.fullscreen.expand({
      useMobileInnerHeight: useMobileInnerHeight,
      onFullscreenExpandStart: onFullscreenExpandStart,
      onFullscreenExpandFinish: onFullscreenExpandFinish,
      onFullscreenCollapseStart: onFullscreenCollapseStart,
      onFullscreenCollapseFinish: onFullscreenCollapseFinish,
      onError: onError
    });
  };
  
  gwd.actions.fullscreenExpand.collapse = function(e){
    Enabler.fullscreen.collapse();
  };
  
}());