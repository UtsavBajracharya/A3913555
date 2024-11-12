//Push
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database configuration
// Update with your own DB info from azure
const config = {
    user: 'azureuser',
    password: 'P@ssw0rdssss',
    server: 'week911.database.windows.net',
    database: 'week911',
    options: {
        encrypt: true,
        enableArithAbort: true
  }
};

// Connect to Azure SQL Database
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to Azure SQL Database');
  } catch (err) {
    console.error('Error connecting to Azure SQL Database:', err);
  }
}

connectToDatabase();

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Expenses`;
    res.render('index', { expenses: result.recordset });
  } catch (err) {
    console.error('Error retrieving expenses:', err);
    res.status(500).send('Error retrieving expenses');
  }
});

app.post('/add-expense', async (req, res) => {
  const { category, amount, date, description } = req.body;
  try {
    const query = `
      INSERT INTO Expenses (category, amount, date, description) 
      VALUES (@category, @amount, @date, @description)
    `;
    const request = new sql.Request();
    request.input('category', sql.VarChar, category);
    request.input('amount', sql.Decimal(10, 2), amount);
    request.input('date', sql.Date, date);
    request.input('description', sql.VarChar, description);

    await request.query(query);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).send('Error adding expense: ' + err.message);
  }
});

// Endpoint to add a random expense
app.get('/add-random-expense', async (req, res) => {
  try {
    const categories = ['Food', 'Transport', 'Phone', 'Entertainment', 'Other'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomAmount = (Math.random() * (100 - 1) + 1).toFixed(2);
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
    const formattedDate = randomDate.toISOString().split('T')[0];
    const description = 'Sample description';

    const query = `
      INSERT INTO Expenses (category, amount, date, description) 
      VALUES (@category, @amount, @date, @description)
    `;
    const request = new sql.Request();
    request.input('category', sql.VarChar, randomCategory);
    request.input('amount', sql.Decimal(10, 2), randomAmount);
    request.input('date', sql.Date, formattedDate);
    request.input('description', sql.VarChar, description);

    await request.query(query);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding random expense:', err);
    res.status(500).send('Error adding random expense: ' + err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
