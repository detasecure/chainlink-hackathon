import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Avatar, AppBar, Toolbar, Box, Link, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

// Sample project data
const projects = [
  { name: 'Uniswap', score: 85, risk: 'High', chainLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png?v=010', website: 'https://uniswap.org/', contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', category: 'Exchange, Token' },
  { name: 'QuickSwap', score: 90, risk: 'Medium', chainLogo: 'https://cryptologos.cc/logos/polygon-matic-logo.png', logo: 'https://cryptologos.cc/logos/quickswap-quick-logo.png?v=010', website: 'https://quickswap.exchange/', contract: '0x6c28aef8977c9b773996d0e8376d2ee379446f2f', category: 'Exchange, Token' },
  { name: 'PancakeSwap', score: 78, risk: 'Low', chainLogo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', logo: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png?v=010', website: 'https://pancakeswap.finance/', contract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', category: 'Exchange, Token' },
  // Add more projects as needed
];

function Leaderboard() {
  const classes = useStyles();
  const [sortConfig, setSortConfig] = useState(null);

  const sortedProjects = React.useMemo(() => {
    let sortableProjects = [...projects];
    if (sortConfig !== null) {
      sortableProjects.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProjects;
  }, [projects, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction ='descending';
    }
    setSortConfig({ key, direction });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src="https://getsecured.ai/images/getsecured-logo.png" alt="GETSecured" height="60" />
          <Box flexGrow={1} />
          <Typography variant="h4">
            Security Leaderboard
          </Typography>
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig?.key === 'name'}
                  direction={sortConfig?.direction}
                  onClick={() => requestSort('name')}
                >
                  Project
                </TableSortLabel>
              </TableCell>
              <TableCell>Chain</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig?.key === 'score'}
                  direction={sortConfig?.direction}
                  onClick={() => requestSort('score')}
                >
                  Security Score
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Risk</TableCell>
              <TableCell align="right">Contract</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProjects.map((project, index) => (
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
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default Leaderboard;
