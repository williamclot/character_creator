/* every env variable will be processed here
* TODO: create separate .env files for development and production
*/

export const isProduction = (process.env.NODE_ENV === "production");

/** live MMF domain url */
export const LIVE_MMF_ENDPOINT = process.env.REACT_APP__LIVE_MMF_ENDPOINT;

/** live MMF API url */
export const LIVE_MMF_API_ENDPOINT = process.env.REACT_APP__LIVE_MMF_API_ENDPOINT;

/** MMF endpoint (this can be set to localhost when running MMF locally) */
export const MMF_ENDPOINT = process.env.REACT_APP__MMF_ENDPOINT;

/** MMF API endpoint (this can be set to localhost when running MMF locally) */
export const MMF_API_ENDPOINT = process.env.REACT_APP__MMF_API_ENDPOINT;

/** the url where this project is hosted (used for loading static assets) */
export const PUBLIC_URL = process.env.PUBLIC_URL;


// variables below only used when not in production
/**
 * gets created with LoadOauthApiKeyData fixture inside AuthserviceBundle
 * to use add as request header: { "key": API_KEY }
 */
export const API_KEY = process.env.REACT_APP__API_KEY;

/**
 * gets created with LoadAccessTokenData fixture inside AuthserviceBundle
 * add as request param: { "access_token": ACCESS_TOKEN }
 */
export const ACCESS_TOKEN = process.env.REACT_APP__ACCESS_TOKEN;
