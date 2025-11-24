import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './components/routing/Routing';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
