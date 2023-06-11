import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TableFooter, TablePagination } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Styles for the Link component
const useStyles = makeStyles({
  link: {
    color: 'white',
    '&:hover': {
      color: 'blue',
    },
  },
});

function PolygonContracts({ data, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) {
  const classes = useStyles();

  return (
    <div>
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
    </div>
  );
}

export default PolygonContracts;
