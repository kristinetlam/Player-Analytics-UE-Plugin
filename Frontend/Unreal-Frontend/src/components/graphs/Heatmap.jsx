import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {

  let positionalData = [];
  let xLabels = [];

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        
        const response = await fetch('http://' + "50.30.211.229:5000" + '/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch FPS data');

        const result = await response.json();
        console.log(result);

        const binSize = 30;
        const positionData = result['Positions'];

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        positionData.forEach((item, i) => {
          // const [year, month, day] = item.Timestamp.split('-')[0].split('.').map(Number);
          // const date = new Date(year, month - 1, day);
          // const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const pos = item.Position;
          if (pos[0] < minX) minX = pos[0];
          if (pos[0] > maxX) maxX = pos[0];

          if (pos[1] < minY) minY = pos[1];
          if (pos[1] > maxY) maxY = pos[1];

          if (pos[2] < minZ) minZ = pos[2];
          if (pos[2] > maxZ) maxZ = pos[2];
        });

        console.log("Minimum (x,y,z): " + minX + ", " + minY + ", " + minZ);
        console.log("Maximum (x,y,z): " + maxX + ", " + maxY + ", " + maxZ);

        const createIntervals = (min, max, steps) => {
          const interval = (max - min) / steps;
          return Array.from({ length: steps + 1 }, (_, i) => min + i * interval);
        };

        const xCategories = createIntervals(minX, maxX, binSize);
        const yCategories = createIntervals(minY, maxY, binSize);
        const zCategories = createIntervals(minZ, maxZ, binSize);

        const data = [];
        const categories = [];

        yCategories.forEach(yBin => {
          if(yBin != yCategories[binSize]){

            data.push({
              name: `${yBin.toFixed(2)}`,
              data: Array(binSize).fill(0)
            })
          }
        });

        xCategories.forEach(xBin => {
          if(xBin != xCategories[binSize]){
            categories.push(`${xBin.toFixed(2)}`);
          }
        });



        // Get's the frequency of the player's position.
        positionData.forEach(item => {
          const pos = item.Position;
          for(var i = 1; i < binSize+1; i++){
            if(pos[1] < (yCategories[i]+.0001) && pos[1] >= yCategories[i-1]){

              for(var j = 1; j < binSize+1; j++){
                if(pos[0] < (xCategories[j]+.0001) && pos[0] >= xCategories[j-1]){

                  data[i-1].data[j-1]++;

                }
              }

            }
          }
        });



        
        setState({
          series: data,
          options: {
            chart: {
              height: 450,
              type: 'heatmap', 
            },
            dataLabels: {
              enabled: false
            },
            colors: colors,
            fontFamily: "Avenir",
            fontWeight: 400,
            xaxis: {
              type: 'category',
              categories: categories
            },
            grid: {
              padding: {
                right: 20
              }
            },
            // title: {
            //   text: "Currently: X-Position vs Y-Position"
            // }
          },
      });

      console.log(data);
      console.log(categories);

      } catch (error) {
        console.error('Error fetching FPS data:', error);
      }
    };

    fetchPositionData();
    
  }, []);

    // // Example data for the heatmap
    // const data = [
    //     {
    //         name: '10:00',
    //         data: [45, 52, 38, 45, 19, 23, 2, 48]
    //     },
    //     {
    //         name: '10:30',
    //         data: [35, 41, 62, 55, 65, 21, 30, 45]
    //     },
    //     {
    //         name: '11:00',
    //         data: [27, 32, 34, 52, 18, 10, 9, 24]
    //     },
    //     {
    //         name: '11:30',
    //         data: [17, 22, 24, 52, 28, 10, 29, 34]
    //     },
    //     {
    //         name: '12:00',
    //         data: [15, 25, 14, 26, 18, 5, 3, 14]
    //     },
    //     {
    //         name: '12:30',
    //         data: [25, 15, 14, 26, 38, 35, 33, 24]
    //     }
    // ];

    // Example colors for the heatmap
    const colors = ['#008FFB'];

    const [state, setState] = React.useState({
        series: [],
        options: {
          chart: {
            height: 450,
            type: 'heatmap', 
          },
          dataLabels: {
            enabled: false
          },
          colors: colors,
          xaxis: {
            type: 'category',
            categories: [],
          },
          grid: {
            padding: {
              right: 20
            }
          }
        },
    });

    return (
      <div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="heatmap" height={450} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
}

export default ApexChart;


