import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, AppBar, Toolbar, Box, Link, TableFooter, TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Create a dark theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

// Styles for the Link component
const useStyles = makeStyles({
  link: {
    color: 'white',
    '&:hover': {
      color: 'blue',
    },
  },
});

function getRandomRiskScore(min = 10, max = 65) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function Leaderboard() {
  const classes = useStyles();
  // const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // useEffect(() => {
  //   fetch('https://api.coinpaprika.com/v1/coins')
  //     .then(response => response.json())
  //     .then(data => {
  //       const projects = data.map(coin => ({
  //         name: coin.name,
  //         score: Math.floor(Math.random() * 100),
  //         risk: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
  //         chainLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  //         logo: `https://coinpaprika.com/coin/${coin.id}`,
  //         website: coin.links && coin.links.website && coin.links.website[0],
  //         contract: '0x' + Math.random().toString(16).substr(2, 40),
  //         category: coin.type.charAt(0).toUpperCase() + coin.type.slice(1),
  //       }));
  //       setProjects(projects);
  //     });
  // }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://0.0.0.0:8080/api/get_all_contract_stats_summary');
      setData(result.data);
    };

    fetchData();
  }, []);

  if (!data) {
    return 'Loading...';
  }

  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    <Tabs>
      <TabList>
        <Tab>Summary</Tab>
        {/* <Tab>Coinpaprika Contracts</Tab> */}
        <Tab>Polygon Contracts</Tab>
        <Tab>Ethereum Contracts</Tab>
      </TabList>

      <TabPanel>
        <h2>Summary</h2>
        <p>Polygon Contracts Count: {data.polygon_contacts_count}</p>
        <p>Ethereum Contracts Count: {data.ethereum_contacts_count}</p>
      </TabPanel>

      {/* <TabPanel>
        <h2>Coinpaprika Contracts</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Logo</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Chain</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Security Score</TableCell>
                <TableCell align="right">Risk</TableCell>
                <TableCell align="right">Contract</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
                <TableRow key={index}>
                  <TableCell><Avatar src={project.logo} /></TableCell>
                  <TableCell><Link href={project.website} target="_blank" rel="noopener noreferrer" className={classes.link}>{project.name}</Link></TableCell>
                  <TableCell><Avatar src={project.chainLogo} /></TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell align="right">{project.score}</TableCell>
                  <TableCell align="right" style={{ color: project.risk === 'High' ? 'red' : project.risk === 'Medium' ? 'orange' : 'green' }}>{project.risk}</TableCell>
                  <TableCell align="right"><Link href={`https://etherscan.io/address/${project.contract}`} target="_blank" rel="noopener noreferrer" className={classes.link}>Contract</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  count={projects.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel> */}

      <TabPanel>
        <h2>Polygon Contracts</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SL. No</TableCell>
                <TableCell>Contract Name</TableCell>
                <TableCell align="right">Security Score</TableCell>
                <TableCell align="right">Risk</TableCell>
                <TableCell>Contract Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.polygon_contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{project.ContractName}</TableCell>
                  <TableCell align="right" style={{ color: project.RiskScore > 60? 'red' : project.RiskScore > 30 ? 'orange' : 'green' }}>{project.RiskScore}</TableCell>
                  <TableCell align="right" style={{ color: project.RiskScore > 60? 'red' : project.RiskScore > 30 ? 'orange' : 'green' }}>{ project.RiskScore > 60? 'High' : project.RiskScore > 30 ? 'Medium' : 'Low' }</TableCell>
                  <TableCell><Link href={`https://polygonscan.com/address/${project.ContractAddressme}`} target="_blank" rel="noopener noreferrer" className={classes.link}>{project.ContractAddressme}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20,50, 100]}
                  count={data.polygon_contacts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel>
        <h2>Ethereum Contracts</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SL. No</TableCell>
                <TableCell>Contract Name</TableCell>
                <TableCell align="right">Security Score</TableCell>
                <TableCell align="right">Risk</TableCell>
                <TableCell>Contract Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.ethereum_contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{project.ContractName}</TableCell>
                  <TableCell align="right" style={{ color: project.RiskScore > 60? 'red' : project.RiskScore > 30 ? 'orange' : 'green' }}>{project.RiskScore}</TableCell>
                  <TableCell align="right" style={{ color: project.RiskScore > 60? 'red' : project.RiskScore > 30 ? 'orange' : 'green' }}>{ project.RiskScore > 60? 'High' : project.RiskScore > 30 ? 'Medium' : 'Low' }</TableCell>
                  <TableCell><Link href={`https://etherscan.io/address/${project.ContractAddressme}`} target="_blank" rel="noopener noreferrer" className={classes.link}>{project.ContractAddressme}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20,50, 100]}
                  count={data.ethereum_contacts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </TabPanel>

    </Tabs>








    </ThemeProvider>
  );
}

export default Leaderboard;
