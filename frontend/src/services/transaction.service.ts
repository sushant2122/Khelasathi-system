

import BaseHttpService from "../config/http.config";


class TransactionService extends BaseHttpService {


    listTransactions = async (page: number = 1) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/transaction?page=${page}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    listVenueTransactions = async (page: number = 1) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/transaction/venue-transaction?page=${page}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    listUserTransaction = async (page: number = 1, limit: number = 10) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/transaction/user-transaction?page=${page}&limit=${limit}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

    callbackKhalti = async (paymentData: any) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/transaction/callbackkhalti', paymentData

            );
            return response;
        } catch (exception) {
            throw exception;
        }
    }


}

const transactionSvc = new TransactionService()

export default transactionSvc;