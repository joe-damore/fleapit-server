const MediaObject = require('../models/mediaObject.js');
const MediaMetadata = require('../models/mediaMetadata.js');

const errorCodes = require('../util/errorCodes.js');
const responses = require('../util/responses.js');
const scrub = require('../util/scrub.js');

const path = require('path');

/**
 * Error codes to be used by mediaObjectController.
 */
const errs = {
  ...errorCodes,

  INVALID_MEDIA_OBJECT_ID: {
    code: `INVALID_MEDIA_OBJECT_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid`,
  },

  MEDIA_OBJECT_NOT_FOUND: {
    code: `MEDIA_OBJECT_NOT_FOUND`,
    message: (req) => `Media object with ID '${req.params.id}' does not exist`,
  },
};

/**
 *
 */
const findById = async (id) => {
  return MediaObject.findOne({
    where: {
      id,
    },
  });
};

/**
 * Gets the most appropriate name for the given media object instance.
 *
 * If available, the name will be pulled from a corresponding MediaCollection
 * instance. If that's not available, the mediaObject's name property is
 * returned instead. Finally, if that is not specified, the filename derived
 * from the mediaObject's URL is used.
 */
const getMediaObjectName = async (mediaObject) => {
  let metadata = await MediaMetadata.findOne({
    where: {
      mediaObjectId: mediaObject.id,
      key: 'name',
    },
  });

  if (metadata) {
    return metadata.value;
  }

  if (mediaObject.name) {
    return mediaObject.name;
  }
  return path.basename(mediaObject.url);
};

/**
 *
 */
const mediaObjectController = {

  /**
   *
   */
  index: async (req, res) => {
    const mediaObjects = await MediaObject.findAll();
    res.send(mediaObjects);
  },

  /**
   *
   */
  createMediaObject: async (req, res) => {
    try {
      let mediaObject = await MediaObject.create({
        ...req.body,
      });

      return res
        .status(201)
        .send(mediaObject);
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  findMediaObjectById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let mediaObject = await findById(id);
      if (mediaObject) {
        const name = await getMediaObjectName(mediaObject);
        return res.sendFile(path.resolve(mediaObject.url), {
          headers: {
            'Content-Disposition': `filename="${name}"`,
          },
        });
      }

      return res
        .status(404)
        .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
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
  findMediaObjectInfoById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let mediaObject = await findById(id);
      if (mediaObject) {
        return res
          .send(
            scrub(
              mediaObject,
              'url',
            )
          );
      }

      return res
        .status(404)
        .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  findMediaObjectMetadataById: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let mediaObject = await findById(id);
      if (!mediaObject) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      let mediaObjectMetadata = await MediaMetadata.findAll({
        where: {
          mediaObjectId: id
        },
      });

      return res
        .send(mediaObjectMetadata.reduce((acc, cur) => {
          const metadata = {};
          metadata[cur.key] = cur.value;

          return {
            ...acc,
            ...metadata
          };
        }, {}));
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  updateMediaObjectMetadata: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let mediaObject = await findById(id);
      if (!mediaObject) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      const metadataPromises = Object.keys(req.body).map((key) => {
        const value = req.body[key];

        if (value === null || value === undefined) {
          // Remove metadata entry if value is null or undefined.
          return MediaMetadata.destroy({
            where: {
              mediaObjectId: id,
              key,
            },
          });
        }
        // Insert or update entry if value is specified.
        return MediaMetadata.upsert({
          mediaObjectId: id,
          key,
          value,
        });
      });

      await Promise.all(metadataPromises);
      return res.send(responses.ok());
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  replaceMediaObjectMetadata: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let mediaObject = await findById(id);
      if (!mediaObject) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      await MediaMetadata.destroy({
        where: {
          mediaObjectId: id,
        }
      });

      const metadataPromises = Object.keys(req.body).map((key) => {
        const value = req.body[key];

        // Short-circuit if no value is provided.
        if (value === null || value === undefined) {
          return;
        }
        return MediaMetadata.create({
          mediaObjectId: id,
          key,
          value
        });
      });

      await Promise.all(metadataPromises);
      return res.send(responses.ok());
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

};

module.exports = mediaObjectController;
