import FlowTokenInterface from "./FlowTokenInterface.cdc"

pub contract InsuranceContract {

    pub event Insured(address: Address, amount: UFix64)

    pub fun insure(_insured: Address, _amount: UFix64, _riskScore: UFix64, _token: &FlowTokenInterface) {
        if _riskScore <= 60.0 {
            let vaultRef = _token.load(_insured)
            vaultRef.deposit(from: _token.minter(), amount: _amount)
            emit Insured(address: _insured, amount: _amount)
        }
    }
}
