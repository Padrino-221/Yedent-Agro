/**
 * Create (or reset the password of) an admin user.
 *
 * Usage:
 *   node scripts/create-admin.js [email] [password] [--role group_admin|dept_admin]
 *
 * Examples:
 *   node scripts/create-admin.js
 *   node scripts/create-admin.js admin@yedentghana.com s3cret! --role group_admin
 */
const bcrypt = require('bcryptjs');
const { query } = require('../src/config/db');

const args = process.argv.slice(2);
const emailIndex = args.findIndex((a) => !a.startsWith('--'));
const email = emailIndex >= 0 ? args[emailIndex] : process.env.ADMIN_EMAIL || 'admin@yedentghana.com';
const roleIndex = args.indexOf('--role');
const role = roleIndex >= 0 && args[roleIndex + 1] ? args[roleIndex + 1] : 'group_admin';
let password = process.env.ADMIN_PASSWORD;

if (emailIndex >= 0 && args[emailIndex + 1] && !args[emailIndex + 1].startsWith('--')) {
  password = args[emailIndex + 1];
}
if (!password) {
  // generate a random password and print it
  password = require('crypto').randomBytes(12).toString('base64url');
  console.log(`Generated password: ${password}`);
}

(async () => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      await query(
        `UPDATE users SET password_hash = $1, role = $2, is_active = TRUE, updated_at = NOW() WHERE id = $3`,
        [hash, role, existing.rows[0].id]
      );
      console.log(`Updated existing user ${email} (role: ${role}).`);
    } else {
      await query(
        `INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        ['Group Administrator', email, hash, role]
      );
      console.log(`Created user ${email} (role: ${role}).`);
    }
    console.log('Done.');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();