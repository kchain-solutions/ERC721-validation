// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./ERC721Validator.sol";

contract ERC721ValidatorFactory {
    event NewERC721Validator(
        address validatorAddr,
        string validatorId,
        address ownerAddr
    );

    function newERC721Validator(
        address _owner,
        string memory _validatorId
    ) public {
        address erc721ValidatorAddr = address(
            new ERC721Validator(_owner, _validatorId)
        );
        emit NewERC721Validator(erc721ValidatorAddr, _validatorId, msg.sender);
    }
}
