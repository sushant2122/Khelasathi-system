
import BaseHttpService from "../config/http.config";
import { TagType } from "../pages/tag/tag.page";

class CourtService extends BaseHttpService {
    createCourt = async (data: TagType) => {
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

    listCourts = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/court', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    listFutsalCourts = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/court/show-home/' + id, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}
const courtSvc = new CourtService()
export default courtSvc;