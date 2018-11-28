class ParentCategory { // TODO rename class
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
    constructor( id, attachmentBones, whereToAttach = null ) {

        this.id = id
        this.attachmentBones = attachmentBones
        this.parent = whereToAttach

    }

}

/**
 * only used as an abstract
 */
class CategoryWrapper {
    /**
     * 
     * @param { string } name 
     * @param { string } imgPath 
     * @param { boolean } isMirrored 
     */
    constructor( name, imgPath, isMirrored ) {
        this.name = name
        this.imgPath = imgPath
        this.isMirrored = isMirrored
    }

    getCategories() {}
}

class NormalCategory extends CategoryWrapper {
    /**
     * @param { Category } category
     */
    constructor( category, name, imgPath ) {
        super( name, imgPath, false )
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
        super( name, imgPath, true )
        this.leftCategory = leftCategory
        this.rightCategory = rightCategory
    }

    getCategories() {
        return [ this.leftCategory, this.rightCategory ]
    }

}

export { Category, CategoryWrapper, NormalCategory, MirroredCategory, ParentCategory }
export default Category