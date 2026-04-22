const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from current directory
app.use(express.static('.'));

// API endpoint
app.post('/calculate', (req, res) => {
    const { num1, num2, operator } = req.body;

    // Validate inputs
    if (typeof num1 !== 'number' || typeof num2 !== 'number' || typeof operator !== 'string') {
        return res.status(400).json({ error: 'Invalid input types' });
    }

    let result;
    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                return res.status(400).json({ error: 'Division by zero' });
            }
            result = num1 / num2;
            break;
        default:
            return res.status(400).json({ error: 'Invalid operator' });
    }

    res.json({ result });
});

app.listen(port, () => {
    console.log(`Calculator app listening at http://localhost:${port}`);
});