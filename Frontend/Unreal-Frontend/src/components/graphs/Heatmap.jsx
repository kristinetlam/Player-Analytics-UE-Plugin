import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    // Example data for the heatmap
    const data = [
        {
            name: '10:00',
            data: [45, 52, 38, 45, 19, 23, 2, 48]
        },
        {
            name: '10:30',
            data: [35, 41, 62, 55, 65, 21, 30, 45]
        },
        {
            name: '11:00',
            data: [27, 32, 34, 52, 18, 10, 9, 24]
        },
        {
            name: '11:30',
            data: [17, 22, 24, 52, 28, 10, 29, 34]
        },
        {
            name: '12:00',
            data: [15, 25, 14, 26, 18, 5, 3, 14]
        },
        {
            name: '12:30',
            data: [25, 15, 14, 26, 38, 35, 33, 24]
        }
    ];

    // Example colors for the heatmap
    const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5'];

    const [state, setState] = React.useState({
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
          xaxis: {
            type: 'category',
            categories: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30']
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


