export const API_ENDPOINT = process.env.NODE_ENV === 'production'
    ? 'https://myminifactory.com/api/v2'
    : 'http://mmf.local/dev.php/api/v2'