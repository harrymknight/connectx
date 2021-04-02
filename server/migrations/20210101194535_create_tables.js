
exports.up = function (knex) {
  return knex.schema
    .createTable('bot_names', table => {
      table.text('id').primary();
    })
    .createTable('colours', table => {
      table.text('id').primary();
      table.text('name').unique().notNullable();
      table.integer('index');
    })
    .createTable('words', table => {
      table.text('id').primary();
      table.text('class').notNullable();
    })
    .createTable('players', table => {
      table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.text('username').unique().notNullable();
      table.text('password').notNullable();
    })
    .createTable('games', table => {
      table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.text('name').unique().notNullable();
      table.text('password').notNullable();
      table.text('state').notNullable();
      table.uuid('host').references('id').inTable('players').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('rows');
      table.integer('columns');
      table.integer('counters_to_align');
      table.integer('time_limit');
      table.float('counter_acceleration');
    }).raw(
      'ALTER TABLE games \
       ADD CONSTRAINT multiple_rows CHECK (rows > 1), \
       ADD CONSTRAINT multiple_columns CHECK (columns > 1), \
       ADD CONSTRAINT multiple_to_align CHECK (counters_to_align > 1), \
       ADD CONSTRAINT positive_time_limit CHECK (time_limit > 0), \
       ADD CONSTRAINT sensible_acceleration CHECK (counter_acceleration > 0 AND counter_acceleration <= 9.8);'
    )
    .createTable('aliases', table => {
      table.uuid('player_id').references('id').inTable('players').onUpdate('CASCADE').onDelete('CASCADE');
      table.uuid('game_id').references('id').inTable('games').onUpdate('CASCADE').onDelete('CASCADE');
      table.text('alias').notNullable();
      table.integer('colour_index').notNullable();
      table.text('status').notNullable().defaultTo('unready');
      table.unique(['game_id', 'alias']);
      table.unique(['game_id', 'colour_index']);
      table.primary(['player_id', 'game_id']);
    })
    .createTable('moves', table => {
      table.uuid('player_id').references('id').inTable('players').onUpdate('CASCADE').onDelete('CASCADE');
      table.uuid('game_id').references('id').inTable('games').onUpdate('CASCADE').onDelete('CASCADE');
      table.integer('row').unsigned().notNullable();
      table.integer('column').unsigned().notNullable();
      table.integer('turn').notNullable();
      table.primary(['game_id', 'row', 'column']);
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("bot_names")
    .dropTableIfExists("colours")
    .dropTableIfExists("words")
    .dropTableIfExists("moves")
    .dropTableIfExists("aliases")
    .dropTableIfExists("games")
    .dropTableIfExists("players")
};
