import Category, { NormalCategory, MirroredCategory, ParentCategory } from './category'

const Torso = new Category(
    "Torso",
    new Set( [ "Torso_Neck", "Torso_Sholder_L", "Torso_Sholder_R", "Torso_UpperLeg_L", "Torso_UpperLeg_R" ] ),
    null // attach to scene
)

const Head = new Category(
    "Head",
    new Set,
    new ParentCategory( "Torso", "Torso_Neck" )
)

const ArmL = new Category(
    "ArmL",
    new Set( [ "ArmL_Hand_L" ] ),
    new ParentCategory( "Torso", "Torso_Sholder_L" )
)

const ArmR = new Category(
    "ArmR",
    new Set( [ "ArmR_Hand_R" ] ),
    new ParentCategory( "Torso", "Torso_Sholder_R"  )
)

const HandL = new Category(
    "HandL",
    new Set,
    new ParentCategory( "ArmL", "ArmL_Hand_L" )
)

const HandR = new Category(
    "HandR",
    new Set,
    new ParentCategory( "ArmR", "ArmR_Hand_R" )
)

const LegL = new Category(
    "LegL",
    new Set( [ "LegL_Foot_L" ] ),
    new ParentCategory( "Torso", "Torso_UpperLeg_L" )
)

const LegR = new Category(
    "LegR",
    new Set( [ "LegR_Foot_R" ] ),
    new ParentCategory( "Torso", "Torso_UpperLeg_R" )
)

const FootL = new Category(
    "FootL",
    new Set,
    new ParentCategory( "LegL", "LegL_Foot_L" )
)

const FootR = new Category(
    "FootR",
    new Set,
    new ParentCategory( "LegR", "LegR_Foot_R" )
)

const torso = new NormalCategory( "torso", Torso )
const head = new NormalCategory( "head", Head )
const arm = new MirroredCategory( "arm", ArmL, ArmR )
const hand = new MirroredCategory( "hand", HandL, HandR )
const leg = new MirroredCategory( "leg", LegL, LegR )
const foot = new MirroredCategory( "foot", FootL, FootR )

/**
 * List of category wrappers. These can be used to identify whether a category
 * has a mirror category (example: left hand -> right hand)
 */
const categoryWrappers = [
    torso,
    head,
    arm,
    hand,
    leg,
    foot
]

/**
 * The list of categories available
 */
const categories = categoryWrappers.flatMap( wrapper => wrapper.getCategories() )

export default categories
export { categories, categoryWrappers }