import{ab as re,H as ne,A as ie,p as W,y as ae,a2 as K,v as D,J as oe,t as le}from"./index-d971bd58.js";import{r as o}from"./jsx-runtime-d4f0a224.js";import{T as se,h as ue,j as ce,k as fe}from"./api-rtkq-ff3ef5cb.js";function B(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(ne(e)){var t=e.nodeName.toLowerCase(),r=["input","select","textarea","button"].includes(t)||e.isContentEditable||t==="a"&&!!e.getAttribute("href"),i=e.getAttribute("tabindex"),a=Number(i),l=null;return i&&!Number.isNaN(a)?l=a:r&&l===null&&(l=0),r&&e.disabled&&(l=null),l!==null&&(l>=0||n&&l<0)}return!1}function ve(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,t=re(e.querySelectorAll("*")).filter(function(r){return B(r,n)});return B(e,n)&&t.unshift(e),t}var pe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"ellipsis",theme:"outlined"};const me=pe;var q=function(n,t){return o.createElement(ie,W(W({},n),{},{ref:t,icon:me}))};q.displayName="EllipsisOutlined";const Re=o.forwardRef(q);function J(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function G(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),t.push.apply(t,r)}return t}function I(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?G(Object(t),!0).forEach(function(r){J(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):G(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}function ge(e){if(Array.isArray(e))return e}function de(e,n){var t=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(t!=null){var r=[],i=!0,a=!1,l,g;try{for(t=t.call(e);!(i=(l=t.next()).done)&&(r.push(l.value),!(n&&r.length===n));i=!0);}catch(v){a=!0,g=v}finally{try{!i&&t.return!=null&&t.return()}finally{if(a)throw g}}return r}}function H(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function ye(e,n){if(!!e){if(typeof e=="string")return H(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return H(e,n)}}function be(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function he(e,n){return ge(e)||de(e,n)||ye(e,n)||be()}function Oe(e,n){if(e==null)return{};var t={},r=Object.keys(e),i,a;for(a=0;a<r.length;a++)i=r[a],!(n.indexOf(i)>=0)&&(t[i]=e[i]);return t}function Ce(e,n){if(e==null)return{};var t=Oe(e,n),r,i;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)r=a[i],!(n.indexOf(r)>=0)&&(!Object.prototype.propertyIsEnumerable.call(e,r)||(t[r]=e[r]))}return t}var E={adjustX:1,adjustY:1},A=[0,0],we={topLeft:{points:["bl","tl"],overflow:E,offset:[0,-4],targetOffset:A},topCenter:{points:["bc","tc"],overflow:E,offset:[0,-4],targetOffset:A},topRight:{points:["br","tr"],overflow:E,offset:[0,-4],targetOffset:A},bottomLeft:{points:["tl","bl"],overflow:E,offset:[0,4],targetOffset:A},bottomCenter:{points:["tc","bc"],overflow:E,offset:[0,4],targetOffset:A},bottomRight:{points:["tr","br"],overflow:E,offset:[0,4],targetOffset:A}},Se=K.ESC,Ee=K.TAB;function Ae(e){var n=e.visible,t=e.setTriggerVisible,r=e.triggerRef,i=e.onVisibleChange,a=e.autoFocus,l=o.useRef(!1),g=function(){if(n&&r.current){var c,u,p,f;(c=r.current)===null||c===void 0||(u=c.triggerRef)===null||u===void 0||(p=u.current)===null||p===void 0||(f=p.focus)===null||f===void 0||f.call(p),t(!1),typeof i=="function"&&i(!1)}},v=function(){var c,u,p,f,w=ve((c=r.current)===null||c===void 0||(u=c.popupRef)===null||u===void 0||(p=u.current)===null||p===void 0||(f=p.getElement)===null||f===void 0?void 0:f.call(p)),d=w[0];return d!=null&&d.focus?(d.focus(),l.current=!0,!0):!1},b=function(c){switch(c.keyCode){case Se:g();break;case Ee:{var u=!1;l.current||(u=v()),u?c.preventDefault():g();break}}};o.useEffect(function(){return n?(window.addEventListener("keydown",b),a&&ae(v,3),function(){window.removeEventListener("keydown",b),l.current=!1}):function(){l.current=!1}},[n])}var Pe=["arrow","prefixCls","transitionName","animation","align","placement","placements","getPopupContainer","showAction","hideAction","overlayClassName","overlayStyle","visible","trigger","autoFocus"];function Ne(e,n){var t=e.arrow,r=t===void 0?!1:t,i=e.prefixCls,a=i===void 0?"rc-dropdown":i,l=e.transitionName,g=e.animation,v=e.align,b=e.placement,y=b===void 0?"bottomLeft":b,c=e.placements,u=c===void 0?we:c,p=e.getPopupContainer,f=e.showAction,w=e.hideAction,d=e.overlayClassName,M=e.overlayStyle,T=e.visible,h=e.trigger,_=h===void 0?["hover"]:h,V=e.autoFocus,R=Ce(e,Pe),k=o.useState(),z=he(k,2),P=z[0],N=z[1],j="visible"in e?T:P,O=o.useRef(null);o.useImperativeHandle(n,function(){return O.current}),Ae({visible:j,setTriggerVisible:N,triggerRef:O,onVisibleChange:e.onVisibleChange,autoFocus:V});var C=function(){var s=e.overlay,m;return typeof s=="function"?m=s():m=s,m},x=function(s){var m=e.onOverlayClick;N(!1),m&&m(s)},F=function(s){var m=e.onVisibleChange;N(s),typeof m=="function"&&m(s)},L=function(){var s=C();return o.createElement(o.Fragment,null,r&&o.createElement("div",{className:"".concat(a,"-arrow")}),s)},Y=function(){var s=e.overlay;return typeof s=="function"?L:L()},Q=function(){var s=e.minOverlayWidthMatchTrigger,m=e.alignPoint;return"minOverlayWidthMatchTrigger"in e?s:!m},Z=function(){var s=e.openClassName;return s!==void 0?s:"".concat(a,"-open")},ee=function(){var s=e.children,m=s.props?s.props:{},te=D(m.className,Z());return j&&s?o.cloneElement(s,{className:te}):s},$=w;return!$&&_.indexOf("contextMenu")!==-1&&($=["click"]),o.createElement(se,I(I({builtinPlacements:u},R),{},{prefixCls:a,ref:O,popupClassName:D(d,J({},"".concat(a,"-show-arrow"),r)),popupStyle:M,action:_,showAction:f,hideAction:$||[],popupPlacement:y,popupAlign:v,popupTransitionName:l,popupAnimation:g,popupVisible:j,stretch:Q()?"minWidth":"",popup:Y(),onPopupVisibleChange:F,onPopupClick:x,getPopupContainer:p}),ee())}const Fe=o.forwardRef(Ne);function je(e){let{className:n,direction:t,index:r,marginDirection:i,children:a,split:l,wrap:g}=e;const{horizontalSize:v,verticalSize:b,latestIndex:y,supportFlexGap:c}=o.useContext(U);let u={};return c||(t==="vertical"?r<y&&(u={marginBottom:v/(l?2:1)}):u=Object.assign(Object.assign({},r<y&&{[i]:v/(l?2:1)}),g&&{paddingBottom:b})),a==null?null:o.createElement(o.Fragment,null,o.createElement("div",{className:n,style:u},a),r<y&&l&&o.createElement("span",{className:`${n}-split`,style:u},l))}var xe=globalThis&&globalThis.__rest||function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)n.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(t[r[i]]=e[r[i]]);return t};const U=o.createContext({latestIndex:0,horizontalSize:0,verticalSize:0,supportFlexGap:!1}),Me={small:8,middle:16,large:24};function Te(e){return typeof e=="string"?Me[e]:e||0}const _e=e=>{const{getPrefixCls:n,space:t,direction:r}=o.useContext(oe),{size:i=(t==null?void 0:t.size)||"small",align:a,className:l,children:g,direction:v="horizontal",prefixCls:b,split:y,style:c,wrap:u=!1}=e,p=xe(e,["size","align","className","children","direction","prefixCls","split","style","wrap"]),f=ce(),[w,d]=o.useMemo(()=>(Array.isArray(i)?i:[i,i]).map(C=>Te(C)),[i]),M=le(g,{keepEmpty:!0}),T=a===void 0&&v==="horizontal"?"center":a,h=n("space",b),[_,V]=fe(h),R=D(h,V,`${h}-${v}`,{[`${h}-rtl`]:r==="rtl",[`${h}-align-${T}`]:T},l),k=`${h}-item`,z=r==="rtl"?"marginLeft":"marginRight";let P=0;const N=M.map((C,x)=>{C!=null&&(P=x);const F=C&&C.key||`${k}-${x}`;return o.createElement(je,{className:k,key:F,direction:v,index:x,marginDirection:z,split:y,wrap:u},C)}),j=o.useMemo(()=>({horizontalSize:w,verticalSize:d,latestIndex:P,supportFlexGap:f}),[w,d,P,f]);if(M.length===0)return null;const O={};return u&&(O.flexWrap="wrap",f||(O.marginBottom=-d)),f&&(O.columnGap=w,O.rowGap=d),_(o.createElement("div",Object.assign({className:R,style:Object.assign(Object.assign({},O),c)},p),o.createElement(U.Provider,{value:j},N)))},X=_e;X.Compact=ue;const $e=X;export{Fe as D,Re as E,$e as S,ve as g};
