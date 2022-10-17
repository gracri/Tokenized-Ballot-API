import { HttpException, Injectable } from '@nestjs/common';
import {ethers, BigNumber} from "ethers";
import * as TokenJson from './assets/MyToken.json'
import * as BallotJson from './assets/tokenizedBallot.json'
import { ContractFactory } from 'ethers';

const TOKEN_CONTRACT_ADDRESS = '0xf6aD19c2d76F197C573AF32A5b95085Fc34f351f';
const ADDRESS = "0x6e878B50d3dA403435be5d7CEdD3d4b051792bD7";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];


export class RequestPaymentDTO {
  id: string;
  secret: string;
  address: string;
}

export class PaymentOrder {
  id: string;
  secret: string;
  amount: string;
}

export class Vote {
  proposal: string;
  amount: string;
}

@Injectable()
export class AppService {
  
  provider: ethers.providers.Provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract
  wallet: ethers.Wallet;
  signer: ethers.Signer;
  
  database: PaymentOrder[];
  
  constructor() {
    const options = {
      alchemy: process.env.ALCHEMY_API_KEY,
      infura: process.env.INFURA_API_KEY,
    };
    this.database = [];
    this.provider = ethers.getDefaultProvider('goerli', options)
    this.wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? '')
    this.signer = this.wallet.connect(this.provider)
    this.tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      TokenJson.abi,
      this.provider,
    ).connect(this.signer);

  }
  
  tokenAddress() {
    return TOKEN_CONTRACT_ADDRESS;
  }

  walletAddress() {
    return ADDRESS;
  }

  getPaymentOrderById(id: string) {
    const element= this.database.find((element) => element.id === id);
    if (!element) throw new HttpException("Payment Order not found", 404);
    return {id: element.id, amount: element.amount};
  }

  async getWinner() {
    const winningProposal = await this.ballotContract.winnerName();
    const name = ethers.utils.parseBytes32String(winningProposal);
    return name;
  }

  getBallotContractAddress() {
    return this.ballotContract.address;
  }

  async mintTokens(body: any) {
    const mintTx = await this.tokenContract.mint(body.address, body.amount);
    await mintTx.wait();
    return true;
  }

  async vote(body: any) {
    this.ballotContract.connect(this.signer);
    const castVoteTx = await this.ballotContract.vote(body.proposal, body.amount);
    const castVoteTxReceipt = await castVoteTx.wait();
    return true;
  }

  async delegate(body: any){
    const delegateTx = await this.tokenContract.delegate(ADDRESS);
    await delegateTx.wait();
    //Create the ballot contract (must be done after delegating to have the right block number)
    this.createBallotContract();
    return true;
  }

  async createBallotContract() {
    const currentBlock = await this.provider.getBlockNumber();
    const factory = new ContractFactory(BallotJson.abi, BallotJson.bytecode, this.signer);
    const contract = await factory.deploy(
      this.convertStringArrayToBytes32(PROPOSALS), TOKEN_CONTRACT_ADDRESS, currentBlock
    );
    await contract.deployed();
    this.ballotContract = contract;
    return this.ballotContract.address;  
  }

   convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

}

