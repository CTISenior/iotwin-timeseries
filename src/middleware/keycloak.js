const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const kcConfig = {
    clientId: '',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080',
    realm: '',
    realmPublicKey: ''
};

// const keycloak = new Keycloak({ store: memoryStore });
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

export default keycloak;