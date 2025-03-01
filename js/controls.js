export function setupControls(camera, baseMesh, cylinderMesh) {
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    document.addEventListener('keydown', (event) => {
        keys[event.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key.toLowerCase()] = false;
    });

    function updateControls() {
        if (keys.w) {
            cylinderMesh.rotation.x -= 0.01;
        }
        if (keys.s) {
            cylinderMesh.rotation.x += 0.01;
        }
        if (keys.a) {
            cylinderMesh.position.x += 0.09;
            baseMesh.position.x += 0.09;
            camera.position.x += 0.09;
        }
        if (keys.d) {
            cylinderMesh.position.x -= 0.09;
            baseMesh.position.x -= 0.09;
            camera.position.x -= 0.09;

        }
    }

    return updateControls;
}
export function reset(camera, baseMesh, cylinderMesh){

    function resetControls(){
        baseMesh.position.set(0, 1, -16);
        cylinderMesh.position.set(0, 3, -16);
        cylinderMesh.rotation.x = (Math.PI / 3);
        camera.position.set(0, 7, -20);
    }
    
    return resetControls;
}