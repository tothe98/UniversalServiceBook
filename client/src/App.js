import { Container, createTheme, ThemeProvider } from '@mui/material';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React, { Component } from 'react';
import Home from './pages/Home'
import theme from './themes/theme'
import Garage from './pages/Garage';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="l">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/garage" element={<Garage />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
