import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GUI} from 'dat.gui'

const SphereComponent: React.FC = () => {
  const mount1 = useRef(null);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {

    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(1.5))
    const camera = new THREE.PerspectiveCamera(
      60, // camera angle in degrees
      1,  // object aspect ratio 
      1,  // Near clipping plane from camera in z-axis
      100   // Far clipping plane from camera in z-axis
    );
    camera.position.z = 5   ;
    camera.position.y = 5;
    camera.position.x = 5;

    const light = new THREE.PointLight(0xffffff, 1000)
    light.position.set(0, 10, 0)
    scene.add(light)


    // Create separate renderers for each canvas
    const renderer1 = new THREE.WebGLRenderer();
    renderer1.setSize(window.innerWidth-10, window.innerWidth-10); // 1340, 780
    mount1.current?.appendChild(renderer1.domElement);
    new OrbitControls(camera, renderer1.domElement);

    const geometry = new THREE.BoxGeometry(1,1,1);
    const sphereGeometry = new THREE.SphereGeometry()


    const material = new THREE.MeshNormalMaterial({
    //   color: 0x00ff00,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(sphereGeometry, material);  

    // add directions and rotations and scaling for geometries
    const gui = new GUI()
    const SphereFolder = gui.addFolder('Sphere')
    const spherePosition = SphereFolder.addFolder('Position')
    spherePosition.add(sphere.position,'x',-10,10)
    spherePosition.add(sphere.position,'y',-10,10)
    spherePosition.add(sphere.position,'z',-10,10)
    const sphereRotation = SphereFolder.addFolder('Rotation')
    sphereRotation.add(sphere.rotation, 'x', 0, Math.PI * 2, 0.01)
    sphereRotation.add(sphere.rotation, 'y', 0, Math.PI * 2, 0.01)
    sphereRotation.add(sphere.rotation, 'z', 0, Math.PI * 2, 0.01)

    const sphereData = {
        radius: 1,
        widthSegments: 8,
        heightSegments: 6,
        phiStart: 0,
        phiLength: Math.PI * 2,
        thetaStart: 0,
        thetaLength: Math.PI,
    }

    // add geometry properties
    const spherePropertiesFolder = SphereFolder.addFolder('Properties')
    spherePropertiesFolder.add(sphereData, 'radius', 0.1, 30).onChange(regenerateSphereGeometry)
    spherePropertiesFolder.add(sphereData, 'widthSegments', 1, 36).onChange(regenerateSphereGeometry)
    spherePropertiesFolder.add(sphereData, 'heightSegments', 1, 18).onChange(regenerateSphereGeometry)
    spherePropertiesFolder
        .add(sphereData, 'phiStart', 0, Math.PI * 2)
        .onChange(regenerateSphereGeometry)
    spherePropertiesFolder
        .add(sphereData, 'phiLength', 0, Math.PI * 2)
        .onChange(regenerateSphereGeometry)
    spherePropertiesFolder.add(sphereData, 'thetaStart', 0, Math.PI).onChange(regenerateSphereGeometry)
    spherePropertiesFolder.add(sphereData, 'thetaLength', 0, Math.PI).onChange(regenerateSphereGeometry)

    function regenerateSphereGeometry() {
        const newGeometry = new THREE.SphereGeometry(
            sphereData.radius,
            sphereData.widthSegments,
            sphereData.heightSegments,
            sphereData.phiStart,
            sphereData.phiLength,
            sphereData.thetaStart,
            sphereData.thetaLength
        )
        sphere.geometry.dispose()
        sphere.geometry = newGeometry
    }

    // add material properties

    const options = {
        side: {
            "FrontSide": THREE.FrontSide,
            "BackSide": THREE.BackSide,
            "DoubleSide": THREE.DoubleSide,
        }
    }
    function updateMaterial() {
        material.side = Number(material.side) as THREE.Side
        material.needsUpdate = true
    }
    const materialFolder = gui.addFolder("Material");
    materialFolder.add(material, 'transparent').onChange(() => material.needsUpdate = true)
    materialFolder.add(material, 'opacity', 0, 1, 0.01)
    materialFolder.add(material, 'depthTest')
    materialFolder.add(material, 'depthWrite')
    materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())
    materialFolder.add(material, 'visible')
    materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
    materialFolder.add(material, 'wireframe')
    materialFolder
        .add(material, 'flatShading')
        .onChange(() => updateMaterial())
    
    const planeData = {
        width: 3.6,
        height: 1.8,
        widthSegments: 180,
        heightSegments: 90,
    }

    const planePropertiesFolder = gui.addFolder('PlaneGeometry')
    planePropertiesFolder
        .add(planeData, 'widthSegments', 1, 360)
        .onChange(regeneratePlaneGeometry)
    planePropertiesFolder
        .add(planeData, 'heightSegments', 1, 180)
        .onChange(regeneratePlaneGeometry)
    planePropertiesFolder.open()
    
    const lightFolder = gui.addFolder('Light')
    lightFolder.add(light.position, 'x', -10, 10).name('position.x')
    lightFolder.add(material.normalScale, 'x', 0, 10, 0.01).name('normalScale.x')
    lightFolder.add(material.normalScale, 'y', 0, 10, 0.01).name('normalScale.y')
    lightFolder.open()

    function regeneratePlaneGeometry() {
        let newGeometry = new THREE.PlaneGeometry(
            planeData.width,
            planeData.height,
            planeData.widthSegments,
            planeData.heightSegments
        )
        sphere.geometry.dispose()
        sphere.geometry = newGeometry
    }

    // materialFolder.open();
    // SphereFolder.open()


    scene.add(sphere);

    const animate = () => {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      setCubeRotation({
        x: sphere.rotation.x,
        y: sphere.rotation.y,
      });

      render();
    };

    const render = () => {
      renderer1.render(scene, camera);
    };
    
    animate();

    // clear the previously appended canvas elements
    return () => {
      mount1.current?.removeChild(renderer1.domElement);
    };

  }, []);

  return (
    <div className="flex items-center justify-center bg-black">
      <div
        className=""
        ref={mount1}>
      </div>
    </div>
  );
};

export default SphereComponent;
