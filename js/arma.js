import * as THREE from 'three';

export function createCylinder(scene) {
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 2, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: false });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.set(0, 1, -13);
    scene.add(baseMesh);

    const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7, 5, 10, 5, true);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.position.set(0, 3, -13);
    cylinderMesh.rotateX(Math.PI / 2);
    scene.add(cylinderMesh);

    return { baseMesh, cylinderMesh };
}
