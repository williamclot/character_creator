/* every env variable will be processed here
* TODO: create separate .env files for development and production
*/

export const isProduction = (process.env.NODE_ENV === "production");

/** the url where this project is hosted (used for loading static assets) */
export const PUBLIC_URL = process.env.PUBLIC_URL;

/**
 * used to identify whether project is integrated into MMF or running independently
 */
export const isIntegrated = (process.env.REACT_APP__IS_INTEGRATED === "true");

/** live MMF domain url;
 * used for authentication and sharing character on MMF in development as well as in production
*/
export const LIVE_MMF_ENDPOINT = process.env.REACT_APP__LIVE_MMF_ENDPOINT;

/** live MMF API url */
export const LIVE_MMF_API_ENDPOINT = `${LIVE_MMF_ENDPOINT}/api/v2`;

/** MMF endpoint (use this when endpoint depends on node environment) */
export const MMF_ENDPOINT = process.env.REACT_APP__MMF_ENDPOINT;

/** MMF API endpoint (this can be set to localhost when running MMF locally) */
export const MMF_API_ENDPOINT = `${MMF_ENDPOINT}/api/v2`;



// variables below only used when project is running stand-alone
/**************************************************/

/**
 * Developer needs to generate an API key for the MMF API
 * in order to make API calls
 */
export const API_KEY = process.env.REACT_APP__API_KEY || undefined;

/**
 * can be used in development to skip having to login 
 */
export const ACCESS_TOKEN = process.env.REACT_APP__ACCESS_TOKEN || undefined;

/** Developer needs to register the app and will receive a client key */
export const CLIENT_KEY = process.env.REACT_APP__CLIENT_KEY;

/** also created when registering the app */
export const REDIRECT_URI = process.env.REACT_APP__REDIRECT_URI;
