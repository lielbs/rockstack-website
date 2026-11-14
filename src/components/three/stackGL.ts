/**
 * The RockStack hero object in WebGL: the logo's three slabs are drawn as a blueprint, printed
 * into solid material by a rising scan line, then turn toward the pointer over a field of dots
 * that swells under it. Scrolling opens the stack and data rises between the layers.
 *
 * Budget: no shadow maps (the contact shadow is a texture), every particle animates in a shader,
 * the pixel ratio is capped and drops on slow devices, and nothing renders while the hero is off
 * screen or the tab is hidden. Loaded lazily by LayerStack after the page has painted.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PointLight,
  PMREMGenerator,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StackGLOptions = {
  /** Element whose pointer movement steers the stack (the hero section). */
  area: HTMLElement;
  onReady: () => void;
  /** Screen position (px, relative to the canvas) of each slab's callout anchor, top slab first. */
  onAnchors: (points: { x: number; y: number }[]) => void;
  /** Index (top slab first) of the slab under the pointer. */
  onHover: (index: number) => void;
};

// Top slab first, like the content. Sizes keep the logo's 40 / 62 / 84 width ratio.
const SLABS = [
  { w: 4.0, h: 0.7, d: 3.0, color: "#E0761A", rough: 0.28, coat: 1, tone: "#F2A35A" },
  { w: 6.2, h: 0.8, d: 4.6, color: "#868C96", rough: 0.42, coat: 0.5, tone: "#D5DAE0" },
  { w: 8.4, h: 0.9, d: 6.2, color: "#CFC9BF", rough: 0.55, coat: 0.2, tone: "#FFFFFF" },
];
const GAP = 1.25;
const OPEN = 0.9; // extra space per gap when the stack is fully open
const CORNERS = [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - (1 - t) ** 3;

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(0,0,0,0.75)");
  r.addColorStop(0.55, "rgba(0,0,0,0.32)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export function createStackGL(canvas: HTMLCanvasElement, opts: StackGLOptions) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.localClippingEnabled = true;
  let dprCap = window.innerWidth < 700 ? 1.5 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.42;

  const camera = new PerspectiveCamera(24, 1, 0.1, 100);
  const camPos = new Vector3(15, 12.5, 15);

  const key = new DirectionalLight("#fff1dc", 2.4);
  key.position.set(-7, 11, 6);
  scene.add(key);
  const rim = new DirectionalLight("#9fbcff", 1.4);
  rim.position.set(10, 4, -9);
  scene.add(rim);
  // Warm light that lives between the layers: the system "running" inside the stack
  const core = new PointLight("#FF8A2A", 0, 9, 1.6);
  scene.add(core);
  // A light that hovers where the pointer is, so the reflections follow the visitor
  const torch = new PointLight("#ffffff", 0, 14, 1.4);
  scene.add(torch);

  const root = new Group();
  scene.add(root);

  // Contact shadow under the base
  const shadowTex = shadowTexture();
  const shadow = new Mesh(
    new PlaneGeometry(13, 10),
    new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  root.add(shadow);

  // ── Dot field: a floor of points that swells and warms under the pointer ──
  const N = 46;
  const STEP = 0.48;
  const dotPos = new Float32Array(N * N * 3);
  let k = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      dotPos[k++] = (i - (N - 1) / 2) * STEP;
      dotPos[k++] = 0;
      dotPos[k++] = (j - (N - 1) / 2) * STEP;
    }
  }
  const dotGeo = new BufferGeometry();
  dotGeo.setAttribute("position", new BufferAttribute(dotPos, 3));
  const dotMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new Vector2(30, 30) },
      uReveal: { value: 0 },
      uPixel: { value: 1 },
      uCold: { value: new Color("#8a95a5") },
      uHot: { value: new Color("#E8892B") },
    },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform vec2 uPointer; uniform float uReveal; uniform float uPixel;
      varying float vA; varying float vHot;
      void main() {
        vec3 p = position;
        float r = length(p.xz);
        float d = distance(p.xz, uPointer);
        float near = exp(-d * d * 0.09);
        // a ring that travels out from the pointer
        float ring = near * (0.5 + 0.5 * sin(d * 2.4 - uTime * 3.2));
        p.y += ring * 0.32;
        float grow = smoothstep(r - 1.5, r, uReveal * 12.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vA = grow * smoothstep(11.0, 3.0, r) * (0.34 + near * 0.8);
        vHot = near;
        gl_PointSize = uPixel * (1.9 + near * 2.6) * (16.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCold; uniform vec3 uHot;
      varying float vA; varying float vHot;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float m = smoothstep(0.25, 0.12, dot(c, c));
        gl_FragColor = vec4(mix(uCold, uHot, vHot), vA * m);
      }`,
  });
  const dots = new Points(dotGeo, dotMat);
  dots.position.y = -0.01;
  root.add(dots);

  // ── Slabs: solid body (clipped while printing), blueprint edges, scan ring ──
  type Slab = {
    group: Group;
    body: Mesh;
    mat: MeshPhysicalMaterial;
    edges: LineSegments;
    edgeMat: LineBasicMaterial;
    ring: LineLoop;
    ringMat: LineBasicMaterial;
    clip: Plane;
    restY: number;
    lift: number;
    def: (typeof SLABS)[number];
  };
  const slabs: Slab[] = [];
  let y = 0;
  [...SLABS].reverse().forEach((def) => {
    const group = new Group();
    const clip = new Plane(new Vector3(0, -1, 0), -999);
    const mat = new MeshPhysicalMaterial({
      color: def.color,
      roughness: def.rough,
      metalness: 0.05,
      clearcoat: def.coat,
      clearcoatRoughness: 0.25,
      emissive: new Color(def.tone),
      emissiveIntensity: 0,
      clippingPlanes: [clip],
    });
    const body = new Mesh(new RoundedBoxGeometry(def.w, def.h, def.d, 3, 0.09), mat);
    group.add(body);

    const edgeMat = new LineBasicMaterial({ color: def.tone, transparent: true, opacity: 0.9, depthWrite: false });
    const edges = new LineSegments(new EdgesGeometry(new BoxGeometry(def.w, def.h, def.d)), edgeMat);
    edges.geometry.setDrawRange(0, 0);
    group.add(edges);

    const ringMat = new LineBasicMaterial({ color: "#FFB46A", transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const hw = def.w / 2 + 0.06;
    const hd = def.d / 2 + 0.06;
    const ringGeo = new BufferGeometry();
    ringGeo.setAttribute("position", new BufferAttribute(new Float32Array([-hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd]), 3));
    const ring = new LineLoop(ringGeo, ringMat);
    group.add(ring);

    const restY = y + def.h / 2;
    y += def.h + GAP;
    root.add(group);
    slabs.unshift({ group, body, mat, edges, edgeMat, ring, ringMat, clip, restY, lift: 0, def });
  });

  // ── Data rising between the layers (positions computed in the shader) ──
  const BEAMS = [
    [-1.3, -0.95],
    [1.3, -0.95],
    [-1.3, 0.95],
    [1.3, 0.95],
    [0, 0],
  ];
  const PER = 9;
  const bPos = new Float32Array(BEAMS.length * PER * 3);
  const bSeed = new Float32Array(BEAMS.length * PER);
  BEAMS.forEach(([x, z], b) => {
    for (let i = 0; i < PER; i++) {
      const n = b * PER + i;
      bPos[n * 3] = x;
      bPos[n * 3 + 2] = z;
      bSeed[n] = i / PER + Math.random() * 0.08;
    }
  });
  const beamGeo = new BufferGeometry();
  beamGeo.setAttribute("position", new BufferAttribute(bPos, 3));
  beamGeo.setAttribute("aSeed", new BufferAttribute(bSeed, 1));
  const beamMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uLow: { value: 0 }, uHigh: { value: 1 }, uAmt: { value: 0 }, uPixel: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uLow; uniform float uHigh; uniform float uPixel;
      attribute float aSeed; varying float vF;
      void main() {
        float f = fract(aSeed + uTime * 0.28);
        vec3 p = position; p.y = mix(uLow, uHigh, f);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vF = sin(f * 3.14159);
        gl_PointSize = uPixel * 3.2 * (16.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAmt; varying float vF;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float m = smoothstep(0.25, 0.0, dot(c, c));
        gl_FragColor = vec4(1.0, 0.62, 0.25, m * vF * uAmt);
      }`,
  });
  const beams = new Points(beamGeo, beamMat);
  root.add(beams);
  const threadMat = new LineBasicMaterial({ color: "#E8892B", transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
  const threadPos = new Float32Array(BEAMS.length * 6);
  BEAMS.forEach(([x, z], b) => threadPos.set([x, 0, z, x, 1, z], b * 6));
  const threadGeo = new BufferGeometry();
  threadGeo.setAttribute("position", new BufferAttribute(threadPos, 3));
  const threads = new LineSegments(threadGeo, threadMat);
  root.add(threads);

  // ── State ──
  let width = 1;
  let height = 1;
  let active = 0;
  let hovered = -1;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  const ndc = new Vector2();
  const floorHit = new Vector3();
  const floorPlane = new Plane(new Vector3(0, 1, 0), 0);
  const ray = new Raycaster();
  const anchor = new Vector3();
  let open = 0;
  let pointerDirty = false;
  let lastInput = performance.now();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 520 ? 33 : 28;
    // Shift the stack toward the left so the callouts have the right-hand column
    camera.setViewOffset(width, height, width * 0.13, height * 0.07, width, height);
    camera.updateProjectionMatrix();
    const px = renderer.getPixelRatio() * (height / 600);
    dotMat.uniforms.uPixel.value = px;
    beamMat.uniforms.uPixel.value = px;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const fine = window.matchMedia("(pointer: fine)").matches;
  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    pointer.tx = clamp(ndc.x, -1.2, 1.2);
    pointer.ty = clamp(ndc.y, -1.2, 1.2);
    pointer.inside = true;
    pointerDirty = true;
    lastInput = performance.now();
    wake();
  };
  const onLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
    pointer.inside = false;
    if (hovered !== -1) hovered = -1;
    wake();
  };
  if (fine) {
    opts.area.addEventListener("pointermove", onMove, { passive: true });
    opts.area.addEventListener("pointerleave", onLeave);
  }

  // ── Loop: runs only while the hero is on screen and the tab is visible ──
  let onScreen = true;
  let raf = 0;
  let disposed = false;
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    wake();
  });
  io.observe(canvas);
  const onVis = () => wake();
  document.addEventListener("visibilitychange", onVis);

  function wake() {
    if (!raf && !disposed && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
  }

  const start = performance.now();
  let last = start;
  let slowFrames = 0;
  let sampled = 0;
  let readySent = false;

  let skip = false;
  let lastLow = NaN;
  let lastHigh = NaN;

  function frame(now: number) {
    raf = 0;
    // Nothing is moving the stack (intro done, no pointer, no scroll): draw every other frame.
    const calm = now - start > 3200 && now - lastInput > 1500;
    skip = calm ? !skip : false;
    if (skip) {
      wake();
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - start) / 1000;

    // Quality: if the device can't keep up after the intro, render fewer pixels.
    if (t > 3 && sampled < 90) {
      sampled++;
      if (dt > 0.024) slowFrames++;
      if (sampled === 90 && slowFrames > 45 && dprCap > 1) {
        dprCap = 1;
        renderer.setPixelRatio(1);
        resize();
      }
    }

    const vh = window.innerHeight || 1;
    const openTarget = clamp(window.scrollY / (vh * 0.45));
    if (Math.abs(openTarget - open) > 0.002) lastInput = now;
    open += (openTarget - open) * Math.min(1, dt * 7);
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);

    // Intro: the floor appears, edges draw, then each slab prints bottom to top.
    const intro = ease(clamp(t / 2.6));
    dotMat.uniforms.uReveal.value = ease(clamp(t / 1.4));
    (shadow.material as MeshBasicMaterial).opacity = 0.85 * clamp((t - 1.2) / 1.2);
    root.rotation.y = -0.32 + (1 - intro) * 0.55 + pointer.x * 0.32 + open * 0.75;
    root.rotation.x = -pointer.y * 0.05;

    slabs.forEach((s, i) => {
      const order = 2 - i; // base first
      const drawT = clamp((t - 0.15 - order * 0.2) / 0.7);
      s.edges.geometry.setDrawRange(0, Math.floor(24 * drawT / 2) * 2);
      const printT = clamp((t - 1.0 - order * 0.42) / 0.62);
      const printing = printT > 0 && printT < 1;
      const target = i === active || i === hovered ? 1 : 0;
      s.lift += (target - s.lift) * Math.min(1, dt * 6);

      const gaps = 2 - i; // how many gaps sit below this slab
      const yPos = s.restY + gaps * open * OPEN + s.lift * 0.32;
      s.group.position.y = yPos;

      const bottom = -s.def.h / 2 - 0.01;
      const cut = bottom + (s.def.h + 0.2) * ease(printT);
      // The clip plane lives in world space: keep it at the slab's printing height.
      s.clip.constant = printT >= 1 ? 999 : yPos + cut;
      s.ring.position.y = cut;
      s.ringMat.opacity = printing ? 1 : 0;
      s.ring.visible = printing;

      const settled = clamp((t - 1.6 - order * 0.42) / 0.6);
      const restEdge = 0.18 + s.lift * 0.75;
      s.edgeMat.opacity = 0.9 + (restEdge - 0.9) * settled;
      s.mat.emissiveIntensity = s.lift * 0.14;
    });

    // Data between the layers, stronger as the stack opens
    const low = slabs[2].group.position.y + slabs[2].def.h / 2;
    const high = slabs[0].group.position.y - slabs[0].def.h / 2;
    beamMat.uniforms.uLow.value = low;
    beamMat.uniforms.uHigh.value = high;
    const amt = clamp((t - 2.4) / 1) * (0.35 + open * 0.65);
    beamMat.uniforms.uAmt.value = amt;
    threadMat.opacity = amt * 0.22;
    if (low !== lastLow || high !== lastHigh) {
      lastLow = low;
      lastHigh = high;
      for (let b = 0; b < BEAMS.length; b++) {
        threadPos[b * 6 + 1] = low;
        threadPos[b * 6 + 4] = high;
      }
      threadGeo.attributes.position.needsUpdate = true;
    }
    core.position.set(0, (low + high) / 2, 0);
    core.intensity = clamp((t - 2.2) / 1.2) * (5 + open * 6 + Math.sin(t * 1.7) * 0.8);

    // Camera follows the opening so the whole stack stays framed
    camera.position.set(camPos.x, camPos.y + open * 1.0, camPos.z);
    camera.lookAt(0, 1.9 + open * 0.95, 0);
    camera.updateMatrixWorld();
    root.updateMatrixWorld();

    // Pointer: floor ripple target and the slab under it
    dotMat.uniforms.uTime.value = t;
    beamMat.uniforms.uTime.value = t;
    if (pointer.inside) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(floorPlane, floorHit)) {
        torch.position.lerp(new Vector3(floorHit.x * 0.7, 5.5 + open * 2, floorHit.z * 0.7), Math.min(1, dt * 6));
        const local = root.worldToLocal(floorHit.clone());
        (dotMat.uniforms.uPointer.value as Vector2).lerp(new Vector2(local.x, local.z), Math.min(1, dt * 8));
      }
      torch.intensity += (34 - torch.intensity) * Math.min(1, dt * 3);
      if (pointerDirty) {
        pointerDirty = false;
        const hit = ray.intersectObjects(slabs.map((s) => s.body), false)[0];
        const idx = hit ? slabs.findIndex((s) => s.body === hit.object) : -1;
        if (idx !== hovered) {
          hovered = idx;
          if (idx !== -1) opts.onHover(idx);
        }
      }
    } else {
      torch.intensity += (0 - torch.intensity) * Math.min(1, dt * 2);
      // No pointer (touch, or outside): the swell drifts slowly around the stack.
      const a = t * 0.35;
      (dotMat.uniforms.uPointer.value as Vector2).set(Math.cos(a) * 5.2, Math.sin(a) * 4.2);
    }

    // Callout anchors: whichever top corner of each slab sits furthest right on screen
    opts.onAnchors(
      slabs.map((s) => {
        let best = { x: -Infinity, y: 0 };
        for (const [sx, sz] of CORNERS) {
          anchor.set((sx * s.def.w) / 2, s.def.h / 2, (sz * s.def.d) / 2);
          s.group.localToWorld(anchor);
          anchor.project(camera);
          const x = (anchor.x * 0.5 + 0.5) * width;
          if (x > best.x) best = { x, y: (-anchor.y * 0.5 + 0.5) * height };
        }
        return best;
      }),
    );

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      opts.onReady();
    }
    wake();
  }
  wake();

  return {
    setActive(i: number) {
      active = i;
      lastInput = performance.now();
      wake();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      opts.area.removeEventListener("pointermove", onMove);
      opts.area.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as { dispose?: () => void } | undefined;
        mat?.dispose?.();
      });
      shadowTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
