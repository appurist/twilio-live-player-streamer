const { accountSid, authToken, apiKey, apiSecret, roomName } = require('./config.js');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const identity = 'DefaultUser';
let client = undefined;
let streamer = undefined;

function initClient(roomName) {
  if (!client) {
    client = require('twilio')(accountSid, authToken);
  }

  // Create Video Grant
  const videoGrant = new VideoGrant({room: roomName});
 
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(accountSid, apiKey, apiSecret, {identity});
  token.addGrant(videoGrant);
 
  // Serialize the token to a JWT string
  console.log(token.toJwt());
}

async function dumpStreamers() {
  initClient(roomName);

  let result = await client.media.playerStreamer.list();
  if (result) {
    result.forEach(p => console.log("Found streamer:", p.sid, JSON.stringify(p)));
  }
  return result;
}

async function endIdleStreamers() {
  let result;
  initClient(roomName);
  
  let streamers = await client.media.playerStreamer.list();
  if (streamers) {
    await streamers.forEach(async (p) => {
      if (p.status.toLowerCase() != 'ended') {
        if (result) {
          await client.media.playerStreamer(p.sid).update({status: 'ended'});
          console.log(`Ended streamer: ${p.sid} (was ${p.status}.`);
        } else {
          result = p;
          console.log("Found available streamer:", p.sid, p.status);
        }
      }
    });
  }
  return result;
}

async function createStreamer(roomName) {
  initClient(roomName);
  streamer = await client.media.playerStreamer.create();  // need to save this for endStreamer
  return streamer;
}

async function endStreamer() {
  return client && streamer ? await client.media.playerStreamer.end() : false;
}

module.exports = { createStreamer, endStreamer, endIdleStreamers, dumpStreamers };