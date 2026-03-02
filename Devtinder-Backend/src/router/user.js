const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const { getReceivedRequests, getConnections, getFeed } = require('../services/user.service');

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const connectionRequests = await getReceivedRequests(req.user._id);
    res.json({ message: 'Connection requests fetched successfully', connectionRequests });
  } catch (error) {
    res.status(error.statusCode || 400).json({ requestId: req.requestId, error: error.message, status: error.statusCode || 400 });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const data = await getConnections(req.user._id);
    res.json({ message: 'Connections fetched successfully', data });
  } catch (error) {
    res.status(error.statusCode || 400).json({ requestId: req.requestId, error: error.message, status: error.statusCode || 400 });
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await getFeed(req.user._id, page, limit);
    res.json({ data: users });
  } catch (error) {
    res.status(error.statusCode || 400).json({ requestId: req.requestId, error: error.message, status: error.statusCode || 400 });
  }
});

module.exports = userRouter;