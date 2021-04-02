import { Injectable, Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import Knex from 'knex';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { v4 as uuid } from 'uuid';
import { RedisSocketEventSendDTO } from '../shared/redis-propagator/dto/socket-event-send.dto';
import { RedisPropagatorService } from '../shared/redis-propagator/redis-propagator.service';
import { CreateAliasDto } from './alias/dto/create-alias.dto';
import { AliasService } from './alias/alias.service';
import { CreateMoveDto } from './move/dto/create-move.dto';
import { MoveService } from './move/move.service';
import { SocketStateService } from '../shared/socket-state/socket-state.service';
import { FindMatchDto } from './dto/find-match.dto';
import { DeleteAliasDto } from './alias/dto/delete-alias.dto';
import { UpdateAliasDto } from './alias/dto/update-alias.dto';

@Injectable()
export class MatchService {

  public constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly aliasService: AliasService,
    private readonly moveService: MoveService
  ) { }

  async findSet(data: FindMatchDto) {
    return this.knex.select('games.id', 'name', 'players.username', 'rows', 'columns', 'counters_to_align', 'counter_acceleration', 'time_limit', 'state')
      .from('games')
      .innerJoin('players', 'games.host', 'players.id')
      .where(builder => {
        if (data.id) {
          builder.where('games.id', data.id)
        };
        if (data.name) {
          builder.where('name', 'like', `%${data.name}%`)
        };
        if (data.state) {
          builder.where('state', data.state)
        };
        if (data.host) {
          builder.where('players.username', 'like', `%${data.host}%`)
        };
        // const keys = {
        //   align: "counters_to_align",
        //   timeLimit: "time_limit",
        // };
        // const { name, state, host, id, ...rest } = data;
        // for (let [attribute, condition] of Object.entries(rest) as any) {
        //   if (Object.keys(keys).includes(attribute)) {
        //     attribute = keys[attribute];
        //   }
        //   builder.where(attribute, condition.operator, condition.amount);
        // }
      });
  }

  async validatePassword(data: { id: string, password: string }) {
    const password = await this.knex.pluck('password').from('games').where('games.id', data.id);
    return data.password === password[0];
  }

  async create(data: CreateMatchDto) {
    const isMatch = await this.findSet(data);
    if (isMatch.length === 0) {
      const matchId = uuid();
      const match = await this.knex('games').insert({
        id: matchId,
        name: data.name,
        password: data.password,
        state: 'waiting',
        host: data.host,
        rows: data.rows,
        columns: data.columns,
        counters_to_align: data.align,
        counter_acceleration: data.acceleration,
        time_limit: data.timeLimit
      }, '*');
      this.redisPropagatorService.createChannel(matchId, this.onMatchEvent);
      return match[0];
    } else {
      this.redisPropagatorService.createChannel(isMatch[0].id, this.onMatchEvent);
      return isMatch[0]
    }
  }

  async join(data: CreateAliasDto) {
    const alias = await this.aliasService.create(data);
    return alias[0];
  }

  async updateAlias(data: UpdateAliasDto) {
    const alias = await this.aliasService.update(data);
    return alias[0];
  }

  async leave(data: DeleteAliasDto) {
    const alias = await this.aliasService.remove(data);
    return alias[0];
  }

  async update(data: UpdateMatchDto) {
    const game = await this.knex('games').where(builder => {
      builder.where('id', data.id);
    }).update({ state: data.state }, '*').then(game => game[0]);
    const { id: game_id, ...rest } = game;
    return { game_id, ...rest };
  }

  async move({ playerId, gameId, row, column, turn }: CreateMoveDto) {
    console.log('movemovemovemovemovemove');
    const alias = await this.aliasService.findSet({ playerId, gameId }).then(alias => alias[0]);
    const moves = await this.moveService.findSet({ gameId });
    const { rows, columns } = await this.findSet({ id: gameId }).then(game => game[0]);
    const slotValues = Array(rows).fill(null).map(row => (Array(columns).fill(0)));
    for (const move of moves) {
      slotValues[move.row][move.column] = move.colour_index;
    };
    slotValues[row][column] = alias.colour_index;
    console.log(slotValues, alias, turn);
    const gameState = this.getGameState(row, column, slotValues);
    if (gameState.value === -2) {
      return { state: gameState };
    }
    const move = await this.moveService.create({ playerId, gameId, row, column, turn }).then(move => move[0]);
    move['state'] = gameState;
    console.log('************************');
    return move;
    //return move[0];
  }

  private getGameState(row, column, slots) {
    function SumInDirection(constants, i, propagatedDirection, score) {
      const rowToEvaluate = constants.row + propagatedDirection[0];
      const columnToEvaluate = constants.column + propagatedDirection[1];
      //Test to see if within boundary of grid
      if (rowToEvaluate > constants.slots.length - 1 || rowToEvaluate < 0 || columnToEvaluate > constants.slots[0].length - 1 || columnToEvaluate < 0) {
        return score;
      }
      const colourOfInitialPoint = constants.slots[constants.row][constants.column];
      const colourOfPointToEvaluate = constants.slots[rowToEvaluate][columnToEvaluate];
      if (colourOfPointToEvaluate === colourOfInitialPoint) {
        score += 1;
        propagatedDirection[0] += constants.directions[i][0];
        propagatedDirection[1] += constants.directions[i][1];
        constants.positions.push([rowToEvaluate, columnToEvaluate]);
        score = SumInDirection(constants, i, propagatedDirection, score);
      }
      return score;
    }

    function checkIfDraw(slots) {
      for (let i = 0; i < slots.length; i++) {
        for (let j = 0; j < slots[0].length; j++) {
          // If there is an empty position the game continues
          if (slots[i][j] === 0) {
            return -1;
          }
        }
      }
      // There are no remaining empty slots so the game is a draw
      return 0;
    }

    // Going clockwise, pairing directions along line of symmetry
    // e.g. up and down (positive sign meaning downward or rightward)
    const constants = {
      row: row,
      column: column,
      slots: slots,
      directions: [[1, 0], [-1, 0], [1, 1], [-1, -1], [0, 1], [0, -1], [-1, 1], [1, -1]],
      positions: []
    }
    const propagatedDirections = Array(constants.directions.length).fill(null).map((_value, i) => ([...constants.directions[i]]));
    let scores = Array(constants.directions.length).fill(0);
    const result = {
      //By default the game is ongoing
      value: -1,
      positions: []
    }

    for (let i = 1; i < constants.directions.length; i += 2) {
      constants.positions = [[constants.row, constants.column]];
      scores[i - 1] = SumInDirection(constants, i - 1, propagatedDirections[i - 1], scores[i - 1]);
      scores[i] = SumInDirection(constants, i, propagatedDirections[i], scores[i]);
      const totalScore = scores[i] + scores[i - 1];
      //Sum scores along line of symmetry. If 3 or more counters of the
      //same colour have been encountered about the initial counter
      //the game has been won
      if (totalScore >= 3) {
        result.value = slots[row][column]
        result.positions = constants.positions;
      }
    }
    if (checkIfDraw(slots) === 0) {
      result.value = 0;
    }
    return result;
  }

  private onMatchEvent = (matchId: string) => async (eventInfo: RedisSocketEventSendDTO): Promise<void> => {
    const { userId, socketId, event, data } = eventInfo;
    const playersInMatch = await this.knex
      .pluck('player_id')
      .from('aliases')
      .where('game_id', matchId);
    const socketMap = this.socketStateService.getAll();
    return Array.from(socketMap.keys())
      .filter(key => playersInMatch.includes(key))
      .reduce((array, key) => {
        return array.concat(socketMap.get(key));
      }, [])
      .filter(socket => socketId !== socket.id)
      .forEach(socket => socket.send(JSON.stringify({ event, data })));
  }
}
