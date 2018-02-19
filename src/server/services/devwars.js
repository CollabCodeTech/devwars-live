const config = require('config');
const axios = require('axios');

// Trim trailing slash from the API_URL.
const API_URL = config.get('devwars.url').replace(/\/$/, '');
const NODE_ENV = config.util.getEnv('NODE_ENV');

async function authenticate(token) {
    if (NODE_ENV === 'development') {
        switch (token) {
        case 'ADMIN':
        case 'MODERATOR':
        case 'USER':
            return { id: 1, username: 'DEV', role: token };
        }
    }

    try {
        const res = await axios(`${API_URL}/v1/user/`, {
            headers: { cookie: `token=${token}` },
        });

        const { id, username, role } = res.data;
        return { id, username, role };
    } catch (error) {
        return null;
    }
}

module.exports = {
    authenticate,
};
