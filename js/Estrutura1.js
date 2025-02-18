import * as THREE from 'three';
import * as CANNON from 'cannon-es';
export function createStructure1(scene, world) {
    const cubeSize = 1;
    const spacing = 0.2;
    const cubes = [];
    const cubeBodies = [];

    for (let i = 0; i < 5; i++) { // Exemplo com 5 cubos
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cubeMesh.position.set(0, i * (cubeSize + spacing), 0);
        scene.add(cubeMesh);
        cubes.push(cubeMesh);

        const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize / 2, cubeSize / 2, cubeSize / 2));
        const cubeBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, i * (cubeSize + spacing), 0),
            shape: cubeShape
        });
        cubeBody.linearDamping = 0.8;
        world.addBody(cubeBody);
        cubeBodies.push(cubeBody);

        // Log para depuração
        console.log('Cube created:', { cubeMesh, cubeBody });
    }

    return { cubes, cubeBodies };
}

