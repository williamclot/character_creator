
export type LibraryItem = {
    /** name of the Mesh */
    name: string;

    /** img file found in public/img/ */
    img: string;

    /** file name of object (without extension) */
    file: string;

    author: string;

    description: string;

    rotation: {
        x: number;
        y: number;
        z: number;
    };

    scale: number;

    /** boolean stating if object is premium */
    premium: boolean;

    /** link of this object on myminifactory */
    mmfLink: string;

    /** relative URL of this resource */
    relativeURL: string;

    /** absolute URL of this resource */
    absoluteURL: string;
}
