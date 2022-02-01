# "Redux in Minecraft" Showcase

Welcome to the "Redux in Minecraft" showcase! This repository showcases a working implementation of getting JavaScript
Redux within Minecraft AND getting Redux DevTools connected to that store (in some fashion).

# Getting Started

## Prerequisites

- Java 17
- Minecraft 1.18 (You can launch with Minecraft, but you can't really see this in action)

## Installation

To get started, you'll need to do the following:

- Download the latest version of [1.18.1 Paper](https://papermc.io/downloads).
  - Tested version: 178
  - Once download, move this file into the `server` folder and rename to `server.jar`.
  - Open a terminal and run `yarn server:start` to run the server. When running it for the first time, you'll need to
    accept the `EULA` in `./server/eula.txt`.
- Download the latest [Grakkit](https://github.com/grakkit/grakkit/releases/tag/v5.0.5) paper jar
  - Tested version: 5.0.5
  - Once downloaded, place this in the `server/plugins` folder. If no plugins folder exists, create one.
- Download the latest [wscb-spigot](https://github.com/RepComm/wscb-spigot/releases/tag/1.0).
  - Tested version: 1.0.0-SNAPSHOT
  - Once downloaded, place this in the `server/plugins` folder.

## Launch Processes

- Open terminal and run `yarn server:js`. Wait for it to finish building, it'll say "Failed to connect...".
- Open another terminal and run `yarn server:start`. This will launch the server.
- Open a third terminal and run `yarn devtools:server`. This will open up a new window (Redux DevTools).
  - You will need to go to `Settings`, select `use local (custom) server`, and input the following:
    - hostname: localhost
    - port: 8000
  - Hit `connect`
- Open a fourth terminal and run `yarn devtools:connect`. This will connect the Minecraft Server and DevTools together.
- Open up Minecraft and join the server. The default is usually `127.0.0.1:25565`

## Testing

Once you join the game, you can do some of the following (to trigger a Redux Action):

- Join
- Quit
- Kill a mob
- Break blocks
- Die

Each of those events will trigger an action and update a property. You should be able to observe it in the Redux
DevTools.

# How does this work?

TBD

# Credits

- Folks who worked on Grakkit! They were able to bring a functional plugin using GraalVM, which allows folks to write
  JavaScript for Minecraft! [Grakkit](https://github.com/grakkit/grakkit)
- Redux is just amazing! [Redux](https://github.com/reduxjs/redux-toolkit)
- Repcomm for figuring out websockets. [Spigot Websockets](https://github.com/RepComm/wscb-spigot)
