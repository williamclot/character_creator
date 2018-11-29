import { Matrix4, Object3D, Group, Bone, Mesh, Material, Color } from 'three'

import { loadMeshFromURL, parseMesh } from '../util/gltfLoader'
import { GRAY } from '../util/colours'

import { Category, ParentCategory, STAND_SYMBOL } from '../util/category/category'
import { findMinGeometry } from './FindMinGeometry'

async function loadObject( url ) {

    const gltf = await loadMeshFromURL( url )

    return gltf.scene.children[ 0 ] // returns first element found in the scene

}

/**
 * 
 */
class GroupManager {
    /**
     * @param { Group } group
     */
    constructor( group, categories ) {
        
        this.group = group
        this.stand = null

        this.rootCategory = categories.find( category => category.parent === null )

        /**
         * A mapping from category ID to category data
         * @type { Map< string, Category > }
         */
        this.categoriesMap = categories.reduce(
            ( categoriesMap, category ) => categoriesMap.set( category.id, category ),
            new Map
        )

        /**
         * @type { Map< string, Object3D > }
         * used to keep track of loaded objects
         */
        this.loadedObjectsMap = new Map

        /**
         * @type { Map< string, Bone > }
         *  used to keep track of Bone objects within each loaded object
         * 
         * Note: assumes bone names are unique
         */
        this.bonesMap = new Map;
    }

    /**
     * lib is a js object with values of type LibraryItem (as defind in oldLibrary/__LibItemType.ts)
     * 
     * it has a special unique property (the STAND_SYMBOL) that holds the info for the stand;
     * this ensured that the stand property cannot be overwritten by a different property
     * with the same key (because a symbol is globally unique)
     * @param { Object.< string, LibraryItem > } lib
     */
    async addAll( lib ) {

        const standLibItem = lib[ STAND_SYMBOL ]

        if ( standLibItem ) {

            const stand = await loadObject( standLibItem.url )

            this.placeStand( stand, standLibItem.metadata )

        }

        const topologicallySortedCategoryKeys = [] // TODO category names in topological order (categories should be a DAG)

        for ( let key of topologicallySortedCategoryKeys ) {

            const libItem = lib[ key ]

            if ( libItem ) {

                const object = await loadObject( libItem.url )
                
                this.add( key, object, metadata )

            }
        }

    }

    placeStand( newStand, options = {} ) {

        newStand.traverse( child => {
            if ( child instanceof Mesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.color){
                    child.material.color.set( GRAY )
                }
            }
        } );

        // stand processed successfully;
        // code below actually adds stand to scene and updates its reference in group manager
        
        const rootCategoryId = this.rootCategory.id        
        
        if ( this.stand ) {
            this.group.remove( this.stand )
        }
        
        this.group.add( newStand )
        
        this.stand = newStand
        
        const rootObj = this.loadedObjectsMap.get( rootCategoryId )
        
