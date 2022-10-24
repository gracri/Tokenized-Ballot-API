import { Body } from '@nestjs/common';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';
import { stringify } from 'querystring';
import { AppService } from './app.service';

@Controller()
export class AppController {

constructor(private readonly appService: AppService) {}


@Get('check-state')
checkState() {
  const result = this.appService.checkState();
  return result;
}

@Post('open-bets')
async openBets(@Body() body:any) {
  const result = await this.appService.openBets(body);
  return {result};
}

//might not need this one
@Post('top-up-account-tokens')
async topUpAccountTokens(@Body() body:any) {
  const result = await this.appService.topUpAccountTokens(body);
  return {result};
}

@Get('display-balance')
displayBalance(@Query('index') index: string) {
  const result = this.appService.displayBalance(index);
  return result;
}

@Post('bet')
async bet(@Body() body:any) {
  const result = await this.appService.bet(body);
  return {result};
}

@Post('close-bets')
async closeBets() {
  const result = await this.appService.closeBets();
  return {result};
}

@Get('check-player-prize')
async checkPlayerPrize(@Body() body: any) {
  const result = this.appService.checkPlayerPrize(body);
  return {result};
}

@Post('withdraw')
async withdraw(@Body() body:any) {
  const result = await this.appService.withdraw(body);
  return {result};
}

@Post('burn-tokens')
async burnTokens(@Body() body:any) {
  const result = await this.appService.burnTokens(body);
  return {result};
}
 
}
