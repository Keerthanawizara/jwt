'use strict';

const Hapi = require('hapi');
const jwt = require('jsonwebtoken');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

var accounts = {
  123: {
      id: 123,
      user: 'john',
      fullName: 'John Doe',
      scope: ['a', 'b']
  }
};


var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';

// Use this token to build your request with the 'Authorization' header.  
// Ex:
//     Authorization: Bearer <token>
var token = jwt.sign({ accountId: 123 }, privateKey, { algorithm: 'HS256'} );


var validate = function (request, decodedToken, callback) {

  var error,
      credentials = accounts[decodedToken.accountId] || {};

  if (!credentials) {
      return callback(error, false, credentials);
  }

  return callback(error, true, credentials)
};


server.register(require('hapi-auth-jwt'), function (error) {

  server.auth.strategy('token', 'jwt', {
      key: privateKey,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }  // only allow HS256 algorithm
  });

  server.route({
      method: 'GET',
      path: '/',
      config: {
          auth: 'token'
      }
  });

  // With scope requirements
  server.route({
      method: 'GET',
      path: '/withScope',
      config: {
          auth: {
              strategy: 'token',
              scope: ['a']
          }
      }
  });
});


const init = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();





