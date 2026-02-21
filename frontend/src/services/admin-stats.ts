
import BaseHttpService from "../config/http.config";


class AdminStatsService extends BaseHttpService {
    listAdminStats = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/admin-stats/list-adminstats', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listForVenueWithChart = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/admin-stats/top-venue'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listForMonthlyRevenue = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/admin-stats/monthly-revenue'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listBookingStatus = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/admin-stats/booking-status'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listLatestTransaction = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/admin-stats/latest-transaction'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}

const adminStatsSvc = new AdminStatsService()

export default adminStatsSvc;