'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { latLonToVector3, loadLandGeo, paintLandMask } from '@/lib/globe-land';

export type GlobeNode = {
  id: string;
  emoji: string;
  color: string;
};

type ConnectionGlobeProps = {
  you: GlobeNode;
  people: GlobeNode[];
  highlightIds?: string[];
  className?: string;
};

const CYAN = 0x00f2ff;
const MAGENTA = 0xff007a;
const VIOLET = 0x140a33;
const CYAN_COLOR = new THREE.Color(CYAN);
const MAGENTA_COLOR = new THREE.Color(MAGENTA);

const RADIUS = 78;
const HOME = { lat: 6.25, lon: -75.57 }; // Medellín: the guest's pin
const FOV = 42;
/** Globe diameter as a share of the shorter viewport side. */
const FILL = 0.62;

const GHOST_CITIES: Array<[number, number]> = [
  [4.71, -74.07], [40.71, -74.0], [19.43, -99.13], [25.76, -80.19], [-23.55, -46.63],
  [-33.45, -70.67], [43.65, -79.38], [37.77, -122.42], [40.41, -3.7], [51.5, -0.12],
  [48.86, 2.35], [52.52, 13.4], [-12.05, -77.04], [-34.6, -58.38], [9.93, -84.08],
  [18.47, -69.9], [6.52, 3.38], [25.2, 55.27], [35.68, 139.69], [1.35, 103.82],
];

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function toVec(lat: number, lon: number, radius: number) {
  const [x, y, z] = latLonToVector3(lat, lon, radius);
  return new THREE.Vector3(x, y, z);
}

/** Golden-angle spiral around the guest so bubbles spread evenly on the visible face. */
function personLatLon(index: number, total: number, id: string) {
  const angle = index * 2.39996 + hash(id) * 0.5;
  const dist = 16 + 34 * Math.sqrt((index + 0.5) / Math.max(total, 1));
  const lat = HOME.lat + dist * Math.sin(angle) * 0.85;
  const lon = HOME.lon + (dist * Math.cos(angle)) / Math.cos(THREE.MathUtils.degToRad(lat));
  return { lat, lon };
}

function arcCurve(from: THREE.Vector3, to: THREE.Vector3, loft = 1) {
  const mid = from
    .clone()
    .add(to)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(RADIUS * (1.12 + from.distanceTo(to) * 0.0045) * loft);
  return new THREE.QuadraticBezierCurve3(from, mid, to);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

function landMaterial(mask: THREE.Texture) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uMap: { value: mask },
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(0x1a0f4d) },
      uMid: { value: new THREE.Color(CYAN) },
      uHot: { value: new THREE.Color(MAGENTA) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uTime;
      uniform vec3 uDeep;
      uniform vec3 uMid;
      uniform vec3 uHot;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        float land = smoothstep(0.10, 0.42, texture2D(uMap, vUv).r);

        vec2 cell = floor(vUv * vec2(720.0, 360.0));
        float n = hash(cell);
        float twinkle = 0.55 + 0.45 * sin(uTime * 1.8 + n * 40.0);
        float specks = step(0.9, n) * twinkle;

        vec3 oceanCol = uDeep * 0.45 + uMid * specks * 0.12;
        float oceanA = 0.05 + specks * 0.04;

        vec3 landCol = mix(uDeep, uMid, 0.28 + specks * 0.55);
        float landA = land * (0.5 + specks * 0.35);

        float sweep = mod(uTime * 0.09, 1.0);
        float du = min(abs(vUv.x - sweep), 1.0 - abs(vUv.x - sweep));
        float band = 1.0 - smoothstep(0.0, 0.05, du);

        vec3 col = mix(oceanCol, landCol, land);
        col = mix(col, uHot, band * 0.35 * (0.25 + land));
        float alpha = mix(oceanA, landA, land) + band * 0.07;

        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.9));
      }
    `,
  });
}

function emojiTexture(node: GlobeNode) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size * 0.38, size * 0.34, size * 0.06, size / 2, size / 2, size / 2);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.18, node.color);
    g.addColorStop(1, node.color);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.stroke();
    ctx.font = `${size * 0.54}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.emoji, size / 2, size / 2 + 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ringTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

