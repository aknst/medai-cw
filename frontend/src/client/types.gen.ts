// This file is auto-generated by @hey-api/openapi-ts

export type AppointmentCreateDoctor = {
    /**
     * UUID пациента
     */
    patient_id: string;
    /**
     * Жалобы пациента
     */
    complaints?: (string | null);
    /**
     * Диагноз врача
     */
    doctor_diagnosis?: (string | null);
    /**
     * Рекомендации врача
     */
    doctor_recommendations?: (string | null);
    /**
     * Диагноз от NLP
     */
    nlp_diagnosis?: (string | null);
    /**
     * Рекомендации от NLP
     */
    nlp_recommendations?: (string | null);
};

export type AppointmentCreatePatient = {
    /**
     * Жалобы пациента
     */
    complaints: string;
    /**
     * (необязательно) UUID врача
     */
    doctor_id?: string;
};

export type AppointmentPublic = {
    complaints?: (string | null);
    doctor_diagnosis?: (string | null);
    doctor_recommendations?: (string | null);
    nlp_recommendations?: (string | null);
    nlp_diagnosis?: (string | null);
    status?: AppointmentStatus;
    id: string;
    patient_id: (string | null);
    doctor_id: (string | null);
    created_at: string;
    updated_at: string;
    patient: (AppointmentUser | null);
    doctor: (AppointmentUser | null);
};

export type AppointmentsPublic = {
    data: Array<AppointmentPublic>;
    count: number;
};

export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export type AppointmentUpdate = {
    complaints?: (string | null);
    doctor_diagnosis?: (string | null);
    doctor_recommendations?: (string | null);
    nlp_recommendations?: (string | null);
    nlp_diagnosis?: (string | null);
    status?: (AppointmentStatus | null);
};

export type AppointmentUser = {
    id: string;
    full_name: (string | null);
    email: string;
    birth_date: (string | null);
    gender: (UserGender | null);
};

export type Body_login_login_access_token = {
    grant_type?: (string | null);
    username: string;
    password: string;
    scope?: string;
    client_id?: (string | null);
    client_secret?: (string | null);
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type InferenceRequest = {
    gender: UserGender;
    age: number;
    complaints: string;
};

export type InferenceResponse = {
    diagnosis: string;
    recommendations: string;
};

export type Message = {
    message: string;
};

export type NewPassword = {
    token: string;
    new_password: string;
};

export type PrivateUserCreate = {
    email: string;
    password: string;
    full_name: string;
    is_verified?: boolean;
};

export type Token = {
    access_token: string;
    token_type?: string;
};

export type UpdatePassword = {
    current_password: string;
    new_password: string;
};

export type UserCreate = {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    role?: UserRole;
    gender?: UserGender;
    full_name?: (string | null);
    birth_date?: (string | null);
    password: string;
};

export type UserGender = 'male' | 'female';

export type UserPublic = {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    role?: UserRole;
    gender?: UserGender;
    full_name?: (string | null);
    birth_date?: (string | null);
    id: string;
};

export type UserRegister = {
    email: string;
    password: string;
    full_name?: (string | null);
    birth_date: (string | null);
    gender?: UserGender;
};

export type UserRole = 'patient' | 'doctor';

export type UsersPublic = {
    data: Array<UserPublic>;
    count: number;
};

export type UserUpdate = {
    email?: (string | null);
    is_active?: boolean;
    is_superuser?: boolean;
    role?: UserRole;
    gender?: UserGender;
    full_name?: (string | null);
    birth_date?: (string | null);
    password?: (string | null);
};

export type UserUpdateMe = {
    full_name?: (string | null);
    email?: (string | null);
    birth_date?: (string | null);
    gender?: (UserGender | null);
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type AppointmentsReadAppointmentsData = {
    limit?: number;
    /**
     * Порядок сортировки по updated_at: asc или desc
     */
    order?: string;
    /**
     * Нечувствительный поиск по complaints, doctor_diagnosis, doctor_recommendations
     */
    search?: (string | null);
    skip?: number;
};

export type AppointmentsReadAppointmentsResponse = (AppointmentsPublic);

export type AppointmentsReadAppointmentData = {
    appointmentId: string;
};

export type AppointmentsReadAppointmentResponse = (AppointmentPublic);

export type AppointmentsUpdateAppointmentData = {
    appointmentId: string;
    requestBody: AppointmentUpdate;
};

export type AppointmentsUpdateAppointmentResponse = (AppointmentPublic);

export type AppointmentsDeleteAppointmentData = {
    appointmentId: string;
};

export type AppointmentsDeleteAppointmentResponse = (Message);

export type AppointmentsCreateAppointmentPatientData = {
    requestBody: AppointmentCreatePatient;
};

export type AppointmentsCreateAppointmentPatientResponse = (AppointmentPublic);

export type AppointmentsCreateAppointmentDoctorData = {
    requestBody: AppointmentCreateDoctor;
};

export type AppointmentsCreateAppointmentDoctorResponse = (AppointmentPublic);

export type InferenceRunInferenceData = {
    requestBody: InferenceRequest;
};

export type InferenceRunInferenceResponse = (InferenceResponse);

export type LoginLoginAccessTokenData = {
    formData: Body_login_login_access_token;
};

export type LoginLoginAccessTokenResponse = (Token);

export type LoginTestTokenResponse = (UserPublic);

export type LoginRecoverPasswordData = {
    email: string;
};

export type LoginRecoverPasswordResponse = (Message);

export type LoginResetPasswordData = {
    requestBody: NewPassword;
};

export type LoginResetPasswordResponse = (Message);

export type LoginRecoverPasswordHtmlContentData = {
    email: string;
};

export type LoginRecoverPasswordHtmlContentResponse = (string);

export type PrivateCreateUserData = {
    requestBody: PrivateUserCreate;
};

export type PrivateCreateUserResponse = (UserPublic);

export type UsersReadUsersData = {
    limit?: number;
    /**
     * Search by name or email
     */
    search?: (string | null);
    skip?: number;
};

export type UsersReadUsersResponse = (UsersPublic);

export type UsersCreateUserData = {
    requestBody: UserCreate;
};

export type UsersCreateUserResponse = (UserPublic);

export type UsersReadUserMeResponse = (UserPublic);

export type UsersDeleteUserMeResponse = (Message);

export type UsersUpdateUserMeData = {
    requestBody: UserUpdateMe;
};

export type UsersUpdateUserMeResponse = (UserPublic);

export type UsersUpdatePasswordMeData = {
    requestBody: UpdatePassword;
};

export type UsersUpdatePasswordMeResponse = (Message);

export type UsersRegisterUserData = {
    requestBody: UserRegister;
};

export type UsersRegisterUserResponse = (UserPublic);

export type UsersReadUserByIdData = {
    userId: string;
};

export type UsersReadUserByIdResponse = (UserPublic);

export type UsersUpdateUserData = {
    requestBody: UserUpdate;
    userId: string;
};

export type UsersUpdateUserResponse = (UserPublic);

export type UsersDeleteUserData = {
    userId: string;
};

export type UsersDeleteUserResponse = (Message);

export type UtilsTestEmailData = {
    emailTo: string;
};

export type UtilsTestEmailResponse = (Message);

export type UtilsHealthCheckResponse = (boolean);