export function clearPosition(item) {
    // This function is used to clear the position of an imported gltf file
    item.position.set(0, 0, 0);
}

export function rotateElement(item, rotation) {
    const { x, y, z } = rotation;
    item.rotation.set(x, y, z);
}

export function clearRotation(item) {
    item.rotation.set(0, 0, 0);
}


export function __validateStructure(model, mesh) {
    if ( model.name !== mesh.name ) {
        return false;
    }

    if ( model.children.length !== mesh.children.length ) {
        return false;
    }

    for( let i = 0, len = model.children.length; i < len; i++ ) {
        if ( !__validateStructure( model.children[ i ], mesh.children[ i ] ) ) {
            return false;
        }
    }

    return true;
}

export function __getStructure(mesh) {
    return {
        name: mesh.name,
        children: mesh.children.map(__getStructure)
    }
}
