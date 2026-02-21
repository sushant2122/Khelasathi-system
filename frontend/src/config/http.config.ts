import axiosInstance from "./axios.config";
export type AxiosConfigType = {
    auth?: boolean;
    file?: boolean;
    params?: Record<string, any>; // Add params to config type
}

abstract class BaseHttpService {
    #headers = {}
    getHeaders = (config: AxiosConfigType) => {
        if (config?.file) {
            this.#headers = {
                ...this.#headers,
                "Content-Type": "multipart/form-data"
            };
        }

        if (config?.auth) {
            const token = localStorage.getItem('access') || null;
            console.log("token from axiosinstance", token);

            if (!token) {
                throw { status: 401, message: "Login required." };
            }

            this.#headers = {
                ...this.#headers,
                "Authorization": "Bearer " + token
            };
        }
    }
    postRequest = async (url: string, data: any = {}, config: AxiosConfigType = {}) => {
        try {
            this.getHeaders(config);
            //headers populate
            const response = await axiosInstance.post(url, data, {
                headers: {
                    ...this.#headers
                }
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }
    getRequest = async (url: string, config: AxiosConfigType = {}) => {
        try {
            this.getHeaders(config);
            const response = await axiosInstance.get(url, {
                headers: {
                    ...this.#headers
                },
                params: config.params // Pass query parameters here
            });
            return response;
        } catch (exception) {
            throw exception;
        }
    }

    putRequest = async (url: string, data: any = {}, config: AxiosConfigType = {}) => {
        try {
            this.getHeaders(config);
            //headers populate
            const response = await axiosInstance.put(url, data, {
                headers: {
                    ...this.#headers
                }
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }

    patchRequest = async (url: string, data: any = {}, config: AxiosConfigType = {}) => {
        try {
            this.getHeaders(config);
            //headers populate
            const response = await axiosInstance.patch(url, data, {
                headers: {
                    ...this.#headers
                }
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }
    deleteRequest = async (url: string, config: AxiosConfigType = {}) => {
        try {
            this.getHeaders(config);
            //headers populate
            const response = await axiosInstance.delete(url, {
                headers: {
                    ...this.#headers
                }
            })
            return response;
        } catch (exception) {
            throw exception;
        }
    }
}

export default BaseHttpService;