import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org") // for testnet
  .put("challenge.handshake", "https://flow-wallet-testnet.blocto.app/authn") // for testnet

function FlowContract() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [riskScore, setRiskScore] = useState('');
  const [insured, setInsured] = useState(false);

  const handleInsure = async () => {
    const txId = await fcl.send([
      fcl.transaction`
        import InsuranceContract from 0xCONTRACTADDRESS

        transaction(address: Address, amount: UFix64, riskScore: UFix64) {
          let receiver: Capability<&InsuranceContract.Vault{FungibleToken.Receiver}>

          prepare(signer: AuthAccount) {
            self.receiver = signer.getCapability<&InsuranceContract.Vault{FungibleToken.Receiver}>(/public/mainReceiver)
          }

          execute {
            let insured = InsuranceContract.insure(address: address, amount: amount, riskScore: riskScore)
            if insured {
              self.receiver.borrow()!.deposit(amount: amount)
            }
          }
        }
      `,
      fcl.args([
        fcl.arg(address, t.Address),
        fcl.arg(amount, t.UFix64),
        fcl.arg(riskScore, t.UFix64),
      ]),
      fcl.proposer(fcl.currentUser().authorization),
      fcl.authorizations([fcl.currentUser().authorization]),
      fcl.payer(fcl.currentUser().authorization),
      fcl.limit(100),
    ]).then(fcl.decode);

    const result = await fcl.tx(txId).onceSealed();
    setInsured(result.status === 4);
  };

  return (
    <div>
      <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
      <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <input type="text" value={riskScore} onChange={e => setRiskScore(e.target.value)} placeholder="Risk Score" />
      <button onClick={handleInsure}>Insure</button>
      {insured ? <p>You are insured!</p> : <p>You are not insured.</p>}
    </div>
  );
}

export default FlowContract;
