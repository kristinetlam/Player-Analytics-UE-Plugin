import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const AverageSessionLength = () => {
  const [avgSessionLength, setAvgSessionLength] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-session-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const result = await response.json();
        const sessionData = result['Sessions']; // Array of session data
        const totalSessionLength = sessionData.reduce((acc, item) => acc + parseFloat(item.EndTime), 0); // Sum up EndTime values (session lengths)
        const avgSessionLengthValue = totalSessionLength / sessionData.length; // Calculate average session length

        setAvgSessionLength(avgSessionLengthValue); // Set the average session length
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, []);

  if (avgSessionLength === null) {
    return <Typography>Loading...</Typography>; // Show loading text while fetching
  }

  return (
    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
      {avgSessionLength.toFixed(2)} seconds
    </Typography>
  );
};

export default AverageSessionLength;
