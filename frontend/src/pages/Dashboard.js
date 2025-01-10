import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeCalls: 0,
    completedCalls: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Leads
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalLeads}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Calls
            </Typography>
            <Typography component="p" variant="h4">
              {stats.activeCalls}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Completed Calls
            </Typography>
            <Typography component="p" variant="h4">
              {stats.completedCalls}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 