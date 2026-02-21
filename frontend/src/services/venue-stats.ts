

import BaseHttpService from "../config/http.config";


class VenueStatsService extends BaseHttpService {


    listVenueStats = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/venue-stats/stats', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listLatestBookings = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/venue-stats/latest-bookings'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listForMonthlyRevenue = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/venue-stats/monthly-revenue'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listBookingStatus = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/venue-stats/booking-status'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listLatestTransaction = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/venue-stats/latest-transactions'
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
}

const venueStatsSvc = new VenueStatsService()

export default venueStatsSvc;