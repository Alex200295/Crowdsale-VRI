pragma solidity   0.5.16;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

contract TokenSPC is PausableToken, DetailedERC20 {
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _amount)
        DetailedERC20(_name, _symbol, _decimals)
        public
    {
    	
    	 	require(_amount > 0, "amount has to be greater than 0");
			totalSupply_ = _amount.mul(10 ** uint256(_decimals));
			balances[msg.sender] = totalSupply_;
			emit Transfer(address(0), msg.sender, totalSupply_);

     	
    }
}