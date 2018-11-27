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
     * @param { Set< string > } attachmentBones 
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

/**
 * only used as an abstract
 */
class CategoryWrapper {
    constructor( name ) {
        this.name = name
    }

    getCategories() {}
}

class NormalCategory extends CategoryWrapper {
    /**
     * @param { Category } category
     */
    constructor( name, category ) {
        super( name )
        this.category = category
    }

    getCategories() {
        return [ this.category ]
    }
}

class MirroredCategory extends CategoryWrapper {
    /**
     * @param { Category } leftCategory 
     * @param { Category } rightCategory 
     */
    constructor( name, leftCategory, rightCategory ) {
        super( name )
        this.leftCategory = leftCategory
        this.rightCategory = rightCategory
    }

    getCategories() {
        return [ this.leftCategory, this.rightCategory ]
    }

}

export { Category, NormalCategory, MirroredCategory, ParentCategory }
export default Category