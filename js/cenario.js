import * as THREE from 'three';

export function createCenario(scene) {
    // Criando o plano
    const groundGeo = new THREE.PlaneGeometry(60, 60);
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

    const sideWallGeo = new THREE.PlaneGeometry(60, wallHeight);
    const leftWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
    leftWallMesh.position.set(-30, wallHeight / 2, 0);
    leftWallMesh.rotateY(Math.PI / 2);
    scene.add(leftWallMesh);

    const rightWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
    rightWallMesh.position.set(30, wallHeight / 2, 0);
    rightWallMesh.rotateY(Math.PI / 2);
    scene.add(rightWallMesh);

    const frontWallGeo = new THREE.PlaneGeometry(60, wallHeight);
    const frontWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
    frontWallMesh.position.set(0, wallHeight / 2, -30);
    scene.add(frontWallMesh);

    const backWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
    backWallMesh.position.set(0, wallHeight / 2, 30);
    scene.add(backWallMesh);

    return { groundMesh, leftWallMesh, rightWallMesh, frontWallMesh, backWallMesh };
}
