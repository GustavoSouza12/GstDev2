let camera
let controls
let renderer
let scene
let mesh

function init() {

container = document.querySelector( '#scene-container' )
scene = new THREE.Scene()
scene.background = new THREE.Color(  '#031CA6' );


createCamera()
createControls()
createLights()
createMeshes()
createRenderer()

renderer.setAnimationLoop( () => {

    render()

} )

}

function createCamera(){
    const fov = 35
    const aspect = container.clientWidth / container.clientHeight
    const near = 0.1
    const far = 100
    
    camera = new THREE.PerspectiveCamera( fov, aspect, near, far )
    camera.position.set( 10, 10, 10 )

}
function createControls(){

    controls = new THREE.OrbitControls(camera, container)

}

function createLights(){

    const ambientLight = new THREE.HemisphereLight(
    0xD4AF37, // bright sky color
    0x7c6724, // dim ground color
    4, // intensity
    );

    const mainLight = new THREE.DirectionalLight( 0xffffff, 5 )
    mainLight.position.set( 10, 10, 10 )

    scene.add( ambientLight )

}

function createMeshes(){

    const geometry = new THREE.BoxBufferGeometry( 3, 3, 3 )
    
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load( 'https://avatars0.githubusercontent.com/u/62048657?s=460&u=05c2ae1c62489a3155f8395133cafc5b1ad18259&v=4' )

    texture.encoding = THREE.sRGBEncoding
    texture.anisotropy = 16
    
    const material = new THREE.MeshStandardMaterial( {
    map: texture,
    } )
    
    mesh = new THREE.Mesh( geometry, material )
    scene.add( mesh )

}

function createRenderer(){

    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( container.clientWidth, container.clientHeight )

    renderer.setPixelRatio( window.devicePixelRatio )

    renderer.gammaFactor = 2.2
    renderer.gammaOutput = true

    renderer.physicallyCorrectLights = true
    container.appendChild( renderer.domElement )

}



function render() {

    renderer.render( scene, camera )

}

function onWindowResize() {

    camera.aspect = container.clientWidth / container.clientHeight

    camera.updateProjectionMatrix()
    
    renderer.setSize( container.clientWidth, container.clientHeight )

}

window.addEventListener( 'resize', onWindowResize )

init()