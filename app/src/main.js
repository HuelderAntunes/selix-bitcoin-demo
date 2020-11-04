import * as THREE from 'three/build/three.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { gsap, TweenMax } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { exp } from '../index'

function main () {
  gsap.registerPlugin(ScrollTrigger)

  const { sceneRef, renderer, camera } = exp.getDefaults()

  const clock = new THREE.Clock()
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(sceneRef, camera)
  const filmPass = new FilmPass(1, 0, 10, 0)

  composer.addPass(renderPass)
  composer.addPass(filmPass)

  function setupLights () {
    let light = new THREE.PointLight(0xffffcc, 1)
    light.position.set(0, -20, -10)
    sceneRef.add(light)

    light = new THREE.PointLight(0xffffcc, 1)
    light.position.set(-15, 3, -10)
    sceneRef.add(light)

    light = new THREE.PointLight(0xffffcc, 1)
    light.position.set(15, 3, 10)
    sceneRef.add(light)

    light = new THREE.PointLight(0xffffcc, 1)
    light.position.set(0, 5, -10)
    sceneRef.add(light)

    light = new THREE.PointLight(0xffffcc, 1)
    light.position.set(0, 5, 10)
    sceneRef.add(light)

    light = new THREE.AmbientLight(0xffffff, 1)
    sceneRef.add(light)
  }

  function setupObjects () {
    const loader = new GLTFLoader()

    loader.load(
      'assets/3d/bitcoin/bitcoin_model.gltf',
      gltf => {
        const object = gltf.scene

        object.position.set(0, 0.3, 0)

        object.scale.set(0.03, 0.03, 0.025)

        TweenMax.from(object.rotation, 2, {
          y: 6.25,
          yoyo: true,
          repeat: -1,
          ease: 'Power2.easeInOut'
        })

        object.receiveShadow = true
        object.castShadow = true
        sceneRef.add(object)

        const spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 5, 1, 1)
        spotLight.position.set(0, 3, 0)
        spotLight.rotation.set(0, 0, THREE.MathUtils.degToRad(90))
        spotLight.castShadow = true
        spotLight.target = object

        sceneRef.add(spotLight)
      },
      undefined,
      error => {
        console.log(error)
      }
    )

    loader.load(
      'assets/3d/bitcoin/terrain.gltf',
      gltf => {
        const object = gltf.scene

        object.position.set(0, -2.3, 0)

        object.scale.set(2.5, 2, 2.5)

        sceneRef.add(object)
      },
      undefined,
      error => {
        console.log(error)
      }
    )
  }

  function setupEnviroment () {
    camera.position.set(0, 0, 5)
    sceneRef.background = 0x1b464f
    sceneRef.fog = new THREE.FogExp2(0x1b464f, 0.3)

    let geometry = new THREE.BoxGeometry(200, 200, 200)
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    material.side = THREE.DoubleSide
    const cube = new THREE.Mesh(geometry, material)

    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0)
    plane.position.set(0, -2, 0)
    plane.receiveShadow = true

    sceneRef.add(plane)
    sceneRef.add(cube)
  }

  function setupAnimation () {
    gsap.to(camera.position, {
      z: -4,
      x: -5,
      y: 0,
      duration: 3,
      scrollTrigger: {
        trigger: '#s2_blockchain',
        scrub: true
      }
    })

    gsap.to(camera.rotation, {
      z: 0,
      y: THREE.MathUtils.degToRad(-90),
      duration: 3,
      scrollTrigger: {
        trigger: '#s2_blockchain',
        scrub: true
      }
    })

    gsap.to('#s1_btn_start', {
      'font-size': '30px',
      opacity: 0,
      display: 'none',
      duration: 1,
      scrollTrigger: {
        trigger: '#s2_blockchain',
        scrub: true
      }
    })

    gsap.from('#s2_txt_description', {
      x: '-50vw',
      opacity: 0,
      display: 'none',
      duration: 1,
      scrollTrigger: {
        trigger: '#s2_blockchain',
        scrub: true
      }
    })
  }

  // run on start
  exp.subscribeToInit('main', ctx => {
    setupLights()
    setupObjects()
    setupEnviroment()
    setupAnimation()
  })
}

export default main
