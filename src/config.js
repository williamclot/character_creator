/* every env variable will be processed here
* TODO: create separate .env files for development and production
*/

export const isProduction = (process.env.NODE_ENV === "production");

/** when in dev mode, assume MMF is also running on localhost */
export const MMF_DOMAIN = isProduction ? "https://www.myminifactory.com" : "http://localhost:8080/dev.php";

/** in development use localhost MMF API */
export const API_URL = `${MMF_DOMAIN}/api/v2`;

export const PUBLIC_URL = process.env.PUBLIC_URL;

/**
 * gets created with LoadOauthApiKeyData fixture inside AuthserviceBundle
 * to use add as request header: { "key": API_KEY }
 */
export const API_KEY = "12345";

/**
 * gets created with LoadAccessTokenData fixture inside AuthserviceBundle
 * add as request param: { "access_token": ACCESS_TOKEN }
 */
export const ACCESS_TOKEN = "bb261bc1-6026-454d-be86-0ce2a78a4925";
