import { useState } from 'react';
import UsersApi from '../../apis/usersApi';
import { IUser } from '../../types/interfaces';

interface Props {
  onLogin: (user: IUser) => void;
}

export default function Login(props: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(false);
    try {
      const user = await UsersApi.login(name);
      if (user) {
        props.onLogin(user);
      }
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="input-container">
        <label className="label">Your name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button disabled={!name || loading} onClick={handleLogin}>
        {loading ? 'Loading...' : 'START'}
      </button>
      {error && (
        <p className="error">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
