

import BaseHttpService from "../config/http.config";

export type BannerType = {
    title: string;
    link: string;
    is_active: boolean;
    image_url: FileList;
};

class SettingService extends BaseHttpService {

    createCourt = async (data: any) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/court',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listCourt = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/court', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    createSlot = async (data: any) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/slot',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    deleteCourt = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/court/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    deleteSlot = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/slot/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    deleteClosing = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/closing-day/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listSlot = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/slot', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    createClosing = async (data: any) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/closing-day',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listCLosing = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/closing-day/?court_id=${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

}

const settingSvc = new SettingService()

export default settingSvc;