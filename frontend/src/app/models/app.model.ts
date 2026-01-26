import { Doctor, User} from "./user.models";

export interface Appointment{ 
    id: number;
    doctor: Doctor;
    user: User;
    dateTime: string;
    active: boolean;
}

export interface CreateAppointmentRequest {
    patientId: number;
    doctorId: number;
    dateTime: string;
    active: boolean;
}

export interface UpdaAppointmentRequest {
    id: number;
    patientId: number;
    doctorId: number;
    dateTime: string;
    active: boolean;
}