

import BaseHttpService from "../config/http.config";
import { ContactType } from "../pages/contactus/contactus.pages";


class ContactService extends BaseHttpService {
    sendMail = async (data: ContactType) => {
        try {

            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/contactus',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
}

const contactSvc = new ContactService()

export default contactSvc;