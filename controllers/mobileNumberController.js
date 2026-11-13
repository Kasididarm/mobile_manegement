const pool = require('../db.js');
const crud = require('./crud.js');

module.exports = {
  ...crud('MOBILE_NUMBER', 'Phone_Number',
    ['Phone_Number', 'Customer_ID', 'Activation_date', 'Status']),

  // GET /mobile-numbers/:id/details  -> number + SIM + subscriptions with plan
  async details(req, res) {
    const p = req.params.id;
    const [[number]] = await pool.query('SELECT * FROM MOBILE_NUMBER WHERE Phone_Number = ?', [p]);
    if (!number) return res.status(404).json({ error: 'MOBILE_NUMBER not found' });
    const [sim] = await pool.query('SELECT * FROM SIM_CARD WHERE Phone_Number = ?', [p]);
    const [subs] = await pool.query(
      `SELECT s.*, sp.Plan_name, sp.Monthly_fee, sp.Data_limit, sp.Call_limit
         FROM SUBSCRIPTION s JOIN SERVICE_PLAN sp ON sp.Plan_ID = s.Plan_ID
        WHERE s.Phone_Number = ?`, [p]);
    res.json({ ...number, sim: sim[0] || null, subscriptions: subs });
  }
};
