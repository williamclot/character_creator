import { Matrix4, Object3D, Group, Bone } from 'three'

import defaultCategories from './categories'
import Category, { ParentCategory } from './category'

/**
 * 
 */
class GroupManager {
    /**
     * @param { Group } group
     */
    constructor( group, categories = defaultCategories ) {
        
        this.group = group

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


    add( categoryId, object3d, metaData = {} ) {
        if ( ! this.categoriesMap.has( categoryId ) ) {
            throw new Error( `Category ${ categoryId } is not defined!` )
        }

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

            return this.group

        }
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