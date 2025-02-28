import { useEffect, useState } from 'react';
import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import './app.css';

type IUser = {
  login: string;
  password: string;
  email: string;
}

interface UserProps {
  user: IUser;
}

const User = ({ user }: UserProps) => {
  return (
    <article className="user">
      <h2>{user.login}</h2>
      <p>{user.email}</p>
    </article>
  )
}

interface CustomElements extends HTMLFormControlsCollection {
  login: HTMLInputElement;
  password: HTMLInputElement;
  email: HTMLInputElement;
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

interface RegisterProps {
  onPost: () => void;
}

const Register = ( {onPost}: RegisterProps) => {
  const handleSubmit = (e: React.FormEvent<CustomForm>) => {
    e.preventDefault();
    const target = e.currentTarget.elements;
    axios
      .post('/user_api/users', {
        login: target.login.value,
        password: target.password.value,
        email: target.email.value
      })
      .then(() => {
        onPost();
        e.currentTarget.reset();
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-input">
        <label htmlFor="login">Login:</label>
        <input type="text" id="login" name="login" />
      </div>
      <div className="form-input">
        <label htmlFor="">Password:</label>
        <input type="text" id="password" name="password" />
      </div>
      <div className="form-input">
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" />
      </div>
      <div>
        <button type="submit">Create New User</button>
      </div>
    </form>
  )
}

const App = () => {
  const [users, setUsers] = useState<Array<IUser>>([]);

  const fetchUsers = () => {
    axios
      .get('/user_api/users')
      .then((res: AxiosResponse) => {
        setUsers(res.data);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  return (
    <div className="app">
      <div className="user-container">
        <section className="users">
          {!users.length && <p>No users</p>}
          {users.map((user) => {
            return (
              <User user={user}/>
            )
          })}
        </section>
        <Register onPost={fetchUsers}/>
      </div>
    </div>
  );
}

export default App;