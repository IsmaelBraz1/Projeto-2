import * as THREE from 'three';

export function createCenario(scene) {
    // Criando o loader de textura
    const textureLoader = new THREE.TextureLoader();
    
    // Carregar a textura do céu (paredes e teto)
    const wallTexture = textureLoader.load(
        "/textura/noite.jpg", // Certifique-se de que a textura está no caminho correto
        () => console.log("✅ Textura do céu carregada!"),
        undefined,
        () => console.error("❌ Erro ao carregar a textura do céu!")
    );

    // Permitir repetição da textura para cobrir as paredes e teto
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(2, 1); // Ajuste conforme necessário

    // Criando o material para as paredes e teto
    const wallMaterial = new THREE.MeshBasicMaterial({
        map: wallTexture,
        side: THREE.DoubleSide
    });

    const wallHeight = 20;
    const wallWidth = 60;

    // Criando as paredes
    const sideWallGeo = new THREE.PlaneGeometry(wallWidth, wallHeight);
    const leftWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
    leftWallMesh.position.set(-30, wallHeight / 2, 0);
    leftWallMesh.rotateY(Math.PI / 2);
    scene.add(leftWallMesh);

    const rightWallMesh = new THREE.Mesh(sideWallGeo, wallMaterial);
    rightWallMesh.position.set(30, wallHeight / 2, 0);
    rightWallMesh.rotateY(Math.PI / 2);
    scene.add(rightWallMesh);

    const frontWallGeo = new THREE.PlaneGeometry(wallWidth, wallHeight);
    const frontWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
    frontWallMesh.position.set(0, wallHeight / 2, -30);
    scene.add(frontWallMesh);

    const backWallMesh = new THREE.Mesh(frontWallGeo, wallMaterial);
    backWallMesh.position.set(0, wallHeight / 2, 30);
    scene.add(backWallMesh);

    // Criando o teto
    const ceilingGeo = new THREE.PlaneGeometry(wallWidth, wallWidth);
    const ceilingMesh = new THREE.Mesh(ceilingGeo, wallMaterial);
    ceilingMesh.position.set(0, wallHeight, 0); // Posicionando no topo
    ceilingMesh.rotation.x = Math.PI / 2; // Girando para ficar na horizontal
    scene.add(ceilingMesh);

    // Criando o piso com uma textura repetida
    const floorTexture = textureLoader.load(
        "/textura/chao.jpg",
        () => console.log("✅ Textura do piso carregada!"),
        undefined,
        () => console.error("❌ Erro ao carregar a textura do piso!")
    );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5, 5);

    const groundMat = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    const groundGeo = new THREE.PlaneGeometry(wallWidth, wallWidth);
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    // Adicionando iluminação se usar MeshStandardMaterial
    if (groundMat instanceof THREE.MeshStandardMaterial) {
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(10, 20, 10);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
    }

    return { groundMesh, ceilingMesh, leftWallMesh, rightWallMesh, frontWallMesh, backWallMesh };
}
