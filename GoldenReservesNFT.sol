// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GoldenReservesNFT
 * @dev NFT Collection representing digital gold certificates
 * Mintable with GOF tokens - Different tiers with different prices
 */
contract GoldenReservesNFT is ERC721URIStorage, Ownable {
    IERC20 public gofToken;
    uint256 private _tokenIdCounter;
    
    // Rarity tiers and their prices in GOF tokens (18 decimals)
    enum Rarity { BRONZE, SILVER, GOLD, DIAMOND }
    
    struct NFTMetadata {
        Rarity rarity;
        uint256 mintedAt;
        uint256 pricePaid;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) public nftMetadata;
    
    // Tier prices in GOF tokens (1 GOF ≈ €4500)
    uint256 public constant BRONZE_PRICE = 222 * 10**12;    // ≈ 0.000222 GOF (~1€)
    uint256 public constant SILVER_PRICE = 444 * 10**12;    // ≈ 0.000444 GOF (~2€)
    uint256 public constant GOLD_PRICE = 666 * 10**12;      // ≈ 0.000666 GOF (~3€)
    uint256 public constant DIAMOND_PRICE = 1111 * 10**12;  // ≈ 0.001111 GOF (~5€)
    
    // Treasury wallet to receive GOF tokens
    address public treasury;
    
    event NFTMinted(
        address indexed minter, 
        uint256 indexed tokenId, 
        Rarity rarity,
        string tokenURI, 
        uint256 pricePaid
    );
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(
        address _gofToken,
        address _treasury
    ) ERC721("Golden Reserves", "GRESERVE") Ownable(msg.sender) {
        require(_gofToken != address(0), "Invalid GOF token address");
        require(_treasury != address(0), "Invalid treasury address");
        gofToken = IERC20(_gofToken);
        treasury = _treasury;
    }

    /**
     * @dev Get price for a specific rarity tier
     */
    function getPriceForRarity(Rarity rarity) public pure returns (uint256) {
        if (rarity == Rarity.BRONZE) return BRONZE_PRICE;
        if (rarity == Rarity.SILVER) return SILVER_PRICE;
        if (rarity == Rarity.GOLD) return GOLD_PRICE;
        if (rarity == Rarity.DIAMOND) return DIAMOND_PRICE;
        revert("Invalid rarity");
    }

    /**
     * @dev Mint an NFT by paying with GOF tokens
     * @param tokenURI IPFS URI of the NFT metadata
     * @param rarity The rarity tier to mint
     */
    function mintWithGOF(string memory tokenURI, Rarity rarity) public returns (uint256) {
        uint256 price = getPriceForRarity(rarity);
        
        require(gofToken.balanceOf(msg.sender) >= price, "Insufficient GOF balance");
        require(gofToken.allowance(msg.sender, address(this)) >= price, "GOF allowance too low");

        // Transfer GOF tokens to treasury
        bool success = gofToken.transferFrom(msg.sender, treasury, price);
        require(success, "GOF transfer failed");

        // Mint the NFT
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store metadata
        nftMetadata[tokenId] = NFTMetadata({
            rarity: rarity,
            mintedAt: block.timestamp,
            pricePaid: price
        });

        emit NFTMinted(msg.sender, tokenId, rarity, tokenURI, price);
        
        return tokenId;
    }

    /**
     * @dev Free mint for testing (owner only)
     */
    function freeMint(address to, string memory tokenURI, Rarity rarity) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        nftMetadata[tokenId] = NFTMetadata({
            rarity: rarity,
            mintedAt: block.timestamp,
            pricePaid: 0
        });
        
        emit NFTMinted(to, tokenId, rarity, tokenURI, 0);
        
        return tokenId;
    }

    /**
     * @dev Update treasury address
     */
    function setTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @dev Get total supply of minted NFTs
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get all token IDs owned by an address
     */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index] = i;
                index++;
            }
        }
        
        return tokenIds;
    }
}
