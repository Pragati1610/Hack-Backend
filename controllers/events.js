const Events = require("../models/events");
const Team = require("../models/team");
const Review = require("../models/review");
const logger = require("../logging/logger");
const { QueryTypes } = require('sequelize');

class EventsController {
	static async createEvent(event){
		try {
			const createdEvent = await Events.create(event); 
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
			const event = await Events.findById(eventId);
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
			const events = await Events.findAll({
			    attributes: { 
			        include: [[Sequelize.fn("COUNT", Sequelize.col("teams.team_id")), "teamCount"]] 
			    },
			    include: [{
			        model: Team, attributes: []
			    }]
			});
			return events;
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
			const updatedEvent = await Events.update(event, { where: { eventId: event.eventId }});
			return updatedEvent;
		} catch (e) {
			logger.error(e);
			return {
				isError: true,
				message: e.toString(),
			}
		}	
	}

	static async deleteEvent(eventId) {
		try {
			await Events.destroy({ where: {eventId: eventId}});
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
