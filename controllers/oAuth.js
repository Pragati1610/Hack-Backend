const { Auth } = require("../models/relations");

var admin = require("firebase-admin");
const logger = require('../logging/logger');

var serviceAccount = require("../firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dsc-ideathon.firebaseio.com"
});

class OAuthController {
    static async createUser(idToken) {
        try {
            const adminInstance = await admin.auth()
            const userInfo = await adminInstance.verifyIdToken(idToken);
            const name = userInfo.name;
            const email = userInfo.email;

            const user = await Auth.findOne({ where: { email: email } });
            if (user) {
                return {
                    isError: true,
                    message: "This email already exists",
                    status: 409
                };
            }
            let random = Math.random().toString(36).substring(2);
            const auth = {
                email,
                name,
                password: random,
                isAdmin: false
            }
            const createdAuth = await Auth.create(auth);
            return {
                message: 'Auth created',
                userInfo,
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
}

module.exports = OAuthController;