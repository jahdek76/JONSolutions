import React, { useState } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';

function Training() {
  const [tab, setTab] = useState(0);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      let response;
      if (tab === 0) {
        response = await axios.post('/api/training/text', { content: text });
      } else if (tab === 1) {
        response = await axios.post('/api/training/url', { url });
      } else {
        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post('/api/training/file', formData);
      }
      setResult(response.data.processedData);
    } catch (error) {
      console.error('Error training:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Text" />
          <Tab label="URL" />
          <Tab label="File" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === 0 && (
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Enter training text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
          {tab === 1 && (
            <TextField
              fullWidth
              label="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          )}
          {tab === 2 && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Process
          </Button>

          {result && (
            <Paper sx={{ mt: 2, p: 2 }}>
              <Typography variant="h6">Processing Result:</Typography>
              <Typography>{result}</Typography>
            </Paper>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Training; 