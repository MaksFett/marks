import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosError } from "axios"; // Импортируем AxiosError для типизации ошибки
import { IUser } from "../types";

class UserStore {
    isAuth: boolean = false;
    user: IUser | null = null;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    checkAuth = async () => {
        try {
            await axios.get("/user_api/users/get_login");
            runInAction(() => {
                this.isAuth = true;
            });
        } catch (error: any) {
            if ((error as AxiosError).response?.status === 401) {
                try {
                    const res = await axios.post("/user_api/users/refresh");
                    localStorage.setItem("access-token", res.data.access_token);
                    runInAction(() => {
                        this.isAuth = true;
                    });
                } catch {
                    runInAction(() => {
                        this.isAuth = false;
                    });
                }
            } else {
                console.error("Неизвестная ошибка:", error);
                runInAction(() => {
                    this.isAuth = false;
                });
            }
        }
    };
    

    fetchUser = async () => {
        this.isLoading = true;
        try {
        const response = await axios.get("/user_api/users/get_user");
        runInAction(() => {
            this.user = response.data.user;
            console.log(this.user)
            this.isLoading = false;
        });
        } catch (error) {
        runInAction(() => {
            this.isLoading = false;
        });
        }
    };

    logout = async () => {
        await axios.post("/user_api/users/logout");
        this.isAuth = false;
        this.user = null;
    }
}

export default new UserStore();
