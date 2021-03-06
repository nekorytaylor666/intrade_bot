const axios = require('axios');

const qiwi_token = process.env.QIWI_TOKEN;
const wallet = process.env.QIWI_WALLET;

const optionsFabric = (rows, transType, token) => {
  const options = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      rows: rows,
      operation: transType,
    },
  };
  return options;
};

const getPayments = async () => {
  const options = optionsFabric(50, 'IN', qiwi_token);
  const url = `https://edge.qiwi.com/payment-history/v2/persons/${wallet}/payments?`;
  const result = await axios.get(url, options);
  const data = result.data.data; // у киви небольшой запар в апи поэтому нужно два раза заходить в data.
  const formatedData = data.map(elem => {
    const comment = elem.comment;
    let sum = 0;
    if (elem.sum.currency === 398) {
      sum = elem.sum.amount;
    }
    if (elem.sum.currency === 643) {
      sum = elem.sum.amount * 6;
    }
    const phoneNumber = elem.personId.toString();
    const date = elem.date;
    const status = elem.status;
    return {
      comment,
      sum,
      phoneNumber,
      date,
      status,
    };
  });
  return formatedData;
};

const checkTransaction = async (transHash, phoneNumber) => {
  const data = await getPayments();
  const phoneNumberPattern = /[^+][0-9]{10}/gm;
  const validNumber = phoneNumber.match(phoneNumberPattern)[0];
  const res = data.filter(elem => elem.comment === transHash)[0];
  if (
    res &&
    res.status === 'SUCCESS' &&
    res.phoneNumber === validNumber
  ) {
    return res.sum;
  }
  return null;
};

module.exports = checkTransaction;
