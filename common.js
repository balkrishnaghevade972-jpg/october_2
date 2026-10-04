
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* panda drawing */
const PANDA=`<svg viewBox="0 0 200 190" aria-hidden="true">
<circle cx="42" cy="42" r="28" fill="#15151f"/><circle cx="158" cy="42" r="28" fill="#15151f"/>
<ellipse cx="100" cy="108" rx="82" ry="72" fill="#f7f7fb"/>
<ellipse cx="66" cy="102" rx="19" ry="25" fill="#15151f" transform="rotate(25 66 102)"/>
<ellipse cx="134" cy="102" rx="19" ry="25" fill="#15151f" transform="rotate(-25 134 102)"/>
<g class="eyes"><circle cx="68" cy="100" r="8" fill="#fff"/><circle cx="69" cy="102" r="4.5" fill="#15151f"/>
<circle cx="132" cy="100" r="8" fill="#fff"/><circle cx="131" cy="102" r="4.5" fill="#15151f"/></g>
<ellipse class="tear" cx="62" cy="116" rx="3" ry="5"/>
<ellipse cx="100" cy="126" rx="10" ry="7" fill="#15151f"/>
<path d="M90 138q10 9 10 0q0 9 10 0" fill="none" stroke="#15151f" stroke-width="3" stroke-linecap="round"/>
<circle class="blush" cx="38" cy="132" r="11" fill="#ff9fb8" opacity=".55"/><circle class="blush" cx="162" cy="132" r="11" fill="#ff9fb8" opacity=".55"/></svg>`;
document.querySelectorAll('.panda').forEach(p=>{p.innerHTML=PANDA;if(p.dataset.mood==='happy')p.classList.add('happy')});

/* scroll reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.25});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));


/* page navigation */
function go(url){document.body.classList.add('leaving');setTimeout(()=>{location.href=url},600)}
document.addEventListener('click',e=>{const a=e.target.closest('a.go');if(a){e.preventDefault();go(a.getAttribute('href'))}});
addEventListener('pageshow',()=>document.body.classList.remove('leaving'));
(function(){const n=+document.body.dataset.step;if(!n)return;
  const d=document.createElement('div');d.className='steps';
  d.innerHTML=[1,2,3,4,5].map(i=>`<i class="${i===n?'on':i<n?'past':''}"></i>`).join('');document.body.appendChild(d)})();
(function(){const b=document.body.dataset.back;if(!b)return;
  const a=document.createElement('a');a.className='back go';a.href=b;a.textContent='‹ back';document.body.appendChild(a)})();

/* effects canvas: twinkles, shooting stars, fireflies, heart bursts */
const cv=$('fx'),ctx=cv.getContext('2d');
let W,H,st=[],fl=[],sh=[],hb=[];
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;
  st=Array.from({length:Math.floor(W*H/9000)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.3,p:Math.random()*6}));
  fl=Array.from({length:reduce?0:18},()=>({x:Math.random()*W,y:Math.random()*H,r:1.5+Math.random()*2,vy:-.15-Math.random()*.35,p:Math.random()*6}))}
addEventListener('resize',size);size();
function burst(x,y,n){if(reduce)return;for(let k=0;k<n;k++)hb.push({x,y,s:5+Math.random()*10,vx:(Math.random()-.5)*9,vy:-Math.random()*9-1,a:1,c:['#ff9fb8','#f5b86b','#e8ecff'][k%3]})}
function heart(x,y,s){ctx.beginPath();ctx.moveTo(x,y+s/4);ctx.bezierCurveTo(x,y-s/2,x-s,y-s/2,x-s,y+s/4);
  ctx.bezierCurveTo(x-s,y+s,x,y+s*1.2,x,y+s*1.5);ctx.bezierCurveTo(x,y+s*1.2,x+s,y+s,x+s,y+s/4);
  ctx.bezierCurveTo(x+s,y-s/2,x,y-s/2,x,y+s/4);ctx.fill()}
setInterval(()=>{if(!reduce&&!document.hidden)sh.push({x:Math.random()*W*.8+W*.2,y:Math.random()*H*.4,l:0})},5000);
(function loop(t){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#e8ecff';
  for(const s of st){ctx.globalAlpha=reduce?.5:.25+.5*Math.abs(Math.sin(t/1800+s.p));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.3);ctx.fill()}
  ctx.fillStyle='#f5b86b';
  for(const f of fl){f.y+=f.vy;f.x+=Math.sin(t/1200+f.p)*.3;if(f.y<-10){f.y=H+10;f.x=Math.random()*W}
    ctx.globalAlpha=.25+.5*Math.abs(Math.sin(t/900+f.p));ctx.shadowColor='#f5b86b';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.3);ctx.fill()}
  ctx.shadowBlur=0;
  sh=sh.filter(s=>s.l<1);
  for(const s of sh){s.l+=.02;const x=s.x-s.l*260,y=s.y+s.l*140;
    const g=ctx.createLinearGradient(x,y,x+90,y-49);g.addColorStop(0,'rgba(255,255,255,'+(1-s.l)+')');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+90,y-49);ctx.stroke()}
  hb=hb.filter(h=>h.a>.02);
  for(const h of hb){h.x+=h.vx;h.y+=h.vy;h.vy+=.2;h.a-=.009;ctx.globalAlpha=h.a;ctx.fillStyle=h.c;heart(h.x,h.y,h.s/2)}
  ctx.globalAlpha=1;requestAnimationFrame(loop);
})(0);
