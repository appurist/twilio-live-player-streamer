const { accountSid, apiKey, apiSecret } = require('./config.js');

const express = require('express');
const http = require('http');
const path = require('path');

function createServer() {
  const { jwt: { AccessToken } } = require('twilio');
  const VideoGrant = AccessToken.VideoGrant;
  // Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
  const MAX_ALLOWED_SESSION_DURATION = 14400;

  // Create Express webapp.
  const app = express();

  app.use(`/`, express.static('public'));

  app.get('/token', function(request, response) {
    const { identity } = request.query;

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    const token = new AccessToken(accountSid, apiKey, apiSecret, { ttl: MAX_ALLOWED_SESSION_DURATION });

    // Assign the generated identity to the token.
    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    const grant = new VideoGrant();
    token.addGrant(grant);

    // Serialize the token to a JWT string.
    response.send(token.toJwt());
  });
  
  // Create http server and run it.
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;
  server.listen(port, function() {
    console.log('Express server running on *:' + port);
  });
}

module.exports = { createServer };