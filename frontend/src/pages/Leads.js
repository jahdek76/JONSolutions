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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import axios from 'axios';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/api/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/leads', newLead);
      setOpen(false);
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add New Lead
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small">
                    Schedule Call
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Leads; 