#!/bin/sh

forever stop lazy-server-dev
rm -rf ~/.forever/lazy-server-dev.log.previous
mv ~/.forever/lazy-server-dev.log lazy-server-dev.log.previous
forever --uid lazy-server-dev start app.js
forever list
tail -f ~/.forever/lazy-server-dev.log
