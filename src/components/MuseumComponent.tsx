import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ThreeDots } from "react-loader-spinner";

let firstRound;
let secondRound;
let thirdRound;

const MuseumComponent: React.FC = () => {
  const mount1 = useRef(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(25))

    // scene.rotation.y=45;
    // scene.position.y=0;
    // scene.position.z=0;


    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    // renderer.rotation.y=10

    renderer.useLegacyLights = false;
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount1.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 4;

    const loader = new GLTFLoader();
    loader.load(
      "https://testbucketsq.s3.ap-south-1.amazonaws.com/GLTF_Models/MuseumBakedA.glb",
      function (gltf) {
        gltf.scene.traverse(function (child) {});
        scene.add(gltf.scene);
        setLoading(false);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log(error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);   // continously call animate function to render

      controls.update();
      
      // Rotate the camera around the model in the y-axis  

      const speed = 0.0001; // Adjust the rotation speed
      let angle = performance.now() * speed;

      console.log(angle)

      if(angle<5.2){
        const radius = 25; // Adjust the radius of the camera orbit
        camera.position.x = scene.position.x + radius * Math.sin(angle);
        camera.position.z = scene.position.z + radius * Math.cos(angle);
        camera.lookAt(scene.position);
      }

      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount1.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-black">
      {isLoading && (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ position: "fixed" }}
          visible={true}
        />
      )}
      <div ref={mount1}></div>
    </div>
  );
};

export default MuseumComponent;
