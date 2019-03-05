const Hapi = require('hapi');
 
const people = { 
    1: {
      id: 1,
      name: 'keerthi'
    }
};
 
const validate = async function (decoded, request) {
 
    if (!people[decoded.id]) {
      return { isValid: false };
    }
    else {
      return { isValid: true };
    }
};
 
const init = async () => {
  const server = new Hapi.Server({ port: 4000 });
  await server.register(require('hapi-auth-jwt2'));
 
  server.auth.strategy('jwt', 'jwt',
  { key: 'NeverShareYourSecret',         
    validate: validate,          
    verifyOptions: { algorithms: [ 'HS256' ] } 
  });
 
  server.auth.default('jwt');
 
  server.route([
    {
      method: "GET", path: "/", config: { auth: false },
      handler: function(request, reply) {
         console.log('************')
        reply({text: 'Token not required'});
      }
    },
    {
      method: 'GET', path: '/restricted', config: { auth: 'jwt' },
      handler: function(request, reply) {
        reply({text: 'You used a Token!'})
        .header("Authorization", request.headers.authorization);
      }
    }
  ]);
  await server.start();
  return server;
};
 
 
init().then(server => {
  console.log('Server running at:', server.info.uri);
})
.catch(error => {
  console.log(error);
});