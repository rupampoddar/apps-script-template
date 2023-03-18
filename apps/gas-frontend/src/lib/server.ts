import Server from 'gas-client-fork';

const PORT = import.meta.env.PORT;

const server = new Server({
  // this is necessary for local development but will be ignored in production
  allowedDevelopmentDomains: `https://localhost:${PORT}`,
});

export default server;