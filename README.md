# Viper-Bot

Welcome! Viper-Bot is a side project for myself to learn typescript, nodejs, webhooks, writing a discord bot and best practices. This README is a starter guide to go over some things of what the bot can do and how to set it up yourself. Before we start its important that you already know about setting up a discord bot, more help on that can be found [here](https://discordpy.readthedocs.io/en/latest/discord.html)

### Updating the packages for the bot.

Open the terminal or the command prompt and navigate to the folder location for the bot.
run the command `npm install package.json`

The auth.json file contains the location for the token to connect to the discord bot. You'll want to grab the authorization key from your bot and place it in the token value

```
{
  "token": "{Your key goes here}"
}
```

The config.json contains a list of configurable settings for the Viper-Bot. For example you can change the prefix to initialize the bot commands.

### Running the bot locally

You can run the bot locally on your machine, in order to do so I suggest running `node bot.js > bot.log 2> error.log` will log both console.log() and errors that occur.

### pm2

I use pm2 to keep the bot alive while deployed on my server. You can read more about [pm2 here](https://pm2.keymetrics.io/)

### Hosting my bot.

I use Azure to host my bot, again read more [here](https://azure.microsoft.com/en-us/)
