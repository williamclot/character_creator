class ParentCategory {
    /**
     * 
     * @param { string } categoryId 
     * @param { string } boneName 
     */
    constructor( categoryId, boneName ) {
        this.categoryId = categoryId
        this.boneName = boneName
    }
}

class Category {
    /**
     * 
     * @param { string } id 
     * @param { Array< String > } attachmentBones 
     * @param { ParentCategory } whereToAttach 
     */
    constructor( id, attachmentBones = [], whereToAttach = null ) {
        this.id = id
        this.attachmentBones = attachmentBones
        this.parent = whereToAttach
        
        this.imgPath = ""
    }

    setImage( path ) {
        this.imgPath = path
    }

}

export { ParentCategory }
export default Category