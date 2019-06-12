import axios from 'axios'

const getBlob = url => {
    return axios.get(
        url,
        { responseType: 'blob' }
    )
}

const generateApiObject = ( object, fileSize, imageSize ) => {
    return {
        "name": object.name,
        // "description": "string",
        "visibility": 0,
        // "how_to": "string",
        // "dimensions": "string",
        // "time_to_do_from": 0,
        // "time_to_do_to": 0,
        // "support_free": true,
        // "filament_quantity": "string",
        // "client_url": "string",
        // "tags": "customizer",
        "brand": null,
        "licenses": [],
        
        "files": [
          {
            "filename": `${object.name}.${object.extension}`,
            "size": fileSize
          }
        ],
        "images": [
          {
            "filename": `${object.name}.jpg`,
            "size": imageSize
          }
        ],

        "customizer_part_type_id": object.partTypeId,
        "customizer_metadata": object.metadata
    }
}

class MmfApi {
    constructor( apiEndpoint ) {
        this.apiEndpoint = apiEndpoint
    }

    async deleteObject( id, csrfToken ) {
        const res = await axios.delete(
            `${this.apiEndpoint}/objects/${id}`,
            {
                params: {
                    _csrf_token: csrfToken
                }
            }
        )

        if ( res.status !== 204 ) {
            throw new Error('Delete Failed')
        }
    }

    async postObject( object ) {
        
        const [{ data: fileBlob }, { data: imageBlob }] = await Promise.all([
            getBlob( object.download_url ),
            getBlob( object.img )
        ])

        const res = await axios.post(
            `${this.apiEndpoint}/object`,
            generateApiObject( object, fileBlob.size, imageBlob.size )
        )

        if ( res.status !== 200 )
            throw new Error('Not OK')

        const { files, images, id } = res.data

        const file = files[ 0 ]
        const image = images[ 0 ]

        await Promise.all([
            axios.post(
                `${this.apiEndpoint}/file`,
                fileBlob,
                {
                    params: {
                        upload_id: file.upload_id
                    }
                }
            ),
            axios.post(
                `${this.apiEndpoint}/image`,
                imageBlob,
                {
                    params: {
                        upload_id: image.upload_id
                    }
                }
            )
        ])

        return id
    }
}

export default MmfApi