        if ( rootObj ) {

            // adding an object will remove it from the previous parent
            newStand.add( rootObj )
            
            const minGeometry = findMinGeometry( rootObj )
            const currentY = rootObj.position.y
            rootObj.position.setY( currentY - minGeometry )

        }
    }


    add( categoryId, object3d, options = {} ) {

        if ( ! this.categoriesMap.has( categoryId ) ) {

            throw new Error( `Category ${ categoryId } is not defined!` )
            // TODO handle this case (or make sure it can't happen)

        }


        const {
            rotation,
            position,
            scale,
            poseData
        } = options

        object3d.traverse(function(child) {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.material.color.set( GRAY );
            }
        });

        if (poseData) {
            object3d.traverse(child => {
                if (child instanceof Bone) {
                    const rotation = poseData[child.name];
                    if (rotation) {
                        const { x, y, z } = rotation;
                        child.rotation.set(x, y, z);
                    }
                }
            });
        }

        // object3d processed sucessfully;
        // code below actually adds object to scene and updates references in group manager

        const category = this.categoriesMap.get( categoryId )

        if ( this.loadedObjectsMap.has( categoryId ) ) {

            const currentObject = this.loadedObjectsMap.get( categoryId )

            this.replace( category, currentObject, object3d, metaData )

        } else {

            this.place( category, object3d, metaData )

        }
        
        this.loadedObjectsMap.set( categoryId, object3d )

    }

    /**
     * @param { Category } category 
     * @param { Object3D } object3d 
     */
    place( category, object3d ) {
        const { attachmentBones, parent } = category

        const extractedBones = extractKnownBones( object3d, attachmentBones )

        for ( let boneId of attachmentBones ) {

            const newBone = extractedBones.get( boneId )

            this.bonesMap.set( boneId, newBone )

        }

        this.getParent( parent ).add( object3d )

    }

    /**
     * @param { Category } category 
     * @param { Object3D } object3d 
     */
    replace( category, currentObject, object3d ) {
        const { attachmentBones, parent } = category

        const extractedBones = extractKnownBones( object3d, attachmentBones )

        for ( let boneId of attachmentBones ) {

            const oldBone = this.bonesMap.get( boneId )
            const newBone = extractedBones.get( boneId )

            // update bonesMap to reference new bone
            this.bonesMap.set( boneId, newBone )

            // this will automatically move the children to their new bone parent
            newBone.add( ...oldBone.children )

        }
        
        const parentObject = this.getParent( parent )

        parentObject.remove( currentObject )
        parentObject.add( object3d )
        
    }

    /**
     * @param { ParentCategory } parentCategory 
     * @returns - the parent bone of the category or the group if the category is the root
     */
    getParent( parentCategory ) {
        if ( parentCategory ) {
            const parentBone = this.bonesMap.get( parentCategory.boneName )
            if ( ! parentBone ) {
                throw new Error( `Bone with name ${ parentCategory.boneName } not found!` )
            } 

            return parentBone

        } else {

            if ( ! this.stand ) {
                throw new Error( `You first need to place a stand before adding objects` )
            }

            return this.stand

        }
    }

    resetStand() {

        const rootCategoryId = this.rootCategory.id

        const rootObj = this.loadedObjectsMap.get( rootCategoryId )
        
        if ( rootObj ) {
            
            const minGeometry = findMinGeometry( rootObj )
            const currentY = rootObj.position.y
            rootObj.position.setY( currentY - minGeometry )

        }

    }

    /**
     * @param { Object3D } object3d
     * @param { Color } newColour
     */
    _setColour( object3d, newColour ) {

        object3d.traverse( child  => {

            if ( child instanceof Mesh ) {
                const { material } = child
                if (
                    material instanceof Material &&
                    material.color instanceof Color
                ) {
                    material.color.set( newColour )
                }
            }

        } )

    }

    /**
     * @param { string } categoryId
     * @param { Color } newColour
     */
    changeColour( categoryId, newColour ) {
        
        if ( ! this.loadedObjectsMap.has( categoryId ) ) { return }

        const object3d = this.loadedObjectsMap.get( categoryId )

        this._setColour( object3d, newColour )

    }

    changeStandColour( newColour ) {

        if ( ! this.stand ) { return }

        this._setColour( this.stand, newColour )

    }

    changePoseColour( newColour ) {

        this._setColour( this.group, newColour )

    }
}

/** 
 * this is not used, but might be needed when adding an object to the scene
 * https://github.com/mrdoob/three.js/blob/master/examples/js/utils/SceneUtils.js#L29
 */
function getChildWithCorrectMatrixWorld( child, parent ) {

    child.applyMatrix( new Matrix4().getInverse( parent.matrixWorld ) )

    return child
}


/**
 * returns a map from boneId to Bone containing only the registered bones
 * @param { Object3D } object3d
 * @param { Set< string > } knownBoneNames
 */
function extractKnownBones( object3d, knownBoneNames ) {

    /** @type { Map< string, Bone > } */
    const extractedBones = new Map

    object3d.traverse( element => {
        if ( element.isBone && knownBoneNames.has( element.name ) ) {
            extractedBones.set( element.name, element )
        }
    } )

    return extractedBones
}

export default GroupManager 