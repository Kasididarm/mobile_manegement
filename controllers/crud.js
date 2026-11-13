const pool = require('../db');

// Builds list/get/create/update/remove handlers for one table.
// `fields` is a whitelist of writable columns (the PK is included
// only when it is NOT auto-generated, e.g. MOBILE_NUMBER.Phone_Number).
module.exports = function crud(table, pk, fields) {
  return {
    async list(req, res) {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      res.json(rows);
    },
    async get(req, res) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: `${table} not found` });
      res.json(rows[0]);
    },
    async create(req, res) {
      const cols = fields.filter(f => req.body[f] !== undefined);
      if (!cols.length) return res.status(400).json({ error: 'No valid fields supplied' });
      const [r] = await pool.query(
        `INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`,
        cols.map(c => req.body[c])
      );
      const id = r.insertId || req.body[pk];
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [id]);
      res.status(201).json(rows[0]);
    },
    async update(req, res) {
      const cols = fields.filter(f => f !== pk && req.body[f] !== undefined);
      if (!cols.length) return res.status(400).json({ error: 'No valid fields supplied' });
      const [r] = await pool.query(
        `UPDATE ${table} SET ${cols.map(c => c + ' = ?').join(', ')} WHERE ${pk} = ?`,
        [...cols.map(c => req.body[c]), req.params.id]
      );
      if (!r.affectedRows) return res.status(404).json({ error: `${table} not found` });
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [req.params.id]);
      res.json(rows[0]);
    },
    async remove(req, res) {
      const [r] = await pool.query(`DELETE FROM ${table} WHERE ${pk} = ?`, [req.params.id]);
      if (!r.affectedRows) return res.status(404).json({ error: `${table} not found` });
      res.status(204).end();
    }
  };
};
