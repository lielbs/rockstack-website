/**
 * The RockStack slabs as a real-time 3D object (three.js). Loaded lazily by StackCanvas,
 * so it never blocks the first paint. Pure DOM/WebGL code, no React.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type SlabDef = { w: number; h: number; d: number; color: string; roughness: number; clearcoat: number };

export type StackSceneOptions = {
  slabs: SlabDef[];
  gap?: number;
  reducedMotion?: boolean;
  /** Called every frame with the screen position (px, relative to the canvas) of each slab's label anchor. */
  onLabels?: (points: { x: number; y: number }[]) => void;
  onReady?: () => void;
};

const settle = (t: number) => {
  // Fast fall, hard stop, a 1.5% compression: stone landing, no bounce.
  if (t < 0.78) return (t / 0.78) ** 2.4;
  const k = (t - 0.78) / 0.22;
  return 1 + Math.sin(k * Math.PI) * 0.012;
};

function grainTexture(): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 200 + Math.random() * 55;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export function createStackScene(canvas: HTMLCanvasElement, opts: StackSceneOptions) {
  const gap = opts.gap ?? 0.32;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;

  const camera = new PerspectiveCamera(26, 1, 0.1, 100);
  const camBase = new Vector3(15.2, 11.8, 15.2);
  camera.position.copy(camBase);
  camera.lookAt(0, 1.2, 0);

  const key = new DirectionalLight(new Color("#fff4e6"), 2.1);
  key.position.set(-6, 12, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.radius = 8;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key);

  const rim = new DirectionalLight(new Color("#cfd6e2"), 0.9);
  rim.position.set(8, 4, -8);
  scene.add(rim);

  const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.55 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grain = grainTexture();
  const root = new Group();
  scene.add(root);

  // Slabs stacked bottom-up
  const slabs: { mesh: Mesh; restY: number; delay: number }[] = [];
  let y = 0;
  opts.slabs.forEach((s, i) => {
    const geo = new RoundedBoxGeometry(s.w, s.h, s.d, 4, Math.min(0.14, s.h * 0.18));
    const mat = new MeshPhysicalMaterial({
      color: new Color(s.color),
      roughness: s.roughness,
      metalness: 0,
      clearcoat: s.clearcoat,
      clearcoatRoughness: 0.35,
      roughnessMap: grain,
    });
    const mesh = new Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const restY = y + s.h / 2;
    mesh.position.y = restY + 7;
    root.add(mesh);
    slabs.push({ mesh, restY, delay: 0.15 + i * 0.26 });
    y += s.h + gap;
  });
  const stackHeight = y;

  // Data particles rising through the stack, from the foundation up to the top layer
  const COUNT = opts.reducedMotion ? 0 : 110;
  const base = opts.slabs[0];
  const pos = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * base.w * 0.9;
    pos[i * 3 + 1] = Math.random() * (stackHeight + 1.6);
    pos[i * 3 + 2] = (Math.random() - 0.5) * base.d * 0.9;
    speed[i] = 0.25 + Math.random() * 0.5;
  }
  const pGeo = new BufferGeometry();
  pGeo.setAttribute("position", new BufferAttribute(pos, 3));
  const particles = new Points(
    pGeo,
    new PointsMaterial({ color: new Color("#E8892B"), size: 0.1, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false }),
  );
  root.add(particles);

  // State driven from outside
  let explode = 0;
  let explodeTarget = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let width = 1;
  let height = 1;
  let running = true;
  let raf = 0;
  const start = performance.now();
  let readySent = false;
  const anchor = new Vector3();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole stack in frame on narrow canvases
    const narrow = width < 640;
    camera.fov = camera.aspect < 1 ? 34 : narrow ? 33 : 28;
    // Shift the stack toward the inline start so the layer names have room on its left
    camera.setViewOffset(width, height, -width * (narrow ? 0.2 : 0.08), 0, width, height);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const frame = (now: number) => {
    const t = (now - start) / 1000;
    explode += (explodeTarget - explode) * 0.08;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    slabs.forEach((s, i) => {
      const local = opts.reducedMotion ? 1 : Math.min(1, Math.max(0, (t - s.delay) / 0.75));
      const drop = (1 - settle(local)) * 7;
      const float = opts.reducedMotion ? 0 : Math.sin(t * 0.9 + i * 1.3) * 0.035;
      s.mesh.position.y = s.restY + drop + explode * i * 1.25 + float;
    });

    const idle = opts.reducedMotion ? 0 : Math.sin(t * 0.25) * 0.12;
    root.rotation.y = -0.18 + idle + pointer.x * 0.35 + explode * 0.55;
    root.rotation.x = pointer.y * 0.08;
    camera.position.set(camBase.x, camBase.y - explode * 1.5, camBase.z);
    camera.lookAt(0, 1.2 + explode * 1.2, 0);

    if (COUNT) {
      const top = stackHeight + explode * (opts.slabs.length - 1) * 1.25 + 1.6;
      for (let i = 0; i < COUNT; i++) {
        let py = pos[i * 3 + 1] + speed[i] * 0.016;
        if (py > top) py = 0.1;
        pos[i * 3 + 1] = py;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    if (opts.onLabels) {
      const pts = slabs.map((s, i) => {
        const def = opts.slabs[i];
        anchor.set(-def.w / 2, s.mesh.position.y, def.d / 2);
        s.mesh.parent!.localToWorld(anchor);
        anchor.project(camera);
        return { x: (anchor.x * 0.5 + 0.5) * width, y: (-anchor.y * 0.5 + 0.5) * height };
      });
      opts.onLabels(pts);
    }

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      opts.onReady?.();
    }
    if (running) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    setExplode(v: number) {
      explodeTarget = v;
    },
    setPointer(x: number, y: number) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setRunning(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      pmrem.dispose();
      grain.dispose();
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as { dispose?: () => void } | undefined;
        mat?.dispose?.();
      });
    },
  };
}
