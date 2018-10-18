const isProduction = (process.env.NODE_ENV === "production");

const HOST = isProduction ? "https://www.myminifactory.com" : "http://localhost:8080/dev.php";
const BASE_URL = isProduction ? "" : "http://localhost:8080/dev.php";

/**
 * gets created with LoadOauthApiKeyData fixture inside AuthserviceBundle
 * to use add as request header: { "key": "12345" }
 */
const API_KEY = "12345";

/**
 * gets created with LoadAccessTokenData fixture inside AuthserviceBundle
 * add as request param with name "access_token"
 */
const ACCESS_TOKEN = "12sd5f434678";

export default {
    HOST,
    ACCESS_TOKEN,
    BASE_URL,
    API_KEY
}