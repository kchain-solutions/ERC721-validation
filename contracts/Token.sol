// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _to
    ) ERC721(_name, _symbol) {
        _mint(_to, 0);
    }
}
