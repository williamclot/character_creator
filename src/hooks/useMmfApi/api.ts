import axios from 'axios';
import { ApiRoutes } from './ApiRoutes';


const getBlob = (url: string) => {
    return axios.get(
        url,
        { responseType: 'blob' }
    )
}

class MmfApi {
    private api: ApiRoutes;

    constructor(api: ApiRoutes) {
        this.api = api;
    }

    async deletePart(id: number) {
        const { routes, route_params } = this.api;
        const url = routes.delete_part.replace(route_params.partId, id.toString());
        const res = await axios.delete(url);

        if ( res.status !== 204 ) {
            throw new Error('Delete Failed');
        }
    }

    async postPart(object: any) {
        const { routes, route_params } = this.api;
        const url = routes.post_part.replace(route_params.partTypeId, object.partTypeId);
        
        const [{ data: fileBlob }, { data: imageBlob }] = await Promise.all([
            getBlob( object.files.default.url ),
            getBlob( object.img )
        ])

        const formData = new FormData();
        formData.append('name', object.name);
        formData.append('metadata', JSON.stringify(object.metadata));
        formData.append('3d-file', new File([fileBlob], object.name));
        formData.append('image', new File([imageBlob], object.name));

        const res = await axios.post(url, formData);

        if (res.status !== 200)
            throw new Error('Not OK');

        return res.data.id;
    }

    async generateCustomizedMesh(objectIds: number[]) {
        const res = await axios.post(
            this.api.routes.post_generate_mesh,
            {
                selection: objectIds
            }
        );

        return res.data;
    }

    async getCustomizedMesh(customizedMeshId: number) {
        const { routes, route_params } = this.api;
        const url = routes.get_download.replace(route_params.customizedMeshId, customizedMeshId.toString());
        const res = await axios.get(url);

        return res.data;
    }

    async patchCustomizer(fields: any) {
        const res = await axios.patch(this.api.routes.patch_customizer, fields);

        return res.data;
    }

    async addToCart(customizedMeshId: number) {
        const { routes, route_params } = this.api;
        const url = routes.addToCart
            .replace(route_params.itemType, 'customized-mesh')
            .replace(route_params.itemId, customizedMeshId.toString());

        const { data } = await axios.post(url);

        return data;
    }
}

export default MmfApi