type PersonRig = {
  id: string;
  group: THREE.Group;
  sprite: THREE.Sprite;
  ring: THREE.Sprite;
  tube: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>;
  glow: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>;
  traveler: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  curve: THREE.QuadraticBezierCurve3;
  delay: number;
};

const TUBE_SEGMENTS = 48;
const TUBE_RADIAL = 5;

/** three.js globe: land, grid, orbit rings, and arcs growing from the guest to every person in the room. */
export function ConnectionGlobe({ you, people, highlightIds = [], className }: ConnectionGlobeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef({ you, people, highlightIds });

  useEffect(() => {
    dataRef.current = { you, people, highlightIds };
  }, [you, people, highlightIds]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let raf = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.x = 0.12;
    scene.add(root);
    const globe = new THREE.Group();
    root.add(globe);
    const orbits = new THREE.Group();
    root.add(orbits);

    const homePos = toVec(HOME.lat, HOME.lon, RADIUS * 1.02);
    const baseYaw = -Math.atan2(homePos.x, homePos.z);
    globe.rotation.y = baseYaw;

    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(RADIUS * 0.992, 48, 32),
        new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.55 })
      )
    );

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.06, 32, 24),
      new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    globe.add(atmosphere);

    const gridPts: number[] = [];
    const pushLine = (pts: THREE.Vector3[]) => {
      for (let i = 0; i < pts.length - 1; i += 1) {
        gridPts.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      }
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 8) pts.push(toVec(lat, lon, RADIUS * 1.008));
      pushLine(pts);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -80; lat <= 80; lat += 6) pts.push(toVec(lat, lon, RADIUS * 1.008));
      pushLine(pts);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
    globe.add(
      new THREE.LineSegments(
        gridGeo,
        new THREE.LineBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity: 0.07,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    );

    const scanPts: THREE.Vector3[] = [];
    for (let lat = -86; lat <= 86; lat += 4) scanPts.push(toVec(lat, 0, RADIUS * 1.018));
    const scanLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(scanPts),
      new THREE.LineBasicMaterial({
        color: MAGENTA,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    globe.add(scanLine);

    const addRing = (inner: number, outer: number, color: number, opacity: number, rx: number, ry = 0) => {
      const mesh = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 96),
        new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      mesh.rotation.set(rx, ry, 0);
      orbits.add(mesh);
    };
    addRing(RADIUS * 1.18, RADIUS * 1.195, CYAN, 0.4, Math.PI / 2.05);
    addRing(RADIUS * 1.3, RADIUS * 1.312, MAGENTA, 0.22, Math.PI / 2.35, Math.PI / 9);
    addRing(RADIUS * 1.42, RADIUS * 1.428, CYAN, 0.14, Math.PI / 1.9, -Math.PI / 11);

    const network = new THREE.Group();
    globe.add(network);

    const ghostDotGeo = new THREE.SphereGeometry(0.9, 8, 8);
    const ghostHaloGeo = new THREE.SphereGeometry(2.2, 8, 8);
    const ghostDotMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.85 });
    const ghostHaloMat = new THREE.MeshBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ghostArcs: Array<{ line: THREE.Line; count: number; delay: number }> = [];
    GHOST_CITIES.forEach(([lat, lon], i) => {
      const pos = toVec(lat, lon, RADIUS * 1.02);
      const dot = new THREE.Mesh(ghostDotGeo, ghostDotMat);
      dot.position.copy(pos);
      const halo = new THREE.Mesh(ghostHaloGeo, ghostHaloMat);
      halo.position.copy(pos);
      network.add(dot, halo);
      if (pos.distanceTo(homePos) < 2) return;
      const pts = arcCurve(homePos, pos, 0.9 + (i % 4) * 0.06).getPoints(40);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: CYAN,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      line.geometry.setDrawRange(0, 0);
      network.add(line);
      ghostArcs.push({ line, count: pts.length, delay: 0.5 + i * 0.07 });
    });

    const ringTex = ringTexture();
    const textures = new Map<string, THREE.CanvasTexture>();
    const textureFor = (node: GlobeNode) => {
      const key = `${node.emoji}|${node.color}`;
      let tex = textures.get(key);
      if (!tex) {
        tex = emojiTexture(node);
        textures.set(key, tex);
      }
      return tex;
    };

    const youSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureFor(dataRef.current.you), depthWrite: false }));
    youSprite.position.copy(homePos.clone().multiplyScalar(1.03));
    youSprite.renderOrder = 10;
    const youRing = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: ringTex, color: MAGENTA, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    youRing.position.copy(youSprite.position);
    youRing.renderOrder = 9;
    network.add(youSprite, youRing);
    let youKey = `${dataRef.current.you.emoji}|${dataRef.current.you.color}`;

    const travelerGeo = new THREE.SphereGeometry(1, 10, 10);
    let rigs: PersonRig[] = [];
    let peopleKey = '';
    let peopleBuiltAt = 0;

    const disposeRig = (rig: PersonRig) => {
      network.remove(rig.group);
      rig.tube.geometry.dispose();
      rig.tube.material.dispose();
      rig.glow.geometry.dispose();
      rig.glow.material.dispose();
      rig.traveler.material.dispose();
      (rig.sprite.material as THREE.SpriteMaterial).dispose();
      (rig.ring.material as THREE.SpriteMaterial).dispose();
    };

    const buildPeople = (nodes: GlobeNode[], elapsed: number) => {
      rigs.forEach(disposeRig);
      peopleBuiltAt = Math.max(0, elapsed - 0.6);
      rigs = nodes.map((node, index) => {
        const { lat, lon } = personLatLon(index, nodes.length, node.id);
        const pos = toVec(lat, lon, RADIUS * 1.02);
        const curve = arcCurve(homePos, pos, 0.95 + (index % 5) * 0.07);
        const group = new THREE.Group();

        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.32, TUBE_RADIAL, false),
          new THREE.MeshBasicMaterial({
            color: CYAN,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        const glow = new THREE.Mesh(
          new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 1.1, TUBE_RADIAL, false),
          new THREE.MeshBasicMaterial({
            color: MAGENTA,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        tube.geometry.setDrawRange(0, 0);
        glow.geometry.setDrawRange(0, 0);

        const traveler = new THREE.Mesh(
          travelerGeo,
          new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0 })
        );

        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureFor(node), transparent: true, depthWrite: false }));
        sprite.position.copy(pos.clone().multiplyScalar(1.03));
        sprite.scale.setScalar(0.001);
        sprite.renderOrder = 8;

        const ring = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: ringTex,
            color: MAGENTA,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
        ring.position.copy(sprite.position);
        ring.renderOrder = 7;

        group.add(tube, glow, traveler, sprite, ring);
        network.add(group);
        return { id: node.id, group, sprite, ring, tube, glow, traveler, curve, delay: 0.7 + index * 0.12 };
      });
    };

    let landMat: THREE.ShaderMaterial | null = null;
    let landTex: THREE.CanvasTexture | null = null;
    loadLandGeo()
      .then((geo) => {
        if (disposed) return;
        landTex = new THREE.CanvasTexture(paintLandMask(geo));
        landTex.colorSpace = THREE.SRGBColorSpace;
        landTex.anisotropy = 4;
        landMat = landMaterial(landTex);
        globe.add(new THREE.Mesh(new THREE.SphereGeometry(RADIUS * 1.004, 64, 48), landMat));
      })
      .catch(() => {
        /* the grid and ocean still read as a globe without land */
      });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      const visibleHeight = (RADIUS * 2) / FILL / Math.min(1, camera.aspect);
      camera.position.set(0, 0, visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))));
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const worldPos = new THREE.Vector3();
    /** 0 behind the globe, 1 facing the camera. */
    const facing = (obj: THREE.Object3D) => {
      obj.getWorldPosition(worldPos);
      return THREE.MathUtils.smoothstep(worldPos.z / RADIUS, -0.05, 0.3);
    };
    const tubeCount = (progress: number) => Math.floor(progress * TUBE_SEGMENTS) * TUBE_RADIAL * 6;

    const start = performance.now();
    const animate = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      if (document.hidden) return;

      const t = (now - start) / 1000;
      const { you: me, people: nodes, highlightIds: hot } = dataRef.current;

      const nextKey = nodes.map((n) => `${n.id}:${n.emoji}:${n.color}`).join(',');
      if (nextKey !== peopleKey) {
        peopleKey = nextKey;
        buildPeople(nodes, t);
      }
      const nextYouKey = `${me.emoji}|${me.color}`;
      if (nextYouKey !== youKey) {
        youKey = nextYouKey;
        (youSprite.material as THREE.SpriteMaterial).map = textureFor(me);
        (youSprite.material as THREE.SpriteMaterial).needsUpdate = true;
      }

      const intro = easeOutCubic(t / 1.4);
      root.scale.setScalar(0.86 + 0.14 * intro);
      if (!reduceMotion) {
        globe.rotation.y = baseYaw + Math.sin(t * 0.12) * 0.5 + Math.sin(t * 0.05) * 0.2;
        root.rotation.x = 0.12 + Math.sin(t * 0.21) * 0.05;
        orbits.rotation.y = t * 0.08;
        atmosphere.scale.setScalar(1 + Math.sin(t * 1.3) * 0.012);
        scanLine.rotation.y = ((t * 0.09) % 1) * Math.PI * 2 - Math.PI;
      }
      if (landMat) landMat.uniforms.uTime.value = t;

      ghostArcs.forEach(({ line, count, delay }) => {
        line.geometry.setDrawRange(0, Math.floor(count * easeOutCubic((t - delay) / 1.4)));
      });

      const youPulse = 1 + 0.18 * Math.sin(t * 3.2);
      youSprite.scale.setScalar(15 * intro);
      youRing.scale.setScalar(22 * youPulse * intro);
      (youRing.material as THREE.SpriteMaterial).opacity = 0.55 * (1.2 - youPulse * 0.6);

      const local = t - peopleBuiltAt;
      rigs.forEach((rig, index) => {
        const isHot = hot.includes(rig.id);
        const grow = easeOutCubic((local - rig.delay) / 1.3);
        rig.tube.geometry.setDrawRange(0, tubeCount(grow));
        rig.glow.geometry.setDrawRange(0, tubeCount(grow));

        const tubeMat = rig.tube.material;
        tubeMat.color.lerp(isHot ? MAGENTA_COLOR : CYAN_COLOR, 0.08);
        tubeMat.opacity += ((isHot ? 0.95 : hot.length ? 0.28 : 0.6) - tubeMat.opacity) * 0.08;
        rig.glow.material.opacity += ((isHot ? 0.28 + 0.1 * Math.sin(t * 3 + index) : 0) - rig.glow.material.opacity) * 0.08;

        const vis = facing(rig.sprite);
        const appear = easeOutCubic((local - rig.delay - 1.0) / 0.5);
        const size = (isHot ? 13 : 9) * appear;
        const current = rig.sprite.scale.x;
        rig.sprite.scale.setScalar(current + (size - current) * 0.12);
        (rig.sprite.material as THREE.SpriteMaterial).opacity = vis * (hot.length && !isHot ? 0.55 : 1);

        const pulse = 1 + 0.25 * Math.sin(t * 4 + index);
        rig.ring.scale.setScalar(size * 1.55 * pulse);
        const ringMat = rig.ring.material as THREE.SpriteMaterial;
        ringMat.opacity += ((isHot ? 0.7 * vis : 0) - ringMat.opacity) * 0.1;

        const travelerMat = rig.traveler.material;
        if (grow >= 1 && !reduceMotion) {
          const p = (t * (isHot ? 0.5 : 0.32) + index * 0.17) % 1;
          rig.traveler.position.copy(rig.curve.getPoint(p));
          rig.traveler.scale.setScalar(isHot ? 1.5 : 0.95);
          travelerMat.color.setHex(isHot ? MAGENTA : CYAN);
          travelerMat.opacity = facing(rig.traveler) * 0.95;
        } else {
          travelerMat.opacity = 0;
        }
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      rigs.forEach(disposeRig);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      travelerGeo.dispose();
      ringTex.dispose();
      textures.forEach((tex) => tex.dispose());
      landTex?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
