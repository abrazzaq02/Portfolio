(() => {
'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.querySelector('.navbar');
const toggle = document.querySelector('.menu-toggle');
if (toggle && nav) {
  toggle.setAttribute('aria-label','Toggle navigation');toggle.setAttribute('aria-expanded','false');
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('active');toggle.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('active');toggle.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('active');toggle.setAttribute('aria-expanded','false');}});
}
// User-visible typewriter; no library/CDN dependency.
const typing=document.querySelector('.typing-text');
const roles=['AI & ML Developer','Computer Vision Builder','Generative AI Explorer','Python Developer','Problem Solver'];
if(typing){if(reduceMotion){typing.textContent=roles[0];}else{let ri=0,ci=0,del=false;function type(){const word=roles[ri];ci+=del?-1:1;typing.textContent=word.slice(0,ci);if(!del&&ci===word.length){del=true;setTimeout(type,1700);return;}if(del&&ci===0){del=false;ri=(ri+1)%roles.length;}setTimeout(type,del?42:77);}type();}}
const links=Array.from(document.querySelectorAll('.nav-link'));
const sections=Array.from(document.querySelectorAll('section[id]'));
let queued=false;
window.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{let current='home';for(const sec of sections){if(sec.getBoundingClientRect().top<170)current=sec.id;}links.forEach(a=>a.classList.toggle('active',a.hash==='#'+current));queued=false;});},{passive:true});
// Reveal on scroll, avoids animating every descendant separately.
const targets=document.querySelectorAll('.section-header,.project-card,.cert-card,.skill-category,.timeline-item,.highlight-card,.service-card,.about-text,.about-image');
if(!reduceMotion&&'IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});targets.forEach((e,i)=>{e.classList.add('reveal');e.style.transitionDelay=((i%3)*65)+'ms';io.observe(e);});}
// 3D mouse response only for fine pointers; keyboard focus unaffected.
if(!reduceMotion&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
 const tilted=document.querySelectorAll('.interactive-tilt,.btn,.social-icon,.social-card,.filter-chip,.cert-link');
 tilted.forEach(el=>{
  let rect;
  el.addEventListener('pointerenter',()=>{rect=el.getBoundingClientRect();});
  el.addEventListener('pointermove',e=>{rect=rect||el.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;el.style.setProperty('--x',((x+.5)*100)+'%');el.style.setProperty('--y',((y+.5)*100)+'%');el.style.transform=`perspective(800px) rotateX(${-y*9}deg) rotateY(${x*11}deg) translateY(-4px) translateZ(5px)`;});
  el.addEventListener('pointerleave',()=>{el.style.transform='';rect=null;});
 });
}
// Certificate category filter.
const chips=document.querySelectorAll('.filter-chip');
chips.forEach(chip=>chip.addEventListener('click',()=>{const value=chip.dataset.filter;chips.forEach(c=>{const active=c===chip;c.classList.toggle('active',active);c.setAttribute('aria-pressed',String(active));});document.querySelectorAll('.cert-card').forEach(card=>{card.hidden=value!=='All'&&card.dataset.category!==value;});}));
// Native modal viewer, image files bundled in this site.
const dialog=document.querySelector('#certificate-dialog');
const dialogImg=document.querySelector('#dialog-image');const dialogTitle=document.querySelector('#dialog-title');const dialogOpen=document.querySelector('#dialog-open');
document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>{if(!dialog)return;const path=button.dataset.full;dialogImg.src=path;dialogImg.alt=button.dataset.title+' certificate';dialogTitle.textContent=button.dataset.title;dialogOpen.href=path;dialog.showModal();}));
document.querySelector('#close-dialog')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog?.addEventListener('close',()=>{dialogImg.removeAttribute('src');});
// Form uses mail client instead of pretending to submit to an absent backend.
const form=document.querySelector('#contactForm');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const subject=(data.get('subject')||'Portfolio inquiry').toString();const body=`From: ${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`;window.location.href='mailto:'+form.dataset.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);});
// Lightweight canvas starfield with parallax and perspective; capped DPR / star count.
const canvas=document.querySelector('#space-canvas');
if(!canvas||reduceMotion)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
let W=0,H=0,dpr=1,stars=[],mouse={x:0,y:0},last=0,raf;
function resize(){dpr=Math.min(window.devicePixelRatio||1,1.6);W=window.innerWidth;H=window.innerHeight;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(130,Math.floor(W*H/9500));stars=Array.from({length:count},()=>({x:Math.random()*W,y:Math.random()*H,z:.25+Math.random()*1.3,r:.5+Math.random()*1.4,s:.04+Math.random()*.23,p:Math.random()*6.3}));}
function paint(t){if(t-last<30){raf=requestAnimationFrame(paint);return;}last=t;ctx.clearRect(0,0,W,H);for(const p of stars){const x=(p.x+mouse.x*p.z*.018+W)%W;const y=(p.y+mouse.y*p.z*.018+H)%H;p.y+=p.s*p.z;if(p.y>H)p.y=0;const a=.27+.25*Math.sin(t*.0016+p.p);ctx.beginPath();ctx.fillStyle=p.z>.9?`rgba(212,175,55,${a})`:`rgba(0,195,137,${a})`;ctx.arc(x,y,p.r*p.z,0,Math.PI*2);ctx.fill();}raf=requestAnimationFrame(paint);}
window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',e=>{mouse.x=e.clientX-W/2;mouse.y=e.clientY-H/2;},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else raf=requestAnimationFrame(paint);});resize();raf=requestAnimationFrame(paint);
})();
