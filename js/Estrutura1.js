import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function createStructure1(scene, world) {
    const cubeSize = 1;
    const spacing = 0.1;
    const cubes = [];
    const cubeBodies = [];
    const rows = 5;
    const columns = 10;

    // Crie um material padrão com fricção
    const defaultMaterial = new CANNON.Material("defaultMaterial");
    const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 1,  // Ajuste o valor de fricção conforme necessário
        restitution: 0.01
    });
    world.addContactMaterial(contactMaterial);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.set(j * (cubeSize + spacing), i * (cubeSize + spacing), 0);
            scene.add(cubeMesh);
            cubes.push(cubeMesh);

            const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize / 2, cubeSize / 2, cubeSize / 2));
            const cubeBody = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(j * (cubeSize + spacing), i * (cubeSize + spacing), 0),
                shape: cubeShape,
                material: defaultMaterial
            });
            cubeBody.linearDamping = 0;
            world.addBody(cubeBody);
            cubeBodies.push(cubeBody);

            // Log para depuração
            console.log('Cube created:', { cubeMesh, cubeBody });
        }
    }

    return { cubes, cubeBodies };
}
