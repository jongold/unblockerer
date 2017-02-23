docker run -it --rm --env-file .env --name unblockerer -v "$PWD":/usr/src/app -w /usr/src/app node:7 node index.js
