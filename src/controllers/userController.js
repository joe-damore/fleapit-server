const { User } = require('../models');

const { ValidationError } = require('sequelize');

const errorCodes = require('../util/errorCodes.js');
const input = require('../util/input.js');
const responses = require('../util/responses.js');
const skeleton = require('../util/skeleton.js');

/**
 * Enum to contain user-controller specific error codes.
 */
const errs = {
  ...errorCodes,

  INVALID_USER_ID: {
    code: `INVALID_USER_ID`,
    message: (req) => `ID '${req.params.id}' is non-numeric or otherwise invalid`,
  },

  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: (req) => `User with ID '${req.params.id}' does not exist`,
  },
};

/**
 *
 */
const findById = async (id) => {
  return User.findOne({
    where: {
      id,
    },
  });
}

/**
 * User controller.
 *
 * Contains public functions to manage users.
 */
const userController = {

  /**
   * Returns an array of all users.
   */
  index: async (req, res) => {
    const users = await User.findAll();
    res.send(users);
  },

  /**
   * Creates a user.
   */
  createUser: async (req, res) => {
    try {
      let user = await User.create({
        ...req.body,
      });

      return res
        .status(201)
        .send(user);
    }
    catch (err) {
      return res
        .status(500)
        .send();
    }
  },

  /**
   * Finds and returns the user with the given ID.
   *
   * If no user with the given ID exists, a 404 HTTP response is sent.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  findUser: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_USER_ID));
    }

    let user;
    try {
      user = await findById(id);
    }
    catch (err) {
      // Return 500 error if SQL error occurs.
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }

    if (user) {
      return res.send(user);
    }
    return res
        .status(404)
        .send(responses.error(req, errs.USER_NOT_FOUND));
  },

  /**
   * Deletes the user with the given ID.
   *
   * If no user with the given ID exists, a 404 HTTP response is sent.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  deleteUser: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_USER_ID));
    }

    try {
      let user = await findById(id);
      if (user) {
        await user.destroy();
        return res
          .send(responses.ok());
      }
    }
    catch (err) {
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }

    return res
      .status(404)
      .send(responses.error(req, errs.USER_NOT_FOUND));
  },

  /**
   * Replaces the user object with the given ID.
   *
   * @param {Object} req - Express request.
   * @param {Object} res - Express response.
   */
  updateUser: async (req, res) => {
    const id = input.toNumber(req.params.id);

    if (!id) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_USER_ID));
    }

    try {
      const user = await findById(id);
      if (!user) {
        return res
          .status(404)
          .send(responses.error(req, errs.USER_NOT_FOUND));
      }

      await user.update({
        ...skeleton(User),
        ...req.body,
      });

      return res
        .send(responses.ok());
    }
    catch (err) {
      switch (err.constructor) {
        case ValidationError:
          const errItem = err.errors[0];
          switch (errItem.type) {
            case 'notNull Violation':
              // Not-Null violation has occurred.
              return res
                .status(400)
                .send(responses.error(errItem, errs.NOT_NULL_VIOLATION));
              break;
          }
          // Unknown validation error has occurred.
          return res
            .status(400)
            .send(responses.error(errItem, errs.VALIDATION_ERROR));
          break;
      }
      // Unknown error has occurred.
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },
};

module.exports = userController;
