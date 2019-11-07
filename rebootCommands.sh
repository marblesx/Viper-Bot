#!/usr/bin/env sh
git pull origin develop
pm2 stop all
pm2 start bot.js
