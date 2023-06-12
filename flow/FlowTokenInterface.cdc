pub contract interface FlowTokenInterface {
    pub fun load(_ address: Address): &FlowToken.Vault
    pub fun minter(): &FlowToken.Minter
}
