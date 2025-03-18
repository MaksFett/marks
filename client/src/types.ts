export type IUser = {
    login: string;
    email: string;
    password: string;
} | null

export type IShortUser = Omit<IUser, "password">

export type IStudent = {
    id: number;
    fio: string;
    group: string;
    enter_year: number;
}

export type IShortStudent = Omit<IStudent, "group" | "enter_year">

export type ISubject = {
    id: number;
    name: string;
}

export type IGrade = {
    student_id: number;
    subject_id: number;
    value: number | null;
}

export type AuthProps = {
    isAuth: boolean;
    setisauth: (f: boolean) => void;
}
