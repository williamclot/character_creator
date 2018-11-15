import Anchor from './anchor';

class BodyPart {
    /**
     * @param {string} name
     * @param {Anchor} parentAnchor
     * @param {Map<string, Anchor>} childAnchors - keys are boneNames and values are Anchors
     */
    constructor(name, parentAnchor = null, childAnchors = new Map() ) {
        this.name = name;
        this.parentAnchor = parentAnchor;
        this.childAnchors = childAnchors;
    }
}

/**
 * Recursive data structure representing a tree Node
 */
export class Node {
    /**
     * @param {string} name
     * @param {THREE.Object3D} value
     * @param {Node} parent
     * @param {Map<string, Node>} children - keys are bone names (TODO: keys may not be necessary)
     */
    constructor(name, value, parent = null, children = new Map() ) {
        this.name = name;
        this.value = value;
        this.parent = parent;
        this.children = children;
    }
}

export default BodyPart;