import ether from './helpers/ether';
import sendTransaction from './helpers/sendTransaction';
import EVMRevert from './helpers/EVMRevert';

const BN = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

const Token = artifacts.require('TokenSPC');
const TokenCrowdsale = artifacts.require('TokenCrowdsale');

contract('TokenCrowdsale', function([_, wallet, investor1, investor2]) {

  /*before(async function() {
    // Transfer extra ether to investor1's account for testing
    await web3.eth.sendTransaction({ from: _, to: investor1, value: ether(60) })
    await web3.eth.sendTransaction({ from: _, to: investor2, value: ether(20) })
  });*/

  beforeEach(async function () {
    // Token config
    this.name = "Seed Project Coin";
    this.symbol = "SPC";
    this.decimals = 18;
    this.amount = 380000000;


    // Deploy Token
    this.token = await Token.new(
      this.name,
      this.symbol,
      this.decimals,
      this.amount
    );

    // Crowdsale config
    this.rate = new BN(500);
    this.wallet = wallet;
    this.cap = ether(100);

    //Invest cap
    this.investorMinCap = ether(0.002);
    this.investorHardCap = ether(50);
   
    this.crowdsale = await TokenCrowdsale.new(
      this.rate,
      this.wallet,
      this.token.address,
      this.cap

      
    );

    // Transfer token owern to crowdsale
    await this.token.transferOwnership(this.crowdsale.address);

  
  });

  describe('token', function() {
    it("should check totalSupply", async function() {
      const _supp = await this.token.totalSupply();
      console.log( "     ", "totalSupply =", _supp.toString());
    });
   
  });

  describe('crowdsale', function() {
    it('tracks the rate', async function() {
      const _rate = await this.crowdsale.rate();
      //console.log( "     ", "Rate =", _rate );
      //console.log( "     ", "this.rate =", this.rate );
      _rate.should.be.a.bignumber.that.equals(this.rate);
    });

    it('tracks the wallet', async function() {
      const wallet = await this.crowdsale.wallet();
      wallet.should.equal(this.wallet);
    });

    it('tracks the token', async function() {
      const token = await this.crowdsale.token();
      token.should.equal(this.token.address);
    });
  });

  //A revoir---------------------------------------------
 /* describe('actualization crowdsale', function() {
    it('actualize total supply of crowdsale after purchase', async function() {
      const originalTotalSupply = await this.token.totalSupply();
      this.token.totalSupply_ -= 1;
      const newTotalSupply = await this.token.totalSupply();
      assert.isTrue(newTotalSupply < originalTotalSupply)
    });
  });*/

  describe('capped crowdsale', async function() {
    it('has the correct hard cap', async function() {
      const _cap = await this.crowdsale.cap();
      _cap.should.be.a.bignumber.that.equals(this.cap);
    });
  });

  //A revoir ---------------------------------------------
  /*describe('accepting payments', function() {
    it('should accept payments', async function() {
      const value = ether(1);
      const purchaser = investor2;
      await this.crowdsale.sendTransaction({ value : value, from : investor1}).should.be.fulfilled;
      await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
    });
  });*/

  describe('buyTokens()', function() {
    describe('when the contrib is less than min cap', function(){
      it('rejects the transaction', async function() {
        const value = this.investorMinCap - 1;
        await this.crowdsale.buyTokens(investor2, { value: value, from: investor2 }).should.be.rejectedWith(EVMRevert);
      });
    });

     describe('when the invest has already met the min cap', function(){
      it('allows the invest to contrib below the min cap', async function() {
        //isvalid
        const value1 = ether(1);
        
        
        await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1 });
        console.log( "     ", "inv =", investor1 );
        console.log( "     ", "value =", value1 );
        console.log( "     ", "inv.value =", await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1 }) );
        //is less then invest cap
        const value2 = 1; //wei
        await this.crowdsale.buyTokens(investor1, { value: value2, from: investor1 }).should.be.fulfilled;

      });
    });

  });
/*
  describe('when the total contrib exceed the invest hardcap', function(){
    it('reject the transaction', async function() {
      //first contrib in valid range
      const value1 = ether(2);
      await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1});

      //second is over hardcap
      const value2 = ether(49);
      await this.crowdsale.buyTokens(investor1, { value: value2, from: investor1}).should.be.rejectedWith(EVMRevert);
    });
  });

  describe('when the contrib is within the valid range', function() {
    const value = ether(2);
    it('succeeds & updates the contrib amount', async function() {
      await this.crowdsale.buyTokens(investor2, { value: value, from: investor2 }).should.be.fulfilled;
      const contribution = await this.crowdsale.getUserContribution(investor2);
      contribution.should.be.bignumber.equals;
    });
  });
*/
});

