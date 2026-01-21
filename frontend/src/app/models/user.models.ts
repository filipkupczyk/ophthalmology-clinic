export enum Role {
    ADMIN = 'ADMIN',
    SECRETARY = 'SECRETARY',
    PATIENT = 'PATIENT',
    DOCTOR = 'DOCTOR'
}

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
    doctorId?: number,
}
