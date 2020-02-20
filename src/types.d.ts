export type PartTypeParent = {
    id: number
    name: string
    attachPoint: string
};

export type PartType = {
    id: number
    name: string
    label: string
    parent?: PartTypeParent
}

export type WorldData = {
    name: string
    price: number
    description: string
    is_private: boolean
    image_url: string
    container_rotation?: Coord3d
    
    user_name: string
    user_url: string

    groups: {
        categories: PartType[]
    }[]
}

type Dict<T> = {[key: string]: T}

export type ApiRoutes = {
    routes: Dict<string>
    route_params: Dict<string>
};

export type Coord3d = {
    x: number
    y: number
    z: number
}

type CustomizedMesh = {
    id: number
    [key: string]: any // TODO
};

export type CustomizerPart = {
    id: number
    name: string
    img: string
    files: {
        default: {
            extension: string
            url: string
        }
    }
    metadata?: {
        position?: Coord3d
        rotation?: Coord3d
        scale?: number
        attachPoints?: {[attachPointName: string]: Coord3d}
    }
}

export type Objects_from_props = {
    allPartTypeIds: number[],
    byPartTypeId: {[partTypeId: number]: CustomizerPart[]}
}

export type CustomizerPart_in_state = CustomizerPart & {
    status: string
    partTypeId: number
}

export type CustomizerPartsState = {
    byId: {
        [id: number]: CustomizerPart_in_state;
    };
    allIds: number[];
}

export type AppProps = {
    api: ApiRoutes
    customizedMeshes: CustomizedMesh[]
    customizedMeshesInCart: number[] // ids
    customizedMeshesOwnedByUser: number[] // ids
    customizer_pay_per_download_enabled: boolean
    edit_mode: boolean
    objects: Objects_from_props
    worldData: WorldData
}