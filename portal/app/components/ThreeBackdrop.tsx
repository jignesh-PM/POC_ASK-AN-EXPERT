"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const hero = host?.closest<HTMLElement>(".morgan-hero");
    if (!host || !hero) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      host.hidden = true;
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 40);
    camera.position.z = 18;

    const rig = new THREE.Group();
    scene.add(rig);

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(2.25, 28, 18),
      new THREE.MeshBasicMaterial({ color: 0x9bd4e5, wireframe: true, transparent: true, opacity: 0.19 }),
    );
    rig.add(shell);

    const fineRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.012, 4, 144),
      new THREE.MeshBasicMaterial({ color: 0xf0a18a, transparent: true, opacity: 0.54 }),
    );
    fineRing.rotation.set(0.95, 0.42, -0.25);
    rig.add(fineRing);

    const wideRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.008, 3, 144),
      new THREE.MeshBasicMaterial({ color: 0xc3e7ed, transparent: true, opacity: 0.26 }),
    );
    wideRing.rotation.set(0.2, 1.12, 0.56);
    rig.add(wideRing);

    const moteGeometry = new THREE.SphereGeometry(0.065, 10, 8);
    const moteMaterial = new THREE.MeshBasicMaterial({ color: 0xffb19b });
    const mote = new THREE.Mesh(moteGeometry, moteMaterial);
    rig.add(mote);

    const sceneHeight = 9;
    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const aspect = bounds.width / bounds.height;
      const halfHeight = sceneHeight / 2;
      const halfWidth = halfHeight * aspect;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      rig.position.set(halfWidth * 0.43, 0.05, 0);
      renderer.setSize(bounds.width, bounds.height, false);
      renderer.render(scene, camera);
    };

    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
      targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.28;
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let angle = 0;
    const renderFrame = () => {
      rig.rotation.x += (targetX - rig.rotation.x) * 0.035;
      rig.rotation.y += (targetY - rig.rotation.y) * 0.035 + 0.0011;
      fineRing.rotation.z += 0.00045;
      wideRing.rotation.x += 0.0003;
      angle += 0.007;
      mote.position.set(Math.cos(angle) * 3.05, Math.sin(angle) * 1.05, Math.sin(angle) * 0.7);
      renderer.render(scene, camera);
      if (!reducedMotion) frameId = window.requestAnimationFrame(renderFrame);
    };

    resize();
    renderFrame();
    const observer = new ResizeObserver(resize);
    observer.observe(hero);
    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      rig.clear();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      fineRing.geometry.dispose();
      (fineRing.material as THREE.Material).dispose();
      wideRing.geometry.dispose();
      (wideRing.material as THREE.Material).dispose();
      moteGeometry.dispose();
      moteMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="three-scene" aria-hidden="true" />;
}
