import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CubeComponent: React.FC = () => {
  const mount1 = useRef(null);
  const mount2 = useRef(null);
  const mount3 = useRef(null);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {

    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const scene3 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, // camera angle in degrees
      1,  // object aspect ratio 
      1,  // Near clipping plane from camera in z-axis
      100   // Far clipping plane from camera in z-axis
    );
    camera.position.z = 2;
    camera.position.y = 2;
    camera.position.x = 2;

    const camera3 = new THREE.PerspectiveCamera(
      60, // camera angle in degrees
      1,  // object aspect ratio 
      1,  // Near clipping plane from camera in z-axis
      100   // Far clipping plane from camera in z-axis
    );
    camera3.position.z = 5;

    const camera2 = new THREE.OrthographicCamera(-3,3,3,-3,1,10)
    camera2.position.z = 1;
    // camera2.position.y = 1;

    // Create separate renderers for each canvas
    const renderer1 = new THREE.WebGLRenderer();
    renderer1.setSize(400, 400);
    mount1.current?.appendChild(renderer1.domElement);
    new OrbitControls(camera, renderer1.domElement);

    const renderer2 = new THREE.WebGLRenderer();
    renderer2.setSize(400, 400);
    mount2.current?.appendChild(renderer2.domElement);
    new OrbitControls(camera2, renderer2.domElement);

    const renderer3 = new THREE.WebGLRenderer();
    renderer3.setSize(400, 400);
    mount3.current?.appendChild(renderer3.domElement);
    new OrbitControls(camera3, renderer3.domElement);

    const geometry = new THREE.BoxGeometry();
    const geometry2 = new THREE.TorusGeometry(1.5, 0.5, 16, 100)
    const geometry3 = new THREE.TorusKnotGeometry()

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });

    const cube = new THREE.Mesh(geometry, material);  
    const Torus = new THREE.Mesh(geometry2, material);
    const TorusNot = new THREE.Mesh(geometry3, material);
    scene.add(cube);
    scene2.add(Torus);
    scene3.add(TorusNot)

    const animate = () => {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      setCubeRotation({
        x: cube.rotation.x,
        y: cube.rotation.y,
      });

      render();
    };

    const render = () => {
      renderer1.render(scene, camera);
      renderer2.render(scene2, camera2);
      renderer3.render(scene3, camera3);
    };
    
    animate();

    // clear the previously appended canvas elements
    return () => {
      mount1.current?.removeChild(renderer1.domElement);
      mount2.current?.removeChild(renderer2.domElement);
      mount3.current?.removeChild(renderer3.domElement);
    };

  }, []);

  {/* <div
    className=" h-0 overflow-hidden grid-item"
    ref={mount1}
  ></div>
  <div
    className=" h-0 overflow-hidden grid-item"
    // ref={mount2}fj
    
  >jdfkjh</div> */}
  return (
    <div className="flex gap-3">
      <div
        ref={mount1}>
      </div>
      <div
        ref={mount2}>
      </div>
      <div
        ref={mount3}>
      </div>
    </div>
  );
};

export default CubeComponent;
