

import BaseHttpService from "../config/http.config";
import { BookingFormData } from "../pages/futsaldetail/futsaldetail.pages";



class BookingService extends BaseHttpService {



    createBookingKhalti = async (data: BookingFormData) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/booking',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }

    createBookingPoint = async (data: BookingFormData) => {
        try {
            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/booking/credit-booking',
                data, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    listBookingUser = async (page: number = 1, limit: number = 10) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/booking/list-home?page=${page}&limit=${limit}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    getBookngSats = async () => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + '/booking/list-userdetails', { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    cancelBooking = async (id: number) => {
        try {
            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + '/booking/cancel-booking/' + id, {}, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listBookingAccVenue = async (id: number, page: number = 1) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/booking/booking-futsal/${id}?page=${page}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listBookingOfVenue = async (page: number = 1) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/booking/booking-of-futsal?page=${page}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }

}

const bookingSvc = new BookingService()

export default bookingSvc;