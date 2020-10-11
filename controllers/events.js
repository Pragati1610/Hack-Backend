const Events = require("../models/events");
const logger = require("../logging/logger");

class EventsController {
	static async createEvent(event){
		try {
			const createdEvent = await event.create(event);
			return {
				message: "event created",
				createdEvent
			}
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}
	}

	static async getEvent(eventId) {
		try {
			const event = await event.findById(eventId);
			return event;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}

	static async getAllEvents() {
		try {
			const event = await event.findAll();
			return event;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}

	static async updateEvent(event) {
		try {
			const updatedEvent = await event.update(event, { where: { eventId: event.eventId }});
			return updatedEvent;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}

	static async deleteevent(eventId) {
		try {
			await event.destroy({ where: {eventId: eventId}});
			return {message: "deleted event"};
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	} 
}
