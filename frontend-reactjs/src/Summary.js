import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';

function Summary({ data }) {
  const createBins = (contracts) => {
    const bins = [
      { range: '0-25', count: 0, color: 'gray' },
      { range: '26-50', count: 0, color: 'green' },
      { range: '51-75', count: 0, color: 'orange' },
      { range: '76-100', count: 0, color: 'red' },
    ];

    // Check if contracts is defined before calling forEach on it
    if (contracts) {
      contracts.forEach((contract) => {
        if (contract.RiskScore <= 25) {
          bins[0].count += 1;
        } else if (contract.RiskScore <= 50) {
          bins[1].count += 1;
        } else if (contract.RiskScore <= 75) {
          bins[2].count += 1;
        } else {
          bins[3].count += 1;
        }
      });
    }

    return bins;
  };

  // Check if data, data.polygon_contacts, and data.ethereum_contacts are defined
  const polygonRiskBins = data && data.polygon_contacts ? createBins(data.polygon_contacts) : [];
  const ethereumRiskBins = data && data.ethereum_contacts ? createBins(data.ethereum_contacts) : [];


 return (
    <div>
      <h2>Summary</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <h3>Polygon Contracts</h3>
          {polygonRiskBins.map((bin, index) => (
            <Card style={{ backgroundColor: bin.color, margin: '10px' }} key={index}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Risk Score: {bin.range}
                </Typography>
                <Typography variant="h5" component="h2">
                  Count: {bin.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <RiskChart data={polygonRiskBins} title="Polygon Risk Score Distribution" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <h3>Ethereum Contracts</h3>
          {ethereumRiskBins.map((bin, index) => (
            <Card style={{ backgroundColor: bin.color, margin: '10px' }} key={index}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Risk Score: {bin.range}
                </Typography>
                <Typography variant="h5" component="h2">
                  Count: {bin.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <RiskChart data={ethereumRiskBins} title="Ethereum Risk Score Distribution" />
        </Grid>
      </Grid>
    </div>
  );
}

const RiskChart = ({ data, title }) => (
  <BarChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5, right: 30, left: 20, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="range" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="count" fill="#8884d8" />
  </BarChart>
);

export default Summary;
