import React, {useState, useEffect} from "react"
import * as fcl from "@blocto/fcl"
import { AppBar, Toolbar, Box, Typography, Tabs, Tab, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';

import Summary from './Summary';
import PolygonContracts from './PolygonContracts';
import EthereumContracts from './EthereumContracts';
import PolygonRiskScoreForm from './PolygonRiskScoreForm';
import EthereumRiskScoreForm from './EthereumRiskScoreForm';

const timeOutInterval = 300000;

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${process.env.PUBLIC_URL + '/gradient-network-connection-background/5039684.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '0.7rem',
  },
  input: {
    color: '#fff',
  },
});

const SignInOutButton = ({ user: { loggedIn } }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [value, setValue] = useState(0);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [hasSessionTimedOut, setHasSessionTimedOut] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://3.108.126.225:8080/api/get_all_contract_stats_summary'); // Replace with your API link
      setData(result.data);
    };
    
    if(loggedIn && !data) {
      fetchData();
    }
  }, [loggedIn, data]);

  useEffect(() => {
    if (loggedIn) {
      setSessionTimeout(setTimeout(() => {
        fcl.unauthenticate();
        setHasSessionTimedOut(true);
      }, timeOutInterval)); // 10 seconds
    } else if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
  }, [loggedIn]);

  const classes = useStyles();
  
  if (loggedIn && !data) {
    return 'Loading...';
  }

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

  const handleActivity = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    setSessionTimeout(setTimeout(() => {
      fcl.unauthenticate();
      setHasSessionTimedOut(true);
    }, timeOutInterval)); // 10 seconds
  };

  const signInOrOut = async (event) => {
    event.preventDefault()

    if (loggedIn) {
      fcl.unauthenticate()
    } else {
      fcl.authenticate()
      setHasSessionTimedOut(false);
    }
  }

  return (
    <div onMouseMove={handleActivity} onClick={handleActivity} onKeyDown={handleActivity}>
      <div style={{ 
        height: '100vh', 
        backgroundSize: 'cover' 
      }}>
        <AppBar position="static">
          <Toolbar>
            <img src="https://getsecured.ai/images/getsecured-logo.png" alt="GETSecured" height="60" />
            <Box flexGrow={1} />
            <Typography variant="h4">
              OracleSentry
            </Typography>
            {loggedIn?(<Button variant="contained" color="primary" onClick={signInOrOut}> Sign Out </Button>):<></>}
          </Toolbar>
        </AppBar>

        {loggedIn? (
          <>
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
          </>

        ) : (

      <div style={{ 
        backgroundImage: `url(${process.env.PUBLIC_URL + '/gradient-network-connection-background/5039684.jpg'})`, 
        height: '100vh', 
        backgroundSize: 'cover' 
      }}>
          <div className={classes.root}>
            <form className={classes.form}>
              {hasSessionTimedOut && <p>Session timed out, login again</p>}
              <Button variant="contained" color="primary" onClick={signInOrOut}> Sign In </Button>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

const CurrentUser = () => {
  const [user, setUser] = useState({})

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe(user => setUser({...user}))
  , [])

  return (
      <SignInOutButton user={user} />
  )
}

export default CurrentUser
