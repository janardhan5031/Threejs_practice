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
    // scene.add(new THREE.AxesHelper(25)) 

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();

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

      let speed = 0.0005; // Adjust the rotation speed
      let angle = performance.now() * speed;
      
      // console.log(angle)

      if(angle<5.1){
        const radius = 25; // Adjust the radius of the camera orbit
        camera.position.x = scene.position.x + radius * Math.sin(angle);
        camera.position.y =20;
        camera.position.z = scene.position.z + radius * Math.cos(angle);
        camera.lookAt(scene.position);
      }
      // down the  camera
      else if(angle>5.1 && angle<6){
        const height = 0.5; // Adjust the radius of the camera orbit
        camera.position.y =camera.position.y -height;
        camera.lookAt(scene.position);
      }

      // move towards center
      else if(angle>6 && angle<6.12){
        const length = 0.5; // Adjust the radius of the camera orbit
        const x_z_relation=1.6
        camera.position.x =camera.position.x +(length*x_z_relation)-speed;
        camera.position.z =camera.position.z -(length*x_z_relation-.5)-speed;
        camera.lookAt(scene.position);
      }

      // rotate in inner circle
      else if(angle>6.7 && angle<11.35){
        const radius = 9; // Adjust the radius of the camera orbit
        camera.position.x = scene.position.x + radius * Math.sin(angle);
        camera.position.z = scene.position.z+ radius * Math.cos(angle);
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
