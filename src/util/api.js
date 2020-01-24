import axios from 'axios'

const getBlob = url => {
    return axios.get(
        url,
        { responseType: 'blob' }
    )
}

class MmfApi {
    constructor(api) {
        this.api = api;
    }

    async deletePart(id) {
        const { routes, route_params } = this.api;
        const url = routes.delete_part.replace(route_params.partId, id);
        const res = await axios.delete(url);

        if ( res.status !== 204 ) {
            throw new Error('Delete Failed');
        }
    }

    async postPart(object) {
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

    async generateCustomizedMesh(objectIds) {
        const res = await axios.post(
            this.api.routes.post_generate_mesh,
            {
                selection: objectIds
            }
        );

        return res.data;
    }

    async getCustomizedMesh(customizedMeshId) {
        const { routes, route_params } = this.api;
        const url = routes.get_download.replace(route_params.customizedMeshId, customizedMeshId);
        const res = await axios.get(url);

        return res.data;
    }

    async patchCustomizer(fields) {
        const res = await axios.patch(this.api.routes.patch_customizer, fields);

        return res.data;
    }

    async addToCart(customizedMeshId) {
        await axios.post(this.api.routes.addToCart, {
            itemType: 'customized-mesh',
            itemId: customizedMeshId
        })
    }
}

export default MmfApi

