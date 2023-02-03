// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ERC721Validator {
    event Validation(
        address validatorAddr,
        string validatorId,
        address nftAddr,
        address userAddr,
        string keccakSecret,
        bool result
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    address owner;
    bool public isActive;
    address[] public nfts;
    string validatorId;

    constructor(string memory _validatorId) {
        owner = msg.sender;
        isActive = true;
        validatorId = _validatorId;
    }

    function validate(string memory _hashedSecret) public {
        bool found = false;
        uint balance = 0;
        uint i = 0;
        for (i = 0; i < nfts.length; i++) {
            balance = 0;
            IERC721 ierc721 = IERC721(nfts[i]);
            balance = ierc721.balanceOf(msg.sender);
            if (balance > 0) {
                found = true;
                break;
            }
        }
        emit Validation(
            address(this),
            validatorId,
            nfts[i],
            msg.sender,
            _hashedSecret,
            found
        );
    }

    function addAddress(address _nftAddr) public onlyOwner {
        nfts.push(_nftAddr);
    }

    function removeAddress(address _nftAddr) public onlyOwner {
        uint newLength = 0;
        bool found = false;
        for (uint idx = 0; idx < nfts.length; idx++) {
            if (nfts[idx] != _nftAddr) {
                nfts[newLength] = nfts[idx];
                newLength++;
            } else found = true;
        }
        nfts.pop();
    }

    function activate() public onlyOwner {
        isActive = true;
    }

    function deactivate() public onlyOwner {
        isActive = false;
    }
}
