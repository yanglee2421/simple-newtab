import{r,v as A,ac as _,d as B}from"./index-a3b6d2d0.js";import{u as D}from"./useFlexGapSupport-f4c3c6eb.js";import{C as M,d as R}from"./button-eb3dc422.js";function T(t){let{className:s,direction:a,index:e,marginDirection:n,children:l,split:c,wrap:x}=t;const{horizontalSize:p,verticalSize:y,latestIndex:f,supportFlexGap:S}=r.useContext(N);let o={};return S||(a==="vertical"?e<f&&(o={marginBottom:p/(c?2:1)}):o=Object.assign(Object.assign({},e<f&&{[n]:p/(c?2:1)}),x&&{paddingBottom:y})),l==null?null:r.createElement(r.Fragment,null,r.createElement("div",{className:s,style:o},l),e<f&&c&&r.createElement("span",{className:`${s}-split`,style:o},c))}var L=globalThis&&globalThis.__rest||function(t,s){var a={};for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&s.indexOf(e)<0&&(a[e]=t[e]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,e=Object.getOwnPropertySymbols(t);n<e.length;n++)s.indexOf(e[n])<0&&Object.prototype.propertyIsEnumerable.call(t,e[n])&&(a[e[n]]=t[e[n]]);return a};const N=r.createContext({latestIndex:0,horizontalSize:0,verticalSize:0,supportFlexGap:!1}),W={small:8,middle:16,large:24};function q(t){return typeof t=="string"?W[t]:t||0}const H=t=>{const{getPrefixCls:s,space:a,direction:e}=r.useContext(A),{size:n=(a==null?void 0:a.size)||"small",align:l,className:c,children:x,direction:p="horizontal",prefixCls:y,split:f,style:S,wrap:o=!1}=t,$=L(t,["size","align","className","children","direction","prefixCls","split","style","wrap"]),d=D(),[C,g]=r.useMemo(()=>(Array.isArray(n)?n:[n,n]).map(i=>q(i)),[n]),z=_(x,{keepEmpty:!0}),h=l===void 0&&p==="horizontal"?"center":l,m=s("space",y),[j,E]=R(m),P=B(m,E,`${m}-${p}`,{[`${m}-rtl`]:e==="rtl",[`${m}-align-${h}`]:h},c),O=`${m}-item`,G=e==="rtl"?"marginLeft":"marginRight";let b=0;const I=z.map((i,v)=>{i!=null&&(b=v);const k=i&&i.key||`${O}-${v}`;return r.createElement(T,{className:O,key:k,direction:p,index:v,marginDirection:G,split:f,wrap:o},i)}),F=r.useMemo(()=>({horizontalSize:C,verticalSize:g,latestIndex:b,supportFlexGap:d}),[C,g,b,d]);if(z.length===0)return null;const u={};return o&&(u.flexWrap="wrap",d||(u.marginBottom=-g)),d&&(u.columnGap=C,u.rowGap=g),j(r.createElement("div",Object.assign({className:P,style:Object.assign(Object.assign({},u),S)},$),r.createElement(N.Provider,{value:F},I)))},w=H;w.Compact=M;const U=w;export{U as S};
