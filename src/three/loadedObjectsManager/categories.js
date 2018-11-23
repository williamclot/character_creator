import Category, { ParentCategory } from './category'

const torso = new Category(
    "Torso",
    [ "Torso_Neck", "Torso_Sholder_L", "Torso_Sholder_R", "Torso_UpperLeg_L", "Torso_UpperLeg_R" ],
    null // attach to scene
)

const head = new Category(
    "Head",
    [],
    new ParentCategory( "Torso", "Torso_Neck" )
)

const arml = new Category(
    "ArmL",
    [ "ArmL_Hand_L" ],
    new ParentCategory( "Torso", "Torso_Sholder_L" )
)

const armr = new Category(
    "ArmR",
    [ "ArmR_Hand_R" ],
    new ParentCategory( "Torso", "Torso_Sholder_R"  )
)

const handl = new Category(
    "HandL",
    [],
    new ParentCategory( "ArmL", "ArmL_Hand_L" )
)

const handr = new Category(
    "HandR",
    [],
    new ParentCategory( "ArmR", "ArmR_Hand_R" )
)

const legl = new Category(
    "LegL",
    [ "LegL_Foot_L" ],
    new ParentCategory( "Torso", "Torso_UpperLeg_L" )
)

const legr = new Category(
    "LegR",
    [ "LegR_Foot_R" ],
    new ParentCategory( "Torso", "Torso_UpperLeg_R" )
)

const footl = new Category(
    "FootL",
    [],
    new ParentCategory( "LegL", "LegL_Foot_L" )
)

const footr = new Category(
    "FootR",
    [],
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