export type UserModelType = {
    id: number;
    email: string;
    username: string;
    /** Profile catalog/UI language (`ru` | `en` | …) from `/user/me`. */
    language?: string;
};
