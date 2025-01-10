import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import axios from 'axios';
import config from '../config';

function Calls() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/calls`);
      setCalls(response.data);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const handleInitiateCall = async (callId) => {
    try {
      const response = await axios.post(`${config.apiUrl}/calls/initiate/${callId}`);
      // Handle the audio stream and text response
      console.log(response.data);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call._id}>
                <TableCell>{call.leadId?.name}</TableCell>
                <TableCell>{call.status}</TableCell>
                <TableCell>{new Date(call.timestamp).toLocaleString()}</TableCell>
                <TableCell>{call.duration || '-'}</TableCell>
                <TableCell>
                  {call.status === 'scheduled' && (
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleInitiateCall(call._id)}
                    >
                      Start Call
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Calls; 