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

type Dict<T> = {[key: string]: T}

export type ApiRoutes = {
    routes: Dict<string>,
    route_params: Dict<string>
};