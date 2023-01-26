var A=Object.defineProperty;var C=(h,t,s)=>t in h?A(h,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):h[t]=s;var n=(h,t,s)=>(C(h,typeof t!="symbol"?t+"":t,s),s),b=(h,t,s)=>{if(!t.has(h))throw TypeError("Cannot "+s)};var i=(h,t,s)=>(b(h,t,"read from private field"),s?s.call(h):t.get(h)),r=(h,t,s)=>{if(t.has(h))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(h):t.set(h,s)},d=(h,t,s,a)=>(b(h,t,"write to private field"),a?a.call(h,s):t.set(h,s),s);class g{constructor(t,s){this.min=t,this.max=s}get(){return Math.random()*(this.max-this.min)+this.min}}const S=new g(-.5,.5),k=new g(2,3),L=new g(1,4);var y,E;class R{constructor(t){r(this,y);n(this,"x",0);n(this,"y",0);n(this,"xv",0);n(this,"yv",2);n(this,"r",0);n(this,"color","");this.canvas=t,this.reset(),this.y=Math.random()*this.canvas.height}reset(){this.x=Math.random()*this.canvas.width,this.y=0,this.xv=S.get(),this.yv=k.get(),this.r=L.get(),this.color=`rgba(255,255,255,${.5+this.r/4})`}draw(){const t=this.canvas.getContext("2d");t.beginPath(),t.arc(this.x,this.y,this.r,0,Math.PI*2),t.closePath(),t.fillStyle=this.color,t.shadowColor="#fff",t.shadowBlur=10,t.fill()}update(){i(this,y,E)||this.reset(),this.x+=this.xv,this.y+=this.yv,this.draw()}}y=new WeakSet,E=function(){const t=this.x>0&&this.x<this.canvas.width,s=this.y>0&&this.y<this.canvas.height;return t&&s};var v,u;class ${constructor(t,s=100){r(this,v,[]);r(this,u,0);this.canvas=t;for(let a=0;a<s;a++)i(this,v).push(new R(t))}animation(){d(this,u,requestAnimationFrame(this.animation.bind(this)));const t=this.canvas.getContext("2d"),{width:s,height:a}=this.canvas;t.clearRect(0,0,s,a),i(this,v).forEach(c=>c.update())}abortAnimation(){cancelAnimationFrame(i(this,u))}}v=new WeakMap,u=new WeakMap;const M=new g(-1,1),F=new g(2,4);class P{constructor(t){n(this,"xv",M.get());n(this,"yv",M.get());n(this,"radius",F.get());n(this,"x");n(this,"y");n(this,"color");this.canvas=t,this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.color=`rgba(254,250,255,${1-1/this.radius})`}draw(){const t=this.canvas.getContext("2d");t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.closePath(),t.strokeStyle=this.color,t.stroke()}update(){const{width:t,height:s}=this.canvas;(this.x<0||this.x>t)&&(this.xv*=-1),(this.y<0||this.y>s)&&(this.yv*=-1),this.x+=this.xv,this.y+=this.yv,this.draw()}}var o,m,e,x;class p{constructor(t,s=100,a=100){r(this,o,[]);r(this,m,0);r(this,e,null);r(this,x,new AbortController);this.canvas=t,this.lineMax=a;for(let c=0;c<s;c++)i(this,o).push(new P(this.canvas))}drawLine(){i(this,o).forEach((t,s)=>{i(this,o).slice(s+1).forEach(a=>{const c=Math.abs(t.x-a.x);if(c>this.lineMax)return;const w=Math.abs(t.y-a.y);if(w>this.lineMax)return;const f=Math.sqrt(c**2+w**2);if(f>this.lineMax)return;const l=this.canvas.getContext("2d");l.beginPath(),l.moveTo(t.x,t.y),l.lineTo(a.x,a.y),l.closePath(),l.strokeStyle=`rgba(254,250,255, ${1-f/this.lineMax})`,l.lineWidth=.8,l.stroke()})})}animate(){d(this,m,requestAnimationFrame(this.animate.bind(this))),this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height),i(this,o).forEach(s=>s.update()),this.drawLine()}abortAnimate(){cancelAnimationFrame(i(this,m))}bindEvent(){d(this,x,new AbortController);const{signal:t}=i(this,x);this.canvas.addEventListener("mouseover",({clientX:s,clientY:a})=>{i(this,e)||(d(this,e,new P(this.canvas)),i(this,e).x=s,i(this,e).y=a,i(this,e).xv=0,i(this,e).yv=0,i(this,o).push(i(this,e)))},{signal:t}),this.canvas.addEventListener("mousemove",({clientX:s,clientY:a})=>{!i(this,e)||(i(this,e).x=s,i(this,e).y=a)},{signal:t}),this.canvas.addEventListener("mouseout",()=>{!i(this,e)||i(this,o).includes(i(this,e))&&(i(this,o).splice(i(this,o).indexOf(i(this,e)),1),d(this,e,null))},{signal:t})}abortEvent(){i(this,x).abort()}}o=new WeakMap,m=new WeakMap,e=new WeakMap,x=new WeakMap;export{p as P,$ as S};
