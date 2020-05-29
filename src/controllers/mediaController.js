// TODO Replace all mentions of 'MediaObjectController' with 'MediaController'
const { ValidationError, UniqueConstraintError } = require('sequelize');

const { Media, MediaMetadata, MediaArtwork } = require('../models');

const errorCodes = require('../util/errorCodes.js');
const input = require('../util/input.js');
const responses = require('../util/responses.js');
const scrub = require('../util/scrub.js');

const path = require('path');

/**
 * Error codes to be used by mediaController.
 */
const errs = {
  ...errorCodes,

  // TODO Change to 'INVALID_MEDIA_ID'.
  INVALID_MEDIA_OBJECT_ID: {
    code: `INVALID_MEDIA_OBJECT_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid`,
  },

  // TODO Change to 'MEDIA_NOT_FOUND'.
  MEDIA_OBJECT_NOT_FOUND: {
    code: `MEDIA_OBJECT_NOT_FOUND`,
    message: (req) => `Media object with ID '${req.params.id}' does not exist`,
  },
};

/**
 *
 */
const findById = async (id) => {
  return Media.findOne({
    where: {
      id,
    },
  });
};

/**
 * Gets the most appropriate name for the given media object instance.
 *
 * If available, the name will be pulled from a corresponding MediaMetadata
 * instance. If that's not available, the media instance's name property is
 * returned instead. Finally, if that is not specified, the filename derived
 * from the mediaObject's URL is used.
 */
const getMediaName = async (media) => {
  let metadata = await MediaMetadata.findOne({
    where: {
      mediaId: media.id,
      key: 'name',
    },
  });

  if (metadata) {
    return metadata.value;
  }

  if (media.name) {
    return media.name;
  }

  return path.basename(media.url);
};

/**
 *
 */
const mediaController = {

  /**
   *
   */
  index: async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;

    // Sort media items by ID (ascending).
    // Optionally include LIMIT and OFFSET values.
    const query = {
      order: [
        ['id', 'ASC'],
      ],
      limit,
      offset,
    };

    const media = await Media.findAll(query);
    res.send(media.map((mediaItem) => {
      return scrub(mediaItem, 'url');
    }));
  },

  /**
   *
   */
  createMedia: async (req, res) => {
    try {
      let media = await Media.create({
        ...req.body,
      });

      return res
        .status(201)
        .send(media);
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
  viewMedia: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (media) {
        const name = await getMediaName(media);
        return res.sendFile(path.resolve(media.url), {
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
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  // TODO Change to findMedia.
  findMedia: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (media) {
        return res
          .send(
            scrub(
              media,
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

  deleteMedia: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (media) {
        await media.destroy();
        return res.send(responses.ok());
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
  findMediaExtended: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await Media.findOne({
          where: {
            id,
          },
          include: [
            {
              model: MediaArtwork,
              as: 'artwork',
            },
            {
              model: MediaMetadata,
              as: 'metadata',
            },
          ],
        });
      if (!media) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      return res
        .send(scrub(media, 'url'));
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
  findMediaMetadata: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (!media) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      let mediaMetadata = await MediaMetadata.findAll({
        where: {
          mediaId: id
        },
      });

      return res
        .send(mediaMetadata.reduce((acc, cur) => {
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
  updateMediaMetadata: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (!media) {
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
              mediaId: id,
              key,
            },
          });
        }
        // Insert or update entry if value is specified.
        return MediaMetadata.upsert({
          mediaId: id,
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
  replaceMediaMetadata: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (!media) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      await MediaMetadata.destroy({
        where: {
          mediaId: id,
        }
      });

      const metadataPromises = Object.keys(req.body).map((key) => {
        const value = req.body[key];

        // Short-circuit if no value is provided.
        if (value === null || value === undefined) {
          return;
        }
        return MediaMetadata.create({
          mediaId: id,
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

  /**
   *
   */
  findMediaArtwork: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (!media) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      let mediaArtwork = await MediaArtwork.findAll({
        where: {
          mediaId: id,
        },
      });

      return res
        .send(mediaArtwork.map((mediaArtworkItem) => {
          return scrub(mediaArtworkItem, 'url');
        }));
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
  createMediaArtwork: async (req, res) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (!media) {
        return res
          .status(404)
          .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
      }

      const mediaArtwork = await MediaArtwork.create({
        mediaId: id,
        ...req.body,
      });

      console.log(mediaArtwork);

      return res
        .status(201)
        .send(mediaArtwork);
    }
    catch (err) {
      console.log(err);
      switch (err.constructor) {
        case UniqueConstraintError: {
          const fields = err.fields;
          return res
            .status(400)
            .send(responses.error(fields, errs.UNIQUE_CONSTRAINT_ERROR));
        }
        break;

        case ValidationError: {
          const errItem = err.errors[0];
          return res
            .status(400)
            .send(responses.error(errItem, errs.VALIDATION_ERROR));
        }
        break;
      }
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

};

module.exports = mediaController;
