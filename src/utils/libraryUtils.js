import headElements from "../library/heads.json";
// import handElements from "../library/hands.json";
import leftHandElements from "../library/left_hands.json";
import rightHandElements from "../library/right_hands.json";
// import armElements from "../library/arm.json";
import leftArmElements from "../library/left_arm.json";
import rightArmElements from "../library/right_arm.json";
import torsoElements from "../library/torso.json";
// import footElements from "../library/foot.json";
import leftFootElements from "../library/left_foot.json";
import rightFootElements from "../library/right_foot.json";
// import legElements from "../library/leg.json";
import leftLegElements from "../library/left_leg.json";
import rightLegElements from "../library/right_leg.json";
import standElements from "../library/stands.json";
import poseElements from "../library/poses.json";

/**
 * wrapper around the local library of body parts
 */
const library = {
	libraries: {
		head: {
			data: headElements,
			categoryHasLeftAndRightDistinction: false
		},
		hand: {
			data: {
				left: leftHandElements,
				right: rightHandElements
			},
			categoryHasLeftAndRightDistinction: true
		},
		arm: {
			data: {
				left: leftArmElements,
				right: rightArmElements
			},
			categoryHasLeftAndRightDistinction: true
		},
		torso: {
			data: torsoElements,
			categoryHasLeftAndRightDistinction: false
		},
		foot: {
			data: {
				left: leftFootElements,
				right: rightFootElements
			},
			categoryHasLeftAndRightDistinction: true
		},
		leg: {
			data: {
				left: leftLegElements,
				right: rightLegElements
			},
			categoryHasLeftAndRightDistinction: true
		},
		pose: {
			data: poseElements,
			categoryHasLeftAndRightDistinction: false
		},
		stand: {
			data: standElements,
			categoryHasLeftAndRightDistinction: false
		}	
	},

	/**
	 * returns the local data about a body part
	 * @param {String} category - the body part (i.e. "head", "leg")
	 * @param {Boolean} isLeft
	 * @returns {Array} - a list of Data objects with info about the body part
	 */
	load(category, isLeft) {
		const currentCategoryInfo = this.libraries[category];
		const {
			categoryHasLeftAndRightDistinction,
			data
		} = currentCategoryInfo;
	
		const side = isLeft ? "left" : "right";
		return categoryHasLeftAndRightDistinction ? data[side] : data;
	},

	hasLeftAndRightDistinction(category) {
		const { categoryHasLeftAndRightDistinction } = this.libraries[category];
		return categoryHasLeftAndRightDistinction;
	}
};


export default library;