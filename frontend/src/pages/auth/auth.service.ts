import BaseHttpService from "../../config/http.config";
import { ForgotType } from "../forgot-password/forgot-password.pages";
import { UpdateType } from "../profile/user.profile.pages";
import { ResetType } from "../reset-password/reset-password.pages";
import { ChangeType } from "../setting/user.setting.pages";
import { CredentialType } from "./signin/signin.pages";
import { RegisterType } from "./signup/signup.pages";

class AuthService extends BaseHttpService {

    login = async (data: CredentialType) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/auth/signin',
                data
            );

            localStorage.setItem('access', response.data.token.access);
            localStorage.setItem('refresh', response.data.token.refresh);
            return response;


        } catch (exception: any) {
            throw exception;
        }
    }

    register = async (data: RegisterType) => {
        try {

            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("confirmpassword", data.confirmpassword);
            formData.append("full_name", data.full_name);
            formData.append("contact_number", data.contact_number);
            formData.append("role_title", data.role_title);
            formData.append("address", data.address);
            formData.append("profile_img", data.profile_img[0]);
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/auth/signup',
                formData, { file: true }

            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    activateUser = async (token: string) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/auth/activate/' + token,
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    resendActivationToken = async (token: string) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/auth/re-send/activation/' + token,
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    getLoggedInUser = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/auth/me', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    forgotPassword = async (data: ForgotType) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/auth/forget-password',
                data
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    resetPassword = async (data: ResetType, token: string) => {
        try {
            const response = await this.patchRequest(
                import.meta.env.VITE_API_VERSION + '/auth/reset-password/' + token,
                data
            );

            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    changePassword = async (data: ChangeType) => {
        try {
            const response = await this.patchRequest(
                import.meta.env.VITE_API_VERSION + '/auth/change-password',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    update = async (data: UpdateType) => {
        try {
            const formData = new FormData();
            if (data.full_name) {
                formData.append("full_name", data.full_name);
            }
            if (data.contact_number) {
                formData.append("contact_number", data.contact_number);
            }
            if (data.address) {
                formData.append("address", data.address);
            }
            if (data.profile_img && data.profile_img[0]) {
                formData.append("profile_img", data.profile_img[0]);
            }
            console.log(formData);
            const response = await this.patchRequest(
                import.meta.env.VITE_API_VERSION + '/auth/update',
                formData, { auth: true, file: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
}

const authSvc = new AuthService()

export default authSvc;