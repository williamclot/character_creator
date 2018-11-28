import {
	Category, CategoryWrapper, MirroredCategory, NormalCategory,
	defaultCategories, defaultCategoryWrappers
} from '../three/util/category'

import { axiosWithPublicUrl } from './axiosUtils'

const LIB_FOLDER = "/library"

/** @returns { Promise< LibraryItem[] > } */
function requestLib( categoryId ) {
	return axiosWithPublicUrl.get( `${ LIB_FOLDER }/${ categoryId }.json` )
}

/**
 * wrapper around the local library of body parts
 */
const libraryUtils = {
	/**
	 * returns the local data about a body part
	 * @param { CategoryWrapper } categoryWrapper - the body part (i.e. "head", "leg")
	 * @param { boolean } [isLeft]
	 * @returns { Promise< LibraryItem[] > } - promise that resolves to a list of LibraryItem objects
	 */
	getLibrary( categoryWrapper, isLeft ) {

		switch ( categoryWrapper.constructor ) { // could also check for category.isMirrored
			case MirroredCategory: {
				const category = isLeft ? categoryWrapper.leftCategory : categoryWrapper.rightCategory
				const categoryId = category.id

				return requestLib( categoryId )
			}
			case NormalCategory: {
				const categoryId = categoryWrapper.category.id

				return requestLib( categoryId )
			}
			default: {
				return Promise.reject( new Error( `Not an instance of CategoryWrapper!` ) )
			}
		}

	},

	/**
	 * @param { CategoryWrapper } categoryWrapper 
	 */
	hasLeftAndRightDistinction( categoryWrapper ) {
		return categoryWrapper.isMirrored
	},

	/**
	 * 
	 * @param { CategoryWrapper } categoryWrapper 
	 * @param { boolean } isLeft 
	 */
	getMeshType( categoryWrapper, isLeft ) {
		
		switch ( categoryWrapper.constructor ) {
			case MirroredCategory: {
				const category = isLeft ? categoryWrapper.leftCategory : categoryWrapper.rightCategory
				return category.id
			}
			case NormalCategory: {
				return categoryWrapper.category.id
			}
			default: {
				return undefined
			}
		}

	},

	processAPIObjects(items) {
		return items.reduce((processedItems, item) => {
			const {
				name,
				url: mmfLink,
				description,
				designer,
				images,
				files,
				licences,
				tags
			} = item;

			/** 
			 * currently, the api returns objects with tag similar to 'customizer';
			 * therefore, objects with tag different than 'customizer' or 'customizer-<...>'
			 * need to be filtered out
			*/
			const customizerTags = tags.filter(tag => tag.startsWith('customizer'));
			if (customizerTags.length === 0) {
				return processedItems;
			}

			/**
			 * find first file associated with this object that ends with .glb
			 * if none is found, step over this object
			 */
			const glbFile = files.items.find(f => f.filename.endsWith('.glb'));
			if (!glbFile) {
				return processedItems;
			}
			
			const primaryImg = images.find(image => image.is_primary);
			const author = designer.name;
			const rotation = undefined;
			const scale = 1;

			const processedItem = {
				name,
				img: primaryImg.thumbnail.url,
				file: glbFile.filename,
				author,
				description,
				rotation,
				scale,
				mmfLink,
				absoluteURL: glbFile.download_url
			};

			// console.log(processedItem);

			processedItems.push(processedItem);
			return processedItems;
		}, []);
	}
};


export default libraryUtils;