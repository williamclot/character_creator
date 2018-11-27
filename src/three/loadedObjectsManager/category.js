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

    }

}

/**
 * only used as an abstract
 */
class CategoryWrapper {
    constructor( name, imgPath ) {
        this.name = name
        this.imgPath = imgPath
    }

    getCategories() {}
}

class NormalCategory extends CategoryWrapper {
    /**
     * @param { Category } category
     */
    constructor( category, name, imgPath ) {
        super( name, imgPath )
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
    constructor( leftCategory, rightCategory, name, imgPath ) {
        super( name, imgPath )
        this.leftCategory = leftCategory
        this.rightCategory = rightCategory
    }

    getCategories() {
        return [ this.leftCategory, this.rightCategory ]
    }

}

export { Category, NormalCategory, MirroredCategory, ParentCategory }
export default Category