import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ImpactChart = ({ data }) => {
  const impactCounts = {
    High: 0,
    Medium: 0,
    Low: 0,
    Informational: 0,
  };
  
  data.forEach(finding => {
    impactCounts[finding.Impact]++;
  });
  
  const chartData = [
    { name: 'High', count: impactCounts['High'] },
    { name: 'Medium', count: impactCounts['Medium'] },
    { name: 'Low', count: impactCounts['Low'] },
    { name: 'Informational', count: impactCounts['Informational'] }
    ];

  return (
    <BarChart
      width={500}
      height={300}
      data={chartData}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
}


export default ImpactChart;
