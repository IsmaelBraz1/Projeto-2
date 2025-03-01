import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { color } from 'three/tsl';


const cubes = [];
const cubeBodies = [];
let objectsCena = [];
let objectsFisic = [];
let objDinaMesh = [];
let objDinaBodies = [];
var roda;
var rodaBody;
let plate;
let plateBody;
let platedirec = 1;

export function createStructure2(scene, world) {


// Criando a estante
const shelf1 = criarEstante(0, 3, 5, 50, 0.5, 2, scene, world, 4);

criarPecas(scene, world);

    return { cubes, cubeBodies, objDinaMesh, objDinaBodies };
 
}

// Função para criar uma estante
function criarEstante(x, y, z, width, height, depth,scene,world, quant) {

    for(var i = 0; i<quant; i++){
    // Geometria 3D (forma visual)
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Cor marrom
    const shelf = new THREE.Mesh(geometry, material);
    shelf.position.set(x, y+(i*3), z);
    scene.add(shelf);

    // Corpo físico (Cannon.js)
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
        mass: 0, // Mass 0 significa que não será afetado pela gravidade
        position: new CANNON.Vec3(x, y+(i*3), z)
    });
    body.addShape(shape);
    world.addBody(body);
    body.linearDamping = 0;
    
    objectsCena.push(shelf);
    objectsFisic.push(body);

    criarobjetos(y+(i*3), world, scene);
}

const colun = [(width / 2),(width / 4),-(width / 4),-(width / 2)];
 for(var i = 0; i<4; i++){
    // Geometria 3D (forma visual)
    const geometry = new THREE.BoxGeometry(height, quant*(3.5), depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Cor marrom
    const shelf = new THREE.Mesh(geometry, material);
    shelf.position.set(colun[i], (quant-1)*(1.75), z);
    scene.add(shelf);

    // Corpo físico (Cannon.js)
    const shape = new CANNON.Box(new CANNON.Vec3(height , quant*(3.5) / 2, depth / 2));
    const body = new CANNON.Body({
        mass: 0, // Mass 0 significa que não será afetado pela gravidade
        position: new CANNON.Vec3(colun[i], (quant-1)*(1.75), z)
    });
    
    body.addShape(shape);
    world.addBody(body);

    objectsCena.push(shelf);
    objectsFisic.push(body);
}


    // Geometria 3D (forma visual)
    const geometry = new THREE.BoxGeometry(12.5, 12, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Cor marrom
    const shelf = new THREE.Mesh(geometry, material);
    shelf.position.set(19,6.5, z);
    scene.add(shelf);

    // Corpo físico (Cannon.js)
    const shape = new CANNON.Box(new CANNON.Vec3(6.3 , 12 / 2, 3 / 2));
    const body = new CANNON.Body({
        mass: 0, // Mass 0 significa que não será afetado pela gravidade
        position: new CANNON.Vec3(19,6.5, z)
    });
    
    body.addShape(shape);
    world.addBody(body);

    objectsCena.push(shelf);
    objectsFisic.push(body);

    
}

function criarobjetos(alturay, world,scene ){
    
    // Crie um material padrão com fricção
    const defaultMaterial = new CANNON.Material("defaultMaterial");
    const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 2,  // Ajuste o valor de fricção conforme necessário
        restitution: 0.0
    });
    world.addContactMaterial(contactMaterial);

    var tamx;
    var tamy;
    var tamz;
    var color;
        for (let j = 0; j < 10; j++) {
            var num = Math.random()*3;
           console.log(num);
            if(num <=1){
                tamx=tamy=tamz=1.5;
                color = {color: 0xff0f00};
            }else{
                if(num <= 2){
                    tamx=3;
                    tamy=2;
                    tamz=1;
                    color = {color: 0xffaa00};
                }else{
                    tamx=0.7;
                    tamy=2.3;
                    tamz=1;
                    color = {color: 0xff0077};
                }
            }

            const cubeGeometry = new THREE.BoxGeometry(tamx,tamy, tamz);
            const cubeMaterial = new THREE.MeshBasicMaterial(color);
            const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.set((j*3.7)-22, alturay+1.3, 5);
            scene.add(cubeMesh);
            cubes.push(cubeMesh);

            const cubeShape = new CANNON.Box(new CANNON.Vec3(tamx / 2, tamy / 2, tamz / 2));
            const cubeBody = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3((j*3.7)-22, alturay+1.3, 5),
                shape: cubeShape,
                material: defaultMaterial
            });
            cubeBody.linearDamping = 0;
            world.addBody(cubeBody);
            cubeBodies.push(cubeBody);

            
    objectsCena.push(cubeMesh);
    objectsFisic.push(cubeBody);

            // Log para depuração
            console.log('Cube created:', { cubeMesh, cubeBody });
        }
    
}

