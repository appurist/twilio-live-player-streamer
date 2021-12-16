const process = require('process');

async function init()
{
  console.log ("ACCOUNT_SID:", process.env.ACCOUNT_SID);
  console.log ("API_KEY_SID:", process.env.API_KEY_SID);
  console.log ("API_KEY_SECRET:", process.env.API_KEY_SECRET);
  console.log("Initialized.");
  return 0;
}

async function run()
{
  return 0;
}

let rc = 1;
try {
  init().then(async () => {
    rc = await run();
    console.log("Complete.");
    process.exit(rc);
  })
  .catch(e => { 
    console.log("Run", e);
    process.exit(1);
  });
} catch(e) {
  console.log("Exception", e);
  process.exit(2);
}
// does not exit here, exits when run() completes or exception
