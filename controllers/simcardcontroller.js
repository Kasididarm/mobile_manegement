const crud = require('./crud');

module.exports = {
  ...crud('SIM_CARD', 'SIM_ID',
    ['Phone_Number', 'SIM_Type', 'Status'])
};
