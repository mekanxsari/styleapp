router.get('/', async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page || '1'));
  const limit = 20;
  const offset = (page - 1) * limit;
  const q     = req.query.q || '';
  const field = req.query.field || '';

  try {
    let query = `SELECT id, image_url, title, season_1, season_2, description
                   FROM capsulas`;
    const values = [];
    let   idx    = 1;

    const allowedFields = ['title', 'season'];

    if (q) {
      if (field) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({ message: 'Invalid search field' });
        }

        if (field === 'season') {
          query += ` WHERE (season_1 ILIKE $${idx} OR season_2 ILIKE $${idx})`;
          values.push(`%${q}%`);
          idx++;
        } else {
          query += ` WHERE ${field} ILIKE $${idx}`;
          values.push(`%${q}%`);
          idx++;
        }

      } else {
        query += ` WHERE (title ILIKE $${idx}
                         OR season_1 ILIKE $${idx}
                         OR season_2 ILIKE $${idx})`;
        values.push(`%${q}%`);
        idx++;
      }
    }

    query += ` ORDER BY id
               LIMIT $${idx++}
               OFFSET $${idx}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
