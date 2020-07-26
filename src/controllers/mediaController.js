// TODO Replace all mentions of 'MediaObjectController' with 'MediaController'
const { ValidationError, UniqueConstraintError } = require('sequelize');

const { Media, MediaMetadata, MediaArtwork } = require('../models');

const errorCodes = require('../util/errorCodes.js');
const errorDigest = require('../util/errorDigest.js');
const input = require('../util/input.js');
const keyValue = require('../util/keyValue.js');
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

  MEDIA_METADATA_NOT_FOUND: {
    code: `MEDIA_METADATA_NOT_FOUND`,
    message: (req) => `Media metadata for object with ID '${req.params.id}'' does not exist.`,
  },
};

/**
 * Finds the media object with the given ID.
 *
 * @param {number} id - Media object ID.
 * @param {Object=} options - Sequelize query options.
 *
 * @returns {Object} Promise for Sequelize query.
 */
const findById = async (id, options = {}) => {
  return Media.findOne({
    ...options,
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
    },
  });

  if (metadata && metadata.get()?.metadata?.name) {
    return metadata.get().metadata.name;
  }

  if (media.name) {
    return media.name;
  }

  return path.basename(media.url);
};

// Joined data to be included when viewing "extended" media info.
const extendedInfoJoin = [
  { model: MediaArtwork, as: 'artwork' },
  { model: MediaMetadata, as: 'metadata' },
];

/**
 * Controller to handle media-related requests.
 */
const mediaController = {

  /**
   * List all media objects.
   *
   * Query parameters:
   * - limit (Optional)
   *     Maximum number of results to return. When not specified, no limit is
   *     used.
   * - offset (Optional)
   *     Offset of rows to be included in result set. No offset is applied by
   *     default.
   * - ext (Optional)
   *     When present, extended media info (metadata, artwork) is included in
   *     results.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  index: async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const ext = req.query.ext;

    // Sort media items by ID (ascending).
    // Optionally include LIMIT and OFFSET values.
    // Optionally include artwork and metadata info.
    const query = {
      order: [['id', 'ASC']],
      include: (ext !== undefined ? extendedInfoJoin : undefined),
      limit,
      offset,
    };

    try {
      // Get model instance from each result, flatten metadata into object,
      // and scrub 'url' property.
      const media = (await Media.findAll(query)).map((mediaItem) => {
        const output = mediaItem.get();
        if (!output.metadata) {
          output.metadata = {};
        }
        return scrub(output, 'url');
      });

      res.send(media);
    }
    catch (err) {
      errorDigest(err, req, res).send();
    }
  },

  /**
   * Finds a single given media object by ID.
   *
   * Query parameters:
   * - ext (Optional)
   *     When present, extended media info (metadata, artwork) is included in
   *     result.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  findMedia: async (req, res) => {
    const id = input.toNumber(req.params.id);
    const queryOptions = {
      include: (req.query.ext === undefined ? undefined : extendedInfoJoin),
    };

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      const media = await findById(id, queryOptions);

      if (media) {
        return res.send(scrub(media.get(), 'url'));
      }

      return res
        .status(404)
        .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
    }
    catch (err) {
      errorDigest(err, req, res).send();
    }
  },

  /**
   * Creates a media object.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
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
      errorDigest(err, req, res).send();
    }
  },

  /**
   * Finds a media object by ID and serves the media file that it refers to.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  viewMedia: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
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
      errorDigest(err, req, res).send();
    }
  },

  /**
   * Finds a media object by ID and serves the media file that it refers to for download.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  downloadMedia: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_MEDIA_OBJECT_ID));
    }

    try {
      let media = await findById(id);
      if (media) {
        const name = await getMediaName(media);
        return res.download(path.resolve(media.url));
      }

      return res
        .status(404)
        .send(responses.error(req, errs.MEDIA_OBJECT_NOT_FOUND));
    }
    catch (err) {
      errorDigest(err, req, res).send();
    }
  },

  /**
   * Deletes the media object with the given ID.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
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
      errorDigest(err, req, res).send();
    }
  },

  /**
   *
   */
  findMediaMetadata: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
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

      const metadataData = await MediaMetadata.findOne({
        where: {
          mediaId: id
        },
      });

      const metadataOutput = (() => {
        if (metadataData) {
          return metadataData.get().metadata;
        }
        return {};
      })();

      return res.send(metadataOutput);
    }
    catch (err) {
      console.log(err);
      errorDigest(err, req, res).send();
    }
  },

  /**
   *
   */
  upsertMediaMetadata: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
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

      const recordsBefore = await MediaMetadata.count({
        where: {
          mediaId: id,
        },
      });

      await MediaMetadata.upsert({
        mediaId: id,
        metadata: req.body,
      });

      const recordsAfter = await MediaMetadata.count({
        where: {
          mediaId: id,
        },
      });

      // Respond with 200 status by default, or 201 if new record was created.
      let status = 200;
      if (recordsAfter > recordsBefore) {
        status = 201;
      }

      return res.status(status).send(responses.ok());
    }
    catch (err) {
      errorDigest(err, req, res).send();
    }
  },

  /**
   *
   */
  patchMediaMetadata: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
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

      const metadataResult = await MediaMetadata.findOne({
        where: {
          mediaId: id,
        },
      });

      const metadata = metadataResult?.get()?.metadata || {};

      await MediaMetadata.upsert({
        mediaId: id,
        metadata: {
          ...metadata,
          ...req.body,
        },
      });

      return res.send(responses.ok());
    }
    catch (err) {
      console.log(err);
      errorDigest(err, req, res).send();
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
      errorDigest(err, req, res).send();
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

      return res
        .status(201)
        .send(mediaArtwork);
    }
    catch (err) {
      errorDigest(err, req, res).send();
    }
  },

};

module.exports = mediaController;
