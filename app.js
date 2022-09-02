const section = document.querySelector('section');
// renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x212121,1.0)
renderer.setPixelRatio(window.devicePixelRatio)

section.appendChild(renderer.domElement)

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
scene.add(camera)
camera.position.z = -60;

//Light
const light = new THREE.AmbientLight(0x333333);
scene.add(light)
//
const pointLight = new THREE.PointLight(0xffffff , 1 );
pointLight.position.set(500,500,-2000)
scene.add(pointLight)

//make a threejs texture
const loader = new THREE.TextureLoader();



function makePlanet() {
    //texture
    const wilson = loader.load('./earth.jpg')
    // const wilson = loader.load('./earth.jpg')
    const geometry = new THREE.SphereGeometry(22,128,128);
    const material = new THREE.MeshLambertMaterial({
        map: wilson
    });
    const planet = new THREE.Mesh(geometry, material);
    scene.add(planet)
    return planet;
}

function makeRing(width,color) {
    const geometry = new THREE.TorusGeometry(width,0.1,10,100 );
    const material = new THREE.MeshBasicMaterial({
        color: color
    })
    const mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
    return mesh
}


const earth = makePlanet();
const ring1 = makeRing(30, 0xff4141);
ring1.geometry.rotateX(Math.PI / 2)
ring1.geometry.rotateZ(Math.PI / 10)

// const ring2 = makeRing(33, 0xffffff);
// ring2.geometry.rotateX(Math.PI / 2)
// ring2.geometry.rotateZ(Math.PI / 10)

let aimX = 0;
let aimY = 0;
let currentX = 0;
let currentY = 0;



function animate() {
    const diffX = aimX - currentX;
    const diffY = aimY - currentY;

    currentX = currentX + diffX * 0.05;
    currentY = currentY + diffY * 0.05;

    camera.position.x = currentX;
    camera.position.y = currentY;
      
    camera.lookAt(scene.position);
    earth.rotateY(0.01);
    ring1.geometry.rotateY(0.004);
    // ring2.geometry.rotateY(0.008);
    
    renderer.render(scene,camera);

    requestAnimationFrame(animate);
}

function makeStar() {
    const texture = loader.load('./particle.png')
    const geometry = new THREE.Geometry();

    for (let i = 0; i < 50000; i++) {
        const min = 1000;
        const point = new THREE.Vector3(
            2000 * Math.random() - min,
            2000 * Math.random() - min,
            2000 * Math.random() - min,
        );
        geometry.vertices.push(point);
    }

    const pointMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
        size: 5,
        blending: THREE.AdditiveBlending,
        depthTest: true
    })

    const points = new THREE.Points(geometry, pointMaterial)
    scene.add(points);

    return points
}
makeStar()

animate()


let isMouseDown = false;
let startX = 0;
let startY = 0;

document.addEventListener('scroll', function rotatePage() {
    const scrollPosition = window.pageYOffset / 200

    earth.rotation.set(0,scrollPosition, 0);
})

document.addEventListener('mousemove', function(event){
    if (isMouseDown) {
        // aimX = event.pageX / 50;
        // aimY = event.pageY / 50;
        aimX = aimX + (event.pageX - startX) / 50
        aimY = aimY + (event.pageY - startY) / 50
        startX = event.pageX;
        startY = event.pageY;
    }
})

document.addEventListener('mousedown', function() {
    isMouseDown = true;
})
document.addEventListener('mouseup', function() {
    isMouseDown = false;
})