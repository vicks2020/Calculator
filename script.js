let display = document.getElementById('display');
let currentInput = '';
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        if (waitingForSecondNumber) {
            currentInput = button.dataset.value;
            waitingForSecondNumber = false;
        } else {
            currentInput += button.dataset.value;
        }
        updateDisplay();
    });
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        if (firstNumber === null) {
            firstNumber = parseFloat(currentInput);
            operator = button.dataset.value;
            waitingForSecondNumber = true;
        } else {
            // If already have first number, calculate and set as first
            calculate();
            operator = button.dataset.value;
            waitingForSecondNumber = true;
        }
        updateDisplay();
    });
});

document.getElementById('equals').addEventListener('click', () => {
    if (firstNumber !== null && operator && currentInput) {
        calculate();
    }
});

document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay();
});

function updateDisplay() {
    if (waitingForSecondNumber) {
        display.textContent = firstNumber + ' ' + operator;
    } else {
        display.textContent = currentInput || '0';
    }
}

async function calculate() {
    const num1 = firstNumber;
    const num2 = parseFloat(currentInput);
    const op = operator;

    try {
        const response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ num1, num2, operator: op })
        });

        const data = await response.json();

        if (response.ok) {
            display.textContent = data.result;
            currentInput = data.result.toString();
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
        } else {
            display.textContent = 'Error: ' + data.error;
            reset();
        }
    } catch (error) {
        display.textContent = 'Error: Unable to connect';
        reset();
    }
}

function reset() {
    currentInput = '';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
}