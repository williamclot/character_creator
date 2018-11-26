import Category, { ParentCategory } from './category'

const torso = new Category(
    "Torso",
    new Set( [ "Torso_Neck", "Torso_Sholder_L", "Torso_Sholder_R", "Torso_UpperLeg_L", "Torso_UpperLeg_R" ] ),
    null // attach to scene
)

const head = new Category(
    "Head",
    new Set,
    new ParentCategory( "Torso", "Torso_Neck" )
)

const arml = new Category(
    "ArmL",
    new Set( [ "ArmL_Hand_L" ] ),
    new ParentCategory( "Torso", "Torso_Sholder_L" )
)

const armr = new Category(
    "ArmR",
    new Set( [ "ArmR_Hand_R" ] ),
    new ParentCategory( "Torso", "Torso_Sholder_R"  )
)

const handl = new Category(
    "HandL",
    new Set,
    new ParentCategory( "ArmL", "ArmL_Hand_L" )
)

const handr = new Category(
    "HandR",
    new Set,
    new ParentCategory( "ArmR", "ArmR_Hand_R" )
)

const legl = new Category(
    "LegL",
    new Set( [ "LegL_Foot_L" ] ),
    new ParentCategory( "Torso", "Torso_UpperLeg_L" )
)

const legr = new Category(
    "LegR",
    new Set( [ "LegR_Foot_R" ] ),
    new ParentCategory( "Torso", "Torso_UpperLeg_R" )
)

const footl = new Category(
    "FootL",
    new Set,
    new ParentCategory( "LegL", "LegL_Foot_L" )
)

const footr = new Category(
    "FootR",
    new Set,
    new ParentCategory( "LegR", "LegR_Foot_R" )
)

/** the list of categories available
* @serializable
*/
const categories = [
    torso,
    head,
    arml,
    armr,
    handl,
    handr,
    legl,
    legr,
    footl,
    footr
]

export default categories