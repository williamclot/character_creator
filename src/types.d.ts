export type PartTypeParent = {
    id: number
    name: string
    attachPoint: string
};

export type PartType = {
    id: number,
    name: string,
    label: string,
    parent?: PartTypeParent
}

export type WorldData = {
    groups: {
        categories: PartType[]
    }[]
}
