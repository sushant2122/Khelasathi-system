

import BaseHttpService from "../config/http.config";

export type BannerType = {
    title: string;
    link: string;
    is_active: boolean;
    image_url: FileList;
};

class FutsalService extends BaseHttpService {



    createFutsal = async (data: any) => {
        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('location', data.location);
            formData.append('maplink', data.mapLink);
            formData.append('contact_number', data.contactNumber);
            formData.append('pan_number', data.panNumber);

            if (data.citizenshipFrontUrl[0]) {
                formData.append('citizenship_front_url', data.citizenshipFrontUrl[0]);
            }
            if (data.citizenshipBackUrl[0]) {
                formData.append('citizenship_back_url', data.citizenshipBackUrl[0]);
            }
            if (data.imageUrl[0]) {
                formData.append('image_url', data.imageUrl[0]);
            }
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/futsal',
                formData, { file: true, auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listFutsal = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listHomeFutsal = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal/list-home'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listForFutsal = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal/list-futsal'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    FutsalDetail = async (slug: string) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal/' + slug
            );

            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    futsalImages = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal-image/show-home/' + id
            );

            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listFutsalImagesForVenue = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal-image/', { auth: true }
            );

            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    createFutsalImage = async (data: any) => {
        try {

            const formData = new FormData();
            formData.append("caption", data.caption);
            formData.append("is_active", String(data.is_active));
            formData.append("image", data.image[0]);
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/futsal-image',
                formData, { file: true, auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    updateFutsalImageDetail = async (id: number, data: any) => {
        try {
            const formData = new FormData();
            formData.append("caption", data.caption);
            formData.append("is_active", String(data.is_active));

            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/futsal-image/${id}`, formData, { auth: true, file: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    deleteFutsalImage = async (id: number) => {
        try {
            const response = await this.deleteRequest(
                import.meta.env.VITE_API_VERSION + `/futsal-image/${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listFutsalVerificationDetail = async (page: number = 1) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/futsal/futsaldetail/1?page=${page}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    getUserFutsalDetail = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal/venue-futsal', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    verifyFutsal = async (id: number, data: any) => {
        try {
            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/futsal/verify-futsal/${id}`,
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    FutsalProfileDetail = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/futsal/registered-futsal', { auth: true }
            );

            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    updateFutsalDetail = async (data: any) => {
        try {
            console.log("transfer", data);
            const formData = new FormData();

            // Append text fields
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("is_active", String(data.is_active));
            formData.append("location", data.location);
            formData.append("contact_number", data.contact_number);
            formData.append("pan_number", data.pan_number);
            if (data.maplink) {
                formData.append("maplink", data.maplink);
            }

            // Append files correctly
            if (data.image_url && data.image_url instanceof File) {
                formData.append('image_url', data.image_url);
            } else if (Array.isArray(data.image_url) && data.image_url.length > 0) {
                formData.append('image_url', data.image_url[0]);
            }

            if (data.citizenship_front_url && data.citizenship_front_url instanceof File) {
                formData.append('citizenship_front_url', data.citizenship_front_url);
            } else if (Array.isArray(data.citizenship_front_url) && data.citizenship_front_url.length > 0) {
                formData.append('citizenship_front_url', data.citizenship_front_url[0]);
            }

            if (data.citizenship_back_url && data.citizenship_back_url instanceof File) {
                formData.append('citizenship_back_url', data.citizenship_back_url);
            } else if (Array.isArray(data.citizenship_back_url) && data.citizenship_back_url.length > 0) {
                formData.append('citizenship_back_url', data.citizenship_back_url[0]);
            }

            console.log("Formdata entries:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/futsal/updateprofile`,
                formData,
                { auth: true, file: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}

const futsalSvc = new FutsalService()

export default futsalSvc;