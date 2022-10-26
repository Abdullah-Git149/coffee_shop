const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require("../models/User")

const checkVendorAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "unauthorized" })
  }
  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.KEY, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "unauthorized" })
    }

    const { userId } = payload;
    const user = await User.findById({ _id: userId, role: "vendor" })

    if (!user) {
      return res.status(401).send({ error: "unauthorized" })
    } else if (user.authentication !== token) {
      return res.status(401).send({ error: "unauthorized" })
    } else if (user.authentication ===   token) {
      req.payload = user;
      next();
    }
    else {
      return res.status(401).send({ error: "Access Denied" })
    }
  })
}

module.exports = { checkVendorAuth }
