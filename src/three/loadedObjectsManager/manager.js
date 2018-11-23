import { Matrix4 } from 'three'

import defaultCategories from './categories'

/**
 * 
 */
class GroupManager {
    constructor( group, categories = defaultCategories ) {
        this.group = group
        // this.categories = categories

        this.categoriesMap = categories.reduce(
            ( map, category ) => map.set( category.id, category ),
            new Map
        )

        /** mapping from categoryName to loadedObject (initially filled with null) */
        this.loadedObjectsMap = categories.reduce(
            ( map, category ) => map.set( category.id, null ),
            new Map
        )

        /**
         *  mapping from boneId to loadedObject (initially filled with null)
         * 
         * Note: assumes bone names are unique
         */
        this.bonesMap = categories.reduce(
            ( map, category ) => {
                const { attachmentBones } = category
                attachmentBones.forEach( boneId => map.set( boneId, null ) )
                return map
            },
            new Map
        )
    }

    getBone( boneId ) {
        return this.bonesMap.get( boneId )
    }

    setBone( boneId, value ) {
        this.bonesMap.set( boneId, value )
    }

    add( categoryId, object3d, metaData = {} ) {
        if ( ! this.categoriesMap.has( categoryId ) ) {
            throw new Error( `Category ${categoryId} is not defined!` )
        }

        
        const currentObject = this.loadedObjectsMap.get( categoryId )
        
        const newBonesMap = this.getBonesMap( object3d )
        if ( currentObject ) {
            this.replace( categoryId, object3d, newBonesMap )
        } else {
            this.place( categoryId, object3d )
        }
        
        // this.extractBones( object3d )
        this.updateBones( newBonesMap )
        this.loadedObjectsMap.set( categoryId, object3d )

    }

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

    place( categoryId, object3d ) {

        const category = this.categoriesMap.get( categoryId )

        this.getParent( category.parent ).add( object3d )

    }

    replace( categoryId, object3d, bonesMap ) {

        const category = this.categoriesMap.get( categoryId )

        category.attachmentBones.forEach( boneId => {
            const oldBone = this.bonesMap.get( boneId )
            const newBone = bonesMap.get( boneId )

            // this will automatically move the children to their new parent
            newBone.add( oldBone.children )
        } )
        
        const parent = this.getParent( category.parent )
        // TODO
        // remove current obj from parent

        // then add new object to parent
        
    }

    /**
     * traverses the object and adds all sets all bones that are in the bonesMap;
     * if the bone is not in the map, it is ignored
     * @param {THREE.Object3D} object3d 
     */
    extractBones( object3d ) {
        object3d.traverse( element => {
            if ( element.isBone ) {
                if ( this.bonesMap.has( element.name ) ) {
                    this.bonesMap.set( element.name, element )
                }
            }
        } )
    }

    updateBones( newBonesMap ) {
        newBonesMap.forEach(
            ( value, key ) => {
                this.bonesMap.set( key, value )
            }
        )
    }

    getBonesMap( object3d ) {
        const map = new Map

        object3d.traverse( element => {
            if ( element.isBone ) {
                if ( this.bonesMap.has( element.name ) ) {
                    map.set( element.name, element )
                }
            }
        } )

        return map
    }

    getCategoryById( id ) {
        return this.categoriesMap.get( id )
    }

    log( id ) {
        // if ( typeof id === "string" ) {
        //     const found = this.categories.find( c => c.id === id )
        //     console.log( found )
        // } else {
        //     console.log( this.categories )
        // }

        console.log("categories:", this.categoriesMap )
        console.log("loadedBones:", this.bonesMap )
        console.log("loadedObjects:", this.loadedObjectsMap )
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

export default GroupManager 