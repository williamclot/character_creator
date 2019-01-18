export const apiEndpoint = process.env.REACT_APP__API_ENDPOINT
export const accessToken = process.env.REACT_APP__ACCESS_TOKEN

export const requestConfig = {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}

export const userName = "user"
export const customizerName = "my-human-world"