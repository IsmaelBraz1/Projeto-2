import * as THREE from 'three';

export function createCylinder(scene) {
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 2, 3);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: false });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.set(0, 1, -16);
    scene.add(baseMesh);

    // Carregar a textura
    const textureLoader = new THREE.TextureLoader();
    const barrelTexture = textureLoader.load('../textura/cano.webp'); // Substitua pelo caminho correto

    const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7,3, 10, 5, false);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ map: barrelTexture });
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cylinderMesh.position.set(0, 3, -16);
    cylinderMesh.rotateX(Math.PI / 2);
    scene.add(cylinderMesh);

    return { baseMesh, cylinderMesh};
}