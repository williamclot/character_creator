import { ObjectType, AttachPoint, Category } from './category'

const Torso = new ObjectType(
    "Torso",
    "Torso",
    new Set( [ "Torso_Neck", "Torso_UpperArm_L", "Torso_UpperArm_R", "Torso_UpperLeg_L", "Torso_UpperLeg_R" ] ),
    null // attach to scene
)

const Head = new ObjectType(
    "Head",
    "Head",
    new Set,
    new AttachPoint( "Torso", "Torso_Neck" )
)

const ArmL = new ObjectType(
    "ArmL",
    "Left Arm",
    new Set( [ "ArmL_Hand_L" ] ),
    new AttachPoint( "Torso", "Torso_UpperArm_L" )
)

const ArmR = new ObjectType(
    "ArmR",
    "Right Arm",
    new Set( [ "ArmR_Hand_R" ] ),
    new AttachPoint( "Torso", "Torso_UpperArm_R"  )
)

const HandL = new ObjectType(
    "HandL",
    "Left Hand",
    new Set,
    new AttachPoint( "ArmL", "ArmL_Hand_L" )
)

const HandR = new ObjectType(
    "HandR",
    "Right Hand",
    new Set,
    new AttachPoint( "ArmR", "ArmR_Hand_R" )
)

const LegL = new ObjectType(
    "LegL",
    "Left Leg",
    new Set( [ "LegL_Foot_L" ] ),
    new AttachPoint( "Torso", "Torso_UpperLeg_L" )
)

const LegR = new ObjectType(
    "LegR",
    "Right Leg",
    new Set( [ "LegR_Foot_R" ] ),
    new AttachPoint( "Torso", "Torso_UpperLeg_R" )
)

const FootL = new ObjectType(
    "FootL",
    "Left Foot",
    new Set,
    new AttachPoint( "LegL", "LegL_Foot_L" )
)

const FootR = new ObjectType(
    "FootR",
    "Right Foot",
    new Set,
    new AttachPoint( "LegR", "LegR_Foot_R" )
)

const torso = new Category( "torso", "/img/graphics_creation/torso.svg", [ Torso ] )
const head = new Category( "head", "/img/graphics_creation/head.svg", [ Head ] )
const arm = new Category( "arm", "/img/graphics_creation/arm.svg", [ ArmL, ArmR ] )
const hand = new Category( "hand", "/img/graphics_creation/hand.svg", [ HandL, HandR ] )
const leg = new Category( "leg", "/img/graphics_creation/leg.svg", [ LegL, LegR ] )
const foot = new Category( "foot", "/img/graphics_creation/foot.svg", [ FootL, FootR ] )

/**
 * List of categories
 */
const categories = [
    torso,
    head,
    arm,
    hand,
    leg,
    foot
]

/**
 * The list of object types available
 * @type { ObjectType[] }
 */

// version with reduce needed as flatMap is not polyfilled with current webpack config
// const objectTypes = categories.flatMap( category => category.objectTypes )
const objectTypes = categories.reduce(
    ( flattenedTypes, category ) => [ ...flattenedTypes, ...category.objectTypes ],
    []
)

export { categories, objectTypes }
