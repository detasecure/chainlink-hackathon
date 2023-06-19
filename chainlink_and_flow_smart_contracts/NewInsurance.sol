// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract NewInsurance is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using Address for address payable;

    uint256 public riskScore;
    // uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;

    event RequestRiskScore(bytes32 indexed requestId, uint256 _riskScore);
    // event RequestVolume(bytes32 indexed requestId, uint256 _volume);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Sepolia Testnet details:
     * Link Token: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * Oracle: 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }


    function insure(address _insured, uint256 _amount) external  {
        require(_amount > 0, "Insurance amount must be greater than 0");
        uint256 riskScoreInsured = getRiskScore(_insured);
        require(riskScoreInsured <= 50, "Risk score is too high");
        payable(_insured).sendValue(_amount);
    }


    function addressToString(address _addr) public pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function getRiskScore(address _address) public returns (uint256) {
        string memory addressString = addressToString(_address);
        // Call your contract to get the risk score
        requestRiskScore(addressString);
        return riskScore;
    }





    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestRiskScore(string memory _smartContractAddress) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        string memory url = string(abi.encodePacked("http://3.108.126.225:8080/api/get_risk_score_polygon_mainnet_verified_contract?smart_contract_address=", _smartContractAddress, "&network_id=11"));

        // Set the URL to perform the GET request on
        req.add("get", url );

        // Set the path to find the desired data in the API response, where the response format is:
        // {"risk_score":
        // }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        req.add("path", "risk_score"); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 1;
        req.addInt("times", timesAmount);
        // int256 timesAmount = 1;
        // req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    // function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
    //     emit RequestVolume(_requestId, _volume);
    //     volume = _volume;
    // }

    function fulfill(bytes32 _requestId, uint256 _riskScore) public recordChainlinkFulfillment(_requestId) {
        emit RequestRiskScore(_requestId, _riskScore);
        // uint256 times_amount = 10 ** 10;
        riskScore = _riskScore;
    }



    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
