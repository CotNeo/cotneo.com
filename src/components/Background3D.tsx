'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyParticles() {
  const points = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);
  const { size, camera, gl } = useThree();
  const particleCount = 3000;
  const branches = 5;
  const spin = 1;
  const randomness = 0.5;
  const randomnessPower = 3;
  const insideColor = new THREE.Color('#ff6030');
  const outsideColor = new THREE.Color('#1b3984');

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 20;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = radius * spin;

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / 20);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2;
    }

    return { positions, colors, sizes };
  }, [branches, spin, randomness, randomnessPower, insideColor, outsideColor]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    const colors = points.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Spiral rotation
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      const newAngle = angle + (0.1 * time) / radius;

      positions[i3] = Math.cos(newAngle) * radius;
      positions[i3 + 2] = Math.sin(newAngle) * radius;

      // Vertical wave motion
      positions[i3 + 1] = y + Math.sin(time * 0.5 + radius * 0.5) * 0.3;

      // Mouse interaction
      const distanceToMouse = Math.sqrt(
        Math.pow(positions[i3] / 20 - mousePosition.current.x, 2) +
        Math.pow(positions[i3 + 1] / 20 - mousePosition.current.y, 2)
      );

      if (distanceToMouse < 0.1) {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        const radius = Math.sqrt(x * x + z * z);
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / 20);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    points.current.rotation.y = time * 0.05;
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
    </Points>
  );
}

function EnergyField() {
  const fieldRef = useRef<THREE.LineSegments>(null);
  const particleCount = 100;
  const radius = 30;

  const { geometry, material } = useMemo(() => {
    const points: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      points.push(x, y, z);

      const color = new THREE.Color();
      color.setHSL(i / particleCount, 0.8, 0.5);
      colors.push(color.r, color.g, color.b);

      if (i > 0) {
        indices.push(i - 1, i);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    return { geometry, material };
  }, []);

  useFrame((state) => {
    if (!fieldRef.current) return;
    const time = state.clock.getElapsedTime();

    fieldRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    fieldRef.current.rotation.y = time * 0.2;
    fieldRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;

    const positions = fieldRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + i) * 0.01;
    }
    fieldRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <primitive object={new THREE.LineSegments(geometry, material)} ref={fieldRef} />;
}

const Background3D = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ 
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a1a 100%)',
          pointerEvents: 'none'
        }}
      >
        <fog attach="fog" args={['#1a1a2e', 30, 100]} />
        <ambientLight intensity={0.5} />
        <GalaxyParticles />
        <EnergyField />
        <Effects />
      </Canvas>
    </div>
  );
};

function Effects() {
  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.5;
  }, [gl, size]);

  return null;
}

export default Background3D;