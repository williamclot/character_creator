class ParentCategory {
    constructor( categoryId, boneName ) {
        this.categoryId = categoryId
        this.boneName = boneName
    }
}

class Category {

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