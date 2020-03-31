export type PartTypeParent = {
    id: number;
    name: string;
    attachPoint: string;
};

export type PartType = {
    id: number;
    name: string;
    label: string;
    attachPoints: string[];
    parent?: PartTypeParent;
};

export type User = {
    username: string;
    name: string;
    avatar: string;
    url: string;
};

export type WorldData = {
    id: number;
    name: string;
    price: number;
    currency: string;
    description: string;
    url: string;
    slug: string;
    is_private: boolean;
    image_url: string;
    container_rotation?: Coord3d;
    tags: string[];

    user: User;

    groups: {
        categories: PartType[];
    }[];
};

export type ApiRoutes = {
    routes: Record<string, string>;
    route_params: Record<string, string>;
};

export type Coord3d = {
    x: number;
    y: number;
    z: number;
};

export type CustomizerPart = {
    id: number;
    name: string;
    img: string;
    files: {
        default: {
            extension: string;
            url: string;
        };
    };
    metadata?: {
        position?: Coord3d;
        rotation?: Coord3d;
        scale?: number;
        attachPoints?: { [attachPointName: string]: Coord3d };
    };
};

export type Objects_from_props = {
    allPartTypeIds: number[];
    byPartTypeId: { [partTypeId: number]: CustomizerPart[] };
};

export type CustomizerPart_in_state = CustomizerPart & {
    status: string;
    partTypeId: number;
};

export type CustomizerPartsState = {
    byId: {
        [id: number]: CustomizerPart_in_state;
    };
    allIds: number[];
};

export type CustomizedMesh = {
    id: number;
    customizer_url: string;
    file_url: string;
    image_url: string;
    selectedPartIds: number[];
    status: number;
};

export type CustomizedMeshesMap = {
    [customizedMeshId: number]: CustomizedMesh;
};

export type AppProps = {
    api: ApiRoutes;
    customizedMeshes: CustomizedMeshesMap;
    customizedMeshesInCart: number[]; // ids
    customizedMeshesOwnedByUser: number[]; // ids
    customizer_pay_per_download_enabled: boolean;
    canPublishToStore: boolean;
    edit_mode: boolean;
    objects: Objects_from_props;
    worldData: WorldData;
};
