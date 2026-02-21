
import BaseHttpService from "../config/http.config";

class CreditService extends BaseHttpService {

    listPoints = async (page: number = 1, limit: number = 10, type?: string) => {
        try {
            let url = `${import.meta.env.VITE_API_VERSION}/credit-point/list-home?page=${page}&limit=${limit}`;

            if (type && type !== 'All') {
                url += `&type=${type}`;
            }

            const response = await this.getRequest(url, { auth: true });
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    calculatePoints = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/credit-point/view-point', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}

const creditSvc = new CreditService()

export default creditSvc;