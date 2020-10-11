const Auth = require("../models/auth");
const logger = require("../logging/logger");


class AuthController {
	static async createUser(auth){
		try {
			const createdAuth = await Auth.create(auth);
			return {
				message: "Auth created",
				createdAuth
			}
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async getAuth(authId) {
		try {
			const Auth = await Auth.findById(authId);
			return Auth;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}

	static async getAuthByEmail(authEmail) {
		try {
			const Auth = await Auth.findOne({ where: {email: authEmail}});
			console.log(authEmail);
			return Auth;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}


	static async updateAuth(Auth) {
		try {
			const updatedAuth = await Auth.update(Auth, { where: { authId: Auth.authId }});
			return updatedAuth;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async deleteAuth(authId) {
		try {
			await Auth.destroy({ where: {authId: authId}});
			return {message: "deleted Auth"};
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	} 


}

module.exports = AuthController;
