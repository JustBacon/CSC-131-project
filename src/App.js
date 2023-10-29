import './styles/App.css';
import { HomePage } from './pages/HomePage';
import { TestlistPage } from './pages/TestlistPage';
import { LoginPage } from './pages/LoginPage';
import { FormPage } from './pages/FormPage';
import { ErrorPage } from './pages/ErrorPage';
import { DataProvider } from './context/dataContext';
import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/SignUpPage';
import { Protected } from './component/protected';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Protected />} >
                <Route path="/" index element={<HomePage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/testlist/:deviceName" element={<TestlistPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </DataProvider>
        </AuthProvider>

      </header>
    </div>
  );
}

export default App;
