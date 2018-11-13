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
class Manager {
    constructor(group) {
        this.group = group;

        /**
         * Keys are the names of the anchor bones;
         * Values are objects with parent and child attributes:
         *  > parent: reference to bone inside scene
         *  > child: reference to 3D Object inside parent bone
         */
        this.loadedAttachmentBones = {
            "ArmL_Hand_L"     : {},
            "ArmR_Hand_R"     : {},
            "LegL_Foot_L"     : {},
            "LegR_Foot_R"     : {},
            "Torso_Neck"      : {},
            "Torso_UpperArm_L": {},
            "Torso_UpperArm_R": {},
            "Torso_UpperLeg_L": {},
            "Torso_UpperLeg_R": {},
        };
    }

    setParent( key, value ) {
        this.loadedAttachmentBones[ key ].parent = value;
    }

    getParent( key ) {
        return this.loadedAttachmentBones[ key ].parent;
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

export default Manager;