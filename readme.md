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

- As Minecraft is a Java-based game and Redux is a JavaScript library, we use a JavaScript engine. This library uses
  GraalVM.
- GraalVM is provided by the Grakkit server plugin. For more information,
  [please check them out](https://github.com/grakkit/grakkit).
- To quickly get started, this project uses [Grakkit Boilerplate](https://github.com/MercerK/grakkit-boilerplate),
  providing a baseline for Babel, TypeScript, Webpack, and a hot reloader. A transpiler is needed (I believe) to use
  Redux Toolkit.
  - This will take our TypeScript and transpile it to JavaScript, moving it into the grakkit folder. Once completed,
    it'll send a web request to the server to reload the plugin.
- Getting Redux and Redux Toolkit is pretty simple at this point. This project uses it to dispatch actions as a result
  of a few player interactions and showcases that data when they join.
- Redux DevTools is a little bit more involved.
  - Redux DevTools uses [SocketCluster](https://github.com/reduxjs/redux-devtools/blob/main/docs/Integrations/Remote.md)
    to connect to a redux remote instance.
  - Unfortunately, I was not able to get SocketCluster-Java to work on Minecraft directly. As a result, I used
    [RepComm's singlethreaded websocket plugin implementation](https://github.com/RepComm/wscb-spigot). This does have
    limitations and does not work directly with SocketCluster.
    - It doesn't have channel support.
  - To overcome those limitations, we use `./scripts/reduxDevTools/index` to connect both instances together.
    - We use an older Socketcluster client (aligns with their docs better) to connect to Redux DevTools, then a regular
      websocket client to connect to the server.
    - Once both are connected, the next step becomes sending the state, action, and listening to monitor events. See
      [docs](https://github.com/reduxjs/redux-devtools/blob/main/docs/Integrations/Remote.md#4-sending-the-action-and-state-to-the-monitor)
      for more info.

# What is the use case?

A key benefit is being able to use existing DevTools to see your global state layer and be able to dive down into the
state. As we're operating from the JavaScript layer, we don't have the benefit of running a debugger. Outside of
DevTools, you can use Redux for all sorts of things within Minecraft.

For MercDawg's server, we use it for the following:

1. Track player-applied entity costumes and reapply them on server launch.
   - This single use case ignited the fire that started the path to Redux.
2. Track player cooldowns.
   - We have cooldowns for all sorts of things, but none of these originally persisted. By moving it directly into Redux
     and solving the persistence problem, it makes this a lot easier. When the server crashes or reboots, all cooldowns
     will be restored to the values prior to the shutdown/crash.
3. Track player configurations as a result of commands.
   - One example we use is associated to "Prevent Mining". When 1.17 was introduced, they introduced a new block that
     should not be broken (as it does not drop and this block grows new blocks). We created "PreventMine", which is a
     QOL feature for players to prevent themselves from accidentally breaking amethysts. With Redux, this feature saw a
     major overhaul and was greatly improved, including persistence.

And there is just so much more that can be done. We are just scratching the surface.

# Credits

- Folks who worked on Grakkit! They were able to bring a functional plugin using GraalVM, which allows folks to write
  JavaScript for Minecraft! [Grakkit](https://github.com/grakkit/grakkit)
- Redux is just amazing! [Redux](https://github.com/reduxjs/redux-toolkit)
- Repcomm for figuring out websockets. [Spigot Websockets](https://github.com/RepComm/wscb-spigot)
