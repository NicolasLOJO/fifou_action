import './App.css';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { Login } from './login/Login';
import { Queue } from './queue/Queue';
import socket from '../lib/socket';
socket.setSocket();
function App() {
  const [user, setUser] = useState<string>();
  const handleLogin = (username: string) => {
    setUser(username);
    socket.initSocket((socket) => {
      socket.emit('set user', username);
    });

  }
  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: 'dark'
      }
    })}>
      <CssBaseline />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box>
              <h3>Fifou action {user}</h3>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!user && <Login handleLogin={handleLogin} />}
            {user && <Queue user={user} />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
