/*! tooltipster v4.2.5 */!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof exports?module.exports=b(require("jquery")):b(jQuery)}(this,function(a){function b(a){this.$container,this.constraints=null,this.__$tooltip,this.__init(a)}function c(b,c){var d=!0;return a.each(b,function(a,e){return void 0===c[a]||b[a]!==c[a]?(d=!1,!1):void 0}),d}function d(b){var c=b.attr("id"),d=c?h.window.document.getElementById(c):null;return d?d===b[0]:a.contains(h.window.document.body,b[0])}function e(){if(!g)return!1;var a=g.document.body||g.document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}var f={animation:"fade",animationDuration:350,content:null,contentAsHTML:!1,contentCloning:!1,debug:!0,delay:300,delayTouch:[300,500],functionInit:null,functionBefore:null,functionReady:null,functionAfter:null,functionFormat:null,IEmin:6,interactive:!1,multiple:!1,parent:null,plugins:["sideTip"],repositionOnScroll:!1,restoration:"none",selfDestruction:!0,theme:[],timer:0,trackerInterval:500,trackOrigin:!1,trackTooltip:!1,trigger:"hover",triggerClose:{click:!1,mouseleave:!1,originClick:!1,scroll:!1,tap:!1,touchleave:!1},triggerOpen:{click:!1,mouseenter:!1,tap:!1,touchstart:!1},updateAnimation:"rotate",zIndex:9999999},g="undefined"!=typeof window?window:null,h={hasTouchCapability:!(!g||!("ontouchstart"in g||g.DocumentTouch&&g.document instanceof g.DocumentTouch||g.navigator.maxTouchPoints)),hasTransitions:e(),IE:!1,semVer:"4.2.5",window:g},i=function(){this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__instancesLatestArr=[],this.__plugins={},this._env=h};i.prototype={__bridge:function(b,c,d){if(!c[d]){var e=function(){};e.prototype=b;var g=new e;g.__init&&g.__init(c),a.each(b,function(a,b){0!=a.indexOf("__")&&(c[a]?f.debug&&console.log("The "+a+" method of the "+d+" plugin conflicts with another plugin or native methods"):(c[a]=function(){return g[a].apply(g,Array.prototype.slice.apply(arguments))},c[a].bridged=g))}),c[d]=g}return this},__setWindow:function(a){return h.window=a,this},_getRuler:function(a){return new b(a)},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_plugin:function(b){var c=this;if("string"==typeof b){var d=b,e=null;return d.indexOf(".")>0?e=c.__plugins[d]:a.each(c.__plugins,function(a,b){return b.name.substring(b.name.length-d.length-1)=="."+d?(e=b,!1):void 0}),e}if(b.name.indexOf(".")<0)throw new Error("Plugins must be namespaced");return c.__plugins[b.name]=b,b.core&&c.__bridge(b.core,c,b.name),this},_trigger:function(){var a=Array.prototype.slice.apply(arguments);return"string"==typeof a[0]&&(a[0]={type:a[0]}),this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,a),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,a),this},instances:function(b){var c=[],d=b||".tooltipstered";return a(d).each(function(){var b=a(this),d=b.data("tooltipster-ns");d&&a.each(d,function(a,d){c.push(b.data(d))})}),c},instancesLatest:function(){return this.__instancesLatestArr},off:function(){return this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},origins:function(b){var c=b?b+" ":"";return a(c+".tooltipstered").toArray()},setDefaults:function(b){return a.extend(f,b),this},triggerHandler:function(){return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.tooltipster=new i,a.Tooltipster=function(b,c){this.__callbacks={close:[],open:[]},this.__closingTime,this.__Content,this.__contentBcr,this.__destroyed=!1,this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__enabled=!0,this.__garbageCollector,this.__Geometry,this.__lastPosition,this.__namespace="tooltipster-"+Math.round(1e6*Math.random()),this.__options,this.__$originParents,this.__pointerIsOverOrigin=!1,this.__previousThemes=[],this.__state="closed",this.__timeouts={close:[],open:null},this.__touchEvents=[],this.__tracker=null,this._$origin,this._$tooltip,this.__init(b,c)},a.Tooltipster.prototype={__init:function(b,c){var d=this;if(d._$origin=a(b),d.__options=a.extend(!0,{},f,c),d.__optionsFormat(),!h.IE||h.IE>=d.__options.IEmin){var e=null;if(void 0===d._$origin.data("tooltipster-initialTitle")&&(e=d._$origin.attr("title"),void 0===e&&(e=null),d._$origin.data("tooltipster-initialTitle",e)),null!==d.__options.content)d.__contentSet(d.__options.content);else{var g,i=d._$origin.attr("data-tooltip-content");i&&(g=a(i)),g&&g[0]?d.__contentSet(g.first()):d.__contentSet(e)}d._$origin.removeAttr("title").addClass("tooltipstered"),d.__prepareOrigin(),d.__prepareGC(),a.each(d.__options.plugins,function(a,b){d._plug(b)}),h.hasTouchCapability&&a(h.window.document.body).on("touchmove."+d.__namespace+"-triggerOpen",function(a){d._touchRecordEvent(a)}),d._on("created",function(){d.__prepareTooltip()})._on("repositioned",function(a){d.__lastPosition=a.position})}else d.__options.disabled=!0},__contentInsert:function(){var a=this,b=a._$tooltip.find(".tooltipster-content"),c=a.__Content,d=function(a){c=a};return a._trigger({type:"format",content:a.__Content,format:d}),a.__options.functionFormat&&(c=a.__options.functionFormat.call(a,a,{origin:a._$origin[0]},a.__Content)),"string"!=typeof c||a.__options.contentAsHTML?b.empty().append(c):b.text(c),a},__contentSet:function(b){return b instanceof a&&this.__options.contentCloning&&(b=b.clone(!0)),this.__Content=b,this._trigger({type:"updated",content:b}),this},__destroyError:function(){throw new Error("This tooltip has been destroyed and cannot execute your method call.")},__geometry:function(){var b=this,c=b._$origin,d=b._$origin.is("area");if(d){var e=b._$origin.parent().attr("name");c=a('img[usemap="#'+e+'"]')}var f=c[0].getBoundingClientRect(),g=a(h.window.document),i=a(h.window),j=c,k={available:{document:null,window:null},document:{size:{height:g.height(),width:g.width()}},window:{scroll:{left:h.window.scrollX||h.window.document.documentElement.scrollLeft,top:h.window.scrollY||h.window.document.documentElement.scrollTop},size:{height:i.height(),width:i.width()}},origin:{fixedLineage:!1,offset:{},size:{height:f.bottom-f.top,width:f.right-f.left},usemapImage:d?c[0]:null,windowOffset:{bottom:f.bottom,left:f.left,right:f.right,top:f.top}}};if(d){var l=b._$origin.attr("shape"),m=b._$origin.attr("coords");if(m&&(m=m.split(","),a.map(m,function(a,b){m[b]=parseInt(a)})),"default"!=l)switch(l){case"circle":var n=m[0],o=m[1],p=m[2],q=o-p,r=n-p;k.origin.size.height=2*p,k.origin.size.width=k.origin.size.height,k.origin.windowOffset.left+=r,k.origin.windowOffset.top+=q;break;case"rect":var s=m[0],t=m[1],u=m[2],v=m[3];k.origin.size.height=v-t,k.origin.size.width=u-s,k.origin.windowOffset.left+=s,k.origin.windowOffset.top+=t;break;case"poly":for(var w=0,x=0,y=0,z=0,A="even",B=0;B<m.length;B++){var C=m[B];"even"==A?(C>y&&(y=C,0===B&&(w=y)),w>C&&(w=C),A="odd"):(C>z&&(z=C,1==B&&(x=z)),x>C&&(x=C),A="even")}k.origin.size.height=z-x,k.origin.size.width=y-w,k.origin.windowOffset.left+=w,k.origin.windowOffset.top+=x}}var D=function(a){k.origin.size.height=a.height,k.origin.windowOffset.left=a.left,k.origin.windowOffset.top=a.top,k.origin.size.width=a.width};for(b._trigger({type:"geometry",edit:D,geometry:{height:k.origin.size.height,left:k.origin.windowOffset.left,top:k.origin.windowOffset.top,width:k.origin.size.width}}),k.origin.windowOffset.right=k.origin.windowOffset.left+k.origin.size.width,k.origin.windowOffset.bottom=k.origin.windowOffset.top+k.origin.size.height,k.origin.offset.left=k.origin.windowOffset.left+k.window.scroll.left,k.origin.offset.top=k.origin.windowOffset.top+k.window.scroll.top,k.origin.offset.bottom=k.origin.offset.top+k.origin.size.height,k.origin.offset.right=k.origin.offset.left+k.origin.size.width,k.available.document={bottom:{height:k.document.size.height-k.origin.offset.bottom,width:k.document.size.width},left:{height:k.document.size.height,width:k.origin.offset.left},right:{height:k.document.size.height,width:k.document.size.width-k.origin.offset.right},top:{height:k.origin.offset.top,width:k.document.size.width}},k.available.window={bottom:{height:Math.max(k.window.size.height-Math.max(k.origin.windowOffset.bottom,0),0),width:k.window.size.width},left:{height:k.window.size.height,width:Math.max(k.origin.windowOffset.left,0)},right:{height:k.window.size.height,width:Math.max(k.window.size.width-Math.max(k.origin.windowOffset.right,0),0)},top:{height:Math.max(k.origin.windowOffset.top,0),width:k.window.size.width}};"html"!=j[0].tagName.toLowerCase();){if("fixed"==j.css("position")){k.origin.fixedLineage=!0;break}j=j.parent()}return k},__optionsFormat:function(){return"number"==typeof this.__options.animationDuration&&(this.__options.animationDuration=[this.__options.animationDuration,this.__options.animationDuration]),"number"==typeof this.__options.delay&&(this.__options.delay=[this.__options.delay,this.__options.delay]),"number"==typeof this.__options.delayTouch&&(this.__options.delayTouch=[this.__options.delayTouch,this.__options.delayTouch]),"string"==typeof this.__options.theme&&(this.__options.theme=[this.__options.theme]),null===this.__options.parent?this.__options.parent=a(h.window.document.body):"string"==typeof this.__options.parent&&(this.__options.parent=a(this.__options.parent)),"hover"==this.__options.trigger?(this.__options.triggerOpen={mouseenter:!0,touchstart:!0},this.__options.triggerClose={mouseleave:!0,originClick:!0,touchleave:!0}):"click"==this.__options.trigger&&(this.__options.triggerOpen={click:!0,tap:!0},this.__options.triggerClose={click:!0,tap:!0}),this._trigger("options"),this},__prepareGC:function(){var b=this;return b.__options.selfDestruction?b.__garbageCollector=setInterval(function(){var c=(new Date).getTime();b.__touchEvents=a.grep(b.__touchEvents,function(a,b){return c-a.time>6e4}),d(b._$origin)||b.close(function(){b.destroy()})},2e4):clearInterval(b.__garbageCollector),b},__prepareOrigin:function(){var a=this;if(a._$origin.off("."+a.__namespace+"-triggerOpen"),h.hasTouchCapability&&a._$origin.on("touchstart."+a.__namespace+"-triggerOpen touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen",function(b){a._touchRecordEvent(b)}),a.__options.triggerOpen.click||a.__options.triggerOpen.tap&&h.hasTouchCapability){var b="";a.__options.triggerOpen.click&&(b+="click."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.tap&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&a._open(b)})}if(a.__options.triggerOpen.mouseenter||a.__options.triggerOpen.touchstart&&h.hasTouchCapability){var b="";a.__options.triggerOpen.mouseenter&&(b+="mouseenter."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.touchstart&&h.hasTouchCapability&&(b+="touchstart."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){!a._touchIsTouchEvent(b)&&a._touchIsEmulatedEvent(b)||(a.__pointerIsOverOrigin=!0,a._openShortly(b))})}if(a.__options.triggerClose.mouseleave||a.__options.triggerClose.touchleave&&h.hasTouchCapability){var b="";a.__options.triggerClose.mouseleave&&(b+="mouseleave."+a.__namespace+"-triggerOpen "),a.__options.triggerClose.touchleave&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&(a.__pointerIsOverOrigin=!1)})}return a},__prepareTooltip:function(){var b=this,c=b.__options.interactive?"auto":"";return b._$tooltip.attr("id",b.__namespace).css({"pointer-events":c,zIndex:b.__options.zIndex}),a.each(b.__previousThemes,function(a,c){b._$tooltip.removeClass(c)}),a.each(b.__options.theme,function(a,c){b._$tooltip.addClass(c)}),b.__previousThemes=a.merge([],b.__options.theme),b},__scrollHandler:function(b){var c=this;if(c.__options.triggerClose.scroll)c._close(b);else if(d(c._$origin)&&d(c._$tooltip)){var e=null;if(b.target===h.window.document)c.__Geometry.origin.fixedLineage||c.__options.repositionOnScroll&&c.reposition(b);else{e=c.__geometry();var f=!1;if("fixed"!=c._$origin.css("position")&&c.__$originParents.each(function(b,c){var d=a(c),g=d.css("overflow-x"),h=d.css("overflow-y");if("visible"!=g||"visible"!=h){var i=c.getBoundingClientRect();if("visible"!=g&&(e.origin.windowOffset.left<i.left||e.origin.windowOffset.right>i.right))return f=!0,!1;if("visible"!=h&&(e.origin.windowOffset.top<i.top||e.origin.windowOffset.bottom>i.bottom))return f=!0,!1}return"fixed"==d.css("position")?!1:void 0}),f)c._$tooltip.css("visibility","hidden");else if(c._$tooltip.css("visibility","visible"),c.__options.repositionOnScroll)c.reposition(b);else{var g=e.origin.offset.left-c.__Geometry.origin.offset.left,i=e.origin.offset.top-c.__Geometry.origin.offset.top;c._$tooltip.css({left:c.__lastPosition.coord.left+g,top:c.__lastPosition.coord.top+i})}}c._trigger({type:"scroll",event:b,geo:e})}return c},__stateSet:function(a){return this.__state=a,this._trigger({type:"state",state:a}),this},__timeoutsClear:function(){return clearTimeout(this.__timeouts.open),this.__timeouts.open=null,a.each(this.__timeouts.close,function(a,b){clearTimeout(b)}),this.__timeouts.close=[],this},__trackerStart:function(){var a=this,b=a._$tooltip.find(".tooltipster-content");return a.__options.trackTooltip&&(a.__contentBcr=b[0].getBoundingClientRect()),a.__tracker=setInterval(function(){if(d(a._$origin)&&d(a._$tooltip)){if(a.__options.trackOrigin){var e=a.__geometry(),f=!1;c(e.origin.size,a.__Geometry.origin.size)&&(a.__Geometry.origin.fixedLineage?c(e.origin.windowOffset,a.__Geometry.origin.windowOffset)&&(f=!0):c(e.origin.offset,a.__Geometry.origin.offset)&&(f=!0)),f||(a.__options.triggerClose.mouseleave?a._close():a.reposition())}if(a.__options.trackTooltip){var g=b[0].getBoundingClientRect();g.height===a.__contentBcr.height&&g.width===a.__contentBcr.width||(a.reposition(),a.__contentBcr=g)}}else a._close()},a.__options.trackerInterval),a},_close:function(b,c,d){var e=this,f=!0;if(e._trigger({type:"close",event:b,stop:function(){f=!1}}),f||d){c&&e.__callbacks.close.push(c),e.__callbacks.open=[],e.__timeoutsClear();var g=function(){a.each(e.__callbacks.close,function(a,c){c.call(e,e,{event:b,origin:e._$origin[0]})}),e.__callbacks.close=[]};if("closed"!=e.__state){var i=!0,j=new Date,k=j.getTime(),l=k+e.__options.animationDuration[1];if("disappearing"==e.__state&&l>e.__closingTime&&e.__options.animationDuration[1]>0&&(i=!1),i){e.__closingTime=l,"disappearing"!=e.__state&&e.__stateSet("disappearing");var m=function(){clearInterval(e.__tracker),e._trigger({type:"closing",event:b}),e._$tooltip.off("."+e.__namespace+"-triggerClose").removeClass("tooltipster-dying"),a(h.window).off("."+e.__namespace+"-triggerClose"),e.__$originParents.each(function(b,c){a(c).off("scroll."+e.__namespace+"-triggerClose")}),e.__$originParents=null,a(h.window.document.body).off("."+e.__namespace+"-triggerClose"),e._$origin.off("."+e.__namespace+"-triggerClose"),e._off("dismissable"),e.__stateSet("closed"),e._trigger({type:"after",event:b}),e.__options.functionAfter&&e.__options.functionAfter.call(e,e,{event:b,origin:e._$origin[0]}),g()};h.hasTransitions?(e._$tooltip.css({"-moz-animation-duration":e.__options.animationDuration[1]+"ms","-ms-animation-duration":e.__options.animationDuration[1]+"ms","-o-animation-duration":e.__options.animationDuration[1]+"ms","-webkit-animation-duration":e.__options.animationDuration[1]+"ms","animation-duration":e.__options.animationDuration[1]+"ms","transition-duration":e.__options.animationDuration[1]+"ms"}),e._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"),e.__options.animationDuration[1]>0&&e._$tooltip.delay(e.__options.animationDuration[1]),e._$tooltip.queue(m)):e._$tooltip.stop().fadeOut(e.__options.animationDuration[1],m)}}else g()}return e},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_open:function(b,c){var e=this;if(!e.__destroying&&d(e._$origin)&&e.__enabled){var f=!0;if("closed"==e.__state&&(e._trigger({type:"before",event:b,stop:function(){f=!1}}),f&&e.__options.functionBefore&&(f=e.__options.functionBefore.call(e,e,{event:b,origin:e._$origin[0]}))),f!==!1&&null!==e.__Content){c&&e.__callbacks.open.push(c),e.__callbacks.close=[],e.__timeoutsClear();var g,i=function(){"stable"!=e.__state&&e.__stateSet("stable"),a.each(e.__callbacks.open,function(a,b){b.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}),e.__callbacks.open=[]};if("closed"!==e.__state)g=0,"disappearing"===e.__state?(e.__stateSet("appearing"),h.hasTransitions?(e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i)):e._$tooltip.stop().fadeIn(i)):"stable"==e.__state&&i();else{if(e.__stateSet("appearing"),g=e.__options.animationDuration[0],e.__contentInsert(),e.reposition(b,!0),h.hasTransitions?(e._$tooltip.addClass("tooltipster-"+e.__options.animation).addClass("tooltipster-initial").css({"-moz-animation-duration":e.__options.animationDuration[0]+"ms","-ms-animation-duration":e.__options.animationDuration[0]+"ms","-o-animation-duration":e.__options.animationDuration[0]+"ms","-webkit-animation-duration":e.__options.animationDuration[0]+"ms","animation-duration":e.__options.animationDuration[0]+"ms","transition-duration":e.__options.animationDuration[0]+"ms"}),setTimeout(function(){"closed"!=e.__state&&(e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i))},0)):e._$tooltip.css("display","none").fadeIn(e.__options.animationDuration[0],i),e.__trackerStart(),a(h.window).on("resize."+e.__namespace+"-triggerClose",function(b){var c=a(document.activeElement);(c.is("input")||c.is("textarea"))&&a.contains(e._$tooltip[0],c[0])||e.reposition(b)}).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)}),e.__$originParents=e._$origin.parents(),e.__$originParents.each(function(b,c){a(c).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)})}),e.__options.triggerClose.mouseleave||e.__options.triggerClose.touchleave&&h.hasTouchCapability){e._on("dismissable",function(a){a.dismissable?a.delay?(m=setTimeout(function(){e._close(a.event)},a.delay),e.__timeouts.close.push(m)):e._close(a):clearTimeout(m)});var j=e._$origin,k="",l="",m=null;e.__options.interactive&&(j=j.add(e._$tooltip)),e.__options.triggerClose.mouseleave&&(k+="mouseenter."+e.__namespace+"-triggerClose ",l+="mouseleave."+e.__namespace+"-triggerClose "),e.__options.triggerClose.touchleave&&h.hasTouchCapability&&(k+="touchstart."+e.__namespace+"-triggerClose",l+="touchend."+e.__namespace+"-triggerClose touchcancel."+e.__namespace+"-triggerClose"),j.on(l,function(a){if(e._touchIsTouchEvent(a)||!e._touchIsEmulatedEvent(a)){var b="mouseleave"==a.type?e.__options.delay:e.__options.delayTouch;e._trigger({delay:b[1],dismissable:!0,event:a,type:"dismissable"})}}).on(k,function(a){!e._touchIsTouchEvent(a)&&e._touchIsEmulatedEvent(a)||e._trigger({dismissable:!1,event:a,type:"dismissable"})})}e.__options.triggerClose.originClick&&e._$origin.on("click."+e.__namespace+"-triggerClose",function(a){e._touchIsTouchEvent(a)||e._touchIsEmulatedEvent(a)||e._close(a)}),(e.__options.triggerClose.click||e.__options.triggerClose.tap&&h.hasTouchCapability)&&setTimeout(function(){if("closed"!=e.__state){var b="",c=a(h.window.document.body);e.__options.triggerClose.click&&(b+="click."+e.__namespace+"-triggerClose "),e.__options.triggerClose.tap&&h.hasTouchCapability&&(b+="touchend."+e.__namespace+"-triggerClose"),c.on(b,function(b){e._touchIsMeaningfulEvent(b)&&(e._touchRecordEvent(b),e.__options.interactive&&a.contains(e._$tooltip[0],b.target)||e._close(b))}),e.__options.triggerClose.tap&&h.hasTouchCapability&&c.on("touchstart."+e.__namespace+"-triggerClose",function(a){e._touchRecordEvent(a)})}},0),e._trigger("ready"),e.__options.functionReady&&e.__options.functionReady.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}if(e.__options.timer>0){var m=setTimeout(function(){e._close()},e.__options.timer+g);e.__timeouts.close.push(m)}}}return e},_openShortly:function(a){var b=this,c=!0;if("stable"!=b.__state&&"appearing"!=b.__state&&!b.__timeouts.open&&(b._trigger({type:"start",event:a,stop:function(){c=!1}}),c)){var d=0==a.type.indexOf("touch")?b.__options.delayTouch:b.__options.delay;d[0]?b.__timeouts.open=setTimeout(function(){b.__timeouts.open=null,b.__pointerIsOverOrigin&&b._touchIsMeaningfulEvent(a)?(b._trigger("startend"),b._open(a)):b._trigger("startcancel")},d[0]):(b._trigger("startend"),b._open(a))}return b},_optionsExtract:function(b,c){var d=this,e=a.extend(!0,{},c),f=d.__options[b];return f||(f={},a.each(c,function(a,b){var c=d.__options[a];void 0!==c&&(f[a]=c)})),a.each(e,function(b,c){void 0!==f[b]&&("object"!=typeof c||c instanceof Array||null==c||"object"!=typeof f[b]||f[b]instanceof Array||null==f[b]?e[b]=f[b]:a.extend(e[b],f[b]))}),e},_plug:function(b){var c=a.tooltipster._plugin(b);if(!c)throw new Error('The "'+b+'" plugin is not defined');return c.instance&&a.tooltipster.__bridge(c.instance,this,c.name),this},_touchIsEmulatedEvent:function(a){for(var b=!1,c=(new Date).getTime(),d=this.__touchEvents.length-1;d>=0;d--){var e=this.__touchEvents[d];if(!(c-e.time<500))break;e.target===a.target&&(b=!0)}return b},_touchIsMeaningfulEvent:function(a){return this._touchIsTouchEvent(a)&&!this._touchSwiped(a.target)||!this._touchIsTouchEvent(a)&&!this._touchIsEmulatedEvent(a)},_touchIsTouchEvent:function(a){return 0==a.type.indexOf("touch")},_touchRecordEvent:function(a){return this._touchIsTouchEvent(a)&&(a.time=(new Date).getTime(),this.__touchEvents.push(a)),this},_touchSwiped:function(a){for(var b=!1,c=this.__touchEvents.length-1;c>=0;c--){var d=this.__touchEvents[c];if("touchmove"==d.type){b=!0;break}if("touchstart"==d.type&&a===d.target)break}return b},_trigger:function(){var b=Array.prototype.slice.apply(arguments);return"string"==typeof b[0]&&(b[0]={type:b[0]}),b[0].instance=this,b[0].origin=this._$origin?this._$origin[0]:null,b[0].tooltip=this._$tooltip?this._$tooltip[0]:null,this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,b),a.tooltipster._trigger.apply(a.tooltipster,b),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,b),this},_unplug:function(b){var c=this;if(c[b]){var d=a.tooltipster._plugin(b);d.instance&&a.each(d.instance,function(a,d){c[a]&&c[a].bridged===c[b]&&delete c[a]}),c[b].__destroy&&c[b].__destroy(),delete c[b]}return c},close:function(a){return this.__destroyed?this.__destroyError():this._close(null,a),this},content:function(a){var b=this;if(void 0===a)return b.__Content;if(b.__destroyed)b.__destroyError();else if(b.__contentSet(a),null!==b.__Content){if("closed"!==b.__state&&(b.__contentInsert(),b.reposition(),b.__options.updateAnimation))if(h.hasTransitions){var c=b.__options.updateAnimation;b._$tooltip.addClass("tooltipster-update-"+c),setTimeout(function(){"closed"!=b.__state&&b._$tooltip.removeClass("tooltipster-update-"+c)},1e3)}else b._$tooltip.fadeTo(200,.5,function(){"closed"!=b.__state&&b._$tooltip.fadeTo(200,1)})}else b._close();return b},destroy:function(){var b=this;if(b.__destroyed)b.__destroyError();else{"closed"!=b.__state?b.option("animationDuration",0)._close(null,null,!0):b.__timeoutsClear(),b._trigger("destroy"),b.__destroyed=!0,b._$origin.removeData(b.__namespace).off("."+b.__namespace+"-triggerOpen"),a(h.window.document.body).off("."+b.__namespace+"-triggerOpen");var c=b._$origin.data("tooltipster-ns");if(c)if(1===c.length){var d=null;"previous"==b.__options.restoration?d=b._$origin.data("tooltipster-initialTitle"):"current"==b.__options.restoration&&(d="string"==typeof b.__Content?b.__Content:a("<div></div>").append(b.__Content).html()),d&&b._$origin.attr("title",d),b._$origin.removeClass("tooltipstered"),b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")}else c=a.grep(c,function(a,c){return a!==b.__namespace}),b._$origin.data("tooltipster-ns",c);b._trigger("destroyed"),b._off(),b.off(),b.__Content=null,b.__$emitterPrivate=null,b.__$emitterPublic=null,b.__options.parent=null,b._$origin=null,b._$tooltip=null,a.tooltipster.__instancesLatestArr=a.grep(a.tooltipster.__instancesLatestArr,function(a,c){return b!==a}),clearInterval(b.__garbageCollector)}return b},disable:function(){return this.__destroyed?(this.__destroyError(),this):(this._close(),this.__enabled=!1,this)},elementOrigin:function(){return this.__destroyed?void this.__destroyError():this._$origin[0]},elementTooltip:function(){return this._$tooltip?this._$tooltip[0]:null},enable:function(){return this.__enabled=!0,this},hide:function(a){return this.close(a)},instance:function(){return this},off:function(){return this.__destroyed||this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},open:function(a){return this.__destroyed?this.__destroyError():this._open(null,a),this},option:function(b,c){return void 0===c?this.__options[b]:(this.__destroyed?this.__destroyError():(this.__options[b]=c,this.__optionsFormat(),a.inArray(b,["trigger","triggerClose","triggerOpen"])>=0&&this.__prepareOrigin(),"selfDestruction"===b&&this.__prepareGC()),this)},reposition:function(a,b){var c=this;return c.__destroyed?c.__destroyError():"closed"!=c.__state&&d(c._$origin)&&(b||d(c._$tooltip))&&(b||c._$tooltip.detach(),c.__Geometry=c.__geometry(),c._trigger({type:"reposition",event:a,helper:{geo:c.__Geometry}})),c},show:function(a){return this.open(a)},status:function(){return{destroyed:this.__destroyed,enabled:this.__enabled,open:"closed"!==this.__state,state:this.__state}},triggerHandler:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.fn.tooltipster=function(){var b=Array.prototype.slice.apply(arguments),c="You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";if(0===this.length)return this;if("string"==typeof b[0]){var d="#*$~&";return this.each(function(){var e=a(this).data("tooltipster-ns"),f=e?a(this).data(e[0]):null;if(!f)throw new Error("You called Tooltipster's \""+b[0]+'" method on an uninitialized element');if("function"!=typeof f[b[0]])throw new Error('Unknown method "'+b[0]+'"');this.length>1&&"content"==b[0]&&(b[1]instanceof a||"object"==typeof b[1]&&null!=b[1]&&b[1].tagName)&&!f.__options.contentCloning&&f.__options.debug&&console.log(c);var g=f[b[0]](b[1],b[2]);return g!==f||"instance"===b[0]?(d=g,!1):void 0}),"#*$~&"!==d?d:this}a.tooltipster.__instancesLatestArr=[];var e=b[0]&&void 0!==b[0].multiple,g=e&&b[0].multiple||!e&&f.multiple,h=b[0]&&void 0!==b[0].content,i=h&&b[0].content||!h&&f.content,j=b[0]&&void 0!==b[0].contentCloning,k=j&&b[0].contentCloning||!j&&f.contentCloning,l=b[0]&&void 0!==b[0].debug,m=l&&b[0].debug||!l&&f.debug;return this.length>1&&(i instanceof a||"object"==typeof i&&null!=i&&i.tagName)&&!k&&m&&console.log(c),this.each(function(){var c=!1,d=a(this),e=d.data("tooltipster-ns"),f=null;e?g?c=!0:m&&(console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."),console.log(this)):c=!0,c&&(f=new a.Tooltipster(this,b[0]),e||(e=[]),e.push(f.__namespace),d.data("tooltipster-ns",e),d.data(f.__namespace,f),f.__options.functionInit&&f.__options.functionInit.call(f,f,{origin:this}),f._trigger("init")),a.tooltipster.__instancesLatestArr.push(f)}),this},b.prototype={__init:function(b){this.__$tooltip=b,this.__$tooltip.css({left:0,overflow:"hidden",position:"absolute",top:0}).find(".tooltipster-content").css("overflow","auto"),this.$container=a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo(h.window.document.body)},__forceRedraw:function(){var a=this.__$tooltip.parent();this.__$tooltip.detach(),this.__$tooltip.appendTo(a)},constrain:function(a,b){return this.constraints={width:a,height:b},this.__$tooltip.css({display:"block",height:"",overflow:"auto",width:a}),this},destroy:function(){this.__$tooltip.detach().find(".tooltipster-content").css({display:"",overflow:""}),this.$container.remove()},free:function(){return this.constraints=null,this.__$tooltip.css({display:"",height:"",overflow:"visible",width:""}),this},measure:function(){this.__forceRedraw();var a=this.__$tooltip[0].getBoundingClientRect(),b={size:{height:a.height||a.bottom-a.top,width:a.width||a.right-a.left}};if(this.constraints){var c=this.__$tooltip.find(".tooltipster-content"),d=this.__$tooltip.outerHeight(),e=c[0].getBoundingClientRect(),f={height:d<=this.constraints.height,width:a.width<=this.constraints.width&&e.width>=c[0].scrollWidth-1};b.fits=f.height&&f.width}return h.IE&&h.IE<=11&&b.size.width!==h.window.document.documentElement.clientWidth&&(b.size.width=Math.ceil(b.size.width)+1),b}};var j=navigator.userAgent.toLowerCase();-1!=j.indexOf("msie")?h.IE=parseInt(j.split("msie")[1]):-1!==j.toLowerCase().indexOf("trident")&&-1!==j.indexOf(" rv:11")?h.IE=11:-1!=j.toLowerCase().indexOf("edge/")&&(h.IE=parseInt(j.toLowerCase().split("edge/")[1]))});

$(document).ready(function(apply)
{
    apply = function(e, options, self)
    {
        if(this.workon_tooltip === true)
        {
            return
        }
        this.workon_tooltip = true;
        self = $(this);
        var data = self.data('tooltip');
        options = {
            delay: 0,
            theme : 'tooltipster-default'
        }

        if(typeof data == "object")
        {
            options = $.extend(options, data)
        }
        else if(typeof data == "string")
        {
            if(data[0] != '#')
            {
                options.content = $('<div>'+data+'</div>');
            }
            else
            {
                options.content = data;
            }
        }
        if(options.content && options.content[0] == '#' && $(options.content).length)
        {
            options.content = $(options.content);
        }
        self.tooltipster(options);
        if(e.originalEvent && (!options.trigger || options.trigger == "hover"))
        {
            self.tooltipster('show');
        }
    }
    $(document).on('mouseover', '[data-tooltip]', apply);
    $('[data-tooltip]').each(apply);

});

// /*

// Tooltipster 3.3.0 | 2014-11-08
// A rockin' custom tooltip jQuery plugin

// Developed by Caleb Jacob under the MIT license http://opensource.org/licenses/MIT

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// */

// window.workon_packages_tooltip = true;

// ;(function ($, window, document) {

//     var pluginName = "tooltipster",
//         defaults = {
//             animation: 'fade',
//             arrow: true,
//             arrowColor: '',
//             autoClose: true,
//             content: null,
//             contentAsHTML: false,
//             contentCloning: true,
//             debug: true,
//             delay: 200,
//             minWidth: 0,
//             maxWidth: null,
//             functionInit: function(origin, content) {},
//             functionBefore: function(origin, continueTooltip) {
//                 continueTooltip();
//             },
//             functionReady: function(origin, tooltip) {},
//             functionAfter: function(origin) {},
//             hideOnClick: false,
//             icon: '(?)',
//             iconCloning: true,
//             iconDesktop: false,
//             iconTouch: false,
//             iconTheme: 'tooltipster-icon',
//             interactive: false,
//             interactiveTolerance: 350,
//             multiple: false,
//             offsetX: 0,
//             offsetY: 0,
//             onlyOne: false,
//             position: 'top',
//             positionTracker: false,
//             positionTrackerCallback: function(origin){
//                 // the default tracker callback will close the tooltip when the trigger is
//                 // 'hover' (see https://github.com/iamceege/tooltipster/pull/253)
//                 if(this.option('trigger') == 'hover' && this.option('autoClose')) {
//                     this.hide();
//                 }
//             },
//             restoration: 'current',
//             speed: 350,
//             timer: 0,
//             theme: 'tooltipster-default',
//             touchDevices: true,
//             trigger: 'hover',
//             updateAnimation: true
//         };

//     function Plugin(element, options) {

//         // list of instance variables

//         this.bodyOverflowX;
//         // stack of custom callbacks provided as parameters to API methods
//         this.callbacks = {
//             hide: [],
//             show: []
//         };
//         this.checkInterval = null;
//         // this will be the user content shown in the tooltip. A capital "C" is used because there is also a method called content()
//         this.Content;
//         // this is the original element which is being applied the tooltipster plugin
//         this.$el = $(element);
//         // this will be the element which triggers the appearance of the tooltip on hover/click/custom events.
//         // it will be the same as this.$el if icons are not used (see in the options), otherwise it will correspond to the created icon
//         this.$elProxy;
//         this.elProxyPosition;
//         this.enabled = true;
//         this.options = $.extend({}, defaults, options);
//         this.mouseIsOverProxy = false;
//         // a unique namespace per instance, for easy selective unbinding
//         this.namespace = 'tooltipster-'+ Math.round(Math.random()*100000);
//         // Status (capital S) can be either : appearing, shown, disappearing, hidden
//         this.Status = 'hidden';
//         this.timerHide = null;
//         this.timerShow = null;
//         // this will be the tooltip element (jQuery wrapped HTML element)
//         this.$tooltip;

//         // for backward compatibility
//         this.options.iconTheme = this.options.iconTheme.replace('.', '');
//         this.options.theme = this.options.theme.replace('.', '');

//         // launch

//         this._init();
//     }

//     Plugin.prototype = {

//         _init: function() {

//             var self = this;

//             // disable the plugin on old browsers (including IE7 and lower)
//             if (document.querySelector) {

//                 // note : the content is null (empty) by default and can stay that way if the plugin remains initialized but not fed any content. The tooltip will just not appear.

//                 // let's save the initial value of the title attribute for later restoration if need be.
//                 var initialTitle = null;
//                 // it will already have been saved in case of multiple tooltips
//                 if (self.$el.data('tooltipster-initialTitle') === undefined) {

//                     initialTitle = self.$el.attr('title');

//                     // we do not want initialTitle to have the value "undefined" because of how jQuery's .data() method works
//                     if (initialTitle === undefined) initialTitle = null;

//                     self.$el.data('tooltipster-initialTitle', initialTitle);
//                 }

//                 // if content is provided in the options, its has precedence over the title attribute.
//                 // Note : an empty string is considered content, only 'null' represents the absence of content.
//                 // Also, an existing title="" attribute will result in an empty string content
//                 if (self.options.content !== null){
//                     self._content_set(self.options.content);
//                 }
//                 else {
//                     self._content_set(initialTitle);
//                 }

//                 var c = self.options.functionInit.call(self.$el, self.$el, self.Content);
//                 if(typeof c !== 'undefined') self._content_set(c);

//                 self.$el
//                     // strip the title off of the element to prevent the default tooltips from popping up
//                     .removeAttr('title')
//                     // to be able to find all instances on the page later (upon window events in particular)
//                     .addClass('tooltipstered');

//                 // detect if we're changing the tooltip origin to an icon
//                 // note about this condition : if the device has touch capability and self.options.iconTouch is false, you'll have no icons event though you may consider your device as a desktop if it also has a mouse. Not sure why someone would have this use case though.
//                 if ((!deviceHasTouchCapability && self.options.iconDesktop) || (deviceHasTouchCapability && self.options.iconTouch)) {

//                     // TODO : the tooltip should be automatically be given an absolute position to be near the origin. Otherwise, when the origin is floating or what, it's going to be nowhere near it and disturb the position flow of the page elements. It will imply that the icon also detects when its origin moves, to follow it : not trivial.
//                     // Until it's done, the icon feature does not really make sense since the user still has most of the work to do by himself

//                     // if the icon provided is in the form of a string
//                     if(typeof self.options.icon === 'string'){
//                         // wrap it in a span with the icon class
//                         self.$elProxy = $('<span class="'+ self.options.iconTheme +'"></span>');
//                         self.$elProxy.text(self.options.icon);
//                     }
//                     // if it is an object (sensible choice)
//                     else {
//                         // (deep) clone the object if iconCloning == true, to make sure every instance has its own proxy. We use the icon without wrapping, no need to. We do not give it a class either, as the user will undoubtedly style the object on his own and since our css properties may conflict with his own
//                         if (self.options.iconCloning) self.$elProxy = self.options.icon.clone(true);
//                         else self.$elProxy = self.options.icon;
//                     }

//                     self.$elProxy.insertAfter(self.$el);
//                 }
//                 else {
//                     self.$elProxy = self.$el;
//                 }

//                 // for 'click' and 'hover' triggers : bind on events to open the tooltip. Closing is now handled in _showNow() because of its bindings.
//                 // Notes about touch events :
//                     // - mouseenter, mouseleave and clicks happen even on pure touch devices because they are emulated. deviceIsPureTouch() is a simple attempt to detect them.
//                     // - on hybrid devices, we do not prevent touch gesture from opening tooltips. It would be too complex to differentiate real mouse events from emulated ones.
//                     // - we check deviceIsPureTouch() at each event rather than prior to binding because the situation may change during browsing
//                 if (self.options.trigger == 'hover') {

//                     // these binding are for mouse interaction only
//                     self.$elProxy
//                         .on('mouseenter.'+ self.namespace, function() {
//                             if (!deviceIsPureTouch() || self.options.touchDevices) {
//                                 self.mouseIsOverProxy = true;
//                                 self._show();
//                             }
//                         })
//                         .on('mouseleave.'+ self.namespace, function() {
//                             if (!deviceIsPureTouch() || self.options.touchDevices) {
//                                 self.mouseIsOverProxy = false;
//                             }
//                         });

//                     // for touch interaction only
//                     if (deviceHasTouchCapability && self.options.touchDevices) {

//                         // for touch devices, we immediately display the tooltip because we cannot rely on mouseleave to handle the delay
//                         self.$elProxy.on('touchstart.'+ self.namespace, function() {
//                             self._showNow();
//                         });
//                     }
//                 }
//                 else if (self.options.trigger == 'click') {

//                     // note : for touch devices, we do not bind on touchstart, we only rely on the emulated clicks (triggered by taps)
//                     self.$elProxy.on('click.'+ self.namespace, function() {
//                         if (!deviceIsPureTouch() || self.options.touchDevices) {
//                             self._show();
//                         }
//                     });
//                 }
//             }
//         },

//         // this function will schedule the opening of the tooltip after the delay, if there is one
//         _show: function() {

//             var self = this;

//             if (self.Status != 'shown' && self.Status != 'appearing') {

//                 if (self.options.delay) {
//                     self.timerShow = setTimeout(function(){

//                         // for hover trigger, we check if the mouse is still over the proxy, otherwise we do not show anything
//                         if (self.options.trigger == 'click' || (self.options.trigger == 'hover' && self.mouseIsOverProxy)) {
//                             self._showNow();
//                         }
//                     }, self.options.delay);
//                 }
//                 else self._showNow();
//             }
//         },

//         // this function will open the tooltip right away
//         _showNow: function(callback) {

//             var self = this;

//             // call our constructor custom function before continuing
//             self.options.functionBefore.call(self.$el, self.$el, function() {

//                 // continue only if the tooltip is enabled and has any content
//                 if (self.enabled && self.Content !== null) {

//                     // save the method callback and cancel hide method callbacks
//                     if (callback) self.callbacks.show.push(callback);
//                     self.callbacks.hide = [];

//                     //get rid of any appearance timer
//                     clearTimeout(self.timerShow);
//                     self.timerShow = null;
//                     clearTimeout(self.timerHide);
//                     self.timerHide = null;

//                     // if we only want one tooltip open at a time, close all auto-closing tooltips currently open and not already disappearing
//                     if (self.options.onlyOne) {
//                         $('.tooltipstered').not(self.$el).each(function(i,el) {

//                             var $el = $(el),
//                                 nss = $el.data('tooltipster-ns');

//                             // iterate on all tooltips of the element
//                             $.each(nss, function(i, ns){
//                                 var instance = $el.data(ns),
//                                     // we have to use the public methods here
//                                     s = instance.status(),
//                                     ac = instance.option('autoClose');

//                                 if (s !== 'hidden' && s !== 'disappearing' && ac) {
//                                     instance.hide();
//                                 }
//                             });
//                         });
//                     }

//                     var finish = function() {
//                         self.Status = 'shown';

//                         // trigger any show method custom callbacks and reset them
//                         $.each(self.callbacks.show, function(i,c) { c.call(self.$el); });
//                         self.callbacks.show = [];
//                     };

//                     // if this origin already has its tooltip open
//                     if (self.Status !== 'hidden') {

//                         // the timer (if any) will start (or restart) right now
//                         var extraTime = 0;

//                         // if it was disappearing, cancel that
//                         if (self.Status === 'disappearing') {

//                             self.Status = 'appearing';

//                             if (supportsTransitions()) {

//                                 self.$tooltip
//                                     .clearQueue()
//                                     .removeClass('tooltipster-dying')
//                                     .addClass('tooltipster-'+ self.options.animation +'-show');

//                                 if (self.options.speed > 0) self.$tooltip.delay(self.options.speed);

//                                 self.$tooltip.queue(finish);
//                             }
//                             else {
//                                 // in case the tooltip was currently fading out, bring it back to life
//                                 self.$tooltip
//                                     .stop()
//                                     .fadeIn(finish);
//                             }
//                         }
//                         // if the tooltip is already open, we still need to trigger the method custom callback
//                         else if(self.Status === 'shown') {
//                             finish();
//                         }
//                     }
//                     // if the tooltip isn't already open, open that sucker up!
//                     else {

//                         self.Status = 'appearing';

//                         // the timer (if any) will start when the tooltip has fully appeared after its transition
//                         var extraTime = self.options.speed;

//                         // disable horizontal scrollbar to keep overflowing tooltips from jacking with it and then restore it to its previous value
//                         self.bodyOverflowX = $('body').css('overflow-x');
//                         $('body').css('overflow-x', 'hidden');

//                         // get some other settings related to building the tooltip
//                         var animation = 'tooltipster-' + self.options.animation,
//                             animationSpeed = '-webkit-transition-duration: '+ self.options.speed +'ms; -webkit-animation-duration: '+ self.options.speed +'ms; -moz-transition-duration: '+ self.options.speed +'ms; -moz-animation-duration: '+ self.options.speed +'ms; -o-transition-duration: '+ self.options.speed +'ms; -o-animation-duration: '+ self.options.speed +'ms; -ms-transition-duration: '+ self.options.speed +'ms; -ms-animation-duration: '+ self.options.speed +'ms; transition-duration: '+ self.options.speed +'ms; animation-duration: '+ self.options.speed +'ms;',
//                             minWidth = self.options.minWidth ? 'min-width:'+ Math.round(self.options.minWidth) +'px;' : '',
//                             maxWidth = self.options.maxWidth ? 'max-width:'+ Math.round(self.options.maxWidth) +'px;' : '',
//                             pointerEvents = self.options.interactive ? 'pointer-events: auto;' : '';

//                         // build the base of our tooltip
//                         self.$tooltip = $('<div class="tooltipster-base '+ self.options.theme +'" style="'+ minWidth +' '+ maxWidth +' '+ pointerEvents +' '+ animationSpeed +'"><div class="tooltipster-content"></div></div>');

//                         // only add the animation class if the user has a browser that supports animations
//                         if (supportsTransitions()) self.$tooltip.addClass(animation);

//                         // insert the content
//                         self._content_insert();

//                         // attach
//                         self.$tooltip.appendTo('body');

//                         // do all the crazy calculations and positioning
//                         self.reposition();

//                         // call our custom callback since the content of the tooltip is now part of the DOM
//                         self.options.functionReady.call(self.$el, self.$el, self.$tooltip);

//                         // animate in the tooltip
//                         if (supportsTransitions()) {

//                             self.$tooltip.addClass(animation + '-show');

//                             if(self.options.speed > 0) self.$tooltip.delay(self.options.speed);

//                             self.$tooltip.queue(finish);
//                         }
//                         else {
//                             self.$tooltip.css('display', 'none').fadeIn(self.options.speed, finish);
//                         }

//                         // will check if our tooltip origin is removed while the tooltip is shown
//                         self._interval_set();

//                         // reposition on scroll (otherwise position:fixed element's tooltips will move away form their origin) and on resize (in case position can/has to be changed)
//                         $(window).on('scroll.'+ self.namespace +' resize.'+ self.namespace, function() {
//                             self.reposition();
//                         });

//                         // auto-close bindings
//                         if (self.options.autoClose) {

//                             // in case a listener is already bound for autoclosing (mouse or touch, hover or click), unbind it first
//                             $('body').off('.'+ self.namespace);

//                             // here we'll have to set different sets of bindings for both touch and mouse
//                             if (self.options.trigger == 'hover') {

//                                 // if the user touches the body, hide
//                                 if (deviceHasTouchCapability) {
//                                     // timeout 0 : explanation below in click section
//                                     setTimeout(function() {
//                                         // we don't want to bind on click here because the initial touchstart event has not yet triggered its click event, which is thus about to happen
//                                         $('body').on('touchstart.'+ self.namespace, function() {
//                                             self.hide();
//                                         });
//                                     }, 0);
//                                 }

//                                 // if we have to allow interaction
//                                 if (self.options.interactive) {

//                                     // touch events inside the tooltip must not close it
//                                     if (deviceHasTouchCapability) {
//                                         self.$tooltip.on('touchstart.'+ self.namespace, function(event) {
//                                             event.stopPropagation();
//                                         });
//                                     }

//                                     // as for mouse interaction, we get rid of the tooltip only after the mouse has spent some time out of it
//                                     var tolerance = null;

//                                     self.$elProxy.add(self.$tooltip)
//                                         // hide after some time out of the proxy and the tooltip
//                                         .on('mouseleave.'+ self.namespace + '-autoClose', function() {
//                                             clearTimeout(tolerance);
//                                             tolerance = setTimeout(function(){
//                                                 self.hide();
//                                             }, self.options.interactiveTolerance);
//                                         })
//                                         // suspend timeout when the mouse is over the proxy or the tooltip
//                                         .on('mouseenter.'+ self.namespace + '-autoClose', function() {
//                                             clearTimeout(tolerance);
//                                         });
//                                 }
//                                 // if this is a non-interactive tooltip, get rid of it if the mouse leaves
//                                 else {
//                                     self.$elProxy.on('mouseleave.'+ self.namespace + '-autoClose', function() {
//                                         self.hide();
//                                     });
//                                 }

//                                 // close the tooltip when the proxy gets a click (common behavior of native tooltips)
//                                 if (self.options.hideOnClick) {

//                                     self.$elProxy.on('click.'+ self.namespace + '-autoClose', function() {
//                                         self.hide();
//                                     });
//                                 }
//                             }
//                             // here we'll set the same bindings for both clicks and touch on the body to hide the tooltip
//                             else if(self.options.trigger == 'click'){

//                                 // use a timeout to prevent immediate closing if the method was called on a click event and if options.delay == 0 (because of bubbling)
//                                 setTimeout(function() {
//                                     $('body').on('click.'+ self.namespace +' touchstart.'+ self.namespace, function() {
//                                         self.hide();
//                                     });
//                                 }, 0);

//                                 // if interactive, we'll stop the events that were emitted from inside the tooltip to stop autoClosing
//                                 if (self.options.interactive) {

//                                     // note : the touch events will just not be used if the plugin is not enabled on touch devices
//                                     self.$tooltip.on('click.'+ self.namespace +' touchstart.'+ self.namespace, function(event) {
//                                         event.stopPropagation();
//                                     });
//                                 }
//                             }
//                         }
//                     }

//                     // if we have a timer set, let the countdown begin
//                     if (self.options.timer > 0) {

//                         self.timerHide = setTimeout(function() {
//                             self.timerHide = null;
//                             self.hide();
//                         }, self.options.timer + extraTime);
//                     }
//                 }
//             });
//         },

//         _interval_set: function() {

//             var self = this;

//             self.checkInterval = setInterval(function() {

//                 // if the tooltip and/or its interval should be stopped
//                 if (
//                         // if the origin has been removed
//                         $('body').find(self.$el).length === 0
//                         // if the elProxy has been removed
//                     ||  $('body').find(self.$elProxy).length === 0
//                         // if the tooltip has been closed
//                     ||  self.Status == 'hidden'
//                         // if the tooltip has somehow been removed
//                     ||  $('body').find(self.$tooltip).length === 0
//                 ) {
//                     // remove the tooltip if it's still here
//                     if (self.Status == 'shown' || self.Status == 'appearing') self.hide();

//                     // clear this interval as it is no longer necessary
//                     self._interval_cancel();
//                 }
//                 // if everything is alright
//                 else {
//                     // compare the former and current positions of the elProxy to reposition the tooltip if need be
//                     if(self.options.positionTracker){

//                         var p = self._repositionInfo(self.$elProxy),
//                             identical = false;

//                         // compare size first (a change requires repositioning too)
//                         if(areEqual(p.dimension, self.elProxyPosition.dimension)){

//                             // for elements with a fixed position, we track the top and left properties (relative to window)
//                             if(self.$elProxy.css('position') === 'fixed'){
//                                 if(areEqual(p.position, self.elProxyPosition.position)) identical = true;
//                             }
//                             // otherwise, track total offset (relative to document)
//                             else {
//                                 if(areEqual(p.offset, self.elProxyPosition.offset)) identical = true;
//                             }
//                         }

//                         if(!identical){
//                             self.reposition();
//                             self.options.positionTrackerCallback.call(self, self.$el);
//                         }
//                     }
//                 }
//             }, 200);
//         },

//         _interval_cancel: function() {
//             clearInterval(this.checkInterval);
//             // clean delete
//             this.checkInterval = null;
//         },

//         _content_set: function(content) {
//             // clone if asked. Cloning the object makes sure that each instance has its own version of the content (in case a same object were provided for several instances)
//             // reminder : typeof null === object
//             if (typeof content === 'object' && content !== null && this.options.contentCloning) {
//                 content = content.clone(true);
//             }
//             this.Content = content;
//         },

//         _content_insert: function() {

//             var self = this,
//                 $d = this.$tooltip.find('.tooltipster-content');

//             if (typeof self.Content === 'string' && !self.options.contentAsHTML) {
//                 $d.text(self.Content);
//             }
//             else {
//                 $d
//                     .empty()
//                     .append(self.Content);
//             }
//         },

//         _update: function(content) {

//             var self = this;

//             // change the content
//             self._content_set(content);

//             if (self.Content !== null) {

//                 // update the tooltip if it is open
//                 if (self.Status !== 'hidden') {

//                     // reset the content in the tooltip
//                     self._content_insert();

//                     // reposition and resize the tooltip
//                     self.reposition();

//                     // if we want to play a little animation showing the content changed
//                     if (self.options.updateAnimation) {

//                         if (supportsTransitions()) {

//                             self.$tooltip.css({
//                                 'width': '',
//                                 '-webkit-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
//                                 '-moz-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
//                                 '-o-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
//                                 '-ms-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
//                                 'transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms'
//                             }).addClass('tooltipster-content-changing');

//                             // reset the CSS transitions and finish the change animation
//                             setTimeout(function() {

//                                 if(self.Status != 'hidden'){

//                                     self.$tooltip.removeClass('tooltipster-content-changing');

//                                     // after the changing animation has completed, reset the CSS transitions
//                                     setTimeout(function() {

//                                         if(self.Status !== 'hidden'){
//                                             self.$tooltip.css({
//                                                 '-webkit-transition': self.options.speed + 'ms',
//                                                 '-moz-transition': self.options.speed + 'ms',
//                                                 '-o-transition': self.options.speed + 'ms',
//                                                 '-ms-transition': self.options.speed + 'ms',
//                                                 'transition': self.options.speed + 'ms'
//                                             });
//                                         }
//                                     }, self.options.speed);
//                                 }
//                             }, self.options.speed);
//                         }
//                         else {
//                             self.$tooltip.fadeTo(self.options.speed, 0.5, function() {
//                                 if(self.Status != 'hidden'){
//                                     self.$tooltip.fadeTo(self.options.speed, 1);
//                                 }
//                             });
//                         }
//                     }
//                 }
//             }
//             else {
//                 self.hide();
//             }
//         },

//         _repositionInfo: function($el) {
//             return {
//                 dimension: {
//                     height: $el.outerHeight(false),
//                     width: $el.outerWidth(false)
//                 },
//                 offset: $el.offset(),
//                 position: {
//                     left: parseInt($el.css('left')),
//                     top: parseInt($el.css('top'))
//                 }
//             };
//         },

//         hide: function(callback) {

//             var self = this;

//             // save the method custom callback and cancel any show method custom callbacks
//             if (callback) self.callbacks.hide.push(callback);
//             self.callbacks.show = [];

//             // get rid of any appearance timeout
//             clearTimeout(self.timerShow);
//             self.timerShow = null;
//             clearTimeout(self.timerHide);
//             self.timerHide = null;

//             var finishCallbacks = function() {
//                 // trigger any hide method custom callbacks and reset them
//                 $.each(self.callbacks.hide, function(i,c) { c.call(self.$el); });
//                 self.callbacks.hide = [];
//             };

//             // hide
//             if (self.Status == 'shown' || self.Status == 'appearing') {

//                 self.Status = 'disappearing';

//                 var finish = function() {

//                     self.Status = 'hidden';

//                     // detach our content object first, so the next jQuery's remove() call does not unbind its event handlers
//                     if (typeof self.Content == 'object' && self.Content !== null) {
//                         self.Content.detach();
//                     }

//                     self.$tooltip.remove();
//                     self.$tooltip = null;

//                     // unbind orientationchange, scroll and resize listeners
//                     $(window).off('.'+ self.namespace);

//                     $('body')
//                         // unbind any auto-closing click/touch listeners
//                         .off('.'+ self.namespace)
//                         .css('overflow-x', self.bodyOverflowX);

//                     // unbind any auto-closing click/touch listeners
//                     $('body').off('.'+ self.namespace);

//                     // unbind any auto-closing hover listeners
//                     self.$elProxy.off('.'+ self.namespace + '-autoClose');

//                     // call our constructor custom callback function
//                     self.options.functionAfter.call(self.$el, self.$el);

//                     // call our method custom callbacks functions
//                     finishCallbacks();
//                 };

//                 if (supportsTransitions()) {

//                     self.$tooltip
//                         .clearQueue()
//                         .removeClass('tooltipster-' + self.options.animation + '-show')
//                         // for transitions only
//                         .addClass('tooltipster-dying');

//                     if(self.options.speed > 0) self.$tooltip.delay(self.options.speed);

//                     self.$tooltip.queue(finish);
//                 }
//                 else {
//                     self.$tooltip
//                         .stop()
//                         .fadeOut(self.options.speed, finish);
//                 }
//             }
//             // if the tooltip is already hidden, we still need to trigger the method custom callback
//             else if(self.Status == 'hidden') {
//                 finishCallbacks();
//             }

//             return self;
//         },

//         // the public show() method is actually an alias for the private showNow() method
//         show: function(callback) {
//             this._showNow(callback);
//             return this;
//         },

//         // 'update' is deprecated in favor of 'content' but is kept for backward compatibility
//         update: function(c) {
//             return this.content(c);
//         },
//         content: function(c) {
//             // getter method
//             if(typeof c === 'undefined'){
//                 return this.Content;
//             }
//             // setter method
//             else {
//                 this._update(c);
//                 return this;
//             }
//         },

//         reposition: function() {

//             var self = this;

//             // in case the tooltip has been removed from DOM manually
//             if ($('body').find(self.$tooltip).length !== 0) {

//                 // reset width
//                 self.$tooltip.css('width', '');

//                 // find variables to determine placement
//                 self.elProxyPosition = self._repositionInfo(self.$elProxy);
//                 var arrowReposition = null,
//                     windowWidth = $(window).width(),
//                     // shorthand
//                     proxy = self.elProxyPosition,
//                     tooltipWidth = self.$tooltip.outerWidth(false),
//                     tooltipInnerWidth = self.$tooltip.innerWidth() + 1, // this +1 stops FireFox from sometimes forcing an additional text line
//                     tooltipHeight = self.$tooltip.outerHeight(false);

//                 // if this is an <area> tag inside a <map>, all hell breaks loose. Recalculate all the measurements based on coordinates
//                 if (self.$elProxy.is('area')) {
//                     var areaShape = self.$elProxy.attr('shape'),
//                         mapName = self.$elProxy.parent().attr('name'),
//                         map = $('img[usemap="#'+ mapName +'"]'),
//                         mapOffsetLeft = map.offset().left,
//                         mapOffsetTop = map.offset().top,
//                         areaMeasurements = self.$elProxy.attr('coords') !== undefined ? self.$elProxy.attr('coords').split(',') : undefined;

//                     if (areaShape == 'circle') {
//                         var areaLeft = parseInt(areaMeasurements[0]),
//                             areaTop = parseInt(areaMeasurements[1]),
//                             areaWidth = parseInt(areaMeasurements[2]);
//                         proxy.dimension.height = areaWidth * 2;
//                         proxy.dimension.width = areaWidth * 2;
//                         proxy.offset.top = mapOffsetTop + areaTop - areaWidth;
//                         proxy.offset.left = mapOffsetLeft + areaLeft - areaWidth;
//                     }
//                     else if (areaShape == 'rect') {
//                         var areaLeft = parseInt(areaMeasurements[0]),
//                             areaTop = parseInt(areaMeasurements[1]),
//                             areaRight = parseInt(areaMeasurements[2]),
//                             areaBottom = parseInt(areaMeasurements[3]);
//                         proxy.dimension.height = areaBottom - areaTop;
//                         proxy.dimension.width = areaRight - areaLeft;
//                         proxy.offset.top = mapOffsetTop + areaTop;
//                         proxy.offset.left = mapOffsetLeft + areaLeft;
//                     }
//                     else if (areaShape == 'poly') {
//                         var areaXs = [],
//                             areaYs = [],
//                             areaSmallestX = 0,
//                             areaSmallestY = 0,
//                             areaGreatestX = 0,
//                             areaGreatestY = 0,
//                             arrayAlternate = 'even';

//                         for (var i = 0; i < areaMeasurements.length; i++) {
//                             var areaNumber = parseInt(areaMeasurements[i]);

//                             if (arrayAlternate == 'even') {
//                                 if (areaNumber > areaGreatestX) {
//                                     areaGreatestX = areaNumber;
//                                     if (i === 0) {
//                                         areaSmallestX = areaGreatestX;
//                                     }
//                                 }

//                                 if (areaNumber < areaSmallestX) {
//                                     areaSmallestX = areaNumber;
//                                 }

//                                 arrayAlternate = 'odd';
//                             }
//                             else {
//                                 if (areaNumber > areaGreatestY) {
//                                     areaGreatestY = areaNumber;
//                                     if (i == 1) {
//                                         areaSmallestY = areaGreatestY;
//                                     }
//                                 }

//                                 if (areaNumber < areaSmallestY) {
//                                     areaSmallestY = areaNumber;
//                                 }

//                                 arrayAlternate = 'even';
//                             }
//                         }

//                         proxy.dimension.height = areaGreatestY - areaSmallestY;
//                         proxy.dimension.width = areaGreatestX - areaSmallestX;
//                         proxy.offset.top = mapOffsetTop + areaSmallestY;
//                         proxy.offset.left = mapOffsetLeft + areaSmallestX;
//                     }
//                     else {
//                         proxy.dimension.height = map.outerHeight(false);
//                         proxy.dimension.width = map.outerWidth(false);
//                         proxy.offset.top = mapOffsetTop;
//                         proxy.offset.left = mapOffsetLeft;
//                     }
//                 }

//                 // our function and global vars for positioning our tooltip
//                 var myLeft = 0,
//                     myLeftMirror = 0,
//                     myTop = 0,
//                     offsetY = parseInt(self.options.offsetY),
//                     offsetX = parseInt(self.options.offsetX),
//                     // this is the arrow position that will eventually be used. It may differ from the position option if the tooltip cannot be displayed in this position
//                     practicalPosition = self.options.position;

//                 // a function to detect if the tooltip is going off the screen horizontally. If so, reposition the crap out of it!
//                 function dontGoOffScreenX() {

//                     var windowLeft = $(window).scrollLeft();

//                     // if the tooltip goes off the left side of the screen, line it up with the left side of the window
//                     if((myLeft - windowLeft) < 0) {
//                         arrowReposition = myLeft - windowLeft;
//                         myLeft = windowLeft;
//                     }

//                     // if the tooltip goes off the right of the screen, line it up with the right side of the window
//                     if (((myLeft + tooltipWidth) - windowLeft) > windowWidth) {
//                         arrowReposition = myLeft - ((windowWidth + windowLeft) - tooltipWidth);
//                         myLeft = (windowWidth + windowLeft) - tooltipWidth;
//                     }
//                 }

//                 // a function to detect if the tooltip is going off the screen vertically. If so, switch to the opposite!
//                 function dontGoOffScreenY(switchTo, switchFrom) {
//                     // if it goes off the top off the page
//                     if(((proxy.offset.top - $(window).scrollTop() - tooltipHeight - offsetY - 12) < 0) && (switchFrom.indexOf('top') > -1)) {
//                         practicalPosition = switchTo;
//                     }

//                     // if it goes off the bottom of the page
//                     if (((proxy.offset.top + proxy.dimension.height + tooltipHeight + 12 + offsetY) > ($(window).scrollTop() + $(window).height())) && (switchFrom.indexOf('bottom') > -1)) {
//                         practicalPosition = switchTo;
//                         myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
//                     }
//                 }

//                 if(practicalPosition == 'top') {
//                     var leftDifference = (proxy.offset.left + tooltipWidth) - (proxy.offset.left + proxy.dimension.width);
//                     myLeft = (proxy.offset.left + offsetX) - (leftDifference / 2);
//                     myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('bottom', 'top');
//                 }

//                 if(practicalPosition == 'top-left') {
//                     myLeft = proxy.offset.left + offsetX;
//                     myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('bottom-left', 'top-left');
//                 }

//                 if(practicalPosition == 'top-right') {
//                     myLeft = (proxy.offset.left + proxy.dimension.width + offsetX) - tooltipWidth;
//                     myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('bottom-right', 'top-right');
//                 }

//                 if(practicalPosition == 'bottom') {
//                     var leftDifference = (proxy.offset.left + tooltipWidth) - (proxy.offset.left + proxy.dimension.width);
//                     myLeft = proxy.offset.left - (leftDifference / 2) + offsetX;
//                     myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('top', 'bottom');
//                 }

//                 if(practicalPosition == 'bottom-left') {
//                     myLeft = proxy.offset.left + offsetX;
//                     myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('top-left', 'bottom-left');
//                 }

//                 if(practicalPosition == 'bottom-right') {
//                     myLeft = (proxy.offset.left + proxy.dimension.width + offsetX) - tooltipWidth;
//                     myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 12;
//                     dontGoOffScreenX();
//                     dontGoOffScreenY('top-right', 'bottom-right');
//                 }

//                 if(practicalPosition == 'left') {
//                     myLeft = proxy.offset.left - offsetX - tooltipWidth - 12;
//                     myLeftMirror = proxy.offset.left + offsetX + proxy.dimension.width + 12;
//                     var topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
//                     myTop = proxy.offset.top - (topDifference / 2) - offsetY;

//                     // if the tooltip goes off boths sides of the page
//                     if((myLeft < 0) && ((myLeftMirror + tooltipWidth) > windowWidth)) {
//                         var borderWidth = parseFloat(self.$tooltip.css('border-width')) * 2,
//                             newWidth = (tooltipWidth + myLeft) - borderWidth;
//                         self.$tooltip.css('width', newWidth + 'px');

//                         tooltipHeight = self.$tooltip.outerHeight(false);
//                         myLeft = proxy.offset.left - offsetX - newWidth - 12 - borderWidth;
//                         topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
//                         myTop = proxy.offset.top - (topDifference / 2) - offsetY;
//                     }

//                     // if it only goes off one side, flip it to the other side
//                     else if(myLeft < 0) {
//                         myLeft = proxy.offset.left + offsetX + proxy.dimension.width + 12;
//                         arrowReposition = 'left';
//                     }
//                 }

//                 if(practicalPosition == 'right') {
//                     myLeft = proxy.offset.left + offsetX + proxy.dimension.width + 12;
//                     myLeftMirror = proxy.offset.left - offsetX - tooltipWidth - 12;
//                     var topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
//                     myTop = proxy.offset.top - (topDifference / 2) - offsetY;

//                     // if the tooltip goes off boths sides of the page
//                     if(((myLeft + tooltipWidth) > windowWidth) && (myLeftMirror < 0)) {
//                         var borderWidth = parseFloat(self.$tooltip.css('border-width')) * 2,
//                             newWidth = (windowWidth - myLeft) - borderWidth;
//                         self.$tooltip.css('width', newWidth + 'px');

//                         tooltipHeight = self.$tooltip.outerHeight(false);
//                         topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
//                         myTop = proxy.offset.top - (topDifference / 2) - offsetY;
//                     }

//                     // if it only goes off one side, flip it to the other side
//                     else if((myLeft + tooltipWidth) > windowWidth) {
//                         myLeft = proxy.offset.left - offsetX - tooltipWidth - 12;
//                         arrowReposition = 'right';
//                     }
//                 }

//                 // if arrow is set true, style it and append it
//                 if (self.options.arrow) {

//                     var arrowClass = 'tooltipster-arrow-' + practicalPosition;

//                     // set color of the arrow
//                     if(self.options.arrowColor.length < 1) {
//                         var arrowColor = self.$tooltip.css('background-color');
//                     }
//                     else {
//                         var arrowColor = self.options.arrowColor;
//                     }

//                     // if the tooltip was going off the page and had to re-adjust, we need to update the arrow's position
//                     if (!arrowReposition) {
//                         arrowReposition = '';
//                     }
//                     else if (arrowReposition == 'left') {
//                         arrowClass = 'tooltipster-arrow-right';
//                         arrowReposition = '';
//                     }
//                     else if (arrowReposition == 'right') {
//                         arrowClass = 'tooltipster-arrow-left';
//                         arrowReposition = '';
//                     }
//                     else {
//                         arrowReposition = 'left:'+ Math.round(arrowReposition) +'px;';
//                     }

//                     // building the logic to create the border around the arrow of the tooltip
//                     if ((practicalPosition == 'top') || (practicalPosition == 'top-left') || (practicalPosition == 'top-right')) {
//                         var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-bottom-width')),
//                             tooltipBorderColor = self.$tooltip.css('border-bottom-color');
//                     }
//                     else if ((practicalPosition == 'bottom') || (practicalPosition == 'bottom-left') || (practicalPosition == 'bottom-right')) {
//                         var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-top-width')),
//                             tooltipBorderColor = self.$tooltip.css('border-top-color');
//                     }
//                     else if (practicalPosition == 'left') {
//                         var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-right-width')),
//                             tooltipBorderColor = self.$tooltip.css('border-right-color');
//                     }
//                     else if (practicalPosition == 'right') {
//                         var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-left-width')),
//                             tooltipBorderColor = self.$tooltip.css('border-left-color');
//                     }
//                     else {
//                         var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-bottom-width')),
//                             tooltipBorderColor = self.$tooltip.css('border-bottom-color');
//                     }

//                     if (tooltipBorderWidth > 1) {
//                         tooltipBorderWidth++;
//                     }

//                     var arrowBorder = '';
//                     if (tooltipBorderWidth !== 0) {
//                         var arrowBorderSize = '',
//                             arrowBorderColor = 'border-color: '+ tooltipBorderColor +';';
//                         if (arrowClass.indexOf('bottom') !== -1) {
//                             arrowBorderSize = 'margin-top: -'+ Math.round(tooltipBorderWidth) +'px;';
//                         }
//                         else if (arrowClass.indexOf('top') !== -1) {
//                             arrowBorderSize = 'margin-bottom: -'+ Math.round(tooltipBorderWidth) +'px;';
//                         }
//                         else if (arrowClass.indexOf('left') !== -1) {
//                             arrowBorderSize = 'margin-right: -'+ Math.round(tooltipBorderWidth) +'px;';
//                         }
//                         else if (arrowClass.indexOf('right') !== -1) {
//                             arrowBorderSize = 'margin-left: -'+ Math.round(tooltipBorderWidth) +'px;';
//                         }
//                         arrowBorder = '<span class="tooltipster-arrow-border" style="'+ arrowBorderSize +' '+ arrowBorderColor +';"></span>';
//                     }

//                     // if the arrow already exists, remove and replace it
//                     self.$tooltip.find('.tooltipster-arrow').remove();

//                     // build out the arrow and append it
//                     var arrowConstruct = '<div class="'+ arrowClass +' tooltipster-arrow" style="'+ arrowReposition +'">'+ arrowBorder +'<span style="border-color:'+ arrowColor +';"></span></div>';
//                     self.$tooltip.append(arrowConstruct);
//                 }

//                 // position the tooltip
//                 self.$tooltip.css({'top': Math.round(myTop) + 'px', 'left': Math.round(myLeft) + 'px'});
//             }

//             return self;
//         },

//         enable: function() {
//             this.enabled = true;
//             return this;
//         },

//         disable: function() {
//             // hide first, in case the tooltip would not disappear on its own (autoClose false)
//             this.hide();
//             this.enabled = false;
//             return this;
//         },

//         destroy: function() {

//             var self = this;

//             self.hide();

//             // remove the icon, if any
//             if (self.$el[0] !== self.$elProxy[0]) {
//                 self.$elProxy.remove();
//             }

//             self.$el
//                 .removeData(self.namespace)
//                 .off('.'+ self.namespace);

//             var ns = self.$el.data('tooltipster-ns');

//             // if there are no more tooltips on this element
//             if(ns.length === 1){

//                 // optional restoration of a title attribute
//                 var title = null;
//                 if (self.options.restoration === 'previous'){
//                     title = self.$el.data('tooltipster-initialTitle');
//                 }
//                 else if(self.options.restoration === 'current'){

//                     // old school technique to stringify when outerHTML is not supported
//                     title =
//                         (typeof self.Content === 'string') ?
//                         self.Content :
//                         $('<div></div>').append(self.Content).html();
//                 }

//                 if (title) {
//                     self.$el.attr('title', title);
//                 }

//                 // final cleaning
//                 self.$el
//                     .removeClass('tooltipstered')
//                     .removeData('tooltipster-ns')
//                     .removeData('tooltipster-initialTitle');
//             }
//             else {
//                 // remove the instance namespace from the list of namespaces of tooltips present on the element
//                 ns = $.grep(ns, function(el, i){
//                     return el !== self.namespace;
//                 });
//                 self.$el.data('tooltipster-ns', ns);
//             }

//             return self;
//         },

//         elementIcon: function() {
//             return (this.$el[0] !== this.$elProxy[0]) ? this.$elProxy[0] : undefined;
//         },

//         elementTooltip: function() {
//             return this.$tooltip ? this.$tooltip[0] : undefined;
//         },

//         // public methods but for internal use only
//         // getter if val is ommitted, setter otherwise
//         option: function(o, val) {
//             if (typeof val == 'undefined') return this.options[o];
//             else {
//                 this.options[o] = val;
//                 return this;
//             }
//         },
//         status: function() {
//             return this.Status;
//         }
//     };

//     $.fn[pluginName] = function () {

//         // for using in closures
//         var args = arguments;

//         // if we are not in the context of jQuery wrapped HTML element(s) :
//         // this happens when calling static methods in the form $.fn.tooltipster('methodName'), or when calling $(sel).tooltipster('methodName or options') where $(sel) does not match anything
//         if (this.length === 0) {

//             // if the first argument is a method name
//             if (typeof args[0] === 'string') {

//                 var methodIsStatic = true;

//                 // list static methods here (usable by calling $.fn.tooltipster('methodName');)
//                 switch (args[0]) {

//                     case 'setDefaults':
//                         // change default options for all future instances
//                         $.extend(defaults, args[1]);
//                         break;

//                     default:
//                         methodIsStatic = false;
//                         break;
//                 }

//                 // $.fn.tooltipster('methodName') calls will return true
//                 if (methodIsStatic) return true;
//                 // $(sel).tooltipster('methodName') calls will return the list of objects event though it's empty because chaining should work on empty lists
//                 else return this;
//             }
//             // the first argument is undefined or an object of options : we are initalizing but there is no element matched by selector
//             else {
//                 // still chainable : same as above
//                 return this;
//             }
//         }
//         // this happens when calling $(sel).tooltipster('methodName or options') where $(sel) matches one or more elements
//         else {

//             // method calls
//             if (typeof args[0] === 'string') {

//                 var v = '#*$~&';

//                 this.each(function() {

//                     // retrieve the namepaces of the tooltip(s) that exist on that element. We will interact with the first tooltip only.
//                     var ns = $(this).data('tooltipster-ns'),
//                         // self represents the instance of the first tooltipster plugin associated to the current HTML object of the loop
//                         self = ns ? $(this).data(ns[0]) : null;

//                     // if the current element holds a tooltipster instance
//                     if (self) {

//                         if (typeof self[args[0]] === 'function') {
//                             // note : args[1] and args[2] may not be defined
//                             var resp = self[args[0]](args[1], args[2]);
//                         }
//                         else {
//                             throw new Error('Unknown method .tooltipster("' + args[0] + '")');
//                         }

//                         // if the function returned anything other than the instance itself (which implies chaining)
//                         if (resp !== self){
//                             v = resp;
//                             // return false to stop .each iteration on the first element matched by the selector
//                             return false;
//                         }
//                     }
//                     else {
//                         throw new Error('You called Tooltipster\'s "' + args[0] + '" method on an uninitialized element');
//                     }
//                 });

//                 return (v !== '#*$~&') ? v : this;
//             }
//             // first argument is undefined or an object : the tooltip is initializing
//             else {

//                 var instances = [],
//                     // is there a defined value for the multiple option in the options object ?
//                     multipleIsSet = args[0] && typeof args[0].multiple !== 'undefined',
//                     // if the multiple option is set to true, or if it's not defined but set to true in the defaults
//                     multiple = (multipleIsSet && args[0].multiple) || (!multipleIsSet && defaults.multiple),
//                     // same for debug
//                     debugIsSet = args[0] && typeof args[0].debug !== 'undefined',
//                     debug = (debugIsSet && args[0].debug) || (!debugIsSet && defaults.debug);

//                 // initialize a tooltipster instance for each element if it doesn't already have one or if the multiple option is set, and attach the object to it
//                 this.each(function () {

//                     var go = false,
//                         ns = $(this).data('tooltipster-ns'),
//                         instance = null;

//                     if (!ns) {
//                         go = true;
//                     }
//                     else if (multiple) {
//                         go = true;
//                     }
//                     else if (debug) {
//                         console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.');
//                     }

//                     if (go) {
//                         instance = new Plugin(this, args[0]);

//                         // save the reference of the new instance
//                         if (!ns) ns = [];
//                         ns.push(instance.namespace);
//                         $(this).data('tooltipster-ns', ns)

//                         // save the instance itself
//                         $(this).data(instance.namespace, instance);
//                     }

//                     instances.push(instance);
//                 });

//                 if (multiple) return instances;
//                 else return this;
//             }
//         }
//     };

//     // quick & dirty compare function (not bijective nor multidimensional)
//     function areEqual(a,b) {
//         var same = true;
//         $.each(a, function(i, el){
//             if(typeof b[i] === 'undefined' || a[i] !== b[i]){
//                 same = false;
//                 return false;
//             }
//         });
//         return same;
//     }

//     // detect if this device can trigger touch events
//     var deviceHasTouchCapability = !!('ontouchstart' in window);

//     // we'll assume the device has no mouse until we detect any mouse movement
//     var deviceHasMouse = false;
//     $('body').one('mousemove', function() {
//         deviceHasMouse = true;
//     });

//     function deviceIsPureTouch() {
//         return (!deviceHasMouse && deviceHasTouchCapability);
//     }

//     // detecting support for CSS transitions
//     function supportsTransitions() {
//         var b = document.body || document.documentElement,
//             s = b.style,
//             p = 'transition';

//         if(typeof s[p] == 'string') {return true; }

//         v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
//         p = p.charAt(0).toUpperCase() + p.substr(1);
//         for(var i=0; i<v.length; i++) {
//             if(typeof s[v[i] + p] == 'string') { return true; }
//         }
//         return false;
//     }
// })( jQuery, window, document );

