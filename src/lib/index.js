import { byCategory, allCategories } from './user_my-human-world_objects.json'

export { default as worldData } from './user_my-human-world.json'

export { default as poseData } from './user_my-human-world_default-pose.json'


const oneOfEach = allCategories.reduce(
    ( acc, category ) => {
        acc[ category ] = byCategory[ category ][ 0 ] // select first
        return acc
    },
    {}
)

export const objects = {
    byCategory,
    allCategories,
    oneOfEach
}