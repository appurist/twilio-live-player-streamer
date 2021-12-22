const process = require('process');

const { roomName } = require('./config.js');
const { createRoom, endRoom, dumpRooms } = require('./room.js');
const { createStreamer, endStreamer, endIdleStreamers } = require('./streamer.js');
const { createServer } = require('./api.js')

let room;

async function run()
{
  return await createServer();
}

function shutdown(rc) {
  endStreamer();
  process.exit(1);
}

async function init() {
  try {
    dumpRooms();
    room = await createRoom(roomName);
    console.log(`Connected to room: '${roomName}':`, room);

    // returns the first non-idle streamer
    player_streamer = await endIdleStreamers();
    if (player_streamer) {
      console.log("Found existing streamer:", player_streamer.sid, JSON.stringify(player_streamer));
    } else {
      player_streamer = await createStreamer();
      console.log("Created streamer:", player_streamer.sid, JSON.stringify(player_streamer));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

let rc = 0;
try {
  init().then(async () => {
    await run();
  })
  .catch(e => { 
    console.log("Run", e);
    shutdown(1);
  });
} catch(e) {
  console.log("Exception", e);
  shutdown(2);
}
// does not exit here, exits when run() completes or exception
