class Anchor {
    /**
     * acts as a Tree data structure
     * @param {THREE.Bone} parent - reference to bone inside scene
     * @param {THREE.Object3D} child - reference to 3D Object inside parent bone
     */
    constructor( parent = null, child = null ) {
        this.parent = parent;
        this.child = child;
    }

    setParent( parent ) {
        this.parent = parent;
    }

    setChild( child ) {
        this.child = child;
    }
}

export default Anchor;