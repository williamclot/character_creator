export const PARENT_BONE = {
    "ArmL_UpperArm_L": "Torso_UpperArm_L",
    "ArmR_UpperArm_R": "Torso_UpperArm_R",
    "FootL_Foot_L"   : "LegL_Foot_L",
    "FootR_Foot_R"   : "LegR_Foot_R",
    "HandL_Hand_L"   : "ArmL_Hand_L",
    "HandR_Hand_R"   : "ArmR_Hand_R",
    "Head_Neck"      : "Torso_Neck",
    "LegL_UpperLeg_L": "Torso_UpperLeg_L",
    "LegR_UpperLeg_R": "Torso_UpperLeg_R"
}

export const CHILD_BONE = {
    "ArmL_Hand_L"     : "HandL_Hand_L",
    "ArmR_Hand_R"     : "HandR_Hand_R",
    "LegL_Foot_L"     : "FootL_Foot_L",
    "LegR_Foot_R"     : "FootR_Foot_R",
    "Torso_Neck"      : "Head_Neck",
    "Torso_UpperArm_L": "ArmL_UpperArm_L",
    "Torso_UpperArm_R": "ArmR_UpperArm_R",
    "Torso_UpperLeg_L": "LegL_UpperLeg_L",
    "Torso_UpperLeg_R": "LegR_UpperLeg_R"
}

export const ALL_BODY_PARTS = [
    "Head",
    "Torso",
    "ArmL",
    "ArmR",
    "LegL",
    "LegR",
    "HandL",
    "HandR",
    "FootL",
    "FootR"
]

export const PARENT_ATTACHMENT_BONES = [
    "ArmL_Hand_L",
    "ArmR_Hand_R",
    "LegL_Foot_L",
    "LegR_Foot_R",
    "Torso_Neck",
    "Torso_UpperArm_L",
    "Torso_UpperArm_R",
    "Torso_UpperLeg_L",
    "Torso_UpperLeg_R"
];

export const ANCHORS = {
    Torso: {
        childrenAttachPoints: [
            {
                parentAttachment: "Torso_Neck",
                childAttachment : "Head_Neck"
            },
            {
                parentAttachment: "Torso_UpperArm_R",
                childAttachment : "ArmR_UpperArm_R"
            },
            {
                parentAttachment: "Torso_UpperArm_L",
                childAttachment : "ArmL_UpperArm_L"
            },
            {
                parentAttachment: "Torso_UpperLeg_R",
                childAttachment : "LegR_UpperLeg_R"
            },
            {
                parentAttachment: "Torso_UpperLeg_L",
                childAttachment : "LegL_UpperLeg_L"
            }
        ],
        attachPoint: undefined
    },
    Head: {
        childrenAttachPoints: [],
        attachPoint  : {
            parentAttachment: "Torso_Neck",
            childAttachment : "Head_Neck"
        }
        
    },
    ArmR: {
        childrenAttachPoints: [
            {
                parentAttachment: "ArmR_Hand_R",
                childAttachment : "HandR_Hand_R"
            }
        ],
        attachPoint: {
            parentAttachment: "Torso_UpperArm_R",
            childAttachment : "ArmR_UpperArm_R"
        }
        
    },
    ArmL: {
        childrenAttachPoints: [
            {
                parentAttachment: "ArmL_Hand_L",
                childAttachment : "HandL_Hand_L"
            }
        ],
        attachPoint: {
            parentAttachment: "Torso_UpperArm_L",
            childAttachment : "ArmL_UpperArm_L"
        }
        
    },
    HandR: {
        childrenAttachPoints: [],
        attachPoint  : {
            parentAttachment: "ArmR_Hand_R",
            childAttachment : "HandR_Hand_R"
        }
        
    },
    HandL: {
        childrenAttachPoints: [],
        attachPoint  : {
            parentAttachment: "ArmL_Hand_L",
            childAttachment : "HandL_Hand_L"
        }
        
    },
    LegR: {
        childrenAttachPoints: [
            {
                parentAttachment: "LegR_Foot_R",
                childAttachment : "FootR_Foot_R"
            }
        ],
        attachPoint: {
            parentAttachment: "Torso_UpperLeg_R",
            childAttachment : "LegR_UpperLeg_R"
        }
        
    },
    LegL: {
        childrenAttachPoints: [
            {
                parentAttachment: "LegL_Foot_L",
                childAttachment : "FootL_Foot_L"
            }
        ],
        attachPoint: {
            parentAttachment: "Torso_UpperLeg_L",
            childAttachment : "LegL_UpperLeg_L"
        }
        
    },
    FootR: {
        childrenAttachPoints: [],
        attachPoint  : {
            parentAttachment: "LegR_Foot_R",
            childAttachment : "FootR_Foot_R"
        }
        
    },
    FootL: {
        childrenAttachPoints: [],
        attachPoint  : {
            parentAttachment: "LegL_Foot_L",
            childAttachment : "FootL_Foot_L"
        }
        
    }
};