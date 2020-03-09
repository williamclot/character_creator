// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Object3D, Bone, Group, Mesh, MeshStandardMaterial } from 'three';

import { stlLoader, plyLoader } from './loaders';

function createBone(name, position, rotation) {
    const { x, y, z } = position;

    const bone = new Bone();
    bone.name = name;
    bone.position.set(x, y, z);

    if (rotation) {
        const { x, y, z } = rotation;
        bone.rotation.set(x, y, z);
    }

    return bone;
}

export const getObjectFromGeometry = (geometry, metadata, poseData) => {
    geometry.computeVertexNormals();

    const material = new MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.5,
        roughness: 0.5,
    });

    const mesh = new Mesh(geometry, material);

    const objectContainer = new Group();
    objectContainer.add(mesh);

    const root = new Group();
    root.add(objectContainer);

    if (metadata) {
        const { position, rotation, scale, attachPoints } = metadata;

        if (position) {
            const { x, y, z } = position;
            mesh.position.set(x, y, z);
        }

        // TODO rotation and scale set to parent !!!!
        if (rotation) {
            const { x, y, z } = rotation;
            objectContainer.rotation.set(x, y, z);
        }

        if (scale) {
            // scale is number; applies on all axis
            objectContainer.scale.setScalar(scale);
        }

        if (attachPoints) {
            for (const [attachPointName, position] of Object.entries(
                attachPoints,
            )) {
                const rotation = poseData && poseData[attachPointName];
                root.add(createBone(attachPointName, position, rotation));
            }
        }

        root.userData.metadata = metadata;
        objectContainer.userData.metadata = metadata;
    }

    return root;
};

/**
 * @param { ObjectData } objectData
 * @param {{ [key: string]: Rotation }} poseData
 * @returns { Promise<Object3D> }
 */
export const get3DObject = async (objectData, poseData) => {
    // const file = objectData.files.viewer || objectData.files.default
    const file = objectData.files.default;

    switch (file.extension) {
        case 'ply': {
            const geometry = await plyLoader.load(file.url);
            return getObjectFromGeometry(
                geometry,
                objectData.metadata,
                poseData,
            );
        }

        case 'stl': {
            const geometry = await stlLoader.load(file.url);
            return getObjectFromGeometry(
                geometry,
                objectData.metadata,
                poseData,
            );
        }

        /*
        case 'gltf': 
        case 'glb': {
            const resource = await gltfLoader.load( file.url )
            const root = resource.scene.children[ 0 ]

            if ( poseData ) {
                root.traverse( bone => {
                    if ( bone.isBone ) {
                        const rotation = poseData[ bone.name ]

                        if ( rotation ) {
                            const { x, y, z } = rotation
                            bone.rotation.set( x, y, z )
                        }
                    }
                } )

            }

            return root
        }
        */

        default: {
            throw new Error(`Extension '${file.extension}' not recognized.`);
        }
    }
};

/**
 * @param {{ [key: string]: ObjectData }} objectsData - dictionary with values
 * containing the name, download url and extension type of 3d objects
 */
export const fetchObjects = async objectsData => {
    /** @type {{ [key: string]: Object3D }} */
    const objectsToReturn = {};

    const keys = Object.keys(objectsData);

    const promises = keys.map(async key => {
        const object = await get3DObject(objectsData[key]);

        objectsToReturn[key] = object;
    });

    await Promise.all(promises);

    return objectsToReturn;
};

/**
 * @typedef {{ name: string, download_url: string, extension: string }} ObjectData
 * object with the name, download url and extension type of a 3d object
 *
 * @typedef {{ x: number, y: number, z: number }} Rotation
 */
