const { Events, Metrics, Team, Review, Metrics } = require('../models/relations');
const logger = require('../logging/logger');
const { QueryTypes, Sequelize } = require('sequelize');

class EventsController {
  static async createEvent (event) {
    try {
      const reviews = [];
      for (let i = 0; i < event.round; i++) {
        reviews.push({ reviewNo: i + 1 });
      }
      event.Reviews = reviews;
      event.Metrics = event.metrics;

      // bulk create

      const createdEvent = await Events.create(event, {
        include: [Review, Metrics]
      });

      return {
        message: 'event created',
        createdEvent
      };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async getEvent (eventId) {
    try {
      const event = await Events.findByPk(eventId);
      const review = await Review.findAll({where: {eventId}});
      const metric = await Metric.findAll({where: {eventId}});
      return {event, review, metric};
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async getAllEvents () {
    try {
      let events = await Events.findAll({
			    attributes: {
			        include: [[Sequelize.fn('COUNT', Sequelize.col('Teams.teamId')), 'teamCount']]
			    },
			    include: [{
			        model: Team, attributes: []
			    }], 
          group: [
            "Event.eventId"
          ],
          raw: true
      });      

      const eventIds = events.map(event => event.eventId);
      const reviews = await Review.findAll({where: {eventId: eventIds}, raw: true});
      const metrics = await Metrics.findAll({where: {eventId: eventIds}, raw: true});

      events = events.map(event => {
        let eventReview = reviews.filter(review => review.eventId === event.eventId);
        let eventMetric = metrics.filter(metric => metric.eventId === event.eventId);
        event.reviews = eventReview;
        event.metrics = eventMetric;
        return event;
      });
      console.log(events);

      return events;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async updateEvent (event) {
    try {
      const updatedEvent = await Events.update(event, { where: { eventId: event.eventId } });
      return updatedEvent;
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }

  static async deleteEvent (eventId) {
    try {
      await Events.destroy({ where: { eventId: eventId } });
      return { message: 'deleted event' };
    } catch (e) {
      logger.error(e);
      return {
        isError: true,
        message: e.toString()
      };
    }
  }
}

module.exports = EventsController;
