const { accountSid, authToken} = require('./config.js');

const ROOM_TYPE = 'group';  // go, peer-to-peer, group-small, or group. The default value is group.

let client;

async function dumpRooms() {
  if (!client) {
    client = require('twilio')(accountSid, authToken);
  }
  try {
    let rooms = await client.video.rooms.list();
    rooms.forEach(r => console.log(r.sid, r.status))
    return rooms;
  } catch (err) {
    console.warn(`Room '${uniqueName}' error ${err.status}: ${err.message}`);
    return false;
  }
}

async function findRoom(uniqueName) {
  if (!client) {
    client = require('twilio')(accountSid, authToken);
  }
  let room;
  try {
    room = await client.video.rooms(uniqueName).fetch();
  } catch (err) {
    console.warn(`Room '${uniqueName}' error ${err.status}: ${err.message}`);
  }
  return room;
}
                  
async function createRoom(uniqueName) {
  if (!client) {
    client = require('twilio')(accountSid, authToken);
  }
  let room;
  try {
    room = await client.video.rooms.create({uniqueName, type: ROOM_TYPE})
  } catch (err) {
    if (err.message.toLowerCase().includes("room exists")) {
      room = findRoom(accountSid, authToken, uniqueName);
    } else {
      console.error(`Error creating room '${uniqueName}':`, err.message);
    }
  }
  return room;
}
                  
module.exports = { dumpRooms, findRoom, createRoom };
