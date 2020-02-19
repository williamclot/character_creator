type Dict<T> = {[key: string]: T}

export type ApiRoutes = {
    routes: Dict<string>,
    route_params: Dict<string>
};