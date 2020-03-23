import { PartType, PartTypeParent, Coord3d } from '../types';
import {
    Object3D,
    Vector3,
    Group,
    Color,
    Box3,
    Scene,
    Fog,
    PerspectiveCamera,
    WebGLRenderer,
    HemisphereLight,
    PointLight,
    GridHelper,
    Bone,
} from 'three';

import topologicalSort from 'toposort';

import OrbitControls from '../vendor/three/controls/orbit-controls';

const scene = new Scene();
scene.background = new Color(0xeeeeee);
scene.fog = new Fog(0xeeeeee, 1, 20);

const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.001,
    1000,
);

camera.position.set(0, 2, -4);

const renderer = new WebGLRenderer({
    antialias: true,
    // canvas: canvasElement
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // Configure renderer size

const hemi = new HemisphereLight(0xffffff, 0xffffff);

//Create a PointLight and turn on shadows for the light
const light = new PointLight(0xc1c1c1, 1, 100);
light.position.set(3, 10, 10);
light.castShadow = true;
//Set up shadow properties for the light
light.shadow.mapSize.width = 2048; // default
light.shadow.mapSize.height = 2048; // default
light.decay = 1;

// This light is here to show the details in the back (no shadows)
const backlight = new PointLight(0xc4b0ac, 1, 100);
backlight.position.set(0, 2, -20);

scene.add(hemi, light, backlight);

const size = 50;
const divisions = 60;

const gridHelper = new GridHelper(size, divisions);

scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(-1,0,0);
// controls.minDistance = 2; //Controling max and min for ease of use
// controls.maxDistance = 7;
// controls.minPolarAngle = 0;
// controls.maxPolarAngle = Math.PI / 2 - 0.1;
// controls.enablePan = false;
controls.enableKeys = false;

const renderScene = () => {
    renderer.render(scene, camera);
};

controls.addEventListener('change', () => {
    const isCameraAboveGround = camera.position.y >= 0;
    gridHelper.visible = isCameraAboveGround;

    renderScene();
});

const _container: Object3D = new Group();

scene.add(_container);

/**
 * returns a map from boneId to Bone containing only the registered bones
 */
function extractKnownBones(object3d: Object3D, knownBoneNames: string[]) {
    const knownBoneNamesSet = new Set(knownBoneNames);

    const extractedBones = new Map<string, Bone>();

    object3d.traverse(element => {
        if (element instanceof Bone) {
            if (knownBoneNamesSet.has(element.name)) {
                extractedBones.set(element.name, element);
            }
        }
    });

    return extractedBones;
}

/**
 * An object that holds a reference to a group of 3D objects (_container_).
 * It also needs the categories that define the structure of the objects
 * that need to be added.
 *
 * It provides methods to place and replace objects for a given category.
 *
 * 3D objects can be added as children of other 3D objects; therefore it is
 * possible to form a tree structure of 3D objects. The structure is defined
 * by the second argument (_categories_). Each category has a parent category
 * that can be followed until the root category is reached.
 *
 * When objects from a category are loaded, it is placed as a child of the
 * object from the parent category.
 */
class SceneManager {
    sortedCategoryIds: number[];
    rootCategory: PartType;
    categoriesMap: Map<number, PartType>;
    loadedObjectsMap: Map<number, Object3D>;
    bonesMap: Map<string, Bone>;

    initialize(categories: PartType[]) {
        const categoriesWithParent = categories.filter(cat => cat.parent);
        const edges = categoriesWithParent.map(({ id, parent }) => {
            const parentId = (parent as PartTypeParent).id;

            return [parentId, id];
        }) as ReadonlyArray<[number, number]>;

        /**
         * this will sort the categories in the correct order they have to be added;
         * since the categories are defined by the designer, they will be loaded via an api call
         * and thus could be sorted when uploading them instead of sorting them here
         */
        this.sortedCategoryIds = topologicalSort(edges);

        /**
         * could also be identified when uploading the categories
         */
        this.rootCategory = categories.find(
            category => category.parent === null,
        ) as PartType;

        /**
         * A mapping from category ID to category data
         * @type { Map<string, Category> }
         */
        this.categoriesMap = categories.reduce(
            (categoriesMap, category) =>
                categoriesMap.set(category.id, category),
            new Map(),
        );

        /**
         * @type { Map<string, Object3D> }
         * used to keep track of loaded objects
         */
        this.loadedObjectsMap = new Map();

        /**
         * @type { Map<string, Bone> }
         *  used to keep track of Bone objects within each loaded object
         *
         * Note: assumes bone names are unique
         */
        this.bonesMap = new Map();
    }

    getContainer() {
        _container;
    }

    getObject(key: number) {
        return this.loadedObjectsMap.get(key);
    }

    getObjectByAttachPoint(attachPointName: string) {
        const attachPoint = this.bonesMap.get(attachPointName);

        return attachPoint ? attachPoint.children[0] : null;
    }

    getParentObject(key: number) {
        const { parent } = this.categoriesMap.get(key) as PartType;

        if (!parent) return null;

        return this.loadedObjectsMap.get(parent.id) || null;
    }

    add(categoryKey: number, objectToAdd: Object3D) {
        if (!this.categoriesMap.has(categoryKey)) {
            throw new Error(`Category ${categoryKey} is not defined!`);
            // TODO handle this case (or make sure it can't happen)
        }

        const category = this.categoriesMap.get(categoryKey) as PartType;

        if (this.loadedObjectsMap.has(categoryKey)) {
            const currentObject = this.loadedObjectsMap.get(
                categoryKey,
            ) as Object3D;

            this.replace(category, currentObject, objectToAdd);
        } else {
            this.place(category, objectToAdd);
        }

        this.loadedObjectsMap.set(categoryKey, objectToAdd);
    }

    place(category: PartType, objectToAdd: Object3D) {
        const { attachPoints, parent } = category;

        const extractedBones = extractKnownBones(objectToAdd, attachPoints);

        for (const boneId of attachPoints) {
            const newBone = extractedBones.get(boneId) as Bone;

            this.bonesMap.set(boneId, newBone);
        }

        this.getParent(parent).add(objectToAdd);
    }

    replace(
        category: PartType,
        currentObject: Object3D,
        objectToAdd: Object3D,
    ) {
        const { attachPoints, parent } = category;

        const extractedBones = extractKnownBones(objectToAdd, attachPoints);

        for (const boneId of attachPoints) {
            const oldBone = this.bonesMap.get(boneId) as Bone;
            const newBone = extractedBones.get(boneId) as Bone;

            // update bonesMap to reference new bone
            this.bonesMap.set(boneId, newBone);

            // this will automatically move the children to their new bone parent
            newBone.add(...oldBone.children);
        }

        const parentObject = this.getParent(parent);

        parentObject.remove(currentObject);
        parentObject.add(objectToAdd);
    }

    /**
     * @returns - the parent bone of the category or the group if the category is the root
     */
    getParent(parentCategory?: PartTypeParent) {
        if (parentCategory) {
            const parentBone = this.bonesMap.get(parentCategory.attachPoint);
            if (!parentBone) {
                throw new Error(
                    `Bone with name ${parentCategory.attachPoint} not found!`,
                );
            }

            return parentBone;
        } else {
            return _container;
        }
    }
}

const sceneManager = new SceneManager();

export default {
    init(categories: PartType[]) {
        sceneManager.initialize(categories);
    },

    addAll(objectsByCategory: { [id: number]: Object3D }) {
        const keysToSearch = sceneManager.sortedCategoryIds;

        for (const key of keysToSearch) {
            if (key in objectsByCategory) {
                sceneManager.add(key, objectsByCategory[key]);
            }
        }
    },

    add(categoryKey: number, objectToAdd: Object3D) {
        sceneManager.add(categoryKey, objectToAdd);
    },

    getCanvas() {
        return renderer.domElement;
    },

    renderScene,

    rescaleContainerToFitObjects(fitOffset = 2) {
        const boundingBox = new Box3().setFromObject(_container);

        const size = boundingBox.getSize(new Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        // rescale to fit into view
        _container.scale.divideScalar(maxDimension / fitOffset);

        const newBoundingBox = new Box3().setFromObject(_container);

        // move container above grid
        _container.position.setY(_container.position.y - newBoundingBox.min.y);

        // look at container
        controls.target = _container.position.clone();
        controls.update();
    },

    getObject(key: number) {
        return sceneManager.getObject(key);
    },

    getObjectByAttachPoint(attachPointName: string) {
        return sceneManager.getObjectByAttachPoint(attachPointName);
    },

    getParentObject(key: number) {
        return sceneManager.getParentObject(key);
    },

    setContainerRotation(rotation: Coord3d) {
        _container.rotation.set(rotation.x, rotation.y, rotation.z);
    },

    setPanEnabled(enabled: boolean) {
        controls.enablePan = enabled;
    },

    saveCamera() {
        controls.saveState();
    },

    resetCamera() {
        controls.reset();
    },

    handleResize() {
        const { width, height } = renderer.domElement.getBoundingClientRect();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
        renderer.setPixelRatio(width / height);
    },
};
