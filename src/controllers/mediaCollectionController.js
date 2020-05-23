// Models
const MediaCollection = require('../models/mediaCollection.js');
const MediaObject = require('../models/mediaObject.js');

// Utilities
const errorCodes = require('../util/errorCodes.js');
const responses = require('../util/responses.js');

/**
 * Error codes to be used by mediaCollectionController.
 */
const errs = {
  ...errorCodes,

  /**
   * When a media collection is referred to using an invalid ID.
   */
  INVALID_MEDIA_COLLECTION_ID: {
    code: `INVALID_MEDIA_COLLECTION_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid`,
  },

  /**
   * When a media collection is referred to using an ID that does not exist.
   */
  MEDIA_COLLECTION_NOT_FOUND: {
    code: `MEDIA_COLLECTION_NOT_FOUND`,
    message: (req) => `Media collection with ID '${req.params.id}' does not exist`,
  },
};

/**
 * Returns an instance of MediaCollection with the given ID.
 *
 * If no record exists with the given ID, null is returned instead.
 *
 * @param {number} id - ID of media collection to find.
 *
 * @returns {Object|null} Media collection object or null.
 */
const findById = async (id) => {
  return MediaCollection.findOne({
    where: {
      id,
    },
  });
};

/**
 * Media collection controller.
 */
const mediaCollectionController = {
  /**
   * Returns an array containing all media collections.
   */
  index: async (req, res) => {
    const mediaCollections = await MediaCollection.findAll();
    res.send(mediaCollections);
  },

  /**
   * Returns an array containing only top-level media collections.
   */
  indexTopLevel: async (req, res) => {
    const mediaCollections = await MediaCollection.findAll({
      where: {
        parentCollection: null,
      },
    });
    res.send(mediaCollections);
  },

  /**
   *
   */
  createMediaCollection: async (req, res) => {
    try {
      let mediaCollection = await MediaCollection.create({
        ...req.body,
      });

      return res
        .status(201)
        .send(mediaCollection);
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   * Returns the media collection with the given ID.
   */
  findMediaCollectionById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_COLLECTION_ID));
    }

    try {
      let mediaCollection = await findById(id);
      if (mediaCollection) {
        return res.send(mediaCollection);
      }

      return res
        .status(404)
        .send(responses.error(req, errs.MEDIA_COLLECTION_NOT_FOUND));
    }
    catch (err) {
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  findMediaCollectionItemsById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_COLLECTION_ID));
    }

    try {
      if (!await findById(id)) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_COLLECTION_NOT_FOUND));
      }

      const retrievals = await Promise.all([
        (async () => {
          return MediaObject.findAll({
            where: {
              collection: id,
            },
          });
        })(),

        (async () => {
          return MediaCollection.findAll({
            where: {
              parentCollection: id,
            },
          });
        })(),
      ]);

      return res
        .send({
          objects: retrievals[0],
          collections: retrievals[1],
        });
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

};

module.exports = mediaCollectionController;
