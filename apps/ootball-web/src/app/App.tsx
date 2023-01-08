import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './layout/AppBar';

export const App: React.FC = () => (
  <Container>
    <TopBar />
    <Box padding={'16px 0'}>
      <Outlet />
    </Box>
  </Container>
);

export default App;
