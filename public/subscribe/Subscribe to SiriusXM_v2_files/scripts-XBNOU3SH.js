(function(a){var c={};function o(t){if(c[t])return c[t].exports;var e=c[t]={i:t,l:!1,exports:{}};return a[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=a,o.c=c,o.d=function(t,e,d){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:d})},o.r=function(t){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e||4&e&&typeof t=="object"&&t&&t.__esModule)return t;var d=Object.create(null);if(o.r(d),Object.defineProperty(d,"default",{enumerable:!0,value:t}),2&e&&typeof t!="string")for(var m in t)o.d(d,m,function(g){return t[g]}.bind(null,m));return d},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)})([function(a,c,o){"use strict";function t(s){return(function(n){if(Array.isArray(n))return e(n)})(s)||(function(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)})(s)||(function(n,p){if(n){if(typeof n=="string")return e(n,p);var h=Object.prototype.toString.call(n).slice(8,-1);if(h==="Object"&&n.constructor&&(h=n.constructor.name),h==="Map"||h==="Set")return Array.from(n);if(h==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(h))return e(n,p)}})(s)||(function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)})()}function e(s,n){(n==null||n>s.length)&&(n=s.length);for(var p=0,h=new Array(n);p<n;p++)h[p]=s[p];return h}function d(s){return(d=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(s)}function m(s,n){for(var p=0;p<n.length;p++){var h=n[p];h.enumerable=h.enumerable||!1,h.configurable=!0,"value"in h&&(h.writable=!0),Object.defineProperty(s,h.key,h)}}o.r(c);var g=new((function(){function s(){(function(l,i){if(!(l instanceof i))throw new TypeError("Cannot call a class as a function")})(this,s)}var n,p,h;return n=s,(p=[{key:"isInView",value:function(l){var i=l.getBoundingClientRect(),L=i.height,r=i.bottom,C=i.width;return i.top<=(window.innerHeight||document.documentElement.clientHeight)&&r>=0&&getComputedStyle(l).display!=="none"&&getComputedStyle(l).visibility!=="hidden"&&(C===0&&L>0||C>0&&L===0||C>0&&L>0)}},{key:"documentReady",value:function(l){document.readyState!=="loading"?l():document.addEventListener?document.addEventListener("DOMContentLoaded",l):document.attachEvent("onreadystatechange",(function(){document.readyState!=="loading"&&l()}))}},{key:"waitForSxm",value:function(l,i){var L=0;return new Promise((function(r,C){var w=setInterval((function(){if(!l||L>=10)return clearInterval(w),!1;l._sxm&&l._sxm[i]&&(clearInterval(w),r(l._sxm[i])),L+=1}),10)}))}},{key:"httpGet",value:function(l){return new Promise((function(i,L){var r=new XMLHttpRequest;r.onreadystatechange=function(){r.readyState===4&&(r.status===200?i(r):r.status>=400&&r.status<=599&&L(r))},r.open("GET",l,!0),r.send()}))}},{key:"getDomain",value:function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"live",i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"relative",L=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"relative",r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"relative",C={dev:"https://devcms-author.corp.siriusxm.com",uat:"https://uatcms-author.corp.siriusxm.com",uatd:"https://uatwww.siriusxm.com",prod:"https://cms-author.corp.siriusxm.com",live:"https://www.siriusxm.com",wcs11g:"http://mgmtwcs.corp.siriusxm.com",relative:""},w=C.relative;return/(localhost|127\.0\.0\.1)/gi.test(window.location.hostname)?w=C[l]:/(uatcms.siriusxm)/gi.test(window.location.hostname)?w=C.uatd:/(www)/gi.test(window.location.hostname)?w=C.relative:/(dev|dv)/gi.test(window.location.hostname)?w=C[i]:/(uat|qa)/gi.test(window.location.hostname)?w=C[L]:/(cms)/gi.test(window.location.hostname)&&(w=C[r]),w}},{key:"fireEvent",value:function(l,i){var L=null;document.createEventObject?(L=document.createEventObject(),l.fireEvent("on".concat(i),L)):((L=document.createEvent("HTMLEvents")).initEvent(i,!0,!0),l.dispatchEvent(L))}},{key:"getUrlParam",value:function(l){if(window.location.search.indexOf("".concat(l,"="))>-1){for(var i=window.location.search.replace("?","").split("&"),L=0;L<i.length;L+=1)if(i[L].indexOf("".concat(l,"="))===0)return i[L].split("=")[1]}}},{key:"objectToQuery",value:function(l,i){var L=this,r=[];return Object.keys(i).forEach((function(C){var w=i[C],M="".concat(l,"[").concat(C,"]");Array.isArray(w)?r.push(L.arrayToQuery(M,w)):d(w)==="object"?r.push(L.objectToQuery(M,w)):r.push(L.valueToQuery(M,w))})),r.join("&")}},{key:"arrayToQuery",value:function(l,i){var L=this,r=[];return l="".concat(l,"[]"),i.forEach((function(C){Array.isArray(C)?r.push(L.arrayToQuery(l,C)):d(C)==="object"?r.push(L.objectToQuery(l,C)):r.push(L.valueToQuery(l,C))})),r.join("&")}},{key:"valueToQuery",value:function(l,i){return"".concat(encodeURIComponent(l),"=").concat(encodeURIComponent(i))}},{key:"jsonToQuery",value:function(l){var i=this,L=[];return Object.keys(l).forEach((function(r){var C=l[r];Array.isArray(C)?L.push(i.arrayToQuery(r,C)):d(C)==="object"?L.push(i.objectToQuery(r,C)):L.push(i.valueToQuery(r,C))})),L.join("&")}},{key:"getFocusableElements",value:function(l){var i=arguments.length>1&&arguments[1]!==void 0&&arguments[1];l||console.error("getFocusableElements: element does not exist");var L="a[href], button, input, textarea, select, details, [tabindex], [contenteditable]",r=[];return l.matches(L)&&r.push(l),r.push.apply(r,t(l.querySelectorAll(L))),r.filter((function(C){return!(!i&&C.hasAttribute("tabindex")&&C.getAttribute("tabindex")<0||C.hasAttribute("disabled")||C.hasAttribute("hidden"))}))}}])&&m(n.prototype,p),h&&m(n,h),s})());function v(s){return(function(n){if(Array.isArray(n))return f(n)})(s)||(function(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)})(s)||(function(n,p){if(n){if(typeof n=="string")return f(n,p);var h=Object.prototype.toString.call(n).slice(8,-1);if(h==="Object"&&n.constructor&&(h=n.constructor.name),h==="Map"||h==="Set")return Array.from(n);if(h==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(h))return f(n,p)}})(s)||(function(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)})()}function f(s,n){(n==null||n>s.length)&&(n=s.length);for(var p=0,h=new Array(n);p<n;p++)h[p]=s[p];return h}var y={car:{class:"icon-content",size:"",href:"icon-car"},streaming:{class:"icon-content",size:"",href:"icon-streaming"},home:{class:"icon-content",size:"",href:"icon-home"},"apple-badge":{class:"icon-content",size:"",href:"icon-apple-badge"},pandora:{class:"icon-content",size:"",href:"icon-custom-stations"},"pandora-basic":{class:"icon-content",size:"",href:"icon-custom-stations"},"dropdown-sm":{class:"icon-utility",size:"small",href:"icon-dropdown-sm"},expand:{class:"icon-utility",size:"large",href:"icon-expand"},collapse:{class:"icon-utility",size:"large",href:"icon-collapse"},play:{class:"icon-content",size:"",href:"icon-play"},"checkmark-lg":{class:"icon-content",size:"",href:"icon-checkmark-lg"},"check-mark":{class:"icon-utility",size:"",href:"icon-check-mark-flex-stroke"},"dash-mark":{class:"icon-utility",size:"",href:"icon-dash"},"x-mark":{class:"icon-utility",size:"",href:"icon-x-mark-flex-stroke"},"features-all":{class:"icon-utility",size:"large",href:"icon-features-all"},"features-some":{class:"icon-utility",size:"large",href:"icon-features-some"},"dropdown-lg":{class:"icon-utility",size:"large",href:"icon-dropdown-lg"},"menu-kebab":{class:"icon-utility",size:"large",href:"icon-menu-kebab"},"menu-burger":{class:"icon-utility",size:"large",href:"icon-menu-burger"},validate:{class:"icon-utility",size:"large",href:"icon-validate"},lock:{class:"icon-content",size:"",href:"icon-lock"},"checkmark-sm":{class:"icon-utility",size:"small",href:"icon-checkmark-sm"},"pagination-selected":{class:"icon-utility",size:"small",href:"icon-pagination-selected"},pipe:{class:"icon-utility",size:"large",href:"icon-pipe"},add:{class:"icon-utility",size:"small",href:"icon-add"},remove:{class:"icon-utility",size:"small",href:"icon-remove"},"cc-amex":{class:"icon-content",size:"",href:"icon-cc-amex"},"cc-dci":{class:"icon-content",size:"",href:"icon-cc-dci"},"cc-discover":{class:"icon-content",size:"",href:"icon-cc-discover"},"cc-jcb":{class:"icon-content",size:"",href:"icon-cc-jcb"},"cc-mc":{class:"icon-content",size:"",href:"icon-cc-mc"},"cc-visa":{class:"icon-content",size:"",href:"icon-cc-visa"},"cc-unionpay":{class:"icon-content",size:"",href:"icon-cc-unionpay"},"hp-pause":{class:"icon-content",size:"",href:"icon-hp-pause"},"hp-play":{class:"icon-content",size:"",href:"icon-hp-play"},facebook:{class:"icon-utility",size:"large",href:"icon-facebook"},twitter:{class:"icon-utility",size:"large",href:"icon-twitter"},instagram:{class:"icon-utility",size:"large",href:"icon-instagram"},youtube:{class:"icon-utility",size:"large",href:"icon-youtube"},tiktok:{class:"icon-utility",size:"large",href:"icon-tiktok"},"app-download":{class:"icon-utility",size:"large",href:"icon-app-download"},"smart-phone":{class:"icon-utility",size:"",href:"icon-smart-phone"},"tool-tip":{class:"icon-utility",size:"large",href:"icon-tool-tip"},"custom-stations":{class:"icon-utility",size:"large",href:"icon-custom-stations"},"pandora-premium":{class:"icon-content",size:"large",href:"icon-pandora-premium"},at:{class:"icon-content",size:"",href:"icon-at"},"user-profile":{class:"icon-utility",size:"large",href:"icon-user-profile"},extended:{class:"icon-content",size:"",href:"icon-extended"},"basic-forecast":{class:"icon-content",size:"",href:"icon-basic-forecast"},buoy:{class:"icon-content",size:"",href:"icon-buoy"},cloudechotops:{class:"icon-content",size:"",href:"icon-cloudechotops"},"hi-res-wind":{class:"icon-content",size:"",href:"icon-hi-res-wind"},"high-res-surface":{class:"icon-content",size:"",href:"icon-high-res-surface"},radar:{class:"icon-content",size:"",href:"icon-basic-forecast"},"app-access":{class:"icon-content",size:"",href:"icon-app-access"},"surface-temps":{class:"icon-content",size:"",href:"icon-surface-temps"},taf:{class:"icon-content",size:"",href:"icon-taf"},"turbulence-icing":{class:"icon-content",size:"",href:"icon-turbulence-icing"},"wind-waves":{class:"icon-content",size:"",href:"icon-wind-waves"},warning:{class:"icon-utility",size:"",href:"icon-warning"},audioPauseButton:{class:"icon-content",size:"",href:"icon-audio-pause-button"},audioPlayButton:{class:"icon-content",size:"",href:"icon-audio-play-button"},audioReplayButton:{class:"icon-content",size:"",href:"icon-audio-replay-button"},vipPerks:{class:"icon-content",size:"",href:"icon-vip-perks"},adFree:{class:"icon-content",size:"",href:"icon-ad-free"},businessChannels:{class:"icon-content",size:"",href:"icon-business-channels"},sxmApp:{class:"icon-content",size:"",href:"icon-sxm-app"},talkMicrophone:{class:"icon-content",size:"",href:"icon-talk-microphone"},videoCollections:{class:"icon-content",size:"",href:"icon-video-collections"},additionalSubscriptions:{class:"icon-content",size:"",href:"icon-additional-subscriptions"},aviation:{class:"icon-content",size:"",href:"icon-aviation"},billingSummary:{class:"icon-content",size:"",href:"icon-billing-summary"},inactiveRadio:{class:"icon-content",size:"",href:"icon-inactive-radio"},marine:{class:"icon-content",size:"",href:"icon-marine"},helpBillingMyAccount:{class:"icon-content",size:"",href:"icon-helpBillingMyAccount"},helpFAQs:{class:"icon-content",size:"",href:"icon-helpFaqs"},helpMySubs:{class:"icon-content",size:"",href:"icon-helpMySubs"},helpProblems:{class:"icon-content",size:"",href:"icon-helpProblems"},tag:{class:"icon-utility",size:"large",href:"icon-tag"},tagMusic:{class:"icon-utility",size:"large",href:"icon-tag-music"},"next-arrow-right":{class:"icon-utility",size:"",href:"next-arrow-right"},"circle-checkbox":{class:"icon-utility",size:"",href:"circle-checkbox"}},u={append:function(s){s!==0&&s.forEach((function(n){n.getAttribute("data-icon").split(",").forEach((function(p){y[p]&&(function(h,l){var i=document.createElement("div");i.innerHTML=`
          <svg class="icon `.concat(y[l].class," ").concat(y[l].size,`">
            <use class="icon-`).concat(l,'" xlink:href="#').concat(y[l].href,`"></use>
          </svg>
        `),i.classList.add("icon-".concat(l,"-wrapper")),h.appendChild(i)})(n,p)}))}))},load:function(){fetch("".concat(scriptFolder,"svg/icons.svg")).then((function(s){return s.text()})).then((function(s){var n=document.createElement("div");n.classList.add("sxm-icon-spritesheet"),n.setAttribute("aria-hidden","true"),n.innerHTML=s,document.body.insertBefore(n,document.body.childNodes[0]);var p=v(document.querySelectorAll("[data-icon]"));u.append(p)}))},loadVar:function(){var s=document.createElement("div");s.classList.add("sxm-icon-spritesheet"),s.setAttribute("aria-hidden","true"),s.innerHTML=`<svg width="0" height="0" style="display:block;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

<defs>
  /* NOTE: clip paths need to be defined outside the symbol, but also cannot have the svg spritesheet set to visibility: hidden or else the clip-path will not render
  <path id="pandora_pShape" d="M33.5,19H21.9v26h7c0.6,0,1.2-0.5,1.2-1.2v-5h1.7c8.5,0,12-4.8,12-10.4C43.8,21.5,38.5,19,33.5,19z"/>
  <clipPath id="pandora_clippath_gradients">
    <use xlink:href="#pandora_pShape" overflow="visible"/>
  </clipPath> */
  <linearGradient x1="75.5242857%" y1="90.27%" x2="40.8814286%" y2="36.0557143%" id="linearGradient-discover1">
    <stop stop-color="#F79E20" offset="0%"></stop>
    <stop stop-color="#F79920" offset="25%"></stop>
    <stop stop-color="#F58C20" offset="53%"></stop>
    <stop stop-color="#F58620" offset="62%"></stop>
    <stop stop-color="#F48121" offset="71%"></stop>
    <stop stop-color="#F17522" offset="100%"></stop>
  </linearGradient>
  <linearGradient x1="70.06%" y1="89.5407143%" x2="19.4171429%" y2="-9.38785714%" id="linearGradient-discover2">
    <stop stop-color="#F58620" stop-opacity="0" offset="0%"></stop>
    <stop stop-color="#EE7E22" stop-opacity="0.14" offset="11%"></stop>
    <stop stop-color="#E37226" stop-opacity="0.35" offset="31%"></stop>
    <stop stop-color="#DB6828" stop-opacity="0.52" offset="50%"></stop>
    <stop stop-color="#D5622A" stop-opacity="0.64" offset="69%"></stop>
    <stop stop-color="#D15D2C" stop-opacity="0.71" offset="85%"></stop>
    <stop stop-color="#D05C2C" stop-opacity="0.74" offset="98%"></stop>
  </linearGradient>
  <linearGradient x1="-29.0904028%" y1="49.7891628%" x2="264.387433%" y2="49.7891628%" id="linearGradient-jcb1">
    <stop stop-color="#007F49" offset="0%"></stop>
    <stop stop-color="#219248" offset="29%"></stop>
    <stop stop-color="#51AE47" offset="77%"></stop>
    <stop stop-color="#63B946" offset="100%"></stop>
  </linearGradient>
  <linearGradient x1="9.91997573%" y1="50.219519%" x2="110.632597%" y2="50.219519%" id="linearGradient-jcb2">
    <stop stop-color="#007F49" offset="0%"></stop>
    <stop stop-color="#219248" offset="29%"></stop>
    <stop stop-color="#51AE47" offset="77%"></stop>
    <stop stop-color="#63B946" offset="100%"></stop>
  </linearGradient>
  <linearGradient x1="-29.6012163%" y1="49.2690976%" x2="284.293608%" y2="49.2690976%" id="linearGradient-jcb3">
    <stop stop-color="#007F49" offset="0%"></stop>
    <stop stop-color="#219248" offset="29%"></stop>
    <stop stop-color="#51AE47" offset="77%"></stop>
    <stop stop-color="#63B946" offset="100%"></stop>
  </linearGradient>
  <linearGradient x1="8.85007282%" y1="50.2191992%" x2="111.043762%" y2="50.2191992%" id="linearGradient-jcb4">
    <stop stop-color="#323477" offset="0%"></stop>
    <stop stop-color="#30387B" offset="5%"></stop>
    <stop stop-color="#1565AB" offset="68%"></stop>
    <stop stop-color="#0B77BD" offset="100%"></stop>
  </linearGradient>
  <linearGradient x1="8.35104369%" y1="50.2894391%" x2="107.637451%" y2="50.2894391%" id="linearGradient-jcb5">
    <stop stop-color="#753237" offset="0%"></stop>
    <stop stop-color="#A7293E" offset="38%"></stop>
    <stop stop-color="#D72144" offset="80%"></stop>
    <stop stop-color="#E91E47" offset="100%"></stop>
  </linearGradient>
</defs>


<symbol viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" id="icon-add">
  <g fill-rule="evenodd">
    <path d="M5 0v8H3V0z"></path>
    <path d="M0 3h8v2H0z"></path>
  </g>
</symbol>

<symbol viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" id="icon-car">
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M18.9,12.2l-4.7,13.4L9,32.1 c-0.6,0.7-0.9,1.6-0.9,2.5v8.6c0,1.4,0.8,2.8,2.1,3.4l0.4,0.2c2.1,1.1,4.4,1.6,6.8,1.6H47c2.4,0,4.7-0.6,6.8-1.6l0.4-0.2 c1.3-0.6,2.1-2,2.1-3.4v-8.6c0-0.9-0.3-1.8-0.9-2.5l-5.2-6.6l-4.7-13.4c0,0-4.7-1-13.2-1S18.9,12.2,18.9,12.2z"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M18.5,48.5v3.4c0,0.3-0.1,0.5-0.3,0.7l-0.4,0.4 c-0.2,0.2-0.4,0.3-0.7,0.3h-6.4c-0.5,0-1-0.2-1.3-0.6l-0.8-0.8c-0.4-0.4-0.6-0.8-0.6-1.3v-8.8"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45.8,48.5v3.4c0,0.3,0.1,0.5,0.3,0.7l0.4,0.4 c0.2,0.2,0.4,0.3,0.7,0.3h6.4c0.5,0,1-0.2,1.3-0.6l0.8-0.8c0.4-0.4,0.6-0.8,0.6-1.3v-8.8"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M22.3,41.8L22.3,41.8c0-2.3-1.4-4.3-3.6-5.1 l-6.9-2.4c-0.6-0.1-1.2-0.1-1.8,0.1l-1.9,0.7v3.8l2.5,1.3c2.1,1.1,4.4,1.6,6.8,1.6H47c2.4,0,4.7-0.6,6.8-1.6l2.5-1.3v-3.8 l-1.9-0.7c-0.6-0.2-1.2-0.2-1.8-0.1l-6.9,2.4c-2.1,0.8-3.6,2.8-3.6,5.1v0"/>
  <line fill="none" stroke-width="2" stroke-miterlimit="10" x1="14.2" y1="25.5" x2="50.1" y2="25.5"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M48.6,21.2l6.6,0.1c1.2,0.2,2.2,1.2,2.2,2.5v1.7 c0,0.6-0.4,1.1-1,1.2l-4.4,1.1"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M15.7,21.2l-6.6,0.1C7.9,21.5,7,22.5,7,23.8v1.7 c0,0.6,0.4,1.1,1,1.2l4.4,1.1"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45.8,25.3c-0.4-1.2-1.2-2.3-2.2-3.1 c-1-0.8-2.2-1.2-3.6-1.3s-2.6,0.4-3.6,1.1s-1.8,1.7-2.3,3"/>
</symbol>

// <symbol viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" >

<symbol width="24px" id="icon-explicit-content" height="20px" viewBox="0 0 24 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Spotlight-Hosted-Channel-Layout-1024" transform="translate(-306.000000, -436.000000)">
            <rect fill="#FFFFFF" x="0" y="0" width="1024" height="6865"></rect>
            <g id="Hero" transform="translate(0.000000, 142.000000)">
                <g id="Group-48">
                    <g id="Assets-/-Icons-/-Utility-/-24px-/-XL" transform="translate(306.000000, 292.000000)">
                        <g id="Group-7" transform="translate(0.000000, 2.000000)">
                            <g id="Group-3">
                                <g id="Group-4">
                                    <rect fill="#FFFFFF" x="0" y="0" width="24" height="20"></rect>
                                    <text id="XL" font-family="Gotham-Bold, Gotham, sans-serif" font-size="12" font-weight="bold" line-spacing="12" letter-spacing="0.5" fill="#000000">
                                        <tspan x="3.894" y="14">XL</tspan>
                                    </text>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</symbol>


<symbol viewBox="0 0 94 58" xmlns="http://www.w3.org/2000/svg" id="icon-cc-amex">
  <title>American Express Card</title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <rect fill="#0B7DC0" x="0" y="0" width="93" height="58"></rect>
      <path d="M0,27.3 L4.4,27.3 L5.4,24.9 L7.7,24.9 L8.7,27.3 L17.5,27.3 L17.5,25.4 L18.3,27.3 L22.9,27.3 L23.7,25.4 L23.7,27.3 L45.6,27.3 L45.6,23.3 L46,23.3 C46.3,23.3 46.4,23.3 46.4,23.8 L46.4,27.3 L57.7,27.3 L57.7,26.4 C59,27 60.4,27.4 61.9,27.3 L66.7,27.3 L67.7,24.9 L70,24.9 L71,27.3 L80.2,27.3 L80.2,24.9 L81.6,27.2 L89,27.2 L89,12 L81.7,12 L81.7,13.8 L80.7,12 L73.2,12 L73.2,13.8 L72.1,12 L62.1,12 C60.6,11.9 59.1,12.2 57.7,12.9 L57.7,12 L50.7,12 L50.7,12.9 C49.8,12.2 48.8,11.9 47.7,12 L22.4,12 L20.7,16 L19,12 L11,12 L11,13.8 L10,12.1 L3.2,12.1 L0,19.3 L0,27.3 Z M86.5,25.1 L82.8,25.1 L77.8,16.9 L77.8,25.1 L72.5,25.1 L71.5,22.7 L66,22.7 L65,25.1 L62,25.1 C59.5,25.4 57.1,23.7 56.8,21.1 C56.7,20.6 56.7,20.1 56.8,19.7 C56.7,18.1 57.2,16.6 58.2,15.4 C59.3,14.4 60.7,14 62.2,14.1 L64.7,14.1 L64.7,16.4 L62.2,16.4 C61.5,16.3 60.7,16.6 60.2,17.1 C59.7,17.8 59.4,18.7 59.5,19.6 C59.4,20.5 59.7,21.4 60.2,22.2 C60.7,22.6 61.4,22.8 62,22.8 L63.2,22.8 L66.9,14.2 L70.8,14.2 L75.2,24.6 L75.2,14.2 L79.2,14.2 L83.8,21.8 L83.8,14.2 L86.5,14.2 L86.5,25.1 Z M55.5,25.1 L52.8,25.1 L52.8,14.1 L55.5,14.1 L55.5,25.1 Z M51.4,17.1 C51.4,18.4 50.7,19.5 49.5,20 C50,20.2 50.5,20.5 50.8,20.9 C51.2,21.5 51.3,22.2 51.2,22.9 L51.2,25.1 L48.6,25.1 L48.6,23.7 C48.7,23 48.6,22.2 48.2,21.6 C47.8,21.2 47.2,21.1 46.3,21.1 L43.5,21.1 L43.5,25.1 L40.9,25.1 L40.9,14.1 L46.9,14.1 C48,14 49.1,14.2 50.1,14.6 C50.9,15.2 51.4,16.1 51.4,17.1 L51.4,17.1 Z M39,25.1 L30.2,25.1 L30.2,14.1 L39,14.1 L39,16.4 L32.9,16.4 L32.9,18.4 L38.9,18.4 L38.9,20.6 L32.9,20.6 L32.9,22.8 L39,22.8 L39,25.1 Z M28.3,25.1 L25.6,25.1 L25.6,16.5 L21.8,25.1 L19.5,25.1 L15.7,16.5 L15.7,25.1 L10.4,25.1 L9.4,22.7 L3.9,22.7 L2.9,25.1 L0.1,25.1 L4.8,14.1 L8.7,14.1 L13.2,24.5 L13.2,14.2 L17.5,14.2 L20.9,21.6 L24,14.2 L28.4,14.2 L28.3,25.1 Z M70.6,20.4 L68.8,16 L67,20.4 L70.6,20.4 Z M47.9,18.7 C47.5,18.9 47,19 46.6,18.9 L43.4,18.9 L43.4,16.5 L46.6,16.5 C47,16.5 47.5,16.5 47.8,16.7 C48.2,16.9 48.4,17.3 48.3,17.7 C48.5,18.1 48.3,18.5 47.9,18.7 L47.9,18.7 Z M8.4,20.4 L6.6,16 L4.8,20.4 L8.4,20.4 Z" fill="#FFFFFF"></path>
      <path d="M50.8,36.7 C50.8,39.7 48.5,40.4 46.2,40.4 L43,40.4 L43,44 L37.9,44 L34.7,40.4 L31.3,44 L20.9,44 L20.9,33 L31.4,33 L34.6,36.6 L38,33 L46.4,33 C48.4,33.1 50.8,33.6 50.8,36.7 Z M30,41.7 L23.6,41.7 L23.6,39.5 L29.4,39.5 L29.4,37.3 L23.6,37.3 L23.6,35.3 L30.2,35.3 L33.1,38.5 L30,41.7 Z M40.3,43 L36.3,38.5 L40.3,34.2 L40.3,43 Z M46.3,38.1 L43,38.1 L43,35.3 L46.4,35.3 C47.4,35.3 48,35.7 48,36.6 C48,37.5 47.4,38.1 46.3,38.1 L46.3,38.1 Z M64,33.1 L72.8,33.1 L72.8,35.4 L66.7,35.4 L66.7,37.4 L72.7,37.4 L72.7,39.6 L66.7,39.6 L66.7,41.8 L72.8,41.8 L72.8,44 L64,44 L64,33.1 Z M60.7,38.9 C61.2,39.1 61.7,39.4 62,39.8 C62.4,40.4 62.5,41.1 62.4,41.8 L62.4,44 L59.8,44 L59.8,42.6 C59.9,41.9 59.8,41.1 59.4,40.5 C59,40.1 58.4,40 57.5,40 L54.7,40 L54.7,44 L52,44 L52,33 L58,33 C59.1,32.9 60.2,33.1 61.2,33.5 C62.1,34 62.6,34.9 62.5,35.9 C62.6,37.2 61.9,38.4 60.7,38.9 Z M59.1,37.6 C58.7,37.8 58.3,37.9 57.8,37.8 L54.6,37.8 L54.6,35.3 L57.8,35.3 C58.2,35.3 58.7,35.3 59,35.5 C59.4,35.7 59.6,36.1 59.5,36.5 C59.7,36.9 59.5,37.3 59.1,37.6 L59.1,37.6 Z M82.8,38.2 C83.4,38.8 83.7,39.7 83.6,40.5 C83.6,42.9 82.1,44 79.5,44 L74.4,44 L74.4,41.6 L79.5,41.6 C79.9,41.6 80.3,41.5 80.6,41.3 C80.8,41.1 80.9,40.9 80.9,40.6 C80.9,40.3 80.8,40 80.5,39.8 C80.2,39.6 79.9,39.5 79.6,39.6 C77.1,39.5 74.1,39.7 74.1,36.2 C74.1,34.6 75.1,32.9 77.9,32.9 L83,32.9 L83,35.2 L78.2,35.2 C77.8,35.2 77.5,35.2 77.1,35.4 C76.8,35.6 76.7,35.9 76.7,36.2 C76.7,36.6 76.9,36.9 77.3,37 C77.6,37.1 78,37.1 78.3,37.1 L79.7,37.1 C80.8,37.2 81.9,37.5 82.8,38.2 L82.8,38.2 Z M93.2,42.6 C92.6,43.5 91.3,44 89.6,44 L84.5,44 L84.5,41.6 L89.5,41.6 C89.9,41.6 90.3,41.6 90.6,41.3 C91,40.9 91,40.3 90.6,39.9 C90.6,39.9 90.6,39.9 90.6,39.9 C90.3,39.7 90,39.6 89.7,39.7 C87.2,39.6 84.2,39.8 84.2,36.3 C84.2,34.7 85.2,33 88,33 L93.2,33 L93.2,30.8 L88.3,30.8 C87.1,30.7 86,31.1 85,31.7 L85,30.8 L77.8,30.8 C76.7,30.7 75.6,31.1 74.7,31.7 L74.7,30.8 L62,30.8 L62,31.7 C60.9,31.1 59.7,30.8 58.5,30.8 L50,30.8 L50,31.7 C49.2,30.9 47.4,30.8 46.3,30.8 L36.8,30.8 L34.6,33.1 L32.6,30.8 L18.5,30.8 L18.5,46.1 L32.4,46.1 L34.6,43.7 L36.7,46.1 L45.2,46.1 L45.2,42.5 L46.1,42.5 C47.3,42.6 48.6,42.4 49.7,42 L49.7,46.1 L56.7,46.1 L56.7,42.1 L57,42.1 C57.4,42.1 57.5,42.1 57.5,42.5 L57.5,46 L79,46 C80.3,46 81.5,45.7 82.6,45 L82.6,46 L89.4,46 C90.7,46 92,45.8 93.2,45.3 L93.2,42.6 Z M93.2,35.4 L88.4,35.4 C88,35.4 87.7,35.4 87.4,35.6 C87.1,35.8 87,36.1 87,36.4 C87,36.8 87.2,37.1 87.6,37.2 C87.9,37.3 88.3,37.3 88.6,37.3 L90,37.3 C91.1,37.2 92.2,37.5 93,38.2 C93.1,38.3 93.2,38.4 93.2,38.5 L93.2,35.4 Z" fill="#FFFFFF"></path>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 94 59" xmlns="http://www.w3.org/2000/svg" id="icon-cc-dci">
  <title>Diner's Club International Card</title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <rect fill="#FFFFFF" x="0.2" y="0.8" width="92.7" height="57.7"></rect>
      <path d="M92.7,1 L92.7,58.2 L0.5,58.2 L0.5,1 L92.7,1 L92.7,1 Z M93.2,0.5 L0,0.5 L0,58.7 L93.2,58.7 L93.2,0.5 Z" fill="#004A98"></path>
      <path d="M16.4,42.3 C16.4,43.4 17.2,43.5 17.9,43.5 C20.9,43.5 21.9,41.2 21.9,39.2 C22.1,36.9 20.3,34.9 18,34.7 C17.8,34.7 17.7,34.7 17.5,34.7 C17.1,34.7 16.8,34.7 16.4,34.8 L16.4,42.3 Z M15.1,35.8 C15.1,34.6 14.5,34.6 13.8,34.6 L13.8,34.2 C14.3,34.2 14.9,34.2 15.4,34.2 L17.8,34.2 C21.4,34.2 23.4,36.6 23.4,39.1 C23.4,40.5 22.6,43.9 17.7,43.9 C17,43.9 16.3,43.9 15.7,43.9 L13.8,43.9 L13.8,43.5 C14.6,43.4 15,43.4 15.1,42.4 L15.1,35.8 Z" fill="#221F1F"></path>
      <path d="M25.4,35.5 C25,35.5 24.7,35.2 24.7,34.8 C24.7,34.4 25,34.1 25.4,34.1 C25.8,34.1 26,34.5 26,34.9 C25.9,35.2 25.7,35.4 25.4,35.5 L25.4,35.5 Z M23.9,43.6 L24.2,43.6 C24.6,43.6 24.9,43.6 24.9,43.1 L24.9,39.3 C24.9,38.7 24.7,38.6 24.2,38.3 L24.2,38.1 C24.9,37.9 25.6,37.6 25.7,37.6 C25.8,37.6 25.9,37.5 25.9,37.5 C26,37.5 26,37.6 26,37.7 L26,43 C26,43.5 26.3,43.5 26.7,43.5 L26.9,43.5 L26.9,43.9 C26.4,43.9 25.9,43.9 25.4,43.9 L23.9,43.9 L23.9,43.6 Z" fill="#221F1F"></path>
      <path d="M28.2,39.5 C28.2,39 28.1,38.8 27.4,38.6 L27.4,38.3 C28,38.1 28.6,37.9 29.2,37.6 C29.2,37.6 29.3,37.6 29.3,37.7 L29.3,38.6 C30,38 30.8,37.7 31.7,37.6 C32.9,37.6 33.3,38.5 33.3,39.5 L33.3,43.1 C33.3,43.6 33.6,43.6 34,43.6 L34.2,43.6 L34.2,43.9 C33.7,43.9 33.2,43.9 32.7,43.9 L31.2,43.9 L31.2,43.5 L31.5,43.5 C31.9,43.5 32.2,43.5 32.2,43 L32.2,39.4 C32.2,38.6 31.7,38.2 30.9,38.2 C30.3,38.3 29.8,38.5 29.3,38.9 L29.3,43 C29.3,43.5 29.6,43.5 30,43.5 L30.2,43.5 L30.2,43.9 C29.7,43.9 29.2,43.9 28.7,43.9 L27.2,43.9 L27.2,43.5 L27.4,43.5 C27.8,43.5 28.1,43.5 28.1,43 L28.2,39.5 Z" fill="#221F1F"></path>
      <path d="M37.8,39.7 C38.1,39.7 38.2,39.5 38.2,39.3 C38.3,38.7 37.8,38.1 37.1,38 C37.1,38 37,38 37,38 C36.1,38 35.6,38.6 35.4,39.6 L37.8,39.6 L37.8,39.7 Z M35.3,40.1 C35.3,40.4 35.3,40.6 35.3,40.9 C35.2,42.1 36.1,43.1 37.3,43.3 C38,43.3 38.7,42.9 39.2,42.4 L39.4,42.6 C38.9,43.5 37.9,44.1 36.8,44.2 C34.6,44.2 34.1,42.1 34.1,41.2 C34.1,38.5 35.9,37.7 36.9,37.7 C38.1,37.6 39.2,38.5 39.2,39.7 C39.2,39.7 39.2,39.8 39.2,39.8 C39.2,39.9 39.2,40 39.2,40 L39.1,40.1 L35.3,40.1 Z" fill="#221F1F"></path>
      <path d="M39.7,43.6 L40,43.6 C40.4,43.6 40.7,43.6 40.7,43.1 L40.7,39.2 C40.7,38.8 40.2,38.7 40,38.6 L40,38.4 C41,38 41.6,37.6 41.7,37.6 C41.8,37.6 41.8,37.6 41.8,37.8 L41.8,39 L41.8,39 C42.2,38.5 42.7,37.6 43.6,37.6 C44,37.6 44.4,37.9 44.4,38.3 C44.4,38.3 44.4,38.3 44.4,38.3 C44.4,38.7 44.1,39 43.8,39 C43.8,39 43.8,39 43.8,39 C43.4,39 43.4,38.7 42.9,38.7 C42.3,38.8 41.9,39.3 41.9,39.8 L41.9,43.1 C41.9,43.6 42.2,43.6 42.6,43.6 L43.4,43.6 L43.4,44 L41.5,44 C40.9,44 40.3,44 39.8,44 L39.7,43.6 Z" fill="#221F1F"></path>
      <path d="M45,42 C45.1,42.9 45.8,43.7 46.8,43.7 C47.6,43.7 47.9,43.2 47.9,42.7 C47.9,41.1 44.9,41.6 44.9,39.3 C45,38.2 45.9,37.4 46.9,37.5 C46.9,37.5 47,37.5 47,37.5 C47.6,37.5 48.1,37.6 48.6,37.9 L48.7,39.3 L48.4,39.3 C48.4,38.5 47.7,37.9 46.9,37.9 C46.9,37.9 46.9,37.9 46.9,37.9 C46.3,37.9 45.9,38.3 45.8,38.8 C45.8,38.8 45.8,38.8 45.8,38.8 C45.8,40.4 49,39.9 49,42.1 C49,43 48.3,44 46.6,44 C46,44 45.4,43.8 44.9,43.5 L44.7,41.9 L45,42 Z" fill="#221F1F"></path>
      <path d="M61.5,36.8 L61.2,36.8 C61,35.3 59.7,34.3 58.2,34.5 C58.2,34.5 58.2,34.5 58.2,34.5 C56.6,34.5 54.3,35.6 54.3,38.9 C54.3,41.7 56.3,43.7 58.4,43.7 C59.8,43.7 61,42.7 61.2,41.3 L61.5,41.4 L61.2,43.4 C60.2,43.9 59.2,44.1 58.1,44.1 C55.4,44.3 53,42.3 52.8,39.5 C52.8,39.3 52.8,39.1 52.8,38.8 C52.9,36 55.3,33.8 58.1,33.9 C59.2,34 60.3,34.2 61.4,34.6 L61.5,36.8 Z" fill="#221F1F"></path>
      <path d="M62,43.6 L62.3,43.6 C62.7,43.6 63,43.6 63,43.1 L63,35.4 C63,34.5 62.8,34.5 62.3,34.3 L62.3,34.1 C62.8,33.9 63.3,33.7 63.7,33.5 C63.8,33.4 63.9,33.4 64,33.4 C64.1,33.4 64.1,33.5 64.1,33.6 L64.1,43.2 C64.1,43.7 64.4,43.7 64.8,43.7 L65,43.7 L65,44.1 C64.5,44.1 64,44.1 63.5,44.1 L62,44.1 L62,43.6 Z" fill="#221F1F"></path>
      <path d="M71,43.2 C71,43.5 71.1,43.5 71.4,43.5 L71.9,43.5 L71.9,43.8 C71.2,43.9 70.6,44 69.9,44.2 L69.8,44.2 L69.8,43 C69.2,43.7 68.3,44.1 67.3,44.2 C66.5,44.2 65.8,43.6 65.8,42.7 C65.8,42.6 65.8,42.6 65.8,42.5 L65.8,38.9 C65.8,38.5 65.8,38.2 65,38.1 L65,37.9 C65.5,37.9 66.6,37.8 66.8,37.8 C67,37.8 67,37.9 67,38.2 L67,41.8 C67,42.2 67,43.4 68.2,43.4 C68.8,43.3 69.4,43 69.9,42.5 L69.9,38.8 C69.9,38.5 69.2,38.4 68.7,38.2 L68.7,38 C69.9,37.9 70.7,37.8 70.9,37.8 C71.1,37.8 71,37.9 71,38 L71,43.2 Z" fill="#221F1F"></path>
      <path d="M73.7,42.4 C73.7,43.2 74.4,43.8 75.1,43.8 C76.6,43.8 77.2,42.3 77.2,41.1 C77.3,39.8 76.3,38.6 75,38.3 C74.5,38.4 74,38.6 73.7,38.9 L73.7,42.4 Z M73.7,38.6 C74.3,38 75,37.7 75.8,37.6 C77.3,37.7 78.4,38.9 78.4,40.4 C78.4,40.4 78.4,40.5 78.4,40.5 C78.5,42.4 77,44 75.1,44.1 C74.4,44.1 73.8,43.9 73.2,43.6 L72.8,43.9 L72.5,43.8 C72.6,43 72.7,42.2 72.7,41.3 L72.7,35.3 C72.7,34.4 72.5,34.4 72,34.2 L72,34 C72.5,33.8 73,33.6 73.4,33.4 C73.5,33.3 73.6,33.3 73.7,33.3 C73.8,33.3 73.8,33.4 73.8,33.5 L73.7,38.6 Z" fill="#221F1F"></path>
      <path d="M13.8,52 L13.9,52 C14.2,52 14.5,52 14.5,51.6 L14.5,47.6 C14.5,47.2 14.2,47.2 13.9,47.2 L13.8,47.2 L13.8,47 L14.9,47 L16.1,47 L16.1,47.2 L16,47.2 C15.7,47.2 15.4,47.2 15.4,47.6 L15.4,51.6 C15.4,52 15.7,52 16,52 L16.1,52 L16.1,52.2 L14.9,52.2 L13.8,52.2 L13.8,52 L13.8,52 Z" fill="#221F1F"></path>
      <path d="M16,52.2 L16,52 L16,52 C15.7,52 15.4,52 15.4,51.5 L15.4,47.5 C15.4,47.1 15.7,47 16,47 L16,47 L16,47 L14.9,47 L13.8,47 L13.8,47.2 L13.9,47.2 C14.2,47.2 14.5,47.2 14.5,47.7 L14.5,51.7 C14.5,52.1 14.2,52.2 13.9,52.2 L13.8,52.2 L13.8,52.4 L14.9,52.4 L16,52.4 L16,52.2 Z M16,52.3 L14.8,52.3 L13.7,52.3 L13.7,52.3 L13.7,52 L13.8,52 C14.1,52 14.3,52 14.3,51.6 L14.3,47.6 C14.3,47.2 14.1,47.2 13.8,47.2 L13.7,47.2 L13.7,46.9 L13.7,46.9 L14.8,46.9 L16,46.9 L16,46.9 L16,47.2 L15.9,47.2 C15.6,47.2 15.4,47.2 15.4,47.6 L15.4,51.6 C15.4,52 15.6,52 15.9,52 L16,52 L16,52.3 L16,52.3 Z" fill="#221F1F"></path>
      <path d="M21.3,50.8 L21.3,50.8 L21.3,48 C21.3,47.7 21.1,47.3 20.8,47.3 C20.8,47.3 20.7,47.3 20.7,47.3 L20.5,47.3 L20.5,47 C20.9,47 21.2,47 21.6,47 L22.5,47 L22.5,47.2 L22.4,47.2 C22.1,47.2 21.7,47.3 21.7,48.2 L21.7,51.6 C21.7,51.9 21.7,52.1 21.7,52.4 L21.5,52.4 L17.6,48.1 L17.6,51.2 C17.6,51.9 17.7,52.1 18.3,52.1 L18.4,52.1 L18.4,52.3 L17.4,52.3 L16.4,52.3 L16.4,52 L16.5,52 C17,52 17.2,51.7 17.2,51 L17.2,47.9 C17.2,47.5 16.9,47.2 16.5,47.2 C16.5,47.2 16.5,47.2 16.5,47.2 L16.4,47.2 L16.4,46.9 L17.3,46.9 C17.5,46.9 17.8,46.9 18,46.9 L21.3,50.8 Z" fill="#221F1F"></path>
      <path d="M21.4,52.3 L21.6,52.3 C21.6,52.1 21.6,51.8 21.6,51.6 L21.6,48.2 C21.6,47.3 22,47.2 22.3,47.2 L22.4,47.2 L22.4,47 L21.5,47 C21.1,47 20.8,47 20.5,47 L20.5,47.2 L20.6,47.2 C21,47.2 21.3,47.5 21.3,47.8 C21.3,47.8 21.3,47.9 21.3,47.9 L21.3,50.8 L21.3,50.8 L21.3,50.8 L18,47 C17.8,47 17.6,47 17.3,47 L16.5,47 L16.5,47.2 L16.4,47.2 C16.8,47.2 17.1,47.5 17.1,47.9 L17.1,51.1 C17.1,51.7 16.9,52.1 16.4,52.1 L16.4,52.1 L16.4,52.3 L17.4,52.3 L18.3,52.3 L18.3,52 L18.2,52 C17.6,52 17.4,51.7 17.4,51.1 L17.4,47.9 L21.4,52.3 Z M21.7,52.4 L21.4,52.4 L17.6,48.1 L17.6,51.1 C17.6,51.8 17.7,51.9 18.3,51.9 L18.5,51.9 L18.5,52.2 L18.5,52.2 L17.5,52.2 L16.5,52.2 L16.5,52.2 L16.5,52 L16.5,52 C17,52 17.1,51.7 17.1,51.1 L17.1,48 C17.1,47.6 16.8,47.4 16.5,47.3 C16.5,47.3 16.5,47.3 16.5,47.3 L16.4,47.3 L16.4,47 L16.4,47 L17.3,47 C17.5,47 17.7,47 18,47 L21.3,50.7 L21.3,48 C21.3,47.4 20.9,47.3 20.7,47.3 L20.6,47.3 L20.6,47 L20.6,47 C21,47 21.3,47 21.7,47 L22.6,47 L22.6,47 L22.6,47.3 L22.5,47.3 C22.2,47.3 21.9,47.3 21.9,48.2 L21.9,51.6 C21.6,51.9 21.6,52.1 21.7,52.4 L21.7,52.4 L21.7,52.4 Z" fill="#221F1F"></path>
      <path d="M23.6,47.4 C23,47.4 23,47.5 22.9,48.1 L22.7,48.1 C22.7,47.9 22.8,47.7 22.8,47.4 C22.8,47.2 22.8,47 22.8,46.8 L23,46.8 C23.1,47 23.2,47 23.5,47 L27.4,47 C27.6,47 27.8,47 27.8,46.8 L28,46.8 L27.9,47.4 C27.9,47.6 27.9,47.8 27.9,48 L27.7,48.1 C27.7,47.8 27.7,47.4 27.1,47.4 L25.9,47.4 L25.9,51.4 C25.9,52 26.2,52.1 26.5,52.1 L26.6,52.1 L26.6,52.3 L25.4,52.3 C24.9,52.3 24.4,52.3 24.1,52.3 L24.1,52 L24.2,52 C24.6,52 24.8,52 24.8,51.4 L24.8,47.4 L23.6,47.4 Z" fill="#221F1F"></path>
      <path d="M26.6,52.3 L25.4,52.3 C24.9,52.3 24.4,52.3 24.1,52.3 L24.1,52.3 L24.1,52 L24.3,52 C24.7,52 24.9,52 24.9,51.4 L24.9,47.4 L23.7,47.4 L23.7,47.3 L25,47.3 L25,51.4 C25,52 24.8,52.1 24.3,52.1 L24.2,52.1 L24.2,52.3 C24.5,52.3 25,52.3 25.4,52.3 L26.6,52.3 L26.6,52.1 L26.5,52.1 C26.1,52.1 25.8,52 25.8,51.4 L25.8,47.3 L27,47.3 C27.5,47.3 27.6,47.7 27.6,48 L27.8,47.9 C27.8,47.7 27.8,47.5 27.8,47.3 C27.8,47.1 27.8,46.9 27.9,46.7 L27.8,46.7 C27.8,46.9 27.6,46.9 27.4,46.9 L23.5,46.9 C23.3,46.9 23.1,46.9 23.1,46.7 L23,46.7 C23,46.9 23,47.1 23,47.3 L22.9,47.9 L23.1,47.9 C23.2,47.4 23.3,47.2 23.8,47.2 L23.8,47.3 C23.2,47.3 23.3,47.4 23.1,48 L23.1,48 L22.8,48 L22.8,48 C22.8,47.8 22.9,47.6 22.9,47.4 C22.9,47.2 22.9,47 22.9,46.8 L22.9,46.8 L23.1,46.8 L23.1,46.8 C23.1,47 23.3,47 23.5,47 L27.4,47 C27.6,47 27.8,47 27.8,46.8 L27.8,46.8 L27.8,46.8 L28,46.8 L28,46.8 C28,47 27.9,47.2 27.9,47.4 C27.9,47.6 27.9,47.8 27.9,48 L27.9,48 L27.9,48 L27.6,48.1 L27.6,48.1 C27.6,47.8 27.6,47.4 27.1,47.4 L25.9,47.4 L25.9,51.4 C25.9,52 26.1,52 26.5,52 L26.7,52 L26.7,52.3 L26.6,52.3 Z" fill="#221F1F"></path>
      <path d="M28.2,52 L28.3,52 C28.6,52 28.9,52 28.9,51.6 L28.9,47.6 C28.9,47.2 28.6,47.2 28.3,47.2 L28.2,47.2 L28.2,47 C28.7,47 29.4,47 30.1,47 L32,47 C32,47.4 32,47.8 32,48.2 L31.8,48.3 C31.8,47.8 31.7,47.4 30.9,47.4 L29.9,47.4 L29.9,49.4 L30.8,49.4 C31.3,49.4 31.3,49.2 31.4,48.7 L31.6,48.7 C31.6,49 31.6,49.3 31.6,49.6 C31.6,49.9 31.6,50.2 31.6,50.5 L31.4,50.5 C31.4,50 31.3,49.7 30.8,49.7 L29.9,49.7 L29.9,51.5 C29.9,52 30.3,52 30.8,52 C31.7,52 32.1,51.9 32.3,51.1 L32.5,51.2 C32.4,51.6 32.3,52 32.2,52.4 C31.7,52.4 30.8,52.4 30.2,52.4 C29.6,52.4 28.6,52.4 28.2,52.4 L28.2,52 Z" fill="#221F1F"></path>
      <path d="M32.2,52.2 C32.3,51.8 32.3,51.4 32.4,51 L32.3,51 C32.1,51.8 31.6,51.9 30.7,51.9 C30.2,51.9 29.7,51.9 29.7,51.4 L29.7,49.6 L30.6,49.6 C31.1,49.6 31.2,49.9 31.2,50.3 L31.4,50.3 C31.4,50 31.4,49.7 31.4,49.5 C31.4,49.3 31.4,48.9 31.4,48.7 L31.2,48.7 C31.2,49.1 31,49.4 30.6,49.4 L29.7,49.4 L29.7,47.4 L30.8,47.4 C31.6,47.4 31.7,47.8 31.8,48.3 L32,48.3 C32,48.1 32,47.8 32,47.6 L32,47.2 L30.1,47.2 C29.5,47.2 28.7,47.2 28.2,47.2 L28.2,47.4 L28.3,47.4 C28.6,47.4 28.9,47.4 28.9,47.9 L28.9,51.9 C28.9,52.3 28.6,52.4 28.3,52.4 L28.2,52.4 L28.2,52.6 L30.2,52.6 L32.2,52.6 L32.2,52.2 Z M32.2,52.4 C31.7,52.4 30.8,52.4 30.2,52.4 C29.6,52.4 28.6,52.4 28.2,52.4 L28.2,52.4 L28.2,52.1 L28.3,52.1 C28.6,52.1 28.8,52.1 28.8,51.7 L28.8,47.7 C28.8,47.3 28.6,47.3 28.3,47.3 L28.2,47.3 L28.2,46.9 L28.2,46.9 C28.7,46.9 29.4,46.9 30.1,46.9 L32,46.9 L32,46.9 L32,46.9 C32,47 32,47.1 32,47.3 C32,47.5 32,47.8 32,48.1 L32,48.1 L32,48.1 L31.7,48.2 L31.7,48.2 C31.7,47.7 31.6,47.4 30.8,47.3 L29.8,47.3 L29.8,49.2 L30.7,49.2 C31.1,49.2 31.2,49 31.3,48.6 L31.3,48.6 L31.6,48.6 L31.6,48.6 C31.6,48.9 31.6,49.2 31.6,49.5 C31.6,49.8 31.6,50.1 31.6,50.4 L31.6,50.4 L31.6,50.4 L31.3,50.4 L31.3,50.4 C31.2,49.9 31.2,49.7 30.7,49.7 L29.8,49.7 L29.8,51.4 C29.8,51.9 30.2,51.9 30.7,51.9 C31.6,51.9 32,51.9 32.2,51 L32.2,51 L32.2,51 L32.4,51.1 L32.4,51.1 C32.3,51.5 32.2,51.9 32.2,52.3 L32.2,52.3 L32.2,52.4 Z" fill="#221F1F"></path>
      <path d="M34.4,49.5 L34.8,49.5 C35.6,49.5 36,49.2 36,48.3 C36.1,47.8 35.7,47.3 35.1,47.2 C35,47.2 34.9,47.2 34.9,47.2 C34.8,47.2 34.6,47.2 34.5,47.2 L34.4,49.5 Z M33.4,47.8 C33.4,47.3 33.1,47.2 32.9,47.2 L32.8,47.2 L32.8,46.9 C33,46.9 33.5,46.9 34,46.9 C34.5,46.9 34.8,46.9 35.2,46.9 C36.2,46.9 37,47.2 37,48.2 C37,48.8 36.6,49.4 36,49.5 L37.3,51.4 C37.4,51.7 37.7,51.8 38,51.9 L38,52.1 C37.8,52.1 37.5,52.1 37.3,52.1 C37.1,52.1 36.8,52.1 36.6,52.1 C36,51.3 35.5,50.5 35,49.6 L34.5,49.6 L34.5,51.2 C34.5,51.8 34.8,51.8 35.1,51.8 L35.2,51.8 L35.2,52 C34.8,52 34.3,52 33.9,52 C33.5,52 33.2,52 32.8,52 L32.8,52 L32.9,52 C33.2,52 33.4,51.9 33.4,51.6 L33.4,47.8 Z" fill="#221F1F"></path>
      <path d="M34.8,49.5 C35.6,49.5 35.9,49.2 35.9,48.4 C35.9,47.8 35.5,47.4 35,47.3 C34.9,47.3 34.9,47.3 34.8,47.3 C34.7,47.3 34.5,47.3 34.4,47.3 L34.4,49.5 L34.8,49.5 Z M34.5,49.6 L34.5,49.6 L34.5,47.3 L34.5,47.3 C34.6,47.3 34.8,47.3 34.9,47.3 C35.5,47.3 36,47.7 36,48.3 C36,48.3 36,48.4 36,48.4 C36,49.3 35.6,49.6 34.8,49.6 L34.5,49.6 Z M34.5,49.8 L35,49.8 L35,49.8 C35.5,50.6 36,51.5 36.5,52.2 L37.2,52.2 C37.4,52.2 37.7,52.2 37.9,52.2 L37.9,52 C37.6,52 37.3,51.8 37.2,51.5 L35.9,49.5 L35.9,49.5 C36.5,49.3 36.9,48.8 36.9,48.2 C36.9,47.2 36.1,46.9 35.1,46.9 C34.7,46.9 34.3,46.9 33.9,46.9 C33.5,46.9 33,46.9 32.8,46.9 L32.8,47.1 L32.9,47.1 C33.1,47.1 33.5,47.1 33.5,47.7 L33.5,51.5 C33.5,51.8 33.2,52 32.9,52 L32.8,52 L32.8,52.2 L33.9,52.2 C34.3,52.2 34.8,52.2 35.2,52.2 L35.2,52 L35,52 C34.6,52 34.4,52 34.4,51.4 L34.4,49.7 L34.5,49.8 Z M38,52.3 C37.8,52.3 37.5,52.3 37.3,52.3 C37.1,52.3 36.8,52.3 36.6,52.3 C36,51.5 35.5,50.7 35,49.9 L34.5,49.9 L34.5,51.5 C34.5,52.1 34.7,52.1 35.1,52.1 L35.3,52.1 L35.3,52.4 L35.3,52.4 C34.9,52.4 34.4,52.4 34,52.4 C33.6,52.4 33.3,52.4 32.9,52.4 L32.9,52.4 L32.9,52 L33,52 C33.3,52 33.5,51.9 33.5,51.6 L33.5,47.8 C33.5,47.3 33.2,47.3 33,47.3 L32.8,47.3 L32.8,47 L32.8,47 C33,47 33.5,47 34,47 C34.5,47 34.8,47 35.2,47 C36.2,47 37,47.3 37,48.4 C37,49 36.6,49.6 36,49.7 L37.3,51.6 C37.4,51.9 37.7,52 38,52 L38,52 L38,52.3 L38,52.3 Z" fill="#221F1F"></path>
      <path d="M43.1,50.8 L43.1,48 C43.2,47.7 42.9,47.3 42.6,47.3 C42.6,47.3 42.5,47.3 42.5,47.3 L42.3,47.3 L42.3,47 C42.7,47 43,47 43.4,47 L44.3,47 L44.3,47.2 L44.2,47.2 C43.9,47.2 43.5,47.3 43.5,48.2 L43.5,51.6 C43.5,51.9 43.5,52.1 43.5,52.4 L43.2,52.4 L39.3,48.1 L39.3,51.2 C39.3,51.9 39.4,52.1 40,52.1 L40.1,52.1 L40.1,52.3 C39.8,52.3 39.4,52.3 39.1,52.3 L38.1,52.3 L38.1,52 L38.2,52 C38.7,52 38.9,51.7 38.9,51 L38.9,47.9 C38.9,47.5 38.6,47.2 38.2,47.2 C38.2,47.2 38.2,47.2 38.2,47.2 L38.1,47.2 L38.1,46.9 L39,46.9 C39.2,46.9 39.5,46.9 39.7,46.9 L43.1,50.8 Z" fill="#221F1F"></path>
      <path d="M43.2,52.3 L43.4,52.3 C43.4,52.1 43.4,51.8 43.4,51.6 L43.4,48.2 C43.4,47.3 43.8,47.2 44.1,47.2 L44.2,47.2 L44.2,47 L43.3,47 C42.9,47 42.6,47 42.3,47 L42.3,47.2 L42.4,47.2 C42.8,47.2 43.1,47.5 43.1,47.8 C43.1,47.8 43.1,47.9 43.1,47.9 L43.1,50.8 L43.1,50.8 L43.1,50.8 L39.7,47 C39.5,47 39.3,47 39,47 L38.2,47 L38.2,47.2 L38.3,47.2 C38.7,47.2 39,47.5 39,47.9 L39,51.1 C39,51.7 38.8,52.1 38.3,52.1 L38.2,52.1 L38.2,52.3 L39.2,52.3 C39.5,52.3 39.8,52.3 40.1,52.3 L40.1,52 L40,52 C39.4,52 39.2,51.7 39.2,51.1 L39.2,48 L43.2,52.3 Z M43.5,52.4 L43.2,52.4 L39.4,48.1 L39.4,51.1 C39.4,51.8 39.5,51.9 40.1,51.9 L40.3,51.9 L40.3,52.2 L40.3,52.2 L39.3,52.2 L38.3,52.2 L38.3,52.2 L38.3,52 L38.4,52 C38.9,52 39,51.7 39,51.1 L39,48 C39,47.6 38.7,47.4 38.4,47.3 C38.4,47.3 38.4,47.3 38.4,47.3 L38.3,47.3 L38.3,47 L38.3,47 L39.2,47 C39.4,47 39.6,47 39.9,47 L43.2,50.7 L43.2,48 C43.2,47.4 42.8,47.3 42.6,47.3 L42.4,47.3 L42.4,47 L42.4,47 C42.8,47 43.1,47 43.5,47 L44.4,47 L44.4,47 L44.4,47.3 L44.3,47.3 C44,47.3 43.7,47.3 43.7,48.2 L43.7,51.6 C43.5,51.9 43.5,52.1 43.5,52.4 L43.5,52.4 L43.5,52.4 Z" fill="#221F1F"></path>
      <path d="M46.6,47.8 L46.6,47.8 L45.9,49.9 L47.3,49.9 L46.6,47.8 Z M45.5,51.2 C45.4,51.4 45.4,51.6 45.3,51.8 C45.3,52 45.6,52.1 45.9,52.1 L46,52.1 L46,52.3 C45.7,52.3 45.4,52.3 45.1,52.3 C44.8,52.3 44.6,52.3 44.3,52.3 L44.3,52 L44.3,52 C44.6,52 44.9,51.8 45,51.5 L46.2,48 C46.3,47.7 46.4,47.4 46.5,47.1 C46.7,47 47,46.9 47.2,46.8 L47.3,46.8 C47.3,46.8 47.3,46.8 47.3,46.8 C47.3,46.9 47.4,46.9 47.4,47 L48.8,51 C48.9,51.3 49,51.5 49.1,51.8 C49.2,52 49.4,52.1 49.6,52.1 L49.6,52.1 L49.6,52.3 C49.3,52.3 48.9,52.3 48.6,52.3 L47.5,52.3 L47.5,52.1 L47.6,52.1 C47.8,52.1 48.1,52.1 48.1,51.9 C48.1,51.7 48,51.5 48,51.4 L47.7,50.5 L46,50.5 L45.5,51.2 Z" fill="#221F1F"></path>
      <path d="M45.9,49.9 L47.2,49.9 L46.5,47.9 L45.9,49.9 Z M45.9,50 L46.6,47.8 L46.6,47.8 L46.6,47.8 L46.6,47.8 L46.6,47.8 L46.6,47.8 L47.3,50 L45.9,50 Z M47.4,52.2 L48.5,52.2 L49.5,52.2 L49.5,52 L49.5,52 C49.3,52 49.1,51.9 49,51.7 C48.9,51.5 48.8,51.2 48.7,50.9 L47.3,46.9 L47.2,46.7 L47.1,46.7 C46.9,46.8 46.7,46.9 46.4,47 C46.3,47.3 46.2,47.6 46.1,48 L44.9,51.5 C44.8,51.8 44.5,52 44.2,52 L44.2,52 L44.2,52.2 L45,52.2 L46,52.2 L46,52 L46,52 C45.8,52 45.4,52 45.4,51.7 C45.4,51.5 45.5,51.3 45.6,51.1 L45.6,51.1 L45.8,50.3 L47.6,50.3 L47.9,51.2 C48,51.4 48,51.6 48,51.7 C48,51.9 47.7,51.9 47.5,52 L47.4,52 L47.4,52.2 Z M49.5,52.3 C49.2,52.3 48.8,52.3 48.5,52.3 L47.4,52.3 L47.4,52.3 L47.4,52 L47.5,52 C47.7,52 47.9,52 47.9,51.8 C47.9,51.6 47.8,51.4 47.8,51.3 L47.5,50.4 L45.8,50.4 L45.6,51.2 C45.5,51.4 45.5,51.6 45.4,51.8 C45.4,52 45.7,52 45.9,52 L46,52 L46,52.3 L46,52.3 C45.7,52.3 45.4,52.3 45.1,52.3 L44.3,52.3 L44.3,52.3 L44.3,52 L44.4,52 C44.7,52 44.9,51.8 45,51.5 L46.2,48 C46.3,47.7 46.4,47.3 46.5,47 C46.7,46.9 47,46.8 47.2,46.7 L47.3,46.7 C47.3,46.7 47.4,46.7 47.4,46.7 L47.5,46.9 L48.9,50.9 C49,51.2 49.1,51.4 49.2,51.7 C49.3,51.9 49.5,52 49.7,52 L49.8,52 L49.5,52.3 L49.5,52.3 Z" fill="#221F1F"></path>
      <path d="M49.9,47.4 C49.3,47.4 49.3,47.5 49.2,48.1 L49,48.1 C49,47.9 49.1,47.7 49.1,47.4 C49.1,47.2 49.1,47 49.1,46.8 L49.3,46.8 C49.4,47 49.5,47 49.8,47 L53.7,47 C53.9,47 54.1,47 54.1,46.8 L54.3,46.8 C54.3,47 54.2,47.2 54.2,47.4 C54.2,47.6 54.2,47.8 54.2,48 L54,48.1 C54,47.8 54,47.4 53.4,47.4 L52.2,47.4 L52.2,51.4 C52.2,52 52.5,52.1 52.8,52.1 L52.9,52.1 L52.9,52.3 L51.7,52.3 C51.2,52.3 50.7,52.3 50.4,52.3 L50.4,52 L50.5,52 C50.9,52 51.1,52 51.1,51.4 L51.1,47.4 L49.9,47.4 Z" fill="#221F1F"></path>
      <path d="M52.9,52.3 L51.7,52.3 C51.2,52.3 50.7,52.3 50.4,52.3 L50.4,52.3 L50.4,52 L50.6,52 C51,52 51.2,52 51.2,51.4 L51.2,47.4 L50,47.4 L50,47.3 L51.3,47.3 L51.3,51.4 C51.3,52 51.1,52.1 50.6,52.1 L50.5,52.1 L50.5,52.3 C50.8,52.3 51.3,52.3 51.7,52.3 L52.9,52.3 L52.9,52.1 L52.8,52.1 C52.4,52.1 52.1,52 52.1,51.4 L52.1,47.3 L53.4,47.3 C53.9,47.3 54,47.7 54,48 L54.2,47.9 C54.2,47.7 54.2,47.5 54.2,47.3 C54.2,47.1 54.2,46.9 54.3,46.7 L54.2,46.7 C54.2,46.9 54,46.9 53.8,46.9 L49.9,46.9 C49.7,46.9 49.5,46.9 49.5,46.7 L49.4,46.7 C49.4,46.9 49.4,47.1 49.4,47.3 C49.4,47.5 49.3,47.7 49.3,47.9 L49.5,47.9 C49.6,47.4 49.7,47.2 50.2,47.2 L50.2,47.3 C49.6,47.3 49.7,47.4 49.5,48 L49.5,48 L49.2,48 L49.2,48 L49.3,47.4 C49.3,47.2 49.3,47 49.3,46.8 L49.3,46.8 L49.5,46.8 L49.5,46.8 C49.5,47 49.7,47 49.9,47 L53.8,47 C54,47 54.2,47 54.2,46.8 L54.2,46.8 L54.2,46.8 L54.4,46.8 L54.4,46.8 C54.4,47 54.4,47.2 54.3,47.4 C54.2,47.6 54.3,47.8 54.3,48 L54.3,48 L54.3,48 L54,48.1 L54,48.1 C54,47.8 54,47.4 53.5,47.4 L52.3,47.4 L52.3,51.4 C52.3,52 52.5,52 52.9,52 L53.1,52 L52.9,52.3 L52.9,52.3 Z" fill="#221F1F"></path>
      <path d="M54.5,52 L54.6,52 C54.9,52 55.2,52 55.2,51.6 L55.2,47.6 C55.2,47.2 54.9,47.2 54.6,47.2 L54.5,47.2 L54.5,47 L55.6,47 L56.8,47 L56.8,47.2 L56.7,47.2 C56.4,47.2 56.1,47.2 56.1,47.6 L56.1,51.6 C56.1,52 56.4,52 56.7,52 L56.8,52 L56.8,52.2 L55.6,52.2 L54.5,52.2 L54.5,52 Z" fill="#221F1F"></path>
      <path d="M56.8,52.2 L56.8,52 L56.7,52 C56.4,52 56.1,52 56.1,51.5 L56.1,47.5 C56.1,47.1 56.4,47 56.7,47 L56.8,47 L56.8,47 L55.6,47 L54.5,47 L54.5,47.2 L54.6,47.2 C54.9,47.2 55.2,47.2 55.2,47.7 L55.2,51.7 C55.2,52.1 54.9,52.2 54.6,52.2 L54.5,52.2 L54.5,52.4 L55.6,52.4 L56.8,52.4 L56.8,52.2 Z M56.8,52.3 L55.6,52.3 L54.5,52.3 L54.5,52.3 L54.5,52 L54.6,52 C54.9,52 55.1,52 55.1,51.6 L55.1,47.6 C55.1,47.2 54.9,47.2 54.6,47.2 L54.4,47.2 L54.4,46.9 L54.4,46.9 L55.5,46.9 L56.7,46.9 L56.7,46.9 L56.7,47.2 L56.6,47.2 C56.3,47.2 56.1,47.2 56.1,47.6 L56.1,51.6 C56.1,52 56.3,52 56.6,52 L56.7,52 L56.8,52.3 L56.8,52.3 Z" fill="#221F1F"></path>
      <path d="M59.9,52 C61.4,52 61.6,50.7 61.6,49.6 C61.6,48.5 61,47.2 59.7,47.2 C58.4,47.2 58,48.4 58,49.4 C58.1,50.7 58.7,52 59.9,52 M59.8,46.9 C61.3,46.8 62.5,47.8 62.7,49.3 C62.7,49.4 62.7,49.4 62.7,49.5 C62.8,51 61.6,52.3 60.1,52.4 C60,52.4 60,52.4 59.9,52.4 C58.4,52.5 57.2,51.4 57.1,49.9 C57.1,49.8 57.1,49.8 57.1,49.7 C57.1,48.2 58.3,46.9 59.8,46.9 C59.8,46.9 59.8,46.9 59.8,46.9" fill="#221F1F"></path>
      <path d="M58,49.4 C58,48.4 58.4,47.2 59.8,47.2 C61.2,47.2 61.7,48.6 61.7,49.7 C61.7,50.8 61.4,52.1 59.9,52.1 L59.9,52 C61.3,52 61.6,50.7 61.6,49.6 C61.6,48.5 61,47.2 59.8,47.2 C58.6,47.2 58.1,48.4 58,49.4 C58.1,50.7 58.7,52 59.9,52 L59.9,52.1 C58.7,52.1 58,50.8 58,49.4 M57,49.7 C57,48.2 58.2,46.9 59.8,46.9 C59.8,46.9 59.8,46.9 59.9,46.9 L59.9,47 C58.3,46.9 57.1,48.1 57,49.7 C57.1,49.6 57.1,49.7 57,49.7 C57,51.2 58.2,52.4 59.7,52.4 C59.8,52.4 59.8,52.4 59.9,52.4 C61.4,52.5 62.7,51.3 62.7,49.8 C62.7,49.7 62.7,49.7 62.7,49.6 C62.7,48.2 61.5,47 60.1,47 C60,47 60,47 59.9,47 L59.9,46.9 C61.4,46.8 62.7,47.9 62.8,49.3 C62.8,49.4 62.8,49.4 62.8,49.5 C62.9,51.1 61.6,52.4 60.1,52.4 C60,52.4 60,52.4 59.9,52.4 C58.4,52.5 57.1,51.3 57,49.8 C57,49.8 57,49.8 57,49.7" fill="#221F1F"></path>
      <path d="M67.8,50.8 L67.8,50.8 L67.8,48 C67.8,47.7 67.6,47.3 67.3,47.3 C67.3,47.3 67.2,47.3 67.2,47.3 L67,47.3 L67,47 C67.4,47 67.7,47 68.1,47 L69,47 L69,47.2 L68.9,47.2 C68.6,47.2 68.2,47.3 68.2,48.2 L68.2,51.6 C68.2,51.9 68.2,52.1 68.2,52.4 L67.9,52.4 L64,48 L64,51.1 C64,51.8 64.1,52 64.7,52 L64.8,52 L64.8,52.2 C64.5,52.2 64.2,52.2 63.8,52.2 L62.8,52.2 L62.8,52 L63,52 C63.5,52 63.7,51.7 63.7,51 L63.7,47.9 C63.7,47.5 63.4,47.2 63,47.2 C63,47.2 63,47.2 63,47.2 L62.9,47.2 L62.9,46.9 L63.8,46.9 C64,46.9 64.3,46.9 64.5,46.9 L67.8,50.8 Z" fill="#221F1F"></path>
      <path d="M67.9,52.3 L68.1,52.3 C68.1,52.1 68.1,51.8 68.1,51.6 L68.1,48.2 C68.1,47.3 68.5,47.2 68.8,47.2 L69,47.2 L69,47 L68.1,47 C67.7,47 67.4,47 67.1,47 L67.1,47.2 L67.2,47.2 C67.6,47.2 67.9,47.5 67.9,47.8 C67.9,47.8 67.9,47.9 67.9,47.9 L67.9,50.8 L67.9,50.8 L67.9,50.8 L64.4,47 C64.2,47 64,47 63.7,47 L62.9,47 L62.9,47.2 L63,47.2 C63.4,47.2 63.7,47.5 63.7,47.9 L63.7,51.1 C63.7,51.7 63.5,52.1 63,52.1 L62.9,52.1 L62.9,52.3 L63.9,52.3 C64.2,52.3 64.5,52.3 64.8,52.3 L64.8,52.1 L64.7,52.1 C64.1,52.1 64,51.8 64,51.2 L64,48 L67.9,52.3 Z M68.2,52.4 L67.9,52.4 L64.1,48.1 L64.1,51.1 C64.1,51.8 64.2,51.9 64.8,51.9 L65,51.9 L65,52.2 L65,52.2 C64.7,52.2 64.3,52.2 64,52.2 L63,52.2 L63,52.2 L63,52 L63.1,52 C63.6,52 63.7,51.7 63.7,51.1 L63.7,48 C63.7,47.6 63.4,47.4 63.1,47.3 C63.1,47.3 63.1,47.3 63.1,47.3 L63,47.3 L63,47 L63,47 L63.9,47 C64.1,47 64.3,47 64.6,47 L67.9,50.7 L67.9,48 C67.9,47.4 67.5,47.3 67.3,47.3 L67,47.3 L67,47 L67,47 C67.4,47 67.7,47 68.1,47 L69,47 L69,47 L69,47.3 L68.9,47.3 C68.6,47.3 68.3,47.3 68.3,48.2 L68.3,51.6 C68.2,51.9 68.2,52.1 68.2,52.4 L68.2,52.4 L68.2,52.4 Z" fill="#221F1F"></path>
      <path d="M71.3,47.8 L71.3,47.8 L70.6,49.9 L72,49.9 L71.3,47.8 Z M70.2,51.2 C70.1,51.4 70.1,51.6 70,51.8 C70,52 70.3,52.1 70.6,52.1 L70.7,52.1 L70.7,52.3 C70.4,52.3 70.1,52.3 69.8,52.3 C69.5,52.3 69.3,52.3 69,52.3 L69,52 L69,52 C69.3,52 69.6,51.8 69.7,51.5 L70.9,48 C71,47.7 71.1,47.4 71.2,47.1 C71.4,47 71.7,46.9 71.9,46.8 L72,46.8 C72,46.8 72,46.8 72,46.8 C72,46.9 72.1,46.9 72.1,47 L73.5,51 C73.6,51.3 73.7,51.5 73.8,51.8 C73.9,52 74.1,52.1 74.3,52.1 L74.3,52.1 L74.3,52.3 C74,52.3 73.6,52.3 73.3,52.3 L72,52.3 L72,52.1 L72.1,52.1 C72.3,52.1 72.6,52.1 72.6,51.9 C72.6,51.7 72.5,51.5 72.5,51.4 L72.2,50.5 L70.5,50.5 L70.2,51.2 Z" fill="#221F1F"></path>
      <path d="M70.6,49.9 L72,49.9 L71.3,47.9 L70.6,49.9 Z M70.6,50 L71.3,47.8 L71.3,47.8 L71.3,47.8 L71.3,47.8 L71.3,47.8 L71.3,47.8 L72,50 L70.6,50 Z M72.1,52.2 L73.2,52.2 L74.2,52.2 L74.2,52 L74.2,52 C74,52 73.8,51.9 73.7,51.7 C73.6,51.5 73.5,51.2 73.4,50.9 L72,46.9 C72,46.8 72,46.8 71.9,46.7 L71.8,46.7 C71.6,46.8 71.4,46.9 71.1,47 C71,47.3 70.9,47.6 70.8,48 L69.6,51.5 C69.5,51.8 69.2,52 68.9,52 L68.9,52 L68.9,52.2 L69.7,52.2 L70.6,52.2 L70.6,52 L70.6,52 C70.4,52 70,52 70,51.7 C70,51.5 70.1,51.3 70.2,51.1 L70.2,51.1 L70.4,50.3 L72.2,50.3 L72.5,51.2 C72.6,51.4 72.6,51.6 72.6,51.7 C72.6,51.9 72.3,51.9 72.1,52 L72.1,52 L72.1,52.2 Z M74.2,52.3 C73.8,52.3 73.5,52.3 73.2,52.3 L72.1,52.3 L72.1,52.3 L72.1,52 L72.2,52 C72.4,52 72.6,52 72.6,51.8 C72.6,51.6 72.5,51.4 72.5,51.3 L72.2,50.4 L70.5,50.4 L70.3,51.2 C70.2,51.4 70.2,51.6 70.1,51.8 C70.1,52 70.4,52 70.6,52 L70.7,52 L70.7,52.3 L70.7,52.3 C70.4,52.3 70.1,52.3 69.8,52.3 L69,52.3 L69,52.3 L69,52 L69,52 C69.3,52 69.5,51.8 69.6,51.5 L70.8,48 C70.9,47.7 71,47.3 71.1,47 C71.3,46.9 71.6,46.8 71.8,46.7 L71.9,46.7 C71.9,46.7 72,46.7 72,46.7 C72,46.8 72.1,46.8 72.1,46.9 L73.5,50.9 C73.6,51.2 73.7,51.4 73.8,51.7 C73.9,51.9 74.1,52 74.3,52 L74.4,52 L74.2,52.3 L74.2,52.3 Z" fill="#221F1F"></path>
      <path d="M76.1,51.5 C76.1,51.8 76.3,51.9 76.6,51.9 C76.9,51.9 77.3,51.9 77.6,51.9 C77.9,51.9 78.1,51.7 78.3,51.5 C78.4,51.3 78.5,51.1 78.5,51 L78.7,51 C78.6,51.4 78.5,51.9 78.4,52.3 L76.4,52.3 C75.7,52.3 75.1,52.3 74.4,52.3 L74.4,52 L74.5,52 C74.8,52 75.1,52 75.1,51.5 L75.1,47.6 C75.1,47.2 74.8,47.2 74.5,47.2 L74.4,47.2 L74.4,46.9 L75.6,46.9 C76,46.9 76.4,46.9 76.7,46.9 L76.7,47.1 L76.5,47.1 C76.2,47.1 76,47.1 76,47.5 L76.1,51.5 Z" fill="#221F1F"></path>
      <path d="M78.4,52.2 C78.5,51.8 78.6,51.4 78.7,51 L78.5,51 C78.5,51.2 78.4,51.4 78.3,51.5 C78.1,51.7 77.8,51.9 77.5,51.9 L77,51.9 L76.6,51.9 C76.4,51.9 76.1,51.8 76.1,51.4 L76.1,47.5 C76.1,47.1 76.4,47.1 76.6,47.1 L76.7,47.1 L76.7,47 L75.6,47 C75.2,47 74.8,47 74.4,47 L74.4,47.2 L74.5,47.2 C74.8,47.2 75.1,47.2 75.1,47.7 L75.1,51.6 C75.1,52.1 74.8,52.1 74.5,52.1 L74.4,52.1 L74.4,52.3 C75.1,52.3 75.7,52.3 76.4,52.3 C77.1,52.3 77.8,52.2 78.4,52.2 L78.4,52.2 Z M78.5,52.3 L76.5,52.3 C75.8,52.3 75.2,52.3 74.5,52.3 L74.5,52.3 L74.5,52 L74.6,52 C74.9,52 75.1,52 75.1,51.5 L75.1,47.6 C75.1,47.2 74.8,47.2 74.6,47.2 L74.4,47.2 L74.4,46.9 L74.4,46.9 L75.6,46.9 C76,46.9 76.4,46.9 76.7,46.9 L76.7,46.9 L76.7,47.2 L76.5,47.2 C76.2,47.2 76,47.2 76,47.6 L76,51.5 C76,51.8 76.2,51.9 76.4,51.9 L76.8,51.9 L77.4,51.9 C77.7,51.9 77.9,51.7 78.1,51.5 C78.2,51.3 78.3,51.2 78.3,51 L78.3,51 L78.6,51 L78.6,51 C78.6,51.4 78.5,51.8 78.5,52.3 L78.5,52.3 L78.5,52.3 Z" fill="#221F1F"></path>
      <path d="M78.5,47.6 L78.6,47.6 C78.7,47.6 78.7,47.5 78.7,47.4 C78.7,47.3 78.6,47.2 78.5,47.2 L78.4,47.2 L78.4,47.6 L78.5,47.6 Z M78.3,48 L78.3,48 C78.4,48 78.4,48 78.4,47.9 L78.4,47.3 C78.4,47.2 78.4,47.2 78.3,47.2 L78.3,47.2 L78.7,47.2 C78.8,47.2 79,47.3 79,47.4 C79,47.5 78.9,47.6 78.8,47.6 L78.9,47.8 C78.9,47.9 79,47.9 79.1,48 L79.1,48 L79,48 C78.9,48 78.9,47.8 78.7,47.6 L78.6,47.6 L78.6,47.9 C78.6,47.9 78.6,47.9 78.7,48 L78.7,48 L78.3,48 Z M78.7,48.2 C79.1,48.2 79.4,47.9 79.4,47.6 C79.4,47.3 79.1,46.9 78.8,46.9 C78.4,46.9 78.1,47.2 78.1,47.5 C78.1,47.5 78.1,47.5 78.1,47.5 C78,47.9 78.3,48.2 78.7,48.2 C78.7,48.2 78.7,48.2 78.7,48.2 L78.7,48.2 Z M78.7,46.8 C79.1,46.8 79.5,47.2 79.5,47.6 C79.5,48 79.1,48.4 78.7,48.4 C78.3,48.4 77.9,48 77.9,47.6 C77.9,47.1 78.2,46.8 78.7,46.8 L78.7,46.8 Z" fill="#221F1F"></path>
      <path d="M31.4,20.3 C31.4,13.2 37.1,7.5 44.2,7.5 C51.3,7.5 57,13.2 57,20.3 C57,27.4 51.3,33.1 44.2,33.1 L44.2,33.1 C37.2,33.1 31.4,27.4 31.4,20.3 Z" fill="#FFFFFF"></path>
      <path d="M44.3,33.3 C37,33.3 31,27.5 30.9,20.1 C30.7,12.9 36.5,6.9 43.7,6.7 C43.9,6.7 44.1,6.7 44.3,6.7 L47.7,6.7 C54.9,6.7 61.6,12.2 61.6,20.1 C61.6,27.3 55,33.3 47.7,33.3 L44.3,33.3 Z M44.3,7.9 C37.6,7.9 32.2,13.4 32.2,20.1 C32.2,26.8 37.7,32.2 44.4,32.2 C51.1,32.2 56.5,26.7 56.5,20 C56.4,13.3 51,7.9 44.3,7.9 L44.3,7.9 Z M41.5,27.2 L41.5,12.8 C37.5,14.3 35.6,18.8 37.1,22.8 C37.9,24.8 39.5,26.4 41.5,27.2 Z M52,20 C52,16.8 50,14 47,12.8 L47,27.2 C50,26.1 52,23.2 52,20 L52,20 Z" fill="#004A98"></path>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 92 59" xmlns="http://www.w3.org/2000/svg" id="icon-cc-discover">
  <title>Discover Card</title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <polygon fill="#FFFFFF" points="0.4 0.6 90.8 0.6 90.8 58.2 0.5 58.2"></polygon>
      <path d="M90.4,32.6 C90.4,32.6 65.7,50 20.5,57.8 L90.4,57.8 L90.4,32.6 Z" fill="#F38020"></path>
      <path d="M90.8,0.3 L0.1,0.3 L0.1,58.5 L91.1,58.5 L91.1,0.3 L90.8,0.3 Z M90.4,0.9 L90.4,57.8 L0.8,57.8 L0.8,0.9 L90.4,0.9 Z" fill="#221F1F"></path>
      <path d="M8.1,18.1 L4.3,18.1 L4.3,31.3 L8.1,31.3 C9.8,31.4 11.5,30.9 12.8,29.8 C14.3,28.5 15.2,26.7 15.2,24.7 C15.1,20.8 12.2,18.1 8.1,18.1 Z M11.1,28 C10.1,28.8 8.8,29.1 7.6,29 L6.9,29 L6.9,20.3 L7.6,20.3 C8.9,20.2 10.1,20.6 11.1,21.4 C12,22.2 12.5,23.4 12.5,24.7 C12.5,25.9 12,27.1 11.1,28 Z" fill="#221F1F"></path>
      <rect fill="#221F1F" x="16.3" y="18.1" width="2.6" height="13.2"></rect>
      <path d="M25.2,23.2 C23.7,22.6 23.2,22.3 23.2,21.6 C23.2,20.9 24,20 25.1,20 C25.9,20 26.7,20.4 27.2,21.1 L28.5,19.3 C27.4,18.4 26.1,17.8 24.6,17.8 C22.5,17.7 20.6,19.3 20.5,21.4 C20.5,21.5 20.5,21.5 20.5,21.6 C20.5,23.4 21.3,24.3 23.7,25.2 C24.3,25.4 24.9,25.6 25.5,26 C26,26.3 26.3,26.8 26.3,27.4 C26.3,28.4 25.4,29.3 24.4,29.3 C24.4,29.3 24.3,29.3 24.3,29.3 C23.1,29.3 22,28.6 21.5,27.5 L19.8,29.1 C20.7,30.7 22.5,31.7 24.3,31.6 C26.6,31.8 28.7,30 28.8,27.7 C28.8,27.6 28.8,27.4 28.8,27.3 C29,25.2 28.1,24.2 25.2,23.2 Z" fill="#221F1F"></path>
      <path d="M29.8,24.7 C29.8,28.5 32.8,31.5 36.6,31.6 C36.7,31.6 36.7,31.6 36.8,31.6 C37.9,31.6 39,31.3 40,30.8 L40,27.8 C39.2,28.7 38.1,29.2 36.9,29.2 C34.5,29.3 32.5,27.4 32.5,25 C32.5,24.9 32.5,24.8 32.5,24.6 C32.4,22.2 34.3,20.2 36.7,20.1 C36.7,20.1 36.7,20.1 36.8,20.1 C38,20.1 39.2,20.6 40,21.6 L40,18.6 C39,18.1 37.9,17.8 36.8,17.8 C33,17.8 29.8,20.9 29.8,24.7 C29.8,24.7 29.8,24.7 29.8,24.7 Z" fill="#221F1F"></path>
      <polygon fill="#221F1F" points="60.3 26.9 56.8 18.1 54 18.1 59.6 31.6 61 31.6 66.6 18.1 63.9 18.1"></polygon>
      <polygon fill="#221F1F" points="67.8 31.3 75.1 31.3 75.1 29 70.4 29 70.4 25.5 74.9 25.5 74.9 23.2 70.4 23.2 70.4 20.3 75.1 20.3 75.1 18.1 67.8 18.1"></polygon>
      <path d="M85.3,22 C85.3,19.5 83.6,18.1 80.6,18.1 L76.8,18.1 L76.8,31.3 L79.4,31.3 L79.4,26 L79.7,26 L83.3,31.3 L86.5,31.3 L82.4,25.7 C84.1,25.4 85.4,23.8 85.3,22 Z M80.1,24.2 L79.3,24.2 L79.3,20.2 L80.1,20.2 C81.7,20.2 82.6,20.9 82.6,22.2 C82.6,23.5 81.8,24.2 80.1,24.2 Z" fill="#221F1F"></path>
      <path d="M54.8,24.7 C54.8,28.6 51.7,31.7 47.8,31.7 C43.9,31.7 40.8,28.6 40.8,24.7 C40.8,20.8 43.9,17.7 47.8,17.7 C51.7,17.7 54.8,20.9 54.8,24.7 Z" fill="url(#linearGradient-discover1)"></path>
      <path d="M54.8,24.7 C54.8,28.6 51.7,31.7 47.8,31.7 C43.9,31.7 40.8,28.6 40.8,24.7 C40.8,20.8 43.9,17.7 47.8,17.7 C51.7,17.7 54.8,20.9 54.8,24.7 Z" fill="url(#linearGradient-discover2)" opacity="0.65"></path>
      <path d="M86.9,18.6 C86.9,18.4 86.7,18.2 86.5,18.2 L86.1,18.2 L86.1,19.4 L86.4,19.4 L86.4,18.9 L86.7,19.3 L87,19.3 L86.6,18.8 C86.8,18.9 86.9,18.7 86.9,18.6 Z M86.4,18.8 L86.4,18.8 L86.4,18.5 L86.4,18.5 C86.5,18.5 86.6,18.6 86.6,18.6 C86.6,18.6 86.5,18.8 86.4,18.8 L86.4,18.8 Z" fill="#221F1F"></path>
      <path d="M86.5,17.8 C85.9,17.8 85.5,18.2 85.5,18.8 C85.5,19.4 85.9,19.8 86.5,19.8 C87.1,19.8 87.5,19.4 87.5,18.8 C87.5,18.2 87.1,17.8 86.5,17.8 Z M86.5,19.6 C86,19.5 85.7,19.1 85.8,18.7 C85.8,18.3 86.1,18 86.5,18 C87,18.1 87.3,18.5 87.2,18.9 C87.2,19.3 86.9,19.6 86.5,19.6 Z" fill="#221F1F"></path>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 94 59" xmlns="http://www.w3.org/2000/svg" id="icon-cc-jcb">
  <title>JCB Card </title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <rect fill="#FFFFFF" x="0.2" y="0.5" width="92.7" height="57.7"></rect>
      <path d="M92.7,0.7 L92.7,57.9 L0.5,57.9 L0.5,0.7 L92.7,0.7 L92.7,0.7 Z M93.2,0.2 L0,0.2 L0,58.4 L93.2,58.4 L93.2,0.2 Z" fill="#BFBEBE"></path>
      <path d="M63.5,34.7 L68.3,34.7 C68.5,34.7 68.7,34.7 68.9,34.7 C70.1,34.4 70.8,33.2 70.5,32 C70.3,31.2 69.7,30.6 68.9,30.4 C68.7,30.4 68.5,30.4 68.3,30.4 L63.5,30.4 L63.5,34.7 Z" fill="url(#linearGradient-jcb1)"></path>
      <path d="M67.8,4.2 C63.2,4.2 59.5,7.9 59.4,12.5 C59.4,12.5 59.4,12.5 59.4,12.5 L59.4,21.2 L71.2,21.2 C71.5,21.2 71.8,21.2 72,21.2 C74.7,21.3 76.6,22.7 76.6,25.1 C76.6,27 75.2,28.6 72.8,28.9 L72.8,29 C75.5,29.2 77.6,30.7 77.6,33 C77.6,35.5 75.3,37.2 72.3,37.2 L59.4,37.2 L59.4,54.2 L71.6,54.2 C76.2,54.2 80,50.5 80,45.8 L80,45.8 L80,4.1 L67.8,4.1 L67.8,4.2 Z" fill="url(#linearGradient-jcb2)"></path>
      <path d="M70,25.8 C70,24.8 69.3,24 68.3,23.8 L67.8,23.8 L63.4,23.8 L63.4,27.9 L67.8,27.9 L68.3,27.9 C69.4,27.7 70.1,26.8 70,25.8 Z" fill="url(#linearGradient-jcb3)"></path>
      <path d="M21.6,4.2 C17,4.2 13.3,7.9 13.2,12.5 C13.2,12.5 13.2,12.5 13.2,12.5 L13.2,33.1 C15.4,34.3 17.9,34.9 20.4,35 C23.3,35 24.9,33.2 24.9,30.9 L24.9,21.2 L32.1,21.2 L32.1,30.9 C32.1,34.7 29.8,37.7 21.8,37.7 C18.9,37.7 16,37.4 13.2,36.7 L13.2,54.3 L25.4,54.3 C30,54.3 33.8,50.6 33.8,45.9 L33.8,45.9 L33.8,4.1 L21.6,4.1 L21.6,4.2 Z" fill="url(#linearGradient-jcb4)"></path>
      <path d="M44.7,4.2 C40.1,4.2 36.4,7.9 36.4,12.5 C36.4,12.5 36.4,12.5 36.4,12.5 L36.4,23.4 C38.5,21.6 42.2,20.5 48.1,20.7 C50.3,20.8 52.5,21.2 54.7,21.7 L54.7,25.2 C52.7,24.2 50.6,23.5 48.4,23.4 C43.9,23.1 41.2,25.3 41.2,29.2 C41.2,33.1 43.9,35.3 48.4,35 C50.6,34.8 52.8,34.2 54.7,33.1 L54.7,36.6 C52.5,37.1 50.4,37.5 48.1,37.6 C42.2,37.9 38.5,36.7 36.4,34.9 L36.4,54.2 L48.6,54.2 C53.2,54.2 57,50.5 57,45.8 L57,45.8 L57,4.1 L44.7,4.1 L44.7,4.2 Z" fill="url(#linearGradient-jcb5)"></path>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 94 59" xmlns="http://www.w3.org/2000/svg" id="icon-cc-mc">
  <title>Mastercard</title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g>
      <rect fill="#F5F5F5" fill-rule="nonzero" x="0" y="0.6" width="93.2" height="58.2"></rect>
      <rect x="10.9" y="0.4" width="71.3" height="58.5"></rect>
      <path d="M28.6,51.6 L28.6,48.7 C28.7,47.7 27.9,46.9 27,46.9 C26.9,46.9 26.9,46.9 26.8,46.9 C26.1,46.9 25.5,47.2 25.2,47.7 C24.9,47.2 24.3,46.9 23.7,46.9 C23.2,46.9 22.6,47.1 22.3,47.6 L22.3,47 L21.3,47 L21.3,51.6 L22.3,51.6 L22.3,49 C22.2,48.4 22.6,47.9 23.2,47.8 C23.3,47.8 23.3,47.8 23.4,47.8 C24.1,47.8 24.4,48.2 24.4,49 L24.4,51.6 L25.4,51.6 L25.4,49 C25.3,48.4 25.8,47.8 26.4,47.8 C26.5,47.8 26.5,47.8 26.6,47.8 C27.3,47.8 27.6,48.2 27.6,49 L27.6,51.6 L28.6,51.6 Z M43.7,46.9 L42,46.9 L42,45.5 L41,45.5 L41,46.9 L40.1,46.9 L40.1,47.8 L41,47.8 L41,49.9 C41,51 41.4,51.6 42.6,51.6 C43,51.6 43.5,51.5 43.9,51.2 L43.6,50.3 C43.3,50.5 43,50.6 42.7,50.6 C42.2,50.6 42,50.3 42,49.8 L42,47.7 L43.7,47.7 L43.7,46.9 Z M52.3,46.8 C51.8,46.8 51.3,47 51.1,47.5 L51.1,46.9 L50.1,46.9 L50.1,51.5 L51.1,51.5 L51.1,48.9 C51.1,48.1 51.4,47.7 52.1,47.7 C52.3,47.7 52.5,47.7 52.7,47.8 L53,46.8 C52.8,46.8 52.6,46.8 52.3,46.8 L52.3,46.8 Z M39.3,47.3 C38.7,47 38.1,46.8 37.4,46.8 C36.2,46.8 35.5,47.4 35.5,48.3 C35.5,49.1 36.1,49.5 37.1,49.7 L37.6,49.8 C38.1,49.9 38.4,50 38.4,50.3 C38.4,50.6 38,50.9 37.3,50.9 C36.7,50.9 36.2,50.7 35.8,50.4 L35.3,51.2 C35.9,51.6 36.6,51.8 37.3,51.8 C38.6,51.8 39.4,51.2 39.4,50.3 C39.4,49.4 38.8,49.1 37.8,48.9 L37.3,48.8 C36.9,48.7 36.5,48.7 36.5,48.3 C36.5,47.9 36.8,47.8 37.4,47.8 C37.9,47.8 38.4,47.9 38.9,48.2 L39.3,47.3 Z M66.4,46.8 C65.9,46.8 65.4,47 65.2,47.5 L65.2,46.9 L64.2,46.9 L64.2,51.5 L65.2,51.5 L65.2,48.9 C65.2,48.1 65.5,47.7 66.2,47.7 C66.4,47.7 66.6,47.7 66.8,47.8 L67.1,46.8 C66.9,46.8 66.6,46.8 66.4,46.8 L66.4,46.8 Z M53.4,49.3 C53.3,50.6 54.4,51.7 55.7,51.7 C55.8,51.7 55.9,51.7 55.9,51.7 C56.5,51.7 57.1,51.5 57.6,51.1 L57.1,50.3 C56.7,50.6 56.3,50.7 55.9,50.7 C55.1,50.7 54.4,50 54.4,49.2 C54.4,48.4 55.1,47.7 55.9,47.7 C56.3,47.7 56.8,47.9 57.1,48.1 L57.6,47.3 C57.1,46.9 56.5,46.7 55.9,46.8 C54.6,46.7 53.5,47.7 53.4,49 C53.4,49.1 53.4,49.2 53.4,49.3 L53.4,49.3 Z M62.9,49.3 L62.9,47 L61.9,47 L61.9,47.6 C61.5,47.1 61,46.9 60.4,46.9 C59.1,46.9 58,48 58,49.3 C58,50.6 59.1,51.7 60.4,51.7 C61,51.7 61.5,51.5 61.9,51 L61.9,51.6 L62.9,51.6 L62.9,49.3 Z M59.1,49.3 C59.1,48.5 59.8,47.9 60.6,48 C61.4,48.1 62,48.7 61.9,49.5 C61.9,50.3 61.2,50.8 60.5,50.8 C59.7,50.8 59.1,50.2 59.1,49.4 C59,49.3 59,49.3 59.1,49.3 L59.1,49.3 Z M46.9,46.8 C45.6,46.8 44.6,47.8 44.6,49 C44.6,49.1 44.6,49.1 44.6,49.2 C44.5,50.5 45.5,51.6 46.7,51.6 C46.8,51.6 46.9,51.6 46.9,51.6 C47.6,51.6 48.3,51.4 48.8,50.9 L48.3,50.2 C47.9,50.5 47.4,50.7 46.9,50.7 C46.2,50.8 45.6,50.3 45.5,49.6 L49,49.6 C49,49.5 49,49.3 49,49.2 C49.1,48 48.2,46.9 47,46.8 C47,46.8 46.9,46.8 46.9,46.8 L46.9,46.8 Z M46.9,47.7 C47.5,47.7 48.1,48.2 48.1,48.8 L45.7,48.8 C45.7,48.2 46.2,47.7 46.9,47.7 Z M72.2,49.3 L72.2,45.1 L71.2,45.1 L71.2,47.5 C70.8,47 70.3,46.8 69.7,46.8 C68.4,46.8 67.3,47.9 67.3,49.2 C67.3,50.5 68.4,51.6 69.7,51.6 C70.3,51.6 70.8,51.4 71.2,50.9 L71.2,51.5 L72.2,51.5 L72.2,49.3 Z M68.5,49.3 C68.5,48.5 69.2,47.9 70,48 C70.8,48.1 71.4,48.7 71.3,49.5 C71.3,50.2 70.6,50.8 69.9,50.8 C69.1,50.7 68.5,50.1 68.5,49.3 C68.5,49.3 68.5,49.3 68.5,49.3 Z M34.4,49.3 L34.4,47 L33.4,47 L33.4,47.6 C33.1,47.1 32.5,46.9 31.9,46.9 C30.6,46.9 29.5,48 29.5,49.3 C29.5,50.6 30.6,51.7 31.9,51.7 C32.5,51.7 33,51.5 33.4,51 L33.4,51.6 L34.4,51.6 L34.4,49.3 Z M30.6,49.3 C30.6,48.5 31.3,47.9 32.1,48 C32.9,48.1 33.5,48.7 33.4,49.5 C33.4,50.2 32.7,50.8 32,50.8 C31.2,50.8 30.6,50.2 30.5,49.5 C30.5,49.4 30.5,49.3 30.6,49.3 L30.6,49.3 Z M73.9,50.9 L74,50.9 C74.1,50.9 74.2,51 74.2,51.1 C74.2,51.2 74.2,51.2 74.2,51.3 C74.2,51.4 74.2,51.4 74.2,51.5 C74.2,51.6 74.1,51.6 74.1,51.6 C74.1,51.6 74,51.7 74,51.7 C73.9,51.7 73.9,51.7 73.8,51.7 C73.7,51.7 73.7,51.7 73.6,51.7 C73.5,51.7 73.5,51.6 73.5,51.6 C73.5,51.6 73.4,51.5 73.4,51.5 C73.4,51.4 73.4,51.4 73.4,51.3 C73.4,51.2 73.4,51.2 73.4,51.1 C73.4,51 73.5,51 73.5,51 C73.5,51 73.6,50.9 73.6,50.9 C73.7,50.9 73.8,50.9 73.9,50.9 Z M73.9,51.8 C73.9,51.8 74,51.8 74,51.8 C74,51.8 74.1,51.8 74.1,51.7 C74.1,51.7 74.2,51.6 74.2,51.6 C74.2,51.6 74.2,51.5 74.2,51.5 C74.2,51.5 74.2,51.4 74.2,51.4 C74.2,51.4 74.2,51.3 74.1,51.3 C74.1,51.3 74,51.2 74,51.2 C74,51.2 73.9,51.2 73.9,51.2 C73.9,51.2 73.8,51.2 73.8,51.2 C73.8,51.2 73.7,51.2 73.7,51.3 C73.7,51.3 73.6,51.4 73.6,51.4 C73.6,51.4 73.6,51.5 73.6,51.5 C73.6,51.5 73.6,51.6 73.6,51.6 C73.6,51.6 73.6,51.7 73.7,51.7 L73.8,51.8 L73.9,51.8 Z M73.9,51.2 C73.9,51.2 74,51.2 74,51.2 C74,51.2 74,51.3 74,51.3 C74,51.3 74,51.4 74,51.4 C74,51.4 73.9,51.4 73.9,51.4 L74,51.6 L73.9,51.6 L73.8,51.4 L73.8,51.4 L73.8,51.6 L73.7,51.6 L73.7,51.2 L73.9,51.2 Z M73.8,51.3 L73.8,51.4 L73.9,51.4 C73.9,51.4 73.9,51.4 74,51.4 C74,51.4 74,51.4 74,51.3 C74,51.3 74,51.3 74,51.3 L73.9,51.3 L73.8,51.3 Z" id="_Compound_Path_" fill="#000000" fill-rule="nonzero"></path>
      <g transform="translate(18.000000, 7.000000)" fill-rule="nonzero">
        <rect fill="#F16122" x="21" y="4.5" width="15.3" height="27.5"></rect>
        <path d="M21.9,18.3 C21.9,12.9 24.4,7.9 28.6,4.5 C21,-1.5 10,-0.1 4,7.5 C-2,15.1 -0.6,26.1 7,32.1 C13.3,37.1 22.3,37.1 28.6,32.1 C24.4,28.7 21.9,23.7 21.9,18.3 Z" fill="#E91D25"></path>
        <path d="M56.9,18.3 C56.9,28 49.1,35.8 39.4,35.8 C35.5,35.8 31.7,34.5 28.6,32.1 C36.2,26.1 37.5,15.1 31.5,7.5 C30.6,6.4 29.7,5.4 28.6,4.6 C36.2,-1.4 47.2,2.7533531e-14 53.2,7.6 C55.6,10.6 56.9,14.4 56.9,18.3 L56.9,18.3 Z M55.2,29.1 L55.2,28.5 L55.4,28.5 L55.4,28.4 L54.8,28.4 L54.8,28.5 L55,28.5 L55,29.1 L55.2,29.1 Z M56.4,29.1 L56.4,28.4 L56.2,28.4 L56,28.9 L55.8,28.4 L55.6,28.4 L55.6,29.1 L55.7,29.1 L55.7,28.6 L55.9,29 L56,29 L56.2,28.6 L56.2,29.1 L56.4,29.1 Z" fill="#F79E1D"></path>
      </g>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 94 60" xmlns="http://www.w3.org/2000/svg" id="icon-cc-visa">
  <title>Visa Card</title>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <rect fill="#FFFFFF" x="0" y="0.9" width="93.2" height="58.2"></rect>
      <rect fill="#F0B21C" x="0" y="50.7" width="93.2" height="8.4"></rect>
      <rect fill="#292D6A" x="0" y="1" width="93.2" height="8.4"></rect>
      <path d="M37.3,18.5 L27.7,41.5 L21.5,41.5 L16.8,23.2 C16.7,22.3 16.2,21.6 15.4,21.2 C13.5,20.3 11.6,19.7 9.5,19.2 L9.6,18.5 L19.7,18.5 C21.1,18.5 22.2,19.5 22.5,20.8 L25,34.1 L31.2,18.5 L37.3,18.5 Z M61.9,34 C61.9,27.9 53.5,27.6 53.6,24.9 C53.6,24.1 54.4,23.2 56.1,23 C58.1,22.8 60.1,23.1 62,24 L63,19.1 C61.2,18.4 59.3,18.1 57.4,18.1 C51.5,18.1 47.4,21.2 47.4,25.7 C47.4,29 50.4,30.9 52.6,32 C54.8,33.1 55.7,33.9 55.7,34.9 C55.7,36.4 53.8,37.1 52.2,37.1 C50.1,37.1 48,36.6 46.1,35.6 L45,40.6 C47.1,41.4 49.4,41.8 51.6,41.8 C57.8,41.8 61.9,38.7 61.9,34 L61.9,34 Z M77.5,41.5 L83,41.5 L78.2,18.5 L73.1,18.5 C72,18.5 71,19.2 70.6,20.2 L61.7,41.5 L67.9,41.5 L69.1,38.1 L76.7,38.1 L77.5,41.5 Z M70.8,33.3 L73.9,24.7 L75.7,33.3 L70.8,33.3 Z M45.8,18.5 L40.9,41.5 L35,41.5 L39.9,18.5 L45.8,18.5 Z" fill="#292D6A"></path>
    </g>
  </g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268 185.9" id="icon-cc-unionpay">
  <path d="M62 0C46.4 0 31.9 11.8 28.3 27.4L.8 146.9c-2 8.8-.2 17.7 5 24.3 5.1 6.5 13 10.3 21.7 10.3h178.4c15.6 0 30.1-11.8 33.7-27.4l27.5-119.5c2-8.8.2-17.7-5-24.3C257 3.8 249.1 0 240.4 0H62z" fill="#fff"/>
  <path d="M64.5 19.4h57c8 0 12.9 6.5 11 14.5L106 147.8c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5l26.5-114c1.9-8 9.8-14.4 17.8-14.4z" fill="#ed1c24"/>
  <path d="M116.8 19.4h57c8 0 12.9 6.5 11 14.5l-26.5 113.9c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5L99 33.8c1.8-8 9.8-14.4 17.8-14.4z" fill="#00569e"/>
  <path d="M179.7 19.4h57c8 0 12.9 6.5 11 14.5l-26.5 113.9c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5l26.5-113.9c1.9-8.1 9.9-14.5 17.8-14.5z" fill="#00898e"/>
  <path d="M170.9 126.5h5.4l1.2-5.2h-5.4l-1.2 5.2zm3.4-14.2l-1.4 6.1s2-1 3.1-1.3c1.1-.3 2.7-.5 2.7-.5l1-4.3h-5.4zm2-8.8l-1.4 5.9s1.9-.9 3-1.2c1.1-.3 2.7-.4 2.7-.4l1-4.3h-5.3zm11.9 0l-5.4 23h1.9l-1.1 4.8h-1.9l-.3 1.5h-6.6l.3-1.5h-13.4l1.1-4.4h1.4l5.5-23.3 1.1-4.7h6.7l-.5 2.4s1.7-1.3 3.4-1.7c1.7-.4 11.4-.6 11.4-.6l-1.1 4.7h-2.5zM192 98.8h7.2l.1 2.7c0 .4.3.7 1.2.7h1.2l-1.1 4.4h-3.9c-3.4.2-4.6-1.2-4.6-2.8l-.1-5z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M193.3 119.8h-6.9l.9-3.9h7.8l.9-3.6h-7.7l1-4.4h21.5l-1.1 4.4h-7.2l-.9 3.6h7.2l-.9 3.9h-7.8l-1.3 1.7h3.2l1.1 5c.1.5.1.8.3 1 .2.2 1.1.3 1.7.3h1l-1.1 4.9h-2.4c-.4 0-.9 0-1.7-.1-.7-.1-1.3-.5-1.8-.7-.5-.2-1.2-.8-1.4-1.7l-1.1-5-3.2 4.9c-1 1.5-2.5 2.7-5.1 2.7h-5l1-4.3h1.9c.6 0 1-.2 1.4-.4.4-.2.7-.4 1-.9l4.7-7.4zM117.4 109h18.2l-1 4.3h-7.3l-.9 3.7h7.4l-1.1 4.5h-7.4l-1.4 6c-.2.7 1.8.8 2.5.8l3.7-.5-1.2 4.9h-8.4c-.7 0-1.2-.1-1.9-.3-.7-.2-1-.5-1.4-1-.3-.5-.8-.9-.6-1.9l1.9-8h-4.1l1.1-4.6h4.1l.9-3.7h-4.1l1-4.2zM129.2 101.2h7.5l-1.1 4.5h-10.2l-1.1 1c-.4.5-.6.3-1.2.6s-1.7.9-3.3.9h-3.3l1-4.4h1c.8 0 1.4-.1 1.7-.3.3-.2.6-.7 1-1.4l1.7-3.4h7.4l-1.1 2.5zM143.9 108.7s1.9-1.9 5.4-2.5c.8-.1 5.7-.1 5.7-.1l.6-2.5h-10.5l-1.2 5.1zm10 1.9h-10.4l-.5 2.1h9c1.1-.1 1.3 0 1.4 0l.5-2.1zm-14.2-11.8h6.4l-.7 3.2s1.9-1.6 3.3-2.1 4.5-1 4.5-1l10.3-.1-2.8 11.7c-.5 2-1.1 3.3-1.5 3.9-.4.6-.8 1.1-1.6 1.6-.9.5-1.6.7-2.3.8-.7.1-1.7.1-3.2.1h-9.9l-2.2 9.2c-.2.9-.3 1.3-.1 1.6.2.2.5.5 1 .5l4.3-.4-1.2 5.1h-5c-1.5 0-2.7 0-3.5-.1-.8-.1-1.5 0-2.1-.4-.5-.4-1.2-.9-1.2-1.5 0-.5.2-1.3.4-2.5l7.1-29.6z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M159.3 117.6l-.4 2.8c-.2.9-.4 1.5-1 2.1-.7.6-1.4 1.2-3.3 1.2l-3.5.1.1 3.2c0 .9.3.8.4 1 .2.2.3.2.5.3h1.1l3.3-.2-1.1 4.6h-3.9c-2.7 0-4.7-.1-5.4-.6-.7-.4-.8-1-.8-1.8l-.5-12.4h6.2l.1 2.5h1.5c.5 0 .9-.1 1.1-.2.2-.1.3-.3.4-.7l.5-2h4.7z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M71.3 55.7C71 56.8 67.1 75 67.1 75c-.9 3.7-1.5 6.3-3.6 8-1.2 1-2.6 1.5-4.2 1.5-2.6 0-4.1-1.3-4.4-3.7l-.1-.8s.8-4.9.8-5c0 0 4.2-16.6 4.9-18.8 0-.1 0-.2.1-.3-8.1.1-9.5 0-9.6-.1 0 .2-.3 1.2-.3 1.2l-4.2 18.8-.4 1.6-.7 5.2c0 1.5.3 2.8.9 3.9 1.9 3.4 7.4 3.9 10.6 3.9 4 0 7.8-.9 10.3-2.4 4.4-2.6 5.6-6.7 6.6-10.3l.5-1.9s4.3-17.3 5-19.5c0-.1 0-.2.1-.3-5.9-.1-7.6-.1-8.1-.3zM94.9 90c-2.9 0-3.9 0-7.2.1l-.1-.2c.3-1.3.6-2.5.9-3.8l.4-1.7c.6-2.7 1.2-5.9 1.3-6.8.1-.6.3-2-1.4-2-.7 0-1.4.3-2.2.7-.4 1.4-1.2 5.5-1.6 7.3-.8 3.9-.9 4.3-1.3 6.3l-.2.1c-3 0-4 0-7.4.1l-.1-.2c.6-2.3 1.1-4.7 1.7-7 1.4-6.3 1.8-8.7 2.2-11.8l.3-.2c3.3-.4 4.1-.6 7.7-1.3l.3.3-.5 2c.6-.4 1.2-.7 1.8-1.1 1.7-.8 3.6-1.1 4.6-1.1 1.6 0 3.3.4 4 2.3.7 1.6.2 3.6-.7 7.6l-.5 2c-.9 4.4-1.1 5.2-1.6 8.2l-.4.2zM106.6 90h-3.9c-1.1 0-2.1.1-3.7.1l-.2-.1-.1-.1c.4-1.7.7-2.3.9-2.8.2-.6.4-1.2.8-2.9.5-2.2.8-3.7 1-5.1.2-1.3.4-2.4.5-3.7l.1-.1.1-.1c1.7-.2 2.8-.4 3.9-.6 1.1-.2 2.3-.4 4-.7l.1.1.1.2c-.3 1.4-.7 2.7-1 4.1-.3 1.4-.6 2.7-1 4.1-.7 2.9-.9 4-1.1 4.7-.2.7-.2 1.1-.4 2.6l-.2.1.1.2zM124.8 79.8c-.2.7-.8 3.5-1.7 4.7-.6.9-1.3 1.4-2.1 1.4-.2 0-1.6 0-1.7-2.1 0-1 .2-2.1.5-3.3.8-3.3 1.7-6.1 3.9-6.1 1.8 0 1.9 2.1 1.1 5.4zm7.5.4c1-4.4.2-6.5-.8-7.7-1.5-1.9-4.1-2.5-6.9-2.5-1.6 0-5.6.2-8.6 3-2.2 2-3.2 4.8-3.8 7.4-.6 2.7-1.3 7.6 3.1 9.4 1.4.6 3.4.8 4.6.8 3.3 0 6.6-.9 9.2-3.6 2-2.3 2.9-5.5 3.2-6.8zM206.8 70.1c-3.6.7-4.5.8-8 1.3l-.3.2c0 .3-.1.6-.1.8-.5-.9-1.3-1.6-2.5-2.1-1.5-.6-5.1.2-8.2 3-2.2 2-3.2 4.8-3.8 7.4-.6 2.7-1.3 7.5 3.1 9.3 1.4.6 2.7.8 4 .7 1.4-.1 2.6-.8 3.8-1.8-.1.4-.2.8-.3 1.3l.2.3c3.2-.2 4.2-.2 7.7-.1l.3-.3c.5-3 1-5.8 2.3-11.5.6-2.7 1.3-5.4 1.9-8.1l-.1-.4zm-11.3 14.8c-.6.8-2 1.4-2.8 1.4-.2 0-1.6 0-1.7-2.1 0-1 .2-2.1.5-3.3.8-3.3 1.7-6.1 3.9-6.1 1.5 0 2.2 1.4 2 3.8-.1.5-.2 1-.4 1.6-.2 1-.5 2-.8 3.1-.2.7-.4 1.2-.7 1.6zM151.9 90c-2.9 0-3.9 0-7.2.1l-.1-.2c.3-1.3.6-2.5.9-3.8l.4-1.7c.6-2.7 1.2-5.9 1.3-6.8.1-.6.2-2-1.4-2-.7 0-1.4.3-2.2.7-.4 1.4-1.2 5.5-1.6 7.3-.8 3.9-.9 4.3-1.3 6.3l-.2.3c-2.9 0-4 0-7.4.1l-.2-.3c.6-2.3 1.1-4.7 1.7-7 1.4-6.3 1.8-8.7 2.2-11.8l.3-.2c3.3-.4 4.1-.6 7.7-1.3l.3.3-.5 2c.6-.4 1.2-.7 1.8-1.1 1.7-.8 3.6-1.1 4.6-1.1 1.6 0 3.3.4 4 2.3.7 1.6.2 3.6-.7 7.6l-.5 2c-.9 4.4-1.1 5.2-1.6 8.2l-.3.1zM176.7 55.7h-2.4c-6.2.1-8.7 0-9.7-.1-.1.4-.3 1.3-.3 1.3l-2.2 10.3s-5.3 21.9-5.6 22.9c5.4-.1 7.6-.1 8.6 0 .2-1 1.5-7.1 1.5-7.1s1.1-4.5 1.1-4.6c0 0 .3-.5.7-.7h.5c4.7 0 9.9 0 14.1-3 2.8-2.1 4.7-5.1 5.6-8.9.2-.9.4-2 .4-3.1 0-1.4-.3-2.8-1.1-4-2.1-2.9-6.3-2.9-11.2-3zm3.1 10.7c-.5 2.3-2 4.2-3.9 5.1-1.6.8-3.5.9-5.5.9h-1.3l.1-.5s2.4-10.3 2.3-10.2l.1-.5.1-.4.9.1s4.9.4 5 .5c2 .6 2.8 2.5 2.2 5zM109.7 72.5c1.9-1.3 2.1-3.1.5-4.1-1.6-.9-4.4-.6-6.3.7-1.9 1.3-2.1 3.1-.5 4.1 1.6.9 4.4.6 6.3-.7z" fill="#fff"/>
  <path d="M230.7 70.1l-.3-.3c-3.5.7-4.2.8-7.4 1.3l-.3.2v.2c-2.4 5.6-2.4 4.4-4.3 8.8v-.5l-.5-9.5-.3-.3c-3.7.7-3.8.8-7.2 1.3l-.3.2v.4c.4 2.2.3 1.7.8 5.2.2 1.7.5 3.4.7 5.1.4 2.8.5 4.2.9 8.4-2.3 3.8-2.9 5.3-5.1 8.6l-1.6 2.5c-.2.3-.3.4-.6.5-.2.1-.6.2-1 .2H203l-1 4.5 4.5-.1c2.6 0 4.2-1.3 5.1-2.9l2.7-4.8 16.4-29z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M62 4.3c-15.6 0-30.1 11.8-33.7 27.4L.8 151.2c-2 8.8-.2 17.7 5 24.3 5.1 6.5 13 10.3 21.7 10.3h178.4c15.6 0 30.1-11.8 33.7-27.4l27.5-119.5c2-8.8.2-17.7-5-24.3-5.1-6.6-13-10.3-21.7-10.3H62z" fill="#fff"/>
  <path d="M64.5 23.6h57c8 0 12.9 6.5 11 14.5L106 152c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5L46.7 38.1c1.9-8 9.8-14.5 17.8-14.5z" fill="#ed1c24"/>
  <path d="M116.8 23.6h57c8 0 12.9 6.5 11 14.5L158.3 152c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5L99 38.1c1.8-8 9.8-14.5 17.8-14.5z" fill="#00569e"/>
  <path d="M179.7 23.6h57c8 0 12.9 6.5 11 14.5L221.2 152c-1.9 8-9.8 14.5-17.8 14.5h-57c-8 0-12.9-6.5-11-14.5l26.5-113.9c1.9-8 9.9-14.5 17.8-14.5z" fill="#00898e"/>
  <path d="M170.9 130.8h5.4l1.2-5.2h-5.4l-1.2 5.2zm3.4-14.2l-1.4 6.1s2-1 3.1-1.3c1.1-.3 2.7-.5 2.7-.5l1-4.3h-5.4zm2-8.8l-1.4 5.9s1.9-.9 3-1.2c1.1-.3 2.7-.4 2.7-.4l1-4.3h-5.3zm11.9 0l-5.4 23h1.9l-1.1 4.8h-1.9l-.3 1.5h-6.6l.3-1.5h-13.4l1.1-4.4h1.4l5.5-23.3 1.1-4.7h6.7l-.5 2.4s1.7-1.3 3.4-1.7c1.7-.4 11.4-.6 11.4-.6l-1.1 4.7h-2.5zM192 103.1h7.2l.1 2.7c0 .4.3.7 1.2.7h1.2l-1.1 4.4h-3.9c-3.4.2-4.6-1.2-4.6-2.8l-.1-5z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M193.3 124.1h-6.9l.9-3.9h7.8l.9-3.6h-7.7l1-4.4h21.5l-1.1 4.4h-7.2l-.9 3.6h7.2l-.9 3.9h-7.8l-1.3 1.7h3.2l1.1 5c.1.5.1.8.3 1 .2.2 1.1.3 1.7.3h1L205 137h-2.4c-.4 0-.9 0-1.7-.1-.7-.1-1.3-.5-1.8-.7-.5-.2-1.2-.8-1.4-1.7l-1.1-5-3.2 4.9c-1 1.5-2.5 2.7-5.1 2.7h-5l1-4.3h1.9c.6 0 1-.2 1.4-.4.4-.2.7-.4 1-.9l4.7-7.4zM117.4 113.3h18.2l-1 4.3h-7.3l-.9 3.7h7.4l-1.1 4.5h-7.4l-1.4 6c-.2.7 1.8.8 2.5.8l3.7-.5-1.2 4.9h-8.4c-.7 0-1.2-.1-1.9-.3-.7-.2-1-.5-1.4-1-.3-.5-.8-.9-.6-1.9l1.9-8h-4.1l1.1-4.6h4.1l.9-3.7h-4.1l1-4.2zM129.2 105.5h7.5l-1.1 4.5h-10.2l-1.1 1c-.4.5-.6.3-1.2.6s-1.7.9-3.3.9h-3.3l1-4.4h1c.8 0 1.4-.1 1.7-.3.3-.2.6-.7 1-1.4l1.7-3.4h7.4l-1.1 2.5zM143.9 113s1.9-1.9 5.4-2.5c.8-.1 5.7-.1 5.7-.1l.6-2.5h-10.5l-1.2 5.1zm10 1.9h-10.4l-.5 2.1h9c1.1-.1 1.3 0 1.4 0l.5-2.1zm-14.2-11.8h6.4l-.7 3.2s1.9-1.6 3.3-2.1 4.5-1 4.5-1l10.3-.1-2.8 11.7c-.5 2-1.1 3.3-1.5 3.9-.4.6-.8 1.1-1.6 1.6-.9.5-1.6.7-2.3.8-.7.1-1.7.1-3.2.1h-9.9l-2.2 9.2c-.2.9-.3 1.3-.1 1.6.2.2.5.5 1 .5l4.3-.4-1.2 5.1h-5c-1.5 0-2.7 0-3.5-.1-.8-.1-1.5 0-2.1-.4-.5-.4-1.2-.9-1.2-1.5 0-.5.2-1.3.4-2.5l7.1-29.6z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M159.3 121.9l-.4 2.8c-.2.9-.4 1.5-1 2.1-.7.6-1.4 1.2-3.3 1.2l-3.5.1.1 3.2c0 .9.3.8.4 1 .2.2.3.2.5.3h1.1l3.3-.2-1.1 4.6h-3.9c-2.7 0-4.7-.1-5.4-.6-.7-.4-.8-1-.8-1.8l-.5-12.4h6.2l.1 2.5h1.5c.5 0 .9 0 1.1-.2.2-.1.3-.3.4-.7l.5-2h4.7z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
  <path d="M71.3 60c-.2 1-4.2 19.3-4.2 19.3-.9 3.7-1.5 6.3-3.6 8-1.2 1-2.6 1.5-4.2 1.5-2.6 0-4.1-1.3-4.4-3.7l-.1-.8s.8-4.9.8-5c0 0 4.2-16.6 4.9-18.8 0-.1 0-.2.1-.3-8.1.1-9.5 0-9.6-.1 0 .2-.3 1.2-.3 1.2L46.5 80l-.4 1.6-.7 5.2c0 1.5.3 2.8.9 3.9 1.9 3.4 7.4 3.9 10.6 3.9 4 0 7.8-.9 10.3-2.4 4.4-2.6 5.6-6.7 6.6-10.3l.5-1.9s4.3-17.3 5-19.5c0-.1 0-.2.1-.3-5.9 0-7.6-.1-8.1-.2zM94.9 94.3c-2.9 0-3.9 0-7.2.1l-.1-.2c.3-1.3.6-2.5.9-3.8l.4-1.7c.6-2.7 1.2-5.9 1.3-6.8.1-.6.3-2-1.4-2-.7 0-1.4.3-2.2.7-.4 1.4-1.2 5.5-1.6 7.3-.8 3.9-.9 4.3-1.3 6.3l-.2.3c-3 0-4 0-7.4.1l-.1-.4c.6-2.3 1.1-4.7 1.7-7 1.4-6.3 1.8-8.7 2.2-11.8l.3-.2c3.3-.4 4.1-.6 7.7-1.3l.3.3-.5 2c.6-.4 1.2-.7 1.8-1.1 1.7-.8 3.6-1.1 4.6-1.1 1.6 0 3.3.4 4 2.3.7 1.6.2 3.6-.7 7.6l-.5 2c-.9 4.4-1.1 5.2-1.6 8.2l-.4.2zM106.6 94.3h-3.9c-1.1 0-2.1.1-3.7.1l-.1-.1-.1-.1c.4-1.7.7-2.3.9-2.8.2-.6.4-1.2.8-2.9.5-2.2.8-3.7 1-5.1.2-1.3.4-2.4.5-3.7l.1-.1.1-.1c1.7-.2 2.8-.4 3.9-.6 1.1-.2 2.3-.4 4-.7l.1.1.1.2c-.3 1.4-.7 2.7-1 4.1-.3 1.4-.6 2.7-1 4.1-.7 2.9-.9 4-1.1 4.7-.2.7-.2 1.1-.4 2.6l-.2.1v.2zM124.8 84.1c-.2.7-.8 3.5-1.7 4.7-.6.9-1.3 1.4-2.1 1.4-.2 0-1.6 0-1.7-2.1 0-1 .2-2.1.5-3.3.8-3.3 1.7-6.1 3.9-6.1 1.8 0 1.9 2.1 1.1 5.4zm7.5.3c1-4.4.2-6.5-.8-7.7-1.5-1.9-4.1-2.5-6.9-2.5-1.6 0-5.6.2-8.6 3-2.2 2-3.2 4.8-3.8 7.4-.6 2.7-1.3 7.6 3.1 9.4 1.4.6 3.4.8 4.6.8 3.3 0 6.6-.9 9.2-3.6 2-2.2 2.9-5.4 3.2-6.8zM206.8 74.4c-3.6.7-4.5.8-8 1.3l-.3.2c0 .3-.1.6-.1.8-.5-.9-1.3-1.6-2.5-2.1-1.5-.6-5.1.2-8.2 3-2.2 2-3.2 4.8-3.8 7.4-.6 2.7-1.3 7.5 3.1 9.3 1.4.6 2.7.8 4 .7 1.4-.1 2.6-.8 3.8-1.8-.1.4-.2.8-.3 1.3l.2.3c3.2-.2 4.2-.2 7.7-.1l.3-.3c.5-3 1-5.8 2.3-11.5.6-2.7 1.3-5.4 1.9-8.1l-.1-.4zm-11.3 14.8c-.6.8-2 1.4-2.8 1.4-.2 0-1.6 0-1.7-2.1 0-1 .2-2.1.5-3.3.8-3.3 1.7-6.1 3.9-6.1 1.5 0 2.2 1.4 2 3.8-.1.5-.2 1-.4 1.6-.2 1-.5 2-.8 3.1-.2.6-.4 1.2-.7 1.6zM151.9 94.3c-2.9 0-3.9 0-7.2.1l-.1-.2c.3-1.3.6-2.5.9-3.8l.4-1.7c.6-2.7 1.2-5.9 1.3-6.8.1-.6.2-2-1.4-2-.7 0-1.4.3-2.2.7-.4 1.4-1.2 5.5-1.6 7.3-.8 3.9-.9 4.3-1.3 6.3l-.2.3c-2.9 0-4 0-7.4.1l-.2-.3c.6-2.3 1.1-4.7 1.7-7 1.4-6.3 1.8-8.7 2.2-11.8l.3-.2c3.3-.4 4.1-.6 7.7-1.3l.3.3-.5 2c.6-.4 1.2-.7 1.8-1.1 1.7-.8 3.6-1.1 4.6-1.1 1.6 0 3.3.4 4 2.3.7 1.6.2 3.6-.7 7.6l-.5 2c-.9 4.4-1.1 5.2-1.6 8.2l-.3.1zM176.7 60l-2.4.1c-6.2.1-8.7 0-9.7-.1-.1.4-.3 1.3-.3 1.3l-2.2 10.3s-5.3 21.9-5.6 22.9c5.4-.1 7.6-.1 8.6 0 .2-1 1.5-7.1 1.5-7.1s1.1-4.5 1.1-4.6c0 0 .3-.5.7-.7h.5c4.7 0 9.9 0 14.1-3 2.8-2.1 4.7-5.1 5.6-8.9.2-.9.4-2 .4-3.1 0-1.4-.3-2.8-1.1-4-2.1-3-6.3-3.1-11.2-3.1zm3.1 10.7c-.5 2.3-2 4.2-3.9 5.1-1.6.8-3.5.9-5.5.9h-1.3l.1-.5s2.4-10.3 2.3-10.2l.1-.5.1-.4.9.1s4.9.4 5 .5c2 .6 2.8 2.5 2.2 5zM109.7 76.7c1.9-1.3 2.1-3.1.5-4.1-1.6-.9-4.4-.6-6.3.7-1.9 1.3-2.1 3.1-.5 4.1 1.6.9 4.4.6 6.3-.7z" fill="#fff"/>
  <path d="M230.7 74.4l-.3-.3c-3.5.7-4.2.8-7.4 1.3l-.3.2v.2c-2.4 5.6-2.4 4.4-4.3 8.8v-.5l-.5-9.5-.3-.3c-3.7.7-3.8.8-7.2 1.3l-.3.2v.4c.4 2.2.3 1.7.8 5.2.2 1.7.5 3.4.7 5.1.4 2.8.5 4.2.9 8.4-2.3 3.8-2.9 5.3-5.1 8.6l-1.6 2.5c-.2.3-.3.4-.6.5-.2.1-.6.1-1 .1H203l-1 4.5 4.5-.1c2.6 0 4.2-1.3 5.1-2.9l2.7-4.8 16.4-28.9z" fill-rule="evenodd" clip-rule="evenodd" fill="#fff"/>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" class="icon-equilizer-wrapper" viewBox="0 0 20 20" id="icon-equilizer">
  <g fill-rule="nonzero">
    <title>Audio Equilizer</title>
    <rect class="bar" transform="translate(0,0)" y="0"></rect>
    <rect class="bar" transform="translate(5,0)" y="0"></rect>
    <rect class="bar" transform="translate(10,0)" y="0"></rect>
    <rect class="bar" transform="translate(15,0)" y="0"></rect>
    <rect class="bar" transform="translate(20,0)" y="0"></rect>
  </g>
</symbol>
</div>
</div>

<symbol viewBox="0 0 31 26" xmlns="http://www.w3.org/2000/svg" id="icon-checkmark-lg">
  <path d="M10.744 16.67L25.607 0l4.48 3.995-19.093 21.414L0 14.412l4.245-4.244z" fill="#0A82F0"></path>
</symbol>

<symbol viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" id="icon-pipe">
  <title>Assets / Icons / Utility / 12px / Pipe Divider</title>
  <path fill="#D4D4D4" d="M5 0h2v12H5z"></path>
</symbol>

<symbol viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg" id="icon-checkmark-sm">
  <path d="M.685 4.991l3.382 3.382 7.248-7.247" stroke-width="2" fill="none"></path>
</symbol>

<symbol viewBox="0 0 12 10" xmlns="http://www.w3.org/2000/svg" id="icon-check-mark-flex-stroke">
  <path d="M.685 4.991l3.382 3.382 7.248-7.247" fill="none"></path>
</symbol>

<symbol viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" id="icon-dash">
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <line x1="16" y1="24" x2="32" y2="24" id="Path-14" stroke="#000000"></line>
  </g>
</symbol>

<symbol viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-x-mark-flex-stroke">
    <g id="Assets-/-Icons-/-Utility-/-12px-/-Bulleted-Features-/-Not-Included-(X)" fill="none" fill-rule="evenodd">
        <g id="Group-Copy" transform="translate(1.000000, 1.000000)" fill-rule="nonzero">
            <line x1="-0.694444444" y1="5" x2="10.6944444" y2="5" id="Path-12-Copy-5" transform="translate(5.000000, 5.000000) rotate(-45.000000) translate(-5.000000, -5.000000) "></line>
            <line x1="-0.694444444" y1="5" x2="10.6944444" y2="5" id="Path-12-Copy-6" transform="translate(5.000000, 5.000000) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -5.000000) "></line>
        </g>
    </g>
</symbol>

<symbol viewBox="0 0 14 2" xmlns="http://www.w3.org/2000/svg" id="icon-collapse">
  <path d="M0 0h14v2H0z"></path>
</symbol>

<symbol viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg" id="icon-dropdown-lg">
  <path d="M1.343 1.172L7 6.828l5.657-5.656" stroke-width="2" fill="none" fill-rule="evenodd"></path>
</symbol>

<symbol viewBox="0 0 14 9" xmlns="http://www.w3.org/2000/svg" id="icon-dropdown-sm">
  <path d="M1.343 1.172L7 6.828l5.657-5.656" stroke-width="2" fill="none" fill-rule="evenodd"></path>
</symbol>

<symbol viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" id="icon-features-all">
  <path d="M9 .515L17.485 9 9 17.485.515 9z" fill="#006ED7"></path>
</symbol>

<symbol viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" id="icon-expand">
  <path d="M0 6h14v2H0z"></path>
  <path d="M8 0v14H6V0z"></path>
</symbol>

<symbol viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" id="icon-features-some">
  <g fill="none">
    <path stroke="#006ED7" stroke-width="2" d="M9 1.929L16.071 9 9 16.071 1.929 9z"></path>
    <path fill="#006ED7" d="M9 .515v16.97L17.485 9z"></path>
  </g>
</symbol>

<symbol viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" id="icon-home">
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M42.1,41c0-1.2,0-22.8,0-25.2c0-1-12.1-3.8-14.8-3.8 s-14.8,2.8-14.8,3.8c0,3,0,25.7,0,26.9c0,1.3,0.5,2.4,1.4,3.2C15.1,47.6,23,51,27,51c2,0,5-1,5-1"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M42.1,21.3c0,1.4-12,4.1-14.8,4.1 c-2.7,0-14.8-2.7-14.8-4"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M12.5,15.8c0,0,12.1,2.9,14.8,2.9s14.8-2.8,14.8-2.9"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M55.6,46.3c0-1-0.4-1.9-1.1-2.5 c-0.9-1.4-5.3-2.4-10.6-2.4s-9.7,1-10.6,2.4c-0.7,0.6-1.1,1.5-1.1,2.5s0,3.9,0,4.9s0.4,1.9,1.1,2.5c1,1.3,5.3,2.3,10.6,2.3 s9.7-1,10.6-2.4c0.7-0.6,1.1-1.5,1.1-2.5C55.6,50.2,55.6,47.2,55.6,46.3z"/>
  <g>
    <path d="M43.9,42.4c4.5,0,7.5,0.9,8.6,1.6c-1.1,0.7-4.1,1.6-8.6,1.6s-7.5-0.9-8.6-1.6C36.5,43.3,39.4,42.4,43.9,42.4 M43.9,40.4 C37.9,40.4,33,42,33,44s4.9,3.6,10.9,3.6S54.8,46,54.8,44S50,40.4,43.9,40.4L43.9,40.4z"/>
  </g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="icon-home2">
  <g fill="none" fill-rule="evenodd" transform="translate(5.245 4.103)">
    <g transform="translate(.802 .802)"><path stroke-linecap="square" d="M.867 24.27c7.512.578 16.18.578 26.004 0"/>
    <path stroke-width="1.5" d="M24.27 3.467l2.6 20.803c.13 2.117.186 3.63.167 4.539M2.6 3.467L.173 24.27c-.578 6.935.29 11.269 2.6 13.002.722.541 1.282.867 2.601.867h7.628"/>
    <ellipse cx="13.435" cy="3.467" stroke-width="1.5" rx="10.835" ry="3.467"/>
  </g>
  <g transform="translate(13.804 29.406)">
    <path stroke-width="1.5" d="M.044 2.308v7.703c-.326 2.323 3.242 3.484 10.704 3.484 7.462 0 11.274-1.06 11.435-3.182V2.635C21.735.878 18.07 0 11.192 0 4.312 0 .596.77.044 2.308z"/>
    <path d="M0 2.352c1.127 1.795 4.743 2.692 10.847 2.692 6.105 0 9.876-.772 11.315-2.317"/>
    </g>
  </g>
</symbol>

<symbol viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" id="icon-now-playing">
<path d="M4 10.667h2V16H4v-5.333zm12 0h2V16h-2v-5.333zM0 8h2v8H0V8zm8-8h2v16H8V0zm4 3.556h2V16h-2V3.556z"></path>
</symbol>

<symbol viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg" id="icon-menu-burger">
  <path fill="none" stroke-width="2" d="M22 19H2m20-7H2m20-7H2"></path>
</symbol>

<symbol viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" id="icon-close">
<path d="M.929 15.071L15.07.93m.001 14.141L.93.93" stroke-width="2" fill="none" fill-rule="evenodd"></path>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icon-back">
<path fill="none" stroke-width="2" d="M15.397 4.75l-7.074 7.147 7.354 7.353"></path>
</symbol>

<symbol width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-menu-kebab">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle fill="#000000" cx="12" cy="12" r="2"></circle>
        <circle fill="#000000" cx="12" cy="4" r="2"></circle>
        <circle fill="#000000" cx="12" cy="20" r="2"></circle>
    </g>
</symbol>

<symbol width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-pagination-selected">
    <g id="Assets-/-Icons-/-Utility-/-12px-/-Pagination-/-Selected-/-Blue-Circle" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle fill="#006ED7" fill-rule="nonzero" cx="6" cy="6" r="5"></circle>
    </g>
</symbol>

<symbol viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-pagination-unselected">
    <g id="Assets-/-Icons-/-Utility-/-12px-/-Pagination-/-Unselected-/-Gray-Circle" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle fill="#736E7D" fill-rule="nonzero" cx="6" cy="6" r="3"></circle>
    </g>
</symbol>

<symbol viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" id="icon-remove">
  <g fill-rule="evenodd">
    <path d="M1.879.464l5.657 5.657L6.12 7.536.464 1.879z"></path>
    <path d="M.464 6.121L6.121.464 7.536 1.88 1.879 7.536z"></path>
  </g>
</symbol>

<symbol viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-play">
  <defs>
    <circle id="b" cx="24" cy="24" r="24"></circle>
    <filter x="-33.3%" y="-22.9%" width="166.7%" height="166.7%" filterUnits="objectBoundingBox" id="a">
      <feOffset dy="5" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
      <feGaussianBlur stdDeviation="4.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.921568627 0 0 0 0.285778986 0" in="shadowBlurOuter1"></feColorMatrix>
    </filter>
  </defs>
  <g >
    <g transform="translate(9 4)">
      <use fill="#000" filter="url(#a)" xlink:href="#b"></use>
      <use fill="currentColor" xlink:href="#b"></use>
    </g>
    <path d="M39.177 28L29.5 34.452V21.548z"></path>
  </g>
</symbol>

<symbol viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" id="icon-streaming">
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M61,44H47V28c0-1.1-0.9-2-2-2h-3V13 c0-1.1,0.9-2,2-2h17c1.1,0,2,0.9,2,2v29C63,43.1,62.1,44,61,44z"/>
  <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="52.5" cy="20.5" r="2.5"/>
  <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="52.5" cy="34.5" r="5.5"/>
  <g>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M33,44H5L4.7,22.1c0-1.1,0.9-2,2-2H35 c1.1,0,2,0.9,2,2V26h-2c-1.1,0-2,0.9-2,2L33,44z"/>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M33,49L3,48.9c-1.1,0-2-0.9-2-2V44h32V49z"/>
  </g>
  <path fill="none" stroke-width="2" stroke-miterlimit="10" d="M45,52H35c-1.1,0-2-0.9-2-2V28c0-1.1,0.9-2,2-2h10 c1.1,0,2,0.9,2,2v22C47,51.1,46.1,52,45,52z"/>
  <circle stroke="none" cx="40" cy="48" r="1"/>
  <g>
    <line fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" x1="38" y1="30" x2="42" y2="30"/>
  </g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="icon-streaming2">
    <g fill="none" fill-rule="evenodd" transform="translate(11 .583)">
      <path stroke-width="1.5" d="M25.25 3.942a2.65 2.65 0 0 0-2.65-2.65H3.4a2.65 2.65 0 0 0-2.65 2.65v36.533a2.65 2.65 0 0 0 2.65 2.65h19.2a2.65 2.65 0 0 0 2.65-2.65V3.942z"/>
      <path stroke-linecap="round" d="M9.75 5.959h4.333m1.625 0h.542"/>
      <ellipse cx="13" cy="37.033" rx="2.986" ry="2.965"/>
    </g>
  </symbol>

<symbol viewBox="0 0 19 15" xmlns="http://www.w3.org/2000/svg" id="icon-validate">
  <path d="M1.722 7.328l4.95 4.95L17.278 1.672" stroke="#177A31" stroke-width="3" fill="none"></path>
</symbol>

<symbol viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg" id="icon-lock">
  <g fill="none" fill-rule="evenodd">
    <path fill="currentColor" fill-rule="nonzero" d="M.5 7.435h13v8.5H.5z"></path>
    <path d="M4 9.571v-5a3 3 0 1 1 6 0v5" stroke-width="2"></path>
  </g>
</symbol>



  <symbol viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-facebook">
    <path d="M21,12 C21,7.02943359 16.9705664,3 12,3 C7.02943359,3 3,7.02943359 3,12 C3,16.4921602 6.29116992,20.2154883 10.59375,20.8906641 L10.59375,14.6015625 L8.30859375,14.6015625 L8.30859375,12 L10.59375,12 L10.59375,10.0171875 C10.59375,7.7615625 11.9373867,6.515625 13.9931836,6.515625 C14.9778574,6.515625 16.0078125,6.69140625 16.0078125,6.69140625 L16.0078125,8.90625 L14.8729336,8.90625 C13.7549121,8.90625 13.40625,9.60000586 13.40625,10.3117441 L13.40625,12 L15.9023438,12 L15.5033203,14.6015625 L13.40625,14.6015625 L13.40625,20.8906641 C17.7088301,20.2154883 21,16.4921602 21,12"></path>
  </symbol>



<symbol viewBox="0 0 14 22" xmlns="http://www.w3.org/2000/svg" id="icon-app-download">
  <g transform="translate(1 1)" fill="none" fill-rule="evenodd">
    <path d="M12 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" stroke-width="2"></path>
    <path d="M4 4h4" stroke-linecap="round"></path>
    <circle cx="6" cy="15" r="1"></circle>
  </g>
</symbol>
<symbol viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-instagram">
<path d="M11.980396,3.03457426 L11.9793267,3.03564356 L12.9976555,3.03655531 C14.5331864,3.03990482 14.8789164,3.05329426 15.6816238,3.08982178 C16.6372277,3.13330693 17.2902178,3.28514851 17.8605149,3.50685149 C18.4598631,3.7325158 19.0027489,4.08624916 19.4512871,4.54336634 C19.9081037,4.99187167 20.2615877,5.53462649 20.4870891,6.13378218 C20.7091485,6.70407921 20.8606337,7.35421782 20.9044752,8.3119604 C20.9430558,9.15477386 20.9556902,9.49273987 20.9581669,11.2236432 L20.9581533,12.8049529 C20.9563072,14.0640611 20.948995,14.5869696 20.9304236,15.1020236 L20.9229202,15.2962232 C20.917551,15.4273409 20.9114329,15.5636578 20.9044752,15.7165545 C20.8609901,16.6721584 20.7091485,17.3258614 20.4870891,17.8961584 C20.0205956,19.1025535 19.0669099,20.0562391 17.8605149,20.5227327 C17.2902178,20.7447921 16.6400792,20.8962772 15.6823366,20.9401188 C14.8395232,20.9786994 14.5015572,20.9913338 12.7706538,20.9938105 L11.1893441,20.9937969 C9.93023593,20.9919508 9.40732739,20.9846386 8.89227344,20.9660671 L8.69807384,20.9585638 C8.56695617,20.9531946 8.43063921,20.9470764 8.27774257,20.9401188 C7.32213861,20.8966337 6.66843564,20.7447921 6.09813861,20.5227327 C5.49869541,20.2972187 4.95568652,19.943606 4.5070099,19.4865743 C4.05019332,19.0380689 3.69670934,18.4953141 3.47120792,17.8961584 C3.24950495,17.3258614 3.0980198,16.6750099 3.05417822,15.7172673 C3.01735129,14.9127636 3.00416545,14.5682551 3.00088875,13.0331611 L3.00091175,10.9966415 C3.00426126,9.46111062 3.01765069,9.11538059 3.05417822,8.31267327 C3.09766337,7.35706931 3.24950495,6.70407921 3.47120792,6.13378218 C3.69661755,5.53437148 4.05010683,4.99136525 4.5070099,4.54265347 C4.95572168,4.08575039 5.49872792,3.73226111 6.09813861,3.50685149 C6.66843564,3.28514851 7.32035644,3.13259406 8.27809901,3.08875248 C9.08260277,3.05192554 9.42711122,3.03873971 10.9622052,3.03546301 L11.980396,3.03457426 Z M11.980396,4.65243564 C11.7885766,4.65243564 11.6102847,4.65249495 11.4440987,4.65262617 L10.9804373,4.65324811 C9.4747852,4.65626804 9.14710337,4.66860356 8.35188119,4.70483168 C7.47647525,4.74475248 7.0009901,4.89089109 6.68447525,5.01386139 C6.29404171,5.15759386 5.94081778,5.38706761 5.65081188,5.68538614 C5.35249335,5.97539204 5.1230196,6.32861597 4.97928713,6.7190495 C4.85631683,7.03556436 4.71017822,7.5110495 4.67025743,8.38645545 C4.63402931,9.18197703 4.62169378,9.50945527 4.61867385,11.0150346 L4.61805191,11.4786793 C4.6179207,11.6448612 4.61786139,11.8231509 4.61786139,12.0149703 L4.61790744,12.2927315 C4.61793867,12.3820552 4.6179863,12.4681746 4.61805191,12.5512676 L4.61867385,13.014929 C4.62169378,14.5205811 4.63402931,14.848263 4.67025743,15.6434851 C4.71017822,16.5188911 4.85631683,16.9943762 4.97928713,17.3108911 C5.1230196,17.7013246 5.35249335,18.0545486 5.65081188,18.3445545 C5.94081778,18.642873 6.29404171,18.8723467 6.68447525,19.0160792 C7.0009901,19.1390495 7.47647525,19.2851881 8.35188119,19.3251089 C9.14710337,19.361337 9.4747852,19.3736726 10.9804373,19.3766925 L12.9803548,19.3766925 C14.4860069,19.3736726 14.8136887,19.361337 15.6089109,19.3251089 C16.4843168,19.2851881 16.959802,19.1390495 17.2763168,19.0160792 C18.0593927,18.7139839 18.6783404,18.0950363 18.9804356,17.3119604 C19.1034059,16.9954455 19.2495446,16.5199604 19.2894653,15.6445545 C19.2963659,15.4930265 19.3023997,15.3584798 19.3076673,15.2295382 L19.3150068,15.0389076 C19.3319819,14.5657309 19.3388918,14.0913891 19.3410489,13.0159753 L19.3410489,11.0160809 C19.338029,9.51042877 19.3256935,9.18274693 19.2894653,8.38752475 C19.2495446,7.51211881 19.1034059,7.03663366 18.9804356,6.72011881 C18.8367032,6.32968528 18.6072294,5.97646135 18.3089109,5.68645545 C18.018905,5.38813692 17.6656811,5.15866316 17.2752475,5.01493069 C16.9587327,4.8919604 16.4832475,4.74582178 15.6078416,4.70590099 C14.81232,4.66967287 14.4848418,4.65733735 12.9792625,4.65431742 L12.5156178,4.65369548 C12.3494358,4.65356426 12.1711461,4.65350495 11.9793267,4.65350495 L11.9793267,4.65350495 Z M11.9793267,7.40411881 C13.2022006,7.40411881 14.3749887,7.88990356 15.2396911,8.75460594 C16.1043935,9.61930833 16.5901782,10.7920965 16.5901782,12.0149703 C16.5901782,14.5614733 14.5258297,16.6258218 11.9793267,16.6258218 C9.43282377,16.6258218 7.36847525,14.5614733 7.36847525,12.0149703 C7.36847525,9.46846734 9.43282377,7.40411881 11.9793267,7.40411881 Z M11.9793267,9.02091089 C10.3257534,9.02091089 8.98526733,10.3613969 8.98526733,12.0149703 C8.98526733,13.6685436 10.3257534,15.0090297 11.9793267,15.0090297 C12.7734007,15.0090297 13.5349514,14.6935851 14.0964464,14.13209 C14.6579415,13.5705949 14.9733861,12.8090442 14.9733861,12.0149703 C14.9733861,10.3613969 13.6329001,9.02091089 11.9793267,9.02091089 Z M16.7726733,6.14411881 C17.3677628,6.14411881 17.8501782,6.62653421 17.8501782,7.22162376 C17.8501782,7.81671331 17.3677628,8.29912871 16.7726733,8.29912871 C16.1775837,8.29912871 15.6951683,7.81671331 15.6951683,7.22162376 C15.6951683,6.62653421 16.1775837,6.14411881 16.7726733,6.14411881 Z"></path>
</symbol>

<symbol viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-youtube">
<path d="M22.5635382,6.34963455 C22.3105398,5.40990108 21.5764943,4.67585559 20.6367608,4.42285714 C18.9360299,3.96 12.1205482,3.96 12.1205482,3.96 C12.1205482,3.96 5.30327243,3.96 3.60612957,4.41568106 C2.66457337,4.66996331 1.93013245,5.40713958 1.67935216,6.34963455 C1.2236711,8.04857143 1.2236711,11.5953488 1.2236711,11.5953488 C1.2236711,11.5953488 1.2236711,15.1421262 1.67935216,16.8410631 C1.9323506,17.7807966 2.66639609,18.5148421 3.60612957,18.7678405 C5.30506645,19.2235216 12.1205482,19.2235216 12.1205482,19.2235216 C12.1205482,19.2235216 18.9378239,19.2235216 20.6349668,18.7678405 C21.5753907,18.5153958 22.3102184,17.7812517 22.5635382,16.8410631 C23.0192193,15.1421262 23.0192193,11.5953488 23.0192193,11.5953488 C23.0192193,11.5953488 23.0120432,8.04857143 22.5635382,6.34963455 Z M9.94260797,14.8640532 L9.94260797,8.32664452 L15.6045349,11.5953488 L9.94260797,14.8640532 Z"></path>
</symbol>

<symbol viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="icon-twitter">
<path d="M8.3808,20.3808 C15.7362,20.3808 19.761,14.2812 19.761,9.0006 C19.761,8.829 19.761,8.6574 19.7532,8.4858 C20.5332,7.9242 21.2118,7.2144 21.75,6.411 C21.0324,6.7308 20.2602,6.9414 19.449,7.0428 C20.2758,6.5514 20.9076,5.7636 21.2118,4.8276 C20.4396,5.2878 19.5816,5.6154 18.669,5.7948 C17.9358,5.0148 16.8984,4.5312 15.7518,4.5312 C13.5444,4.5312 11.7504,6.3252 11.7504,8.5326 C11.7504,8.8446 11.7894,9.1488 11.8518,9.4452 C8.529,9.2814 5.5806,7.6824 3.6072,5.2644 C3.264,5.8572 3.069,6.5436 3.069,7.2768 C3.069,8.6652 3.7788,9.8898 4.8474,10.6074 C4.1922,10.584 3.576,10.4046 3.0378,10.1082 C3.0378,10.1238 3.0378,10.1394 3.0378,10.1628 C3.0378,12.0972 4.4184,13.7196 6.2436,14.0862 C5.9082,14.1798 5.5572,14.2266 5.1906,14.2266 C4.9332,14.2266 4.6836,14.2032 4.4418,14.1564 C4.9488,15.7476 6.4308,16.902 8.178,16.9332 C6.8052,18.0096 5.0814,18.6492 3.2094,18.6492 C2.8896,18.6492 2.5698,18.6336 2.2578,18.5946 C4.0206,19.7178 6.1266,20.3808 8.3808,20.3808" ></path>
</symbol>

<symbol viewBox="0 0 26 44" xmlns="http://www.w3.org/2000/svg" id="icon-smart-phone">
  <g transform="translate(0 -.417)" stroke="#000" fill="none" fill-rule="evenodd">
    <path d="M25.25 3.942a2.65 2.65 0 0 0-2.65-2.65H3.4a2.65 2.65 0 0 0-2.65 2.65v36.533a2.65 2.65 0 0 0 2.65 2.65h19.2a2.65 2.65 0 0 0 2.65-2.65V3.942z" stroke-width="1.5"></path>
    <path d="M9.75 5.958h4.333m1.625 0h.542" stroke-linecap="round"></path>
    <ellipse cx="13" cy="37.033" rx="2.986" ry="2.965"></ellipse>
  </g>
</symbol>


<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icon-tool-tip">
  <g fill-rule="evenodd" transform="translate(4 4)">
    <circle cx="8" cy="8" r="7.5" fill="currentColor" fill-rule="nonzero" stroke="#736E7D"/>
    <path fill="none" d="M8 10V8.602c0-.366.405-.688.54-.772.793-.492 1.46-.974 1.46-1.872C10 4.877 9.105 4 8 4s-2 .877-2 1.958"/>
    <circle cx="8" cy="11.75" r="1" fill="inherit" stroke="none"/>
  </g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icon-search">
<g fill="none" fill-rule="evenodd" stroke-width="2">
<path d="M13.778 15.556a5.778 5.778 0 1 0 0-11.556 5.778 5.778 0 0 0 0 11.556z"></path>
<path stroke-linecap="square" d="M7.556 16.444L4 20"></path>
</g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="icon-account">
<path fill="none" stroke-width="2" d="M16.118 8.118a4.118 4.118 0 1 1-8.236 0 4.118 4.118 0 0 1 8.236 0zm3.432 12.79c0-3.196-2.251-5.559-7.487-5.559-5.235.001-7.613 2.461-7.613 5.561"></path>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 26" id="icon-logo-short">
<g>
  <path fill="currentColor" d="M82.013 2.122a19.068 19.068 0 0 1 3.34 10.815c0 3.894-1.162 7.643-3.356 10.838a1.225 1.225 0 0 0 .316 1.705 1.224 1.224 0 0 0 1.706-.314 21.512 21.512 0 0 0 3.785-12.23c0-4.381-1.303-8.6-3.768-12.203a1.228 1.228 0 0 0-2.023 1.389"></path>
  <path fill="currentColor" d="M78.125 22.12a1.23 1.23 0 0 0 1.72-.245 14.698 14.698 0 0 0 2.963-8.895c0-3.267-1.04-6.365-3.012-8.958a1.228 1.228 0 1 0-1.956 1.485 12.25 12.25 0 0 1 2.513 7.474c0 2.702-.853 5.269-2.471 7.423a1.225 1.225 0 0 0 .243 1.715"></path>
  <path fill="currentColor" d="M73.757 19.116a1.23 1.23 0 0 0 1.726-.189 9.643 9.643 0 0 0 2.117-6.022 9.522 9.522 0 0 0-2.036-5.92 1.226 1.226 0 0 0-1.723-.211 1.224 1.224 0 0 0-.21 1.722 7.09 7.09 0 0 1 1.517 4.41 7.078 7.078 0 0 1-1.577 4.482 1.228 1.228 0 0 0 .186 1.728M5.914 23.775a19.043 19.043 0 0 1-3.356-10.838c0-3.884 1.154-7.624 3.34-10.815A1.228 1.228 0 1 0 3.872.733 21.499 21.499 0 0 0 .1 12.937c0 4.394 1.312 8.621 3.791 12.23.383.558 1.148.7 1.707.313.558-.382.7-1.145.316-1.705 0 0 .384.56 0 0 0 0 .384.56 0 0"></path>
  <path fill="currentColor" d="M10.067 5.505a1.23 1.23 0 0 0-.234-1.72 1.23 1.23 0 0 0-1.72.236 14.684 14.684 0 0 0-3.012 8.958c0 3.238 1.025 6.315 2.964 8.895a1.226 1.226 0 1 0 1.962-1.472 12.275 12.275 0 0 1-2.473-7.423c.002-2.726.87-5.31 2.513-7.474"></path>
  <path fill="currentColor" d="M10.308 12.907a9.64 9.64 0 0 0 2.12 6.022 1.228 1.228 0 1 0 1.911-1.54 7.084 7.084 0 0 1-1.575-4.482c0-1.615.524-3.141 1.518-4.41a1.228 1.228 0 0 0-1.934-1.511 9.509 9.509 0 0 0-2.04 5.92s0-2.17 0 0c0 0 0-2.17 0 0"></path>
  <path d="M22.154 15.63c0 .568.216 1.001.595 1.3.352.27.84.432 1.381.432.866 0 1.786-.27 1.786-1.272 0-2.274-8.688-.46-8.688-5.954 0-3.628 3.762-4.684 6.713-4.684 3.086 0 6.713.704 7.038 4.467h-5.116c-.055-.46-.243-.785-.542-1.03-.298-.243-.703-.351-1.136-.351-.974 0-1.597.298-1.597 1.001 0 1.976 8.96.65 8.96 5.956 0 2.95-2.437 4.953-7.634 4.953-3.248 0-6.82-1.001-7.117-4.817h5.357v-.002z"></path>
  <path d="M35.987 12.624l-4.682-6.766h6.253l1.786 3.545 1.895-3.545h6.171l-4.845 6.74 4.898 7.444h-6.279l-2.002-4.061-2.057 4.061h-6.226zm11.829-6.766h5.171v2.11c.704-1.082 1.984-2.514 4.015-2.514 2.347 0 3.767 1.08 4.444 2.597 1.22-1.705 2.286-2.594 4.34-2.595 3.568-.002 5.324 2.325 5.324 6.195v8.392h-5.63v-7.226c0-2.085-.135-2.923-1.623-2.92-1.581.005-1.571 1.431-1.571 3.137v7.01h-5.63v-7.226c0-2.085-.124-2.884-1.624-2.922-1.545-.039-1.585 1.434-1.585 3.139v7.01h-5.63V5.858zM70.91 3.314c-.834 0-1.514.677-1.514 1.51v.008c0 .828.674 1.501 1.506 1.501.834 0 1.514-.677 1.514-1.51v-.008a1.507 1.507 0 0 0-1.506-1.501m-.01 2.823c-.73 0-1.3-.573-1.3-1.304v-.008c0-.736.574-1.313 1.308-1.313.728 0 1.3.573 1.3 1.304v.008c0 .736-.574 1.313-1.308 1.313"></path>
  <path d="M71.598 4.505v-.008a.432.432 0 0 0-.128-.324c-.106-.108-.267-.169-.472-.169h-.693v1.555h.295V5.02h.325l.378.538h.353l-.419-.587c.213-.062.361-.217.361-.467m-.612.257H70.6V4.27h.386c.194 0 .307.086.307.242v.008c.002.147-.113.241-.307.241"></path>
</g>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" id="equalizer-bar" viewbox="0 0 2 16">
<g>
<rect class="bar" rx=".5" ry=".5" height="16" width="2"></rect>
</g>
</symbol>






<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 26" id="icon-logo">
<g>
  <path fill="currentColor" d="M129.08 2.099a19.108 19.108 0 0 1 3.35 10.847c0 3.908-1.159 7.663-3.364 10.86-.391.558-.237 1.326.321 1.717.558.39 1.326.251 1.703-.321a21.556 21.556 0 0 0 3.797-12.256c0-4.397-1.312-8.627-3.783-12.243-.377-.558-1.145-.697-1.717-.32a1.259 1.259 0 0 0-.307 1.716"></path>
  <path fill="currentColor" d="M125.185 22.145a1.245 1.245 0 0 0 1.731-.251 14.741 14.741 0 0 0 2.973-8.92c0-3.28-1.046-6.38-3.015-8.976-.405-.545-1.186-.642-1.73-.237a1.242 1.242 0 0 0-.238 1.73 12.319 12.319 0 0 1 2.527 7.497c0 2.708-.852 5.276-2.485 7.44a1.213 1.213 0 0 0 .237 1.717"></path>
  <path fill="currentColor" d="M120.802 19.13c.53.432 1.312.335 1.731-.196a9.689 9.689 0 0 0 2.122-6.044c0-2.178-.712-4.23-2.038-5.933a1.227 1.227 0 0 0-1.731-.21 1.238 1.238 0 0 0-.21 1.732 7.143 7.143 0 0 1 1.522 4.425 7.09 7.09 0 0 1-1.577 4.495 1.223 1.223 0 0 0 .181 1.73M5.918 23.807a19.06 19.06 0 0 1-3.364-10.86c0-3.895 1.158-7.65 3.35-10.847A1.249 1.249 0 0 0 5.583.382 1.217 1.217 0 0 0 3.88.703 21.604 21.604 0 0 0 .097 12.946c0 4.41 1.312 8.64 3.797 12.256.39.558 1.159.698 1.717.32.558-.39.698-1.158.307-1.716 0 0 .39.558 0 0 0 0 .39.558 0 0z"></path>
  <path fill="currentColor" d="M10.092 5.491a1.242 1.242 0 0 0-.238-1.73 1.242 1.242 0 0 0-1.73.237c-1.983 2.596-3.017 5.71-3.017 8.976a14.74 14.74 0 0 0 2.974 8.92 1.228 1.228 0 0 0 1.717.25 1.213 1.213 0 0 0 .237-1.716 12.326 12.326 0 0 1-2.485-7.44c.014-2.736.88-5.333 2.54-7.497z"></path>
  <path fill="currentColor" d="M10.329 12.904a9.69 9.69 0 0 0 2.122 6.044c.433.53 1.2.614 1.73.196.531-.433.615-1.2.182-1.731a7.114 7.114 0 0 1-1.577-4.495c0-1.62.53-3.155 1.521-4.425a1.24 1.24 0 0 0-.209-1.731 1.24 1.24 0 0 0-1.73.21c-1.341 1.702-2.039 3.754-2.039 5.932 0 0 0-2.178 0 0 0 0 0-2.178 0 0z"></path>
  <path d="M22.208 15.64c0 .572.224 1.005.6 1.298.35.265.838.433 1.383.433.865 0 1.786-.265 1.786-1.27 0-2.276-8.71-.461-8.71-5.975 0-3.643 3.769-4.69 6.728-4.69 3.1 0 6.728.712 7.063 4.48h-5.123a1.532 1.532 0 0 0-.544-1.032c-.293-.252-.712-.35-1.145-.35-.977 0-1.605.294-1.605 1.006 0 1.982 8.976.656 8.976 5.974 0 2.96-2.443 4.97-7.65 4.97-3.252 0-6.84-1.005-7.133-4.83h5.374v-.014zM32.566 5.45h4.579v2.191h-4.579zm0 14.685V8.576h4.579v11.559zM38.373 8.59h4.174v2.332h.042c.642-1.801 1.759-2.667 3.545-2.667.196 0 .391.042.6.07v4.579c-.306-.042-.641-.126-.949-.126-1.87 0-2.82.88-2.82 3.378v3.993h-4.592V8.59zm9.325-3.14h4.592v2.191h-4.592zm0 14.685V8.576h4.592v11.559zm18.272 0h-4.257v-1.703c-1.145 1.591-2.276 2.024-4.16 2.024-2.513 0-4.146-1.536-4.146-4.844V8.575h4.579v6.24c0 1.592.558 2.094 1.647 2.094 1.326 0 1.745-.991 1.745-2.778V8.576h4.578v11.559h.014zm4.858-3.588c0 .46.182.81.489 1.061.293.223.684.349 1.13.349.712 0 1.452-.223 1.452-1.033 0-1.857-7.077-.377-7.077-4.844 0-2.96 3.07-3.81 5.472-3.81 2.513 0 5.472.572 5.737 3.643h-4.16c-.042-.377-.195-.642-.446-.838-.238-.195-.573-.279-.922-.279-.795 0-1.298.237-1.298.81 0 1.605 7.3.53 7.3 4.843 0 2.401-1.981 4.035-6.211 4.035-2.652 0-5.556-.81-5.793-3.923h4.327v-.014z"></path>
  <path d="M82.931 12.625l-4.69-6.785h6.267l1.787 3.56 1.898-3.56h6.184l-4.857 6.757 4.913 7.468h-6.295l-2.011-4.076-2.066 4.076h-6.239zM94.797 5.84h5.178v2.122c.712-1.089 1.982-2.526 4.02-2.526 2.36 0 3.783 1.088 4.453 2.596 1.229-1.703 2.29-2.596 4.355-2.596 3.574 0 5.347 2.33 5.347 6.211v8.418h-5.64V12.82c0-2.094-.14-2.931-1.633-2.931-1.591 0-1.577 1.437-1.577 3.14v7.036h-5.64V12.82c0-2.094-.125-2.89-1.633-2.931-1.55-.042-1.591 1.437-1.591 3.14v7.036h-5.64V5.84zm23.157-2.554c-.837 0-1.521.684-1.521 1.521v.014a1.51 1.51 0 0 0 1.507 1.508c.838 0 1.522-.684 1.522-1.508v-.014c0-.837-.684-1.521-1.508-1.521zm-.014 2.834a1.29 1.29 0 0 1-1.298-1.313v-.012c0-.74.573-1.313 1.312-1.313a1.29 1.29 0 0 1 1.299 1.313v.013c0 .74-.573 1.313-1.313 1.313z"></path>
  <path d="M118.638 4.486a.453.453 0 0 0-.125-.335c-.112-.111-.265-.167-.475-.167h-.698v1.563h.293v-.544h.335l.377.544h.35l-.42-.586c.21-.07.363-.223.363-.475zm-.614.252h-.39v-.489h.39c.196 0 .307.084.307.237V4.5c0 .154-.111.238-.307.238z"></path>
</g>
</symbol>

<symbol viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" id="icon-audio-clip">
<path d="M15.462 6.751l.267.03A2 2 0 0 1 17.5 8.77v4.05a2 2 0 0 1-1.77 1.987l-4.23.488v-9l1.95.225C13.27 4.274 11.35 2.5 9 2.5S4.73 4.274 4.55 6.519l1.95-.225v9l-4.23-.488A2 2 0 0 1 .5 12.819v-4.05a2 2 0 0 1 1.77-1.987l.268-.031C2.598 3.285 5.472.5 9 .5c3.528 0 6.402 2.785 6.462 6.251zM13.5 8.538v4.512l2-.231v-4.05l-2-.231zm-9 0l-2 .23v4.051l2 .23v-4.51z"
  fill="#736E7D"></path>
</symbol>

<symbol viewBox="0 0 18 10" xmlns="http://www.w3.org/2000/svg" id="icon-video-clip">
<path d="M2.5.75h6.625a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2H2.5a2 2 0 0 1-2-2v-4.5a2 2 0 0 1 2-2zm9.688 2.125L17.5.75v8.5l-5.313-2.125v-4.25z" fill="#736E7D"></path>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" id="icon-hp-pause">
<path d="M18 1.29c9.22 0 16.71 7.5 16.71 16.71S27.22 34.71 18 34.71 1.29 27.22 1.29 18 8.78 1.29 18 1.29M18 0C8.06 0 0 8.06 0 18s8.06 18 18 18 18-8.06 18-18S27.94 0 18 0z"></path>
<path d="M12.86 11.57h2.57v12.86h-2.57zm7.71 0h2.57v12.86h-2.57z"></path>
</symbol>

<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" id="icon-hp-play">
<path d="M18 1.29c9.22 0 16.71 7.5 16.71 16.71S27.22 34.71 18 34.71 1.29 27.22 1.29 18 8.78 1.29 18 1.29M18 0C8.06 0 0 8.06 0 18s8.06 18 18 18 18-8.06 18-18S27.94 0 18 0z"></path>
<path d="M14.14 10.29v15.42l10.29-8.35z"></path>
</symbol>

<symbol id="icon-pandora" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="custom-stations-3" transform="translate(6.000000, 8.000000)" stroke="none" stroke-width="1" fill-rule="nonzero">
    <path d="M10.5,8.49745 C10.5,8.9122 10.1625,9.2497 9.74775,9.2497 L6.75225,9.2497 C6.3375,9.2497 6,8.9122 6,8.49745 L6,2.5027 C6,2.08795 6.3375,1.7497 6.75225,1.7497 L9.74775,1.7497 C10.1625,1.7497 10.5,2.08795 10.5,2.5027 L10.5,8.49745 Z M12,4.7497 L12,2.5027 C12,1.2607 10.98975,0.2497 9.74775,0.2497 L6.75225,0.2497 C5.51025,0.2497 4.5,1.2607 4.5,2.5027 L4.5,4.7497 L0,4.7497 L0,6.2497 L4.5,6.2497 L4.5,8.49745 C4.5,9.73945 5.51025,10.7497 6.75225,10.7497 L9.74775,10.7497 C10.98975,10.7497 12,9.73945 12,8.49745 L12,6.2497 L36,6.2497 L36,4.7497 L12,4.7497 Z"></path>
    <path d="M30,18.2482 C30,18.66295 29.66325,18.9997 29.2485,18.9997 L26.2515,18.9997 C25.83675,18.9997 25.5,18.66295 25.5,18.2482 L25.5,12.25195 C25.5,11.8372 25.83675,11.4997 26.2515,11.4997 L29.2485,11.4997 C29.66325,11.4997 30,11.8372 30,12.25195 L30,18.2482 Z M31.5,12.25195 C31.5,11.00995 30.48975,9.9997 29.2485,9.9997 L26.2515,9.9997 C25.01025,9.9997 24,11.00995 24,12.25195 L24,14.4997 L0,14.4997 L0,15.9997 L24,15.9997 L24,18.2482 C24,19.4902 25.01025,20.4997 26.2515,20.4997 L29.2485,20.4997 C30.48975,20.4997 31.5,19.4902 31.5,18.2482 L31.5,15.9997 L36,15.9997 L36,14.4997 L31.5,14.4997 L31.5,12.25195 Z" ></path>
    <path d="M18,28.00255 C18,28.4143 17.66475,28.7503 17.253,28.7503 L14.247,28.7503 C13.83525,28.7503 13.5,28.4143 13.5,28.00255 L13.5,21.9973 C13.5,21.58555 13.83525,21.2503 14.247,21.2503 L17.253,21.2503 C17.66475,21.2503 18,21.58555 18,21.9973 L18,28.00255 Z M19.5,21.9973 C19.5,20.7583 18.492,19.7503 17.253,19.7503 L14.247,19.7503 C13.008,19.7503 12,20.7583 12,21.9973 L12,24.2503 L0,24.2503 L0,25.7503 L12,25.7503 L12,28.00255 C12,29.24155 13.008,30.2503 14.247,30.2503 L17.253,30.2503 C18.492,30.2503 19.5,29.24155 19.5,28.00255 L19.5,25.7503 L36,25.7503 L36,24.2503 L19.5,24.2503 L19.5,21.9973 Z" ></path>
  </g>
</symbol>

<symbol id="icon-pandora-basic" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="custom-stations-2" transform="translate(6.000000, 8.000000)" stroke="none" stroke-width="1" fill-rule="nonzero">
    <path d="M10.5,8.49745 C10.5,8.9122 10.1625,9.2497 9.74775,9.2497 L6.75225,9.2497 C6.3375,9.2497 6,8.9122 6,8.49745 L6,2.5027 C6,2.08795 6.3375,1.7497 6.75225,1.7497 L9.74775,1.7497 C10.1625,1.7497 10.5,2.08795 10.5,2.5027 L10.5,8.49745 Z M12,4.7497 L12,2.5027 C12,1.2607 10.98975,0.2497 9.74775,0.2497 L6.75225,0.2497 C5.51025,0.2497 4.5,1.2607 4.5,2.5027 L4.5,4.7497 L0,4.7497 L0,6.2497 L4.5,6.2497 L4.5,8.49745 C4.5,9.73945 5.51025,10.7497 6.75225,10.7497 L9.74775,10.7497 C10.98975,10.7497 12,9.73945 12,8.49745 L12,6.2497 L36,6.2497 L36,4.7497 L12,4.7497 Z" ></path>
    <path d="M30,18.2482 C30,18.66295 29.66325,18.9997 29.2485,18.9997 L26.2515,18.9997 C25.83675,18.9997 25.5,18.66295 25.5,18.2482 L25.5,12.25195 C25.5,11.8372 25.83675,11.4997 26.2515,11.4997 L29.2485,11.4997 C29.66325,11.4997 30,11.8372 30,12.25195 L30,18.2482 Z M31.5,12.25195 C31.5,11.00995 30.48975,9.9997 29.2485,9.9997 L26.2515,9.9997 C25.01025,9.9997 24,11.00995 24,12.25195 L24,14.4997 L0,14.4997 L0,15.9997 L24,15.9997 L24,18.2482 C24,19.4902 25.01025,20.4997 26.2515,20.4997 L29.2485,20.4997 C30.48975,20.4997 31.5,19.4902 31.5,18.2482 L31.5,15.9997 L36,15.9997 L36,14.4997 L31.5,14.4997 L31.5,12.25195 Z" ></path>
    <path d="M18,28.00255 C18,28.4143 17.66475,28.7503 17.253,28.7503 L14.247,28.7503 C13.83525,28.7503 13.5,28.4143 13.5,28.00255 L13.5,21.9973 C13.5,21.58555 13.83525,21.2503 14.247,21.2503 L17.253,21.2503 C17.66475,21.2503 18,21.58555 18,21.9973 L18,28.00255 Z M19.5,21.9973 C19.5,20.7583 18.492,19.7503 17.253,19.7503 L14.247,19.7503 C13.008,19.7503 12,20.7583 12,21.9973 L12,24.2503 L0,24.2503 L0,25.7503 L12,25.7503 L12,28.00255 C12,29.24155 13.008,30.2503 14.247,30.2503 L17.253,30.2503 C18.492,30.2503 19.5,29.24155 19.5,28.00255 L19.5,25.7503 L36,25.7503 L36,24.2503 L19.5,24.2503 L19.5,21.9973 Z" ></path>
  </g>
</symbol>


// Genres

<symbol id="icon-genre-twothousands" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g >
    <path class="cls-1" d="M43,21s-2-4-6.15-4H12.18C8.08,17,6,21,6,21l-1,.5V23l1,1s0,7,6.15,7c8.21,0,9.58-4,10.5-6.67C23.13,23,23.47,22,24.5,22s1.3,1,1.75,2.28C27.16,27,28.55,31,36.82,31,43,31,43,24,43,24l1-1V21.5ZM11.35,18.62a5.3,5.3,0,0,1,.91-.09h7.45a2.6,2.6,0,0,1,.64.09,1.93,1.93,0,0,1,1.19.82H9.36A4.82,4.82,0,0,1,11.35,18.62Zm0,11.05h2.95a10.76,10.76,0,0,0,3.51-.83H9.38A4.18,4.18,0,0,0,11.3,29.67ZM19.13,28H8.55a5.92,5.92,0,0,1-.49-.82h11.8A4.62,4.62,0,0,1,19.13,28ZM7.71,26.26H20.38c.13-.28.24-.55.35-.83H7.49A7.93,7.93,0,0,0,7.71,26.26Zm13.34-1.71H7.35a5.66,5.66,0,0,1,0-.65v-.17h14C21.22,24,21.14,24.29,21.05,24.55ZM7.42,22.85H21.53c.06-.28.12-.55.17-.82H7.57Zm14.4-1.7h-14a5.16,5.16,0,0,1,.58-.83H21.83s0,.05,0,.07h0a.81.81,0,0,1,0,.16Q21.85,20.82,21.82,21.15Zm7.45-2.62a2.6,2.6,0,0,0-.64.09,2,2,0,0,0-1.2.82H39.62a4.82,4.82,0,0,0-2-.82,5.1,5.1,0,0,0-.91-.09Zm-2.14,2a.81.81,0,0,1,0-.16v-.07H40.57a5.35,5.35,0,0,1,.59.83h-14Q27.13,20.82,27.13,20.55ZM41.41,22H27.28c0,.27.11.54.17.82H41.57Zm-3.62,7.64a6.3,6.3,0,0,1-1,.08c-.76,0-1.44,0-2.06-.08h0a10.76,10.76,0,0,1-3.51-.83h8.39a4.17,4.17,0,0,1-1.93.83ZM29.85,28H40.43a5.08,5.08,0,0,0,.49-.82H29.12A4.62,4.62,0,0,0,29.85,28Zm11.43-1.7H28.6c-.13-.27-.24-.55-.35-.83H41.5C41.44,25.69,41.37,26,41.28,26.26Zm.36-1.71a5.66,5.66,0,0,0,0-.65v-.17h-14c.08.29.17.56.26.82Z"/>
  </g>
</symbol>

<symbol id="icon-genre-tens" width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M38 6a6 6 0 016 6v20a6 6 0 01-6 6H20.333L13 44v-6h-3a6 6 0 01-6-6V12a6 6 0 016-6h28zm-13.89 5h-3.96l-.75 4.38h-3.3v3.84h2.64l-.78 4.44h-2.91v3.84h2.25l-.75 4.5h3.96l.78-4.5h4.32l-.75 4.5h3.96l.75-4.5h3.33v-3.84h-2.67l.78-4.44h2.94v-3.84h-2.28l.75-4.38h-3.96l-.75 4.38h-4.35l.75-4.38zm3.03 8.1l-.78 4.68h-4.53l.78-4.68h4.53z" />
</symbol>

<symbol id="icon-genre-fifties_sixties" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g>
    <g >
      <path class="cls-1" d="M32.89,30.64a6.68,6.68,0,0,0,5-2.27,15.42,15.42,0,0,0,3.29-6.68l.21-.45L41.6,21a1.61,1.61,0,0,0,.51-.59,12.6,12.6,0,0,0,.4-1.69,7.14,7.14,0,0,0,.17-1.23,11.83,11.83,0,0,0-2.8-.16c-1.61,0-3.32.07-4.6.2-2.06.2-4.77,1.16-8.28,2.9-2.38,1.18-2.67,1.16-3,1.16s-.62,0-3-1.16-5.54-2.63-8.28-2.9c-1.27-.13-3-.2-4.6-.2a13.27,13.27,0,0,0-2.8.15,6.3,6.3,0,0,0,.17,1.24,13.45,13.45,0,0,0,.4,1.69,1.68,1.68,0,0,0,.5.59c.09.08.21.19.36.35l.08.29a15.34,15.34,0,0,0,3.29,6.69,6.64,6.64,0,0,0,5,2.28,7.45,7.45,0,0,0,4.59-1.29,7,7,0,0,0,2.42-3.88,3,3,0,0,1,.25-.69,1.85,1.85,0,0,1,1.71-.93,1.76,1.76,0,0,1,1.54.92,2.7,2.7,0,0,1,.26.7,7.76,7.76,0,0,0,1.63,3.17A7,7,0,0,0,32.89,30.64Zm0,1.36a8.26,8.26,0,0,1-6.37-2.44,9,9,0,0,1-1.93-3.7l-.12-.37c-.19-.25-.29-.28-.39-.28a.53.53,0,0,0-.55.28l-.12.37a8.67,8.67,0,0,1-3,4.68A8.52,8.52,0,0,1,15.11,32a7.92,7.92,0,0,1-5.88-2.6,16.44,16.44,0,0,1-3.68-7.28,3.23,3.23,0,0,1-.93-1.21A14.63,14.63,0,0,1,4.17,19,5.83,5.83,0,0,1,4,17.26a1.17,1.17,0,0,1,.63-.93c.19-.1.58-.33,3.47-.33,1.65,0,3.42.08,4.73.21,2.94.29,6.4,1.87,8.75,3,2,1,2.25,1,2.4,1s.39,0,2.4-1c3.68-1.83,6.54-2.82,8.75-3,1.31-.13,3.08-.21,4.73-.21,2.9,0,3.29.23,3.48.34a1.15,1.15,0,0,1,.62.92A5.83,5.83,0,0,1,43.83,19a15.46,15.46,0,0,1-.45,1.92,3,3,0,0,1-.83,1.1,17.06,17.06,0,0,1-3.77,7.38A7.93,7.93,0,0,1,32.89,32Z"/>
    </g>
    <g >
      <path class="cls-1" d="M38.41,20.72A6.83,6.83,0,0,0,35.06,20c-3.75,0-8.34,1.79-8.86,3.07a3.34,3.34,0,0,0,.24,2.76c.52,1.34,2,3.17,5.44,3.17s5.4-2.6,6.23-4.1S39.47,21.32,38.41,20.72Z"/>
    </g>
    <path class="cls-1" d="M21.8,23.07C21.28,21.79,16.69,20,12.94,20h0a6.83,6.83,0,0,0-3.35.72c-1.06.6-.53,2.68.3,4.18S12.66,29,16.12,29s4.92-1.83,5.44-3.17A3.34,3.34,0,0,0,21.8,23.07Z"/>
  </g>
</symbol>
<symbol id="icon-genre-seventies" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g >
    <path class="cls-1" d="M20.14,23.65a2,2,0,0,0-.25-.19c-3.12-1.78-7.79-.82-9.16-.48a15.42,15.42,0,0,1,.8-6.34,12.76,12.76,0,0,0,.83-7.87s12.82-4.32,13.1,0c0,0-.07.47-.11,1.22H22.83a.56.56,0,0,0,0,1.12h2.49c0,.37,0,.76.05,1.18l-2.38.2a.56.56,0,0,0,0,1.12h0l2.42-.21a11.26,11.26,0,0,0,.22,1.13L23.59,15a.57.57,0,0,0-.43.67.56.56,0,0,0,.54.44h.12l2.23-.47a9.49,9.49,0,0,0,.44,1l-2,1.09a.57.57,0,0,0,.27,1.06.6.6,0,0,0,.27-.07l2-1.14a5.84,5.84,0,0,0,1.12,1.1L26.8,19.71a.56.56,0,0,0,.33,1,.54.54,0,0,0,.34-.12l1.73-1.32a55,55,0,0,0,7.64,3.87l.52.22a3.84,3.84,0,0,1,1.32,3.15C28.09,30,21.54,24.77,20.14,23.65Zm11.53,6.88H35.9c1.92,0,2.52-.76,2.57-1.66a3.11,3.11,0,0,0,0-1.16,32.89,32.89,0,0,1-7.4,1A18.7,18.7,0,0,1,27,28.25c-2.49-.55-6-2.81-7.23-3.58h0l-.38-.23c-2.91-1.66-7.63-.56-8.54-.32a34.45,34.45,0,0,0,.65,4.34h0l0,.12h0a2.5,2.5,0,0,0,2.38,1.93h.58a4.35,4.35,0,1,0,6.12,4,4.26,4.26,0,0,0-.51-2l2.42-1.92h1.34l2.2,2a4.32,4.32,0,1,0,5.65-2Zm-14.3,4a1.12,1.12,0,1,1-1.12-1.12A1.12,1.12,0,0,1,17.37,34.49Zm12.5-1.12A1.13,1.13,0,1,0,31,34.49,1.12,1.12,0,0,0,29.87,33.37ZM18.62,34.49a2.37,2.37,0,1,0-2.37,2.4A2.39,2.39,0,0,0,18.62,34.49Zm-.58-4h2.45l-1.15.92A4.44,4.44,0,0,0,18,30.53Zm5.56-1.82-1.23-.64a12.28,12.28,0,0,0-4.66-1.72l-.23,2.23Zm2.06,1.82h2.42a4.51,4.51,0,0,0-1.35,1Zm4.21,1.57a2.4,2.4,0,1,0,2.38,2.39A2.39,2.39,0,0,0,29.87,32.1Z"/>
  </g>
</symbol>
<symbol id="icon-genre-eighties" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g>
    <g >
      <path class="cls-1" d="M9.45,13h29.1A1.47,1.47,0,0,1,40,14.53v18A1.46,1.46,0,0,1,38.55,34H9.45A1.46,1.46,0,0,1,8,32.56v-18A1.47,1.47,0,0,1,9.45,13ZM31.88,33.3a.79.79,0,1,0-.77-.78A.78.78,0,0,0,31.88,33.3Zm-3.48-.54a.46.46,0,0,1-.45-.47v-.46a.46.46,0,0,1,.45-.46H29a.47.47,0,0,1,.46.46v.46a.47.47,0,0,1-.46.47Zm-9.83-.44a.47.47,0,0,0,.46.46h.57a.46.46,0,0,0,.45-.46v-.46a.46.46,0,0,0-.45-.47H19a.47.47,0,0,0-.46.47Zm-1.68.22a.77.77,0,1,1-.77-.78A.77.77,0,0,1,16.89,32.54ZM13,33.89h.05a.26.26,0,0,0,.24-.19l1-4.21a.27.27,0,0,1,.25-.21H33.74a.27.27,0,0,1,.26.23l.68,4.17a.24.24,0,0,0,.28.21.26.26,0,0,0,.2-.29l-.68-4.18a.74.74,0,0,0-.74-.63H14.55a.75.75,0,0,0-.72.58l-1,4.21A.25.25,0,0,0,13,33.89Zm-2.22-6.41a.58.58,0,0,1-.57-.58v-11a.58.58,0,0,1,.57-.57H37.19a.58.58,0,0,1,.57.57v11a.58.58,0,0,1-.57.58Z"/>
    </g>
    <path class="cls-1" d="M32.82,19H15.18A1.19,1.19,0,0,0,14,20.24v4.61A1.18,1.18,0,0,0,15.18,26H32.82A1.18,1.18,0,0,0,34,24.85V20.24A1.19,1.19,0,0,0,32.82,19Zm-3.88,3.51a1.67,1.67,0,1,1,1.67,1.68A1.68,1.68,0,0,1,28.94,22.55Zm-8.28-1.38V23.7a.23.23,0,0,0,.23.23h6.22a.23.23,0,0,0,.23-.23V21.17a.23.23,0,0,0-.23-.23H20.89A.23.23,0,0,0,20.66,21.17Zm-1.6,1.38a1.67,1.67,0,1,1-1.67-1.69A1.68,1.68,0,0,1,19.06,22.55Z"/>
    <g >
      <path class="cls-1" d="M36.81,17.23A.19.19,0,0,0,37,17a.2.2,0,0,0-.19-.19H12.19A.2.2,0,0,0,12,17a.19.19,0,0,0,.19.19Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-nineties" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <path class="cls-1" d="M34,13.36A15,15,0,1,0,12.79,34.6,15,15,0,0,0,34,13.36Zm-6.52-3.25.58.18-2.77,9.05a4.9,4.9,0,0,1,1,.51l5.25-7.62a15.35,15.35,0,0,1,3.68,3.69L27.66,21.1A5.21,5.21,0,0,1,27,27.6,5.13,5.13,0,0,1,22.28,29l-2.76,9-.59-.18,2.76-9a4.82,4.82,0,0,1-1.15-.59l-5.19,7.56a15.55,15.55,0,0,1-3.68-3.68l7.56-5.19a5.05,5.05,0,0,1,5.53-7.77ZM20.48,21a4.15,4.15,0,1,0,5.87,0A4.13,4.13,0,0,0,20.48,21Zm4.06,4a1.55,1.55,0,1,1,0-2.19A1.64,1.64,0,0,1,24.54,25Z"/>
</symbol>
<symbol id="icon-genre-xtra" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="All-Xtra">
    <g id="allXtra-Copy-2">
      <path class="cls-1" d="M26,11.45H37.72V22.71l-4.19-4.54-3.76,3.62L26.8,19l3.8-3.67ZM9,11.71,21.15,24.32,9,36.45h5.32l12.2-12.13L14.32,11.71Zm20.58,15-3,2.85,7.17,6.89H39Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-bbq" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="BBQ">
    <g id="bbq-copy-2">
      <g >
        <path class="cls-1" d="M24,22l1.91-1.91a4.59,4.59,0,0,1,.62-5.68l6-6,.8.79-5.81,6.85A2.57,2.57,0,0,0,28,19.47a3.09,3.09,0,0,0,2.11.94A1.94,1.94,0,0,0,31.36,20l6.84-5.81.8.8-6,6a4.47,4.47,0,0,1-3.2,1.33,4.64,4.64,0,0,1-2.48-.71l-1.91,1.92Z"/>
      </g>
      <g >
        <path class="cls-1" d="M11.33,36.36a.72.72,0,0,0-.53.24.72.72,0,0,0,0,1.07.76.76,0,0,0,.53.24.79.79,0,0,0,.54-.24.84.84,0,0,0,0-1.09A.73.73,0,0,0,11.33,36.36Zm.09,3.09a2.43,2.43,0,0,1-1.7-.71A2.23,2.23,0,0,1,9,37.1a2.44,2.44,0,0,1,.8-1.78L20.16,26l.43.43,2-1.95L24,25.9l-1.95,2,.43.43L13.14,38.67A2.27,2.27,0,0,1,11.42,39.45Z"/>
      </g>
      <path class="cls-1" d="M19.8,15.52l.24-.24-4.39-4.39-.24.24Zm-1.33,1.35.28-.25-4.38-4.38-.24.24Zm-1.28,1.29.22-.2L13,13.58l-.24.24Zm-1.35,1.33.24-.24-4.39-4.39-.24.24Zm20.93,16a.73.73,0,0,0-.52.23.7.7,0,0,0,0,1,.69.69,0,0,0,1,0,.79.79,0,0,0,0-1A.72.72,0,0,0,36.77,35.46Zm-.09,3A2.19,2.19,0,0,1,35,37.69l-9-10,.42-.42L20,20.87l-4,.91-7-7,6.35-6.34,7,7-.92,4,6.38,6.37.41-.41,10,9A2.17,2.17,0,0,1,39,36a2.32,2.32,0,0,1-2.32,2.41Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-canadian" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Canadian">
    <g id="canadian-copy-2">
      <path class="cls-1" d="M24,5l-2.79,5.73c-.32.62-.89.56-1.46.22l-2-1.15,1.51,8.8c.31,1.61-.71,1.61-1.21.91L14.5,15.16l-.57,2.21a.68.68,0,0,1-.79.52l-4.47-1,1.17,4.69c.26,1,.45,1.47-.25,1.75L8,24.12,15.68,31A1.16,1.16,0,0,1,16,32.13l-.67,2.43,7.67-1c.23,0,.62.22.62.52L23.3,43h1.29l-.2-8.87c0-.3.35-.54.58-.54l7.67,1L32,32.13A1.21,1.21,0,0,1,32.31,31L40,24.12l-1.59-.82c-.7-.28-.51-.71-.26-1.75l1.18-4.69-4.47,1a.68.68,0,0,1-.79-.52l-.57-2.21L30,19.51c-.5.7-1.52.7-1.21-.91l1.51-8.8-2,1.15c-.57.34-1.14.4-1.45-.22Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-canadianmusic" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Canadian-Music">
    <g id="canadianMusic-Copy-2">
      <path class="cls-1" d="M21.21,11.65,24,6.22l2.8,5.43c.31.59.88.54,1.45.21l2-1.09-1.51,8.34c-.31,1.52.71,1.52,1.21.86l3.53-4.12.57,2.09a.68.68,0,0,0,.79.5l4.47-1L38.15,21.9c0,.1,0,.2-.07.29-.21.78-.3,1.14.33,1.37l1.59.78-7.69,6.5A1.1,1.1,0,0,0,32,31.93l.68,2.3-5.08-.61L25,33.31c-.23,0-.59.22-.58.51l.2,8.4H23.3l.35-8.42c0-.28-.39-.49-.62-.49l-2.81.34-4.86.58.67-2.3a1.06,1.06,0,0,0-.35-1.09L8,24.34l1.59-.78c.63-.23.54-.59.33-1.37,0-.09-.05-.19-.08-.29L8.67,17.46l4.47,1a.68.68,0,0,0,.79-.5l.57-2.09L18,20c.5.66,1.52.66,1.21-.86l-1.51-8.34,2,1.09C20.32,12.19,20.89,12.24,21.21,11.65Zm2.64,7.06h1.24c-.09.69.5,1.25,1.12,1.84.94.89,1.95,1.86.83,3.43-.26.37-.39.21-.32,0,.21-.55,0-1.86-1.72-2.13v6.24h0a2.29,2.29,0,0,1-2,1.81,2.15,2.15,0,0,1-2.68-1.35,2.13,2.13,0,0,1,1.95-2.27,2.8,2.8,0,0,1,1.56.13Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-canadiantalk" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Canadian-Talk">
    <g id="canadianTalk-Copy-2">
      <path class="cls-1" d="M24,5.22,21.21,11c-.32.63-.89.57-1.46.22l-2-1.15,1.51,8.8c.31,1.61-.71,1.61-1.21.92L14.5,15.39l-.57,2.21a.7.7,0,0,1-.79.52l-4.47-1,1.17,4.68c.26,1.05.45,1.48-.25,1.75L8,24.34l7.68,6.87A1.15,1.15,0,0,1,16,32.36l-.67,2.43,7.67-1c.23,0,.62.21.62.51l-.35,8.89h1.29l-.2-8.87c0-.3.35-.53.58-.53l7.67,1L32,32.36a1.19,1.19,0,0,1,.35-1.15L40,24.34l-1.59-.82c-.7-.27-.51-.7-.26-1.75l1.18-4.68-4.47,1a.69.69,0,0,1-.79-.52l-.57-2.21L30,19.74c-.5.69-1.52.69-1.21-.92L30.27,10l-2,1.15c-.57.35-1.14.41-1.45-.22Zm2.09,14.9a3.25,3.25,0,0,1,.94,2.3v.28H20.91v-.24a3.3,3.3,0,0,1,.94-2.33v1.08a.25.25,0,0,0,.24.25.24.24,0,0,0,.23-.25V19.74a3.17,3.17,0,0,1,.47-.27v1.74a.25.25,0,0,0,.24.25.24.24,0,0,0,.23-.25v-1.9a2.54,2.54,0,0,1,.47-.07v2a.25.25,0,0,0,.24.25.24.24,0,0,0,.23-.25v-2a2.53,2.53,0,0,1,.48.07v1.9a.24.24,0,0,0,.23.25.25.25,0,0,0,.24-.25V19.47a3.1,3.1,0,0,1,.47.26v1.48a.24.24,0,0,0,.23.25.25.25,0,0,0,.24-.25ZM27,23.69h.7a.24.24,0,0,1,.24.24v1.49a4.11,4.11,0,0,1-3.77,4.19h0v1h1.42a.24.24,0,0,1,.23.25.24.24,0,0,1-.23.25h-3.3a.24.24,0,0,1-.23-.25.24.24,0,0,1,.23-.25h1.41v-1h0A4.12,4.12,0,0,1,20,25.41V23.93a.23.23,0,0,1,.23-.24h.71v-.5H27ZM24,29.13a3.62,3.62,0,0,0,3.53-3.7V24.18H27v1.25a3.06,3.06,0,1,1-6.12,0V24.18h-.47v1.23A3.62,3.62,0,0,0,24,29.13Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-chill" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Chill">
    <g id="chill-copy-2">
      <g >
        <path class="cls-1" d="M24,9A15,15,0,1,0,39,24,15,15,0,0,0,24,9Zm0,5.77a2.31,2.31,0,1,1-2.31,2.31A2.31,2.31,0,0,1,24,14.77Zm-.68,22.46a5.07,5.07,0,0,0,.68,0,13.26,13.26,0,0,0,.68-26.51c-.22,0-.45,0-.68,0,.23,0,.46,0,.68,0A6.64,6.64,0,0,1,24,24a6.63,6.63,0,0,0-.68,13.23Z"/>
      </g>
      <g >
        <path class="cls-1" d="M25,34a2,2,0,1,0-2-2A2,2,0,0,0,25,34Z"/>
      </g>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-christian" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Christian">
    <g id="christian-copy-2">
      <polygon class="cls-1" points="20.33 10 20.33 17.25 13 17.25 13 24.5 20.33 24.5 20.33 39 27.66 39 27.66 24.5 35 24.5 35 17.25 27.66 17.25 27.66 10 20.33 10"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-college" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="College-PxP">
    <g id="collegePxP-Copy-2">
      <path class="cls-1" d="M30.68,17.46h2V15.38H26.27v2.08h2.14v8.8c0,2.86-1.47,4.22-4,4.22S20.52,29,20.52,26.19V17.46h2.14V15.38H16.19v2.08h2v8.88c0,4.12,2.4,6.28,6.24,6.28s6.24-2.16,6.24-6.36ZM37,10V24.58a11.3,11.3,0,0,1-2.56,7.24,18.93,18.93,0,0,1-5,4.33,27.12,27.12,0,0,1-4.76,2.3.69.69,0,0,1-.51,0,24.3,24.3,0,0,1-8.14-4.91,13.06,13.06,0,0,1-3.7-5.65,10.85,10.85,0,0,1-.49-3.2V10a10.24,10.24,0,0,0,6.45,2.24,8.54,8.54,0,0,0,6.16-2.7,8.46,8.46,0,0,0,6.15,2.7A10.16,10.16,0,0,0,37,10Zm6,12.75-5-1.64v3.51a12.19,12.19,0,0,1-1.18,5.3L43,31.69s-2.67-5.39-2.67-5.39ZM12.08,29.9a11.49,11.49,0,0,1-.68-1.71,11.62,11.62,0,0,1-.54-3.5V21.1L6,22.71,8.67,26.3S6,31.67,6,31.69Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-comedy" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Comedy">
    <g id="comedy-copy-2">
      <path class="cls-1" d="M26.78,21.26c-.18-.53.49-1.66,1.74-2.12s1.7-.25,3.09.24A11.35,11.35,0,0,1,26.78,21.26Zm1.6,11.79a5.76,5.76,0,0,1-6.13-1.92,12.43,12.43,0,0,0,5.26-.39,12,12,0,0,0,4.28-2.94A5.36,5.36,0,0,1,28.38,33.05ZM16.75,24.57c.74-1.24.94-1.67,2.21-2.09s2.53,0,2.75.55A11.46,11.46,0,0,1,16.75,24.57ZM32.63,10.83C31.92,9.5,31.66,9,30.76,9A11.56,11.56,0,0,0,26,10.32a36.27,36.27,0,0,1-5.35,2.29A37.13,37.13,0,0,1,15,14.16a10.94,10.94,0,0,0-4.52,1.92c-.73.51-.56,1.09-.21,2.55s2.91,5.41,5.34,10,2.84,4.6,6.5,7,5.28,4.08,8.4,3,3.2-3.32,4.38-7.45,1.54-4.39.33-9.42S33.34,12.17,32.63,10.83Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-country" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Country">
    <g id="country-copy-2">
      <path class="cls-1" d="M11.86,35,10.71,34l-.55.76a5.28,5.28,0,0,1-.8-1.19L9,33.81l-.2-.45a5.23,5.23,0,0,1,1.36-6.42h0l.39-.28.17.37a5.6,5.6,0,0,1,4.13-1.28,5.43,5.43,0,1,1-1.18,10.79,5.51,5.51,0,0,1-2.52-.92Zm-.67.59-.64.56-.89-.74h0l.54-.73A5.29,5.29,0,0,0,11.19,35.62Zm2.9-2.36s.15,0,.27-.18.18-.27.14-.31l-2-1.63s-.15.05-.27.19-.17.26-.14.3Zm-3-5.62a4.86,4.86,0,0,1,3.69-1.19,4.7,4.7,0,1,1-1,9.35,4.66,4.66,0,0,1-1.7-.5l.55-.47L10.9,33.18l-.5.66a4.63,4.63,0,0,1-.42-.76l.52-.48-.09-.22a.1.1,0,0,0,0,0,3.76,3.76,0,0,1,.82-3.9l.17-.16ZM33.81,8.34a3.29,3.29,0,0,1,.32.27,1.17,1.17,0,0,1-.14,2c-.38-.5-.76-.26-1,.47a1.07,1.07,0,0,1-.65.75h0a2.83,2.83,0,0,0-.69.39.84.84,0,0,0-.19.12c-.35.28-3.25,3.7-6.12,7.11l1.94,1.93s2.15-1.65,3.29-1.5h.1a3.09,3.09,0,0,1,2.75,1.61l.25.39a4.7,4.7,0,0,0,3.06,2.41l.22.08c2.17.82,4.25,1.61,4.85,2.85l0,.07c.63,1.29,1.74,3.58-2.55,7.71s-6.56,3-7.84,2.3l-.08,0c-1.23-.64-2-2.73-2.72-4.91a1.72,1.72,0,0,1-.07-.21,4.69,4.69,0,0,0-2.34-3.11c-.12-.08-.25-.16-.38-.26A3,3,0,0,1,24.33,26v-.1c-.12-1.14,1.62-3.22,1.62-3.22l-1.76-1.85c-2.55,3-4.78,5.72-4.78,5.72a6.73,6.73,0,0,1,1.68,5.2A6.85,6.85,0,1,1,18,25.4L23,19.66c-2.5-2.62-5.73-6-5.91-6.21s-1.32-.25-1.32-.25a5,5,0,0,0-.47-.89l-.07.08a.27.27,0,0,1-.08.32.26.26,0,1,1,0-.43l.1-.09a8,8,0,0,0-.51-.67l-.15-.16-.17.17a.29.29,0,1,1-.44,0,.29.29,0,0,1,.33-.07l.17-.16a4.8,4.8,0,0,0-.81-.64l-.21.2a.29.29,0,0,1-.08.33.28.28,0,0,1-.39,0,.28.28,0,0,1,0-.39.28.28,0,0,1,.33-.07l.17-.17a4.26,4.26,0,0,0-.64-.31l0-1.38.57-.28.3-.55,1.38.07a3.86,3.86,0,0,0,.3.65l.11-.11a.29.29,0,0,1,.08-.33.26.26,0,1,1,.36.37.32.32,0,0,1-.34.07l-.14.13a5.25,5.25,0,0,0,.62.83l.18-.17a.29.29,0,0,1,.08-.33.28.28,0,0,1,.39,0,.28.28,0,0,1,0,.39.3.3,0,0,1-.33.07l-.18.17.16.15c.23.21.45.38.65.53l.1-.1a.33.33,0,0,1,.08-.33.29.29,0,0,1,.4,0,.28.28,0,0,1,0,.39.3.3,0,0,1-.33.07l-.08.07a4.42,4.42,0,0,0,.88.5s-.12,1,.21,1.31l6,5.95,1.62-1.85a2.22,2.22,0,0,1,.55-.37L26.2,16s-.1,0-.19,0h0l-.14,0c-.28-.06-.37-.25-.16-.48l.12-.13c.16-.23.41-.17.49.09l.06.15a.5.5,0,0,1,0,.21l.16.16c.76-.7,3.86-4.16,3.86-4.16a2.21,2.21,0,0,0,.33-1.1,1.14,1.14,0,0,1,.75-1c.71-.25.93-.65.39-1a1.23,1.23,0,0,1,1.95-.47Zm1,21.72,1.41-1.35-.63-.64-.89.72-.24-.08-.5.48-.43.42-.5.48.07.24-.76.86.63.64,1.41-1.35Zm-3.73-5.57a1.54,1.54,0,0,0-2.17,0,1.51,1.51,0,0,0,0,2.15,1.54,1.54,0,0,0,2.17,0A1.51,1.51,0,0,0,31.13,24.49Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-dance" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Dance">
    <g id="dance-copy-2">
      <g >
        <path class="cls-1" d="M10.55,17.17V9h3.27v8.17h1.54V20.6H13.82V39H10.55V20.6H9V17.17Zm7.58,10.92V9h3.26V28.09h1.55v3.42H21.39V39H18.13V31.51H16.58V28.09ZM25.71,9v8.58H24.16V21h1.55V39H29V21h1.55V17.58H29V9Zm8.47,18.4V9h3.27V27.4H39v3.43H37.45V39H34.18V30.83H32.64V27.4Z"/>
      </g>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-discovery" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Discovery">
    <g id="Asset-5-Copy-2">
      <path class="cls-1" d="M24.05,26.11a1.7,1.7,0,1,0-1.7-1.7A1.7,1.7,0,0,0,24.05,26.11Z"/>
      <path d="M43.26,24.77h0l-3.63-7.7a7.13,7.13,0,0,0-7.4-4,4.21,4.21,0,0,0-1.12.3,21.14,21.14,0,0,1-4.68,1.12v0a2.41,2.41,0,0,1-1.14,2.19,2.38,2.38,0,0,1-3.61-2.19v-.07A20.66,20.66,0,0,1,17,13.35a4.5,4.5,0,0,0-1.13-.3,7.17,7.17,0,0,0-7.4,4l-3,6.4a8.67,8.67,0,0,0-1,6.39,8.21,8.21,0,0,0,5.28,6A8.61,8.61,0,0,0,21.36,28.7a26.27,26.27,0,0,1,5.32,0,8.57,8.57,0,1,0,16.58-3.93Zm-28.42-1.9a5.25,5.25,0,0,1,1.7,8.56A5.19,5.19,0,0,1,12.83,33a5.25,5.25,0,1,1,2-10.09ZM24.05,22a2.44,2.44,0,0,1,2.25,1.5,2.43,2.43,0,1,1-4.67.92,2.34,2.34,0,0,1,.7-1.71A2.4,2.4,0,0,1,24.05,22Zm11.21.47A5.25,5.25,0,1,1,30,27.74h0a5.24,5.24,0,0,1,5.28-5.25Zm-6.6-7.14,0,4.67H19.41V15.35l1.2.22A3.87,3.87,0,0,0,24,18.05a3.86,3.86,0,0,0,3.42-2.48Z"/>
      <path d="M15.93,12.42a4.36,4.36,0,0,1,1.27.35h0a9.68,9.68,0,0,0,1.6.53,4.16,4.16,0,0,0-7.54,0,7.8,7.8,0,0,1,4.67-.88Z"/>
      <path d="M30.88,12.77h0a4.83,4.83,0,0,1,1.3-.36,7.67,7.67,0,0,1,4.67.88,4.13,4.13,0,0,0-7.55,0,8.12,8.12,0,0,0,1.58-.52Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-entertainment" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Entertainment">
    <g id="entertainment-copy-2">
      <path class="cls-1" d="M13.42,26.73h21v-5.4h-21ZM24.24,32.3,17.8,28.08H30.69Zm13-5.57h-1.4v-5.4h.7a.69.69,0,0,0,.7-.68v-8.1a.68.68,0,0,0-.7-.67h-.7V9.17a.7.7,0,0,0-1.4,0v2.71h-21V9.17a.7.7,0,0,0-1.4,0v2.71h-.7a.68.68,0,0,0-.7.67v8.1a.69.69,0,0,0,.7.68H12v5.4h-1.4a.68.68,0,1,0,0,1.35h4.69l7.69,5-7.87,5.15a.66.66,0,0,0-.19.93.7.7,0,0,0,.58.3.69.69,0,0,0,.39-.12l8.33-5.45,8.33,5.45a.71.71,0,0,0,.39.12.7.7,0,0,0,.58-.3.66.66,0,0,0-.19-.93l-7.86-5.15,7.69-5h4a.68.68,0,1,0,0-1.35Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-kids" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Family">
    <g id="family-copy-2">
      <path class="cls-1" d="M33.34,16.15c-3-1.58-8-1-11.23-.48-.24,0-.42-.25-.68-.71-1.83-3.3-5.27-5.32-9.12-4a8.78,8.78,0,0,0-1.69-.39c-.59,0-1.63-.2-.74.68.31.31.57.58.76.8h-.17c-.6,0-1.64-.12-.74.42l.8.52a5.77,5.77,0,0,0-.42,3,41.76,41.76,0,0,0,.51,5c.19.71.71,1,1.82,1.33s1.44.06,2.06-.77,1.09-1.17.76-2.57.67-1.58.88-.76a6.46,6.46,0,0,1,.14,1.63,9,9,0,0,1-1.28,5c-1,2.09-2,4.11-2.42,5a14.57,14.57,0,0,0,4.73,1.66A29.31,29.31,0,0,0,18.5,27c.14-.75.28-1.51.48-2.26.09-.33.18-.25.18-.25,1.92,1.28,7,1,9.43-1A3.44,3.44,0,0,0,31,25.63s-.05,1.12,0,2.92,0,3.07,0,3.07A13.48,13.48,0,0,0,36.57,30a7.45,7.45,0,0,0-.81-3.19,20.23,20.23,0,0,0-2.13-3.18,8.85,8.85,0,0,0,.84-2.34c.16-1.26-.24-3.1.09-4.18a1.38,1.38,0,0,1,.66-.7c.93-.63,4.25-1.23,4.09-2s-2.83-3.27-3.6-3.69A13.44,13.44,0,0,0,33.34,16.15Zm5.19,17.92c-3.3,2.11-8.27,3.46-13.83,3.46h-.05c-5.56,0-10.53-1.35-13.84-3.46-4.12-2.63-4.4-7,.48-4.15l1,.62a14.18,14.18,0,0,0,4.83,1.84C22.19,33.5,32,33.67,36.82,30.7c.41-.26.82-.53,1.24-.78C42.93,27.05,42.66,31.44,38.53,34.07Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-hiphop" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Hip-Hop">
    <g id="hipHop-Copy-2">
      <path class="cls-1" d="M37.72,26.05a2.37,2.37,0,1,1-2.36-2.36A2.36,2.36,0,0,1,37.72,26.05Zm-21.7,0a2.37,2.37,0,1,1-2.37-2.36A2.36,2.36,0,0,1,16,26.05Zm19.34,4.59A4.59,4.59,0,1,1,40,26.05,4.6,4.6,0,0,1,35.36,30.64ZM30.57,15.7v.91H29.41V15.7a.22.22,0,0,0-.21-.21H27.12a.21.21,0,0,0-.21.21v.91H25.75V15.7a.21.21,0,0,0-.21-.21H23.46a.21.21,0,0,0-.21.21v.91H22.09V15.7a.21.21,0,0,0-.21-.21H19.81a.22.22,0,0,0-.22.21v.91H18.44V15.7a.22.22,0,0,0-.22-.21H16.15a.22.22,0,0,0-.22.21v.91H13.77V13.7a.66.66,0,0,1,.65-.65H34.59a.65.65,0,0,1,.64.65v2.91H33.07V15.7a.22.22,0,0,0-.22-.21H30.78A.21.21,0,0,0,30.57,15.7Zm-11.34,14H29.77V22.41H19.23Zm-5.58.95a4.59,4.59,0,1,1,4.59-4.59A4.6,4.6,0,0,1,13.65,30.64Zm22.83-14V12.89a1.19,1.19,0,0,0-1.19-1.18H13.71a1.19,1.19,0,0,0-1.19,1.18v3.72H7V35.27h3.15v.44h3.29v-.44H35.56v.44h3.3v-.44H42V16.61Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-howardstern" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Howard">
    <g id="howard-copy-2">
      <path class="cls-1" d="M12.73,25.06H15.8V19.53H26.25v2.95H20.46a1.3,1.3,0,0,0-1.37,1.29v5.87a1.31,1.31,0,0,0,1.37,1.3h13v3H19.09v2.56H35.17a1.32,1.32,0,0,0,1.39-1.29V29.68a1.31,1.31,0,0,0-1.39-1.29h-13V25.06H39V36a3,3,0,0,1-3,3H12a3,3,0,0,1-3-3V12a3,3,0,0,1,3-3h.7v8H10.67v2.54h2.06ZM39,12.4V22.85H29.32V11.45H26.25v5.92H15.8v-8H36A3,3,0,0,1,39,12.4Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-jazz" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Jazz">
    <g id="jazz-copy-2">
      <path class="cls-1" d="M21.85,26.34a.84.84,0,0,1,.82.87.83.83,0,1,1-1.65,0A.84.84,0,0,1,21.85,26.34ZM22,22.92a.88.88,0,1,1-.83.88A.85.85,0,0,1,22,22.92Zm.13-3.41a.84.84,0,0,1,.82.87.82.82,0,1,1-1.64,0A.84.84,0,0,1,22.12,19.51Zm-.83-14a3.29,3.29,0,0,0-3.18,2.37c0,.07-.36,1.13-.38,1.21H15a3.55,3.55,0,0,0,2.55,1c.19,0,.92,0,1.11-.59.05-.17.43-1.33.51-1.49.32-.7.82-1.22,1.44-1.22s.79.78.73,1.57L19.27,34.42a6.47,6.47,0,0,0,6.57,7c2.39,0,3.92-.81,4.69-3.27s-.38-7,2.47-8l-6-6.46c-2.15,2.19-1.9,6.85-1.49,9.76.09.58,0,2.33-.72,2.32s-1-1.42-1-2.09V8.29A2.47,2.47,0,0,0,21.29,5.46Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-world_lw" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <title>GenreIcons_</title>
  <g id="Latin-Talk">
    <path id="path-1-copy" d="M32.21,22.92v1.27h1.93a.64.64,0,0,1,.64.64h0v3.84A10.87,10.87,0,0,1,24.5,39.47v0h0V42h3.85a.64.64,0,1,1,0,1.28h-9a.64.64,0,0,1,0-1.28h3.86V39.47A10.89,10.89,0,0,1,12.94,28.65h0V24.83a.64.64,0,0,1,.64-.64h1.93V22.92ZM15.44,25.56h-1.3v3.17a9.72,9.72,0,0,0,19.44,0h0v-3.2h-1.3v3.2a8.42,8.42,0,0,1-16.84,0h0Zm7.89-13v5.07a.65.65,0,0,0,1.29,0V12.6a8.46,8.46,0,0,1,1.14.16l.16,0v4.87a.65.65,0,0,0,1.29,0V13.2a6.93,6.93,0,0,1,1.15.59l.14.08v3.8a.65.65,0,0,0,1.29,0V14.87a8.08,8.08,0,0,1,2.59,5.78v.83H15.58v-.62A8.23,8.23,0,0,1,18.08,15l.08-.08v2.78a.65.65,0,0,0,1.29,0V13.88a8.56,8.56,0,0,1,1.12-.6l.17-.07v4.46a.65.65,0,0,0,1.29,0V12.8A7.88,7.88,0,0,1,23.33,12.6Zm7.49-7.92a6.66,6.66,0,0,1-1.51,3.59,3.73,3.73,0,0,1-2.87,1.22,3.88,3.88,0,0,1-1.54-.3,10.42,10.42,0,0,1-1.57-.88A13.07,13.07,0,0,0,22,7.57a2.43,2.43,0,0,0-1-.23,1.65,1.65,0,0,0-1.3.6A3,3,0,0,0,19,9.53h-2.2A7,7,0,0,1,18.3,5.92a3.68,3.68,0,0,1,2.86-1.24,3.59,3.59,0,0,1,1.5.3,14.84,14.84,0,0,1,1.6.89c.54.32,1,.56,1.31.72a2.38,2.38,0,0,0,1.05.24,1.63,1.63,0,0,0,1.29-.58,3,3,0,0,0,.67-1.57Z"/>
  </g>
</symbol>
<symbol id="icon-genre-world" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Latino">
    <g id="latino-copy-2">
      <path class="cls-1" d="M24,16.76C24,18,19.78,19,14.57,19s-9.44-1-9.44-2.26,4.22-2.26,9.44-2.26S24,15.51,24,16.76ZM5.26,17.82v.3a.51.51,0,0,1,.1-.3Zm18.78,0a.6.6,0,0,1,.1.3v-.3ZM5.3,18.31c.44,1.08,4.48,1.92,9.4,1.92s9-.84,9.4-1.92l-.93,4.6h3l-.93-4.6c.44,1.08,4.48,1.92,9.4,1.92s9-.84,9.4-1.92l-3,14.59-2.7.34a25.84,25.84,0,0,1-7.19,0l-3-.36-.44-2.16H21.58l-.44,2.16-2.7.34a25.84,25.84,0,0,1-7.19,0l-3-.36Zm0-.19a.43.43,0,0,0,0,.19Zm38.87,0,0,.19A.43.43,0,0,0,44.13,18.12Zm-18.88,0a.43.43,0,0,0,0,.19Zm-1.11,0,0,.19A.65.65,0,0,0,24.14,18.12Zm1.11,0v-.3h.1A.51.51,0,0,0,25.25,18.12ZM44,17.82a.6.6,0,0,1,.1.3v-.3Zm.1-.93c0,1.25-4.23,2.26-9.44,2.26s-9.44-1-9.44-2.26,4.23-2.26,9.44-2.26S44.13,15.64,44.13,16.89Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-mlbpbp" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="MLB">
    <g id="mlb-copy-2">
      <path class="cls-1" d="M19.19,11.53A3.13,3.13,0,0,1,22,9.92a3,3,0,0,1-1.21,1.15A3,3,0,0,1,19.19,11.53ZM22.55,14a5.26,5.26,0,0,1,1.77-.56l.33-.07A2.78,2.78,0,0,0,22.7,10.1a4.27,4.27,0,0,1-1.59,1.49,4.37,4.37,0,0,1-2.1.63A2.79,2.79,0,0,0,21,15.52,4.41,4.41,0,0,1,22.55,14Zm.3.52a3,3,0,0,1,1.62-.46,3.15,3.15,0,0,1-2.82,1.62A3.11,3.11,0,0,1,22.85,14.54Zm16.91,5.28-8.63,5a62.54,62.54,0,0,1-7.42,3.28h0a75.6,75.6,0,0,0-8.28,3.64l-4.85,2.56a1.11,1.11,0,0,1-.41,1.51,1.14,1.14,0,0,1-1.53-.4L7.51,33.46A1.11,1.11,0,0,1,7.92,32a1.14,1.14,0,0,1,1.53.4l4.75-2.73A82.49,82.49,0,0,0,22,24h0a70.35,70.35,0,0,1,6.09-4.44l8.8-5.05a3,3,0,0,1,4.34,1.57A3.17,3.17,0,0,1,39.76,19.82Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-moretalk" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="More-Talk">
    <g id="moreTalk-Copy-2">
      <path class="cls-1" d="M20.35,16.4a6.48,6.48,0,0,0-2-4.65V14a.49.49,0,1,1-1,0V11a5.73,5.73,0,0,0-1-.52V14a.49.49,0,1,1-1,0V10.13a6.26,6.26,0,0,0-1-.16v4a.49.49,0,1,1-1,0V10a6.46,6.46,0,0,0-1,.16V14a.49.49,0,1,1-1,0V10.45a6.47,6.47,0,0,0-1,.53v3a.49.49,0,1,1-1,0V11.77a6.55,6.55,0,0,0-2,4.69V17H20.35ZM21.82,19H20.35V18H7.62v1H6.15a.49.49,0,0,0-.49.49v3A8.42,8.42,0,0,0,13.5,30.9h0v2H10.56a.49.49,0,0,0-.49.5.49.49,0,0,0,.49.5h6.85a.49.49,0,0,0,.49-.5.5.5,0,0,0-.49-.5H14.47v-2h0a8.42,8.42,0,0,0,7.84-8.45v-3A.49.49,0,0,0,21.82,19Zm-.49,3.5A7.42,7.42,0,0,1,14,29.92a7.42,7.42,0,0,1-7.34-7.49V19.94h1v2.49A6.44,6.44,0,0,0,14,28.93a6.44,6.44,0,0,0,6.37-6.48V19.94h1ZM40.35,34A2.35,2.35,0,1,0,38,31.63,2.33,2.33,0,0,0,40.35,34ZM34.8,31.63a2.32,2.32,0,1,1-2.32-2.35A2.33,2.33,0,0,1,34.8,31.63Zm-7.87,0a2.31,2.31,0,1,1-2.31-2.35A2.32,2.32,0,0,1,26.93,31.63Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-mash" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <title>GenreIcons_</title>
  <g id="Music-Mash">
    <g id="Asset-1-Copy-2">
      <path d="M27.82,11.07a1.5,1.5,0,0,1,1.5,1.5v7.68l10.1,18a1.5,1.5,0,0,1-.58,2,1.63,1.63,0,0,1-.75.18h-29a1.59,1.59,0,0,1-.74-.18,1.5,1.5,0,0,1-.59-2l10.11-18V12.58a1.56,1.56,0,0,1,.39-1.07,1.5,1.5,0,0,1,1.06-.44ZM20.19,21.85h0a1.63,1.63,0,1,0,1.64,1.64,1.64,1.64,0,0,0-1.64-1.64Zm8.13,5.53A2.6,2.6,0,1,0,25.72,30a2.61,2.61,0,0,0,2.6-2.61Zm5.21,10a1.1,1.1,0,0,0,.63-.18,1.08,1.08,0,0,0,.37-1.42l-2.48-4.41-.53.36a8.63,8.63,0,0,1-2.21,1,8.1,8.1,0,0,1-2.19.31,7.68,7.68,0,0,1-2.43-.39,8.9,8.9,0,0,1-2.47-1.27,6.45,6.45,0,0,0-1.93-1,5.47,5.47,0,0,0-1.61-.25,5.54,5.54,0,0,0-1.15.12,5.65,5.65,0,0,0-1,.26,5.27,5.27,0,0,0-1,.52h0a1.18,1.18,0,0,1-.19.11l-2.66,4.62a1,1,0,0,0-.15.64,1.07,1.07,0,0,0,1.07,1Z"/>
      <rect x="17.83" y="7.51" width="11.74" height="2.55" rx="0.51"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-NBA_PBP" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="NBA">
    <g id="nba-copy-2">
      <path class="cls-1" d="M22.13,18.5c-.25.14-.51.27-.77.4l-4.75-8.52A15,15,0,0,1,29,9.35,13.94,13.94,0,0,1,22.13,18.5ZM9.6,19a14.94,14.94,0,0,1,6.12-8.12l4.68,8.39A13.94,13.94,0,0,1,9.6,19Zm13,.37-.77.4L23.67,23l13.09-7.31a14.93,14.93,0,0,0-6.83-6A15,15,0,0,1,22.64,19.41Zm-13.32.64a15,15,0,0,0,11.59.18l1.85,3.3-12.18,6.8A14.93,14.93,0,0,1,9.32,20.05ZM26,27.15l.74-.44a15,15,0,0,1,12.06-1.13,14.94,14.94,0,0,0-1.51-8.95L24.18,23.94Zm-2.7-2.71,1.84,3.31a14.94,14.94,0,0,0-5.94,10,14.94,14.94,0,0,1-8.08-6.47Zm8,12.14a14.92,14.92,0,0,0,7.35-10,13.91,13.91,0,0,0-11.36,1l-.74.44ZM20.18,38a13.92,13.92,0,0,1,5.44-9.33l4.68,8.38A14.9,14.9,0,0,1,20.18,38Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-nflplay" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="NFL">
    <g id="nfl-copy-2">
      <path class="cls-1" d="M21.13,22.48a.52.52,0,1,0-.88.51L21,24.36,9.93,30.73c-1-2.18-.71-5.16.87-8.3A21.3,21.3,0,0,1,19,13.8c7-4,16.24-3.6,19.24.67l-11.1,6.37-.79-1.38a.52.52,0,1,0-.88.5l.79,1.38-.87.5-.8-1.37a.51.51,0,1,0-.87.5l.79,1.38-.88.5-.79-1.38A.52.52,0,1,0,22,22l.8,1.37-.89.51Zm6.55-.79,11.1-6.37c2.18,4.75-2.16,12.94-9.11,16.93s-16.23,3.6-19.24-.66l11.11-6.37.79,1.38a.52.52,0,1,0,.87-.51l-.79-1.37.88-.51.8,1.38a.56.56,0,0,0,.74.28.57.57,0,0,0,.13-.79l-.79-1.37.88-.5.79,1.37a.56.56,0,0,0,.74.28.54.54,0,0,0,.13-.78l-.79-1.38.88-.5.79,1.37a.52.52,0,1,0,.88-.5Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-NHL_PBP" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="NHL">
    <g id="nhl-copy-2">
      <path class="cls-1" d="M41.49,19.62c-1.08,1.92-7.34,4.21-17,4.21s-15.91-2.29-17-4.21C7.64,16,16.32,14,24.5,14S41.36,16,41.49,19.62Zm-34,2.13c3.13,2.34,10.23,3.58,17,3.58s13.87-1.24,17-3.58v5.58C41.5,31,33,33,24.5,33c-8.24,0-17-2-17-5.79Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-party" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <title>GenreIcons_</title>
  <g id="Party">
    <g id="Asset-6">
      <path d="M20.47,19.59a1.41,1.41,0,1,1,1.41-1.41,1.41,1.41,0,0,1-1.41,1.41Z"/>
      <path d="M33.43,14h-.07l-1.65-.31a.43.43,0,0,1-.26-.18.39.39,0,0,1-.06-.3,1.37,1.37,0,0,0-.22-1,1.42,1.42,0,0,0-.86-.61,1.5,1.5,0,0,0-1,.22,1.37,1.37,0,0,0-.59.87.41.41,0,0,1-.17.27.4.4,0,0,1-.32.06l-1.61-.32a.41.41,0,0,1-.26-.17.42.42,0,0,1-.07-.31,3.85,3.85,0,0,1,1.63-2.43,3.94,3.94,0,0,1,5.38,1,3.69,3.69,0,0,1,.59,2.86.41.41,0,0,1-.41.35Z"/>
      <path d="M17.71,13.22a.46.46,0,0,1-.22-.06.41.41,0,0,1-.19-.36L17.42,8a.44.44,0,0,1,.22-.35.43.43,0,0,1,.41,0l4.15,2.53a.39.39,0,0,1,.19.36.37.37,0,0,1-.21.35l-4.3,2.28A.25.25,0,0,1,17.71,13.22Z"/>
      <path d="M30.91,27a.34.34,0,0,1-.25-.08l-.93-.7a.37.37,0,0,1-.16-.27.43.43,0,0,1,.08-.31l2.45-3.25a.4.4,0,0,1,.28-.16.38.38,0,0,1,.31.08l2,1.53,1.55-2a.5.5,0,0,1,.27-.16.48.48,0,0,1,.31.08l3.29,2.47a.38.38,0,0,1,.16.27.38.38,0,0,1-.08.31l-.7.92a.37.37,0,0,1-.27.16.39.39,0,0,1-.31-.08l-2-1.51-1.5,2a.37.37,0,0,1-.15.13.4.4,0,0,1-.19.07.39.39,0,0,1-.31-.08l-2-1.52-1.51,2A.38.38,0,0,1,30.91,27Z"/>
      <path d="M32.76,32.16a1.41,1.41,0,0,1-1-2.41,1.42,1.42,0,0,1,1.54-.3,1.41,1.41,0,0,1-.55,2.71Z"/>
      <path d="M27.58,23.66a.39.39,0,0,1-.33.33l-1.11.2a.36.36,0,0,1-.31-.07.44.44,0,0,1-.16-.27L24.3,15.21a.42.42,0,0,1,.07-.31.41.41,0,0,1,.27-.18l1.1-.2a.42.42,0,0,1,.31.07.38.38,0,0,1,.16.27l1.38,8.65A.38.38,0,0,1,27.58,23.66Z"/>
      <path d="M31.23,20.39A1.41,1.41,0,1,1,32.63,19,1.4,1.4,0,0,1,31.23,20.39Z"/>
      <polygon points="13.12 25.18 26.33 32.11 28.54 31.11 16.07 18.59 13.12 25.18"/>
      <polygon points="11.23 29.36 21.02 34.48 24.86 32.73 12.58 26.34 11.23 29.36"/>
      <path d="M7.78,37.07a1.89,1.89,0,0,0,.49,1.81,1.85,1.85,0,0,0,1.8.48l4.22-1.86L8.9,34.67Z"/>
      <polygon points="9.37 33.51 15.71 36.84 19.54 35.13 10.71 30.49 9.37 33.51"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-political" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Politics">
    <g id="politics-copy-2">
      <path class="cls-1" d="M38,26.69l-.06-14.63a1.14,1.14,0,0,0-1.38-1.13L26,12.57V11.18A1.15,1.15,0,0,0,24.59,10L12.08,12V10.85a1.29,1.29,0,0,0,.67-1.14,1.38,1.38,0,0,0-2.75,0,1.3,1.3,0,0,0,.68,1.14l0,29.37,1.4.16V29.33l11.62-1.82V28.9A1.15,1.15,0,0,0,25.11,30l11.51-1.79A1.66,1.66,0,0,0,38,26.69Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-pop" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Pop">
    <g id="pop-copy-2">
      <path class="cls-1" d="M13.65,16A5.49,5.49,0,0,0,11,18.59a.53.53,0,0,0,.25.7.46.46,0,0,0,.23.06.54.54,0,0,0,.48-.3A4.39,4.39,0,0,1,14.1,17a.53.53,0,0,0,.26-.7A.54.54,0,0,0,13.65,16Zm7.52,3.89A10.86,10.86,0,0,0,15.94,25a.53.53,0,0,0,.25.7.49.49,0,0,0,.23.06.53.53,0,0,0,.48-.3,9.76,9.76,0,0,1,4.72-4.64.53.53,0,0,0-.45-1Zm11.35-9.37a.46.46,0,0,0,.23.06.52.52,0,0,0,.47-.3,2.07,2.07,0,0,1,1-1,.54.54,0,0,0,.26-.7.55.55,0,0,0-.71-.26,3.17,3.17,0,0,0-1.51,1.49A.51.51,0,0,0,32.52,10.53ZM34.8,7.2a3.68,3.68,0,1,1-3.7,3.67A3.69,3.69,0,0,1,34.8,7.2Zm-9.46,34a11.94,11.94,0,0,1-11.5-15.42c.05-.14.1-.29.14-.43a12.08,12.08,0,0,1,6.47-7l.24-.1A11.95,11.95,0,1,1,25.34,41.2Zm-12.06-17c-.06.13-.12.27-.17.41a1.55,1.55,0,0,0-.08.23A1.17,1.17,0,0,1,13,25a5.43,5.43,0,1,1,6.86-7.52l-.14.07-.1.05a13,13,0,0,0-6.29,6.56Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-publicradio" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Public-Radio">
    <g id="Asset-4-Copy-2">
      <path class="cls-1" d="M27.93,34.65a2,2,0,0,1-.54.08H9.92l-.17-.06-.18-.07h0a2,2,0,0,1-.8-.82L5.45,19.05l3.33-.69V14h18.1V15.3H10.12V32.82a.51.51,0,0,0,.12.39.53.53,0,0,0,.38.18H26.45a8.09,8.09,0,0,0,1.48,1.26Z"/>
      <polygon class="cls-1" points="21.07 22.45 26.66 22.45 26.66 21.36 21.07 21.36 21.07 22.45"/>
      <polygon class="cls-1" points="21.07 25.58 24.45 25.58 24.45 24.46 21.07 24.46 21.07 25.58"/>
      <polygon class="cls-1" points="11.69 25.58 20.18 25.58 20.18 21.36 11.69 21.36 11.69 25.58"/>
      <path class="cls-1" d="M24.56,28.7H11.69V27.59H24.45a7,7,0,0,0,.11,1.11Z"/>
      <polygon class="cls-1" points="11.69 19.1 26.88 19.1 26.88 17.1 11.69 17.1 11.69 19.1"/>
      <path class="cls-1" d="M25.67,31.83h-14V30.71H25.14A9.53,9.53,0,0,0,25.67,31.83Z"/>
      <path class="cls-1" d="M36.58,12.16a.63.63,0,1,0,1.26,0,.66.66,0,0,0-.59-.66A.67.67,0,0,0,36.58,12.16Zm.67,3.32a.67.67,0,0,0,.59-.67.66.66,0,0,0-.59-.66.67.67,0,0,0-.65,1,.68.68,0,0,0,.65.31Zm0,2.65a.67.67,0,0,0,.59-.67.66.66,0,0,0-.59-.66.67.67,0,0,0-.65,1A.68.68,0,0,0,37.25,18.13Zm0,2.65a.66.66,0,1,0-.66-.66A.67.67,0,0,0,37.25,20.78Zm-1.67.66a.67.67,0,0,0,.41.62.64.64,0,0,0,.73-.14.68.68,0,0,0,.15-.73.67.67,0,0,0-1.29.25Zm-.33-2a.66.66,0,1,0,.66.66.65.65,0,0,0-.66-.64Zm-1.66,2a.67.67,0,1,0,.66-.66.67.67,0,0,0-.66.66Zm-.34-2a.66.66,0,1,0,.67.66.66.66,0,0,0-.67-.66Zm-1.66,2a.67.67,0,1,0,.67-.67.67.67,0,0,0-.67.67Zm-.33-2a.66.66,0,1,0,.66.66.65.65,0,0,0-.66-.64Zm-1.66,2a.67.67,0,0,0,.41.62.64.64,0,0,0,.73-.14.68.68,0,0,0,.15-.73.67.67,0,0,0-.62-.41.59.59,0,0,0-.47.19.63.63,0,0,0-.2.47Zm-.33-2a.66.66,0,1,0,.66.66.66.66,0,0,0-.66-.66Zm0-2.66a.67.67,0,0,0-.63.4.7.7,0,0,0,.14.74.68.68,0,0,0,.73.15.66.66,0,0,0-.24-1.27Zm0-2.65a.67.67,0,1,0,.66.66.67.67,0,0,0-.66-.64Zm0-2.65a.67.67,0,1,0,.66.66.67.67,0,0,0-.66-.64Zm1.66-.66a.68.68,0,0,0-.41-.63.66.66,0,0,0-.73.14.68.68,0,0,0-.15.74.67.67,0,0,0,1.29-.23Zm1-1.33a.66.66,0,1,0-.66.66.66.66,0,0,0,.66-.66Zm.34,2a.67.67,0,0,0,.59-.67.66.66,0,0,0-.59-.66.67.67,0,0,0-.65,1A.68.68,0,0,0,32.27,11.49Zm1.66-2a.69.69,0,0,0-.41-.63.66.66,0,0,0-.73.14.67.67,0,0,0,.47,1.15.66.66,0,0,0,.66-.64Zm.33,2a.69.69,0,0,0,.63-.41.68.68,0,0,0-.15-.74A.66.66,0,0,0,34,10.2a.68.68,0,0,0-.41.63.67.67,0,0,0,.65.67Zm1.66-2a.66.66,0,1,0-.66.66.66.66,0,0,0,.66-.66Zm.34,3.32a.66.66,0,1,0,.66.66.66.66,0,0,0-.66-.66Zm0,2.65a.66.66,0,1,0,.66.66.66.66,0,0,0-.66-.66Zm.66,3.31a.66.66,0,0,0-.42-.62.65.65,0,0,0-.73.15.68.68,0,0,0-.14.73.69.69,0,0,0,.63.41.68.68,0,0,0,.65-.65Zm-1.66-2a.67.67,0,0,0-.63.4.7.7,0,0,0,.14.74.68.68,0,0,0,.73.15.67.67,0,0,0,.42-.62.66.66,0,0,0-.67-.64Zm-.33,2a.67.67,0,1,0-.67.67.67.67,0,0,0,.67-.67Zm-1.67-2a.67.67,0,1,0,.67.67.67.67,0,0,0-.67-.67Zm-.33,2a.67.67,0,1,0-.41.62.66.66,0,0,0,.41-.62Zm-1.66-2a.67.67,0,0,0-.63.4.7.7,0,0,0,.14.74.68.68,0,0,0,.73.15.67.67,0,0,0,.42-.62.66.66,0,0,0-.67-.64Zm-1,2.66a.67.67,0,1,0-.67-.67.65.65,0,0,0,.19.49.67.67,0,0,0,.48.21Zm0-2.66a.67.67,0,0,0,.65-.67.66.66,0,0,0-1.32,0,.65.65,0,0,0,.19.49.66.66,0,0,0,.48.2Zm0-2.65a.67.67,0,0,0,.65-.67.66.66,0,0,0-1.32,0,.65.65,0,0,0,.19.49.66.66,0,0,0,.48.2Zm.33-2a.66.66,0,1,0,.66-.66.66.66,0,0,0-.48.2.68.68,0,0,0-.18.5Zm1.66,2a.66.66,0,1,0-.66-.66.67.67,0,0,0,.66.66Zm.33-2a.67.67,0,1,0,.66-.66.67.67,0,0,0-.66.7Zm1.66,2a.66.66,0,1,0-.66-.66.66.66,0,0,0,.18.48.68.68,0,0,0,.48.21Zm1-2.65a.67.67,0,1,0,.66.66.66.66,0,0,0-.66-.66Zm0,2.65a.67.67,0,1,0,.66.66.66.66,0,0,0-.66-.66Zm-.33,2a.69.69,0,0,0-.41-.63.66.66,0,0,0-.73.14.67.67,0,0,0,.47,1.15.66.66,0,0,0,.67-.64Zm-1.67-2a.67.67,0,0,0-.62.41.68.68,0,0,0,.15.73.64.64,0,0,0,.73.14.65.65,0,0,0-.26-1.25Zm-2.65.66a.66.66,0,1,0,.66-.66.65.65,0,0,0-.66.69Zm2.32,1.33a.67.67,0,0,0-.19-.47.59.59,0,0,0-.47-.19.66.66,0,1,0,.66.69Zm3.33-4.61a.67.67,0,0,0,.47-1.15.66.66,0,0,0-.73-.14.69.69,0,0,0-.41.63.67.67,0,0,0,.67.66Zm2,.88v.37a.66.66,0,0,0,0,1.32v1.29a.66.66,0,0,0,0,1.32V18a.66.66,0,0,0-.59.66.67.67,0,0,0,.59.67v1.32a.66.66,0,0,0-.59.66.67.67,0,0,0,.59.67v.42h-10V22h0a.61.61,0,0,0,.57-.25.68.68,0,0,0,.07-.71.65.65,0,0,0-.6-.37h-.06V19.36h0a.6.6,0,0,0,.57-.27A.67.67,0,0,0,28.26,18H28.2V16.72h0a.61.61,0,0,0,.57-.25.66.66,0,0,0,.12-.72.65.65,0,0,0-.61-.39h-.06V14.07h.06a.66.66,0,0,0,0-1.32h-.06v-.39a5.55,5.55,0,0,1,.09-1,.67.67,0,0,0,.64-.65.63.63,0,0,0-.25-.51,3,3,0,0,1,.16-.31.66.66,0,0,0,.7.08A.65.65,0,0,0,30,9.38a.64.64,0,0,0-.3-.55l.25-.24a.64.64,0,0,0,.38.12A.67.67,0,0,0,31,8.1a.48.48,0,0,0,0-.17,5.09,5.09,0,0,1,1-.4.64.64,0,0,0-.34.57.67.67,0,0,0,.24.51.65.65,0,0,0,.55.14.66.66,0,0,0,.51-.69.65.65,0,0,0-.59-.61,4.9,4.9,0,0,1,1.87,0,.64.64,0,0,0-.58.65.67.67,0,0,0,1.33,0,.62.62,0,0,0-.28-.53,4.51,4.51,0,0,1,1,.39V8.1a.67.67,0,0,0,1,.57l.18.16h0l.07.08a.65.65,0,0,0-.26.52.67.67,0,0,0,.67.66A.63.63,0,0,0,37.7,10a3,3,0,0,1,.16.31.66.66,0,0,0-.2.48.66.66,0,0,0,.56.65,4.3,4.3,0,0,1,.05.95ZM41,27.26v-3.7H39.84v3.6a6.59,6.59,0,1,1-13.18.12V23.56H25.54v3.7a7.62,7.62,0,0,0,7.15,7.54V41H33.8V34.8A7.62,7.62,0,0,0,41,27.26Zm-2.68-3.7v3.85a5,5,0,0,1-10,.1v-4Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-religion" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Religion">
    <g id="religion-copy-2">
      <path class="cls-1" d="M27.12,15.72H25v8.16H23.79V15.72H21.71l-.84-.67.84-.62h2.08V12.07l.63-.86.62.86v2.36h2.08l.84.65ZM24.48,6.06,9.21,20.23V41.06h8.54c0-.43,0-.26,0-.33a16.89,16.89,0,0,1,1.05-8.3c.8-1.89,2.16-4.47,4.79-4.82a5.73,5.73,0,0,1,.82-.05c4.34.14,6.58,6.29,7,10.14v.23a16.22,16.22,0,0,1,0,3.13h7.83V20.23Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-rock" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Rock">
    <g id="rock-copy-2">
      <path class="cls-1" d="M34.36,30.6a1,1,0,1,1,0-2,1,1,0,1,1,0,2Zm-.61,3.71a1,1,0,1,1,1-1A1,1,0,0,1,33.75,34.31Zm-2.46-7.18a29.48,29.48,0,0,0-3.62-.56H21.62a.36.36,0,0,1-.36-.35v-3a.36.36,0,0,1,.36-.36h5.46v-.05L27,18.24h-5.4a.35.35,0,0,1-.36-.35v-3a.35.35,0,0,1,.36-.35h3.14c2,0,2.26.11,2.26-.78,0,0,0,.3,0-.09s2.26.16,3.26,2.66,1.81,5.11,3,8c.36.89.69,1.65.13,2.25A2.38,2.38,0,0,1,31.29,27.13Zm-.6,10.16a1,1,0,1,1,1-1A1,1,0,0,1,30.69,37.29ZM28.61,31a.35.35,0,0,1-.35.35H21.62a.35.35,0,0,1-.36-.35v-.5a.36.36,0,0,1,.36-.36h6.64a.36.36,0,0,1,.35.36V31ZM18.75,14.32A1.37,1.37,0,1,1,20.13,13,1.37,1.37,0,0,1,18.75,14.32Zm17.55,12c-1.31-2.41-3.83-5-4-6a5.77,5.77,0,0,1,.9-3.73c1.25-2.42.9-4.05.63-4.61a.71.71,0,0,0-1.3,0,3.38,3.38,0,0,1-3,1.7A2.63,2.63,0,0,1,27,10.76v-.09c0-.4,0-.83,0-1.28,0-.15,0-.31,0-.47V8.79c0-.19,0-.38,0-.57,0-.43,0-.8,0-1.26v0c-.17-.76-4.49-.77-4.49.08,0,.32,0,.64,0,1a8.56,8.56,0,0,0-4,.86c-1.91,1.16-3,2.28-3,4.95s2,3.92,2,6.07S14.92,23,13.59,25.45,11.82,29,11.7,30.38a10.3,10.3,0,0,0,1,6,11.49,11.49,0,0,0,5.72,5c1.89.79,4.59,1.14,8.52.83s5.79-1.51,7.22-2.8,3.28-4.21,3.39-6.54A11.12,11.12,0,0,0,36.3,26.33Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-sportsplay" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Sports-PxP">
    <g id="sportPlayByPlay-Copy-2">
      <path class="cls-1" d="M15.53,12.89,12.3,9.67l1.26-1.26,3.22,3.22L19.92,8.5l1.26,1.26L18,12.89l3,3-1.26,1.26-3-3-3.11,3.09L12.42,16Zm7.73,20.9a3.11,3.11,0,0,1-3,2.46,2.73,2.73,0,0,1-.64-.07,3.1,3.1,0,0,1-2.41-3.67,3.13,3.13,0,0,1,3-2.46,2.73,2.73,0,0,1,.64.07,3.12,3.12,0,0,1,2,1.33A3.07,3.07,0,0,1,23.26,33.79ZM36,11.13,29.47,9.51a1.09,1.09,0,0,0-1.32.79l-1.62,6.54a1.08,1.08,0,0,0,.79,1.31l.26,0c.34,0,.35-.21.37-.51a3.56,3.56,0,0,1,.05-.43l1-5,.88,1.58a11.66,11.66,0,0,1-4,16q-.59.34-1.2.63a1.14,1.14,0,0,0-.1-.19A5.26,5.26,0,0,0,21.31,28a5.76,5.76,0,0,0-1.09-.11,5.29,5.29,0,0,0-5.16,4.18,5.27,5.27,0,0,0,4.08,6.23,5.68,5.68,0,0,0,1.09.11,5.28,5.28,0,0,0,5.23-5.9,14.27,14.27,0,0,0,1.6-.83,13.82,13.82,0,0,0,4.71-19l-1-1.36,4.76,1.43c.58.14,1.16.24,1.31-.34A1.09,1.09,0,0,0,36,11.13Zm-28.29,14L4.5,21.92l1.26-1.26L9,23.88l3.13-3.13L13.38,22l-3.14,3.13,3,3L12,29.4l-3-3L5.88,29.49,4.62,28.23Zm30.12,8.34-3.23-3.22L35.88,29l3.23,3.22,3.13-3.13,1.26,1.26-3.13,3.13,3,3-1.26,1.26-3-3L36,37.83l-1.26-1.26Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-sportstalk" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Sports-Talk">
    <g id="sportTalk-Copy-2">
      <path class="cls-1" d="M32.15,33.27a1,1,0,0,1-2,0v-20a1,1,0,0,1,2,0ZM7.16,26a1,1,0,0,1-2,0V20.49a1,1,0,0,1,2,0V26Zm.66-5.33v5.14l21.41,7.11V13.57Zm2.72,7.09a3.49,3.49,0,0,0,2,4.52l3.79,1.46a3.51,3.51,0,0,0,4.54-2l-1.11-.43a2.33,2.33,0,0,1-3,1.31L13,31.19a2.3,2.3,0,0,1-1.32-3Zm29-11a.65.65,0,0,0,0-.93.66.66,0,0,0-.94,0l-3.93,3.91a.66.66,0,0,0,.94.93Zm0,14a.67.67,0,0,1-.93,0l-3.94-3.92a.66.66,0,0,1,.94-.93l3.93,3.91A.66.66,0,0,1,39.54,30.7Zm3-6.78a.66.66,0,0,0,0-1.32H37a.66.66,0,0,0,0,1.32Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-hits" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="hits-copy-2">
    <g >
      <path class="cls-1" d="M20.06,43c-10-5.08-11.52-14.11-3.12-25.55.12,3.06.36,6,2,7.63C18.5,22.41,16.46,13,27.5,5,24.14,21.65,48,26.35,29.18,42.75c5-10.81-3.48-10.43-3.72-20.47-3.84,3.94-4.2,8-2.76,12.71a8.42,8.42,0,0,1-4.08-4.44C16.94,35.12,18.5,39.82,20.06,43Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-tophundred" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Top-100">
    <g id="top100-copy-2">
      <g >
        <path class="cls-1" d="M38.9,16.91a2.07,2.07,0,1,1,1.62,2L38.24,30.73H10.69L8.42,18.89a2.21,2.21,0,0,1-.37,0,2,2,0,1,1,2-2,1.94,1.94,0,0,1-.52,1.31l6.19,5.4L20,18.8l3-3.45a2.35,2.35,0,0,1-1.12-2,2.42,2.42,0,0,1,4.84,0,2.35,2.35,0,0,1-1.12,2l3,3.45,4.14,4.75.41.09L39.4,18.2A1.92,1.92,0,0,1,38.9,16.91ZM38.06,32.5H10.7V37H38.06Z"/>
      </g>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-trafficandnews" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Traffic-Weather">
    <g id="trafficWeather-Copy-2">
      <path class="cls-1" d="M17.6,10.78l0-2.66a.72.72,0,0,0-.72-.73h0a.73.73,0,0,0-.71.74l0,2.66a.73.73,0,0,0,.72.73h0A.71.71,0,0,0,17.6,10.78ZM12.89,8.85l1,2.43a.73.73,0,0,1-.66,1,.71.71,0,0,1-.66-.44l-1-2.44a.75.75,0,0,1,.37-1A.7.7,0,0,1,12.89,8.85Zm-2.14,5.44a.75.75,0,0,0,0-1L8.85,11.41a.72.72,0,0,0-1,0,.77.77,0,0,0,0,1.06l1.88,1.82a.7.7,0,0,0,1,0Zm-2.22,2-2.42-.92a.7.7,0,0,0-.92.44.74.74,0,0,0,.42,1L8,17.72a.69.69,0,0,0,.24.05A.73.73,0,0,0,9,17.28.74.74,0,0,0,8.53,16.33ZM5.15,21.84a.74.74,0,0,1-.06-1.48l2.57-.22a.74.74,0,0,1,.12,1.48l-2.57.22H5.15Zm.79,4.66a.7.7,0,0,0,.61.35.67.67,0,0,0,.38-.11l2.19-1.4a.75.75,0,0,0,.23-1,.71.71,0,0,0-1-.24l-2.19,1.4A.75.75,0,0,0,5.94,26.5Zm16-18a.76.76,0,0,1,.36,1l-1.07,2.42a.73.73,0,0,1-.66.43.66.66,0,0,1-.3-.07.74.74,0,0,1-.35-1L21,8.82A.71.71,0,0,1,22,8.46Zm1.24,5.87a.71.71,0,0,0,1,.14l2.05-1.6a.77.77,0,0,0,.14-1,.7.7,0,0,0-1-.15l-2.05,1.6A.77.77,0,0,0,23.2,14.33ZM11.07,24.84a7.75,7.75,0,0,1-1.59-4.71,7.5,7.5,0,0,1,7.38-7.61,7.3,7.3,0,0,1,6.28,3.63,10.57,10.57,0,0,0-2,2,7,7,0,0,0-.92-.06,6.5,6.5,0,0,0-6.37,5.75A5.67,5.67,0,0,0,11.07,24.84Zm28.42,9.22a1.38,1.38,0,0,1,0-2.75,1.38,1.38,0,0,1,0,2.75Zm-6.41-4.32H27l1.15-3.21c.14-.46.36-.79.87-.79h8.1c.5,0,.72.33.86.79l1.16,3.21Zm-6.41,4.32A1.38,1.38,0,1,1,28,32.69,1.33,1.33,0,0,1,26.67,34.06Zm14.06-4.28L39.2,25.7a2.09,2.09,0,0,0-2.1-1.45H29a2.1,2.1,0,0,0-2.1,1.45l-1.53,4.08A2.19,2.19,0,0,0,23.73,32v5.2h1.49v1.66a1.41,1.41,0,1,0,2.81,0V37.2H38.12v1.66a1.41,1.41,0,1,0,2.81,0V37.2h1.5V32A2.2,2.2,0,0,0,40.73,29.78ZM29.4,15.31a9.45,9.45,0,0,1,9.19,7.79h-2l-.39,0H28.09A2.13,2.13,0,0,0,26,24.55l-1.55,4.13a2.23,2.23,0,0,0-1.71,2.24v3.72H14.35a4.79,4.79,0,0,1,0-9.57,3.71,3.71,0,0,1,.67.05c0-.14,0-.28,0-.42a5.27,5.27,0,0,1,5.19-5.36,4.87,4.87,0,0,1,1.44.21A9.3,9.3,0,0,1,29.4,15.31Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-workout" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <g id="Workout">
    <g >
      <path class="cls-1" d="M36.74,8.87a14.9,14.9,0,0,1,5.75,9.94c.23,2.81-3.52,4.8-5.75,3.16A15.23,15.23,0,0,1,31,12.38C30.64,9.22,34.28,7,36.74,8.87ZM37.21,12c1.06-.58,3.64,4,2.7,4.56S36.27,12.62,37.21,12ZM30.29,9c-2.82,5.15,2.58,14.74,8.33,15.67-2.93,3.39-6.69,1.29-9.39-2.34l-8.56,4.92c1.52,4.32.7,10.76-5.05,9.12a3.72,3.72,0,0,1-4.34.23A13.83,13.83,0,0,1,7.8,32.83,14.59,14.59,0,0,1,5.54,27a3.67,3.67,0,0,1,2-3.74c.82-6.32,7.27-4.45,10.56-.59l8.68-5C25.24,13.43,25.71,9.22,30.29,9ZM14.1,25l2.46-1.52c-1.76-2-3.75-3-4.92-2.45C8,23.26,15.27,35.66,18.91,33.55c1.17-.7,1.29-2.92.35-5.5l-2.58,1.53C15.16,29.46,13.51,26.53,14.1,25Z"/>
    </g>
  </g>
</symbol>
<symbol id="icon-genre-Decades" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
  <path d="M24 6c9.941 0 18 8.059 18 18s-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6zm3.9 2.092c-.712-.017-1.586-.326-1.959.292-.458.76.963 1.771.624 2.592-.32.778-1.949.41-2.192 1.216-.229.755 1.08 1.25 1.211 2.028.125.737-1.11.809-.762 1.6.228.517.721.888.944 1.405a7 7 0 00-5.19 12.882c-.69 1.823-.86.836-3.596 2.875-.927.691 1.456 1.932.651 2.505-.86.613-2.08.567-2.904 1.229-.617.494.892 1.335 1.204 1.51 1.599.892 2.954 1.639 4.326 1.671.702.017 1.565.326 1.933-.292.451-.76-.95-1.77-.617-2.592.316-.777 1.923-.41 2.164-1.216.225-.755-1.066-1.25-1.196-2.028-.123-.737 1.097-.809.752-1.6-.217-.5-.68-.864-.908-1.356a7 7 0 005.16-12.851c.726-1.93.865-.887 3.676-2.955.94-.691-1.475-1.932-.66-2.505.872-.613 2.108-.567 2.944-1.228.625-.495-.904-1.336-1.22-1.51-1.62-.893-2.994-1.64-4.385-1.672zM24 22a2 2 0 110 4 2 2 0 010-4z"/>
</symbol>
<symbol id="icon-email" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 100 78" style="enable-background:new 0 0 100 78;" xml:space="preserve">
  <g>
    <path d="M50.21,0.12c11.56,0,23.12,0.14,34.68-0.04c10.47-0.16,15.2,4.82,15.08,15.25c-0.19,15.76,0.01,31.52,0.01,47.28
    c0,12.71-4.31,15.51-14.88,15.45c-23.58-0.14-47.17-0.08-70.75-0.03c-9.79,0.02-14.4-4.78-14.35-14.52
    c0.08-16.23,0.12-32.45-0.01-48.68C-0.11,4.15,5.31-0.13,15.53,0.07C27.08,0.29,38.65,0.12,50.21,0.12z M94.35,9.72
    C78.04,23.81,63.99,35.95,49.92,48.1C35.07,35.25,21.36,23.4,5.57,9.73c0,19.93,0.46,36.51,0.46,53.05c0,8.04,1.02,9.24,9.62,9.24
    c23.07,0,46.16,0.03,69.24,0.03c9.03,0,9.03-0.93,9.03-8.49C93.92,46.65,94.35,29.71,94.35,9.72z M10.45,6.3
    c14.61,12.73,26.67,23.24,39.54,34.46C62.86,29.47,75.01,18.82,89.28,6.3C62.02,6.3,37.97,6.3,10.45,6.3z"/>
  </g>
</symbol>
<symbol id="icon-apple-badge">
<g>
<g>
  <g>
    <path d="M110.13477,0H9.53468c-.3667,0-.729,0-1.09473.002-.30615.002-.60986.00781-.91895.0127A13.21476,13.21476,0,0,0,5.5171.19141a6.66509,6.66509,0,0,0-1.90088.627A6.43779,6.43779,0,0,0,1.99757,1.99707,6.25844,6.25844,0,0,0,.81935,3.61816a6.60119,6.60119,0,0,0-.625,1.90332,12.993,12.993,0,0,0-.1792,2.002C.00587,7.83008.00489,8.1377,0,8.44434V31.5586c.00489.3105.00587.6113.01515.9219a12.99232,12.99232,0,0,0,.1792,2.0019,6.58756,6.58756,0,0,0,.625,1.9043A6.20778,6.20778,0,0,0,1.99757,38.001a6.27445,6.27445,0,0,0,1.61865,1.1787,6.70082,6.70082,0,0,0,1.90088.6308,13.45514,13.45514,0,0,0,2.0039.1768c.30909.0068.6128.0107.91895.0107C8.80567,40,9.168,40,9.53468,40H110.13477c.3594,0,.7246,0,1.084-.002.3047,0,.6172-.0039.9219-.0107a13.279,13.279,0,0,0,2-.1768,6.80432,6.80432,0,0,0,1.9082-.6308,6.27742,6.27742,0,0,0,1.6172-1.1787,6.39482,6.39482,0,0,0,1.1816-1.6143,6.60413,6.60413,0,0,0,.6191-1.9043,13.50643,13.50643,0,0,0,.1856-2.0019c.0039-.3106.0039-.6114.0039-.9219.0078-.3633.0078-.7246.0078-1.0938V9.53613c0-.36621,0-.72949-.0078-1.09179,0-.30664,0-.61426-.0039-.9209a13.5071,13.5071,0,0,0-.1856-2.002,6.6177,6.6177,0,0,0-.6191-1.90332,6.46619,6.46619,0,0,0-2.7988-2.7998,6.76754,6.76754,0,0,0-1.9082-.627,13.04394,13.04394,0,0,0-2-.17676c-.3047-.00488-.6172-.01074-.9219-.01269-.3594-.002-.7246-.002-1.084-.002Z" style="fill: #a6a6a6"/>
    <path d="M8.44483,39.125c-.30468,0-.602-.0039-.90429-.0107a12.68714,12.68714,0,0,1-1.86914-.1631,5.88381,5.88381,0,0,1-1.65674-.5479,5.40573,5.40573,0,0,1-1.397-1.0166,5.32082,5.32082,0,0,1-1.02051-1.3965,5.72186,5.72186,0,0,1-.543-1.6572,12.41351,12.41351,0,0,1-.1665-1.875c-.00634-.2109-.01464-.9131-.01464-.9131V8.44434S.88185,7.75293.8877,7.5498a12.37039,12.37039,0,0,1,.16553-1.87207,5.7555,5.7555,0,0,1,.54346-1.6621A5.37349,5.37349,0,0,1,2.61183,2.61768,5.56543,5.56543,0,0,1,4.01417,1.59521a5.82309,5.82309,0,0,1,1.65332-.54394A12.58589,12.58589,0,0,1,7.543.88721L8.44532.875H111.21387l.9131.0127a12.38493,12.38493,0,0,1,1.8584.16259,5.93833,5.93833,0,0,1,1.6709.54785,5.59374,5.59374,0,0,1,2.415,2.41993,5.76267,5.76267,0,0,1,.5352,1.64892,12.995,12.995,0,0,1,.1738,1.88721c.0029.2832.0029.5874.0029.89014.0079.375.0079.73193.0079,1.09179V30.4648c0,.3633,0,.7178-.0079,1.0752,0,.3252,0,.6231-.0039.9297a12.73126,12.73126,0,0,1-.1709,1.8535,5.739,5.739,0,0,1-.54,1.67,5.48029,5.48029,0,0,1-1.0156,1.3857,5.4129,5.4129,0,0,1-1.3994,1.0225,5.86168,5.86168,0,0,1-1.668.5498,12.54218,12.54218,0,0,1-1.8692.1631c-.2929.0068-.5996.0107-.8974.0107l-1.084.002Z"/>
  </g>
  <g data-name="&lt;Group&gt;">
    <g id="_Group_2" data-name="&lt;Group&gt;">
      <g id="_Group_3" data-name="&lt;Group&gt;">
        <path data-name="&lt;Path&gt;" d="M24.76888,20.30068a4.94881,4.94881,0,0,1,2.35656-4.15206,5.06566,5.06566,0,0,0-3.99116-2.15768c-1.67924-.17626-3.30719,1.00483-4.1629,1.00483-.87227,0-2.18977-.98733-3.6085-.95814a5.31529,5.31529,0,0,0-4.47292,2.72787c-1.934,3.34842-.49141,8.26947,1.3612,10.97608.9269,1.32535,2.01018,2.8058,3.42763,2.7533,1.38706-.05753,1.9051-.88448,3.5794-.88448,1.65876,0,2.14479.88448,3.591.8511,1.48838-.02416,2.42613-1.33124,3.32051-2.66914a10.962,10.962,0,0,0,1.51842-3.09251A4.78205,4.78205,0,0,1,24.76888,20.30068Z" style="fill: #fff"/>
        <path id="_Path_2" data-name="&lt;Path&gt;" d="M22.03725,12.21089a4.87248,4.87248,0,0,0,1.11452-3.49062,4.95746,4.95746,0,0,0-3.20758,1.65961,4.63634,4.63634,0,0,0-1.14371,3.36139A4.09905,4.09905,0,0,0,22.03725,12.21089Z" style="fill: #fff"/>
      </g>
    </g>
    <g>
      <path d="M42.30227,27.13965h-4.7334l-1.13672,3.35645H34.42727l4.4834-12.418h2.083l4.4834,12.418H43.438ZM38.0591,25.59082h3.752l-1.84961-5.44727h-.05176Z" style="fill: #fff"/>
      <path d="M55.15969,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H48.4302v1.50586h.03418a3.21162,3.21162,0,0,1,2.88281-1.60059C53.645,21.34766,55.15969,23.16406,55.15969,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C52.30227,29.01563,53.24953,27.81934,53.24953,25.96973Z" style="fill: #fff"/>
      <path d="M65.12453,25.96973c0,2.81348-1.50586,4.62109-3.77832,4.62109a3.0693,3.0693,0,0,1-2.84863-1.584h-.043v4.48438h-1.8584V21.44238H58.395v1.50586h.03418A3.21162,3.21162,0,0,1,61.312,21.34766C63.60988,21.34766,65.12453,23.16406,65.12453,25.96973Zm-1.91016,0c0-1.833-.94727-3.03809-2.39258-3.03809-1.41992,0-2.375,1.23047-2.375,3.03809,0,1.82422.95508,3.0459,2.375,3.0459C62.26711,29.01563,63.21438,27.81934,63.21438,25.96973Z" style="fill: #fff"/>
      <path d="M71.71047,27.03613c.1377,1.23145,1.334,2.04,2.96875,2.04,1.56641,0,2.69336-.80859,2.69336-1.91895,0-.96387-.67969-1.541-2.28906-1.93652l-1.60937-.3877c-2.28027-.55078-3.33887-1.61719-3.33887-3.34766,0-2.14258,1.86719-3.61426,4.51855-3.61426,2.624,0,4.42285,1.47168,4.4834,3.61426h-1.876c-.1123-1.23926-1.13672-1.9873-2.63379-1.9873s-2.52148.75684-2.52148,1.8584c0,.87793.6543,1.39453,2.25488,1.79l1.36816.33594c2.54785.60254,3.60645,1.626,3.60645,3.44238,0,2.32324-1.85059,3.77832-4.79395,3.77832-2.75391,0-4.61328-1.4209-4.7334-3.667Z" style="fill: #fff"/>
      <path d="M83.34621,19.2998v2.14258h1.72168v1.47168H83.34621v4.99121c0,.77539.34473,1.13672,1.10156,1.13672a5.80752,5.80752,0,0,0,.61133-.043v1.46289a5.10351,5.10351,0,0,1-1.03223.08594c-1.833,0-2.54785-.68848-2.54785-2.44434V22.91406H80.16262V21.44238H81.479V19.2998Z" style="fill: #fff"/>
      <path d="M86.065,25.96973c0-2.84863,1.67773-4.63867,4.29395-4.63867,2.625,0,4.29492,1.79,4.29492,4.63867,0,2.85645-1.66113,4.63867-4.29492,4.63867C87.72609,30.6084,86.065,28.82617,86.065,25.96973Zm6.69531,0c0-1.9541-.89551-3.10742-2.40137-3.10742s-2.40039,1.16211-2.40039,3.10742c0,1.96191.89453,3.10645,2.40039,3.10645S92.76027,27.93164,92.76027,25.96973Z" style="fill: #fff"/>
      <path d="M96.18606,21.44238h1.77246v1.541h.043a2.1594,2.1594,0,0,1,2.17773-1.63574,2.86616,2.86616,0,0,1,.63672.06934v1.73828a2.59794,2.59794,0,0,0-.835-.1123,1.87264,1.87264,0,0,0-1.93652,2.083v5.37012h-1.8584Z" style="fill: #fff"/>
      <path d="M109.3843,27.83691c-.25,1.64355-1.85059,2.77148-3.89844,2.77148-2.63379,0-4.26855-1.76465-4.26855-4.5957,0-2.83984,1.64355-4.68164,4.19043-4.68164,2.50488,0,4.08008,1.7207,4.08008,4.46582v.63672h-6.39453v.1123a2.358,2.358,0,0,0,2.43555,2.56445,2.04834,2.04834,0,0,0,2.09082-1.27344Zm-6.28223-2.70215h4.52637a2.1773,2.1773,0,0,0-2.2207-2.29785A2.292,2.292,0,0,0,103.10207,25.13477Z" style="fill: #fff"/>
    </g>
  </g>
</g>
<g id="_Group_4" data-name="&lt;Group&gt;">
  <g>
    <path d="M37.82619,8.731a2.63964,2.63964,0,0,1,2.80762,2.96484c0,1.90625-1.03027,3.002-2.80762,3.002H35.67092V8.731Zm-1.22852,5.123h1.125a1.87588,1.87588,0,0,0,1.96777-2.146,1.881,1.881,0,0,0-1.96777-2.13379h-1.125Z" style="fill: #fff"/>
    <path d="M41.68068,12.44434a2.13323,2.13323,0,1,1,4.24707,0,2.13358,2.13358,0,1,1-4.24707,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C44.57522,13.99463,45.01369,13.42432,45.01369,12.44434Z" style="fill: #fff"/>
    <path d="M51.57326,14.69775h-.92187l-.93066-3.31641h-.07031l-.92676,3.31641h-.91309l-1.24121-4.50293h.90137l.80664,3.436h.06641l.92578-3.436h.85254l.92578,3.436h.07031l.80273-3.436h.88867Z" style="fill: #fff"/>
    <path d="M53.85354,10.19482H54.709v.71533h.06641a1.348,1.348,0,0,1,1.34375-.80225,1.46456,1.46456,0,0,1,1.55859,1.6748v2.915h-.88867V12.00586c0-.72363-.31445-1.0835-.97168-1.0835a1.03294,1.03294,0,0,0-1.0752,1.14111v2.63428h-.88867Z" style="fill: #fff"/>
    <path d="M59.09377,8.437h.88867v6.26074h-.88867Z" style="fill: #fff"/>
    <path d="M61.21779,12.44434a2.13346,2.13346,0,1,1,4.24756,0,2.1338,2.1338,0,1,1-4.24756,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C64.11232,13.99463,64.5508,13.42432,64.5508,12.44434Z" style="fill: #fff"/>
    <path d="M66.4009,13.42432c0-.81055.60352-1.27783,1.6748-1.34424l1.21973-.07031v-.38867c0-.47559-.31445-.74414-.92187-.74414-.49609,0-.83984.18213-.93848.50049h-.86035c.09082-.77344.81836-1.26953,1.83984-1.26953,1.12891,0,1.76563.562,1.76563,1.51318v3.07666h-.85547v-.63281h-.07031a1.515,1.515,0,0,1-1.35254.707A1.36026,1.36026,0,0,1,66.4009,13.42432Zm2.89453-.38477v-.37646l-1.09961.07031c-.62012.0415-.90137.25244-.90137.64941,0,.40527.35156.64111.835.64111A1.0615,1.0615,0,0,0,69.29543,13.03955Z" style="fill: #fff"/>
    <path d="M71.34816,12.44434c0-1.42285.73145-2.32422,1.86914-2.32422a1.484,1.484,0,0,1,1.38086.79h.06641V8.437h.88867v6.26074h-.85156v-.71143h-.07031a1.56284,1.56284,0,0,1-1.41406.78564C72.0718,14.772,71.34816,13.87061,71.34816,12.44434Zm.918,0c0,.95508.4502,1.52979,1.20313,1.52979.749,0,1.21191-.583,1.21191-1.52588,0-.93848-.46777-1.52979-1.21191-1.52979C72.72121,10.91846,72.26613,11.49707,72.26613,12.44434Z" style="fill: #fff"/>
    <path d="M79.23,12.44434a2.13323,2.13323,0,1,1,4.24707,0,2.13358,2.13358,0,1,1-4.24707,0Zm3.333,0c0-.97607-.43848-1.54687-1.208-1.54687-.77246,0-1.207.5708-1.207,1.54688,0,.98389.43457,1.55029,1.207,1.55029C82.12453,13.99463,82.563,13.42432,82.563,12.44434Z" style="fill: #fff"/>
    <path d="M84.66945,10.19482h.85547v.71533h.06641a1.348,1.348,0,0,1,1.34375-.80225,1.46456,1.46456,0,0,1,1.55859,1.6748v2.915H87.605V12.00586c0-.72363-.31445-1.0835-.97168-1.0835a1.03294,1.03294,0,0,0-1.0752,1.14111v2.63428h-.88867Z" style="fill: #fff"/>
    <path d="M93.51516,9.07373v1.1416h.97559v.74854h-.97559V13.2793c0,.47168.19434.67822.63672.67822a2.96657,2.96657,0,0,0,.33887-.02051v.74023a2.9155,2.9155,0,0,1-.4834.04541c-.98828,0-1.38184-.34766-1.38184-1.21582v-2.543h-.71484v-.74854h.71484V9.07373Z" style="fill: #fff"/>
    <path d="M95.70461,8.437h.88086v2.48145h.07031a1.3856,1.3856,0,0,1,1.373-.80664,1.48339,1.48339,0,0,1,1.55078,1.67871v2.90723H98.69v-2.688c0-.71924-.335-1.0835-.96289-1.0835a1.05194,1.05194,0,0,0-1.13379,1.1416v2.62988h-.88867Z" style="fill: #fff"/>
    <path d="M104.76125,13.48193a1.828,1.828,0,0,1-1.95117,1.30273A2.04531,2.04531,0,0,1,100.73,12.46045a2.07685,2.07685,0,0,1,2.07617-2.35254c1.25293,0,2.00879.856,2.00879,2.27V12.688h-3.17969v.0498a1.1902,1.1902,0,0,0,1.19922,1.29,1.07934,1.07934,0,0,0,1.07129-.5459Zm-3.126-1.45117h2.27441a1.08647,1.08647,0,0,0-1.1084-1.1665A1.15162,1.15162,0,0,0,101.63527,12.03076Z" style="fill: #fff"/>
  </g>
</g>
</g>
</symbol>

<symbol id="icon-user-profile" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>user profile icon</title>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M12,17 C15.2931821,17 18.0354947,18.0156713 20.2347108,19.707376 C21.4743958,20.6609799 22.3058931,21.6231755 22.7648371,22.3365423 L22.8574929,22.4855042 L21.1425071,23.5144958 L21.0609145,23.3889718 L20.9330405,23.2112901 L20.7585202,22.9869193 C20.725526,22.9459372 20.6905731,22.9032376 20.6536537,22.8589344 C20.2105755,22.3272405 19.6651842,21.7925432 19.0152892,21.292624 C17.1520053,19.8593287 14.8318179,19 12,19 C9.16818209,19 6.84799467,19.8593287 4.98471076,21.292624 C4.33481575,21.7925432 3.78942451,22.3272405 3.34634628,22.8589344 L3.24147982,22.9869193 L3.06695952,23.2112901 L2.93908545,23.3889718 L2.85749293,23.5144958 L1.14250707,22.4855042 C1.57740412,21.7606758 2.43705529,20.7290944 3.76528924,19.707376 C5.96450533,18.0156713 8.70681791,17 12,17 Z M12,2 C15.5124319,2 18,4.02687053 18,7.889 C18,11.8773148 15.2624034,15 12,15 C8.7375966,15 6,11.8773148 6,7.889 C6,4.02687053 8.48756815,2 12,2 Z M12,4 C9.5121864,4 8,5.23212947 8,7.889 C8,10.8270185 9.90501006,13 12,13 C14.0949899,13 16,10.8270185 16,7.889 C16,5.23212947 14.4878136,4 12,4 Z" id="Combined-Shape" fill="currentColor" fill-rule="nonzero"></path>
    </g>
</symbol>

<symbol id="icon-sxm-pandora-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 1260.5 121.8" style="enable-background:new 0 0 1260.5 121.8;"
xml:space="preserve">
  <g>
    <g>
      <g>
        <g>
          <g>
            <path class="st0" d="M614.6,9.2L614.6,9.2c10.4,15.2,16,33.1,16,51.7c0,18.6-5.5,36.5-16,51.8c-1.8,2.7-1.2,6.3,1.5,8.1
              c2.7,1.8,6.3,1.2,8.1-1.5c11.8-17.2,18.1-37.4,18.1-58.4c0-20.9-6.2-41.1-18-58.3c-1.8-2.7-5.5-3.4-8.1-1.5
              C613.4,2.9,612.7,6.5,614.6,9.2"/>
            <path class="st0" d="M596,104.7L596,104.7c2.6,1.9,6.3,1.4,8.2-1.2c9.3-12.3,14.2-27,14.2-42.5c0-15.6-5-30.4-14.4-42.8
              c-2-2.6-5.6-3.1-8.2-1.1c-2.6,2-3.1,5.6-1.1,8.2l0,0c7.9,10.3,12,22.7,12,35.7c0,12.9-4.1,25.2-11.8,35.5
              C592.9,99.1,593.4,102.8,596,104.7"/>
            <path class="st0" d="M575.1,90.4L575.1,90.4c2.5,2,6.2,1.6,8.2-0.9c6.5-8.1,10.1-18.3,10.1-28.8c0-10.4-3.4-20.1-9.7-28.3
              c-2-2.6-5.7-3-8.2-1c-2.6,2-3,5.7-1,8.2l0,0c4.7,6.1,7.3,13.3,7.3,21.1c0,7.9-2.6,15.3-7.5,21.4l0,0
              C572.2,84.6,572.6,88.3,575.1,90.4"/>
          </g>
          <g>
            <path class="st0" d="M27.8,112.6c-10.5-15.3-16-33.2-16-51.8c0-18.6,5.5-36.4,16-51.7c1.8-2.7,1.1-6.3-1.5-8.1
              c-2.7-1.8-6.3-1.1-8.1,1.5C6.2,19.8,0,39.9,0,60.8c0,21,6.3,41.2,18.1,58.4l0,0c1.8,2.7,5.5,3.3,8.2,1.5
              C28.9,118.9,29.6,115.3,27.8,112.6C27.8,112.6,29.6,115.3,27.8,112.6C27.8,112.6,29.6,115.3,27.8,112.6L27.8,112.6z"/>
            <path class="st0" d="M47.6,25.3c2-2.6,1.5-6.2-1.1-8.2c-2.6-1.9-6.3-1.5-8.2,1.1l0,0C28.9,30.6,23.9,45.4,23.9,61
              c0,15.5,4.9,30.2,14.2,42.5c1.9,2.6,5.6,3.1,8.2,1.2c2.6-1.9,3.1-5.6,1.2-8.2C39.7,86.2,35.6,74,35.6,61
              C35.6,48,39.8,35.7,47.6,25.3L47.6,25.3L47.6,25.3L47.6,25.3L47.6,25.3z"/>
            <path class="st0" d="M48.8,60.7c0,10.4,3.6,20.6,10.1,28.8c2,2.5,5.7,2.9,8.2,0.9c2.5-2,2.9-5.7,0.9-8.3
              c-4.9-6.1-7.5-13.5-7.5-21.4c0-7.7,2.5-15,7.3-21.1l0,0c2-2.5,1.5-6.2-1-8.2c-2.6-2-6.2-1.6-8.2,1
              C52.1,40.6,48.8,50.3,48.8,60.7C48.8,60.7,48.8,50.3,48.8,60.7C48.8,60.7,48.8,50.3,48.8,60.7L48.8,60.7z"/>
          </g>
        </g>
        <g>
          <path class="st0" d="M105.4,73.7c0,2.7,1,4.8,2.8,6.2c1.7,1.3,4,2.1,6.6,2.1c4.1,0,8.5-1.3,8.5-6.1c0-10.9-41.5-2.2-41.5-28.4
            c0-17.3,18-22.4,32.1-22.4c14.7,0,32.1,3.4,33.6,21.3h-24.4c-0.3-2.2-1.2-3.7-2.6-4.9c-1.4-1.2-3.4-1.7-5.4-1.7
            c-4.7,0-7.6,1.4-7.6,4.8c0,9.4,42.8,3.1,42.8,28.4c0,14.1-11.6,23.7-36.5,23.7c-15.5,0-32.6-4.8-34-23H105.4z"/>
          <path class="st0" d="M154.8,25.2h21.8v10.4h-21.8V25.2z M154.8,95.1v-55h21.8v55H154.8z"/>
          <path class="st0" d="M182.4,40.1h19.9v11.1h0.2c3-8.6,8.4-12.7,16.9-12.7c0.9,0,1.9,0.2,2.8,0.3v21.8c-1.5-0.2-3-0.6-4.5-0.6
            c-8.9,0-13.4,4.2-13.4,16.1v19h-21.8V40.1z"/>
          <path class="st0" d="M226.8,25.2h21.8v10.4h-21.8V25.2z M226.8,95.1v-55h21.8v55H226.8z"/>
          <path class="st0" d="M313.9,95.1h-20.3v-8.1c-5.5,7.6-10.8,9.7-19.8,9.7c-12,0-19.7-7.3-19.7-23.1V40.1h21.8v29.7
            c0,7.6,2.6,10,7.9,10c6.3,0,8.3-4.7,8.3-13.2V40.1h21.8V95.1z"/>
          <path class="st0" d="M337,78c0,2.2,0.8,3.9,2.3,5c1.4,1.1,3.3,1.7,5.4,1.7c3.4,0,6.9-1.1,6.9-4.9c0-8.8-33.7-1.8-33.7-23.1
            c0-14.1,14.6-18.2,26-18.2c12,0,26,2.7,27.3,17.3h-19.8c-0.2-1.8-0.9-3-2.1-4c-1.2-0.9-2.7-1.4-4.4-1.4c-3.8,0-6.2,1.2-6.2,3.9
            c0,7.7,34.8,2.5,34.8,23.1c0,11.4-9.5,19.2-29.6,19.2c-12.6,0-26.5-3.9-27.6-18.7H337z"/>
          <path class="st0" d="M394.7,59.3L372.3,27h29.9l8.5,16.9l9.1-16.9h29.5l-23.1,32.2l23.4,35.6h-30l-9.6-19.4l-9.8,19.4h-29.7
            L394.7,59.3z"/>
          <path class="st0" d="M451.2,27h24.7v10.1c3.4-5.2,9.5-12,19.2-12c11.2,0,18,5.2,21.2,12.4c5.8-8.1,10.9-12.4,20.7-12.4
            c17,0,25.4,11.1,25.4,29.6v40.1h-26.9V60.3c0-10-0.6-14-7.8-13.9c-7.6,0-7.5,6.8-7.5,15v33.5h-26.9V60.3c0-10-0.6-13.8-7.8-14
            c-7.4-0.2-7.6,6.8-7.6,15v33.5h-26.9V27z"/>
        </g>
      </g>
      <g>
        <path class="st0" d="M561.5,14.9c-4,0-7.2,3.2-7.2,7.2v0c0,4,3.2,7.2,7.2,7.2c4,0,7.2-3.2,7.2-7.2v0
          C568.7,18.1,565.5,14.9,561.5,14.9z M561.5,28.4c-3.5,0-6.2-2.7-6.2-6.2v0c0-3.5,2.7-6.3,6.2-6.3c3.5,0,6.2,2.7,6.2,6.2v0
          C567.7,25.6,565,28.4,561.5,28.4z"/>
        <path class="st0" d="M564.8,20.6L564.8,20.6c0-0.7-0.2-1.2-0.6-1.6c-0.5-0.5-1.3-0.8-2.3-0.8h-3.3v7.4h1.4V23h1.5h0l1.8,2.6h1.7
          l-2-2.8C564.1,22.5,564.8,21.8,564.8,20.6z M561.9,21.8H560v-2.4h1.8c0.9,0,1.5,0.4,1.5,1.2v0C563.4,21.3,562.8,21.8,561.9,21.8z
          "/>
      </g>
    </g>
    <g>
      <g id="XMLID_402_">
        <g id="XMLID_403_">
          <path id="XMLID_418_" class="st0" d="M1083.9,38.7c11.9,0,21.6,9.7,21.6,21.6s-9.7,21.6-21.6,21.6c-11.9,0-21.6-9.7-21.6-21.6
            S1072,38.7,1083.9,38.7 M1083.9,24.3c-19.9,0-36,16.1-36,36s16.1,36,36,36c19.9,0,36-16.1,36-36S1103.8,24.3,1083.9,24.3
            L1083.9,24.3z"/>
          <path id="XMLID_415_" class="st0" d="M860.5,26.5v5.9c-6.2-5.1-14.1-8.1-22.7-8.1c-19.9,0-36,16.1-36,36c0,19.9,16.1,36,36,36
            c8.6,0,16.5-3,22.7-8.1v5.9h13.3V26.5H860.5z M838.6,82.7c-12.4,0-22.4-10.1-22.4-22.4s10.1-22.4,22.4-22.4S861,47.9,861,60.3
            S851,82.7,838.6,82.7z"/>
          <path id="XMLID_412_" class="st0" d="M1227.3,26.5v5.9c-6.2-5.1-14.1-8.1-22.7-8.1c-19.9,0-36,16.1-36,36c0,19.9,16.1,36,36,36
            c8.6,0,16.5-3,22.7-8.1v5.9h13.3V26.5H1227.3z M1205.3,82.7c-12.4,0-22.4-10.1-22.4-22.4s10.1-22.4,22.4-22.4
            c12.4,0,22.4,10.1,22.4,22.4S1217.7,82.7,1205.3,82.7z"/>
          <path id="XMLID_411_" class="st0" d="M1143.5,30.8c-7.7,4.9-14.4,13.7-14.4,29.2v34.1h14.4V60h0c0-22.4,23.1-21.2,23.1-21.2
            V24.4v0C1166.6,24.4,1154.1,24,1143.5,30.8z"/>
          <path id="XMLID_410_" class="st0" d="M942.2,31.5c-6-4.5-13.5-7.2-21.6-7.2c-8.1,0-15.6,2.7-21.6,7.2
            c-8.7,6.6-14.4,17-14.4,28.8v33.8H899v-5V60.3c0-11.9,9.7-21.6,21.6-21.6c11.9,0,21.6,9.7,21.6,21.6v28.8v5h14.4V60.3
            C956.6,48.5,950.9,38,942.2,31.5z"/>
          <path id="XMLID_407_" class="st0" d="M1031.6,4.9c-3.7,0-6.6,3-6.6,6.6v20.8c-6.2-5.1-14.1-8.1-22.7-8.1c-19.9,0-36,16.1-36,36
            c0,19.9,16.1,36,36,36c8.6,0,16.5-3,22.7-8.1v5.9h13.3V11.5V4.9H1031.6z M1003,82.7c-12.4,0-22.4-10.1-22.4-22.4
            c0-12.4,10.1-22.4,22.4-22.4s22.4,10.1,22.4,22.4C1025.4,72.6,1015.4,82.7,1003,82.7z"/>
          <path id="XMLID_404_" class="st0" d="M757.4,24.3c-8.6,0-16.5,3-22.7,8.1v-5.9h-13.3V109v6.6h6.6c3.7,0,6.6-3,6.6-6.6V88.2
            c6.2,5.1,14.1,8.1,22.7,8.1c19.9,0,36-16.1,36-36C793.4,40.4,777.3,24.3,757.4,24.3z M756.6,82.7c-12.4,0-22.4-10.1-22.4-22.4
            c0-12.4,10.1-22.4,22.4-22.4S779,47.9,779,60.3C779,72.6,768.9,82.7,756.6,82.7z"/>
        </g>
      </g>
      <g>
        <path class="st0" d="M1253.8,26.5c-3.7,0-6.6-3-6.6-6.6c0-3.7,3-6.6,6.6-6.6c3.7,0,6.6,2.9,6.6,6.6
          C1260.5,23.5,1257.5,26.5,1253.8,26.5z M1253.8,14c-3.2,0-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8c3.2,0,5.8-2.6,5.8-5.8
          C1259.7,16.6,1257.1,14,1253.8,14z M1255.7,23.7l-2-3h-1.5v3h-0.9v-7.6h3.1c1.3,0,2.3,0.9,2.3,2.3c0,1.7-1.5,2.3-1.9,2.3l2,3
          H1255.7z M1254.4,16.9h-2.2v2.9h2.2c0.7,0,1.4-0.6,1.4-1.4C1255.8,17.6,1255.1,16.9,1254.4,16.9z"/>
      </g>
    </g>
  </g>
</symbol>
<symbol id="icon-custom-stations" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="custom-stations-1" transform="translate(6.000000, 8.000000)" stroke="none" stroke-width="1" fill-rule="nonzero">
    <path d="M10.5,8.49745 C10.5,8.9122 10.1625,9.2497 9.74775,9.2497 L6.75225,9.2497 C6.3375,9.2497 6,8.9122 6,8.49745 L6,2.5027 C6,2.08795 6.3375,1.7497 6.75225,1.7497 L9.74775,1.7497 C10.1625,1.7497 10.5,2.08795 10.5,2.5027 L10.5,8.49745 Z M12,4.7497 L12,2.5027 C12,1.2607 10.98975,0.2497 9.74775,0.2497 L6.75225,0.2497 C5.51025,0.2497 4.5,1.2607 4.5,2.5027 L4.5,4.7497 L0,4.7497 L0,6.2497 L4.5,6.2497 L4.5,8.49745 C4.5,9.73945 5.51025,10.7497 6.75225,10.7497 L9.74775,10.7497 C10.98975,10.7497 12,9.73945 12,8.49745 L12,6.2497 L36,6.2497 L36,4.7497 L12,4.7497 Z" ></path>
    <path d="M30,18.2482 C30,18.66295 29.66325,18.9997 29.2485,18.9997 L26.2515,18.9997 C25.83675,18.9997 25.5,18.66295 25.5,18.2482 L25.5,12.25195 C25.5,11.8372 25.83675,11.4997 26.2515,11.4997 L29.2485,11.4997 C29.66325,11.4997 30,11.8372 30,12.25195 L30,18.2482 Z M31.5,12.25195 C31.5,11.00995 30.48975,9.9997 29.2485,9.9997 L26.2515,9.9997 C25.01025,9.9997 24,11.00995 24,12.25195 L24,14.4997 L0,14.4997 L0,15.9997 L24,15.9997 L24,18.2482 C24,19.4902 25.01025,20.4997 26.2515,20.4997 L29.2485,20.4997 C30.48975,20.4997 31.5,19.4902 31.5,18.2482 L31.5,15.9997 L36,15.9997 L36,14.4997 L31.5,14.4997 L31.5,12.25195 Z" ></path>
    <path d="M18,28.00255 C18,28.4143 17.66475,28.7503 17.253,28.7503 L14.247,28.7503 C13.83525,28.7503 13.5,28.4143 13.5,28.00255 L13.5,21.9973 C13.5,21.58555 13.83525,21.2503 14.247,21.2503 L17.253,21.2503 C17.66475,21.2503 18,21.58555 18,21.9973 L18,28.00255 Z M19.5,21.9973 C19.5,20.7583 18.492,19.7503 17.253,19.7503 L14.247,19.7503 C13.008,19.7503 12,20.7583 12,21.9973 L12,24.2503 L0,24.2503 L0,25.7503 L12,25.7503 L12,28.00255 C12,29.24155 13.008,30.2503 14.247,30.2503 L17.253,30.2503 C18.492,30.2503 19.5,29.24155 19.5,28.00255 L19.5,25.7503 L36,25.7503 L36,24.2503 L19.5,24.2503 L19.5,21.9973 Z" ></path>
  </g>
</symbol>
<symbol id="icon-pandora-premium" viewBox="0 0 218 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <polygon id="pandora-premium-1" points="0.00602287166 0 78.9759085 0 78.9759085 31.9930182 0.00602287166 31.9930182"></polygon>
    </defs>
    <g id="Sweetener-Flow-+-Reponsive-Cards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Tokenized:-Confirmation-Expanded" transform="translate(-51.000000, -2023.000000)">
            <g id="Pandora-Offer" transform="translate(16.000000, 1991.000000)">
                <g id="Pandora_Premium_Logo_Black_H" transform="translate(35.000000, 32.000000)">
                    <path d="M204.413963,13.0221222 C204.413963,12.4529717 203.942049,12.0779553 203.42375,12.1036662 C203.055697,12.1036662 202.709829,12.3495618 202.571683,12.7376036 L200.532772,18.2999881 L198.505961,12.7376036 C198.344623,12.2850015 197.930186,12.0779553 197.504656,12.1036662 C197.043834,12.1036662 196.674773,12.5306706 196.674773,13.0221222 L196.674773,20.2273979 C196.674773,20.5767034 196.928881,20.8614486 197.239457,20.8614486 C197.562133,20.8614486 197.815232,20.5767034 197.815232,20.2273979 L197.815232,13.9664024 L200.245388,20.6544024 C200.291773,20.7708376 200.406726,20.8614486 200.52168,20.8614486 C200.671926,20.8614486 200.774779,20.7708376 200.821164,20.6544024 L203.262412,13.9664024 L203.262412,20.2273979 C203.262412,20.5767034 203.516519,20.8614486 203.838187,20.8614486 C204.160864,20.8614486 204.413963,20.5767034 204.413963,20.2273979 L204.413963,13.0221222 Z M193.562963,12.6988674 C193.562963,12.3624739 193.320956,12.0779553 193.01038,12.0779553 C192.664512,12.0779553 192.423513,12.3624739 192.423513,12.6988674 L192.423513,17.3687332 C192.423513,18.8563398 191.697491,19.80062 190.350317,19.80062 C188.991043,19.80062 188.26603,18.8563398 188.26603,17.3687332 L188.26603,12.6988674 C188.26603,12.3624739 188.011922,12.0779553 187.712438,12.0779553 C187.37867,12.0779553 187.125571,12.3624739 187.125571,12.6988674 L187.125571,17.4074694 C187.125571,19.5290134 188.196453,20.938921 190.350317,20.938921 C192.492081,20.938921 193.562963,19.5419255 193.562963,17.3944441 L193.562963,12.6988674 Z M183.681001,12.6988674 C183.681001,12.3624739 183.427902,12.0779553 183.128418,12.0779553 C182.79465,12.0779553 182.541551,12.3624739 182.541551,12.6988674 L182.541551,20.2273979 C182.541551,20.5767034 182.79465,20.8614486 183.105226,20.8614486 C183.427902,20.8614486 183.681001,20.5767034 183.681001,20.2273979 L183.681001,12.6988674 Z M179.094964,13.0221222 C179.094964,12.4529717 178.62305,12.0779553 178.104751,12.1036662 C177.73569,12.1036662 177.39083,12.3495618 177.252684,12.7376036 L175.213773,18.2999881 L173.186962,12.7376036 C173.025624,12.2850015 172.611187,12.0779553 172.184649,12.1036662 C171.724835,12.1036662 171.355774,12.5306706 171.355774,13.0221222 L171.355774,20.2273979 C171.355774,20.5767034 171.608874,20.8614486 171.920458,20.8614486 C172.242126,20.8614486 172.496233,20.5767034 172.496233,20.2273979 L172.496233,13.9664024 L174.925381,20.6544024 C174.971766,20.7708376 175.087728,20.8614486 175.202681,20.8614486 C175.351919,20.8614486 175.45578,20.7708376 175.502165,20.6544024 L177.943413,13.9664024 L177.943413,20.2273979 C177.943413,20.5767034 178.196512,20.8614486 178.519189,20.8614486 C178.841865,20.8614486 179.094964,20.5767034 179.094964,20.2273979 L179.094964,13.0221222 Z M164.167151,15.8163398 L164.167151,13.2939553 L167.737766,13.2939553 C168.014058,13.2939553 168.232873,13.0351475 168.232873,12.7376036 C168.232873,12.4014367 168.014058,12.1554277 167.737766,12.1554277 L163.775906,12.1554277 C163.361469,12.1554277 163.0277,12.5306706 163.0277,12.9964113 L163.0277,19.9429925 C163.0277,20.4085067 163.361469,20.7837496 163.775906,20.7837496 L167.737766,20.7837496 C168.014058,20.7837496 168.232873,20.5379672 168.232873,20.2015738 C168.232873,19.9040298 168.014058,19.6452221 167.737766,19.6452221 L164.167151,19.6452221 L164.167151,16.9548674 L167.657097,16.9548674 C167.933389,16.9548674 168.152204,16.6960596 168.152204,16.3985156 C168.152204,16.0620089 167.933389,15.8163398 167.657097,15.8163398 L164.167151,15.8163398 Z M157.957649,17.3297705 C158.94887,17.1875112 159.869506,16.3467541 159.869506,14.807386 C159.869506,13.2033443 158.868201,12.1554277 157.417166,12.1554277 L154.940625,12.1554277 C154.526188,12.1554277 154.192419,12.5306706 154.192419,12.9964113 L154.192419,20.2273979 C154.192419,20.5767034 154.445519,20.8614486 154.756095,20.8614486 C155.078771,20.8614486 155.33187,20.5767034 155.33187,20.2273979 L155.33187,17.4593443 L156.771813,17.4593443 L158.49914,20.5639046 C158.603001,20.7578122 158.775432,20.8614486 158.959962,20.8614486 C159.29373,20.8614486 159.524646,20.5508793 159.524646,20.2405365 C159.524646,20.1369001 159.501453,20.0334903 159.443977,19.9170551 L157.957649,17.3297705 Z M151.26514,14.807386 C151.26514,13.3714277 150.389881,12.1554277 148.811792,12.1554277 L146.33626,12.1554277 C145.920814,12.1554277 145.587045,12.5306706 145.587045,12.9964113 L145.587045,20.2273979 C145.587045,20.5767034 145.841153,20.8614486 146.151729,20.8614486 C146.474405,20.8614486 146.727505,20.5767034 146.727505,20.2273979 L146.727505,17.4593443 L148.811792,17.4593443 C150.366688,17.4593443 151.26514,16.2431177 151.26514,14.807386 Z M209,9.79920119 L209,26 L143.492675,26 C142.116258,26 141,24.7468495 141,23.2009121 L141,7 L206.508334,7 C207.883742,7 209,8.25315052 209,9.79920119 Z M148.662554,13.2939553 L146.727505,13.2939553 L146.727505,16.3208167 L148.662554,16.3208167 C149.503529,16.3208167 150.090397,15.6999046 150.090397,14.807386 C150.090397,13.9017288 149.503529,13.2939553 148.662554,13.2939553 Z M158.694762,14.807386 C158.694762,15.71293 158.107895,16.3336155 157.26692,16.3336155 L155.33187,16.3336155 L155.33187,13.2939553 L157.26692,13.2939553 C158.107895,13.2939553 158.694762,13.9017288 158.694762,14.807386 L158.694762,14.807386 Z" id="Fill-1" fill="#0A0B09"></path>
                    <path d="M91,6 C86.0293746,6 82,10.4771947 82,16 C82,21.5229171 86.0293746,26 91,26 C95.9705248,26 100,21.5229171 100,16 C100,10.4771947 95.9705248,6 91,6 Z M91,10.0000671 C93.9775246,10.0000671 96.3999396,12.6916394 96.3999396,16 C96.3999396,19.3083606 93.9775246,21.9999329 91,21.9999329 C88.0223748,21.9999329 85.6000604,19.3083606 85.6000604,16 C85.6000604,12.6916394 88.0223748,10.0000671 91,10.0000671 L91,10.0000671 Z" id="Fill-2" fill="#0A0B09"></path>
                    <path d="M29.2000134,22.2222272 C26.1121081,22.2222272 23.6000403,19.431025 23.6000403,16 C23.6000403,12.5690868 26.1121081,9.77777281 29.2000134,9.77777281 C32.2878181,9.77777281 34.7999866,12.5690868 34.7999866,16 C34.7999866,19.431025 32.2878181,22.2222272 29.2000134,22.2222272 Z M34.683853,6.62126108 L34.683853,8.24776643 C33.1340635,6.84321991 31.1558679,6 29.0000503,6 C24.0294527,6 20,10.4771947 20,16 C20,21.5229171 24.0294527,26 29.0000503,26 C31.1558679,26 33.1340635,25.1567801 34.683853,23.7522336 L34.683853,25.3787389 L38,25.3787389 L38,6.62126108 L34.683853,6.62126108 L34.683853,6.62126108 Z" fill="#0A0B09"></path>
                    <path d="M121.200268,22.2222272 C118.111707,22.2222272 115.599799,19.431025 115.599799,16 C115.599799,12.5690868 118.111707,9.77777281 121.200268,9.77777281 C124.287823,9.77777281 126.799732,12.5690868 126.799732,16 C126.799732,19.431025 124.287823,22.2222272 121.200268,22.2222272 Z M126.683999,6.62126108 L126.683999,8.24776643 C125.134183,6.84321991 123.155652,6 121,6 C116.02952,6 112,10.4771947 112,16 C112,21.5229171 116.02952,26 121,26 C123.155652,26 125.134183,25.1567801 126.683999,23.7522336 L126.683999,25.3787389 L130,25.3787389 L130,6.62126108 L126.683999,6.62126108 L126.683999,6.62126108 Z" id="Fill-4" fill="#0A0B09"></path>
                    <path d="M105.457152,7.83874596 C103.603415,9.25756864 102,11.7664596 102,16.2163194 L102,26 L105.457152,26 L105.457152,16.2163194 C105.457152,9.78387626 111,10.1350563 111,10.1350563 L111,6.00100414 C111,6.00100414 107.995168,5.89581197 105.457152,7.83874596" fill="#0A0B09"></path>
                    <path d="M55.3999597,8.06397932 C53.8957582,6.76823653 52.0261485,6 49.9999497,6 C47.9737509,6 46.1042418,6.76823653 44.6000403,8.06397932 C42.4141326,9.94689163 41,12.9442489 41,16.320589 L41,26 L44.6000403,26 L44.6000403,16.320589 C44.6000403,12.906166 47.0224418,10.1281894 49.9999497,10.1281894 C52.9775582,10.1281894 55.3999597,12.906166 55.3999597,16.320589 L55.3999597,26 L59,26 L59,16.320589 C59,12.9442489 57.5857668,9.94689163 55.3999597,8.06397932" id="Fill-6" fill="#0A0B09"></path>
                    <g id="Group-10">
                        <mask id="mask-2" fill="white">
                            <use xlink:href="#pandora-premium-1"></use>
                        </mask>
                        <g id="Clip-8"></g>
                        <path d="M70.1981753,22.4751709 C67.1181792,22.4751709 64.6124638,19.5703855 64.6124638,16 C64.6124638,12.4296145 67.1181792,9.52482909 70.1981753,9.52482909 C73.2782719,9.52482909 75.7840877,12.4296145 75.7840877,16 C75.7840877,19.5703855 73.2782719,22.4751709 70.1981753,22.4751709 Z M77.322028,0 C76.4086595,0 75.6682478,0.858414545 75.6682478,1.91720727 L75.6682478,7.93262545 C74.122277,6.47098182 72.1491842,5.59348364 69.9988183,5.59348364 C65.04069,5.59348364 61.0215273,10.2526836 61.0215273,16 C61.0215273,21.7474327 65.04069,26.4065164 69.9988183,26.4065164 C72.1491842,26.4065164 74.122277,25.5290182 75.6682478,24.0673745 L75.6682478,25.76 L78.9759085,25.76 L78.9759085,0 L77.322028,0 L77.322028,0 Z" fill="#0A0B09" mask="url(#mask-2)"></path>
                        <path d="M8.77773316,22.4751709 C5.69763659,22.4751709 3.19192122,19.5703855 3.19192122,16 C3.19192122,12.4296145 5.69763659,9.52482909 8.77773316,9.52482909 C11.8577294,9.52482909 14.3635451,12.4296145 14.3635451,16 C14.3635451,19.5703855 11.8577294,22.4751709 8.77773316,22.4751709 Z M8.97729098,5.59348364 C6.82672427,5.59348364 4.85363151,6.47098182 3.30776112,7.93262545 L3.30776112,6.24 L0,6.24 L0,32 L1.65388056,32 C2.56724905,32 3.30776112,31.1417018 3.30776112,30.0827927 L3.30776112,24.0673745 C4.85363151,25.5290182 6.82672427,26.4065164 8.97729098,26.4065164 C13.9352186,26.4065164 17.9544816,21.7473164 17.9544816,16 C17.9544816,10.2525673 13.9352186,5.59348364 8.97729098,5.59348364 L8.97729098,5.59348364 Z" id="Fill-9" fill="#0A0B09" mask="url(#mask-2)"></path>
                    </g>
                    <path d="M217.582395,7 L217.582395,3.69083315 L216.462641,7 L216.34391,7 L215.224156,3.69083315 L215.224156,7 L214.805527,7 L214.805527,3 L215.448311,3 L216.403275,5.90907957 L217.35824,3 L218,3 L218,7 L217.582395,7 Z M213.342886,3.47277374 L213.342886,7 L212.925281,7 L212.925281,3.47277374 L212,3.47277374 L212,3 L214.268168,3 L214.268168,3.47277374 L213.342886,3.47277374 Z" id="Fill-11" fill="#0A0B09"></path>
                </g>
            </g>
        </g>
    </g>
</symbol>
<symbol id="icon-password-show" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Assets-/-Icons-/-Utility-/-24px-/-Password-/-Show" stroke="none" stroke-width="1" fill-rule="evenodd">
        <path d="M12,6 C16.2222222,6 19.5555556,8 22,12 C19.5555556,16 16.2222222,18 12,18 C7.77777778,18 4.44444444,16 2,12 C4.44444444,8 7.77777778,6 12,6 Z M15.1272458,8.50546155 L15.1378385,8.51902035 C15.6776779,9.20086139 16,10.0627895 16,11 C16,13.209139 14.209139,15 12,15 C9.790861,15 8,13.209139 8,11 C8,10.056746 8.32649242,9.18974838 8.87263196,8.50585247 C7.15318998,9.11004503 5.67560662,10.2634064 4.40340302,12 C6.38895023,14.7103277 8.87476789,16 12,16 C15.1252321,16 17.6110498,14.7103277 19.596597,12 C18.3243934,10.2634064 16.84681,9.11004503 15.1272458,8.50546155 Z" fill-rule="nonzero"></path>
    </g>
</symbol>
<symbol id="icon-password-hide" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Assets-/-Icons-/-Utility-/-24px-/-Password-/-Hide" stroke="none" stroke-width="1" fill-rule="evenodd">
    <path d="M15,3 L16.7320508,4 L7.73205081,19.5884573 L6,18.5884573 L6.99450628,16.8646027 C5.0459244,15.881498 3.38108897,14.2599638 2,12 C4.44444444,8 7.77777778,6 12,6 C12.4199442,6 12.8310952,6.01978477 13.233453,6.05935432 L15,3 Z M16.6091146,6.94598758 C18.7292093,7.90360925 20.5261711,9.58828006 22,12 C19.5555556,16 16.2222222,18 12,18 C11.4139325,18 10.8449911,17.9614661 10.2931759,17.8843982 L11.3913361,15.9832107 C11.591482,15.994416 11.7943567,16 12,16 C15.1252321,16 17.6110498,14.7103277 19.596597,12 C18.443156,10.4255207 17.1208907,9.33046462 15.6025231,8.68915375 L16.6091146,6.94598758 Z M8.87263196,8.50585247 C7.15318998,9.11004503 5.67560662,10.2634064 4.40340302,12 C5.45424246,13.4344253 6.64520737,14.4709258 7.99692463,15.1289186 L8.91177298,13.5423919 C8.34212825,12.8512441 8,11.9655762 8,11 C8,10.056746 8.32649242,9.18974838 8.87263196,8.50585247 Z M15.4441514,8.96460198 C15.7972941,9.56087739 16,10.2567664 16,11 C16,13.209139 14.209139,15 12,15 L11.959,14.999 L15.4441514,8.96460198 Z" fill-rule="nonzero"></path>
  </g>
</symbol>
<symbol id="icon-external-link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
  <g fill="none" fill-rule="evenodd" stroke-width="2" transform="translate(2 3)">
    <polyline points="0 0 7 0 7 7"/><line x2="7" y2="7" transform="rotate(-90 3.5 3.5)"/>
  </g>
</symbol>
<symbol id="icon-at" viewBox="0 0 24 26" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.784 23.888c2.496 0 4.512-.672 6.36-1.8l-.48-.768c-1.8 1.056-3.504 1.608-5.88 1.608-5.712 0-9.696-4.176-9.696-9.528 0-5.304 4.032-9.576 9.624-9.576 5.472 0 9.336 3.936 9.336 8.376 0 3.192-1.272 4.872-2.832 4.872-.984 0-1.56-.624-1.56-1.416 0-.36.048-.696.096-1.056l1.104-6.192-3.72-.576-.288 1.464c-.624-.984-1.656-1.776-3.216-1.776-2.856 0-5.304 2.808-5.304 6.24 0 2.928 1.896 4.824 4.392 4.824 1.488 0 2.616-.72 3.528-1.776.576.984 1.68 1.824 3.696 1.824 2.616 0 5.112-2.088 5.112-6.432 0-4.92-4.392-9.336-10.344-9.336C5.664 2.864 1.08 7.616 1.08 13.4c0 5.808 4.512 10.488 10.704 10.488zm-.864-8.544c-1.008 0-1.752-.672-1.752-1.872 0-1.512 1.008-2.712 2.304-2.712 1.008 0 1.752.696 1.752 1.824 0 1.536-1.032 2.76-2.304 2.76z"></path>
</symbol>

<symbol id="icon-extended" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4 7)" fill="none">
      <path stroke="#322790" stroke-width="1.6" fill="#FFF" d="M12.424 0v4M4 11.992H0M21.6 2.4l-3.2 3.2M5.6 18.4l-3.2 3.2m.8-19.2l3.2 3.2"></path>
      <ellipse stroke="#322790" stroke-width="1.6" fill="#FFF" cx="12.424" cy="11.88" rx="5.712" ry="5.752"></ellipse>
      <path d="M25.6 7.8a8.096 8.096 0 0 1 8.056 8.2v.112a4.04 4.04 0 0 1-.376 8.048H15.128a5.752 5.752 0 1 1 1.528-11.296C17.872 9.896 22.208 7.8 25.6 7.8m0-1.6c-3.4 0-7.8 1.84-9.8 4.888a6.296 6.296 0 0 0-.672 0 7.352 7.352 0 0 0 0 14.704H33.28A5.648 5.648 0 0 0 35.2 14.8a9.712 9.712 0 0 0-9.6-8.6z" fill="#FFF"></path>
      <path d="M25.6 6.944a8.952 8.952 0 0 1 8.888 8.432 4.896 4.896 0 0 1-1.208 9.64H15.2a6.608 6.608 0 0 1-.056-13.208c.348.001.696.03 1.04.088 1.52-3.024 6.024-4.944 9.432-4.944m-8.456 6.936l-.728-.2a4.8 4.8 0 0 0-1.32-.184 4.904 4.904 0 0 0 0 9.808H33.28a3.203 3.203 0 0 0 .296-6.4l-.8-.064V16a7.256 7.256 0 0 0-7.2-7.328c-2.952 0-7.032 1.784-8.16 4.544l-.28.696M25.6 5.344c-3.544 0-8.096 1.8-10.272 4.864h-.2a8.208 8.208 0 0 0 .072 16.4h18.072a6.496 6.496 0 0 0 2.68-12.416A10.56 10.56 0 0 0 25.6 5.344zm-7.504 10.472l.544-1.32.288-.704c.8-2.032 4.208-3.544 6.672-3.544a5.472 5.472 0 0 1 4 1.672A5.736 5.736 0 0 1 31.2 16v2.352l1.464.136.8.072a1.6 1.6 0 0 1 1.448 1.6 1.6 1.6 0 0 1-1.6 1.6H15.104a3.304 3.304 0 0 1-2.264-5.6 3.2 3.2 0 0 1 2.272-.968c.295-.036.594-.034.888.008l.728.208 1.368.384v.024z" fill="#FFF"></path>
      <path d="M33.648 16.096v-.112A8.096 8.096 0 0 0 25.6 7.8c-3.392 0-7.728 2.096-8.944 5.064a5.752 5.752 0 1 0-1.528 11.296H33.28a4.04 4.04 0 0 0 .368-8.064z" stroke="#322790" stroke-width="1.6" fill="#FFF"></path>
      <path d="M11.096 21.96v6.112h1.336v1.776h-1.336V32H9v-2.152H4.128l-.36-1.552L9.24 21.96h1.856m-4.744 6.112H9V24.96l-2.648 3.112m6.344-7.712H8.512l-.48.552-5.472 6.336-.528.616.176.8.36 1.552.28 1.24H7.4V33.6h5.296v-2.152h1.336v-4.976h-1.336V20.36z" fill="#FFF"></path>
      <path d="M17.08 21.888c2.112 0 3.504 1.192 3.504 2.736a2.4 2.4 0 0 1-1.264 2.184 2.472 2.472 0 0 1 1.6 2.344c0 1.856-1.64 2.936-3.848 2.936s-3.848-1.144-3.848-2.88a2.4 2.4 0 0 1 1.6-2.4 2.4 2.4 0 0 1-1.224-2.16c0-1.528 1.4-2.736 3.504-2.736m0 4.216a1.264 1.264 0 0 0 1.424-1.216 1.264 1.264 0 0 0-1.424-1.168c-.896 0-1.424.544-1.424 1.152a1.272 1.272 0 0 0 1.424 1.224m0 4.232c1.088 0 1.728-.544 1.728-1.24 0-.8-.728-1.224-1.728-1.224s-1.72.456-1.72 1.224c0 .68.64 1.24 1.72 1.24m0-10.048c-2.912 0-5.104 1.864-5.104 4.336a4.128 4.128 0 0 0 .496 2.032 4 4 0 0 0-.84 2.584c0 2.624 2.296 4.504 5.448 4.504 3.152 0 5.448-1.864 5.448-4.536a3.936 3.936 0 0 0-.848-2.536 4 4 0 0 0 .504-2.024c0-2.544-2.144-4.36-5.104-4.36z" fill="#FFF"></path>
      <path d="M25.064 21.6v3.848a2.792 2.792 0 0 1 2.304-1.224c1.68 0 2.664 1.08 2.664 2.832V32h-2.224v-4.256c0-1.032-.504-1.552-1.352-1.552-.848 0-1.392.52-1.392 1.552V32h-2.232V21.6h2.232m1.6-1.6h-5.432v13.6h10.4v-6.544c0-2.656-1.712-4.432-4.264-4.432a4.872 4.872 0 0 0-.704.048V20z" fill="#FFF"></path>
      <path d="M36.088 24.216h.152v2.264h-.12c-1.44 0-2.32.872-2.32 2.688V32h-2.168v-7.632H33.8v1.536a2.352 2.352 0 0 1 2.288-1.688m0-1.6a4.09 4.09 0 0 0-1.12.152h-4.936V33.6H35.4v-4.424c0-1.088.32-1.088.72-1.088h1.72v-5.4l-1.536-.064-.216-.008z" fill="#FFF"></path>
      <path d="M9 29.848H4.128l-.36-1.552L9.24 21.96h1.856v6.112h1.336v1.776h-1.336V32H9v-2.152zm0-1.776V24.96l-2.648 3.112H9zm4.232 1.192a2.4 2.4 0 0 1 1.6-2.4 2.4 2.4 0 0 1-1.232-2.216c0-1.528 1.4-2.736 3.504-2.736s3.504 1.192 3.504 2.736a2.4 2.4 0 0 1-1.264 2.184 2.472 2.472 0 0 1 1.6 2.344c0 1.856-1.64 2.936-3.848 2.936S13.232 31 13.232 29.264zm5.6-.168c0-.8-.728-1.224-1.728-1.224s-1.72.456-1.72 1.224c0 .68.64 1.24 1.72 1.24s1.704-.544 1.704-1.24h.024zm-.304-4.208a1.264 1.264 0 0 0-1.424-1.168c-.896 0-1.424.544-1.424 1.152a1.272 1.272 0 0 0 1.424 1.224 1.264 1.264 0 0 0 1.4-1.208h.024zm4.304-3.288h2.232v3.848a2.792 2.792 0 0 1 2.304-1.224c1.68 0 2.664 1.08 2.664 2.832V32h-2.224v-4.256c0-1.032-.504-1.552-1.352-1.552-.848 0-1.392.52-1.392 1.552V32h-2.232V21.6zm8.8 2.768H33.8v1.536a2.352 2.352 0 0 1 2.4-1.68v2.264h-.12c-1.44 0-2.32.872-2.32 2.688V32h-2.128v-7.632z" fill="#322790"></path>
    </g>
</symbol>

<symbol id="icon-basic-forecast" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFF">
      <path stroke="#322790" stroke-width="1.6" d="M16.424 7v4M8 18.992H4M25.6 9.4l-3.2 3.2M9.6 25.4l-3.2 3.2m.8-19.2l3.2 3.2"></path>
      <ellipse stroke="#322790" stroke-width="1.6" cx="16.424" cy="18.88" rx="5.712" ry="5.752"></ellipse>
      <path d="M29.6 14.8a8.096 8.096 0 0 1 8.056 8.2v.112a4.04 4.04 0 0 1-.376 8.048H19.128a5.752 5.752 0 1 1 1.528-11.296c1.216-2.968 5.552-5.064 8.944-5.064m0-1.6c-3.4 0-7.8 1.84-9.8 4.888a6.296 6.296 0 0 0-.672 0 7.352 7.352 0 0 0 0 14.704H37.28A5.648 5.648 0 0 0 39.2 21.8a9.712 9.712 0 0 0-9.6-8.6z"></path>
      <path d="M29.6 13.944a8.952 8.952 0 0 1 8.888 8.432 4.896 4.896 0 0 1-1.208 9.64H19.2a6.608 6.608 0 0 1-.056-13.208c.348.001.696.03 1.04.088 1.52-3.024 6.024-4.944 9.432-4.944m-8.456 6.936l-.728-.2a4.8 4.8 0 0 0-1.32-.184 4.904 4.904 0 0 0 0 9.808H37.28a3.203 3.203 0 0 0 .296-6.4l-.8-.064V23a7.256 7.256 0 0 0-7.2-7.328c-2.952 0-7.032 1.784-8.16 4.544l-.28.696m8.464-8.568c-3.544 0-8.096 1.8-10.272 4.864h-.2a8.208 8.208 0 0 0 .072 16.4h18.072a6.496 6.496 0 0 0 2.68-12.416A10.56 10.56 0 0 0 29.6 12.344zm-7.504 10.472l.544-1.32.288-.704c.8-2.032 4.208-3.544 6.672-3.544a5.472 5.472 0 0 1 4 1.672A5.736 5.736 0 0 1 35.2 23v2.352l1.464.136.8.072a1.6 1.6 0 0 1 1.448 1.6 1.6 1.6 0 0 1-1.6 1.6H19.104a3.304 3.304 0 0 1-2.264-5.6 3.2 3.2 0 0 1 2.272-.968c.295-.036.594-.034.888.008l.728.208 1.368.384v.024z"></path>
      <path d="M37.648 23.096v-.112A8.096 8.096 0 0 0 29.6 14.8c-3.392 0-7.728 2.096-8.944 5.064a5.752 5.752 0 1 0-1.528 11.296H37.28a4.04 4.04 0 0 0 .368-8.064z" stroke="#322790" stroke-width="1.6"></path>
      <path stroke="#FFF" stroke-width="1.8" d="M26 31.1h-5"></path>
    </g>
</symbol>

<symbol id="icon-buoy" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M33.477 33.274a8.969 8.969 0 1 1-17.937 0h17.937zm-4.271 0h-9.395l1.708-16.23h5.98zm-7.687-16.23l7.687 16.23m-1.708-16.23l-7.687 16.23" stroke="#322790" stroke-width="1.6" fill="#FFF" fill-rule="nonzero"></path>
    <rect stroke="#322790" stroke-width="1.6" fill="#FFF" fill-rule="nonzero" x="18.956" y="11.979" width="11.104" height="5.065" rx="2"></rect>
    <path d="M16.351 40.944a2.033 2.033 0 0 0-2.289 0 4.843 4.843 0 0 1-2.562.94 4.869 4.869 0 0 1-2.563-.94 2.033 2.033 0 0 0-2.374-.009 4.869 4.869 0 0 1-2.563.94m40.88-1.29a2.024 2.024 0 0 0-1.144.35 6.116 6.116 0 0 1-1.196.641 3.647 3.647 0 0 1-1.367.299 3.69 3.69 0 0 1-1.375-.299 6.039 6.039 0 0 1-1.187-.64 2.041 2.041 0 0 0-2.29 0 6.116 6.116 0 0 1-1.195.64 3.297 3.297 0 0 1-2.742 0 6.116 6.116 0 0 1-1.196-.64 2.041 2.041 0 0 0-2.289 0 6.116 6.116 0 0 1-1.196.64 3.297 3.297 0 0 1-2.742 0 6.116 6.116 0 0 1-1.196-.64 2.024 2.024 0 0 0-1.144-.35 1.982 1.982 0 0 0-1.145.35 5.877 5.877 0 0 1-1.196.64c-.431.188-.896.29-1.366.299a3.647 3.647 0 0 1-1.367-.299 6.116 6.116 0 0 1-1.196-.64" stroke="#FFF" stroke-width="6"></path>
    <path d="M16.351 40.944a2.033 2.033 0 0 0-2.289 0 4.843 4.843 0 0 1-2.562.94 4.869 4.869 0 0 1-2.563-.94 2.033 2.033 0 0 0-2.374-.009 4.783 4.783 0 0 1-2.563.94m40.88-1.29a2.024 2.024 0 0 0-1.144.35 6.116 6.116 0 0 1-1.196.641 3.647 3.647 0 0 1-1.367.299 3.69 3.69 0 0 1-1.375-.299 6.039 6.039 0 0 1-1.187-.64 2.041 2.041 0 0 0-2.29 0 6.116 6.116 0 0 1-1.195.64 3.297 3.297 0 0 1-2.742 0 6.116 6.116 0 0 1-1.196-.64 2.041 2.041 0 0 0-2.289 0 6.116 6.116 0 0 1-1.196.64 3.297 3.297 0 0 1-2.742 0 6.116 6.116 0 0 1-1.196-.64 2.024 2.024 0 0 0-1.144-.35 1.982 1.982 0 0 0-1.145.35 5.877 5.877 0 0 1-1.196.64c-.431.188-.896.29-1.366.299a3.647 3.647 0 0 1-1.367-.299 6.116 6.116 0 0 1-1.196-.64M24.526 6l-.026 5.5M28 6v3.417m.796-1.709h-6.833m-.88 1.709a1.708 1.708 0 0 1 0-3.417" stroke="#322790" stroke-width="1.6"></path>
  </g>
</symbol>

<symbol id="icon-cloudechotops" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M38.99 24l-1.91-.048v-.071A8.802 8.802 0 0 0 36 19.653L37.748 19A10.28 10.28 0 0 1 39 23.912l-.01.088zm-3.255-6c-1.446-1.995-3.5-3.41-5.818-4.014l.382-1.627c2.675.698 5.041 2.34 6.701 4.648L35.735 18zm-14.748-1.986L20 14.704c2.11-1.76 4.73-2.714 7.426-2.704h.175v1.669h-.152c-2.346-.015-4.626.813-6.462 2.345zM16.911 23l-.853-.523a5.987 5.987 0 0 0-3.87-.804L12 20.064a7.31 7.31 0 0 1 3.96.587A12.222 12.222 0 0 1 17.832 17L19 18.005a10.93 10.93 0 0 0-1.834 3.974L16.91 23zM6.54 24L5 23.258c.98-1.44 2.48-2.58 4.283-3.258L10 21.373c-1.458.544-2.67 1.464-3.46 2.627zm31.406 11.984H12.308a8.293 8.293 0 0 1-6.62-3.282 8.307 8.307 0 0 1-1.38-7.262l1.544.433a6.697 6.697 0 0 0 1.102 5.875 6.686 6.686 0 0 0 5.354 2.65h25.638a4.445 4.445 0 0 0 2.552-8.086l.92-1.312a6.047 6.047 0 0 1 2.301 6.776A6.04 6.04 0 0 1 37.946 36v-.016z" fill="#33308D"></path>
</symbol>

<symbol id="icon-hi-res-wind" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <path d="M35.796 20.224a5.02 5.02 0 0 0-3.347-4.735 9.204 9.204 0 0 0-17.571-3.163 6.443 6.443 0 0 0-1.189-.343 6.368 6.368 0 0 0-1.322-.126 6.694 6.694 0 1 0 0 13.388h18.409" stroke="#FFF" stroke-width="4"></path>
      <path d="M30.776 26.082H12.367a7.53 7.53 0 1 1 1.431-14.92c.204.036.405.084.603.143a10.04 10.04 0 0 1 18.81 3.598 5.857 5.857 0 0 1 3.422 5.321h-1.674a4.184 4.184 0 0 0-2.811-3.949l-.536-.184v-.552a8.367 8.367 0 0 0-16.023-2.845l-.327.736-.744-.301a6.066 6.066 0 0 0-1.038-.301 5.857 5.857 0 1 0-1.113 11.58h18.409v1.674zm10.877-3.347V21.06a1.673 1.673 0 0 0 1.18-2.853 1.673 1.673 0 0 0-2.853 1.18h-1.674c0-.888.352-1.74.98-2.368a3.43 3.43 0 0 1 4.735 0 3.347 3.347 0 0 1-2.368 5.715z" stroke="#FFF" stroke-width="4"></path>
      <path stroke="#FFF" stroke-width="4" d="M25.755 24.408h13.388v1.673H25.755z"></path>
      <path d="M35.796 20.224a5.02 5.02 0 0 0-3.347-4.735 9.204 9.204 0 0 0-17.571-3.163 6.443 6.443 0 0 0-1.189-.343 6.368 6.368 0 0 0-1.322-.126 6.694 6.694 0 1 0 0 13.388h18.409" stroke="#322790" stroke-width="1.6" fill="#FFF" fill-rule="nonzero"></path>
      <path d="M35.286 27.797a4.242 4.242 0 0 0 0 3.263 4.184 4.184 0 0 0 2.225 2.226 4.242 4.242 0 0 0 3.263 0A4.184 4.184 0 0 0 43 31.102a4.242 4.242 0 0 0 0-3.263 4.184 4.184 0 0 0-2.184-2.268 4.234 4.234 0 0 0-1.673-.326H25.755m15.898-3.381H26.592m12.551-2.511a2.51 2.51 0 1 1 2.51 2.51" stroke="#322790" stroke-width="1.6"></path>
      <path fill="#322790" fill-rule="nonzero" d="M17.287 31.027v-3.69h-1.28v3.69h-4.535V19.329h4.535v3.64h1.28v-3.64h4.535v11.698z"></path>
      <path d="M20.567 20.584v9.204h-2.025v-3.706h-3.79v3.69h-2.025v-9.204h2.025v3.64h3.79v-3.624h2.025m2.51-2.51h-12.86V32.3h12.86V18.074z" fill="#FFF" fill-rule="nonzero"></path>
      <path fill="#322790" fill-rule="nonzero" d="M21.521 30.608v-7.413h-.058v-3.447h3.773v3.447h-.05v7.413z"></path>
      <path d="M24.4 20.584v1.774h-2.1v-1.774h2.1m-.05 2.552v6.636h-1.992v-6.636h1.991m1.724-4.225h-5.447v5.12h.058v7.414h5.339v-7.413h.05V18.91z" fill="#FFF" fill-rule="nonzero"></path>
      <path fill="#FFF" fill-rule="nonzero" d="M24.918 20.718h1.992v8.71h-1.992z"></path>
      <path d="M12.727 31.83h4.184a3.657 3.657 0 0 1 2.71.946c.54.566.827 1.327.796 2.108a2.853 2.853 0 0 1-1.975 2.853l2.293 3.305h-2.41L16.35 38.09h-1.598v2.953h-2.025V31.83zm4.083 4.468c.988 0 1.548-.527 1.548-1.297 0-.837-.602-1.313-1.59-1.313h-2.016v2.644l2.058-.034zm4.803 1.255a3.514 3.514 0 0 1 3.49-3.673c2.359 0 3.438 1.824 3.438 3.824v.527h-4.936a1.673 1.673 0 0 0 1.723 1.389 2.351 2.351 0 0 0 1.716-.728l1.138 1.012a3.514 3.514 0 0 1-2.879 1.323 3.54 3.54 0 0 1-3.69-3.674zm4.979-.594a1.506 1.506 0 0 0-1.49-1.498 1.565 1.565 0 0 0-1.522 1.498h3.012zm2.836 3.146l.837-1.313c.64.497 1.416.788 2.226.836.577 0 .837-.209.837-.527 0-.435-.687-.577-1.465-.837-.987-.292-2.1-.753-2.1-2.125 0-1.43 1.155-2.234 2.577-2.234.94.022 1.855.312 2.636.837l-.745 1.38a4.133 4.133 0 0 0-1.908-.66c-.485 0-.736.209-.736.485 0 .393.67.585 1.44.836.987.327 2.125.837 2.125 2.092 0 1.582-1.163 2.268-2.703 2.268a4.953 4.953 0 0 1-3.02-1.038z" fill="#322790" fill-rule="nonzero"></path>
    </g>
  </symbol>

  <symbol id="icon-high-res-surface" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none">
      <path d="M19.793 39.98a18.36 18.36 0 0 1-2.005-.115 11.852 11.852 0 0 1-2.278-.425c-3.409-.926-6.954-3.22-9.164-8.321A30.234 30.234 0 0 1 4 19.426l.06-1.754 1.238 1.238a5.087 5.087 0 0 0 3.258 1.275c1.439.063 2.875-.17 4.221-.683l1.853-.896-.82 1.883c-.046.106-4.389 10.144-1.14 15.124 1.2 1.853 3.41 2.794 6.515 2.794a24.13 24.13 0 0 0 5.687-.668l.137-.045c8.443-2.103 13.712-8.352 15.883-11.495a15.345 15.345 0 0 1-6.673.037 45.389 45.389 0 0 1-8.58-3.143 3.796 3.796 0 0 1-2.316 3.842l-7.592 3.796-.676-1.351 7.592-3.796a2.551 2.551 0 0 0 1.177-3.546l-.98-2.012 1.998 1.002c.06 0 6.028 2.999 9.68 3.728 4.882.972 7.79-.653 7.82-.668l2.278-1.306-1.214 2.278c-.076.167-5.999 11.206-18.147 14.152-1.777.51-3.617.768-5.466.767zM5.556 20.943a28.89 28.89 0 0 0 2.18 9.567 14.547 14.547 0 0 0 2.9 4.419c-1.7-4.48.197-10.713 1.192-13.553a15.337 15.337 0 0 1-3.272.327 6.264 6.264 0 0 1-3-.76z" fill="#33308D"></path>
      <path d="M14.455 34.687a3.865 3.865 0 0 1-2.559-.835c-3.629-3.037.076-12.824.509-13.933l1.42.547c-1.519 3.796-3.037 10.478-.957 12.224.964.76 3.303 1.018 8.952-2.513a47.894 47.894 0 0 1 12.368-5.436l.372 1.518a47.142 47.142 0 0 0-11.928 5.224c-3.447 2.133-6.165 3.204-8.177 3.204zm18.235-4.612l6.833-1.518.33 1.483-6.834 1.517z" fill="#33308D"></path>
      <path d="M26.019 35.37l1.518 6.074a5.262 5.262 0 0 0 2.278-3.037 8.018 8.018 0 0 0 0-4.555" fill="#FFF"></path>
      <path d="M27.036 42.545l-1.777-6.992 1.519-.365 1.237 4.92a5.39 5.39 0 0 0 1.109-1.944 7.228 7.228 0 0 0 0-4.07l1.45-.485a8.694 8.694 0 0 1 0 5.041 5.968 5.968 0 0 1-2.657 3.47l-.881.425zm-.539-25.617a5.406 5.406 0 0 0-7.03 0l-1.041-1.078a6.917 6.917 0 0 1 9.172 0l-1.07 1.078.538-.54-.57.54z" fill="#33308D"></path>
      <path d="M30.574 13.89a11.571 11.571 0 0 0-15.132 0l-1.07-1.077a13.082 13.082 0 0 1 17.273 0l-1.07 1.078z" fill="#33308D"></path>
      <path d="M34.598 10.854c-6.663-5.78-16.563-5.78-23.226 0l-1.07-1.078A18.822 18.822 0 0 1 22.982 5a18.845 18.845 0 0 1 12.687 4.776l-1.07 1.078z" fill="#33308D"></path>
    </g>
  </symbol>

  <symbol id="icon-radar" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(4 3)" fill="none">
      <path d="M20.476 40.952C9.693 40.952.952 32.424.952 21.905c0-10.52 8.741-19.048 19.524-19.048C31.26 2.857 40 11.385 40 21.905c0 5.052-2.057 9.896-5.718 13.468-3.662 3.573-8.628 5.58-13.806 5.58zm0-36.571c-9.92 0-17.962 7.846-17.962 17.524s8.042 17.524 17.962 17.524 17.962-7.846 17.962-17.524c0-4.648-1.892-9.105-5.26-12.391-3.37-3.287-7.938-5.133-12.702-5.133z" fill="#33308D"></path>
      <path d="M20.952 34.286c-6.837 0-12.38-5.543-12.38-12.381s5.543-12.381 12.38-12.381c6.838 0 12.381 5.543 12.381 12.38a12.381 12.381 0 0 1-12.38 12.382zm0-23.215c-5.983 0-10.833 4.85-10.833 10.834 0 5.983 4.85 10.833 10.833 10.833 5.983 0 10.834-4.85 10.834-10.833A10.833 10.833 0 0 0 20.952 11.07z" fill="#33308D"></path>
      <path d="M20.952 27.619a5.714 5.714 0 1 1 0-11.429 5.714 5.714 0 0 1 0 11.429zm0-9.796a4.082 4.082 0 1 0 0 8.163 4.082 4.082 0 0 0 0-8.163z" fill="#33308D"></path>
      <path fill="#FFF" d="M13.492 16.837l7.937 4.592L5.556 42.857H0V0h23.81z"></path>
      <path fill="#FFF" d="M9.011 1.905L.952 22.024h7.253L.952 39.048h.806l16.923-22.44h-5.64l8.864-14.703"></path>
      <path fill="#33308D" d="M3.27 40H.952l6.954-16.931H.976L9.112 2.013l1.437.554L3.232 21.53h6.977l-5.95 14.49 13.329-18.34h-5.231l9.171-15.776 1.33.77-7.828 13.467h5.586z"></path>
      <circle fill="#FFF" cx="27.619" cy="30.476" r="1.905"></circle>
      <path d="M28.095 33.333a2.38 2.38 0 1 1 0-4.762 2.38 2.38 0 0 1 0 4.762zm0-3.401a1.02 1.02 0 1 0 0 2.04 1.02 1.02 0 0 0 0-2.04z" fill="#33308D"></path>
      <circle fill="#FFF" cx="37.143" cy="11.429" r="1.905"></circle>
      <path d="M36.667 13.333a2.381 2.381 0 1 1 0-4.762 2.381 2.381 0 0 1 0 4.762zm0-3.401a1.02 1.02 0 1 0 0 2.04 1.02 1.02 0 0 0 0-2.04z" fill="#33308D"></path>
    </g>
  </symbol>

  <symbol id="icon-app-access" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <g id="Icons">
      <path d="m50.79,41.6s-4.88-3.97-11.61-6.46c-18.61-6.86,2.94-13.71,2.94-13.71" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <path d="m31.14,38.4c-8.75-11.5,10.98-16.96,10.98-16.96,0,0-1.53-.75-3.37-3.17-1.38-1.82-1.09-3.95-1.09-3.95,0,0-4.99,3.22-7.69,8.73-3.24,6.61-1.34,11.86,1.18,15.35.35.49.69.91,1.02,1.28" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <path d="m50.79,41.6c-1.7-3.49-2.96-10.17-2.96-10.17,0,0-1.5,3.05-4.55,1.55l-7.63-3.75" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <path d="m32.7,51c0,1.65,0,1.1,0,1.1,0,1.59-1.37,2.9-3.05,2.9h-15.91c-1.68,0-3.05-1.3-3.05-2.9V11.9c0-1.59,1.37-2.9,3.05-2.9h15.91c1.68,0,3.05,1.3,3.05,2.9v1.1" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <path d="m53.26,46.21s-1,1-3,1-3-2-4-2-2,2-4,2-3-2-4-2-2,2-4,2-3-2-4-2-2,2-4,2-3-2-4-2-2,2-4,2-3-1-3-1" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <line x1="18.7" y1="13" x2="24.7" y2="13" fill="none" stroke="#33308d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></line>
      <path d="m26.26,42c-2,0-3-2-4-2s-2,2-4,2-3-1-3-1" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <path d="m42.3,52.17c2,0,3-2,4-2s2,2,4,2,3-1,3-1" fill="none" stroke="#33308d" stroke-miterlimit="10" stroke-width="2"></path>
      <rect width="64" height="64" fill="none"></rect>
    </g>
  </symbol>

  <symbol id="icon-surface-temps" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <path d="M27.45 35.588V7.298A3.298 3.298 0 0 0 24.152 4h-.543a3.298 3.298 0 0 0-3.298 3.298v28.28a5.134 5.134 0 0 0-2.148 4.128A5.508 5.508 0 0 0 23.876 45a5.517 5.517 0 0 0 5.704-5.294 5.143 5.143 0 0 0-2.13-4.118z" stroke="#322790" stroke-width="1.6" fill="#FFF" fill-rule="nonzero"></path>
      <path stroke="#322790" stroke-width="1.6" d="M20.293 30.721h3.227m-3.227-5.339h3.227m-3.227-5.339h3.227m-3.227-5.338h3.227m-3.227-5.357h3.227m.026 28.406c.19-.08.393-.12.597-.116.203-.004.403.036.589.116.183.077.35.189.49.33.138.139.25.302.33.48.154.38.154.806 0 1.186m17.879-1.123a5.347 5.347 0 0 1-2.816 1.025 5.348 5.348 0 0 1-2.817-1.025 2.264 2.264 0 0 0-2.513 0 5.294 5.294 0 0 1-2.852 1.025"></path>
      <path d="M38.975 43.618c-.824.601-1.8.956-2.817 1.025a5.428 5.428 0 0 1-2.816-1.025 2.264 2.264 0 0 0-2.514 0 5.348 5.348 0 0 1-2.852 1.025h.205a5.428 5.428 0 0 1-2.79-1.025 2.264 2.264 0 0 0-2.513 0 5.348 5.348 0 0 1-2.835 1.025 5.401 5.401 0 0 1-2.816-1.025 2.246 2.246 0 0 0-2.505 0 5.401 5.401 0 0 1-2.914 1.025 5.428 5.428 0 0 1-2.817-1.025" stroke="#FFF" stroke-width="6"></path>
      <path d="M4.49 38.627a5.35 5.35 0 0 0 2.817 1.025 5.348 5.348 0 0 0 2.816-1.025 2.246 2.246 0 0 1 2.505 0 5.348 5.348 0 0 0 2.87 1.025m23.477 3.966c-.824.601-1.8.956-2.817 1.025a5.428 5.428 0 0 1-2.816-1.025 2.264 2.264 0 0 0-2.514 0 5.348 5.348 0 0 1-2.852 1.025h.205a5.428 5.428 0 0 1-2.79-1.025 2.264 2.264 0 0 0-2.513 0 5.348 5.348 0 0 1-2.835 1.025 5.401 5.401 0 0 1-2.816-1.025 2.246 2.246 0 0 0-2.505 0 5.401 5.401 0 0 1-2.914 1.025 5.428 5.428 0 0 1-2.817-1.025" stroke="#322790" stroke-width="1.6"></path>
    </g>
  </symbol>

  <symbol id="icon-taf" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <path stroke="#322790" stroke-width="1.5" d="M16.183 21.009l5.834-5.835"></path>
      <path fill="#FFF" fill-rule="nonzero" d="M16.123 17.453l2.527-2.527 6.161 6.161-2.527 2.527z"></path>
      <path d="M18.643 16.174l4.93 4.93-1.295 1.296-4.93-4.948 1.295-1.278m0-2.461l-3.756 3.757 7.391 7.39 3.757-3.756-7.392-7.391z" fill="#322790" fill-rule="nonzero"></path>
      <path stroke="#322790" stroke-width="1.5" d="M17.113 23.06l-6.956 6.957-4.792-4.713 6.965-7.026zM31.026 9.148l-6.956 6.956-4.792-4.713 6.965-7.026z"></path>
      <path d="M22.06 31.687a3.313 3.313 0 0 1-2.364-.87c-.87-.87-1.07-2.243-.635-3.956a12.348 12.348 0 0 1 3.33-5.47c2.183-2.191 4.905-3.548 7.087-3.548a3.34 3.34 0 0 1 2.365.87c1.853 1.809.592 6.157-2.695 9.426-2.191 2.183-4.905 3.548-7.087 3.548z" fill="#FFF" fill-rule="nonzero"></path>
      <path d="M29.487 18.713a2.391 2.391 0 0 1 1.74.591c1.573 1.574-.131 5.635-2.705 8.218-2.035 2.035-4.513 3.295-6.47 3.295a2.374 2.374 0 0 1-1.739-.59c-1.583-1.584.122-5.644 2.696-8.218 2.034-2.035 4.513-3.296 6.478-3.296m0-1.74c-2.34 0-5.26 1.357-7.704 3.8-3.696 3.697-4.905 8.48-2.705 10.68a4.087 4.087 0 0 0 2.983 1.104c2.33 0 5.217-1.357 7.696-3.81 3.695-3.695 4.913-8.477 2.704-10.677a4.096 4.096 0 0 0-2.974-1.096z" fill="#322790" fill-rule="nonzero"></path>
      <ellipse stroke="#FFF" stroke-width="3" transform="rotate(-45 27.13 26.116)" cx="27.129" cy="26.116" rx="11.504" ry="4.017"></ellipse>
      <path d="M20.383 33.87a1.07 1.07 0 0 1-.774-.235c-.87-.87.704-5.148 5.295-9.74 3.792-3.79 7.313-5.521 8.966-5.521.277-.028.554.053.773.226.87.913-.704 5.157-5.295 9.748-3.791 3.791-7.305 5.522-8.965 5.522z" fill="#FFF" fill-rule="nonzero"></path>
      <path d="M33.87 19.243h.139c.139.87-1.105 4.305-5.27 8.479-3.478 3.478-6.826 5.27-8.356 5.27h-.13c-.14-.87 1.095-4.349 5.269-8.479 3.478-3.478 6.817-5.27 8.348-5.27m0-1.739c-2.21 0-6.027 2.226-9.566 5.774-4.521 4.496-6.878 9.418-5.304 10.974.375.345.875.52 1.383.487 2.217 0 6.034-2.226 9.565-5.782 4.495-4.487 6.86-9.4 5.295-10.966a1.887 1.887 0 0 0-1.39-.487h.017z" fill="#322790" fill-rule="nonzero"></path>
      <path stroke="#FFF" stroke-width="4" d="M27.052 26.043l5.4 5.905m.374 2.548a2.052 2.052 0 1 1 .018-4.105 2.052 2.052 0 0 1-.018 4.105z"></path>
      <path d="M32.826 31.26a1.183 1.183 0 1 1 0 2.366 1.183 1.183 0 0 1 0-2.365m0-1.74a2.922 2.922 0 1 0 2.93 2.922 2.93 2.93 0 0 0-2.93-2.921z" stroke="#FFF" stroke-width="4"></path>
      <path stroke="#322790" stroke-width="1.5" fill="#322790" fill-rule="nonzero" d="M27.052 26.043l5.4 5.905"></path>
      <path d="M32.826 34.496a2.052 2.052 0 1 1 .018-4.105 2.052 2.052 0 0 1-.018 4.105z" fill="#FFF" fill-rule="nonzero"></path>
      <path d="M32.826 31.26a1.183 1.183 0 1 1 0 2.366 1.183 1.183 0 0 1 0-2.365m0-1.74a2.922 2.922 0 1 0 2.93 2.922 2.93 2.93 0 0 0-2.93-2.921z" fill="#322790" fill-rule="nonzero"></path>
      <path d="M42.635 43.817c-4.252-1.817-10.122-2.93-16.609-2.93-6.487 0-12.33 1.113-16.6 2.93" stroke="#322790" stroke-width="1.5"></path>
    </g>
  </symbol>

  <symbol id="icon-turbulence-icing" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <path d="M34.117 20.333a5 5 0 0 0-3.334-4.716 9.167 9.167 0 0 0-14.166-7.092 9.225 9.225 0 0 0-3.334 3.942 6.233 6.233 0 0 0-1.183-.342A6.342 6.342 0 0 0 10.783 12a6.667 6.667 0 0 0 0 13.333h18.334" stroke="#322790" stroke-width="1.6" fill="#FFF" fill-rule="nonzero"></path>
      <path stroke="#FFF" stroke-width="3.2" d="M25.783 21.133H39.95V22.8H25.783z"></path>
      <path d="M39.95 22.833v-1.666a1.667 1.667 0 1 0-1.175-2.842c-.313.311-.49.734-.492 1.175h-1.666a3.33 3.33 0 0 1 .975-2.358 3.417 3.417 0 0 1 4.716 0 3.333 3.333 0 0 1-2.358 5.691z" stroke="#FFF" stroke-width="3"></path>
      <path stroke="#322790" stroke-width="1.5" d="M37.45 25.25H24.117m9.5 2.5a4.167 4.167 0 0 0 .891 4.575c.382.378.831.68 1.325.892a4.167 4.167 0 0 0 1.617.325 4.217 4.217 0 0 0 1.667-.325 4.267 4.267 0 0 0 1.325-.892c.358-.373.646-.808.85-1.283a4.225 4.225 0 0 0 0-3.25 4.317 4.317 0 0 0-.892-1.325 4.267 4.267 0 0 0-1.325-.892 4.217 4.217 0 0 0-1.667-.325m2.542-3.283H25.783m11.667-2.499a2.5 2.5 0 0 1 4.267-1.767 2.5 2.5 0 0 1-1.767 4.267"></path>
      <path stroke="#FFF" stroke-width="5" d="M22.992 33.708l-5.125-2.958 5.125-2.958 2.725 1.758.9-1.408-2.009-1.284 1.759-1.008-.834-1.45-1.758 1.017-.108-2.384-1.667.075.158 3.242-5.125 2.958V23.4l2.884-1.492-.767-1.483-2.117 1.1V19.5h-1.666v2.025l-2.117-1.1-.758 1.483 2.875 1.492v5.908L10.25 26.35l.15-3.242-1.667-.075-.108 2.384-1.75-1.017-.833 1.45 1.75 1.008-2.009 1.284.9 1.408 2.734-1.758 5.116 2.958-5.116 2.958-2.734-1.758-.9 1.408 2.009 1.284-1.75 1.008.833 1.45 1.75-1.017.108 2.384 1.667-.075-.15-3.242 5.117-2.958V38.1l-2.875 1.492.758 1.483 2.117-1.092V42h1.666v-2.017l2.117 1.092.767-1.483-2.884-1.492v-5.908l5.125 2.958L22 38.392l1.667.075.108-2.384 1.758 1.017.834-1.45-1.759-1.008 2.009-1.284-.9-1.408z"></path>
      <path stroke="#322790" stroke-width="1.5" d="M16.2 19.5V42m3.333-20.833L16.2 22.892l-3.333-1.725m0 19.166l3.333-1.725 3.333 1.725M6.458 25.125l19.484 11.25m-16.375-13.3l-.175 3.742-3.159 2.025m16.6 9.583l.175-3.742 3.159-2.025m-.225 3.717L6.458 25.125"></path>
      <path stroke="#322790" stroke-width="1.5" d="M22.833 38.425l.175-3.742 3.159-2.025m-16.6-9.583l-.175 3.742-3.159 2.025m.225 7.533l19.484-11.25M6.233 32.658l3.159 2.025.175 3.742m16.6-9.583l-3.159-2.025-.175-3.742"></path>
    </g>
  </symbol>

<symbol id="icon-wind-waves" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M34.094 10.036a6.97 6.97 0 0 0-6.962-6.56 6.888 6.888 0 0 0-3.854 1.164 7.02 7.02 0 0 0-2.534 3.01 4.756 4.756 0 0 0-.902-.263 4.641 4.641 0 0 0-.959-.098 5.092 5.092 0 0 0 0 10.184h13.94" stroke="#FFF" stroke-width="4"></path>
    <path d="M32.848 18.088h-13.94a5.74 5.74 0 1 1 0-11.48c.363 0 .725.033 1.082.099l.46.115A7.601 7.601 0 0 1 34.716 9.56a4.321 4.321 0 0 1 1.73 1.46c.541.761.828 1.674.82 2.608H36.02a3.165 3.165 0 0 0-2.132-3.002l-.369-.13v-.427a6.339 6.339 0 0 0-12.136-2.181l-.246.565-.566-.23a4.617 4.617 0 0 0-.82-.229 4.453 4.453 0 1 0-.82 8.823h13.94l-.024 1.271z" stroke="#FFF" stroke-width="4"></path>
    <path d="M36.652 13.63a3.121 3.121 0 0 0-.672-2.008 4.427 4.427 0 0 0-1.886-1.59 6.968 6.968 0 0 0-6.962-6.556 6.89 6.89 0 0 0-3.854 1.164 7.016 7.016 0 0 0-2.534 3.008 4.758 4.758 0 0 0-.902-.263 4.644 4.644 0 0 0-.959-.098 5.09 5.09 0 0 0-5.092 5.09 5.09 5.09 0 0 0 5.092 5.089h13.94" stroke="#322790" stroke-width="1.55" fill="#FFF" fill-rule="nonzero"></path>
    <path d="M36.857 19.007a2.501 2.501 0 0 0 0 1.984c.124.307.308.586.542.82.236.23.514.415.82.541.31.136.645.206.984.205.341.002.679-.068.992-.205.305-.126.584-.31.82-.54a2.46 2.46 0 0 0 .541-.82 2.501 2.501 0 0 0 0-1.985 2.46 2.46 0 0 0-.541-.82 2.591 2.591 0 0 0-.82-.55 2.46 2.46 0 0 0-.992-.196H31.06" stroke="#322790" stroke-width="1.6"></path>
    <path d="M39.26 12.545a1.583 1.583 0 0 1 3.165 0c0 .874-.708 1.583-1.582 1.583h-9.84" stroke="#FFF" stroke-width="5.1"></path>
    <path d="M39.26 12.545a1.583 1.583 0 0 1 3.165 0c0 .874-.708 1.583-1.582 1.583h-9.84" stroke="#322790" stroke-width="1.6"></path>
    <path d="M8.92 19.917a12.923 12.923 0 0 1 9.84-4.1c4.1 0 8.069 3.165 9.299 4.395.738.738 3.92 3.543 3.92 5.798" stroke="#FFF" stroke-width="6"></path>
    <path d="M19.58 22.377s-5.51-.697-5.51 4.715c0 5.945 7.166 9.225 7.166 9.225" stroke="#322790" stroke-width="1.6"></path>
    <path d="M44.32 35.243l-.337-.238a2.706 2.706 0 0 0-3.23 0l-.337.238a8.003 8.003 0 0 1-4.297 1.64 8.003 8.003 0 0 1-4.288-1.64l-.336-.238a2.722 2.722 0 0 0-3.28 0l-.328.238a8.003 8.003 0 0 1-4.297 1.64 7.979 7.979 0 0 1-4.289-1.64h-.04a2.763 2.763 0 0 0-3.535.246l-.328.32c-1.173 1.09-2.739 2.173-4.297 2.173-6.281-.009-6.363-8.988-6.281-9.045a12.3 12.3 0 0 1 4.1-9.02 12.923 12.923 0 0 1 9.84-4.1c1.568 0 3.116.463 4.5 1.103 2.235 1.035 4.04 2.533 4.799 3.292.391.392 1.47 1.364 2.397 2.528.82 1.03 1.522 2.21 1.522 3.27 0 3.28-2.173-1.083-5.436-1.083-3.264 0-4.387 3.042-4.855 3.198-.598.205-1.287 0-1.287-.82 0-5.74-.82-8.2-6.56-8.2-9.02 0-9.02 9.84-9.02 9.84" stroke="#322790" stroke-width="1.6"></path>
    <path d="M28.6 20.737c-2.46-2.46-6.084-4.92-9.84-4.92a12.628 12.628 0 0 0-9.84 4.1c-2.837 2.78-4.1 5.74-4.1 9.02m35.932 11.537l-.336.197A9.11 9.11 0 0 1 36.12 42a9.11 9.11 0 0 1-4.288-1.329l-.336-.197a3.165 3.165 0 0 0-3.231 0l-.336.197A9.11 9.11 0 0 1 23.63 42a9.077 9.077 0 0 1-4.289-1.329h-.04a3.198 3.198 0 0 0-3.576.238l-.246.205a7.626 7.626 0 0 1-4.297 1.763 5.74 5.74 0 0 1-3.928-1.328" stroke="#322790" stroke-width="1.6"></path>
  </g>
</symbol>

<symbol id="icon-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-10 2V6m0 10v2" stroke-width="2" fill="none"></path>
</symbol>

  <symbol viewBox="0 0 24 24" id="icon-audio-pause-button">
    <g>
        <g>
            <path d="M12,0 C18.6264,0 24,5.3724 24,12 C24,18.6276 18.6264,24 12,24 C5.3736,24 0,18.6276 0,12 C0,5.3724 5.3736,0 12,0 Z M12,1.5 C6.20158948,1.5 1.5,6.20126474 1.5,12 C1.5,17.7987353 6.20158948,22.5 12,22.5 C17.7984105,22.5 22.5,17.7987353 22.5,12 C22.5,6.20126474 17.7984105,1.5 12,1.5 Z M11.25,8.25 L11.25,15.75 L9,15.75 L9,8.25 L11.25,8.25 Z M15,8.25 L15,15.75 L12.75,15.75 L12.75,8.25 L15,8.25 Z"></path>
        </g>
    </g>
  </symbol>

  <symbol viewBox="0 0 24 24" id="icon-audio-play-button">
    <g>
        <path d="M12,0 C18.6264,0 24,5.3724 24,12 C24,18.6276 18.6264,24 12,24 C5.3736,24 0,18.6276 0,12 C0,5.3724 5.3736,0 12,0 Z M12,1.5 C6.20158948,1.5 1.5,6.20126474 1.5,12 C1.5,17.7987353 6.20158948,22.5 12,22.5 C17.7984105,22.5 22.5,17.7987353 22.5,12 C22.5,6.20126474 17.7984105,1.5 12,1.5 Z M9.75,8.25 L15.75,12 L9.75,15.75 L9.75,8.25 Z"></path>
    </g>
  </symbol>

  <symbol viewBox="0 0 24 24" id="icon-audio-replay-button">
    <g>
        <path d="M12,4.5 C16.5563492,4.5 20.25,8.19365081 20.25,12.75 C20.25,17.3063492 16.5563492,21 12,21 C7.51597382,21 3.86747612,17.4226773 3.75278055,12.9663056 L3.75,12.75 L5.25,12.75 C5.25,16.4779221 8.27207794,19.5 12,19.5 C15.7279221,19.5 18.75,16.4779221 18.75,12.75 C18.75,9.08864798 15.8348897,6.10815643 12.1990217,6.00287783 L12,6 L12,4.5 Z M10.5,1.25 L10.5,9.25 L5.25,5.25 L10.5,1.25 Z"></path>
    </g>
  </symbol>

  <symbol id="icon-vip-perks" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <g stroke="none" stroke-width="1" fill-rule="evenodd">
      <path d="M17.4177367,9.47436837 L17.5674988,9.57098268 L32.0280433,19.866166 L60.0062638,25.0207777 C60.426627,25.09284 60.8050951,25.3119676 61.0771732,25.6352688 L61.1740895,25.7613062 C61.4494442,26.1540252 61.5568362,26.6408686 61.4704689,27.1180991 L61.4704689,27.1180991 L60.126658,34.349624 L59.2325504,34.2826023 C57.9019461,34.1828612 56.7110763,35.102752 56.4687658,36.4270376 C56.2126502,37.7387252 56.9870334,39.0344536 58.2634778,39.4302672 L58.2634778,39.4302672 L59.1072343,39.6919082 L57.9507006,46.1568475 C57.7698037,47.1372641 56.8310585,47.7861027 55.8461252,47.6088509 L55.8461252,47.6088509 L43.012573,45.2459256 C43.100809,45.3802591 43.2014312,45.5068937 43.3134955,45.6241156 L43.4568321,45.7632466 L44.1197662,46.3603192 L40.3270516,51.6787345 C40.0503398,52.1061754 39.6062511,52.3954332 39.1039716,52.4765187 C38.658063,52.5485039 38.2031066,52.4507635 37.8602476,52.2286442 L22.8530433,41.530166 L15.4054519,40.1587266 C14.4751645,39.9866872 13.8422317,39.1299284 13.9348426,38.1936005 L13.9555573,38.0451863 L14.4440433,35.521166 L4.25561174,28.2749315 C3.85942355,27.9987318 3.59204344,27.5748803 3.51387775,27.1035638 C3.44293622,26.6897383 3.51973545,26.2661792 3.72411062,25.9084915 L3.81945197,25.7594501 L7.59743295,20.3859468 L8.29194883,20.5999328 C9.36254227,20.9297913 10.5241851,20.5403639 11.1782595,19.6318873 C11.794774,18.7765245 11.8330605,17.6413632 11.2922587,16.7511767 L11.184072,16.5872656 L10.7688252,16.0065653 L15.0509225,9.99836418 C15.3262351,9.60889751 15.7444176,9.34450207 16.2193143,9.26084468 C16.6347801,9.1899595 17.058565,9.26733195 17.4177367,9.47436837 Z M27.4990433,42.386166 L38.768,50.42 L41.508,46.578 L41.4265728,46.4697845 C41.077566,45.9744994 40.8271921,45.4140067 40.6921844,44.8183963 L40.6920433,44.816166 L27.4990433,42.386166 Z M19.44,19.581 L18.377,25.35 L18.4995941,25.4507866 C19.6649448,26.4570585 20.263522,27.9955531 20.0551305,29.5490848 L20.0551305,29.5490848 L20.0198448,29.7710644 C19.718644,31.4108149 18.5643145,32.7361493 17.033936,33.2822784 L17.033936,33.2822784 L16.907,33.324 L15.957,38.226 L23.5520433,39.624166 L23.5780334,39.5909923 L23.6510433,39.643166 L56.016,45.606 L56.842,40.991 L56.6840525,40.9030252 C55.0979566,39.9640463 54.192871,38.139703 54.4667586,36.2712089 L54.4667586,36.2712089 L54.5036214,36.0554654 C54.8634352,34.0884109 56.4325879,32.6203879 58.3356158,32.3283153 L58.3356158,32.3283153 L58.471,32.31 L59.466,26.954 L31.3740433,21.778166 L31.3375012,21.8302173 L31.2270433,21.751166 L19.44,19.581 Z M16.568,11.314 L13.189,16.055 L13.2745655,16.2343101 C13.899527,17.6406782 13.7857262,19.2877672 12.9342936,20.6057326 L12.8010466,20.8008877 C11.8232814,22.1589549 10.2037325,22.860395 8.58321452,22.6911913 L8.434,22.671 L5.565,26.752 L14.8620433,33.363166 L15.1988135,31.6284161 L15.8907345,31.5187324 C16.9862428,31.3450719 17.8524572,30.5001663 18.0527979,29.4095035 C18.2530125,28.3209719 17.7431568,27.2236648 16.7809504,26.6735227 L16.7809504,26.6735227 L16.1654151,26.3215901 L17.5287282,18.9323792 C17.71871,18.1456725 18.4085811,17.5868647 19.2052538,17.5510708 L19.2052538,17.5510708 L19.335,17.55 L19.4430817,17.556957 L19.508,17.564 L19.568455,17.5719454 L27.3750433,19.009166 L16.568,11.314 Z" fill-rule="nonzero"></path>
      <path d="M49.2476,26.375 L49.0576,26.375 C48.5306,26.27 48.1816,25.766 48.2676,25.235 L48.4876,24.235 C48.5956,23.684 49.1296,23.322 49.6826,23.431 C50.2346,23.538 50.5956,24.073 50.4876,24.625 L50.2976,25.625 C50.1776,26.098 49.7336,26.415 49.2476,26.375"></path>
      <path d="M48.3174,31.4053 L48.1274,31.4053 C47.8584,31.3663 47.6174,31.2193 47.4584,30.9993 C47.3004,30.7783 47.2384,30.5033 47.2874,30.2353 L47.6774,28.2353 C47.7474,27.8783 48.0024,27.5853 48.3464,27.4673 C48.6904,27.3483 49.0714,27.4233 49.3464,27.6623 C49.6204,27.9003 49.7474,28.2683 49.6774,28.6253 L49.2774,30.6253 C49.1634,31.0863 48.7414,31.4043 48.2674,31.3853 L48.3174,31.4053 Z M47.3174,36.4053 L47.1274,36.4053 C46.8634,36.3593 46.6304,36.2103 46.4784,35.9893 C46.3254,35.7693 46.2684,35.4983 46.3174,35.2353 L46.7074,33.2353 C46.8154,32.6833 47.3504,32.3223 47.9024,32.4303 C48.4544,32.5383 48.8154,33.0733 48.7074,33.6253 L48.3174,35.6253 C48.2074,36.0933 47.7784,36.4183 47.2974,36.3953 L47.3174,36.4053 Z M46.3174,41.4053 C46.2544,41.4153 46.1904,41.4153 46.1274,41.4053 C45.5864,41.3003 45.2334,40.7763 45.3374,40.2353 L45.7274,38.2353 C45.7954,37.8783 46.0484,37.5843 46.3924,37.4653 C46.7354,37.3443 47.1164,37.4173 47.3924,37.6543 C47.6674,37.8913 47.7954,38.2583 47.7274,38.6153 L47.3374,40.6153 C47.2354,41.0923 46.8044,41.4263 46.3174,41.4053 L46.3174,41.4053 Z"></path>
      <path d="M45.5474,45.3955 L45.3474,45.3955 C44.8114,45.2895 44.4594,44.7735 44.5574,44.2355 L44.7474,43.2355 C44.8524,42.6835 45.3854,42.3205 45.9374,42.4255 C46.4894,42.5305 46.8524,43.0635 46.7474,43.6155 L46.5574,44.6155 C46.4514,45.0835 46.0274,45.4125 45.5474,45.3955"></path>
    </g>
  </symbol>
  <symbol id="icon-chat-phx" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c5.487 0 10 3.761 10 8.5 0 4.74-4.513 8.5-10 8.5-.547 0-1.094-.041-1.642-.12l-.43-.072L5 22.766v-5.204l-.076-.063c-1.77-1.506-2.833-3.527-2.918-5.713L2 11.5C2 6.761 6.513 3 12 3zm0 2c-4.455 0-8 2.955-8 6.5 0 1.825.945 3.542 2.599 4.778l.401.3v2.655l2.569-1.54.386.082c.69.148 1.37.225 2.045.225 4.455 0 8-2.954 8-6.5C20 7.955 16.455 5 12 5zm-4 5a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" fill-rule="nonzero"/></symbol>
  <symbol id="icon-old-phone" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>phone icon</title>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M12.2867957,6.87258212 L7.19745305,1.78323949 L6.5527864,2.10557281 C1.50254341,4.63069431 0.779721911,9.14128554 5.61992466,14.8924022 L6.06146972,15.403054 C6.4415071,15.8312485 6.85181787,16.2660314 7.29289322,16.7071068 C7.73396857,17.1481821 8.16875154,17.5584929 8.59694597,17.9385303 L9.10759784,18.3800753 C14.8587145,23.2202781 19.3693057,22.4974566 21.8944272,17.4472136 L22.2167605,16.802547 L17.1274179,11.7132043 L16.4452998,12.1679497 C16.0287113,12.4456754 15.5215802,12.8789068 15.0793335,13.2831536 L14.6644713,13.6709059 L14.3274046,13.9983374 L14.0192476,14.3136748 L14.0021474,14.2955777 L13.9371267,14.2487338 L13.8765746,14.2115393 C13.7982007,14.1653479 13.7114265,14.1075058 13.6149426,14.0367909 L13.4086403,13.8778353 L13.1741171,13.6823799 C13.1325488,13.6466416 13.0897077,13.609292 13.0455451,13.5702857 L12.7643254,13.3160069 L12.2779411,12.8552888 L11.9072532,12.4921085 L11.5078915,12.0927468 L11.1447112,11.7220589 L10.6839931,11.2356746 L10.4297143,10.9544549 L10.2151941,10.7049482 C10.1826333,10.6658772 10.1516386,10.6280305 10.1221647,10.5913597 L9.9632091,10.3850574 C9.91606584,10.3207348 9.8746438,10.2607276 9.83858092,10.2046479 L9.7512662,10.0628733 L9.7044223,9.99785257 L9.68506427,9.98010109 L9.85375607,9.82060976 L10.0016626,9.67259539 C10.0961976,9.57704342 10.2076191,9.462769 10.3290941,9.33552867 L10.7168464,8.92066653 C11.1210932,8.47841976 11.5543246,7.97128875 11.8320503,7.5547002 L12.2867957,6.87258212 Z M6.821,4.236 L9.666,7.081 L9.51806379,7.25256381 L9.13135505,7.67881834 L8.15713578,8.7138777 L8.05475224,8.83001811 C8.04296142,8.84439489 8.03397216,8.85614266 8.02803201,8.86505289 C7.36285942,9.86281178 7.54425175,10.6709067 8.80982134,12.1393297 L9.12122976,12.4903053 L9.47177861,12.8670458 L10.0724097,13.4855436 L10.5144564,13.9275903 L10.9341967,14.3380665 C11.0016517,14.4031184 11.0678881,14.4664988 11.1329542,14.5282214 L11.5096947,14.8787702 L11.8606703,15.1901787 C13.3290933,16.4557482 14.1371882,16.6371406 15.1349471,15.971968 L15.1728922,15.9428523 L15.2903146,15.8390266 L16.3236877,14.8663263 L16.6066924,14.6076949 L16.918,14.333 L19.763,17.178 L19.6969922,17.2907192 C17.5709829,20.7465603 14.1856753,20.6620682 8.96944663,15.5525629 L8.70710678,15.2928932 C3.34173163,9.92751807 3.19584238,6.46445063 6.70928084,4.30300779 L6.821,4.236 Z" fill="currentColor" fill-rule="nonzero"></path>
    </g>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" id="icon-info" viewBox="0 0 24 24" fill="currentColor">
  <path
    d="M12.004 1c6.076 0 11 4.925 11 11s-4.924 11-11 11c-6.075 0-11-4.925-11-11s4.925-11 11-11zm0 2a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm1 7v6h1v2h-3v-6h-1v-2h3zm0-4v2h-2V6h2z"
    fill-rule="nonzero" />
  </symbol>

  <symbol id="icon-tiktok" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve" viewBox="0 0 24 24">
    <g id="icon" transform="translate(-1.9444444444444287 -1.9444444444444287) scale(3.89 3.89)">
      <path d="M5.6,2.5c-0.3,0-0.5-0.1-0.7-0.2C4.6,2.1,4.5,1.8,4.4,1.5c0-0.1,0-0.1,0-0.2H3.6v2.1l0,1.1c0,0.3-0.2,0.6-0.5,0.6
        c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.3-0.1C2.4,5,2.3,4.8,2.3,4.5c0-0.4,0.3-0.7,0.7-0.7c0.1,0,0.1,0,0.2,0V3.3V3.1
        c-0.1,0-0.1,0-0.2,0c-0.4,0-0.8,0.2-1.1,0.5C1.7,3.8,1.5,4.1,1.5,4.4c0,0.4,0.1,0.8,0.4,1.1c0,0,0.1,0.1,0.1,0.1
        C2.3,5.8,2.6,5.9,3,5.9c0.1,0,0.1,0,0.2,0c0.3,0,0.6-0.2,0.8-0.4c0.3-0.3,0.4-0.6,0.4-1l0-1.7C4.5,2.9,4.7,3,4.8,3.1
        c0.2,0.1,0.5,0.2,0.7,0.2V2.7L5.6,2.5C5.6,2.5,5.6,2.5,5.6,2.5L5.6,2.5z"></path>
    </g>
  </symbol>

  <symbol id="icon-ad-free" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
      <title>Icon Ad-Free</title>
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <path d="M8.595,11.285 L37.067,34.921 L45.328,41.804 L45.326,41.778 L47.471,43.558 L47.474,43.593 L50.2888498,45.9398554 L50.292,45.901 L52.12,47.418 L52.115,47.46 L56.6401844,51.2317787 L55.3598156,52.7682213 L51.764,49.772 L51.7554977,49.8278497 L51.6467675,50.4178858 L51.5340605,50.9722631 L51.5051993,51.1052842 L51.4760474,51.2360756 L51.3563653,51.73694 C50.8062225,53.9105341 50.094385,55 49,55 C48.4425403,55 47.9851415,54.7188871 47.5979766,54.1570558 L47.574746,54.1374358 L47.2460702,53.8779727 L46.1731882,53.0449845 L45.3891861,52.4482508 C43.0736032,50.699517 40.6043048,48.9507697 38.0867726,47.32011 C35.748714,45.8056992 33.4848482,44.4699007 31.3402955,43.3617469 C27.7535999,41.5083953 24.6292693,40.3588128 22.1191532,40.0463849 L22,40.033 L22,42.069 C22,42.7869484 22.1933095,43.4901148 22.5572349,44.1057524 L22.7016602,44.3323716 L24.6375294,47.1547797 L24.6802929,47.2687799 C25.6499626,49.8537536 24.3392656,52.7204512 21.7811049,53.6958572 L21.576572,53.7688941 L21.3467851,53.8444973 C19.8721589,54.3370023 18.2771847,53.6208862 17.6557957,52.2175566 L17.614,52.117 L14.9426052,46.7492731 C14.3743351,45.6065449 14.0558433,44.3580859 14.0067077,43.0863517 L14,42.739 L14,41 L16,41 L16,42.739 C16,43.7128664 16.2033187,44.675035 16.5955143,45.5646219 L16.7332218,45.8583792 L19.4202218,51.2563792 L19.4615201,51.3513862 C19.6363468,51.8183634 20.1257107,52.079067 20.6067209,51.9763361 L20.717428,51.9461059 L20.9477722,51.8703167 C22.5030764,51.351882 23.3434771,49.6876764 22.866192,48.1423676 L22.842,48.073 L21.0521788,45.4633936 C20.4196018,44.5405624 20.0583282,43.4614421 20.0064907,42.3480039 L20,42.069 L20,39.819 L10.7942425,38.8403919 L10.6245395,38.8073124 C8.55271305,38.2136382 7.10277386,36.3649617 7.00524158,34.2298175 L7,34 L7,30 C7,27.8447534 8.37940886,25.9419158 10.4064313,25.2607973 L10.626057,25.1925395 L10.7845967,25.160798 L20.8128678,23.9858912 L20.819,23.984 L7.3598156,12.7682213 L8.595,11.285 Z M47.7713072,46.4471491 C47.7870705,46.5761702 47.8030485,46.703989 47.8192387,46.8305711 L47.8893939,47.3615597 L48.0064524,48.1754922 C48.2457368,49.7539854 48.5151672,51.0321175 48.7992877,51.9355445 C48.8436167,52.0764988 48.8878541,52.2067264 48.9322517,52.3278766 L48.999,52.503 L49.0562528,52.3586116 L49.145379,52.1061061 L49.2127414,51.8970415 C49.320068,51.5512473 49.4252225,51.1521478 49.5273839,50.703769 L49.6034309,50.3583079 L49.7274727,49.7424983 L49.7881329,49.416283 L49.8478266,49.0781518 L49.9641363,48.3670157 L49.976,48.283 L47.7713072,46.4471491 Z M22.8839403,25.7071232 C22.5844635,25.7654037 22.2895628,25.8160049 21.9993435,25.8587973 L22,38.02 L22.3581422,38.0605286 C25.0221325,38.3892705 28.1858712,39.5247882 31.7674451,41.3340584 L32.2584238,41.5849407 C34.4657586,42.7255358 36.7845929,44.0937686 39.1740591,45.6414772 C41.6702144,47.2582905 44.1153999,48.9861233 46.4148288,50.7167912 L46.3997068,50.6494688 L46.372051,50.5103364 L46.2637798,49.9319332 L46.1588686,49.3185374 L46.0567799,48.6701562 L45.9569761,47.9867966 L45.8359728,47.0887602 C45.735443,46.3031116 45.6429891,45.4721554 45.5591613,44.6035861 L22.8839403,25.7071232 Z M52.8685983,38.226 L52.8560426,38.5655183 L52.7866738,39.962867 C52.6881199,41.7580392 52.5570207,43.4695819 52.3967461,45.0491806 L50.5333735,43.5032068 C50.6664881,41.9719463 50.7733642,40.3341484 50.8510694,38.6308113 L52.8685983,38.226 Z M49,9 C50.0487856,9 50.7462386,10.0005685 51.2867393,11.9970076 L51.3563653,12.26306 L51.4760474,12.7639244 L51.5051993,12.8947158 L51.5340605,13.0277369 L51.6467675,13.5821142 L51.7554977,14.1721503 L51.8607896,14.7978324 L51.9631819,15.4591474 L52.0632131,16.1560823 L52.1845642,17.0732949 C52.4178342,18.931153 52.606287,21.0338226 52.7430208,23.2823554 L52.7866738,24.037133 L52.8560426,25.4344817 L52.8685983,25.774 L50.8511152,25.3701917 C50.7166348,22.4218344 50.4947558,19.6698103 50.2006852,17.3267291 L50.1302384,16.7835969 L50.1032934,16.5850406 L50.0760454,16.3891628 L49.9641363,15.6329843 L49.9354575,15.4509093 L49.9065092,15.2716768 L49.7881329,14.583717 L49.7579208,14.4191062 L49.7274727,14.2575017 L49.6034309,13.6416921 C49.477664,13.0507335 49.3468997,12.5352013 49.2127414,12.1029585 C49.1677671,11.9580563 49.1228547,11.8241212 49.0784253,11.7016603 L49.0121961,11.526638 L48.999999,11.496 L48.9215747,11.7016603 C48.8771453,11.8241212 48.8322329,11.9580563 48.7872586,12.1029585 C48.679932,12.4487527 48.5747775,12.8478522 48.4726161,13.296231 L48.3965691,13.6416921 L48.2725273,14.2575017 L48.2118671,14.583717 L48.1521734,14.9218482 L48.0358637,15.6329843 L47.9239546,16.3891628 L47.8697616,16.7835969 C47.5104779,19.4641196 47.2495285,22.7340995 47.1117008,26.2466014 L51.9707066,27.4619003 C53.6850479,27.8908066 54.9067515,29.3904563 54.9948965,31.1400601 L55,31.343 L55,32.657 C55,34.4246168 53.8417904,35.9738484 52.1661398,36.4839436 L51.9705356,36.5381425 L47.112,37.752 L47.1257084,38.0989217 L47.1895399,39.4638507 L47.264,40.788 L45.166,39.045 L45.1588086,38.8902368 L45.1278941,38.1927856 L45.0758139,36.7786821 L45.0648556,36.4215855 L45.0547326,36.0632079 L45.022698,34.6183601 L45.0077001,33.5248819 L45.0005983,32.4251763 L45.0018342,31.256236 C45.007326,30.1420405 45.0251023,29.03506 45.054515,27.9445873 L45.0877824,26.8599613 L45.1439574,25.4344817 L45.2133262,24.037133 C45.3512387,21.525039 45.5528818,19.1767091 45.809021,17.1245374 L45.8874884,16.5179031 L45.9367869,16.1560823 L46.0368181,15.4591474 L46.1392104,14.7978324 L46.2445023,14.1721503 L46.3532325,13.5821142 L46.417,13.266 L46.5739498,13.1500882 C44.1992939,14.9268502 41.6510274,16.7035308 39.0271414,18.3632189 C36.1449668,20.1862823 33.3448454,21.7564387 30.6877342,22.998067 C29.5812475,23.5151116 28.5093529,23.9707085 27.4749917,24.361242 L25.6885877,22.8767945 C26.9969587,22.4331614 28.384163,21.8669086 29.8410433,21.1861303 C32.4142583,19.9837055 35.1425803,18.4538103 37.9580059,16.6729676 C40.5341309,15.0434899 43.0404374,13.2960643 45.3757762,11.5487201 L46.1657224,10.9525436 L46.8994874,10.3889474 L47.6035778,9.8366711 C47.9901365,9.27912109 48.4460639,9 49,9 Z M20,26.094 L11.108,27.136 L11.0028184,27.1706414 C9.86580566,27.5711158 9.07791614,28.6155334 9.00545731,29.8184366 L9,30 L9,34 C9,35.2779038 9.80851262,36.4082647 11.0023385,36.8294093 L11.104,36.862 L20,37.808 L20,26.094 Z M47.0461545,28.2921349 C47.0216785,29.2726612 47.006727,30.2662946 47.0018041,31.265983 L46.999999,31.9985904 L47.0043837,33.1435792 C47.0109914,34.005104 47.0250258,34.8612865 47.0461542,35.707593 L51.4852934,34.5979003 C52.3230227,34.3883111 52.9255968,33.6671635 52.9935892,32.8176871 L53,32.657 L53,31.343 C53,30.4789795 52.4467041,29.719336 51.6396814,29.4473346 L51.4854644,29.4021425 L47.0461545,28.2921349 Z" fill-rule="nonzero"></path>
      </g>
  </symbol>

  <symbol id="icon-business-channels" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
      <title>Icon Exclusive Business Channels</title>
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <path d="M44.7817,10 C46.5273856,10 47.9997,11.2623113 47.9997,12.901 L47.9997,12.901 L47.9997,49.099 C47.9997,50.7376887 46.5273856,52 44.7817,52 L44.7817,52 L9.2187,52 C7.47222525,52 5.9997,50.737901 5.9997,49.099 L5.9997,49.099 L5.9997,12.901 C5.9997,11.262099 7.47222525,10 9.2187,10 L9.2187,10 Z M44.7817,12 L9.2187,12 C8.51422633,12 7.9997,12.4409997 7.9997,12.901 L7.9997,12.901 L7.9997,49.099 C7.9997,49.5590003 8.51422633,50 9.2187,50 L9.2187,50 L44.7817,50 C45.4852723,50 45.9997,49.5589476 45.9997,49.099 L45.9997,49.099 L45.9997,12.901 C45.9997,12.4410524 45.4852723,12 44.7817,12 L44.7817,12 Z M39,16.6980884 L39,36.8887 L38.9987,36.888 L39,36.9375 C39,39.6275775 36.6328864,41.7661901 33.7247399,41.8714395 L33.5,41.8755 C30.4900604,41.8755 28,39.6965539 28,36.9375 C28,34.1784461 30.4900604,31.9995 33.5,31.9995 C34.8230808,31.9995 36.0457094,32.4205209 37.0005488,33.1267657 L37,19.3 L24,22.767 L24,40.8887 L23.9987,40.888 L24,40.9375 C24,43.6275775 21.6328864,45.7661901 18.7247399,45.8714395 L18.5,45.8755 C15.4900604,45.8755 13,43.6965539 13,40.9375 C13,38.1784461 15.4900604,35.9995 18.5,35.9995 C19.8230808,35.9995 21.0457094,36.4205209 22.0005488,37.1267657 L22,21.2314217 L39,16.6980884 Z M18.5,37.9995 C16.5396643,37.9995 15,39.3467948 15,40.9375 C15,42.5282052 16.5396643,43.8755 18.5,43.8755 C20.4603357,43.8755 22,42.5282052 22,40.9375 C22,39.3467948 20.4603357,37.9995 18.5,37.9995 Z M33.5,33.9995 C31.5396643,33.9995 30,35.3467948 30,36.9375 C30,38.5282052 31.5396643,39.8755 33.5,39.8755 C35.4603357,39.8755 37,38.5282052 37,36.9375 C37,35.3467948 35.4603357,33.9995 33.5,33.9995 Z M53,14 L53,52 L51,52 L51,14 L53,14 Z M58,18 L58,52 L56,52 L56,18 L58,18 Z" fill-rule="nonzero"></path>
      </g>
  </symbol>

  <symbol id="icon-sxm-app" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
      <title>Icon SXM App</title>
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <path d="M48,7.0194 C52.9702847,7.0194 57,11.0491153 57,16.0194 L57,16.0194 L57,48.0194 C57,52.9896847 52.9702847,57.0194 48,57.0194 L48,57.0194 L16,57.0194 C11.0297153,57.0194 7,52.9896847 7,48.0194 L7,48.0194 L7,16.0194 C7,11.0491153 11.0297153,7.0194 16,7.0194 L16,7.0194 Z M48,9.0194 L16,9.0194 C12.1342847,9.0194 9,12.1536847 9,16.0194 L9,16.0194 L9,48.0194 C9,51.8851153 12.1342847,55.0194 16,55.0194 L16,55.0194 L48,55.0194 C51.8657153,55.0194 55,51.8851153 55,48.0194 L55,48.0194 L55,16.0194 C55,12.1536847 51.8657153,9.0194 48,9.0194 L48,9.0194 Z M25.0724,44.3022 C27.1164,45.7072 29.5154,46.4502 32.0074,46.4502 C34.3284,46.4502 36.5684,45.8062 38.5164,44.5842 L38.9294,44.3132 L39.0534,44.2442 C39.3934,44.0912 39.8044,44.1992 40.0214,44.5162 C40.2664,44.8742 40.1744,45.3632 39.8184,45.6072 C37.5124,47.1852 34.8124,48.0192 32.0074,48.0192 C29.1964,48.0192 26.4904,47.1812 24.1814,45.5962 C23.8244,45.3512 23.7324,44.8612 23.9804,44.5052 C24.2254,44.1472 24.7144,44.0572 25.0724,44.3022 Z M37.8654,41.7942 C38.1274,42.1402 38.0604,42.6322 37.7144,42.8952 C36.0544,44.1562 34.0724,44.8222 31.9814,44.8222 C29.9094,44.8222 27.9404,44.1672 26.2884,42.9252 C25.9804,42.6932 25.8904,42.2782 26.0574,41.9452 L26.1314,41.8252 L26.2264,41.7192 C26.5004,41.4662 26.9234,41.4382 27.2314,41.6692 C28.6094,42.7062 30.2524,43.2522 31.9814,43.2522 C33.7254,43.2522 35.3794,42.6962 36.7644,41.6432 C37.1104,41.3812 37.6014,41.4492 37.8654,41.7942 Z M29.1594,38.9102 C29.9794,39.5702 30.9724,39.9202 32.0274,39.9202 C33.0614,39.9202 34.0384,39.5842 34.8494,38.9482 C35.1914,38.6792 35.6854,38.7412 35.9524,39.0832 C36.2194,39.4232 36.1614,39.9182 35.8174,40.1862 C34.7264,41.0392 33.4174,41.4902 32.0274,41.4902 C30.6304,41.4902 29.2614,41.0082 28.1744,40.1342 C27.8364,39.8622 27.7824,39.3682 28.0534,39.0302 L28.1524,38.9272 C28.4334,38.6842 28.8574,38.6682 29.1594,38.9102 Z M19.1934,27.1332 C21.1684,27.1332 23.4894,27.5852 23.6974,29.9932 L20.4224,29.9932 C20.3874,29.6982 20.2664,29.4902 20.0764,29.3342 C19.8854,29.1782 19.6264,29.1092 19.3484,29.1092 C18.7254,29.1092 18.3274,29.2992 18.3274,29.7502 C18.3274,31.0142 24.0604,30.1662 24.0604,33.5602 C24.0604,35.4492 22.5024,36.7302 19.1744,36.7302 C17.0964,36.7302 14.8104,36.0892 14.6204,33.6472 L18.0494,33.6472 C18.0494,34.0112 18.1884,34.2892 18.4304,34.4792 C18.6564,34.6522 18.9674,34.7562 19.3144,34.7562 C19.8684,34.7562 20.4584,34.5832 20.4584,33.9422 C20.4584,32.4872 14.8964,33.6472 14.8964,30.1312 C14.8964,27.8102 17.3044,27.1332 19.1934,27.1332 Z M27.9074,27.3942 L29.0504,29.6632 L30.2634,27.3942 L34.2134,27.3942 L31.1124,31.7082 L34.2474,36.4702 L30.2284,36.4702 L28.9464,33.8732 L27.6304,36.4702 L23.6454,36.4702 L26.9024,31.7242 L23.9064,27.3942 L27.9074,27.3942 Z M45.9724,27.1352 C48.2564,27.1352 49.3804,28.6242 49.3804,31.1002 L49.3804,36.4702 L45.7774,36.4702 L45.7774,31.8462 C45.7774,30.5112 45.6904,29.9752 44.7374,29.9782 C43.8174,29.9800182 43.7395488,30.7347289 43.7329973,31.6916185 L43.7324,36.4702 L40.1294,36.4702 L40.1294,31.8462 C40.1294,30.5112 40.0504,30.0012 39.0904,29.9762 C38.1463545,29.9523364 38.0806645,30.8095616 38.0766431,31.8364276 L38.0764,36.4702 L34.4724,36.4702 L34.4724,27.3942 L37.7824,27.3942 L37.7824,28.7452 C38.2324,28.0522 39.0514,27.1352 40.3514,27.1352 C41.8534,27.1352 42.7624,27.8272 43.1954,28.7962 C43.9754,27.7062 44.6584,27.1362 45.9724,27.1352 Z M32.0274,22.5522 L32.4044,22.5632 C33.6534,22.6372 34.8264,23.0812 35.8174,23.8572 C36.1614,24.1252 36.2194,24.6182 35.9524,24.9612 C35.6854,25.3002 35.1914,25.3622 34.8494,25.0952 C34.0384,24.4592 33.0614,24.1242 32.0274,24.1242 C30.9724,24.1242 29.9794,24.4722 29.1594,25.1312 C28.8194,25.4052 28.3264,25.3502 28.0534,25.0132 C27.7824,24.6752 27.8364,24.1802 28.1744,23.9082 C29.2614,23.0342 30.6304,22.5522 32.0274,22.5522 Z M31.9814,19.2202 C34.0724,19.2202 36.0544,19.8872 37.7144,21.1482 C38.0604,21.4112 38.1274,21.9032 37.8654,22.2492 C37.6014,22.5942 37.1104,22.6602 36.7644,22.3982 C35.3794,21.3462 33.7254,20.7912 31.9814,20.7912 C30.2524,20.7912 28.6094,21.3382 27.2314,22.3732 C26.8854,22.6342 26.3924,22.5632 26.1314,22.2172 C25.8724,21.8702 25.9424,21.3782 26.2884,21.1182 C27.9404,19.8762 29.9094,19.2202 31.9814,19.2202 Z M32.0074,16.0192 C34.8124,16.0192 37.5124,16.8542 39.8184,18.4332 C40.1744,18.6782 40.2664,19.1692 40.0214,19.5252 C39.7774,19.8832 39.2884,19.9752 38.9294,19.7302 C36.8874,18.3312 34.4944,17.5922 32.0074,17.5922 C29.6814,17.5922 27.4364,18.2382 25.4854,19.4672 L25.0724,19.7402 L25.0654,19.7442 L25.0624,19.7472 L24.9484,19.8092 C24.6084,19.9622 24.1984,19.8552 23.9804,19.5382 C23.7324,19.1802 23.8244,18.6902 24.1814,18.4452 C26.4904,16.8582 29.1964,16.0192 32.0074,16.0192 Z" fill-rule="nonzero"></path>
      </g>
  </symbol>

  <symbol id="icon-talk-microphone" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
      <title>Icon Talk Microphone</title>
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <path d="M33.3563,4 C35.9379361,4 38.0958987,5.96202448 38.3400594,8.52475638 L38.3400594,8.52475638 L39.931,24 L42.781,24 L43.0056086,21.894237 L44.9943914,22.105763 L43.4545502,36.5809924 C43.1590907,40.1287876 40.2534207,42.8755604 36.7208082,42.9958872 L36.479,43 L27.521,43 C23.9609144,43 20.9826972,40.3320671 20.5716343,36.8429109 L19.0056086,22.105763 L20.9943914,21.894237 L21.218,24 L24.069,24 L25.6597633,8.53262486 C25.8962516,6.03797619 27.936111,4.11596 30.4166229,4.00505822 L30.6433,4 Z M24.097,26 L21.431,26 L22.5385502,36.4150076 C22.7482304,38.9327896 24.7980872,40.8856165 27.2991797,40.9951513 L27.521,41 L36.479,41 C39.0054343,41 41.121484,39.1191097 41.4401874,36.6147921 L42.568,26 L39.889,26 L39.2470488,33.0500084 C39.0964269,36.0581736 37.6509276,37.8900569 35.4604695,37.9952125 L35.2593,38 L28.7403,38 C26.6711334,38 24.943079,36.4215973 24.7553911,34.3495659 L24.7553911,34.3495659 L24.097,26 Z M37.879,26 L26.102,26 L26.7482196,34.1807549 C26.8319525,35.1048079 27.5362299,35.8352055 28.4273575,35.9755817 L28.5864667,35.9941485 L28.7403,36 L35.2593,36 C36.3777946,36 37.1431993,35.0740121 37.2524078,32.9094534 L37.2524078,32.9094534 L37.879,26 Z M32.0855407,5.9994657 L30.6433,6 C30.0387601,6 29.472988,6.17907667 28.9989295,6.48951623 C28.9999875,6.49288355 29,6.49643103 29,6.5 C29,7.21626298 28.4978808,7.81578884 27.8257232,7.96455474 C27.7351255,8.20455814 27.6754618,8.46133752 27.6500594,8.72924362 L27.6500594,8.72924362 L27.1023604,14.053249 C27.2289814,14.0185377 27.3623114,14 27.5,14 C28.329,14 29,14.672 29,15.5 C29,16.328 28.329,17 27.5,17 C27.2537177,17 27.0213804,16.9406902 26.8164388,16.8356002 L26.2079585,22.7375166 C26.4689443,22.2961621 26.9496555,22 27.5,22 C28.329,22 29,22.672 29,23.5 C29,23.6758617 28.9697306,23.8446861 28.9141069,24.0015292 L32.0858931,24.0015292 C32.0302694,23.8446861 32,23.6758617 32,23.5 C32,22.672 32.671,22 33.5,22 C34.329,22 35,22.672 35,23.5 C35,23.6758617 34.9697306,23.8446861 34.9141069,24.0015292 L37.918,24 L37.5658518,20.5554975 C37.2940941,20.8299349 36.9170398,21 36.5,21 C35.671,21 35,20.328 35,19.5 C35,18.672 35.671,18 36.5,18 C36.8066465,18 37.0916746,18.0919467 37.3291205,18.2497246 L36.7862105,12.9727409 C36.693573,12.9906304 36.597888,13 36.5,13 C35.671,13 35,12.328 35,11.5 C35,10.6787181 35.6601557,10.0109149 36.479853,10.0001324 L36.3498089,8.72185477 C36.2600314,7.77964893 35.7422851,6.9736033 34.9998651,6.48852005 L35,6.5 L35,6.5 C35,7.328 34.329,8 33.5,8 C32.671,8 32,7.328 32,6.5 C32,6.3245101 32.0301416,6.15602779 32.0855407,5.9994657 Z M30.5,18 C31.329,18 32,18.672 32,19.5 C32,20.328 31.329,21 30.5,21 C29.671,21 29,20.328 29,19.5 C29,18.672 29.671,18 30.5,18 Z M33.5,14 C34.329,14 35,14.672 35,15.5 C35,16.328 34.329,17 33.5,17 C32.671,17 32,16.328 32,15.5 C32,14.672 32.671,14 33.5,14 Z M30.5,10 C31.329,10 32,10.672 32,11.5 C32,12.328 31.329,13 30.5,13 C29.671,13 29,12.328 29,11.5 C29,10.672 29.671,10 30.5,10 Z M33,45 L33,53 L40.36,53 C41.7306791,53 42.9189285,53.9266957 43.2626276,55.2378894 L43.302614,55.4110506 L43.819,58 L46,58 L46,60 L18,60 L18,58 L20.18,58 L20.6974597,55.410682 C20.9663974,54.0674319 22.1087409,53.0847674 23.4623048,53.0052108 L23.64,53 L31,53 L31,45 L33,45 Z M40.36,55 L23.64,55 C23.2025182,55 22.8209218,55.282759 22.6884276,55.6891652 L22.658614,55.8029494 L22.219,58 L41.78,58 L41.3414597,55.803318 C41.255786,55.3754075 40.903507,55.0569893 40.4777825,55.0068912 L40.36,55 Z" fill-rule="nonzero"></path>
      </g>
  </symbol>

  <symbol id="icon-video-collections" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
      <title>Icon Video Collections</title>
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <path d="M46.9966,13.9999 C48.6551165,13.9999 49.9996,15.3448471 49.9996,17.0039 L49.9996,17.0039 L49.9996,44.9999 C49.9996,46.6589529 48.6551165,48.0039 46.9966,48.0039 L46.9966,48.0039 L7.0036,48.0039 C5.34431525,48.0039 3.9996,46.6591847 3.9996,44.9999 L3.9996,44.9999 L3.9996,17.0039 C3.9996,15.3446153 5.34431525,13.9999 7.0036,13.9999 L7.0036,13.9999 Z M46.9966,15.9999 L7.0036,15.9999 C6.44888475,15.9999 5.9996,16.4491847 5.9996,17.0039 L5.9996,17.0039 L5.9996,44.9999 C5.9996,45.5546153 6.44888475,46.0039 7.0036,46.0039 L7.0036,46.0039 L46.9966,46.0039 C47.5503927,46.0039 47.9996,45.5545378 47.9996,44.9999 L47.9996,44.9999 L47.9996,17.0039 C47.9996,16.4492622 47.5503927,15.9999 46.9966,15.9999 L46.9966,15.9999 Z M19.5739,23.9961 C19.5739,22.8716167 20.7707975,22.1606617 21.7670645,22.6722663 L21.7670645,22.6722663 L36.1940173,30.1497608 C37.2396832,30.6931546 37.2396832,32.0735547 36.3670835,32.7892826 L36.3670835,32.7892826 L36.1930645,32.9039337 L21.6394994,40.4470507 L21.4984796,40.4745771 C20.5631492,40.6571491 19.5739,39.9743663 19.5739,38.9491 L19.5739,38.9491 Z M21.573,24.824 L21.573,38.228 L34.504,31.526 L21.573,24.824 Z M55,18 L55,48.004 L53,48.004 L53,18 L55,18 Z M60,22 L60,48.004 L58,48.004 L58,22 L60,22 Z" fill-rule="nonzero"></path>
      </g>
  </symbol>

  <symbol id="icon-additional-subscriptions" viewBox="0 0 36 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-4.000000, -4.000000)" stroke-width="1.245">
              <g transform="translate(4.980000, 4.980000)">
                  <g >
                      <path d="M4.70533738,20.6429294 L0.804269975,20.6429294 C0.360083933,20.6429294 0,20.2828454 0,19.8386594 L0,0.804269975 C0,0.360083933 0.360083933,0 0.804269975,0 L26.4068642,0 C26.8510502,0 27.2111341,0.360083933 27.2111341,0.804269975 L27.2111341,4.67698444 L27.2111341,4.67698444" ></path>
                      <path d="M15.8186115,25.3345042 L5.62988982,25.3345042 C5.11167278,25.3345042 4.69157485,24.9144063 4.69157485,24.3961892 L4.69157485,5.62988982 C4.69157485,5.11167278 5.11167278,4.69157485 5.62988982,4.69157485 L30.964394,4.69157485 C31.4826111,4.69157485 31.902709,5.11167278 31.902709,5.62988982 L31.902709,12.865"  stroke-linecap="round"></path>
                      <g transform="translate(8.444835, 13.072508)" stroke-linecap="round">
                          <line x1="-1.37608443e-14" y1="0.592777608" x2="9.68333333" y2="0.592777608" ></line>
                          <line x1="1.89211609e-14" y1="5.00537423" x2="4.93849991" y2="5.00537423" ></line>
                      </g>
                      <line x1="8.44483474" y1="8.74122354" x2="11.4079347" y2="8.74122354" stroke-linecap="round"></line>
                  </g>
                  <g transform="translate(17.936300, 13.827800)">
                      <path d="M15.6787004,7.95970026 C15.6787004,12.1998738 12.2402771,15.6372003 8.00120035,15.6372003 C3.76102678,15.6372003 0.323700351,12.1998738 0.323700351,7.95970026 C0.323700351,3.71952669 3.76102678,0.282200259 8.00120035,0.282200259 C12.2402771,0.282200259 15.6787004,3.71952669 15.6787004,7.95970026 Z"></path>
                      <line x1="4.47370035" y1="8.16720026" x2="11.9437004" y2="8.16720026" stroke-linecap="round"></line>
                      <line x1="8.15811952" y1="11.9323992" x2="8.15811952" y2="4.46239922" stroke-linecap="round"></line>
                  </g>
              </g>
          </g>
      </g>
  </symbol>

  <symbol id="icon-aviation" viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <g transform="translate(-1518.000000, -3890.000000)">
              <g transform="translate(1514.000000, 3886.000000)">
                  <g transform="translate(4.375000, 4.375000)">
                      <path d="M24.375,23.125 C25.679637,23.125 26.6777722,23.695363 27.375,24.625 C27.583266,24.902688 27.7439856,25.1793593 27.864339,25.4350652 L27.9471475,25.6226019 L27.963125,25.664375 L28.0386921,25.6778703 C30.567564,26.1926298 30.8490802,30.2993802 28.4212835,30.606806 L28.2554116,30.6215913 L28.125,30.625 L20,30.625 C18.6511954,30.625 17.9170818,29.2235103 18.1312816,27.7241117 C18.3259391,26.3615092 19.2262772,25.3088304 20.6004309,25.0574008 L20.7907305,25.0281275 L20.8375,25.023125 L20.8906568,24.932098 C20.9723958,24.7961514 21.0725653,24.6532298 21.1932424,24.5081115 L21.3208324,24.362438 L21.4330583,24.2455583 C22.1343268,23.5442898 23.1126695,23.125 24.375,23.125 Z M24.375,24.375 C23.4498305,24.375 22.7875482,24.6588352 22.3169417,25.1294417 C22.0814348,25.3649487 21.9379988,25.5962184 21.8704515,25.7516046 L21.8429271,25.8226424 L21.7004745,26.25 L21.25,26.25 C20.1752435,26.25 19.5094456,26.9157979 19.3687184,27.9008883 C19.2556357,28.6924677 19.5384967,29.2954417 19.922037,29.3677214 L20,29.375 L28.125,29.375 C29.2298467,29.375 29.071999,27.0388889 27.6514569,26.8831481 L27.5,26.875 L27.0120147,26.875 L26.8936609,26.4015848 L26.8737855,26.3336183 L26.8382969,26.231507 L26.7863582,26.0997596 C26.6831232,25.8519956 26.5466584,25.6038779 26.375,25.375 C25.9003528,24.742137 25.257863,24.375 24.375,24.375 Z M3.18705635,16.0288682 L9.02751076,20.2647418 L13.3395259,26.1771701 L10.2076657,29.3090302 L6.99152315,26.1309814 L6.78490726,26.2381937 L6.54884068,26.3540003 L6.16346488,26.534104 L5.8915748,26.6557701 L5.47135655,26.8360951 L5.18883337,26.9521968 L4.84157811,27.0897786 C4.78552506,27.1115269 4.73037394,27.1326751 4.67611052,27.1532093 L4.36106852,27.2689367 C3.1933688,27.6834717 2.48020507,27.758651 2.04843326,27.3268792 C1.636382,26.914828 1.68489887,26.2380448 2.04422355,25.1671285 L2.14981465,24.8651913 L2.27014261,24.5431269 C2.29138784,24.4877399 2.31321897,24.4314899 2.33562194,24.3743648 L2.46296748,24.0555563 L2.58260431,23.7674714 L2.76590682,23.3460137 L2.88828632,23.0775235 L3.00889847,22.8233133 L3.12610646,22.5870645 C3.14526651,22.549391 3.16421652,22.5126192 3.18292239,22.4768259 L3.22152315,22.4039814 L0.0705231541,19.290963 L3.18705635,16.0288682 Z M3.336875,17.68125 L1.823125,19.265625 L10.201875,27.54625 L11.699375,26.04875 L8.134375,21.160625 L3.336875,17.68125 Z M4.15552315,23.3269814 L4.19257431,23.2496004 C3.98399378,23.6751155 3.75787168,24.1822739 3.56528018,24.6642103 C3.3663525,25.1620023 3.21174306,25.6105673 3.11799315,25.9701349 L3.06928532,26.1744299 L3.0434818,26.3087991 L3.04,26.33125 L3.11362457,26.3187939 L3.27490311,26.2836771 C3.65525112,26.1926168 4.15483323,26.0214733 4.72113538,25.7929907 C5.10421652,25.6384313 5.5049837,25.4626281 5.87248058,25.2902676 L6.05252315,25.2029814 L4.15552315,23.3269814 Z M16.6185542,19.4954175 L20.9935542,22.6897925 L20.2564458,23.6993325 L15.8814458,20.5049575 L16.6185542,19.4954175 Z M24.1919417,13.9330583 L25.9375232,15.6789814 L26.4330583,15.1830583 L27.3169417,16.0669417 L26.8205232,16.5619814 L28.5669417,18.3080583 L27.6830583,19.1919417 L25.9375232,17.4459814 L24.7765232,18.6059814 L29.1739251,22.6657478 L28.3260749,23.5842522 L20.2010749,16.0842522 L21.0489251,15.1657478 L23.8575232,17.7579814 L25.0535232,16.5619814 L23.3080583,14.8169417 L24.1919417,13.9330583 Z M24.5338167,4.84124576 C25.1402323,5.4476613 24.9412577,6.55961402 24.0761405,8.14200618 L23.9061586,8.4442091 C23.8469186,8.54677535 23.7851104,8.65117069 23.7207681,8.75738654 L23.5201727,9.08148707 L23.3045766,9.41645929 L23.0741836,9.76225179 L22.8291978,10.1188131 L22.5698232,10.4860919 L22.2962636,10.8640368 L22.0087232,11.2525962 L21.7074058,11.6517189 L21.3925154,12.0613534 L20.8951768,12.6954022 L20.7228317,12.911952 L20.2065821,13.550648 C19.8568334,13.9783263 19.4965488,14.4091008 19.1295018,14.8389758 L18.574331,15.4826142 C18.3878979,15.6966025 18.2002458,15.9098665 18.0118465,16.1219067 L17.4448781,16.7538566 L16.8762558,17.3754672 L16.5922089,17.6814588 L16.026412,18.2819417 C15.9324857,18.3806195 15.8387853,18.4785543 15.7453697,18.5756837 L15.1887656,19.1482962 C15.0967252,19.2419544 15.0050875,19.3346823 14.9139115,19.4264175 L14.3728677,19.9644171 C13.6601211,20.664535 12.9844704,21.2931299 12.3761018,21.818237 L12.1511764,22.0102387 L11.3450736,21.0548863 C11.9908108,20.5100292 12.7275598,19.8291645 13.5121926,19.0578337 L14.0419018,18.5307106 L14.5829591,17.9797813 C14.9468156,17.6052262 15.3163444,17.2167993 15.6877592,16.818499 L16.2458226,16.2141431 C16.3389111,16.1123496 16.4319992,16.0100638 16.5250277,15.9073484 L17.0820102,15.2863996 L17.6347224,14.6581372 C18.275958,13.9220641 18.9026774,13.1771811 19.4945886,12.4449159 L19.8951458,11.9444314 L20.1858408,11.5739356 L20.466443,11.209855 L20.8679956,10.6768974 L21.2457417,10.1612918 L21.5990226,9.66478889 L21.8206261,9.34526408 L22.1316678,8.88448935 L22.324502,8.5904043 L22.5914748,8.17022065 L22.831128,7.77672586 L22.9753939,7.53008767 L23.1070297,7.29660797 L23.2258404,7.07680548 L23.3316308,6.87119891 L23.3795823,6.77388119 L23.4654762,6.59054108 C23.4786715,6.56126104 23.491304,6.53262654 23.5033697,6.50464837 L23.5689279,6.34474183 L23.620685,6.20110606 C23.7028028,5.95300567 23.7143563,5.78955224 23.6499333,5.72512924 C23.5971856,5.67238153 23.4780951,5.67055631 23.3005978,5.71665983 L23.1737004,5.75446322 L23.1039253,5.77862872 L22.952049,5.83736417 L22.7841732,5.90980792 L22.6008204,5.99576287 C22.5690009,6.01120368 22.5365583,6.02719923 22.5035035,6.04374544 L22.297915,6.14959757 L22.1897741,6.20741785 L21.9631255,6.33272365 L21.7230901,6.47075216 L21.3390795,6.70121881 L20.9278876,6.95920276 L20.6395297,7.14615092 L20.3403975,7.3448362 L20.0310136,7.55506147 L19.7119003,7.77662961 L19.3835803,8.00934351 L19.0465761,8.25300605 L18.7014101,8.5074201 L18.3486049,8.77238855 L17.8062166,9.18919951 L17.4365993,9.47969155 C17.3744977,9.52893441 17.3121541,9.57858829 17.2495792,9.62864907 L16.6403986,10.1218112 C16.5384603,10.2052884 16.4363556,10.2893714 16.3341413,10.3740065 L15.7199945,10.8880095 C15.5151432,11.0612644 15.3103073,11.2362964 15.1059409,11.4126743 L14.4947035,11.9454154 L13.8890055,12.483647 L13.2915701,13.0247833 L12.7051205,13.5662389 L12.1323797,14.105428 L11.576071,14.6397648 C11.4848735,14.728273 11.3944742,14.8164712 11.3049297,14.9043057 L10.778375,15.4265162 C9.91939399,16.2881549 9.15724609,17.1026421 8.54866369,17.8161097 L8.37075267,18.0270655 L7.41049733,17.2268095 C8.06522973,16.441173 8.91265706,15.5284334 9.87732932,14.560008 L10.4146883,14.0266828 C10.5060349,13.9370179 10.5982371,13.8470001 10.6912382,13.7566831 L11.2583781,13.2116193 L11.548288,12.9371991 L12.1390868,12.3861919 L12.4392955,12.1102487 L13.0476309,11.5590929 L13.6642562,11.0110574 L14.2864505,10.468718 C15.0145343,9.8403128 15.7484326,9.22879524 16.4687021,8.65256968 L16.8980855,8.31144401 L17.3171743,7.98343597 L17.7259116,7.66875234 L18.1242406,7.36759988 L18.5121048,7.08018538 L18.8894472,6.80671561 L19.2562111,6.54739736 L19.6123399,6.30243739 L19.9577768,6.07204249 C20.0144554,6.03486859 20.0706862,5.99831017 20.126468,5.96237156 L20.4557605,5.75421197 L20.7742193,5.56113439 C22.6001862,4.47923975 23.8702813,4.17771032 24.5338167,4.84124576 Z M7.07582568,0.604754996 L7.15049927,0.679196818 L10.7675232,4.59798141 L11.9285232,3.43698141 L10.1830583,1.69194174 L11.0669417,0.808058262 L12.8125232,2.55398141 L13.3080583,2.05805826 L14.1919417,2.94194174 L13.6955232,3.43698141 L15.4419417,5.18305826 L14.5580583,6.06694174 L12.8125232,4.32098141 L11.6155232,5.51698141 L14.2092493,8.32607182 L13.2907507,9.17392818 L6.23204007,1.5270958 L5.01631674,2.74256674 C4.41301371,3.34586977 4.29610187,4.27587088 4.71796323,5.00603476 L4.78189991,5.1089276 L9.89502491,12.7783026 L8.85497509,13.4716974 L3.74184357,5.80231262 C2.94299807,4.60404437 3.06930713,3.02158997 4.03007097,1.96596879 L4.13243326,1.85868326 L5.34805826,0.643058262 C5.82512741,0.165989117 6.58790876,0.157287734 7.07582568,0.604754996 Z" fill-rule="nonzero"></path>
                  </g>
              </g>
          </g>
      </g>
  </symbol>

  <symbol id="icon-billing-summary" viewBox="0 0 29 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
          <g  transform="translate(-11.000000, -2.000000)" stroke-width="1.245">
              <g transform="translate(11.620000, 3.320000)">
                  <path d="M0.83,34.0586207 L26.5946489,34.0586207 C27.0530452,34.0586207 27.4246489,33.687017 27.4246489,33.2286207 L27.4246489,0.0510114139 L27.4246489,0.0510114139 L23.9965678,2.93169045 L20.5684867,0 L17.1404056,2.93169045 L13.7123245,0 L10.2842433,2.93169045 L6.85616223,0 L3.42808111,2.93169045 L0,0.0510114139 L0,33.2286207 C5.61373613e-17,33.687017 0.371603658,34.0586207 0.83,34.0586207 Z" stroke-linejoin="round"></path>
                  <line x1="19.5136925" y1="12.7720369" x2="19.5136925" y2="14.9007007"></line>
                  <path d="M16.876707,22.0852575 C16.876707,23.4078288 18.0583833,24.4796877 19.5140411,24.4796877 C20.970396,24.4796877 22.150678,23.4078288 22.150678,22.0852575 C22.150678,20.7620531 20.970396,19.6908273 19.5140411,19.6908273 C18.0583833,19.6908273 16.876707,18.6177022 16.876707,17.295764 C16.876707,15.9731927 18.0583833,14.9007007 19.5140411,14.9007007 C20.970396,14.9007007 22.150678,15.9731927 22.150678,17.295764" stroke-linejoin="round"></path>
                  <line x1="19.5136925" y1="25.0118537" x2="19.5136925" y2="27.1405175"></line>
                  <line x1="5.27397094" y1="9.43923488" x2="20.9427061" y2="9.43923488"></line>
                  <line x1="5.27397094" y1="13.7687206" x2="12.6575303" y2="13.7687206"></line>
                  <line x1="5.27397094" y1="18.0982062" x2="10.5479419" y2="18.0982062"></line>
                  <line x1="5.27397094" y1="22.4276919" x2="10.5479419" y2="22.4276919"></line>
                  <line x1="5.27397094" y1="26.6083515" x2="12.6575303" y2="26.6083515"></line>
              </g>
          </g>
      </g>
  </symbol>

  <symbol id="icon-inactive-radio" viewBox="0 0 39 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
          <g transform="translate(-1.000000, -4.000000)" stroke-width="1.245">
          <g transform="translate(22.410000, 18.260000)">
                  <g transform="translate(0.661668, 0.823299)">
                      <path d="M0.168332318,7.68420074 C0.168332318,3.44402717 3.60620714,0.00670074392 7.84583232,0.00670074392 C12.0865543,0.00670074392 15.5233323,3.44402717 15.5233323,7.68420074 C15.5233323,11.9243743 12.0865543,15.3617007 7.84583232,15.3617007 C3.60620714,15.3617007 0.168332318,11.9243743 0.168332318,7.68420074 Z"></path>
                      <line x1="2.28185938" y1="13.2992903" x2="13.2994016" y2="2.28174808" ></line>
                  </g>
              </g>
              <g transform="translate(1.660000, 5.146000)">
                  <path d="M0.63067384,17.0314108 L0.63067384,25.2318108 C0.63067384,25.928214 1.19587064,26.4934108 1.89227384,26.4934108 L5.67707384,26.4934108 C6.37347704,26.4934108 6.93867384,25.928214 6.93867384,25.2318108 L6.93867384,23.3394108" ></path>
                  <line x1="27.1242738" y1="8.83101076" x2="4.41547384" y2="8.83101076" ></line>
                  <path d="M28.2773091,10.8262494 L27.1242738,8.83101076 L23.9702738,0.63061076 C23.9702738,0.63061076 21.4470738,-0.00018924 15.7698738,-0.00018924 C10.0926738,-0.00018924 7.56947384,0.63061076 7.56947384,0.63061076 L4.41547384,8.83101076 L1.13531384,13.204978 C0.80792864,13.6414916 0.63067384,14.1726252 0.63067384,14.7182672 L0.63067384,19.7829604 C0.63067384,20.7928712 1.23245704,21.7043772 2.16036384,22.102412 L3.61814264,22.726904 C4.56055784,23.1312468 5.57488424,23.3394108 6.59993424,23.3394108 C11.9760761,23.3394108 15.5719291,23.3394108 18.26,23.3394108" stroke-linecap="round"></path>
                  <path d="M18.26,19.5546108 L7.04969464,19.5546108 C6.14197344,19.5546108 5.24245264,19.3912336 4.39213424,19.0726796 L0.63067384,17.6622108" stroke-linecap="round"></path>
                  <path d="M0.63067384,15.1390108 L1.64626184,14.8002712 C2.21272024,14.611662 2.82711944,14.6293244 3.38096184,14.851366 L7.63381544,16.5520028 C8.38572904,16.8535252 8.94777184,17.4969412 9.14395064,18.282918 L9.46187384,19.5546108" ></path>
                  <path d="M25.8626738,6.30781076 L29.6474738,6.30781076 C30.6927094,6.30781076 31.5398738,7.15497516 31.5398738,8.20021076 L31.5398738,9.03475916 C31.5398738,9.29212556 31.3828046,9.52489076 31.1437314,9.62014156 L28.2773091,10.8262494" ></path>
                  <path d="M3.15387384,10.7234108 L0.39664704,9.62014156 C0.15694304,9.52489076 -0.00012616,9.29212556 -0.00012616,9.03475916 L-0.00012616,8.20021076 C-0.00012616,7.15497516 0.84766904,6.30781076 1.89227384,6.30781076 L5.67707384,6.30781076" ></path>
                  <path d="M15.7698738,8.83101076 C15.7698738,8.83101076 17.0314738,5.67701076 20.1854738,5.67701076 C23.3394738,5.67701076 24.6010738,8.83101076 24.6010738,8.83101076" ></path>
              </g>
          </g>
      </g>
  </symbol>

  <symbol id="icon-marine" viewBox="0 0 36 34" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill-rule="evenodd">
          <g transform="translate(-1011.000000, -3880.000000)">
              <g transform="translate(1009.000000, 3877.000000)">
                  <g transform="translate(2.500000, 3.125000)">
                      <path d="M23.125,0 L29.9178232,0 L28.25125,2.5 L29.9178232,5 L24.375,5 L24.375,7.5 L23.125,7.5 L23.125,0 Z M27.581875,1.25 L24.375,1.25 L24.375,3.75 L27.581875,3.75 L26.7488435,2.5 L27.581875,1.25 Z M17.5,15.6021731 L31.875,19.5226276 L31.875,20 C31.875,20.5142868 31.8198725,21.0458736 31.7134753,21.593059 C31.3978828,23.2161065 30.6477393,24.925849 29.5963741,26.6530918 C29.1056477,27.4592852 28.5806323,28.2168074 28.0553236,28.9047116 C27.9171571,29.085644 27.786216,29.2521709 27.664294,29.4031602 L27.405277,29.7168614 L27.3453604,29.7865654 L26.4046396,28.9634346 L26.5322425,28.8126762 L26.692262,28.6172504 L26.9333305,28.3128746 C26.9753309,28.2588678 27.0181977,28.2032515 27.0618639,28.1460696 C27.5619458,27.4912004 28.062321,26.7692305 28.5286259,26.0031582 C29.5094752,24.3917629 30.2034118,22.8101281 30.4864561,21.3544719 C30.541445,21.071672 30.580323,20.7957566 30.6026272,20.5271916 L30.60625,20.471875 L18.1240583,17.067 L18.125,29.375 L16.875,29.375 L16.8740583,17.067 L4.393125,20.471875 L4.3973728,20.5271916 C4.41224227,20.7062349 4.43447789,20.8885451 4.46394247,21.0739841 L4.51354391,21.3544719 C4.79658818,22.8101281 5.4905248,24.3917629 6.4713741,26.0031582 C6.93767897,26.7692305 7.4380542,27.4912004 7.93813613,28.1460696 L8.06666951,28.3128746 L8.30773804,28.6172504 L8.59536043,28.9634346 L7.65463957,29.7865654 L7.45455532,29.5489284 C7.30027515,29.3615882 7.12889846,29.1459548 6.94467637,28.9047116 C6.41936768,28.2168074 5.89435228,27.4592852 5.4036259,26.6530918 C4.35226069,24.925849 3.60211724,23.2161065 3.28652468,21.593059 C3.19786038,21.1370712 3.1448,20.6919157 3.1295761,20.2585772 L3.125,20 L3.125,19.5226276 L17.5,15.6021731 Z M33.9330583,27.6830583 L34.8169417,28.5669417 C34.6937732,28.6901103 34.4841758,28.8473084 34.1857585,28.996517 C33.710718,29.2340372 33.1468669,29.375 32.5,29.375 C31.8531331,29.375 31.289282,29.2340372 30.8142415,28.996517 C30.5584553,28.8686239 30.3679244,28.734861 30.2411433,28.6216892 L30.1830583,28.5669417 L31.0674767,27.683486 L31.1171875,27.7226563 C31.1856392,27.773995 31.2710658,27.8273867 31.3732585,27.878483 C31.679468,28.0315878 32.0531169,28.125 32.5,28.125 C32.9468831,28.125 33.320532,28.0315878 33.6267415,27.878483 C33.6948699,27.8444188 33.7555468,27.8093344 33.8087102,27.7745183 L33.9051838,27.7055515 L33.9330583,27.6830583 Z M3.93305826,27.6830583 L4.81694174,28.5669417 C4.69377318,28.6901103 4.48417576,28.8473084 4.1857585,28.996517 C3.71071803,29.2340372 3.14686694,29.375 2.5,29.375 C1.85313306,29.375 1.28928197,29.2340372 0.814241503,28.996517 C0.558455282,28.8686239 0.367924449,28.734861 0.241143321,28.6216892 L0.183058262,28.5669417 L1.0674767,27.683486 L1.1171875,27.7226563 C1.18563921,27.773995 1.27106584,27.8273867 1.3732585,27.878483 C1.67946803,28.0315878 2.05311694,28.125 2.5,28.125 C2.94688306,28.125 3.32053197,28.0315878 3.6267415,27.878483 C3.69486994,27.8444188 3.75554681,27.8093344 3.80871022,27.7745183 L3.90518381,27.7055515 L3.93305826,27.6830583 Z M24.6875,21.875 C25.895803,21.875 26.875,22.854197 26.875,24.0625 C26.875,25.270803 25.895803,26.25 24.6875,26.25 C23.479197,26.25 22.5,25.270803 22.5,24.0625 C22.5,22.854197 23.479197,21.875 24.6875,21.875 Z M10.3125,21.875 C11.520803,21.875 12.5,22.854197 12.5,24.0625 C12.5,25.270803 11.520803,26.25 10.3125,26.25 C9.10419703,26.25 8.125,25.270803 8.125,24.0625 C8.125,22.854197 9.10419703,21.875 10.3125,21.875 Z M24.6875,23.125 C24.169553,23.125 23.75,23.544553 23.75,24.0625 C23.75,24.580447 24.169553,25 24.6875,25 C25.205447,25 25.625,24.580447 25.625,24.0625 C25.625,23.544553 25.205447,23.125 24.6875,23.125 Z M10.3125,23.125 C9.79455297,23.125 9.375,23.544553 9.375,24.0625 C9.375,24.580447 9.79455297,25 10.3125,25 C10.830447,25 11.25,24.580447 11.25,24.0625 C11.25,23.544553 10.830447,23.125 10.3125,23.125 Z M17.5,8.125 C20.0260667,8.125 22.2676706,8.48666567 24.2002781,9.09098321 C24.8812626,9.30392396 25.4761975,9.53292123 25.9822203,9.76314087 L26.1970597,9.86341993 L26.3761309,9.95165472 L26.5191704,10.0264609 L26.6259148,10.0864543 L26.7666472,10.1693356 L30.8525896,17.1854714 L29.7724104,17.8145286 L25.855,11.08875 L25.7283507,11.0252998 L25.5612389,10.9454362 L25.4645766,10.9009216 C25.0046814,10.6916881 24.4579171,10.4812323 23.8272219,10.2840168 C22.0121732,9.71645933 19.8958083,9.375 17.5,9.375 C15.1046405,9.375 12.9999037,9.71630866 11.2038321,10.2834892 C10.5800528,10.4804721 10.040648,10.6906298 9.58808324,10.8995059 L9.40674935,10.985264 L9.20125,11.088125 L5.22557908,17.8179558 L4.14942092,17.1820442 L8.29254447,10.1706043 L8.5136513,10.0392742 L8.71032652,9.93241108 L8.94181953,9.81700126 C9.39800319,9.59843048 10.0286004,9.34376898 10.8274179,9.09151083 C12.7422838,8.48681634 14.9734845,8.125 17.5,8.125 Z M25,30.625 C25.9371961,30.625 26.4512534,30.9038387 27.1913823,31.6218039 L27.3169417,31.7455583 C27.9133149,32.3419314 28.1767625,32.5 28.75,32.5 C29.1127892,32.5 29.4319438,32.3404227 29.7143083,32.0580583 C29.8689543,31.9034122 29.9797423,31.7482764 30.0400604,31.6434671 L30.065983,31.5954915 L31.184017,32.1545085 C31.0782967,32.3659491 30.8865213,32.6536121 30.5981917,32.9419417 C30.0993062,33.4408273 29.4809608,33.75 28.75,33.75 C27.8128039,33.75 27.2987466,33.4711613 26.5586177,32.7531961 L26.4330583,32.6294417 C25.8366851,32.0330686 25.5732375,31.875 25,31.875 C24.4625899,31.875 24.197456,32.0139275 23.6750171,32.5226897 L23.5669417,32.6294417 C22.7570649,33.4393186 22.2392625,33.75 21.25,33.75 C20.3128039,33.75 19.7987466,33.4711613 19.0586177,32.7531961 L18.9330583,32.6294417 C18.3366851,32.0330686 18.0732375,31.875 17.5,31.875 C16.9625899,31.875 16.697456,32.0139275 16.1750171,32.5226897 L16.0669417,32.6294417 C15.2570649,33.4393186 14.7392625,33.75 13.75,33.75 C12.8128039,33.75 12.2987466,33.4711613 11.5586177,32.7531961 L11.4330583,32.6294417 C10.8366851,32.0330686 10.5732375,31.875 10,31.875 C9.46258987,31.875 9.19745597,32.0139275 8.67501715,32.5226897 L8.56694174,32.6294417 C7.75706489,33.4393186 7.23926253,33.75 6.25,33.75 C5.51903922,33.75 4.90069383,33.4408273 4.40180826,32.9419417 C4.14951987,32.6896533 3.97115581,32.4378753 3.85968246,32.2372241 L3.81598301,32.1545085 L4.93401699,31.5954915 C4.98454669,31.6965509 5.10527133,31.8776379 5.28569174,32.0580583 C5.56805617,32.3404227 5.88721078,32.5 6.25,32.5 C6.78741013,32.5 7.05254403,32.3610725 7.57498285,31.8523103 L7.68305826,31.7455583 C8.49293511,30.9356814 9.01073747,30.625 10,30.625 C10.9371961,30.625 11.4512534,30.9038387 12.1913823,31.6218039 L12.3169417,31.7455583 C12.9133149,32.3419314 13.1767625,32.5 13.75,32.5 C14.2874101,32.5 14.552544,32.3610725 15.0749829,31.8523103 L15.1830583,31.7455583 C15.9929351,30.9356814 16.5107375,30.625 17.5,30.625 C18.4371961,30.625 18.9512534,30.9038387 19.6913823,31.6218039 L19.8169417,31.7455583 C20.4133149,32.3419314 20.6767625,32.5 21.25,32.5 C21.7874101,32.5 22.052544,32.3610725 22.5749829,31.8523103 L22.6830583,31.7455583 C23.4929351,30.9356814 24.0107375,30.625 25,30.625 Z" fill-rule="nonzero"></path>
                      <g transform="translate(0.000000, 8.125000)"></g>
                  </g>
              </g>
          </g>
      </g>
  </symbol>
  <symbol id="icon-helpBillingMyAccount" viewBox="0 0 24 29" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Help icon for billing my account</title>
    <g stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
      <g transform="translate(-311.000000, -730.000000)"
        stroke-width="1.245">
        <g transform="translate(292.000000, 450.000000)">
          <g transform="translate(0.000000, 262.000000)">
            <g transform="translate(11.000000, 16.000000)">
              <g transform="translate(9.296000, 2.656000)">
                <path
                  d="M0.83,27.2468966 L21.1097191,27.2468966 C21.5681155,27.2468966 21.9397191,26.8752929 21.9397191,26.4168966 L21.9397191,0.0408091311 L21.9397191,0.0408091311 L19.1972542,2.34535236 L16.4547893,0 L13.7123245,2.34535236 L10.9698596,0 L8.22739467,2.34535236 L5.48492978,0 L2.74246489,2.34535236 L0,0.0408091311 L0,26.4168966 C-5.48849411e-17,26.8752929 0.371603658,27.2468966 0.83,27.2468966 Z"
                  stroke-linejoin="round"></path>
                <line x1="15.610954" y1="10.2176295" x2="15.610954" y2="11.9205605"></line>
                <path
                  d="M13.5013656,17.668206 C13.5013656,18.7262631 14.4467066,19.5837502 15.6112329,19.5837502 C16.7763168,19.5837502 17.7205424,18.7262631 17.7205424,17.668206 C17.7205424,16.6096425 16.7763168,15.7526619 15.6112329,15.7526619 C14.4467066,15.7526619 13.5013656,14.8941618 13.5013656,13.8366112 C13.5013656,12.7785541 14.4467066,11.9205605 15.6112329,11.9205605 C16.7763168,11.9205605 17.7205424,12.7785541 17.7205424,13.8366112"
                  stroke-linejoin="round"></path>
                <line x1="15.610954" y1="20.009483" x2="15.610954" y2="21.712414"></line>
                <line x1="4.21917675" y1="7.5513879" x2="16.7541649" y2="7.5513879"></line>
                <line x1="4.21917675" y1="11.0149764" x2="10.1260242" y2="11.0149764"></line>
                <line x1="4.21917675" y1="14.478565" x2="8.43835351" y2="14.478565"></line>
                <line x1="4.21917675" y1="17.9421535" x2="8.43835351" y2="17.9421535"></line>
                <line x1="4.21917675" y1="21.2866812" x2="10.1260242" y2="21.2866812"></line>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </symbol>
  <symbol id="icon-helpFaqs" viewBox="0 0 24 31" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Help Icon FAQs</title>
    <g stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g transform="translate(-312.000000, -465.000000)" stroke-width="1.245">
            <g transform="translate(292.000000, 450.000000)">
                <g transform="translate(12.000000, 15.000000)">
                    <g transform="translate(8.632000, 0.996000)">
                        <path d="M5.6161075,4.492886 L0.83,4.492886 C0.371603658,4.492886 -2.18858344e-13,4.86448966 -2.19024252e-13,5.322886 L-2.19024252e-13,27.543759 C-2.18911977e-13,28.4605517 0.743207315,29.203759 1.66,29.203759 L13.4539471,29.203759 L13.4539471,29.203759 L20.8043738,29.203759 C21.7211665,29.203759 22.4643738,28.4605517 22.4643738,27.543759 L22.4643738,5.322886 C22.4643738,4.86448966 22.0927702,4.492886 21.6343738,4.492886 L16.8482663,4.492886 L16.8482663,4.492886"></path>
                        <path d="M14.1619698,2.246443 C14.1619698,1.07379975 13.4537786,-3.82801669e-14 11.3297668,-3.82801669e-14 C9.20519332,-3.82801669e-14 8.49756378,1.07379975 8.49756378,2.246443 L5.61593902,2.246443 L5.61593902,7.5850098 L16.848154,7.5850098 L16.848154,2.246443 L14.1619698,2.246443 Z" ></path>
                        <polyline points="7.12543639 11.5309126 5.16230596 13.5667516 4.07167794 12.5488321"></polyline>
                        <line x1="9.16127536" y1="13.0577918" x2="18.3225507" y2="13.0577918" ></line>
                        <polyline points="7.12543639 17.1294698 5.16230596 19.1653087 4.07167794 18.1473893"></polyline>
                        <line x1="9.16127536" y1="18.656349" x2="16.2867118" y2="18.656349"></line>
                        <polyline points="7.12543639 22.7280269 5.16230596 24.7638659 4.07167794 23.7459464"></polyline>
                        <line x1="9.16127536" y1="24.2549062" x2="18.3225507" y2="24.2549062"></line>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </symbol>
  <symbol id="icon-helpMySubs" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Help Icon My Subscriptions</title>
    <g stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-310.000000, -657.000000)">
            <g transform="translate(292.000000, 450.000000)">
                <g transform="translate(0.000000, 190.000000)">
                    <g transform="translate(16.000000, 15.500000)">
                        <g transform="translate(3.320000, 2.656000)">
                            <g stroke-width="1.245">
                                <path d="M23.8197928,11.9098964 C23.8197928,5.33224224 18.4875505,-9.23486048e-15 11.9098964,-9.23486048e-15 C5.33224224,-9.23486048e-15 6.46440233e-14,5.33224224 6.46440233e-14,11.9098964 C6.46440233e-14,18.4875505 5.33224224,23.8197928 11.9098964,23.8197928 C12.0906567,23.8197928 12.2704765,23.8157659 12.4492709,23.8077968" stroke-linecap="round"></path>
                                <path d="M15.7820129,8.71609171 C15.7820129,10.8500749 14.0520844,12.5800034 11.9181012,12.5800034 C9.78411795,12.5800034 8.05418949,10.8500749 8.05418949,8.71609171 C8.05418949,6.58210848 9.78411795,4.85218001 11.9181012,4.85218001 C14.0520844,4.85218001 15.7820129,6.58210848 15.7820129,8.71609171 Z" ></path>
                                <path d="M16.4558963,16.4112701 C15.3543172,15.8326056 13.87476,15.5019635 11.977637,15.5019635 C7.06502047,15.5019635 4.83334309,17.8115995 4.83334309,20.7187617 C4.83334309,21.0705266 4.83334309,21.3343502 4.83334309,21.5102327" stroke-linecap="round"></path>
                            </g>
                            <g transform="translate(6.267512, 4.874732)">
                                <g transform="translate(0.557112, 0.148563)" >
                                    <g transform="translate(0.497767, 0.000000)"></g>
                                </g>
                            </g>
                            <g transform="translate(14.183148, 14.183148)" stroke-width="1.245">
                                <g transform="translate(6.800000, 6.800000) scale(-1, 1) rotate(-270.000000) translate(-6.800000, -6.800000) translate(-0.000000, 0.000000)" stroke-linecap="round">
                                    <path d="M11.919492,0 L6.31031929,5.6091727 C5.7054635,5.27285605 4.94799147,5.14174164 4.20687953,5.14174164 C1.88351345,5.14174164 0,7.02548881 0,9.34862117 C0,11.6719872 1.88351345,13.5555007 4.20687953,13.5555007 C6.5302456,13.5555007 8.41375905,11.6719872 8.41375905,9.34862117 C8.41375905,8.66944384 8.23216208,8.04705939 7.94632799,7.47889693 L9.46185065,6.0294271 L10.4336458,6.0294271 L10.7494373,5.78107661 L10.7494373,4.71300679 L11.8436636,3.6068708 L12.8743774,3.6068708 L13.0880696,3.41405435 L13.0880696,2.33715529 L13.5555007,1.76829169 L13.5555007,0 L11.919492,0 Z" ></path>
                                </g>
                                <circle fill="#322790" cx="10.4441544" cy="3.4991552" r="1"></circle>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </symbol>
  <symbol id="icon-helpProblems" viewBox="0 0 32 26" xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Help Icon Problems</title>
    <g stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
        <g transform="translate(-308.000000, -877.000000)" stroke-width="1.245">
            <g transform="translate(292.000000, 450.000000)">
                <g transform="translate(0.000000, 406.000000)">
                    <g transform="translate(16.000000, 18.000000)">
                        <g transform="translate(17.928000, 14.608000)">
                            <g transform="translate(0.529334, 0.658639)">
                                <path d="M0.134665854,6.1473606 C0.134665854,2.75522174 2.88496571,0.00536059513 6.27666585,0.00536059513 C9.66924343,0.00536059513 12.4186659,2.75522174 12.4186659,6.1473606 C12.4186659,9.53949945 9.66924343,12.2893606 6.27666585,12.2893606 C2.88496571,12.2893606 0.134665854,9.53949945 0.134665854,6.1473606 Z" ></path>
                                <line x1="1.8254875" y1="10.6394323" x2="10.6395213" y2="1.82539847"></line>
                            </g>
                        </g>
                        <g transform="translate(1.328000, 4.116800)">
                            <path d="M0.504539072,13.6251286 L0.504539072,20.1854486 C0.504539072,20.7425712 0.956696512,21.1947286 1.51381907,21.1947286 L4.54165907,21.1947286 C5.09878163,21.1947286 5.55093907,20.7425712 5.55093907,20.1854486 L5.55093907,18.6715286" ></path>
                            <line x1="21.6994191" y1="7.06480861" x2="3.53237907" y2="7.06480861" ></line>
                            <path d="M22.6218472,8.66099952 L21.6994191,7.06480861 L19.1762191,0.504488608 C19.1762191,0.504488608 17.1576591,-0.000151392 12.6158991,-0.000151392 C8.07413907,-0.000151392 6.05557907,0.504488608 6.05557907,0.504488608 L3.53237907,7.06480861 L0.908251072,10.5639824 C0.646342912,10.9131932 0.504539072,11.3381001 0.504539072,11.7746137 L0.504539072,15.8263683 C0.504539072,16.6342969 0.985965632,17.3635017 1.72829107,17.6819296 L2.89451411,18.1815232 C3.64844627,18.5049974 4.45990739,18.6715286 5.27994739,18.6715286 C9.58086089,18.6715286 12.4575433,18.6715286 14.608,18.6715286" stroke-linecap="round"></path>
                            <path d="M14.608,15.6436886 L5.63975571,15.6436886 C4.91357875,15.6436886 4.19396211,15.5129868 3.51370739,15.2581436 L0.504539072,14.1297686"  stroke-linecap="round"></path>
                            <path d="M0.504539072,12.1112086 L1.31700947,11.8402169 C1.77017619,11.6893296 2.26169555,11.7034595 2.70476947,11.8810928 L6.10705235,13.2416022 C6.70858323,13.4828201 7.15821747,13.9975529 7.31516051,14.6263344 L7.56949907,15.6436886" ></path>
                            <path d="M20.6901391,5.04624861 L23.7179791,5.04624861 C24.5541676,5.04624861 25.2318991,5.72398013 25.2318991,6.56016861 L25.2318991,7.22780733 C25.2318991,7.43370045 25.1062437,7.61991261 24.9149852,7.69611325 L22.6218472,8.66099952"></path>
                            <path d="M2.52309907,8.57872861 L0.317317632,7.69611325 C0.125554432,7.61991261 -0.000100928,7.43370045 -0.000100928,7.22780733 L-0.000100928,6.56016861 C-0.000100928,5.72398013 0.678135232,5.04624861 1.51381907,5.04624861 L4.54165907,5.04624861" ></path>
                            <path d="M12.6158991,7.06480861 C12.6158991,7.06480861 13.6251791,4.54160861 16.1483791,4.54160861 C18.6715791,4.54160861 19.6808591,7.06480861 19.6808591,7.06480861" ></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </symbol>
  <symbol id="icon-tag" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-39.000000, -1452.000000)">
              <g transform="translate(17.000000, 1427.000000)">
                  <g transform="translate(20.000000, 23.000000)">
                      <polygon points="0 24 24 24 24 0 0 0"></polygon>
                      <path d="M11.2407913,2.264031 L11.1349094,2.26137382 L10.8891679,2.26893337 L10.5897147,2.29155319 L10.2222608,2.32899256 L9.51326813,2.41595214 L8.63178435,2.53794889 L7.17562006,2.75674001 L6.13890015,2.92058567 L4.19179788,3.24173041 L3.49751449,3.36012574 L3.18541764,5.1535277 L3.03294974,6.0625825 L2.80603426,7.46618972 L2.64475233,8.52719214 L2.52730961,9.36193501 L2.46634777,9.83967775 L2.42123723,10.2390614 L2.39108643,10.5655289 L2.37461279,10.8342335 C2.36960203,10.9610385 2.37005903,11.0695851 2.37816987,11.1690193 C2.40206396,11.4619472 2.45152251,11.6554562 2.69688773,11.8986878 L13.446859,22.6476725 C13.6399809,22.8445018 13.8771375,23.0016303 14.1372672,23.108047 C14.3960462,23.2112141 14.6606239,23.2625 14.9289,23.2625 C15.1978631,23.2625 15.4643194,23.2109434 15.7145025,23.1104911 C15.9793048,23.0021857 16.215356,22.8461108 16.415288,22.6443103 L22.7628954,16.2977181 C23.1609072,15.8997063 23.3769,15.366285 23.3769,14.8145 C23.3769,14.262715 23.1609072,13.7292937 22.7630068,13.3313932 L12.0110068,2.57939322 C11.8326444,2.40103084 11.6633338,2.33222529 11.4693636,2.29187074 C11.392412,2.27586135 11.3190837,2.26788397 11.2407913,2.264031 Z M10.877,4.274 L21.3487932,14.7456068 C21.3674953,14.7643089 21.3769,14.787535 21.3769,14.8145 C21.3769,14.841465 21.3674953,14.8646911 21.3487932,14.8833932 L14.9977932,21.2333932 C14.9861532,21.2451267 14.9763797,21.2515888 14.9632672,21.256953 L14.9289,21.2625 L14.9084335,21.2604035 L14.8776795,21.2485299 L4.383,10.756 L4.41149037,10.4365718 L4.47983879,9.85516661 L4.58312739,9.09669133 L4.66866191,8.51370786 L4.85330468,7.32629791 L5.00588114,6.39051555 L5.223,5.096 L6.45563346,4.89534681 L8.25579414,4.61490333 L9.49990916,4.43561563 L10.0181037,4.36745844 L10.4361284,4.31754696 L10.7567096,4.28462129 L10.877,4.274 Z" fill="currentColor" fill-rule="nonzero"></path>
                      <path d="M9.589,7.9681 C9.589,8.7971 8.917,9.4681 8.089,9.4681 C7.26,9.4681 6.589,8.7971 6.589,7.9681 C6.589,7.1401 7.26,6.4681 8.089,6.4681 C8.917,6.4681 9.589,7.1401 9.589,7.9681" fill="currentColor"></path>
                  </g>
              </g>
          </g>
      </g>
  </symbol>
  <symbol id="icon-tag-music" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g transform="translate(-794.000000, -461.000000)">
              <g transform="translate(791.000000, 458.000000)">
                  <path d="M22.4757,6.812475 C23.1996776,6.812475 23.8978534,7.07955726 24.4363957,7.56020857 L24.5577801,7.67489491 L43.5567801,26.6738949 C44.6672632,27.784378 44.7055557,29.5616159 43.6716576,30.718082 L43.5567801,30.8395551 L30.8547801,43.5415551 C30.2957425,44.1005927 29.5472402,44.403975 28.77195,44.403975 C28.0564112,44.403975 27.3641826,44.1455275 26.8221619,43.6660084 L26.6898594,43.5415446 L7.69130443,24.5422392 C7.11736826,23.9692424 6.80717527,23.1859951 6.82720616,22.4074829 L6.83657717,22.2408096 L7.30157717,10.8775596 L7.73029302,10.894475 L8.75929302,11.924475 L8.33318882,22.3357723 C8.30031157,22.7178593 8.42107357,23.095945 8.66551898,23.3873458 L8.75154055,23.4811554 L27.7505301,42.4808949 C28.0254678,42.7558326 28.3907043,42.903975 28.77195,42.903975 C29.1110587,42.903975 29.4378421,42.7867953 29.699257,42.5677724 L29.7941199,42.4808949 L42.4961199,29.7788949 C43.0307737,29.2442411 43.0589134,28.3943205 42.5805389,27.8264808 L42.4961199,27.7345551 L23.4971199,8.73555509 C23.226106,8.4645412 22.8580352,8.312475 22.4757,8.312475 L22.3273981,8.31961996 L12.075293,8.876475 L11.018293,7.818475 L10.9982519,7.43308004 L22.2244159,6.82331568 C22.3098567,6.81619562 22.3931985,6.812475 22.4757,6.812475 Z" fill="currentColor" fill-rule="nonzero"></path>
                  <polygon fill="currentColor" fill-rule="nonzero" points="19.3162109 24.3615461 24.1650349 15.9859798 32.257082 24.0788468 31.196368 25.1394532 24.4845 18.42675 21.19125 24.1155 28.1860551 31.1100699 27.1253949 32.1707301"></polygon>
                  <path d="M23.9793612,31.2951038 C22.7797579,32.4947069 22.6694419,34.376277 23.7946449,35.5014801 C24.9199895,36.6268246 26.8008106,36.5162245 28.0008051,35.3162301 C29.1602946,34.1567406 29.3026055,32.3599031 28.2942361,31.2248339 L28.1858119,31.1098268 C27.0599767,29.9850235 25.1795512,30.0958918 23.9793612,31.2951038 Z M27.1253949,32.1707301 C27.6350449,32.68038 27.5798919,33.6158229 26.9401449,34.2555699 C26.2999385,34.8957763 25.3652265,34.9507413 24.8553051,34.4408199 C24.3454325,33.9309474 24.4002771,32.995508 25.0398051,32.3559801 C25.6464618,31.7498179 26.5176004,31.6684356 27.0416204,32.095152 L27.1253949,32.1707301 Z" fill="currentColor" fill-rule="nonzero"></path>
                  <path d="M28.0505288,24.2639112 C26.8507429,25.4627189 26.7401065,27.3444667 27.8654949,28.4698551 C28.9906504,29.5950106 30.8721832,29.484077 32.0716551,28.2846051 C33.271127,27.0851332 33.3820606,25.2036004 32.2569051,24.0784449 C31.1315167,22.9530565 29.2497689,23.0636929 28.0505288,24.2639112 Z M31.1962449,25.1391051 C31.7058949,25.648755 31.6507419,26.5841979 31.0109949,27.2239449 C30.3712479,27.8636919 29.435805,27.9188449 28.9261551,27.4091949 C28.4162488,26.8992886 28.4712386,25.9639999 29.1111888,25.3245712 C29.717373,24.7178929 30.5887055,24.6366088 31.1123035,25.063291 L31.1962449,25.1391051 Z" fill="currentColor" fill-rule="nonzero"></path>
                  <path d="M15.301725,11.856675 C13.4662614,11.856675 11.978475,13.3444614 11.978475,15.179925 C11.978475,17.0154641 13.4663368,18.503925 15.301725,18.503925 C17.1371886,18.503925 18.625725,17.0153886 18.625725,15.179925 C18.625725,13.3445368 17.1372641,11.856675 15.301725,11.856675 Z M15.301725,13.356675 C16.3089721,13.356675 17.125725,14.1730992 17.125725,15.179925 C17.125725,16.1869614 16.3087614,17.003925 15.301725,17.003925 C14.2948992,17.003925 13.478475,16.1871721 13.478475,15.179925 C13.478475,14.1728886 14.2946886,13.356675 15.301725,13.356675 Z" fill="currentColor" fill-rule="nonzero"></path>
                  <polygon fill="currentColor" fill-rule="nonzero" points="4.78788406 3.70764891 14.3488841 13.2723989 13.2880159 14.3328511 3.72701594 4.76810109"></polygon>
                  <polygon points="0 48 48 48 48 0 0 0"></polygon>
              </g>
          </g>
      </g>
  </symbol>
  <symbol id="next-arrow-right" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Additions-to-Flexible-Hero" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Content-Lower3orLess-D-" transform="translate(-475.000000, -784.000000)" stroke="#FFFFFF" stroke-width="2">
            <g id="Group-2" transform="translate(56.000000, 711.000000)">
                <g id="Group-3" transform="translate(419.000000, 73.000000)">
                    <circle id="Oval" fill-opacity="0.5" fill="#000000" cx="12" cy="12" r="11"></circle>
                    <g id="Assets-/-Icons-/-Utility-/-24px-/-Chevron-/-Right" transform="translate(4.666667, 4.000000)">
                        <polyline id="Stroke-Color" transform="translate(8.000000, 8.000000) scale(1, -1) rotate(-90.000000) translate(-8.000000, -8.000000) " points="2.66666667 5.33333333 8 10.6666667 13.3333333 5.33333333"></polyline>
                    </g>
                </g>
            </g>
        </g>
    </g>
  </symbol>

  <symbol id="circle-checkbox" viewBox="0 0 47 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Exploration" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Tablet-B-Copy-13" transform="translate(-397.000000, -416.000000)" fill="#177A31" fill-rule="nonzero">
            <g id="Atoms-/-Notifications-/-Box-/-Confirmation-/-Permanent" transform="translate(397.500000, 416.000000)">
                <g id="Icon" transform="translate(1.916667, 1.916667)">
                    <path d="M21.0833333,-1.33226763e-15 C32.7276291,-1.33226763e-15 42.1666667,9.43903756 42.1666667,21.0833333 C42.1666667,32.7276291 32.7276291,42.1666667 21.0833333,42.1666667 C9.43903756,42.1666667 -1.33226763e-15,32.7276291 -1.33226763e-15,21.0833333 C-1.33226763e-15,9.43903756 9.43903756,-1.33226763e-15 21.0833333,-1.33226763e-15 Z M21.0833333,3.83333333 C11.5561291,3.83333333 3.83333333,11.5561291 3.83333333,21.0833333 C3.83333333,30.6105376 11.5561291,38.3333333 21.0833333,38.3333333 C30.6105376,38.3333333 38.3333333,30.6105376 38.3333333,21.0833333 C38.3333333,11.5561291 30.6105376,3.83333333 21.0833333,3.83333333 Z M27.1246699,12.4008354 L30.3753301,14.432498 L19.6860395,31.5353629 L10.35,24.5333333 L12.65,21.4666667 L18.64725,25.9650833 L27.1246699,12.4008354 Z" id="Combined-Shape"></path>
                </g>
            </g>
        </g>
    </g>
  </symbol>

</svg>
`,document.body.insertBefore(s,document.body.childNodes[0]);var n=v(document.querySelectorAll("[data-icon]"));u.append(n)}},x=u;g.documentReady((function(){x.loadVar()}))}]);const countryDomains={ca:"canada",com:"us"},sensitiveParams=["email","handle","radioid","act"],getCountryFromUrl=a=>{if(a===null)return null;if(a.split("?")[0].includes("/CAN-SIT"))return"canada";const o=a.replace(/^https?:\/\//gi,"").split(":")[0],t=o.split(".");if([t[0],t[1]].includes("can")||t[0].startsWith("can-")||t[1].startsWith("can-")||t[0].toLowerCase()==="uatca")return"canada";const d=o.split("/")[0].split("?")[0].split(".").pop();return d&&countryDomains[d]||null};function createScriptElement(a,{scriptId:c,scriptUrl:o,onload:t,crossOrigin:e,attributes:d}){if(!a.getElementById(c)){const g=a.createElement("script");g.id=c,g.src=o,g.type="text/javascript",g.onload=t,e&&(g.crossOrigin=e),d&&typeof d=="object"&&Object.entries(d).forEach(([v,f])=>{g.setAttribute(v,f)}),a.head.appendChild(g)}}function initAdobeLaunch(a){const{enabled:c,scriptUrl:o}=a;if(!c)return;const t="adobeDataLayer";window[t]||(window[t]=[]),window[t].push({event:"index-file",metricsInfo:{indexTimestamp:new Date().valueOf(),inboundQueryParams:Object.fromEntries(new URLSearchParams(window.location.search))}}),createScriptElement(document,{scriptId:"adobeLaunchScript",scriptUrl:o})}function initOneTrust(a){const{enabled:c,scriptUrl:o,domainScript:t,cookieConsolidateScriptUrl:e}=a;if(!c)return;e&&createScriptElement(document,{scriptId:"OTCookieConsolidate",scriptUrl:e}),createScriptElement(document,{scriptId:"oneTrustScript",scriptUrl:o,attributes:{"data-domain-script":t,"data-document-language":"true"}});const d=document.createElement("script");d.setAttribute("type","text/javascript"),d.innerHTML="function OptanonWrapper() {}",document.head.appendChild(d);const m=document.createElement("style");m.setAttribute("type","text/css"),m.innerHTML="@media print { #onetrust-consent-sdk { display: none !important; } }",document.head.appendChild(m)}function initDataDog(a){const{enabled:c,scriptUrl:o,...t}=a;c&&createScriptElement(document,{scriptId:"dataDogRumScript",scriptUrl:o,onload:()=>{const e=document?.defaultView?.DD_RUM;if(e){const d=document?.querySelector('meta[name="sxm:version"]')?.getAttribute("content");d&&(t.version=d),t.beforeSend=(m,g)=>m?.type==="error"&&m?.error?.source==="report"&&m?.error?.csp?.disposition==="report"?!1:(setQMSessionId(e),setAdobeECID(e),setDeviceId(e),m?.view?.url&&(m.view.url=maskUrl(m.view.url)),(m?.resource?.type==="xhr"||m?.resource?.type==="fetch"||m?.resource?.type==="document")&&m?.resource?.url&&(m.resource.url=maskUrl(m.resource.url)),captureLogMessage(m,g,e),!0),e.init(t),e.startSessionReplayRecording()}},crossOrigin:"anonymous"})}function setDeviceId(a){try{if(!a?.getGlobalContext()?.device_id&&document?.cookie.includes("DEVICE_GRANT=")!==-1){const c=document?.cookie.split(";").find(o=>o.includes("DEVICE_GRANT=")).split("=")[1];a?.setGlobalContextProperty("device_id",JSON.parse(decodeURIComponent(c))?.deviceId)}}catch{}}function setQMSessionId(a){if(!a?.getGlobalContext()?.qm_session_id&&document?.defaultView?._satellite?.getVar("qm:quantumMetricSessionID")){const c=document?.defaultView?._satellite?.getVar("qm:quantumMetricSessionID");a?.setGlobalContextProperty("qm_session_id",c),a?.setGlobalContextProperty("qm_session_url",`https://siriusxm.quantummetric.com/#/replay/cookie:${c}`)}}function setAdobeECID(a){!a?.getGlobalContext()?.ecid&&document?.defaultView?._satellite?.getVar("ecid")&&a?.setGlobalContextProperty("ecid",document?.defaultView?._satellite?.getVar("ecid"))}function captureLogMessage(a,c,o){try{if((a?.resource?.type==="xhr"||a?.resource?.type==="fetch")&&a?.resource?.url?.endsWith("/services/utility/log-message")){const t=JSON.parse(c?.requestInit?.body);t&&a.context&&t.logLevel==="ERROR"&&(a.context.log={message:t.message,stacktrace:t.stacktrace})}}catch{}}function maskUrl(a){const c=new URL(a);if(c?.hostname?.endsWith("siriusxm.com")||c?.hostname?.endsWith("siriusxm.ca"))for(const o of c?.searchParams?.keys())sensitiveParams.includes(o.toLowerCase())&&c.searchParams.set(o,"xxxxx");return c?.toString()}(async()=>{if(typeof window<"u"){const a=window.location.href,c=getCountryFromUrl(a);if(c){const o=await fetch(`assets/configs/${c}.third-party-scripts.json`),{adobeLaunch:t,oneTrust:e,dataDog:d}=await o.json();initDataDog(d),initAdobeLaunch(t),initOneTrust(e)}}})();
