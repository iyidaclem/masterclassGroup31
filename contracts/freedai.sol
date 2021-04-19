pragma solidity >=0.4.21 <0.8.4;

contract FreeDai {
    string  public name = "Free DAI";
    string  public symbol = "fDAI";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8   public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

     function getBalance(address _address) public returns (uint256 balance){
        uint256 balance = balanceOf[_address];
        return balance;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address investor, uint256 _value) public returns (bool success) {
        allowance[investor][msg.sender] = _value; // msg.sender is the farm contract address
        emit Approval(investor, msg.sender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][_to]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
