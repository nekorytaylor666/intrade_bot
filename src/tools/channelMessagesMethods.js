const deleteMessageFromChannel = (order, ctx) => {
  const msgId = order.channelMsgId;
  const channelId = -process.env.OFFICIAL_CHANNEL_CHAT_ID;
  try {
    return ctx.telegram.deleteMessage(channelId, msgId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = deleteMessageFromChannel;
