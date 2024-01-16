#!/bin/bash

# Stop on first error
set -e;

# create log directory if missing
mkdir -p ./.log;

# start daemon
pm2 startOrRestart .pm2/${APP_ENV:='development'}.config.js "$@";
