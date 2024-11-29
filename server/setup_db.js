import {db} from './db.js';

// Use the db object to run table creation commands and otherwise initialize your database setup here.

await db.run('PRAGMA foreign_keys = ON');

await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT(100) NOT NULL,
      password TEXT(100),
      correct INTEGER,
      answered INTEGER
    )
  `);
  
  await db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      user_answer TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  await db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      answer_1 TEXT NOT NULL,
      answer_2 TEXT NOT NULL,
      answer_3 TEXT NOT NULL,
      answer_4 TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `);
  
  await db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      friend_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (friend_id) REFERENCES users(id)
    )
  `);

db.close();