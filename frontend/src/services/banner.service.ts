

import BaseHttpService from "../config/http.config";

export type BannerType = {
    title: string;
    link: string;
    is_active: boolean;
    image_url: FileList;
};

class BannerService extends BaseHttpService {
    createBanner = async (data: BannerType) => {
        try {

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("link", data.link);
            formData.append("is_active", String(data.is_active));
            formData.append("image_url", data.image_url[0]);
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/banner',
                formData, { file: true, auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listBanner = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/banner', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listHomeBanner = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/banner/list-home'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    showBannerDetail = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/banner/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    updateBannerDetail = async (id: number, data: any) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("link", data.link);
            formData.append("is_active", String(data.is_active));

            if (data.image_url && data.image_url.length > 0) {
                formData.append('image_url', data.image_url[0]);
            }
            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/banner/${id}`, formData, { auth: true, file: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    deleteBanner = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/banner/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}
const bannerSvc = new BannerService()

export default bannerSvc;