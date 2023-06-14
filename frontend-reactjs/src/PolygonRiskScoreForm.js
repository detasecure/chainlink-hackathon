import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, makeStyles, CircularProgress } from '@material-ui/core';
import AsciiLogoPolygon from './AsciiLogoPolygon';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  button: {
    width: '100%',
  },
}));

function PolygonRiskScoreForm() {
  const classes = useStyles();
  const [address, setAddress] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalData, setAdditionalData] = useState(null);

  const getRiskScore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/get_risk_score_polygon_mainnet_verified_contract?smart_contract_address=${address}`);
      setRiskScore(response.data.risk_score);
      setAdditionalData(response.data); // store the entire response data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.form}>
        <br/>
        <br/>
        <br/>

      <AsciiLogoPolygon/>
      <Typography variant="h5" gutterBottom>
        <pre>                                                                    
          Smart Contract Audit (AI based) for Polygon Mainnet: 
          <br/>
          <a href="https://polygonscan.com/contractsVerified" target='_blank' rel="noreferrer">https://polygonscan.com/contractsVerified</a>
        </pre>
      </Typography>

      <TextField
        variant="outlined"
        className={classes.textField}
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={getRiskScore}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Get Risk Score'}
      </Button>
      {riskScore && <Typography variant="h6">Risk Score: {riskScore}</Typography>}
      {additionalData && <pre>{JSON.stringify(additionalData, null, 2)}</pre>}
    </div>
  );
}

export default PolygonRiskScoreForm;
