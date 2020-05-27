// TODO Replace all mentions of "MediaCollection" with "Collection".

// Models
const Collection = require('../models/collection.js');
const Media = require('../models/media.js');

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
  INVALID_COLLECTION_ID: {
    code: `INVALID_COLLECTION_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid`,
  },

  /**
   * When a media collection is referred to using an ID that does not exist.
   */
  COLLECTION_NOT_FOUND: {
    code: `COLLECTION_NOT_FOUND`,
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
  return Collection.findOne({
    where: {
      id,
    },
  });
};

/**
 * Media collection controller.
 */
const collectionController = {
  /**
   * Returns an array containing all media collections.
   */
  index: async (req, res) => {
    const mediaCollections = await Collection.findAll();
    res.send(mediaCollections);
  },

  /**
   * Returns an array containing only top-level media collections.
   */
  indexTopLevel: async (req, res) => {
    const mediaCollections = await Collection.findAll({
      where: {
        parentCollection: null,
      },
    });
    res.send(mediaCollections);
  },

  /**
   *
   */
  createCollection: async (req, res) => {
    try {
      let mediaCollection = await Collection.create({
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
  findCollectionById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_COLLECTION_ID));
    }

    try {
      let mediaCollection = await findById(id);
      if (mediaCollection) {
        return res.send(mediaCollection);
      }

      return res
        .status(404)
        .send(responses.error(req, errs.COLLECTION_NOT_FOUND));
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
  findCollectionItemsById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_COLLECTION_ID));
    }

    try {
      if (!await findById(id)) {
        return res
          .status(404)
          .send(responses.error(req, errs.COLLECTION_NOT_FOUND));
      }

      const retrievals = await Promise.all([
        (async () => {
          return Media.findAll({
            where: {
              collection: id,
            },
          });
        })(),

        (async () => {
          return Collection.findAll({
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

module.exports = collectionController;
