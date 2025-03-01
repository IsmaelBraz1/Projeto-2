import * as THREE from 'three';
let score = 0; // Inicializa a pontuação

// Função para atualizar e exibir a pontuação
function updateScore(points) {
    score += points;
    document.getElementById('score').innerText = `Pontuação: ${score}`;
}

// Função para criar uma explosão na posição especificada e adicionar ao cenário
export function createExplosion(position, scene) {
    // Cria a geometria do sistema de partículas
    const particles = new THREE.BufferGeometry();
    const particleCount = 1000; // Número de partículas
    const positions = new Float32Array(particleCount * 3); // Array para posições das partículas
    const velocities = new Float32Array(particleCount * 3); // Array para velocidades das partículas

    // Inicializa as posições e velocidades das partículas
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2; // Ângulo aleatório para direção horizontal
        const speed = Math.random() * 2; // Velocidade aleatória

        const vx = Math.cos(angle) * speed; // Velocidade x
        const vy = Math.sin(angle) * speed; // Velocidade y
        const vz = (Math.random() - 0.5) * 2; // Velocidade z

        // Define a posição inicial das partículas como a posição da explosão
        positions[i * 3] = position.x;
        positions[i * 3 + 1] = position.y;
        positions[i * 3 + 2] = position.z;

        // Define a velocidade inicial das partículas
        velocities[i * 3] = vx;
        velocities[i * 3 + 1] = vy;
        velocities[i * 3 + 2] = vz;
    }

    // Define os atributos da geometria de partículas
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Cria o material das partículas
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff0000, // Cor das partículas (vermelho)
        size: 0.09, // Tamanho das partículas
        blending: THREE.AdditiveBlending, // Tipo de blend
        transparent: true, // Partículas transparentes
    });

    // Cria o sistema de partículas e adiciona ao cenário
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Função para animar as partículas
    function animateParticles() {
        const positions = particles.attributes.position.array;
        const velocities = particles.attributes.velocity.array;

        // Atualiza a posição e velocidade das partículas
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3] * 0.1;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.1;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.1;

            velocities[i * 3] *= 0.95; // Reduz a velocidade x
            velocities[i * 3 + 1] *= 0.95; // Reduz a velocidade y
            velocities[i * 3 + 2] *= 0.95; // Reduz a velocidade z
        }

        // Marca os atributos de posição como necessitando de atualização
        particles.attributes.position.needsUpdate = true;
    }

    // Define o intervalo para animação das partículas (aproximadamente 60 FPS)
    const interval = setInterval(animateParticles, 16);

    // Remove o sistema de partículas após 2 segundos
    setTimeout(() => {
        clearInterval(interval); // Limpa o intervalo de animação
        scene.remove(particleSystem); // Remove o sistema de partículas do cenário
    }, 1000); // Remove após 2 segundos
    updateScore(10);// Atualiza a pontuação
    return particleSystem; // Retorna o sistema de partículas
}

export function resetScore(){
    score = 0;
    document.getElementById('score').innerText = `Pontuação: ${0}`;
}