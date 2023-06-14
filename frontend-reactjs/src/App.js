import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Toolbar, Box, Typography, Tabs, Tab } from '@material-ui/core';
import axios from 'axios';
import Summary from './Summary';
import PolygonContracts from './PolygonContracts';
import EthereumContracts from './EthereumContracts';
import PolygonRiskScoreForm from './PolygonRiskScoreForm';
import EthereumRiskScoreForm from './EthereumRiskScoreForm';

// Create a dark theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://3.108.126.225:8080/api/get_all_contract_stats_summary'); // Replace with your API link
      setData(result.data);
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!data) {
    return 'Loading...';
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src="https://getsecured.ai/images/getsecured-logo.png" alt="GETSecured" height="60" />
          <Box flexGrow={1} />
          <Typography variant="h4">
            OracleSentry
          </Typography>
        </Toolbar>
      </AppBar>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Summary" />
        <Tab label="Polygon Smart Contract Audit" />
        <Tab label="Ethereum Smart Contract Audit" />
        <Tab label="Leaderboard: Polygon" />
        <Tab label="Leaderboard: Ethereum" />
      </Tabs>
      {value === 0 && <Summary data={data} />}
      {value === 1 && <PolygonRiskScoreForm />}
      {value === 2 && <EthereumRiskScoreForm />}
      {value === 3 && <PolygonContracts data={data} page={page} rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />}
      {value === 4 && <EthereumContracts data={data} page={page} rowsPerPage={rowsPerPage} handleChangePage={handleChangePage} handleChangeRowsPerPage={handleChangeRowsPerPage} />}
    </ThemeProvider>
  );
}

export default App;
