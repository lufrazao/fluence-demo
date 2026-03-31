import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Context
import { SimulationProvider } from './context/SimulationContext';

// Pages
import ConversionDemo from './pages/ConversionDemo';
import Comparativo from './pages/Comparativo';
import ComoFunciona from './pages/ComoFunciona';
import Impacto from './pages/Impacto';
import APIExplorer from './pages/APIExplorer';

function App() {
  return (
    <SimulationProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ConversionDemo />} />
            <Route path="comparativo" element={<Comparativo />} />
            <Route path="como-funciona" element={<ComoFunciona />} />
            <Route path="impacto" element={<Impacto />} />
            <Route path="api-explorer" element={<APIExplorer />} />
          </Route>
        </Routes>
      </Router>
    </SimulationProvider>
  );
}

export default App;
