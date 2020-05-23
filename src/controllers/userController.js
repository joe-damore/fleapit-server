const User = require('../models/user.js');

const errorCodes = require('../util/errorCodes.js');
const responses = require('../util/responses.js');

/**
 * Enum-like structure to contain user-controller specific error codes.
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
   *
   */
  index: async (req, res) => {
    const users = await User.findAll();
    res.send(users);
  },

  /**
   *
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
      console.log(err);
      return res
        .status(500)
        .send();
    }
  },

  /**
   *
   */
  findUserById: async (req, res) => {
    const id = +req.params.id;

    // Short-circuit 400 error if 'id' parameter is non-numeric.
    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_USER_ID));
    }
    // Attempt to find the user with 'id' ID.
    try {
      let user = await findById(id);
      if (user) {
        return res.send(user);
      }
      // Return 404 error if user is not found.
      return res
        .status(404)
        .send(responses.error(req, errs.USER_NOT_FOUND));
    }
    catch (err) {
      // Return 500 error if SQL error occurs.
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },

  /**
   *
   */
  deleteUserById: async (req, res) => {
    const id = +req.params.id;

    // Short-circuit 400 error if 'id' parameter is non-numeric.
    if (isNaN(id)) {
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
      return res
        .status(404)
        .send(responses.error(req, errs.USER_NOT_FOUND));
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
  updateUserById: async (req, res) => {
    const id = +req.params.id;

    // Short-circuit 400 error if 'id' parameter is non-numeric.
    if (isNaN(id)) {
      return res
        .status(400)
        .send(responses.error(req, errs.INVALID_USER_ID));
    }

    try {
      let user = await findById(id);
      if (user) {
        await user.update(req.body);
        return res
          .send(responses.ok());
      }
      return res
        .status(404)
        .send(responses.error(req, errs.USER_NOT_FOUND));
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .send(responses.error(req, errs.SERVER_ERROR));
    }
  },
};

module.exports = userController;
