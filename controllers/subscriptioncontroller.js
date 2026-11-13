const crud = require('./crud');

module.exports = {
  ...crud('SUBSCRIPTION', 'Subscription_ID',
    ['Plan_ID', 'Phone_Number', 'Start_date', 'End_date', 'Status'])
};
