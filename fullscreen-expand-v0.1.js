
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
  
  var debug = false;
  
  function fslog() {
    if (!debug) return;
    console.log.apply(console, arguments);
  };
  
  function onFullscreenExpandStart(e) {
    fslog('onFullscreenExpandStart', e);
    var bannerPage = document.getElementById('banner-page');
    if (bannerPage) {
      bannerPage.style.top = e.top + 'px';
      bannerPage.style.left = e.left + 'px';
    }
  };
  
  function onFullscreenExpandFinish(e) {
    fslog('onFullscreenExpandFinish', e);
    var pages = document.querySelectorAll('#pagedeck > gwd-page');
    if (pages.length != 2 || ( pages.length == 2 && pages[1].id != 'expanded-page' )) goToExpandedPage();
    document.body.classList.add('fullscreen');
  };
  
  function onFullscreenCollapseFinish(e) {
    fslog('fullscreenCollapseFinishHandler', e);
    document.body.classList.remove('fullscreen');
  };
  
  function onFullscreenCollapseStart(e) {
    fslog('onFullscreenCollapseStart', e);
    var bannerPage = document.getElementById('banner-page');
    if (bannerPage) {
      bannerPage.style.left = '0px';
      bannerPage.style.top = '0px';
    }
  };
  
  function onError(e) {
    goToExpandedPage();
  };
  
  function goToExpandedPage() {
    fslog('goToExpandedPage');
    gwd.actions.events.getElementById('gwd-ad').goToPage('expanded-page');
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