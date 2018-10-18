const isProduction = (process.env.NODE_ENV === "production");

const HOST = isProduction ? "https://www.myminifactory.com" : "http://localhost:8080/dev.php";
const BASE_URL = isProduction ? "" : "http://localhost:8080/dev.php";

/**
 * gets created with LoadOauthApiKeyData fixture inside AuthserviceBundle
 * to use add as request header: { "key": API_KEY }
 */
const API_KEY = "12345";

/**
 * gets created with LoadAccessTokenData fixture inside AuthserviceBundle
 * add as request param: { "access_token": ACCESS_TOKEN }
 */
const ACCESS_TOKEN = "12sd5f434678";

export default {
    isProduction,
    HOST,
    ACCESS_TOKEN,
    BASE_URL,
    API_KEY
}