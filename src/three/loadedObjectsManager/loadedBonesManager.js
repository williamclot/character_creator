import {
    boneAttachmentRelationships,
    attachmentBones,
    bodyParts
} from './boneRelationships'

// import Anchor from './anchor';
import { Node } from './bodyPart';


/**
 * The scene will contain multiple body parts and each body part will contain
 * several 3D objects. Each body part will be attached to the bone of another
 * body part, thus forming a tree data structure.
 * 
 *  In the current implementation, the root of the data structure is the Torso
 * (specifically, the Hip bone inside the torso). the children of the torso are the
 * head, the arms and the legs. The head is attached to a bone from the torso.
 * 
 *  This class keeps track of all attachment bones and provides methods to
 * access and update these bones.
 */
class GroupManager {
    /**
     * @param {THREE.Group} group 
     */
    constructor(group) {
        this.group = group;

        // const entries = attachmentBones.map( boneName => [ boneName, new Node ] )
        
        /** 
         * Used to keep references to each body part using a Node object
         * @type {Map<string, Node>} 
         */
        this.bodyPartsMap = new Map();

    }

    /**
     * @param {string} key 
     * @param {THREE.Object3D} value - object to add
     */
    add( key, object ) {
        const newNode = new Node( object.name, object )
        this.bodyPartsMap.set( key, newNode );
    }

    /**
     * 
     * @param {string} key - body part to replace 
     * @param {THREE.Object3D} object - object to replace with
     * @param {Map<string, THREE.Bone>} attachBones
     */
    replace( key, objectToInsert, attachBones ) {
        const node = this.bodyPartsMap.get( key );
        if ( !node ) {
            return; // TODO handle node not defined
        }

        const oldObj = node.value;
        const parentObject = node.parent.value;
        
        parentObject.remove( oldObj );
        parentObject.add( objectToInsert );

        if ( !attachBones ) {
            attachBones = this.findAttachBones( objectToInsert );
        }

        attachBones.forEach( ( bone, k ) => {
            const currentBone = node.children.get( k );
            const childBoneName = boneAttachmentRelationships.child[ currentBone.name ];
            const childBone = node.children.get( childBoneName );
            bone.add( childBone.value );

        } );

    }

    /**
     * @param {THREE.Object3D} object
     */
    findAttachBones( object ) {
        /** @type {Map<string, THREE.Bone>} */
        const attachBones = new Map();

        object.traverse( obj => {
            if ( obj instanceof THREE.Bone ) {
                if ( attachmentBones.includes( obj.name  ) ) {
                    attachBones.set( obj.name, obj );
                }
            }
        } );

        return attachBones;
    }

    setParent( key, value ) {
        this.bodyPartsMap.get( key ).parent = value;
    }

    getParent( key ) {
        return this.bodyPartsMap.get( key ).parent;
    }

    /**
     * adding an object to this structure involves adding a value
     * inside a tree:
     * 
     * In order to attach an object at a position (defined by _parentKey_),
     * the object simply needs to be added to that parent.
     * 
     * If an object exists at the desired position, it has to be removed
     * before adding another one. When removing an object, if it has no children,
     * then it is simply removed and any reference to it is deleted.
     * If it has children, then a reference to the children should be kept before
     * removing it. TODO ...
     * 
     * @param {String} parentKey - the name of the bone
     * @param {THREE.Object3D} value - the 3D object to add
     */
    appendObject( parentKey, value ) {
        /** the parent and the child object currently attached to it */
        const anchor = this.getParent( parentKey );

        /** if there is a child object in memory, remove it from its parent */
        if ( anchor.child ) {
            anchor.parent.remove( anchor.child );
        }

        /** attach the value to the parent and then store a reference to
         * the value to know what to remove next time an object is added
         */
        if ( anchor.parent ) {
            anchor.parent.add( value );
        } else {
            this.group.add( value );
        }
        anchor.child = value;
    }
}

export default GroupManager;