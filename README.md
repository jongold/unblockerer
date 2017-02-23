# unblockerer
[![NPM](https://nodei.co/npm/unblockerer.png)](https://nodei.co/npm/unblockerer/)

Unblock everyone on Twitter. Useful if your account gets hacked and they
block 20000 people — Twitter doesn't have a bulk unblock anywhere.

## Usage
### Simple
* create a `.env` and fill in your Twitter auth details. An example is in
  `.env.example`.
* `npm install`
* `./run.sh`

### Manual
```
const unblockerer = require('unblockerer');
const Twit = require('twit');
const T = new Twit({
  consumer_key: 'foo',
  consumer_secret: 'bar',
  access_token: 'baz',
  access_token_secret: 'qux',
});

const BATCH_SIZE = 10;

unblockerer(10).run({
  client: T,
}).fork(
  err => console.log(err),
  res => console.log(res)
)
```
