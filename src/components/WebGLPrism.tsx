import React, { useEffect, useRef, useState } from 'react';
import { subscribeMotion } from './MotionPrimitives';
import { SD_POSITIONS, SD_NORMALS, SD_INDICES } from './sdMeshData';

interface WebGLPrismProps {
  menuOpen?: boolean;
  isReady?: boolean;
}

const VERT_SRC = `
attribute vec3 aPos;
attribute vec3 aNorm;
uniform mat4 uProj;
uniform mat4 uModelView;
uniform mat3 uNormalMat;
varying vec3 vNorm;
varying vec3 vViewPos;

void main() {
  vec4 mvPos = uModelView * vec4(aPos, 1.0);
  vViewPos = -mvPos.xyz;
  vNorm = normalize(uNormalMat * aNorm);
  gl_Position = uProj * mvPos;
}
`;

const FRAG_SRC = `
precision highp float;
varying vec3 vNorm;
varying vec3 vViewPos;
uniform float uTime;
uniform float uMenuOrbit;
uniform float uVel;

void main() {
  vec3 N = normalize(vNorm);
  vec3 V = normalize(vViewPos);
  vec3 R = reflect(-V, N);

  // Deep architectural navy titanium obsidian core (#131F33 / #1C2C46)
  vec3 navyObsidian = vec3(0.042, 0.068, 0.115);

  // Studio lighting choreography: orbiting softbox rect-lights
  float orbitAngle = uTime * (0.24 + uMenuOrbit * 0.60) + uVel * 0.003;
  float ca = cos(orbitAngle);
  float sa = sin(orbitAngle);

  vec3 baseDir1 = normalize(vec3(-0.46, 0.78, 0.52));
  vec3 orbitDir1 = normalize(vec3(ca * 0.65, 0.60 + 0.18 * sin(uTime * 0.5), 0.48 + sa * 0.32));
  vec3 dir1 = normalize(mix(baseDir1, orbitDir1, 0.28 + uMenuOrbit * 0.72));

  vec3 baseDir2 = normalize(vec3(0.68, -0.42, 0.58));
  vec3 orbitDir2 = normalize(vec3(-ca * 0.70, -0.40 + 0.20 * cos(uTime * 0.42), 0.52 - sa * 0.28));
  vec3 dir2 = normalize(mix(baseDir2, orbitDir2, 0.28 + uMenuOrbit * 0.72));

  float softbox1 = smoothstep(0.72, 0.99, dot(R, dir1));
  float softbox2 = smoothstep(0.76, 0.99, dot(R, dir2));
  float gunmetalFill = smoothstep(0.24, 0.88, dot(R, normalize(vec3(-0.20 + 0.10 * sa, 0.54, 0.82))));

  vec3 H1 = normalize(dir1 + V);
  float specTight1 = pow(max(dot(N, H1), 0.0), 96.0);
  float specSheen1 = pow(max(dot(N, H1), 0.0), 16.0);

  vec3 H2 = normalize(dir2 + V);
  float specTight2 = pow(max(dot(N, H2), 0.0), 64.0);
  float specSheen2 = pow(max(dot(N, H2), 0.0), 12.0);

  // Digital Emerald rim-light (#1D9878) at grazing angles
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.2);
  vec3 emeraldRim = vec3(0.114, 0.596, 0.471); // #1D9878 Vert Digital

  vec3 col = navyObsidian;
  col += vec3(0.065, 0.088, 0.135) * gunmetalFill;
  col += vec3(0.22, 0.24, 0.28) * (specSheen1 * 0.65 + specSheen2 * 0.45);
  col += vec3(0.88, 0.92, 0.98) * (softbox1 * 0.75 + softbox2 * 0.50);
  col += vec3(1.0, 1.0, 1.0) * (specTight1 * 1.15 + specTight2 * 0.75);
  col += emeraldRim * fresnel * (0.85 + uMenuOrbit * 0.35);

  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * 3D SD Monogram Titanium Obsidian Sculpture Geometry:
 * Builds the pure, official SALI DigiCom brand monogram in 3D:
 * - Silky smooth beveled 'S' ribbon curve
 * - Silky smooth beveled 'D' vertical stem and outer loop
 * - Two staggered beveled square dots in the top right
 * - ZERO outer diamond frame
 * Continuous smooth vertex normals for studio softbox lighting and emerald rim-light.
 */
function buildSDMonogramGeometry() {
  return {
    positions: SD_POSITIONS,
    normals: SD_NORMALS,
    indices: SD_INDICES,
  };
}

function perspectiveMatrix(fovRad: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function modelViewMatrix(
  tx: number,
  ty: number,
  tz: number,
  rx: number,
  ry: number,
  rz: number,
  scale: number
): { mv: Float32Array; norm: Float32Array } {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);

  const r00 = cz * cy;
  const r01 = cz * sy * sx - sz * cx;
  const r02 = cz * sy * cx + sz * sx;

  const r10 = sz * cy;
  const r11 = sz * sy * sx + cz * cx;
  const r12 = sz * sy * cx - cz * sx;

  const r20 = -sy;
  const r21 = cy * sx;
  const r22 = cy * cx;

  const mv = new Float32Array([
    r00 * scale, r10 * scale, r20 * scale, 0,
    r01 * scale, r11 * scale, r21 * scale, 0,
    r02 * scale, r12 * scale, r22 * scale, 0,
    tx, ty, tz, 1,
  ]);

  const norm = new Float32Array([
    r00, r10, r20,
    r01, r11, r21,
    r02, r12, r22,
  ]);

  return { mv, norm };
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export default function WebGLPrism({ menuOpen = false, isReady = true }: WebGLPrismProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const menuOpenRef = useRef(menuOpen);
  const readyTimeRef = useRef<number | null>(isReady ? performance.now() : null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (isReady && readyTimeRef.current === null) {
      readyTimeRef.current = performance.now();
    }
  }, [isReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', {
      alpha: true,
      depth: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      setFallbackMode(true);
      return;
    }

    const compileShader = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFallbackMode(true);
      return;
    }

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallbackMode(true);
      return;
    }

    gl.useProgram(prog);

    // Build the official SD 3D Diamond Sculpture
    const geom = buildSDMonogramGeometry();

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, geom.positions, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, geom.normals, gl.STATIC_DRAW);
    const aNorm = gl.getAttribLocation(prog, 'aNorm');
    gl.enableVertexAttribArray(aNorm);
    gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geom.indices, gl.STATIC_DRAW);

    const uProj = gl.getUniformLocation(prog, 'uProj');
    const uModelView = gl.getUniformLocation(prog, 'uModelView');
    const uNormalMat = gl.getUniformLocation(prog, 'uNormalMat');
    const uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    const uMenuOrbitLoc = gl.getUniformLocation(prog, 'uMenuOrbit');
    const uVelLoc = gl.getUniformLocation(prog, 'uVel');

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE); // Render front and back facets cleanly
    gl.disable(gl.BLEND);

    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const startTime = performance.now();
    let curMouseX = 0;
    let curMouseY = 0;
    let curX = 0.0;
    let curY = 0.04;
    let curZ = -4.75;
    let curScale = 1.10;
    let curRotX = 0.12;
    let curRotY = -0.15;
    let curRotZ = 0.0;
    let curOpacity = 0.95;
    let curMenuOrbit = 0;
    let continuousSpinAccum = 0;

    const unsub = subscribeMotion((s) => {
      const now = s.now || performance.now();
      const elapsed = (now - startTime) * 0.001;
      const isMobile = width < 768;

      curMouseX += (s.normX - curMouseX) * 0.075;
      curMouseY += (s.normY - curMouseY) * 0.075;

      // Loader entry spin
      let entrySpin = 0;
      let entryZ = 0;
      if (!s.reducedMotion && !s.webdriver) {
        if (readyTimeRef.current === null) {
          entrySpin = Math.PI * 0.5;
          entryZ = -1.8;
        } else {
          const ep = clamp01((now - readyTimeRef.current) / 1550);
          const eased = 1 - Math.pow(1 - ep, 4);
          entrySpin = (1 - eased) * Math.PI * 0.5;
          entryZ = -(1 - eased) * 1.8;
        }
      }

      // Query DOM section anchors for Digital Cover choreography
      const introEl = document.getElementById('intro');
      const atelierEl = document.getElementById('atelier');
      const sentenceEl = document.getElementById('sentence');
      const polesEl = document.getElementById('poles');
      const expertisesEl = document.getElementById('expertises');
      const footerEl = document.querySelector('.dc-footer');

      const vh = Math.max(1, height);
      let goalX = isMobile ? 0.0 : 0.02;
      let goalY = isMobile ? -0.05 : 0.04;
      let goalZ = isMobile ? -5.5 : -4.75;
      let goalScale = isMobile ? 0.85 : 1.10;
      let goalOpacity = 0.95;
      let waypointRotX = 0.12;
      let waypointRotY = -0.15;
      let waypointRotZ = 0.0;

      const inMenu = menuOpenRef.current;
      curMenuOrbit += ((inMenu ? 1 : 0) - curMenuOrbit) * 0.08;

      if (inMenu) {
        continuousSpinAccum += s.reducedMotion ? 0 : 0.007;
        goalX = isMobile ? 0.0 : 0.94;
        goalY = 0.0;
        goalZ = isMobile ? -5.5 : -4.75;
        goalScale = isMobile ? 0.74 : 0.94;
        goalOpacity = isMobile ? 0.38 : 0.90;
        waypointRotX = 0.52;
        waypointRotY = 0.45 + continuousSpinAccum;
        waypointRotZ = 0.20;
      } else {
        const introRect = introEl?.getBoundingClientRect();
        const atelierRect = atelierEl?.getBoundingClientRect();
        const sentenceRect = sentenceEl?.getBoundingClientRect();
        const polesRect = polesEl?.getBoundingClientRect();
        const expertisesRect = expertisesEl?.getBoundingClientRect();
        const footerRect = footerEl?.getBoundingClientRect();

        if (footerRect && footerRect.top < vh * 0.95) {
          // Footer mode: anchored at the bottom of the footer above the angled bottom ridge
          const fp = clamp01((vh * 0.95 - footerRect.top) / Math.max(1, vh * 0.7));
          continuousSpinAccum += s.reducedMotion ? 0 : 0.014;
          goalX = 0.0;
          goalY = isMobile ? -0.42 : -0.36; // Calé tout en bas du footer
          goalZ = isMobile ? -5.8 : -5.0;
          goalScale = isMobile ? 0.68 : 0.86;
          goalOpacity = 0.88;
          waypointRotX = 0.45;
          waypointRotY = 0.8 + continuousSpinAccum;
          waypointRotZ = -0.12;
        } else if (expertisesRect && expertisesRect.top < vh * 0.85 && expertisesRect.bottom > vh * 0.15) {
          // Section Expertises: sort de la droite vers la gauche, tourne au moins 1.5 à 2 fois, grossit et disparaît en bas
          const ep = clamp01((vh * 0.80 - expertisesRect.top) / Math.max(1, expertisesRect.height - vh * 0.25));
          goalX = isMobile ? (0.8 - ep * 0.8) : (3.4 - ep * 2.8); // Apparition droite -> gauche
          goalY = 0.02;
          goalZ = (isMobile ? -5.4 : -4.8) + ep * 4.2; // Grossit et avance vers la caméra
          goalScale = (isMobile ? 0.72 : 0.90) + ep * 3.2; // Échelle dynamique
          goalOpacity = ep > 0.84 ? Math.max(0, 1.0 - (ep - 0.84) * 6.0) : Math.min(0.95, ep * 3.5);
          waypointRotX = 0.42 + Math.sin(ep * Math.PI) * 0.18;
          waypointRotY = 0.25 + ep * Math.PI * 3.5; // ~1.75 tours complets
          waypointRotZ = 0.14 - ep * 0.28;
        } else if (polesRect && polesRect.top < vh * 0.85 && polesRect.bottom > vh * 0.15) {
          // 3D Multi-Card Tunnel Gallery: parked behind the cards
          goalX = 0.0;
          goalY = -4.5;
          goalZ = -6.0;
          goalScale = 0.5;
          goalOpacity = 0.0;
          waypointRotX = 0.48;
          waypointRotY = 0.26;
          waypointRotZ = 0.0;
        } else if (sentenceRect && sentenceRect.top < vh * 0.9 && sentenceRect.bottom > vh * 0.1) {
          // Sticky Kinetic Sentence: the SD emblem re-enters, descends, settles, then scales up and exits
          const span = Math.max(1, sentenceRect.height);
          const sp = clamp01((vh * 0.85 - sentenceRect.top) / span);
          goalX = 0.0;
          goalY = sp < 0.35 ? (1.5 - sp * 4.2) : 0.0; // Descend, se cale au centre
          goalZ = (isMobile ? -5.5 : -4.85) + (sp > 0.65 ? (sp - 0.65) * 5.2 : 0);
          goalScale = (isMobile ? 0.82 : 0.98) + (sp > 0.65 ? (sp - 0.65) * 3.5 : 0);
          goalOpacity = sp > 0.85 ? Math.max(0, 1.0 - (sp - 0.85) * 6.5) : clamp01(sp * 2.0) * 0.92;
          waypointRotX = 0.38;
          waypointRotY = 0.26 + sp * Math.PI * 2.5; // Rotation continue
          waypointRotZ = -0.18;
        } else if (atelierRect && atelierRect.top < vh * 0.85 && atelierRect.bottom > vh * 0.15) {
          // Showreel stage: logo is completely OFF-SCREEN below the viewport
          goalX = 0.0;
          goalY = -4.5; // Off-screen bottom
          goalZ = -4.85;
          goalScale = 0.80;
          goalOpacity = 0.0; // Completely hidden during video showcase
          waypointRotX = 0.40;
          waypointRotY = 0.26;
          waypointRotZ = 0.0;
        } else if (introRect && introRect.bottom > vh * 0.15) {
          // Digital Cover Hero Exit: Emblem zooms forward with continuous 1.5-2 turns spin, no blue dead zone
          const span = Math.max(1, introRect.height - vh * 0.2);
          const hp = clamp01(-introRect.top / span);
          goalX = 0.0;
          goalY = hp * 0.08;
          goalZ = (isMobile ? -5.75 : -4.95) + hp * 7.8; // Zooms forward from -4.95 past camera (+2.85)
          goalScale = (isMobile ? 0.78 : 0.95) + hp * 4.8; // Massive expansion up to ~5.75
          goalOpacity = hp > 0.88 ? Math.max(0, 1.0 - (hp - 0.88) * 8.3) : 0.95; // Seamless overlap, zero blue screen
          waypointRotX = 0.44 + hp * 0.18;
          waypointRotY = 0.26 + hp * Math.PI * 3.5; // ~1.75 tours complets de rotation continue
          waypointRotZ = -0.22 + hp * 0.15;
        } else {
          // Default idle
          goalX = 0.0;
          goalY = 0.0;
          goalZ = -5.2;
          goalScale = 0.85;
          goalOpacity = 0.0;
          waypointRotX = 0.4;
          waypointRotY = 0.2;
          waypointRotZ = 0.0;
        }
      }

      const idleFloat = s.reducedMotion ? 0 : Math.sin(elapsed * 0.55) * 0.045;
      const idleTurn = s.reducedMotion ? 0 : Math.sin(elapsed * 0.45) * 0.16;
      const velTilt = clamp01(Math.abs(s.velocity) / 120) * Math.sign(s.velocity) * 0.12;

      const goalRotX = waypointRotX + curMouseY * 0.22 + idleFloat + velTilt;
      const goalRotY = waypointRotY + entrySpin + idleTurn + curMouseX * 0.32;
      const goalRotZ = waypointRotZ + curMouseX * 0.08;

      const damp = s.reducedMotion || s.webdriver ? 0.32 : 0.075;
      curX += (goalX - curX) * damp;
      curY += ((goalY + idleFloat * 0.6) - curY) * damp;
      curZ += ((goalZ + entryZ) - curZ) * damp;
      curScale += (goalScale - curScale) * damp;
      curRotX += (goalRotX - curRotX) * damp;
      curRotY += (goalRotY - curRotY) * damp;
      curRotZ += (goalRotZ - curRotZ) * damp;
      curOpacity += (goalOpacity - curOpacity) * damp;

      canvas.style.opacity = curOpacity.toFixed(3);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const proj = perspectiveMatrix((36 * Math.PI) / 180, Math.max(0.4, width / height), 0.5, 26.0);
      const { mv, norm } = modelViewMatrix(curX, curY, curZ, curRotX, curRotY, curRotZ, curScale);

      gl.uniformMatrix4fv(uProj, false, proj);
      gl.uniformMatrix4fv(uModelView, false, mv);
      gl.uniformMatrix3fv(uNormalMat, false, norm);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uMenuOrbitLoc, curMenuOrbit);
      gl.uniform1f(uVelLoc, s.velocity);

      gl.drawElements(gl.TRIANGLES, geom.indices.length, gl.UNSIGNED_SHORT, 0);
    });

    return () => {
      unsub();
      window.removeEventListener('resize', resize);
    };
  }, []);

  if (fallbackMode) {
    return (
      <div className="dc-gl-fallback" aria-hidden="true">
        <img src="/assets/prism.png" alt="" className="dc-gl-fallback-img" />
      </div>
    );
  }

  return <canvas id="gl" ref={canvasRef} className="dc-gl-canvas" aria-hidden="true" />;
}
