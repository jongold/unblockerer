/* eslint-disable camelcase, comma-dangle */
const Twit = require('twit');
const Future = require('fluture');
const { Either, Reader } = require('ramda-fantasy');

const logError = x => console.error(x); // eslint-disable-line no-console
const log = x => console.log(x); // eslint-disable-line no-console

// getBlocks :: TwitterClient -> Future
// get all of your blocks
// limit is 5000, doesn't implement cursors because they're confusing
// feel free to call this a bunch of times
const getBlocks = client => Future.node(done =>
  client.get('blocks/ids', { stringify_ids: true }, done)
);

// unblock :: TwitterClient -> id -> Future
// twitter only lets you unblock one user at a time
const unblock = client => user_id =>
  Future.node(done =>
    client.post('blocks/destroy', { user_id }, done)
  ).mapRej(err => new Error(`error on ${user_id} ${err.message}`));

// stabilizeFutures :: Array (Future a b) -> Array (Future Left Right)
const stabilizeFutures = xs =>
  xs.map(Future.fold(Either.Left, Either.Right));

// makeClient :: env -> TwitterClient
const makeClient = env =>
  Future.try(() => new Twit(env));

// main :: int -> Reader Env -> (Future Error [Response])
const main = batchSize => Reader(env =>
  makeClient(env)
  .chain(client =>
    getBlocks(client)
      .map(res => res.ids.map(id => unblock(client)(id)))
      .map(stabilizeFutures)
      .chain(reqs => Future.parallel(batchSize, reqs))
  )
);

if (require.main === module) {
  main(5).run({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  }).fork(logError, log);
}

module.exports = main;
