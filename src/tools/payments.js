const User = require('../models/User');

const checkBalanceAndPay = async (user, amount) => {
  const userId = user._id;
  const dbUser = await User.findById(userId);
  if (amount > 0) {
    if (dbUser.balance > amount) {
      dbUser.balance -= amount;
      await dbUser.save();
      return true;
    }
  }
  return false;
};

module.exports = checkBalanceAndPay;
