pragma solidity ^0.5.0;

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address who) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

  function ceil(uint256 a, uint256 m) internal pure returns (uint256) {
    uint256 c = add(a,m);
    uint256 d = sub(c,1);
    return mul(div(d,m),m);
  }
}

contract ERC20Detailed is IERC20 {

  uint8 private _decimals;
  string private _name;
  string private _symbol;

  constructor(string memory name, string memory symbol, uint8 decimals) public {
   _decimals = decimals;
   _name = name;
   _symbol = symbol;
  }

  function name() public view returns(string memory) {
    return _name;
  }

  function symbol() public view returns(string memory) {
    return _symbol;
  }

  function decimals() public view returns(uint8) {
    return _decimals;
  }
}

/**end here**/

contract Fenix is ERC20Detailed {
    
  using SafeMath for uint256;
  mapping (address => uint256) public _cooldowns;
  mapping (address => uint256) private _balances;
  mapping (address => mapping (address => uint256)) private _allowed;
  string constant tokenName = "Fenix";
  string constant tokenSymbol = "FENIX";
  uint8  constant tokenDecimals = 0;
  uint256 _totalSupply = 100000000000;
  uint256 _vault = 0;

  constructor() public payable ERC20Detailed(tokenName, tokenSymbol, tokenDecimals) {
    _mint(msg.sender, _totalSupply);
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function vaultBalance() public view returns (uint256) {
    return _vault;
  }

  function balanceOf(address owner) public view returns (uint256) {
    return _balances[owner];
  }

  function cooldownOf(address owner) public view returns (uint256) {
    return _cooldowns[owner];
  }

  function allowance(address owner, address spender) public view returns (uint256) {
    return _allowed[owner][spender];
  }

  function openVault() public returns (bool){
      uint256 percentOwned = _balances[msg.sender].div(1000000000);
      require(percentOwned >= 1);

      uint256 timeElapsed = block.timestamp.sub(_cooldowns[msg.sender]);

      require(604800 <= timeElapsed);
      uint256 tokensToTransfer = uint256(_vault.div(100)).mul(percentOwned);

      _vault = _vault.sub(tokensToTransfer);
      _balances[msg.sender] = _balances[msg.sender].add(tokensToTransfer);

      _cooldowns[msg.sender] = block.timestamp;

      emit Transfer(address(0), msg.sender, tokensToTransfer);
      return true;
  }

function donate(uint256 amount) public returns(bool){
    require(amount <= _balances[msg.sender]);
    _balances[msg.sender] = _balances[msg.sender].sub(amount);
    _vault = _vault.add(amount);
    emit Transfer(msg.sender, address(0), amount);

    return true;
}

  function transfer(address to, uint256 value) public returns (bool) {
    require(value <= _balances[msg.sender]);
    require(to != address(0));

    uint256 burned = value.div(20);
    uint256 tokensToTransfer = value.sub(burned);

    _balances[msg.sender] = _balances[msg.sender].sub(value);
    _balances[to] = _balances[to].add(tokensToTransfer);
    _vault = _vault.add(burned);

    emit Transfer(msg.sender, to, tokensToTransfer);
    return true;
  }

  function multiTransfer(address[] memory receivers, uint256[] memory amounts) public {
    for (uint256 i = 0; i < receivers.length; i++) {
      transfer(receivers[i], amounts[i]);
    }
  }

  function approve(address spender, uint256 value) public returns (bool) {
    require(spender != address(0));
    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    require(value <= _balances[from]);
    require(value <= _allowed[from][msg.sender]);
    require(to != address(0));

    _balances[from] = _balances[from].sub(value);

    uint256 burned = value.div(20);
    uint256 tokensToTransfer = value.sub(burned);

    _balances[to] = _balances[to].add(tokensToTransfer);
    _totalSupply = _totalSupply.sub(burned);
    _vault = _vault.add(burned);
    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);

    emit Transfer(from, to, tokensToTransfer);
    return true;
  }

  function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    require(spender != address(0));
    _allowed[msg.sender][spender] = (_allowed[msg.sender][spender].add(addedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    require(spender != address(0));
    _allowed[msg.sender][spender] = (_allowed[msg.sender][spender].sub(subtractedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  function _mint(address account, uint256 amount) internal {
    require(amount != 0);
    _balances[account] = _balances[account].add(amount);
    
    emit Transfer(address(0), account, amount);
  }
}