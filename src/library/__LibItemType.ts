/*
 * this file is only used as a template for an item in the library;
 * not actually used in the code yet!
 *
 */

type ObjWithXYZ = {
    x: number,
    y: number,
    z: number
}

export type LibraryItem = {

    /** absolute url of the resource */
    url: string

    /** name of the category (Head, Torso, HandL ...) */
    categoryName: string 

    metadata?: {
        rotation?: ObjWithXYZ,
        position?: ObjWithXYZ,
        scale?: ObjWithXYZ
    }

    /** name of the Mesh */
    name?: string;


    /** absolute url of image */
    imgURL?: string;

    /** extension type */
    extension?: string;
}