export function remove2(scene, world){
    for(var i = 0; i <= objectsCena.length; i++){
        scene.remove(objectsCena[i]);
    }
    for(var i = 0; i <= objectsFisic.length; i++){
        world.removeBody(objectsFisic[i]);
    }
}
function criarPecas(scene, world){
    const rodageo = new THREE.CylinderGeometry(5,1,1);
    const rodatext = new THREE.MeshBasicMaterial({color: 0x8B4513});
    roda = new THREE.Mesh(rodageo,rodatext);
    roda.rotation.x = Math.PI / 2;
    roda.position.set(20,6.5,3);
    scene.add(roda);

    const rodaShape = new CANNON.Cylinder(4.5,4.5,0.6);
    rodaBody = new CANNON.Body({
        mass: 0.1,
        position: new CANNON.Vec3(20,6.5,3),
        
    })
    rodaBody.addShape(rodaShape);
    rodaBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    world.addBody(rodaBody);

    const platego = new THREE.BoxGeometry(12.5,3,0.2);
    const plamat = new THREE.MeshBasicMaterial({color: 0x8B4513});
    plate = new THREE.Mesh(platego, plamat);
    plate.position.set(-18,0,2);
    scene.add(plate);
    const plateshape = new CANNON.Box(new CANNON.Vec3(10,2,0.2));
    plateBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(-18,0,2),
    });
    plateBody.addShape(plateshape);
    world.addBody(plateBody); 

    ObjectsnoCirculo(5,10,scene,world,roda);
    
    
    objectsCena.push(roda);
    objectsFisic.push(rodaBody);

    objectsCena.push(plate);
    objectsFisic.push(plateBody);

}

export function moviPecas(){
    roda.rotation.y += 0.01;
    rodaBody.position.copy(roda.position);
    rodaBody.quaternion.copy(roda.quaternion);
    if(plate.position.y>15){
        platedirec = -1;
    }
    if(plate.position.y<1){
        platedirec = 1;
    }
    plate.position.y += 0.3*platedirec;
    plateBody.position.copy(plate.position);
    plate.quaternion.copy(plate.quaternion);
}

function ObjectsnoCirculo(radius, numObjects, scene, world, centro) {
    const angleStep = (2 * Math.PI) / numObjects; // Passo angular entre cada objeto

    for (let i = 0; i < numObjects; i++) {
        const angle = i * angleStep; // Ângulo para o objeto atual

        // Calcular a posição do objeto
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        
        const cubeGeometry = new THREE.BoxGeometry(1.3, 1.3, 1.5);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const objectMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        objectMesh.position.set(x, 0, z);
        scene.add(objectMesh);
        centro.add(objectMesh);
        objDinaMesh.push(objectMesh);

        // Criar corpo físico com dimensões corretas
        const cubeShape = new CANNON.Box(new CANNON.Vec3(1.3 / 2, 1.3 / 2, 1.5 / 2));
        const objectBody = new CANNON.Body({
            mass: 1, // Ajuste a massa conforme necessário
            position: new CANNON.Vec3(x, 0, z),
            shape: cubeShape
        });
        objectBody.quaternion.copy(objectMesh.quaternion); // Copiar orientação
        world.addBody(objectBody);
        objDinaBodies.push(objectBody);
        
        objectsCena.push(objectMesh);
        objectsFisic.push(objectBody);
    }
}
