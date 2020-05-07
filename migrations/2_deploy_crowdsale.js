const Token = artifacts.require("./TokenSPC.sol");
const TokenCrowdsale = artifacts.require("./TokenCrowdsale.sol");

const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

module.exports = async function(deployer, network, accounts) {
  const _name = "Seed Project Coin";
  const _symbol = "SPC";
  const _decimals = 18;
  const _amount = 380000000;

  await deployer.deploy(Token , _name, _symbol, _decimals, _amount );
  const deployedToken = await Token.deployed();

 

  const _rate           = 1;
  const _wallet         = accounts[0]; // TODO: Replace me
  const _token          = deployedToken.address;
  const _cap            = ether(100);

  await deployer.deploy(
    TokenCrowdsale,
    _rate,
    _wallet,
    _token,
    _cap
    
  );

  return true;
};
