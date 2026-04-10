/// <reference types="node" />
import mysql from 'mysql2/promise';
import type { Connection } from 'mysql2/promise';
import 'dotenv/config';

function consoleDir(param: unknown) {
  console.dir(param, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}

async function runQuery(
  connection: Connection,
  label: string,
  query: string,
  values?: unknown[]
) {
  try {
    console.log(`===Running ${label}===\n`);
    const [results] = await connection.query(query, values);
    consoleDir(results);
    console.log('\n\n\n');
  } catch (err) {
    console.log(err);
  }
}

const tableName = '`friends`';

const selectQuery = `SELECT * FROM ${tableName}`;

const insertQuery = `INSERT INTO ${tableName} (name, email, phone) VALUES (?, ?, ?)`;
const insertValues = ['Himanshu', 'himanshu@gmail.com', '9448263380'];

const updateQuery = `UPDATE ${tableName} SET \`email\` = ? WHERE \`id\` = ?`;
const updateValues = ['shrijith1234@gmail.com', 2];

const deleteQuery = `DELETE FROM ${tableName} WHERE \`id\` = ?`;
const deleteValues = [3];

async function runAllQueries() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? '',
    user: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
  });

  try {
    await runQuery(connection, 'SELECT', selectQuery);

    await runQuery(connection, 'INSERT', insertQuery, insertValues);
    await runQuery(connection, 'SELECT', selectQuery);

    await runQuery(connection, 'UPDATE', updateQuery, updateValues);
    await runQuery(connection, 'SELECT', selectQuery);

    await runQuery(connection, 'DELETE', deleteQuery, deleteValues);
    await runQuery(connection, 'SELECT', selectQuery);
  } finally {
    await connection.end();
  }
}

runAllQueries();