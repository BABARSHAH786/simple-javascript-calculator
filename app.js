document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.getElementById('equals');
    const deleteButton = document.getElementById('delete');
    const clearButton = document.getElementById('clear');
    const percentButton = document.getElementById('percent');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;

    // Update the display
    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        
        if (operation != null) {
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    // Format numbers for display (add commas for thousands)
    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Append a number to the current operand
    function appendNumber(number) {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        if (number === '.' && currentOperand.includes('.')) return;
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
        
        updateDisplay();
    }

    // Choose an operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
        updateDisplay();
    }

    // Perform calculation
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    currentOperand = 'Error';
                    previousOperand = '';
                    operation = undefined;
                    updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
        updateDisplay();
    }

    // Calculate percentage
    function calculatePercent() {
        const current = parseFloat(currentOperand);
        if (isNaN(current)) return;
        
        currentOperand = (current / 100).toString();
        updateDisplay();
    }

    // Clear the calculator
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        updateDisplay();
    }

    // Delete the last digit
    function deleteNumber() {
        if (currentOperand === 'Error' || shouldResetScreen) {
            clear();
            return;
        }
        
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
        
        updateDisplay();
    }

    // Add event listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operation'));
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        });
    });

    equalsButton.addEventListener('click', () => {
        compute();
        equalsButton.classList.add('active');
        setTimeout(() => equalsButton.classList.remove('active'), 100);
    });

    clearButton.addEventListener('click', () => {
        clear();
        clearButton.classList.add('active');
        setTimeout(() => clearButton.classList.remove('active'), 100);
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        deleteButton.classList.add('active');
        setTimeout(() => deleteButton.classList.remove('active'), 100);
    });

    percentButton.addEventListener('click', () => {
        calculatePercent();
        percentButton.classList.add('active');
        setTimeout(() => percentButton.classList.remove('active'), 100);
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (/[0-9]/.test(e.key)) {
            appendNumber(e.key);
            highlightButton(e.key);
        } else if (e.key === '.') {
            appendNumber('.');
            highlightButton('.');
        } else if (e.key === '+' || e.key === '-') {
            chooseOperation(e.key);
            highlightButton(e.key);
        } else if (e.key === '*') {
            chooseOperation('×');
            highlightButton('×');
        } else if (e.key === '/') {
            e.preventDefault();
            chooseOperation('÷');
            highlightButton('÷');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            compute();
            highlightButton('=');
        } else if (e.key === 'Escape') {
            clear();
            highlightButton('AC');
        } else if (e.key === 'Backspace') {
            deleteNumber();
            highlightButton('DEL');
        } else if (e.key === '%') {
            calculatePercent();
            highlightButton('%');
        }
    });

    // Highlight button when pressed on keyboard
    function highlightButton(key) {
        const button = document.querySelector(`button[data-number="${key}"], 
                                              button[data-operation="${key}"], 
                                              button#equals, 
                                              button#clear, 
                                              button#delete, 
                                              button#percent`);
        if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        }
    }

    // Initialize display
    updateDisplay();
});