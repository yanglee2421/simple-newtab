import{I as T,N as M,X as P,J as E,v as h,Q as X,af as w,K as N}from"./index-d971bd58.js";import{r as a}from"./jsx-runtime-d4f0a224.js";import{K as I}from"./api-rtkq-ff3ef5cb.js";function L(n,t,e){var i=e||{},o=i.noTrailing,r=o===void 0?!1:o,p=i.noLeading,$=p===void 0?!1:p,b=i.debounceMode,l=b===void 0?void 0:b,c,C=!1,m=0;function v(){c&&clearTimeout(c)}function z(g){var f=g||{},s=f.upcomingOnly,S=s===void 0?!1:s;v(),C=!S}function D(){for(var g=arguments.length,f=new Array(g),s=0;s<g;s++)f[s]=arguments[s];var S=this,d=Date.now()-m;if(C)return;function u(){m=Date.now(),t.apply(S,f)}function x(){c=void 0}!$&&l&&!c&&u(),v(),l===void 0&&d>n?$?(m=Date.now(),r||(c=setTimeout(l?x:u,n))):u():r!==!0&&(c=setTimeout(l?x:u,l===void 0?n-d:n))}return D.cancel=z,D}function j(n,t,e){var i=e||{},o=i.atBegin,r=o===void 0?!1:o;return L(n,t,{debounceMode:r!==!1})}const G=new I("antSpinMove",{to:{opacity:1}}),_=new I("antRotate",{to:{transform:"rotate(405deg)"}}),H=n=>({[`${n.componentCls}`]:Object.assign(Object.assign({},P(n)),{position:"absolute",display:"none",color:n.colorPrimary,textAlign:"center",verticalAlign:"middle",opacity:0,transition:`transform ${n.motionDurationSlow} ${n.motionEaseInOutCirc}`,"&-spinning":{position:"static",display:"inline-block",opacity:1},"&-nested-loading":{position:"relative",[`> div > ${n.componentCls}`]:{position:"absolute",top:0,insetInlineStart:0,zIndex:4,display:"block",width:"100%",height:"100%",maxHeight:n.contentHeight,[`${n.componentCls}-dot`]:{position:"absolute",top:"50%",insetInlineStart:"50%",margin:-n.spinDotSize/2},[`${n.componentCls}-text`]:{position:"absolute",top:"50%",width:"100%",paddingTop:(n.spinDotSize-n.fontSize)/2+2,textShadow:`0 1px 2px ${n.colorBgContainer}`},[`&${n.componentCls}-show-text ${n.componentCls}-dot`]:{marginTop:-(n.spinDotSize/2)-10},"&-sm":{[`${n.componentCls}-dot`]:{margin:-n.spinDotSizeSM/2},[`${n.componentCls}-text`]:{paddingTop:(n.spinDotSizeSM-n.fontSize)/2+2},[`&${n.componentCls}-show-text ${n.componentCls}-dot`]:{marginTop:-(n.spinDotSizeSM/2)-10}},"&-lg":{[`${n.componentCls}-dot`]:{margin:-(n.spinDotSizeLG/2)},[`${n.componentCls}-text`]:{paddingTop:(n.spinDotSizeLG-n.fontSize)/2+2},[`&${n.componentCls}-show-text ${n.componentCls}-dot`]:{marginTop:-(n.spinDotSizeLG/2)-10}}},[`${n.componentCls}-container`]:{position:"relative",transition:`opacity ${n.motionDurationSlow}`,"&::after":{position:"absolute",top:0,insetInlineEnd:0,bottom:0,insetInlineStart:0,zIndex:10,width:"100%",height:"100%",background:n.colorBgContainer,opacity:0,transition:`all ${n.motionDurationSlow}`,content:'""',pointerEvents:"none"}},[`${n.componentCls}-blur`]:{clear:"both",opacity:.5,userSelect:"none",pointerEvents:"none",["&::after"]:{opacity:.4,pointerEvents:"auto"}}},["&-tip"]:{color:n.spinDotDefault},[`${n.componentCls}-dot`]:{position:"relative",display:"inline-block",fontSize:n.spinDotSize,width:"1em",height:"1em","&-item":{position:"absolute",display:"block",width:(n.spinDotSize-n.marginXXS/2)/2,height:(n.spinDotSize-n.marginXXS/2)/2,backgroundColor:n.colorPrimary,borderRadius:"100%",transform:"scale(0.75)",transformOrigin:"50% 50%",opacity:.3,animationName:G,animationDuration:"1s",animationIterationCount:"infinite",animationTimingFunction:"linear",animationDirection:"alternate","&:nth-child(1)":{top:0,insetInlineStart:0},"&:nth-child(2)":{top:0,insetInlineEnd:0,animationDelay:"0.4s"},"&:nth-child(3)":{insetInlineEnd:0,bottom:0,animationDelay:"0.8s"},"&:nth-child(4)":{bottom:0,insetInlineStart:0,animationDelay:"1.2s"}},"&-spin":{transform:"rotate(45deg)",animationName:_,animationDuration:"1.2s",animationIterationCount:"infinite",animationTimingFunction:"linear"}},[`&-sm ${n.componentCls}-dot`]:{fontSize:n.spinDotSizeSM,i:{width:(n.spinDotSizeSM-n.marginXXS/2)/2,height:(n.spinDotSizeSM-n.marginXXS/2)/2}},[`&-lg ${n.componentCls}-dot`]:{fontSize:n.spinDotSizeLG,i:{width:(n.spinDotSizeLG-n.marginXXS)/2,height:(n.spinDotSizeLG-n.marginXXS)/2}},[`&${n.componentCls}-show-text ${n.componentCls}-text`]:{display:"block"}})}),B=T("Spin",n=>{const t=M(n,{spinDotDefault:n.colorTextDescription,spinDotSize:n.controlHeightLG/2,spinDotSizeSM:n.controlHeightLG*.35,spinDotSizeLG:n.controlHeight});return[H(t)]},{contentHeight:400});var R=globalThis&&globalThis.__rest||function(n,t){var e={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&t.indexOf(i)<0&&(e[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,i=Object.getOwnPropertySymbols(n);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(n,i[o])&&(e[i[o]]=n[i[o]]);return e};let y=null;function A(n,t){const{indicator:e}=t,i=`${n}-dot`;return e===null?null:w(e)?N(e,{className:h(e.props.className,i)}):w(y)?N(y,{className:h(y.props.className,i)}):a.createElement("span",{className:h(i,`${n}-dot-spin`)},a.createElement("i",{className:`${n}-dot-item`}),a.createElement("i",{className:`${n}-dot-item`}),a.createElement("i",{className:`${n}-dot-item`}),a.createElement("i",{className:`${n}-dot-item`}))}function F(n,t){return!!n&&!!t&&!isNaN(Number(t))}const K=n=>{const{spinPrefixCls:t,spinning:e=!0,delay:i=0,className:o,size:r="default",tip:p,wrapperClassName:$,style:b,children:l,hashId:c}=n,C=R(n,["spinPrefixCls","spinning","delay","className","size","tip","wrapperClassName","style","children","hashId"]),[m,v]=a.useState(()=>e&&!F(e,i));a.useEffect(()=>{const d=j(i,()=>{v(e)});return d(),()=>{var u;(u=d==null?void 0:d.cancel)===null||u===void 0||u.call(d)}},[i,e]);const z=a.useMemo(()=>typeof l<"u",[l]),{direction:D}=a.useContext(E),g=h(t,{[`${t}-sm`]:r==="small",[`${t}-lg`]:r==="large",[`${t}-spinning`]:m,[`${t}-show-text`]:!!p,[`${t}-rtl`]:D==="rtl"},o,c),f=h(`${t}-container`,{[`${t}-blur`]:m}),s=X(C,["indicator","prefixCls"]),S=a.createElement("div",Object.assign({},s,{style:b,className:g,"aria-live":"polite","aria-busy":m}),A(t,n),p?a.createElement("div",{className:`${t}-text`},p):null);return z?a.createElement("div",Object.assign({},s,{className:h(`${t}-nested-loading`,$,c)}),m&&a.createElement("div",{key:"loading"},S),a.createElement("div",{className:f,key:"container"},l)):S},O=n=>{const{prefixCls:t}=n,{getPrefixCls:e}=a.useContext(E),i=e("spin",t),[o,r]=B(i),p=Object.assign(Object.assign({},n),{spinPrefixCls:i,hashId:r});return o(a.createElement(K,Object.assign({},p)))};O.setDefaultIndicator=n=>{y=n};const q=O;export{q as S,j as d};
