import{r as e,w as c,at as l}from"./index-a3b6d2d0.js";const p=e.createContext({labelAlign:"right",vertical:!1,itemRef:()=>{}}),C=e.createContext(null),x=t=>{const n=c(t,["prefixCls"]);return e.createElement(l,Object.assign({},n))},I=e.createContext({prefixCls:""}),s=e.createContext({}),f=t=>{let{children:n,status:r,override:i}=t;const a=e.useContext(s),m=e.useMemo(()=>{const o=Object.assign({},a);return i&&delete o.isFormItemInput,r&&(delete o.status,delete o.hasFeedback,delete o.feedbackIcon),o},[r,i,a]);return e.createElement(s.Provider,{value:m},n)},d=t=>({[t.componentCls]:{[`${t.antCls}-motion-collapse-legacy`]:{overflow:"hidden","&-active":{transition:`height ${t.motionDurationMid} ${t.motionEaseInOut},
        opacity ${t.motionDurationMid} ${t.motionEaseInOut} !important`}},[`${t.antCls}-motion-collapse`]:{overflow:"hidden",transition:`height ${t.motionDurationMid} ${t.motionEaseInOut},
        opacity ${t.motionDurationMid} ${t.motionEaseInOut} !important`}}}),$=d;export{s as F,C as N,I as a,p as b,x as c,f as d,$ as g};
