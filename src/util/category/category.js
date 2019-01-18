export const STAND_SYMBOL = Symbol( 'stand' )

class AttachPoint {
    /**
     * will create a simple js object representing where a 3D object should be attached
     * @param { string } typeId             - the object type that contains the attachment point;
     *                                      this is useful if we want to get the topological order
     *                                      of adding objects to the scene, but otherwise not needed
     * @param { string } attachPointName    - the name of the attachment point
     */
    constructor( typeId, attachPointName ) {
        this.typeId = typeId
        this.attachPointName = attachPointName
    }
}

class ObjectType {
    /**
     * 
     * @param { string }        id 
     * @param { string }        label               - used to differentiate between object types within a Category
     *                                              (only displayed to user, not used internally)
     * @param { Set<string> }   attachmentPoints    - a list of unique strings representing attachment Points;
     *                                              each object of this type will need to have all attachmentPoints
     *                                              defined (i.e: a bone with the name)
     * @param { AttachPoint }    whereToAttach      
     * 
     */
    constructor( id, label, attachmentPoints, whereToAttach = null ) {

        this.id = id
        this.label = label
        this.attachmentPoints = attachmentPoints
        this.parentParentAttachPoint = whereToAttach

    }

}

class Category {

    /**
     * used to group together object types
     * @param { string } name - name of the category
     * @param { string } img - url of image to display in customizer
     * @param { ObjectType[] } objectTypes - used to group similar object types together
     */
    constructor( name, img, objectTypes ) {
        this.name = name
        this.img = img
        this.objectTypes = objectTypes
    }

}

export { ObjectType, AttachPoint, Category }