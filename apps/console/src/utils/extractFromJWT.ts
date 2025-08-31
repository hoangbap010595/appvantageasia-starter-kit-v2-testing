export interface BaseJWTPayload {
    iat: number;
    exp: number;
}

const extractFromJWT = <T extends object = {}>(token: string): T & BaseJWTPayload => {
    const parts = token.split('.');
    const rawData = atob(parts[1]);

    return JSON.parse(rawData) as T & BaseJWTPayload;
};

export default extractFromJWT;
