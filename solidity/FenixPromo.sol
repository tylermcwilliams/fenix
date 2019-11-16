pragma solidity ^0.5.0;

import "./IERC20.sol";
import "./SafeMath.sol";
import "./SafeERC20.sol";
import "./ReentrancyGuard.sol";


// rate = 10000000000 wei 100 billion
//        100,000,000,000

contract Crowdsale is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _token;

    address payable private _wallet;

    uint256 private _rate;

    uint256 private _weiRaised;

    mapping (uint256 => bool) _twitters;
    mapping (address => bool) _addresses;

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    event Claimed(address indexed token, address indexed sender, address indexed recipient, uint256 amount, uint256 nonce, uint256 iface);

    // BASE

    constructor (uint256 rate, address payable wallet, IERC20 token) public {
        require(rate > 0, "Crowdsale: rate is 0");
        require(wallet != address(0), "Crowdsale: wallet is the zero address");
        require(address(token) != address(0), "Crowdsale: token is the zero address");

        _rate = rate;
        _wallet = wallet;
        _token = token;
    }

    function () external payable {
        buyTokens(msg.sender);
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function wallet() public view returns (address payable) {
        return _wallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    // BUYING

    function buyTokens(address beneficiary) public nonReentrant payable {
        
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        _weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(msg.sender, beneficiary, weiAmount, tokens);

        _forwardFunds();
    
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
    }

    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        IERC20(_token).transfer(beneficiary, tokenAmount);
    }

    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        _deliverTokens(beneficiary, tokenAmount);
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.div(_rate);
    }

    function _forwardFunds() internal {
        _wallet.transfer(msg.value);
    }

    // AIRDROPPING

    function validateAndRegisterClaim(bytes32 h, uint8 v, bytes32 r, bytes32 s) internal {
    // signer must be sender
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    address signer = ecrecover(keccak256(abi.encodePacked(prefix, h)), v, r, s);
    require(signer == _wallet);
  }
  
  function validateUniqueness(address recipient, uint256 nonce) internal {
      require(!_twitters[nonce]);
      require(!_addresses[recipient]);
      _twitters[nonce] = true;
      _addresses[recipient] = true;
  }

  function claimTokensERC20(address recipient, uint256 amount, uint256 nonce, uint8 v, bytes32 r, bytes32 s) public {
    bytes32 h = keccak256(abi.encodePacked(_token, _wallet, recipient, amount, nonce));
    validateAndRegisterClaim(h, v, r, s);
    validateUniqueness(recipient, nonce);
    IERC20(_token).transfer(recipient, amount);
    emit Claimed(address(_token), _wallet, recipient, amount, nonce, 20);
  }

}