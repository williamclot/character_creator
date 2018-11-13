export const defaultMeshes = {
    Torso: {
      name    : "turtle_torso",
      rotation: { x: 0, y: 0, z: 0 }
    },
    LegR: {
      name    : "robot_leg_R",
      rotation: { x: 0, y: 0, z: 0 }
    },
    LegL: {
      name    : "default_leg_L",
      rotation: { x: 0, y: 0, z: 0 }
    },
    Head: {
      name    : "default_head",
      rotation: { x: 0, y: 0, z: 0 }
    },
    ArmR: {
      name    : "thin_arm_R",
      rotation: { x: 0, y: 0, z: 0 }
    },
    ArmL: {
      name    : "thin_arm_L",
      rotation: { x: 0, y: 0, z: 0 }
    },
    HandR: {
      name    : "open_hand_R",
      rotation: { x: 0, y: -1.57, z: 0 }
    },
    HandL: {
      name    : "open_hand_L",
      rotation: { x: 0, y: 1.57, z: 0 }
    },
    FootR: {
      name    : "boots_R",
      rotation: { x: 0, y: 0, z: 0 }
    },
    FootL: {
      name    : "boots_L",
      rotation: { x: 0, y: 0, z: 0 }
    },
    Stand: {
      name    : "default",
      rotation: { x: 0, y: 0, z: 0 }
    }
};

export const BoneAttachmentRelationships = {
  ArmL_UpperArm_L: "Torso_UpperArm_L",
  ArmR_UpperArm_R: "Torso_UpperArm_R",
  FootL_Foot_L   : "LegL_Foot_L",
  FootR_Foot_R   : "LegR_Foot_R",
  HandL_Hand_L   : "ArmL_Hand_L",
  HandR_Hand_R   : "ArmR_Hand_R",
  Head_Neck      : "Torso_Neck",
  LegL_UpperLeg_L: "Torso_UpperLeg_L",
  LegR_UpperLeg_R: "Torso_UpperLeg_R"
};

// List of information on the meshes (attach points, body groups...)
export const meshStaticInfo = {
    Torso: {
      bodyPart        : "torso",
      parentAttachment: undefined,
      childAttachment : undefined
    },
    Head: {
      bodyPart        : "head",
      parentAttachment: "Torso_Neck",
      childAttachment : "Head_Neck"
    },
    ArmR: {
      bodyPart        : "arm",
      parentAttachment: "Torso_UpperArm_R",
      childAttachment : "ArmR_UpperArm_R"
    },
    ArmL: {
      bodyPart        : "arm",
      parentAttachment: "Torso_UpperArm_L",
      childAttachment : "ArmL_UpperArm_L"
    },
    HandR: {
      bodyPart        : "hand",
      parentAttachment: "ArmR_Hand_R",
      childAttachment : "HandR_Hand_R"
    },
    HandL: {
      bodyPart        : "hand",
      parentAttachment: "ArmL_Hand_L",
      childAttachment : "HandL_Hand_L"
    },
    LegR: {
      bodyPart        : "leg",
      parentAttachment: "Torso_UpperLeg_R",
      childAttachment : "LegR_UpperLeg_R"
    },
    LegL: {
      bodyPart        : "leg",
      parentAttachment: "Torso_UpperLeg_L",
      childAttachment : "LegL_UpperLeg_L"
    },
    FootR: {
      bodyPart        : "foot",
      parentAttachment: "LegR_Foot_R",
      childAttachment : "FootR_Foot_R"
    },
    FootL: {
      bodyPart        : "foot",
      parentAttachment: "LegL_Foot_L",
      childAttachment : "FootL_Foot_L"
    }
};

// List of parent/child relations
export const childrenList = {
  ArmR : ["HandR"],
  ArmL : ["HandL"],
  Torso: ["ArmR", "ArmL", "Head", "LegR", "LegL"],
  LegR : ["FootR"],
  LegL : ["FootL"]
};