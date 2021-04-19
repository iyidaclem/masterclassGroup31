pragma solidity >=0.4.21;

import "./freelake.sol";
import "./freedai.sol";
contract LakeFarm {
    //all code goes here
    string public name = "LakeFarm";
    FreeLake public freeLake;
    FreeDai public freeDai;
    address public owner;
    
   
    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(uint256=>tx) public history; //For keeing track of transaction history
    uint256 public txid = 0; //Transaction id

    constructor(address _freeDai, address _freeLake) public {
        freeLake = FreeLake(_freeLake);
        freeDai = FreeDai(_freeDai);
        owner = msg.sender;
    }

    struct tx {
        address  _address;
        uint256 _amount;
        string _type;
        uint256 _date;
    }
    
    // Tracking the transaction history
     function setHist(address _address, string memory _type, uint256 _amount) internal returns(bool success) {
         history[txid] = tx(_address,_amount,_type,block.timestamp);
        txid++;
        return success;
    }

    //FreeDai balance
     function fDaiBal(address _address) public  returns (uint256){
         uint256 balance = freeDai.getBalance(_address);
         return balance;
     }

     //FreeLake balance
      function flkBal(address _address) public  returns (uint256){
         uint256 balance = freeLake.getBalance(_address);
         return balance;
     }
    //Stakes Tokens
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "You cannot stake 0 tokens");
        
        // approve freeDai transfer
        require( freeDai.approve(msg.sender, _amount),"Approval failed");
   

        //Transfer Mock Dai tokens to this contract for staking
        freeDai.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] += _amount;

        // Add user to stakers array *only* if they have't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // updating the staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
        
        // Save transaction history
        setHist(msg.sender,"stake",_amount);
    }

    //Unstaking tokens (Widthdraw)
    function unstakeTokens() public {
        //Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        //Require amount greater than 0
        require(balance > 0, "Staking balance cannot be 0");

        //Transfer Mock Dai tokens from this contract to the staker address
        freeDai.transfer(msg.sender,balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        //Update staking status
        isStaking[msg.sender] = false;
        
        // Save transaction history
        setHist(msg.sender, "unstake",balance);

    }


    //Issue Tokens
    function issueTokens() public {
        // only owner can call this function
        require(msg.sender==owner,"caller must be the owner");
        // issue token to the stakers
        for(uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance>0){
                freeLake.transfer(recipient,balance);
                // Save transaction history
                setHist(recipient, "issuedToken",balance);
            }
        }
    }
}
