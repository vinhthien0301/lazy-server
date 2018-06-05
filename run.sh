#!/bin/sh

forever stop lazy-server
rm -rf ~/.forever/lazy-server.log.previous
mv ~/.forever/lazy-server.log lazy-server.log.previous
forever --uid lazy-server -o out.server -e error.server start app.js
forever list
tail -f ~/.forever/lazy-server.log