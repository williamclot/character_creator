import { Matrix4, Vector3, Object3D, Group, Bone, Mesh, Material, Color, Box3 } from 'three'
import topologicalSort from 'toposort'

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
scene.fog = new THREE.Fog(0xeeeeee, 1, 20);

const camera = new THREE.PerspectiveCamera(
    75,
    (window.innerWidth / window.innerHeight),
    0.001,
    1000
);

camera.position.set(0, 2, -4);


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    // canvas: canvasElement
});

renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( window.innerWidth, window.innerHeight ); // Configure renderer size



const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(-1,0,0);
// controls.minDistance = 2; //Controling max and min for ease of use
// controls.maxDistance = 7;
// controls.minPolarAngle = 0;
// controls.maxPolarAngle = Math.PI / 2 - 0.1;
// controls.enablePan = false;
controls.enableKeys = false

const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight(0xc1c1c1, 1, 100);
light.position.set(3, 10, 10);
light.castShadow = true;
//Set up shadow properties for the light
light.shadow.mapSize.width = 2048; // default
light.shadow.mapSize.height = 2048; // default
light.decay = 1;

// This light is here to show the details in the back (no shadows)
const backlight = new THREE.PointLight(0xc4b0ac, 1, 100);
backlight.position.set(0, 2, -20);
backlight.penumbra = 2;

scene.add(hemi, light, backlight);


const size = 50;
const divisions = 60;

const gridHelper = new THREE.GridHelper(size, divisions);

scene.add(gridHelper);


const container = new Group;

scene.add(container);



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
const sceneManager = {
    container,

    initialize(categories) {

        const categoriesWithParent = categories.filter( cat => cat.parent )
        const edges = categoriesWithParent.map(
            ({ id, parent }) => [ parent.id, id ]
        )

        /**
         * this will sort the categories in the correct order they have to be added;
         * since the categories are defined by the designer, they will be loaded via an api call
         * and thus could be sorted when uploading them instead of sorting them here
         */
        this.sortedCategoryIds = topologicalSort( edges )


        /**
         * could also be identified when uploading the categories
         */
        this.rootCategory = categories.find( category => category.parent === null )

        /**
         * A mapping from category ID to category data
         * @type { Map<string, Category> }
         */
        this.categoriesMap = categories.reduce(
            ( categoriesMap, category ) => categoriesMap.set( category.id, category ),
            new Map
        )

        /**
         * @type { Map<string, Object3D> }
         * used to keep track of loaded objects
         */
        this.loadedObjectsMap = new Map

        /**
         * @type { Map<string, Bone> }
         *  used to keep track of Bone objects within each loaded object
         * 
         * Note: assumes bone names are unique
         */
        this.bonesMap = new Map;
    },


    getContainer() {
        return this.container
    },

    /**
     * @param { Object3D } container
     */
    setContainer( container ) {
        this.container = container
    },

    rescaleContainerToFitObjects( fitOffset = 2 ) {
        const boundingBox = new Box3().setFromObject( this.container )

        const size = boundingBox.getSize( new Vector3 )
        const maxDimension = Math.max( size.x, size.y, size.z )

        this.container.scale.divideScalar( maxDimension / fitOffset )
    },

    getObject( key ) {
        return this.loadedObjectsMap.get( key )
    },

    getObjectByAttachPoint( attachPointName ) {
        const attachPoint = this.bonesMap.get( attachPointName )

        return attachPoint ? attachPoint.children[ 0 ] : null
    },

    getParentObject( key ) {
        const { parent } = this.categoriesMap.get( key )

        if ( !parent ) return null

        return this.loadedObjectsMap.get( parent.id ) || null
    },


    add( categoryKey, objectToAdd, options = {} ) {

        if ( ! this.categoriesMap.has( categoryKey ) ) {

            throw new Error( `Category ${ categoryKey } is not defined!` )
            // TODO handle this case (or make sure it can't happen)

        }


        const category = this.categoriesMap.get( categoryKey )

        if ( this.loadedObjectsMap.has( categoryKey ) ) {

            const currentObject = this.loadedObjectsMap.get( categoryKey )

            this.replace( category, currentObject, objectToAdd )

        } else {

            this.place( category, objectToAdd )

        }
        
        this.loadedObjectsMap.set( categoryKey, objectToAdd )

    },

    /**
     * @param { Category } category 
     * @param { Object3D } objectToAdd 
     */
    place( category, objectToAdd ) {
        const { attachPoints, parent } = category

        const extractedBones = extractKnownBones( objectToAdd, attachPoints )

        for ( let boneId of attachPoints ) {

            const newBone = extractedBones.get( boneId )

            this.bonesMap.set( boneId, newBone )

        }

        this.getParent( parent ).add( objectToAdd )

    },

    /**
     * @param { Category } category 
     * @param { Object3D } objectToAdd 
     */
    replace( category, currentObject, objectToAdd ) {
        const { attachPoints, parent } = category

        const extractedBones = extractKnownBones( objectToAdd, attachPoints )

        for ( let boneId of attachPoints ) {

            const oldBone = this.bonesMap.get( boneId )
            const newBone = extractedBones.get( boneId )

            // update bonesMap to reference new bone
            this.bonesMap.set( boneId, newBone )

            // this will automatically move the children to their new bone parent
            newBone.add( ...oldBone.children )

        }
        
        const parentObject = this.getParent( parent )

        parentObject.remove( currentObject )
        parentObject.add( objectToAdd )
        
    },

    /**
     * @param { Category } parentCategory 
     * @returns - the parent bone of the category or the group if the category is the root
     */
    getParent( parentCategory ) {
        if ( parentCategory ) {
            const parentBone = this.bonesMap.get( parentCategory.attachPoint )
            if ( ! parentBone ) {
                throw new Error( `Bone with name ${ parentCategory.attachPoint } not found!` )
            } 

            return parentBone

        } else {

            return this.container

        }
    },
}



/**
 * returns a map from boneId to Bone containing only the registered bones
 * @param { Object3D } object3d
 * @param { Set< string > } knownBoneNames
 */
function extractKnownBones( object3d, knownBoneNames ) {

    const knownBoneNamesSet = knownBoneNames instanceof Set ? knownBoneNames : new Set( knownBoneNames )

    /** @type { Map< string, Bone > } */
    const extractedBones = new Map

    object3d.traverse( element => {
        if ( element.isBone && knownBoneNamesSet.has( element.name ) ) {
            extractedBones.set( element.name, element )
        }
    } )

    return extractedBones
}


const batchAdd = objectsByCategory => {
    const keysToSearch = sceneManager.sortedCategoryIds;
    
    for (const key of keysToSearch) {
        if(key in objectsByCategory) {
            sceneManager.add(key, objectsByCategory[key]);
        }
    }
}

const renderScene = () => {
    renderer.render(scene, camera);
};


controls.addEventListener( 'change', renderScene )


export default {
    init(categories) {
        sceneManager.initialize(categories);
    },
    addAll(objectsByCategory) {
        batchAdd(objectsByCategory);
    },
    add(categoryKey, objectToAdd) {
        sceneManager.add(categoryKey, objectToAdd);
    },
    getCanvas() {
        return renderer.domElement;
    },
    renderScene,
    rescaleContainerToFitObjects(fitOffset) {
        sceneManager.rescaleContainerToFitObjects(fitOffset);
    },

    getObject( key ) {
        return sceneManager.getObject(key);
    },

    getObjectByAttachPoint( attachPointName ) {
        return sceneManager.getObjectByAttachPoint(attachPointName);
    },
    
    getParentObject( key ) {
        return sceneManager.getParentObject(key);
    },
}

