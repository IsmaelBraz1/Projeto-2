import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { createStructure1 } from './Estrutura1.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 7, -20); // Ajuste a posição da câmera
camera.lookAt(-15, 0, 0); // Olhe para o cilindro
orbit.update();

// Criando o plano
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    wireframe: false
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

// Criando as paredes
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
const wallHeight = 20;

// Paredes laterais
const sideWallGeo = new THREE.PlaneGeometry(50, wallHeight);
const leftWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
leftWallMesh.position.set(-25, wallHeight / 2, 0);
leftWallMesh.rotateY(Math.PI / 2);
scene.add(leftWallMesh);

const rightWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
rightWallMesh.position.set(25, wallHeight / 2, 0);
rightWallMesh.rotateY(Math.PI / 2);
scene.add(rightWallMesh);

// Paredes frontais
const frontWallGeo = new THREE.PlaneGeometry(50, wallHeight);
const frontWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
frontWallMesh.position.set(0, wallHeight / 2, -25);
scene.add(frontWallMesh);

const backWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
backWallMesh.position.set(0, wallHeight / 2, 25);
scene.add(backWallMesh);

// Criando a base para o cilindro
const baseGeometry = new THREE.CylinderGeometry(2, 2, 2, 32); // Base mais baixa
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: false });
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
baseMesh.position.set(0, 1, -13); // Posição da base (em contato com o piso)
scene.add(baseMesh);

// Criando a geometria do cilindro oco
const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7, 5, 10, 5, true);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(0, 3, -13); // Posição do cilindro (sobre a base)
cylinderMesh.rotateX(Math.PI / 2);
scene.add(cylinderMesh);

// Criando o mundo físico com Cannon.js
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const timeStep = 1 / 60;

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    mass: 0
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

// Função para calcular a direção do lançamento baseado na rotação do cilindro
function calculateLaunchDirection() {
    const direction = new THREE.Vector3(0, 1, 0); // Direção inicial da força (para cima)
    direction.applyQuaternion(cylinderMesh.quaternion); // Aplicar a rotação do cilindro à direção
    return direction;
}

// Ouvinte para cliques do mouse
window.addEventListener('click', () => {
    // Definindo a posição da nova esfera (na boca do cilindro)
    const position = cylinderMesh.position.clone();
    position.add(new THREE.Vector3(0, cylinderGeometry.parameters.height / 2, 0).applyQuaternion(cylinderMesh.quaternion));

    // Criando a geometria e o material da nova esfera
    const newSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const newSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const newSphereMesh = new THREE.Mesh(newSphereGeometry, newSphereMaterial);

    // Posicionando a nova esfera na boca do cilindro
    newSphereMesh.position.copy(position);
    scene.add(newSphereMesh);

    // Criando a esfera física correspondente
    const newSphereShape = new CANNON.Sphere(0.5);
    const newSphereBody = new CANNON.Body({
        mass: 0.5,
        shape: newSphereShape,
        position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    newSphereBody.linearDamping = 0.7;
    world.addBody(newSphereBody);

    // Aplicando uma força inicial na esfera para lançá-la na direção do cilindro
    const launchDirection = calculateLaunchDirection();
    const forceMagnitude = 1500; // Ajuste a magnitude da força conforme necessário
    const force = new CANNON.Vec3(launchDirection.x * forceMagnitude, launchDirection.y * forceMagnitude, launchDirection.z * forceMagnitude);
    newSphereBody.applyForce(force, new CANNON.Vec3(0, 0, 0)); // Use applyForce em vez de applyLocalForce

    // Log para depuração
    console.log('Sphere created:', { newSphereMesh, newSphereBody, force });

    // Sincronizando a nova esfera no loop de animação
    newSpheres.push({ mesh: newSphereMesh, body: newSphereBody });
});

const newSpheres = [];

let currentStructure;

currentStructure = createStructure1(scene, world); // Certifique-se de chamar a função após a criação do mundo

// Controles do teclado
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

function updateControls() {
    if (keys.w) {
        cylinderMesh.rotation.x -= 0.02; // Rotacionar o cilindro para cima
    }
    if (keys.s) {
        cylinderMesh.rotation.x += 0.02; // Rotacionar o cilindro para baixo
    }
    if (keys.a) {
        cylinderMesh.position.x -= 0.05; // Mover a base para a esquerda
        baseMesh.position.x -= 0.05;
    }
    if (keys.d) {
        cylinderMesh.position.x += 0.05; // Mover a base para a direita
        baseMesh.position.x += 0.05;
    }
}

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    newSpheres.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    if (currentStructure) {
        currentStructure.cubes.forEach((mesh, index) => {
            const body = currentStructure.cubeBodies[index];
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        });
    }

    updateControls(); // Atualizar controles de teclado

    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
