export function clearPosition(item) {
    // This function is used to clear the position of an imported gltf file
    item.position.set(0, 0, 0);
}

export function rotateElement(item, clearRotation, rotation) {
    if (clearRotation === true) {
        item.rotation.set(0,0,0);
    } else {
        const { x, y, z } = rotation;
        item.rotation.set(x, y, z);
    }
}