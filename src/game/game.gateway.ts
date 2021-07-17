import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { LogEntity } from '../log/log.entity';

@WebSocketGateway(8001)
export class GameGateway {
  @WebSocketServer() ws: Server;

  public createdLog(log: LogEntity) {
    this.ws.emit('createdLog', { type: 'createdLog', payload: log });
  }

  public finishedBattle(
    battleInGameId: string,
    status: 'FINISHED' | 'IN_PROGRESS'
  ) {
    Logger.log(`SVEEE JE KAKO TREBA! -> ${battleInGameId} ${status} `);
    this.ws.emit('finishedBattle', {
      type: 'finishedBattle',
      payload: { battleInGameId, status }
    });
  }
}
