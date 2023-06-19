// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract NewAPIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public riskScorePolygonSmartContract;
    uint256 public riskScoreEthereumSmartContract;

    bytes32 private jobId;
    uint256 private fee;


    event RequestRiskScorePolygonSmartContract(bytes32 indexed requestId, uint256 _riskScorePolygonSmartContract);
    event RequestRiskScoreEthereumSmartContract(bytes32 indexed requestId, uint256 _riskScoreEthereumSmartContract);

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789); // In Sepolia
        setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        
        
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 1000; // 0.01 * 10**18 (Varies by network and job)
    }





    function request() public {
        Chainlink.Request memory req = buildChainlinkRequest('ca98366cc7314957b8c012c72f05aeeb', address(this), this.fulfill.selector);
        req.add(
            'get',
            'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD'
        );
        req.add('path', 'RAW,ETH,USD,VOLUME24HOUR');
        req.addInt('times', 10**18); // Multiply by times value to remove decimals. Parameter required so pass '1' if the number returned doesn't have decimals
        sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
    }

    uint256 public volume;
    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
        volume = _volume;
    }


    function requestRiskScorePolygonSmartContract(string memory _smartContractAddress) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillPolygon.selector
        );

        string memory url = string(abi.encodePacked("http://3.108.126.225:8080/api/get_risk_score_polygon_mainnet_verified_contract?smart_contract_address=", _smartContractAddress, "&only_risk_score=true"));

        req.add("get", url );
        req.add("path", "risk_score");

        int256 timesAmount = 1;
        req.addInt("times", timesAmount);

        return sendChainlinkRequest(req, fee);
    }

    function fulfillPolygon(bytes32 _requestId, uint256 risk_score_polygon) public recordChainlinkFulfillment(_requestId) {
        emit RequestRiskScorePolygonSmartContract(_requestId, risk_score_polygon);
        riskScorePolygonSmartContract = risk_score_polygon;
    }

    function requestRiskScoreEthereumSmartContract(string memory _smartContractAddress) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillEthereum.selector
        );

        string memory url = string(abi.encodePacked("http://3.108.126.225:8080/api/get_risk_score_ethereum_mainnet_verified_contract?smart_contract_address=", _smartContractAddress, "&only_risk_score=true"));

        req.add("get", url );
        req.add("path", "risk_score");

        int256 timesAmount = 1;
        req.addInt("times", timesAmount);

        return sendChainlinkRequest(req, fee);
    }

    function fulfillEthereum(bytes32 _requestId, uint256 risk_score_ethereum) public recordChainlinkFulfillment(_requestId) {
        emit RequestRiskScoreEthereumSmartContract(_requestId, risk_score_ethereum);
        riskScoreEthereumSmartContract = risk_score_ethereum;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

}
