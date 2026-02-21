

import BaseHttpService from "../config/http.config";


class SlotService extends BaseHttpService {



    createSlot = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("start_time", data.start_time);
            formData.append("end_time", data.end_time);
            formData.append("price", data.price);
            formData.append("credit_point", data.credit_point);
            formData.append("court_id", data.court_id);
            formData.append("is_active", data.is_active ? "true" : "false");


            const response = await this.postRequest(
                import.meta.env.VITE_API_VERSION + '/slot',
                formData, { auth: true }
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
    updateSlotDetail = async (id: number, data: any) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("credit_point", data.credit_point);
            formData.append("is_active", String(data.is_active));

            console.log("formdata", formData);
            const response = await this.putRequest(
                import.meta.env.VITE_API_VERSION + `/slot/${id}`, formData, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listSlots = async (id: number) => {
        try {
            const response = await this.getRequest(
                import.meta.env.VITE_API_VERSION + `/slot/?court_id=${id}`, { auth: true }
            );
            return response;

        } catch (exception: any) {
            throw exception;
        }
    }
    listFutsalSlots = async (id: number, date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const response = await this.getRequest(
                `${import.meta.env.VITE_API_VERSION}/slot/list-home/?courtId=${id}&date=${formattedDate}`
            );
            return response;
        } catch (exception: any) {
            throw exception;
        }
    }
}

const slotSvc = new SlotService()

export default slotSvc;