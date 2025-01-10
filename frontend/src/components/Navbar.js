import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rice Miller AI Caller
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/leads">Leads</Button>
        <Button color="inherit" component={Link} to="/calls">Calls</Button>
        <Button color="inherit" component={Link} to="/training">Training</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 