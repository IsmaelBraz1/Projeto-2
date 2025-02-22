import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { setupScene } from './sceneSetup.js';
import { createCenario } from './cenario.js';
import { createCylinder } from './arma.js';
import { setupPhysics } from './physics.js';
import { setupControls } from './controls.js';
import { createStructure1 } from './Estrutura1.js';
import { createExplosion} from './particleSystem.js'; 
const { scene, camera, renderer } = setupScene();
const { groundMesh } = createCenario(scene);
const { baseMesh, cylinderMesh } = createCylinder(scene);
const { world, groundBody } = setupPhysics();
const updateControls = setupControls(camera, baseMesh, cylinderMesh);

const timeStep = 1 / 60;
const newSpheres = [];
let currentStructure = createStructure1(scene, world);

function calculateLaunchDirection() {
    const direction = new THREE.Vector3(0, 1, 0);
    direction.applyQuaternion(cylinderMesh.quaternion);
    return direction;
}

window.addEventListener('click', () => {
    console.log("Mouse click detected");
    const position = cylinderMesh.position.clone();
    position.add(new THREE.Vector3(0, cylinderMesh.geometry.parameters.height / 2, 0).applyQuaternion(cylinderMesh.quaternion));

    const newSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const newSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const newSphereMesh = new THREE.Mesh(newSphereGeometry, newSphereMaterial);
    newSphereMesh.position.copy(position);
    scene.add(newSphereMesh);

    const newSphereShape = new CANNON.Sphere(0.5);
    const newSphereBody = new CANNON.Body({
        mass: 0.2,
        shape: newSphereShape,
        position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    newSphereBody.linearDamping = 0.7;
    world.addBody(newSphereBody);

    const launchDirection = calculateLaunchDirection();
    const forceMagnitude = 1500;
    const force = new CANNON.Vec3(launchDirection.x * forceMagnitude, launchDirection.y * forceMagnitude, launchDirection.z * forceMagnitude);
    newSphereBody.applyForce(force, new CANNON.Vec3(0, 0, 0));

    newSpheres.push({ mesh: newSphereMesh, body: newSphereBody });
    console.log("New sphere created and added to the scene");
     //temporizador para remover a bola após 3 segundos
     setTimeout(() => {
        scene.remove(newSphereMesh);
        world.removeBody(newSphereBody);
        const index = newSpheres.indexOf({ mesh: newSphereMesh, body: newSphereBody });
        if (index > -1) {
            newSpheres.splice(index, 1);
        }
        console.log("Sphere removed after 3 seconds");
    }, 2000);
});

function animate() {
    console.log("Animation frame started");
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    newSpheres.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
    });

    if (currentStructure) {
        const blocksToRemove = [];

        currentStructure.cubes.forEach((mesh, index) => {
            const body = currentStructure.cubeBodies[index];
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);

            // Verificar colisões com esferas
            newSpheres.forEach(({ body: sphereBody }) => {
                if (body.position.distanceTo(sphereBody.position) < 1) {
                    console.log("Collision detected at position:", body.position);
                    // Acionar sistema de partículas
                    const particleSystem = createExplosion(body.position, scene);
                    console.log("Explosion triggered at position", body.position);
                  // destroyBlock(scene);
                    // Adicionar bloco à lista para remoção
                    blocksToRemove.push(index);
                }
            });
        });

        // Remover blocos fora do laço de iteração
        blocksToRemove.forEach(index => {
            scene.remove(currentStructure.cubes[index]);
            world.removeBody(currentStructure.cubeBodies[index]);
            currentStructure.cubes.splice(index, 1);
            currentStructure.cubeBodies.splice(index, 1);
        });
    }

    updateControls();

    renderer.render(scene, camera);
    console.log("Animation frame rendered");
}

renderer.setAnimationLoop(animate);
