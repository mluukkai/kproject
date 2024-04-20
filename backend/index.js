const express = require('express');

const app = express();
const pg = require('pg');

const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

const connectionString = process.env.DB_URL

const { Client } = pg
 
const client = new Client({
  connectionString
})

const getTodos = async () => {
  const res = await client.query('SELECT * FROM todos')
  return res.rows
}

const connectDb = async () => {
  console.log('connecting to database', connectionString)
  await client.connect()
  const result = await client.query('SELECT NOW()')
  console.log(result.rows)

  try {
    const todos = await getTodos()
    console.log(todos.length) 

  } catch (e) {
    const createTable = `
      CREATE TABLE todos ( \
        id SERIAL PRIMARY KEY, \
        title TEXT NOT NULL, \
        done BOOLEAN NOT NULL DEFAULT false \
      );
    `
    console.log('creating table', createTable)
    await client.query(createTable)
  }
}

connectDb()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

// Use the new format string that includes ':body'
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/todos', async (req, res) => {
  const todos = await getTodos()
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  console.log(req.body);
  console.log(req.headers['content-type'])
  const title = req.body.todo;

  if (!title) {
    return res.status(400).json({ error: 'title must be defined' });
  }
  if (title.length > 140) {
    return res.status(400).json({ error: 'title can not exceed 140, was ' + title.length });
  }

  const insertTodoQuery = `
    INSERT INTO todos (title, done)
    VALUES ($1, $2)
    RETURNING id, title, done;
  `;
  try {
    const addedTodo = await client.query(insertTodoQuery, [title, false]);
    if (req.headers['content-type'] === 'application/json') {
      res.send(addedTodo);
    } else {
      res.redirect('/');
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while inserting the todo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});