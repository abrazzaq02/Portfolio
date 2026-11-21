// Interactive particle sphere for the hero, written in plain WebGL (no Three.js → ~4 KB instead of ~170 KB).
// Loaded lazily by app.js only on capable desktops. Points sit on a sphere, "breathe" with a noise wave,
// rotate toward the mouse and bulge/brighten near the cursor.

const VERT = `
attribute vec3 aPos;
attribute float aSeed;
uniform float uTime;
uniform vec2 uRot;
uniform vec2 uMouse;
uniform float uAspect;
uniform float uDpr;
varying float vDepth;
varying float vSeed;
varying float vGlow;

mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }

void main(){
  vec3 p = aPos;
  float wave = sin(p.x*3.1 + uTime*0.9) * sin(p.y*2.7 + uTime*0.7) * sin(p.z*3.4 + uTime*0.8);
  p *= 1.0 + 0.11 * wave;
  p = rotY(uTime*0.12 + uRot.x) * rotX(uRot.y) * p;

  vec2 clip = p.xy / (2.7 - p.z) * 1.6;
  clip.x /= uAspect;
  float d = distance(clip, uMouse);
  float bulge = smoothstep(0.55, 0.0, d);
  clip += normalize(clip - uMouse + 0.0001) * bulge * 0.07;

  gl_Position = vec4(clip, 0.0, 1.0);
  vDepth = (p.z + 1.0) * 0.5;
  vSeed = aSeed;
  vGlow = bulge;
  gl_PointSize = (1.8 + vDepth * 3.2 + bulge * 3.5) * uDpr;
}`;

const FRAG = `
precision mediump float;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
uniform float uAlpha;
varying float vDepth; varying float vSeed; varying float vGlow;
void main(){
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  vec3 col = mix(mix(uA, uB, vSeed), uC, smoothstep(0.55, 1.0, vSeed) * 0.8);
  col += vGlow * 0.35;
  float a = smoothstep(0.5, 0.05, r) * (0.25 + vDepth * 0.75) * uAlpha;
  gl_FragColor = vec4(col * a, a);
}`;

const hex = (h) => {
  const m = h.trim().replace('#', '');
  const n = parseInt(m.length === 3 ? m.replace(/./g, '$&$&') : m, 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function initHero3D() {
  const host = document.getElementById('hero3d');
  if (!host) return;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) return; // keep the CSS blob fallback

  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  // Fibonacci sphere: evenly spread points.
  const N = 2400;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    seed[i] = (y + 1) / 2 * 0.8 + Math.random() * 0.2;
  }
  const attr = (name, data, size) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  attr('aPos', pos, 3);
  attr('aSeed', seed, 1);
  const U = {};
  ['uTime', 'uRot', 'uMouse', 'uAspect', 'uDpr', 'uA', 'uB', 'uC', 'uAlpha'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

  gl.enable(gl.BLEND);
  const applyTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    gl.uniform3fv(U.uA, hex(cs.getPropertyValue('--accent-violet') || '#a78bfa'));
    gl.uniform3fv(U.uB, hex(cs.getPropertyValue('--accent-cyan') || '#51e3ef'));
    gl.uniform3fv(U.uC, hex(cs.getPropertyValue('--accent-pink') || '#fb76b7'));
    const light = document.documentElement.dataset.theme === 'light';
    // Additive glow on dark backgrounds, normal blending on light ones.
    if (light) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); else gl.blendFunc(gl.ONE, gl.ONE);
    gl.uniform1f(U.uAlpha, light ? 0.9 : 0.85);
  };
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    canvas.width = Math.max(1, width * dpr);
    canvas.height = Math.max(1, height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(U.uAspect, width / Math.max(height, 1));
    gl.uniform1f(U.uDpr, dpr);
  };
  host.append(canvas);
  resize();
  new ResizeObserver(resize).observe(host);

  // Mouse → target rotation + cursor position in clip space (eased every frame).
  const target = { rx: 0, ry: 0, mx: 9, my: 9 };
  const cur = { rx: 0, ry: 0, mx: 9, my: 9 };
  window.addEventListener('pointermove', (e) => {
    target.rx = (e.clientX / innerWidth - 0.5) * 1.2;
    target.ry = (e.clientY / innerHeight - 0.5) * 0.8;
    const b = canvas.getBoundingClientRect();
    target.mx = ((e.clientX - b.left) / b.width) * 2 - 1;
    target.my = -(((e.clientY - b.top) / b.height) * 2 - 1);
  }, { passive: true });

  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(host);

  const t0 = performance.now();
  function frame(now) {
    if (!visible || document.hidden) return;
    Object.keys(cur).forEach((k) => { cur[k] += (target[k] - cur[k]) * 0.06; });
    gl.uniform1f(U.uTime, (now - t0) / 1000);
    gl.uniform2f(U.uRot, cur.rx, cur.ry);
    gl.uniform2f(U.uMouse, cur.mx, cur.my);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);
  host.classList.add('is-live');
  document.documentElement.classList.add('has-hero3d');
}
