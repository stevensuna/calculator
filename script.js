
class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.shouldResetScreen) return;
        this.currentOperand = this.currentOperand.slice(0, -1) || '0';
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = Math.round(computation * 1000000) / 1000000;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    updateDisplay() {
        document.querySelector('.current-operand').textContent = this.currentOperand;
        if (this.operation != null) {
            document.querySelector('.previous-operand').textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            document.querySelector('.previous-operand').textContent = '';
        }
    }
}

const calculator = new Calculator();

// Add event listeners for number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

// Add event listeners for operator buttons
document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

// Add event listener for equals button
document.querySelector('[data-action="equals"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Add event listener for clear button
document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Add event listener for backspace button
document.querySelector('[data-action="backspace"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') calculator.appendNumber(e.key);
    if (e.key === '=' || e.key === 'Enter') calculator.compute();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
    if (['+', '-', '*', '/'].includes(e.key)) calculator.chooseOperation(e.key);
    calculator.updateDisplay();
});