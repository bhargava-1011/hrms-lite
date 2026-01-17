import { useState } from 'react';
import { Header, Navigation, Footer } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Employees } from './components/Employees';
import { Attendance } from './components/Attendance';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <div className="container">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'employees' && <Employees />}
          {activeTab === 'attendance' && <Attendance />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
