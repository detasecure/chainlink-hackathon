// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NewAPIConsumer.sol"; // Import your contract

contract DecentralizedInsurance is ReentrancyGuard {
    using Address for address payable;

    NewAPIConsumer private riskScoreContract; // Instance of your contract

    constructor(address _riskScoreContract) {
        riskScoreContract = NewAPIConsumer(_riskScoreContract);
    }

    function insure(address _insured, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Insurance amount must be greater than 0");
        uint256 riskScore = getRiskScore(_insured);
        require(riskScore <= 50, "Risk score is too high");
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
        riskScoreContract.requestRiskScore(addressString);
        return riskScoreContract.riskScore();
    }
}
