const crud = require('./crud');

module.exports = {
  ...crud('SERVICE_PLAN', 'Plan_ID',
    ['Plan_name', 'Monthly_fee', 'Data_limit', 'Call_limit'])
};
