/*
    steps are:

    - UPLOAD_CONFIRM: confirm uploaded stl file & select pic
    - GLOBAL_POSITIONING: ask if placing in global pisitioning is ok
    - PLACE_ATTACHPOINT: click roughly where to put pivot point
    - ADJUST: adjust pivot point
    - PLACE_OTHER_ATTACHPOINTS: click roughly where to place attachpoint
    - ADJUST_ATTACHPOINTS: adjust attachpoint

*/

export const steps = {
    UPLOAD_CONFIRM: 'UPLOAD_CONFIRM',
    GLOBAL_POSITIONING: 'GLOBAL_POSITIONING',
    PLACE_ATTACHPOINT: 'PLACE_ATTACHPOINT',
    ADJUST: 'ADJUST',
    PLACE_OTHER_ATTACHPOINTS: 'PLACE_OTHER_ATTACHPOINTS',
    ADJUST_ATTACHPOINTS: 'ADJUST_ATTACHPOINTS',
    COMPLETED: 'COMPLETED',
};

export const nextStep = {
    [steps.UPLOAD_CONFIRM]: steps.GLOBAL_POSITIONING,
    [steps.GLOBAL_POSITIONING]: steps.PLACE_ATTACHPOINT,
    [steps.PLACE_ATTACHPOINT]: steps.ADJUST,
    [steps.ADJUST]: steps.PLACE_OTHER_ATTACHPOINTS,
    [steps.PLACE_OTHER_ATTACHPOINTS]: steps.ADJUST_ATTACHPOINTS,
    [steps.ADJUST_ATTACHPOINTS]: steps.COMPLETED,
};

export const previousStep = {
    [steps.COMPLETED]: steps.ADJUST_ATTACHPOINTS,
    [steps.ADJUST_ATTACHPOINTS]: steps.PLACE_OTHER_ATTACHPOINTS,
    [steps.PLACE_OTHER_ATTACHPOINTS]: steps.ADJUST,
    [steps.ADJUST]: steps.PLACE_ATTACHPOINT,
    [steps.PLACE_ATTACHPOINT]: steps.GLOBAL_POSITIONING,
    [steps.GLOBAL_POSITIONING]: steps.UPLOAD_CONFIRM,
};
