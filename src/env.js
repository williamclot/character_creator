export const MMF_HOST = 'https://www.myminifactory.com'

export const API_ENDPOINT = process.env.NODE_ENV === 'production'
    ? `${MMF_HOST}/api/v2`
    : 'http://mmf.local/dev.php/api/v2'