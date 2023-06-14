import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, makeStyles, CircularProgress } from '@material-ui/core';
import AsciiLogoEthereum from './AsciiLogoEthereum';

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

function EthereumRiskScoreForm() {
  const classes = useStyles();
  const [address, setAddress] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalData, setAdditionalData] = useState(null);

  const getRiskScore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/get_risk_score_ethereum_mainnet_verified_contract?smart_contract_address=${address}`);
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

      <AsciiLogoEthereum/>
      <Typography variant="h5" gutterBottom>
        <pre> 
          Smart Contract Audit (AI based) for Ethereum Mainnet: 
          <br/>
          <a href="https://etherscan.io/contractsVerified" target='_blank' rel="noreferrer">https://etherscan.io/contractsVerified</a>
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

export default EthereumRiskScoreForm;
