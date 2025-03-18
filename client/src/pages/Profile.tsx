import React, { useEffect } from "react";
import { useGetUserQuery } from "../store/userApiSlice";
import { AuthProps } from "../types";
import Header from "../components/Header";

const Profile: React.FC<AuthProps> = ({isAuth, setisauth}) => {
    //const [user, setUser] = useState<IUser | null>(null);
    const { data: user, isLoading } = useGetUserQuery();

    /*useEffect(() => {

        axios.get("/user_api/users/get_user", { withCredentials: true})
            .then((response) => setUser(response.data.user as IUser))
            .catch(() => navigate('/login'));
    }, []);*/
    useEffect(() => {
        console.log(user);
    }, [user])

    if (isLoading) return <div>Загрузка...</div> 

    if (!user) return null
    
    return (
        <div>
            <Header isAuth={isAuth} setisauth={setisauth}/>
            <h1>Личный кабинет</h1>
            <p><strong>Здравствуйте,</strong> {user.login}</p>
            <p><strong>Ваш Email:</strong> {user.email}</p>
        </div>
    );
};

export default Profile;
