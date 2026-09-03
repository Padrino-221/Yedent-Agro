const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findPsql() {
  try {
    execFileSync('psql', ['--version'], { stdio: 'pipe' });
    return 'psql';
  } catch (e) {
    // not on PATH; look in common PostgreSQL install locations
    const base = 'C:\\Program Files\\PostgreSQL';
    if (fs.existsSync(base)) {
      const versions = fs.readdirSync(base).sort().reverse();
      for (const v of versions) {
        const candidate = path.join(base, v, 'bin', 'psql.exe');
        if (fs.existsSync(candidate)) return candidate;
      }
    }
    return null;
  }
}

const PSQL = findPsql();
if (!PSQL) {
  console.error('psql not found. Install PostgreSQL or add psql to PATH.');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:1234567890@localhost:5432/yedent';

if (!dbUrl) {
  console.error('DATABASE_URL not set. Create backend/.env first.');
  process.exit(1);
}

const parsed = new URL(dbUrl);
const { hostname, port, username, password } = parsed;
const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));

const psqlArgs = ['-U', username, '-h', hostname];
if (port) psqlArgs.push('-p', port);
if (password) process.env.PGPASSWORD = password;

function runPsql(db, file) {
  const args = [...psqlArgs];
  if (db) args.push('-d', db);
  if (file) args.push('-f', file);
  console.log(`Running ${path.basename(file)} on ${db || 'postgres'}...`);
  execFileSync(PSQL, args, { stdio: 'inherit' });
}

// Create database if it doesn't exist
try {
  execFileSync(PSQL, [...psqlArgs, '-lqt'], { stdio: 'pipe' });
  const list = require('child_process').execFileSync(PSQL, [...psqlArgs, '-lqt'], { encoding: 'utf8' });
  const exists = list.split('\n').some((line) => line.trim().startsWith(databaseName));
  if (!exists) {
    console.log(`Creating database ${databaseName}...`);
    execFileSync(PSQL, [...psqlArgs, '-c', `CREATE DATABASE ${databaseName};`], { stdio: 'inherit' });
  } else {
    console.log(`Database ${databaseName} already exists.`);
  }
} catch (e) {
  console.error('Failed to connect. Check PGPASSWORD / DATABASE_URL:', e.message);
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'src', 'db', 'schema.sql');
const seedPath = path.join(__dirname, '..', 'src', 'db', 'seed.sql');

runPsql(databaseName, schemaPath);
runPsql(databaseName, seedPath);
console.log('Database setup complete.');
