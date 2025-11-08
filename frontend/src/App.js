import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './components/routing/Routing';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
