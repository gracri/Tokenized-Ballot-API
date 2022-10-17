import { Body } from '@nestjs/common';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';
import { stringify } from 'querystring';
import { AppService, PaymentOrder, RequestPaymentDTO, Vote } from './app.service';

@Controller()
export class AppController {

constructor(private readonly appService: AppService) {}


@Get('get-token-address')
tokenAddress() {
  const result = this.appService.tokenAddress();
  return {result};
}

@Get('get-ballot-contract-address')
getBallotContractAddress() {
  const result = this.appService.getBallotContractAddress();
  return {result};
}

@Get('get-wallet-address')
walletAddress() {
  const result = this.appService.walletAddress();
  return {result};
}

@Get('get-winner')
getWinner(){
  const result = this.appService.getWinner();
  return result;
}

@Post('mint-tokens')
async mintTokens(@Body() body:any) {
  const result = await this.appService.mintTokens(body);
  return {result};
}

@Post('delegate')
async delegate(@Body() body:any) {
  const result = await this.appService.delegate(body);
  return {result};
}

@Post('vote')
async vote(@Body() body: any) {
  const result = await this.appService.vote(body);
  return {result};
}
 
}
