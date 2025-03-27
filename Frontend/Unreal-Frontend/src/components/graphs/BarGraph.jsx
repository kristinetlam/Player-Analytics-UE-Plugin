import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

// ORIGINAL HARD CODED BAR CHART
// export default function BasicBars() {
//   return (
//     <BarChart
//       xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
//       series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
//       width={500}
//       height={300}
//     />
//   );
// }


export default function BasicBars() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data from the Flask API
    console.log('API Secret Token:', import.meta.env.VITE_API_SECRET_TOKEN);
    console.log(import.meta.env);

    const fetchData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-interaction-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result)
        // setData(transformData(result.Interactions)); // Assuming the data needs transformation
        const interactionCounts = countInteractions(result.Interactions);
        setData(interactionCounts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // // Example transformation function
  // const transformData = (interactions) => {
  //   // Transform the data into the format required by your chart
  //   // This is a dummy transformation
  //   return interactions.map(interaction => ({
  //     x: interaction.eventType,
  //     y: interaction.count
  //   }));
  // };

  const countInteractions = (interactions) => {
    // Count occurrences of 'Picked Up Rifle'
    const interactionMap = interactions.reduce((acc, interaction) => {
      const description = interaction.InteractionDescription; // Ensure this matches your JSON structure
      if (description === 'Picked Up Rifle') {
        acc[description] = (acc[description] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(interactionMap).map(([description, count]) => ({
      x: description, // The interaction description (e.g., 'Picked Up Rifle')
      y: count,       // The count of interactions
    }));
  };

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(item => item.x) }]}  // x-axis labels (interaction descriptions)
      series={[{ data: data.map(item => item.y) }]}  // y-axis values (counts)
      width={500}
      height={300}
    />
  );
}




// import * as React from 'react';
// import { BarChart, useDrawingArea, useXScale, useYScale } from '@mui/x-charts';
// import { styled } from '@mui/material/styles';

// const StyledPath = styled('path')(({ theme, color }) => ({
//   fill: 'none',
//   stroke: '#cccccc',
//   shapeRendering: 'crispEdges',
//   strokeWidth: 1,
//   pointerEvents: 'none',
// }));
// function CartesianGrid() {
//   const { left, top, width, height } = useDrawingArea();
//   const xAxisScale = useXScale();
//   const yAxisScale = useYScale();

//   // Manually define xTicks for band scale
//   // const xTicks = xAxisScale.domain(); // This should fetch the categorical domains directly
//   const yTicks = yAxisScale.ticks(); // This continues to work for numerical y-scales

//   return (
//     <React.Fragment>
//       {yTicks.map((value) => (
//         <StyledPath
//           key={`y-${value}`}
//           d={`M ${left} ${yAxisScale(value)} l ${width} 0`}
//           color="secondary"
//         />
//       ))}
//       {/* {xTicks.map((value, index) => (
//         <StyledPath
//           key={`x-${value}`}
//           d={`M ${xAxisScale(value) + xAxisScale.bandwidth() / 2} ${top} l 0 ${height}`} // Center the line in the band
//           color="secondary"
//         />
//       ))} */}
//     </React.Fragment>
//   );
// }

// export default function BasicBars() {
//   return (
//     <BarChart
//       xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
//       series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
//       width={500}
//       height={300}
//     >
//       <CartesianGrid />
//     </BarChart>
//   );
// }

