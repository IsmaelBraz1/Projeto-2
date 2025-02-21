import * as CANNON from 'cannon-es';

export function setupPhysics() {
    const world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    });

    const groundBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        mass: 0
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    return { world, groundBody };
}
