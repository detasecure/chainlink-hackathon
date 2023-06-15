import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, makeStyles, CircularProgress } from '@material-ui/core';
import AsciiLogoPolygon from './AsciiLogoPolygon';
import ContractFindingsTable from './ContractFindingsTable';

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
  const [findings, setFindings] = useState(null);

  const getRiskScore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://3.108.126.225:8080/api/get_risk_score_polygon_mainnet_verified_contract?smart_contract_address=${address}`);
      setRiskScore(response.data.risk_score);
      setAdditionalData(response.data); // store the entire response data
      const new_findings = response.data.scan_result.contract_findings.filter(finding => ['High', 'Medium', 'Low', 'Informational'].includes(finding.Impact)).map((finding, index) => ({ ...finding, id: index + 1 }));
      setFindings(new_findings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskScoreColor = (score) => {
    if (score <= 30) {
      return 'green';
    } else if (score <= 60) {
      return 'orange';
    } else {
      return 'red';
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
      <br/>
      <br/>
      {riskScore && <Typography variant="h6" style={{color:getRiskScoreColor(riskScore)}}>Risk Score: {riskScore}</Typography>}

      <div>
        {additionalData && additionalData.result_summary && Object.entries(additionalData.result_summary).filter(([key]) => ['Informational', 'Low', 'Medium', 'High'].includes(key)).map(([key, value]) => `${key}: ${value}`).join(', ')}
      </div>

      {findings && <div><ContractFindingsTable data={findings}/></div>}
      <br/>

    </div>
  );
}

export default PolygonRiskScoreForm;
