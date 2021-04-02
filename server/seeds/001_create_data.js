const { exit } = require("process");
const { async } = require("rxjs");

exports.seed = function (knex) {
  return knex('moves').del()
    .then(() => {
      return knex('aliases').del();
    })
    .then(() => {
      return knex('games').del()
    })
    .then(() => {
      return knex('players').del()
    })
    .then(() => {
      return knex('words').del()
    })
    .then(() => {
      return knex('bot_names').del()
    })
    .then(() => {
      return knex('colours').del()
    })
    .then(() => {
      return knex.raw(
        'COPY bot_names \
         FROM \'/data/human_names.txt\''
      )
    })
    .then(() => {
      return knex.raw(
        'COPY words \
        FROM \'/data/words_with_class.csv\' \
        DELIMITER \',\' \
        CSV HEADER;'
      )
    })
    // .then(() => {
    //   return knex('words').whereRaw('LENGTH(id) < ?', [6]).del();
    // })
    .then(() => {
      return (async () => {
        const names = await knex('bot_names').select('*');
        const words = await knex('words').select('*');
        return { names, words }
      })()
    })
    .then(object => {
      const { names, words } = object;
      return knex('players').insert(((names, words) => {
        const numberOfPlayers = 10;
        const players = []
        const usedNames = []
        while (players.length < numberOfPlayers) {
          const name = names[Math.floor(Math.random() * names.length)].id;
          const pass = words[Math.floor(Math.random() * words.length)].id;
          if (!usedNames.includes(name)) {
            usedNames.push(name);
            players.push({
              username: name,
              password: pass
            })
          };
        }
        return players;
      })(names, words), 'id')

      // return knex.raw(
      //   `INSERT INTO players(id) \
      //    SELECT gen_random_uuid() \
      //    FROM generate_series(1, ${numberOfPlayers})`
      //   )
    })
    .then(ids => {
      return (async () => {
        const words = await knex('words').select('*')
        return {ids, words}
      })()
    })
    .then(object => {
      const {ids, words} = object;
      return knex('games').insert((() => {
        const amount = 30;
        const games = [];
        const states = ['waiting', 'ongoing', 'complete'];
        const names = [];
        while(names.length < amount) {
          const adjective = (() => {
            while(true) {
              const wordWithClass = words[Math.floor(Math.random() * words.length)];
              if (wordWithClass.class == 'adjective') {
                return wordWithClass.id;
              } 
            }
          })();
          const noun = (() => {
            while(true) {
              const wordWithClass = words[Math.floor(Math.random() * words.length)];
              if (wordWithClass.class == 'noun') {
                return wordWithClass.id;
              } 
            }
          })();
          const name = adjective + ' ' + noun;
          if (!names.includes(name)) {
            names.push(name);
            games.push({
              name: name,
              password: words[Math.floor(Math.random() * words.length)].id,
              state: states[Math.floor(Math.random() * states.length)],
              host: ids[Math.floor(Math.random() * ids.length)],
              rows: Math.floor((Math.random() * 29) + 2),
              columns: Math.floor((Math.random() * 29) + 2),
              counters_to_align: Math.floor((Math.random() * 9) + 2),
              time_limit: Math.floor((Math.random() * 59) + 1),
              counter_acceleration: (Math.random() * 8) + 1
            })
          }
        }
        return games
      })(), '*')
    })
    .then(games => {
      let counter = 0;
      return knex('moves').insert((() => {
        const permutations = []
        const upper_limit = (games => {
          let sum = 0;
          for (const game of games) {
            sum += game.rows * game.columns;
          }
          return sum;
        })(games);
        const cut_off = upper_limit * 10;
        const moves = [];
        const turns = {};
        while (moves.length < upper_limit) {
          let p_id = games[Math.floor(Math.random() * games.length)].host;
          let g = games[Math.floor(Math.random() * games.length)];
          let g_id = g.id;
          if (!Object.keys(turns).includes(g_id)) {
            turns[g_id] = 0;
          } else {
            turns[g_id] += 1;
          }
          let r = Math.floor(Math.random() * g.rows);
          let c = Math.floor(Math.random() * g.columns);
          let permutation = g_id + r + c;
          if (!permutations.includes(permutation)) {
            permutations.push(permutation)
            moves.push({
              player_id: p_id,
              game_id: g_id,
              row: r,
              column: c,
              turn: turns[g_id]
            })
            counter = 0;
          } else {
            counter++;
            if (counter > cut_off) {
              return moves;
            }
          }
        }
        return moves;
      })(), ['player_id', 'game_id'])
    })
    .then(moves => {
      return (async () => {
        const names = await knex('bot_names').select('*');
        await knex.raw(
          'COPY colours \
           FROM \'/data/distinguishable_colours.csv\' \
           DELIMITER \',\' \
           CSV HEADER;'
        )
        const colours = await knex('colours').select('index');
        return { moves, names, colours };
      })()
    })
    .then(object => {
      const moves = object.moves;
      const names = object.names;
      const colours = object.colours;
      return knex('aliases').insert((() => {
        const aliases = [];
        const firstChecks = [];
        const secondChecks = [];
        const aliasColours = {};
        for (const move of moves) {
          if (!(move.game_id in aliasColours)) {
            aliasColours[move.game_id] = { ...colours };
          }
          let firstCheck = move.player_id + move.game_id;
          if (!(firstChecks.includes(firstCheck))) {
            firstChecks.push(firstCheck);
            let colourIndex = Math.floor(Math.random() * Object.keys(aliasColours[move.game_id]).length);
            let colour = { ...aliasColours[move.game_id][colourIndex] }.index;
            delete aliasColours[move.game_id][colourIndex];
            let temp = {};
            for (const [index, key] of Object.keys(aliasColours[move.game_id]).entries()) {
              temp[index] = aliasColours[move.game_id][key];
            }
            aliasColours[move.game_id] = { ...temp };
            let isRepeat = true;
            while (isRepeat) {
              let name = names[Math.floor(Math.random() * names.length)].id;
              let secondCheck = move.game_id + name;
              if (!(secondChecks.includes(secondCheck))) {
                secondChecks.push(secondCheck);
                aliases.push({
                  player_id: move.player_id,
                  game_id: move.game_id,
                  alias: name,
                  colour_index: colour
                })
                isRepeat = false;
              }
            }
          }
        }
        return aliases;
      })())
    })
};