const Chart = require('chart.js');

// Test scores
const testNames = ['Test 1', 'Test 2', 'Test 3'];
const scores = [80, 90, 95];

// Create the chart data
const chartData = {
  labels: testNames,
  datasets: [{
    label: 'Scores',
    data: scores,
    backgroundColor: 'rgba(54, 162, 235, 0.6)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
};

// Render the chart on the client-side
const renderChart = () => {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
};

module.exports = renderChart;
