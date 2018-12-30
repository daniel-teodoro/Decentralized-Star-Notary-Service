pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

//  Add a name and a symbol for your starNotary tokens

    struct Star {
        string name;
        string symbol;
        address owner;
    }



    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _symbol, uint256 _tokenId) public {
        Star memory newStar = Star(_name, _symbol, msg.sender);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }


// Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID, and then returns the name of the star.
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string Name, string Symbol, address Owner) {
        Star memory star = tokenIdToStarInfo[_tokenId];
        return (star.name, star.symbol, star.owner);
    }    
//

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
      }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.
    function exchangeStars(uint256 _tokenIdSend, uint256 _tokenIdReceive) public payable {

        require(tokenIdToStarInfo[_tokenIdSend].owner != tokenIdToStarInfo[_tokenIdReceive].owner);

        address OwnerSend = tokenIdToStarInfo[_tokenIdSend].owner;
        address OwnerReceive = tokenIdToStarInfo[_tokenIdReceive].owner;

        tokenIdToStarInfo[_tokenIdSend].owner = OwnerReceive;
        tokenIdToStarInfo[_tokenIdReceive].owner = OwnerSend;

    }
    
//

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//
  function transferStar(uint256 _tokenId, address _toAddress) public payable {
        tokenIdToStarInfo[_tokenId].owner = _toAddress;
    }

}
