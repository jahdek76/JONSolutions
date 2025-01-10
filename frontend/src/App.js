import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calls from './pages/Calls';
import Training from './pages/Training';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/training" element={<Training />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 