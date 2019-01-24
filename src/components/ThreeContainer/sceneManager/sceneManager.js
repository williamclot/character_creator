import { Matrix4, Object3D, Group, Bone, Mesh, Material, Color } from 'three'
import topologicalSort from 'toposort'

import { GRAY } from '../util/colours'



/**
 * 
 */
class SceneManager {
    /**
     * @param { Object3D } container
     * @param { { name: string, attachPoints: string[], parent?: { name: string, attachPoint: string } } } categories
     */
    constructor( container, categories ) {
        
        this.container = container
        this.stand = null


        const categoriesWithParent = categories.filter( cat => cat.parent )
        const edges = categoriesWithParent.map(
            ({ name, parent }) => [ parent.name, name ]
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
         * @type { Map< string, Category > }
         */
        this.categoriesMap = categories.reduce(
            ( categoriesMap, category ) => categoriesMap.set( category.name, category ),
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

            const stand = await loadObject( standLibItem )

            this.placeStand( stand, standLibItem.metadata )

        }

        // TODO could use Promise.all since order is known
        for ( let key of this.sortedCategoryIds ) {

            const libItem = lib[ key ]

            if ( libItem ) {

                const object = await loadObject( libItem )
                
                this.add( key, object, libItem.metadata )

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
            this.container.remove( this.stand )
        }
        
        this.container.add( newStand )
        
        this.stand = newStand
        
        const rootObj = this.loadedObjectsMap.get( rootCategoryId )
        
        if ( rootObj ) {

            // adding an object will remove it from the previous parent
            newStand.add( rootObj )

            // TODO only calculate minGeometry after loading all objects (in addAll)
            
            const minGeometry = findMinGeometry( rootObj )
            const currentY = rootObj.position.y
            rootObj.position.setY( currentY - minGeometry )

        }
    }


    add( categoryKey, objectToAdd, options = {} ) {

        if ( ! this.categoriesMap.has( categoryKey ) ) {

            throw new Error( `Category ${ categoryKey } is not defined!` )
            // TODO handle this case (or make sure it can't happen)

        }


        const {
            rotation,
            position,
            scale,
            poseData
        } = options

        objectToAdd.traverse(function(child) {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.material.color.set( GRAY );
            }
        });

        if (poseData) {
            objectToAdd.traverse(child => {
                if (child instanceof Bone) {
                    const rotation = poseData[child.name];
                    if (rotation) {
                        const { x, y, z } = rotation;
                        child.rotation.set(x, y, z);
                    }
                }
            });
        }

        // objectToAdd processed sucessfully;
        // code below actually adds object to scene and updates references in group manager

        const category = this.categoriesMap.get( categoryKey )

        if ( this.loadedObjectsMap.has( categoryKey ) ) {

            const currentObject = this.loadedObjectsMap.get( categoryKey )

            this.replace( category, currentObject, objectToAdd )

        } else {

            this.place( category, objectToAdd )

        }
        
        this.loadedObjectsMap.set( categoryKey, objectToAdd )

    }

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

    }

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

        this._setColour( this.container, newColour )

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

export default SceneManager 