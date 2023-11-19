import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GUI} from 'dat.gui'

const MapComponent: React.FC = () => {
  const mount1 = useRef(null);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {

    const scene = new THREE.Scene()
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const light = new THREE.PointLight(0xffffff, 100)
    light.position.set(0,1,10)
    scene.add(light)

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 1


    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount1.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8,360,180)

    const material = new THREE.MeshPhongMaterial()

    const worldColour = new THREE.TextureLoader().load('src/assets/worldColour.5400x2700.jpg')
    material.map = worldColour

    // const bumpTexture = new THREE.TextureLoader().load('src/assets/earth_bumpmap.jpg')
    // material.bumpMap = bumpTexture
    // material.bumpScale = 0.015

    const displacementMap = new THREE.TextureLoader().load('src/assets/gebco_bathy.5400x2700_8bit.jpg')
    material.displacementMap = displacementMap

    const plane = new THREE.Mesh(planeGeometry, material)
    // plane.rotation.x = 90; // Adjust the angle if needed
    scene.add(plane)


    const gui = new GUI()
    gui.add(material, 'bumpScale', 0, 1, 0.01)

    const options = {
        side: {
            FrontSide: THREE.FrontSide,
            BackSide: THREE.BackSide,
            DoubleSide: THREE.DoubleSide,
        },
    }

    const materialFolder = gui.addFolder('THREE.Material')
    materialFolder
        .add(material, 'transparent')
        .onChange(() => (material.needsUpdate = true))
    materialFolder.add(material, 'opacity', 0, 1, 0.01)
    materialFolder.add(material, 'depthTest')
    materialFolder.add(material, 'depthWrite')
    materialFolder
        .add(material, 'alphaTest', 0, 1, 0.01)
        .onChange(() => updateMaterial())
    materialFolder.add(material, 'visible')
    materialFolder
        .add(material, 'side', options.side)
        .onChange(() => updateMaterial())
    //materialFolder.open()

    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        specular: material.specular.getHex(),
    }

    const meshPhongMaterialFolder = gui.addFolder('THREE.meshPhongMaterialFolder')

    meshPhongMaterialFolder.addColor(data, 'color').onChange(() => {
        material.color.setHex(Number(data.color.toString().replace('#', '0x')))
    })
    meshPhongMaterialFolder.addColor(data, 'emissive').onChange(() => {
        material.emissive.setHex(
            Number(data.emissive.toString().replace('#', '0x'))
        )
    })
    meshPhongMaterialFolder.addColor(data, 'specular').onChange(() => {
        material.specular.setHex(
            Number(data.specular.toString().replace('#', '0x'))
        )
    })
    meshPhongMaterialFolder.add(material, 'shininess', 0, 1024)
    meshPhongMaterialFolder.add(material, 'wireframe')
    meshPhongMaterialFolder
        .add(material, 'flatShading')
        .onChange(() => updateMaterial())
    meshPhongMaterialFolder.add(material, 'reflectivity', 0, 1)
    meshPhongMaterialFolder.add(material, 'refractionRatio', 0, 1)
    meshPhongMaterialFolder.add(material, 'displacementScale', 0, 1, 0.01)
    meshPhongMaterialFolder.add(material, 'displacementBias', -1, 1, 0.01)
    meshPhongMaterialFolder.open()

    function updateMaterial() {
        material.side = Number(material.side) as THREE.Side
        material.needsUpdate = true
    }

    const planeData = {
        width: 3.6,
        height: 1.8,
        widthSegments: 360,
        heightSegments: 180,
    }

    const planePropertiesFolder = gui.addFolder('PlaneGeometry')
    // planePropertiesFolder.add(planeData, 'width', 1, 30).onChange(regeneratePlaneGeometry)
    // planePropertiesFolder.add(planeData, 'height', 1, 30).onChange(regeneratePlaneGeometry)
    planePropertiesFolder
        .add(planeData, 'widthSegments', 1, 360)
        .onChange(regeneratePlaneGeometry)
    planePropertiesFolder
        .add(planeData, 'heightSegments', 1, 180)
        .onChange(regeneratePlaneGeometry)
    planePropertiesFolder.open()

    function regeneratePlaneGeometry() {
        const newGeometry = new THREE.PlaneGeometry(
            planeData.width,
            planeData.height,
            planeData.widthSegments,
            planeData.heightSegments
        )
        plane.geometry.dispose()
        plane.geometry = newGeometry
    }


    const animate = () => {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      setCubeRotation({
        x: plane.rotation.x,
        y: plane.rotation.y,
      });

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
      <div
        className=""
        ref={mount1}>
      </div>
    </div>
  );
};

export default MapComponent;
