import { useContext } from 'react';
import Game from './Game/Game';
import Login from './Login/Login';
import { UserContextType, UserContext } from '../store/UserContext';

export default function Main() {
  const { user, setUser } = useContext(UserContext) as UserContextType;
  return (
    <div className="main">{user ? <Game /> : <Login onLogin={setUser} />}</div>
  );
}
