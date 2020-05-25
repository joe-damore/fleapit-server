const MediaArtwork = require('../models/mediaArtwork.js');

const errorCodes = require('../util/errorCodes.js');
const input = require('../util/input.js');
const responses = require('../util/responses.js');
const scrub = require('../util/scrub.js');

const path = require('path');

const errs = {
  ...errorCodes,

  INVALID_ARTWORK_ID: {
    code: `INVALID_ARTWORK_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid.`,
  },

  ARTWORK_NOT_FOUND: {
    code: `ARTWORK_NOT_FOUND`,
    message: (req) => `User with ID '${req.params.id}' does not exist`,
  },
}

const findById = async (id) => {
  return MediaArtwork.findOne({
    where: {
      id,
    },
  });
}

const mediaArtworkController = {

  /**
   *
   */
  index: async (req, res) => {
    const mediaArtwork = await MediaArtwork.findAll();
    res.send(
      mediaArtwork.map((mediaArtworkItem) => {
        return scrub(mediaArtworkItem, 'urlddd');
      })
    );
  },

  /**
   *
   */
  findArtwork: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_ARTWORK_ID));
    }

    let artwork;
    try {
      artwork = await findById(id);
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }

    if (artwork) {
      return res.send(scrub(artwork, 'url'));
    }
    return res
      .status(404)
      .send(responses.error(req, errs.ARTWORK_NOT_FOUND));
  },

  viewArtwork: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_ARTWORK_ID));
    }

    let artwork;
    try {
      artwork = await findById(id);
      if (artwork) {
        return res.sendFile(path.resolve(artwork.url));
      }
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
    return res
      .status(404)
      .send(responses.error(req, errs.ARTWORK_NOT_FOUND));
  },
};

module.exports = mediaArtworkController;
