// entrance3d.ts — the V6 entrance, real-3D edition (PLAN-v6.md P1).
//
// A physically-lit leather field notebook floating in a dark warm room:
// CC0 PBR leather + paper maps (public/art/textures), an embossed title
// baked onto a canvas texture, elastic band, soft contact shadow, pointer
// parallax, and a rigged cover that swings open onto a ruled first page.
//
// Progressive enhancement: BaseLayout's inline script shows the CSS book
// immediately and arms a fallback timer; this module "claims" the scene
// once WebGL + textures are ready and swaps the CSS book for the canvas.
// If WebGL is unavailable or slow, the CSS book plays instead — nobody
// waits on this file.

import * as THREE from "three";

type Mode = "auto" | "hold";

const TEX = "/art/textures/";

function coverTitleTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 1024;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, c.width, c.height);

  // blind-embossed frame
  g.strokeStyle = "rgba(0,0,0,0.55)";
  g.lineWidth = 5;
  g.strokeRect(56, 56, c.width - 112, c.height - 112);
  g.strokeStyle = "rgba(255,236,200,0.10)";
  g.lineWidth = 2;
  g.strokeRect(62, 62, c.width - 124, c.height - 124);

  const centre = c.width / 2;
  // debossed title: dark fill with a warm highlight ghost below-left
  g.textAlign = "center";
  g.font = "italic 400 78px Fraunces, Georgia, serif";
  g.fillStyle = "rgba(255,232,190,0.13)";
  g.fillText("field notebook", centre - 2, 506);
  g.fillStyle = "rgba(10,7,5,0.82)";
  g.fillText("field notebook", centre, 502);

  g.font = "500 26px 'JetBrains Mono', monospace";
  const sub = "S H U B Z   S H A R M A   ·   L O N D O N";
  g.fillStyle = "rgba(255,232,190,0.10)";
  g.fillText(sub, centre - 1, 576);
  g.fillStyle = "rgba(15,10,7,0.75)";
  g.fillText(sub, centre, 574);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function firstPageTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = "#F4ECD4";
  g.fillRect(0, 0, c.width, c.height);
  // ruled feint lines + red margin, like a real field book
  g.strokeStyle = "rgba(45,79,139,0.20)";
  g.lineWidth = 2;
  for (let y = 150; y < c.height - 60; y += 54) {
    g.beginPath();
    g.moveTo(48, y);
    g.lineTo(c.width - 40, y);
    g.stroke();
  }
  g.strokeStyle = "rgba(184,60,60,0.35)";
  g.beginPath();
  g.moveTo(110, 40);
  g.lineTo(110, c.height - 40);
  g.stroke();
  g.save();
  g.translate(c.width / 2, 420);
  g.rotate(-0.03);
  g.textAlign = "center";
  g.font = "italic 400 54px Fraunces, Georgia, serif";
  g.fillStyle = "rgba(74,68,88,0.85)";
  g.fillText("hello. come in —", 0, 0);
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function mountEntrance3D(el: HTMLElement, mode: Mode, finish: () => void) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // CSS fallback timer will take over
  }

  const loader = new THREE.TextureLoader();
  const load = (file: string, srgb = false) =>
    new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(
        TEX + file,
        (t) => {
          if (srgb) t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          resolve(t);
        },
        undefined,
        reject,
      );
    });

  Promise.all([
    load("leather-color.jpg", true),
    load("leather-normal.jpg"),
    load("leather-rough.jpg"),
    load("paper-color.jpg", true),
    load("paper-rough.jpg"),
  ])
    .then(([lc, ln, lr, pc, pr]) => {
      // Claim the scene: stop the CSS fallback, swap book for canvas.
      const w = window as any;
      if (el.classList.contains("v6-gone") || (w.__v6Claimed && w.__v6Claimed !== "3d")) return;
      w.__v6Claimed = "3d";
      if (w.__v6CssFallback) clearTimeout(w.__v6CssFallback);
      build(lc, ln, lr, pc, pr);
    })
    .catch((e) => {
      renderer.dispose();
    });

  function build(
    leatherColor: THREE.Texture,
    leatherNormal: THREE.Texture,
    leatherRough: THREE.Texture,
    paperColor: THREE.Texture,
    paperRough: THREE.Texture,
  ) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 50);
    camera.position.set(0, 0.85, 11.2);
    camera.lookAt(0, -0.2, 0);

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      zIndex: "1",
    } as CSSStyleDeclaration);
    el.prepend(renderer.domElement);
    const cssBook = el.querySelector<HTMLElement>(".v6-book");
    if (cssBook) cssBook.style.visibility = "hidden";

    // ---- materials -------------------------------------------------------
    leatherColor.wrapS = leatherColor.wrapT = THREE.RepeatWrapping;
    leatherNormal.wrapS = leatherNormal.wrapT = THREE.RepeatWrapping;
    leatherRough.wrapS = leatherRough.wrapT = THREE.RepeatWrapping;
    const leather = new THREE.MeshStandardMaterial({
      map: leatherColor,
      normalMap: leatherNormal,
      roughnessMap: leatherRough,
      normalScale: new THREE.Vector2(1.35, 1.35),
      color: new THREE.Color(0x9a7a5e), // warms the albedo under tungsten light
      roughness: 1,
    });
    const leatherInner = new THREE.MeshStandardMaterial({
      map: leatherColor,
      normalMap: leatherNormal,
      color: new THREE.Color(0x6d543f),
      roughness: 1,
    });
    const paperEdge = new THREE.MeshStandardMaterial({
      map: paperColor,
      roughnessMap: paperRough,
      color: new THREE.Color(0xf0e6c8),
    });
    const paperFace = new THREE.MeshStandardMaterial({
      map: firstPageTexture(),
      roughnessMap: paperRough,
    });
    const bandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xa04f15),
      roughness: 0.7,
    });

    // ---- book ------------------------------------------------------------
    const book = new THREE.Group();
    scene.add(book);
    book.rotation.set(-0.06, -0.3, 0.02);

    const W = 3.05, H = 4.05, D = 0.62, COVER = 0.09;

    // page block: paper on every side, the ruled first page on +z
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(W - 0.14, H - 0.12, D),
      [paperEdge, paperEdge, paperEdge, paperEdge, paperFace, paperEdge],
    );
    pages.castShadow = true;
    book.add(pages);

    // back cover
    const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, COVER), leather);
    back.position.z = -(D / 2 + COVER / 2);
    back.castShadow = true;
    book.add(back);

    // front cover on a spine pivot
    const pivot = new THREE.Group();
    pivot.position.set(-W / 2, 0, D / 2 + COVER / 2);
    book.add(pivot);
    const front = new THREE.Mesh(new THREE.BoxGeometry(W, H, COVER), [
      leather, leather, leather, leather, leather, leatherInner,
    ]);
    front.position.x = W / 2;
    front.castShadow = true;
    pivot.add(front);
    // embossed title decal, a hair proud of the cover face
    const decal = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.94, H * 0.94),
      new THREE.MeshStandardMaterial({
        map: coverTitleTexture(),
        transparent: true,
        roughness: 0.85,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    );
    decal.position.set(W / 2, 0, COVER / 2 + 0.004);
    pivot.add(decal);

    // elastic band, wrapping proud of both covers
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, H + 0.14, D + COVER * 2 + 0.08),
      bandMat,
    );
    band.position.x = W * 0.365;
    band.castShadow = true;
    book.add(band);

    // ---- room ------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0x2e2620, 2.2));
    const key = new THREE.SpotLight(0xffd9a0, 260, 30, 0.75, 0.9, 1.6);
    key.position.set(3.6, 5.2, 4.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x93a5c8, 0.5);
    fill.position.set(-4, 1.2, 2.5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xffc880, 55, 20, 1.8);
    rim.position.set(-1.5, 2.6, -3.4);
    scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.42 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // ---- interaction -----------------------------------------------------
    const parallax = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      parallax.x = (e.clientX / innerWidth - 0.5) * 2;
      parallax.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    addEventListener("pointermove", onMove, { passive: true });
    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("resize", onResize);

    // ---- opening choreography -------------------------------------------
    let opening = false;
    let openStart = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const open = () => {
      if (opening) return;
      opening = true;
      openStart = performance.now();
      hint?.classList.remove("v6-hint-on");
      setTimeout(() => {
        el.classList.add("v6-gone");
        setTimeout(() => {
          cleanup();
          finish();
        }, 700);
      }, 1750);
    };
    const onDown = () => open();
    el.addEventListener("pointerdown", onDown);
    const onKey = () => open();
    addEventListener("keydown", onKey, true);
    if (mode === "auto") setTimeout(open, 2900);

    // "tap to open" hint
    const hint = document.createElement("span");
    hint.className = "v6-hint";
    hint.textContent = mode === "hold" ? "tap the notebook" : "tap to open";
    el.appendChild(hint);
    setTimeout(() => hint.classList.add("v6-hint-on"), 1100);

    // ---- loop ------------------------------------------------------------
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - t0) / 1000;

      // idle float + pointer parallax (lerped)
      const targetY = -0.3 + parallax.x * 0.16;
      const targetX = -0.06 + parallax.y * 0.10;
      book.rotation.y += (targetY - book.rotation.y) * 0.05;
      book.rotation.x += (targetX - book.rotation.x) * 0.05;
      book.position.y = Math.sin(t * 0.9) * 0.09;
      book.rotation.z = 0.02 + Math.sin(t * 0.7) * 0.012;

      if (opening) {
        const k = (performance.now() - openStart) / 1000;
        // band snaps away first
        const bk = Math.min(k / 0.4, 1);
        band.position.y = -ease(bk) * 5.2;
        band.rotation.z = ease(bk) * 0.35;
        // cover swings from 0.45s
        const ck = Math.max(0, Math.min((k - 0.45) / 1.05, 1));
        pivot.rotation.y = -easeInOut(ck) * 2.5;
        // camera leans in toward the page
        camera.position.z = 11.2 - easeInOut(ck) * 2.2;
        camera.position.y = 0.85 - easeInOut(ck) * 0.4;
        // the book turns square to the reader
        book.rotation.y += ((0.0 - book.rotation.y) * 0.08);
      }

      renderer.render(scene, camera);
    };
    tick();

    function cleanup() {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      removeEventListener("keydown", onKey, true);
      renderer.dispose();
    }
  }
}
