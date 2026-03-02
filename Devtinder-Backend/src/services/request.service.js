const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

const ALLOWED_SEND_STATUS    = ['Ignore', 'Interested'];
const ALLOWED_RESPOND_STATUS = ['Accepted', 'Rejected'];

/**
 * Sends a connection request from one user to another.
 * @param {string} fromUserId  - logged-in user's _id
 * @param {string} toUserId    - target user's _id
 * @param {string} status      - "Ignore" | "Interested"
 * @returns {{ message: string, data: ConnectionRequest }}
 */
const sendRequest = async (fromUserId, toUserId, status) => {
  if (!ALLOWED_SEND_STATUS.includes(status)) {
    const err = new Error('Invalid status value');
    err.statusCode = 400;
    throw err;
  }

  const toUser = await User.findById(toUserId);
  if (!toUser) {
    const err = new Error('Target user not found');
    err.statusCode = 404;
    throw err;
  }

  const existing = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (existing) {
    const err = new Error('Connection request already exists between these users');
    err.statusCode = 400;
    throw err;
  }

  const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
  const data = await connectionRequest.save();

  return {
    message: `${toUser.firstName} ${status === 'Interested' ? 'received your interest!' : 'has been ignored.'}`,
    data,
  };
};

/**
 * Accepts or rejects a pending connection request directed at the logged-in user.
 * @param {string} loggedInUserId  - _id of the user responding
 * @param {string} requestId       - _id of the ConnectionRequest document
 * @param {string} status          - "Accepted" | "Rejected"
 * @returns {{ message: string, data: ConnectionRequest }}
 */
const respondToRequest = async (loggedInUserId, requestId, status) => {
  if (!ALLOWED_RESPOND_STATUS.includes(status)) {
    const err = new Error('Invalid status value');
    err.statusCode = 400;
    throw err;
  }

  const connectionRequest = await ConnectionRequest.findOne({
    _id:      requestId,
    toUserId: loggedInUserId,
    status:   'Interested',
  });

  if (!connectionRequest) {
    const err = new Error('Connection request not found or already responded to');
    err.statusCode = 404;
    throw err;
  }

  connectionRequest.status = status;
  const data = await connectionRequest.save();

  return {
    message: `Connection request ${status.toLowerCase()} successfully`,
    data,
  };
};

module.exports = { sendRequest, respondToRequest };
