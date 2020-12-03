const { Auth } = require('../models/relations');
const logger = require('../logging/logger');

class AuthController {
    static async createUser(auth) {
        try {
            const user = await Auth.findOne({ where: { email: auth.email } });
            if (user) {
                return {
                    isError: true,
                    message: "This email already exists",
                    status: 409
                };
            }
            const createdAuth = await Auth.create(auth);
            createdAuth.password = Math.random().toString(36).substring(2);
            return {
                message: 'Auth created',
                createdAuth,
                status: 200
            };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString(),
                status: 400
            };
        }
    }

    static async getAuth(authId) {
        try {
            const auth = await Auth.findByPk(authId);
            return auth;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async getAuthByEmail(auth) {
        try {
            const user = await Auth.findOne({ where: { email: auth.email, isAdmin: auth.isAdmin } });
            user.password = Math.random().toString(36).substring(2);
            if (!user) {
                return {
                    message: "User doesn't exist",
                    isError: true
                }
            }
            return user;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async updateAuth(Auth) {
        try {
            const updatedAuth = await Auth.update(Auth, { where: { authId: Auth.authId } });
            return updatedAuth;
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }

    static async deleteAuth(authId) {
        try {
            await Auth.destroy({ where: { authId: authId } });
            return { message: 'deleted Auth' };
        } catch (e) {
            logger.error(e);
            return {
                isError: true,
                message: e.toString()
            };
        }
    }
}

module.exports = AuthController;