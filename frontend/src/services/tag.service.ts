

import BaseHttpService from "../config/http.config";
import { TagType } from "../pages/tag/tag.page";


class TagService extends BaseHttpService {

    createTag = async (data: TagType) => {
        try {

            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/tag',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    listTags = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/tag', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    listFutsalTags = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/tag/list-home/' + id,
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    updateTagDetail = async (id: number, data: any) => {
        try {

            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/tag/${id}`, data, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    deleteTag = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/tag/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

}

const tagSvc = new TagService()

export default tagSvc;