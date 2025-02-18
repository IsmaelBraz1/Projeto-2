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

camera.position.set(-20, 7, 0); // Ajuste a posição da câmera
camera.lookAt(-13, 0, 0); // Olhe para o cilindro
orbit.update();

let mouseX = 0;
let mouseY = 0;

// Função para calcular a posição do mouse no espaço 3D
function onMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Adicionando ouvinte de evento para o movimento do mouse
window.addEventListener('mousemove', onMouseMove, false);

// Criando o plano
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
    wireframe: false
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

// Criando a geometria do cilindro oco
const cylinderGeometry = new THREE.CylinderGeometry(1, 2, 5, 10, 5, true);
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(-13, 0, 0);
scene.add(cylinderMesh);

// Criando o mundo físico com Cannon.js
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const timeStep = 1/60;

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
    const newSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const newSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const newSphereMesh = new THREE.Mesh(newSphereGeometry, newSphereMaterial);

    // Posicionando a nova esfera na boca do cilindro
    newSphereMesh.position.copy(position);
    scene.add(newSphereMesh);

    // Criando a esfera física correspondente
    const newSphereShape = new CANNON.Sphere(1);
    const newSphereBody = new CANNON.Body({
        mass: 1,
        shape: newSphereShape,
        position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    newSphereBody.linearDamping = 0.7;
    world.addBody(newSphereBody);

    // Aplicando uma força inicial na esfera para lançá-la na direção do cilindro
    const launchDirection = calculateLaunchDirection();
    const forceMagnitude = 1200; // Ajuste a magnitude da força conforme necessário
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

    // Atualizando a rotação do cilindro com base na posição do mouse
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    cylinderMesh.lookAt(pos);

    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
