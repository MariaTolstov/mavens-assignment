import './App.css';
import Main from './components/Main';
import UserContextProvider from './store/UserContext';

function App() {
  return (
    <UserContextProvider>
      <div className="App">
        <Main />
      </div>
    </UserContextProvider>
  );
}

export default App;
