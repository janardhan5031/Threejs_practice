import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GUI} from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {ThreeDots} from 'react-loader-spinner'


const MuseumComponent: React.FC = () => {
  const mount1 = useRef(null);
  const [isLoading,setLoading]= useState(true)
  const [cubeRotation, setCubeRotation] = useState(1);

  useEffect(() => {

    const scene = new THREE.Scene()
    // const axesHelper = new THREE.AxesHelper(5)
    // scene.add(axesHelper)

    // const light = new THREE.PointLight(0xffffff, 100)
    // light.position.set(0,1,10)
    // scene.add(light)

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.x = 20
    camera.position.y = 15
    camera.position.z = 20


    const renderer = new THREE.WebGLRenderer()
    renderer.useLegacyLights = false 
    renderer.shadowMap.enabled = true
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount1.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.minPolarAngle = 0;
    controls.maxPolarAngle =Math.PI/2.1 ; // Set the maximum polar angle to Math.PI/2 (90 degrees)
    controls.minDistance = 4;


    const loader = new GLTFLoader()
    loader.load(
        'https://testbucketsq.s3.ap-south-1.amazonaws.com/GLTF_Models/MuseumBakedA.glb',
        function (gltf) {
            gltf.scene.traverse(function (child) {
                // if ((child as THREE.Mesh).isMesh) {
                //     const m = child as THREE.Mesh
                //     m.receiveShadow = true
                //     m.castShadow = true
                // }
                // if ((child as THREE.Light).isLight) {
                //     const l = child as THREE.SpotLight
                //     l.castShadow = true
                //     l.shadow.bias = -0.003
                //     l.shadow.mapSize.width = 2048
                //     l.shadow.mapSize.height = 2048
                // }
            })
            scene.add(gltf.scene)
            setLoading(false)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )

    scene.rotation.y=90

    const animate = () => {
      requestAnimationFrame(animate);

      setCubeRotation(v=>v+0.01)
      controls.update();

      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };
    
    animate();

    // clear the previously appended canvas elements
    return () => {
      mount1.current?.removeChild(renderer.domElement);
    };

  }, []);

  return (
    <div className="flex items-center justify-center bg-black">
        {
            isLoading && <ThreeDots 
                height="80" 
                width="80" 
                radius="9"
                color="#4fa94d" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{position:'fixed'}}
                visible={true}
             />
        }
        <div ref={mount1}></div>
    </div>
  );
};

export default MuseumComponent;
