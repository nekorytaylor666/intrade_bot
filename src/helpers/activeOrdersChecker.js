/* eslint-disable @typescript-eslint/no-var-requires */
const Telegram = require('telegraf/telegram')


const Order = require('../models/Order');
const User = require('../models/User');

const daysBetween = (first, second) => {
    // Copy date parts of the timestamps, discarding the time parts.
    const one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    const two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const millisBetween = two.getTime() - one.getTime();
    const days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);

}

const checkForOutDating = async () => {
    //TODO сделать функцию которая будет менять это значение в зависимости от подписки пользователя
    const outDateAmount = 1;
    const outDatedOrders = [];
    const cursor = Order.find({
        isActive: true
    }).lean().cursor();

    await cursor.eachAsync(doc => {
        const docDate = new Date(doc.date);
        const today = new Date();
        const dayGap = daysBetween(docDate, today);
        if (dayGap > outDateAmount) {
            outDatedOrders.push(doc);
        }
    });
    console.log(outDatedOrders);
    return outDatedOrders;
}


const checkUserForOutDatingOrders = async () => {
    //TODO сделать функцию которая будет менять статус найденных ордеров на false
    const telegram = new Telegram(process.env.TELEGRAM_TOKEN);
    //amount of days after order become outdated
    const outDateAmount = 0;
    const cursor = User.find({
        isPremium: false
    }).populate('orders').lean().cursor();

    cursor.eachAsync(async user => {
        const orders = user.orders;
        const outDatedOrders = [];
        //check every order of user if its outdated then make list from it
        orders.map(order => {
            const orderDate = new Date(order.date);
            const today = new Date();
            const dayGap = daysBetween(orderDate, today);
            if (dayGap > outDateAmount) {
                return outDatedOrders.push(order);
            }
        });
        //TODO change the tg message
        try {
            //if there any outdated orders send notification in telegram
            if (outDatedOrders.length > 0) {
                await telegram.sendMessage(user.telegramUserId,
                    `This orders are outdated please upgrade your account to premium to continue finding provider:\n${outDatedOrders.map((doc,index)=>`${index+1}.${doc.title}\n`)}`);
            }
        } catch (error) {
            console.log(error);
        }
    }).then(console.log('Рассылка завершена!')).catch(err => console.log(err));
}

//
module.exports = checkUserForOutDatingOrders;