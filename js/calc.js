(function () {
  'use strict';

  // ── DOM refs ────────────────────────────────────────────────────────────
  var displayEl = document.querySelector('.screen-input');
  var calcEl    = document.querySelector('.calc-container');
  var handleEl  = document.querySelector('.title-container');

  // ── Calculator state ────────────────────────────────────────────────────
  var currentInput     = '0';
  var firstOperand     = null;
  var operator         = null;
  var waitingForSecond = false;
  var memory           = 0;

  // ── Helpers ─────────────────────────────────────────────────────────────
  function setDisplay(str) {
    displayEl.textContent = str;
    currentInput = str;
  }

  // Removes floating-point noise (0.1 + 0.2 → 0.3) and handles very large results.
  function formatResult(num) {
    if (!isFinite(num)) return 'Error';
    var clean = parseFloat(num.toPrecision(10));
    var str   = String(clean);
    if (str.replace('-', '').length > 12) {
      str = clean.toExponential(5);
    }
    return str;
  }

  // ── Input ────────────────────────────────────────────────────────────────
  function inputDigit(d) {
    if (waitingForSecond) {
      currentInput     = d;
      waitingForSecond = false;
    } else {
      currentInput = (currentInput === '0') ? d : currentInput + d;
    }
    displayEl.textContent = currentInput;
  }

  function inputDecimal() {
    if (waitingForSecond) {
      currentInput     = '0.';
      waitingForSecond = false;
      displayEl.textContent = currentInput;
      return;
    }
    if (currentInput.indexOf('.') === -1) {
      currentInput += '.';
      displayEl.textContent = currentInput;
    }
  }

  // ── Operations ───────────────────────────────────────────────────────────
  function clearAll() {
    currentInput     = '0';
    firstOperand     = null;
    operator         = null;
    waitingForSecond = false;
    displayEl.textContent = '0';
  }

  function clearEntry() {
    currentInput = '0';
    displayEl.textContent = '0';
    waitingForSecond = false;
  }

  function backspace() {
    if (waitingForSecond) return;
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    displayEl.textContent = currentInput;
  }

  function toggleSign() {
    if (currentInput === '0' || currentInput === 'Error') return;
    currentInput = (currentInput.charAt(0) === '-')
      ? currentInput.slice(1)
      : '-' + currentInput;
    displayEl.textContent = currentInput;
  }

  function squareRoot() {
    var val = parseFloat(currentInput);
    if (val < 0) { setDisplay('Error'); return; }
    setDisplay(formatResult(Math.sqrt(val)));
    waitingForSecond = true;
  }

  function percent() {
    var val = parseFloat(currentInput);
    var result = (firstOperand !== null && (operator === '+' || operator === '-'))
      ? firstOperand * val / 100
      : val / 100;
    setDisplay(formatResult(result));
    waitingForSecond = false;
  }

  function reciprocal() {
    var val = parseFloat(currentInput);
    if (val === 0) { setDisplay('Error'); return; }
    setDisplay(formatResult(1 / val));
    waitingForSecond = true;
  }

  function compute(a, b, op) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return (b !== 0) ? a / b : Infinity;
    }
    return b;
  }

  function applyOperator(op) {
    var val = parseFloat(currentInput);
    if (isNaN(val)) { clearAll(); return; }

    // Chain: if there's a pending operation, evaluate it first.
    if (operator !== null && !waitingForSecond) {
      setDisplay(formatResult(compute(firstOperand, val, operator)));
      firstOperand = parseFloat(currentInput);
    } else {
      firstOperand = val;
    }

    operator         = op;
    waitingForSecond = true;
  }

  function equals() {
    if (operator === null || waitingForSecond) return;
    var val = parseFloat(currentInput);
    setDisplay(formatResult(compute(firstOperand, val, operator)));
    operator         = null;
    firstOperand     = null;
    waitingForSecond = true;
  }

  // ── Memory ───────────────────────────────────────────────────────────────
  function memoryClear()  { memory = 0; }
  function memoryAdd()    { memory += parseFloat(currentInput) || 0; }
  function memorySub()    { memory -= parseFloat(currentInput) || 0; }
  function memoryStore()  { memory  = parseFloat(currentInput) || 0; }
  function memoryRecall() {
    setDisplay(formatResult(memory));
    waitingForSecond = false;
  }

  // ── Button click handler (event delegation) ──────────────────────────────
  document.querySelector('.buttons-container')
    .addEventListener('click', function (e) {
      var btn = e.target.closest('.button');
      if (!btn) return;
      var label = btn.querySelector('.button-label').textContent.trim();

      if ('0123456789'.indexOf(label) !== -1) { inputDigit(label); return; }

      switch (label) {
        case '.':          inputDecimal();        break;
        case 'C':          clearAll();            break;
        case 'CE':         clearEntry();          break;
        case '\u2190':     backspace();           break;  // ←
        case '\u00b1':     toggleSign();          break;  // ±
        case '\u00f7':     applyOperator('/');    break;  // ÷ (osx)
        case '/':          applyOperator('/');    break;
        case 'x':          applyOperator('*');    break;  // osx
        case '*':          applyOperator('*');    break;
        case '-':          applyOperator('-');    break;
        case '+':          applyOperator('+');    break;
        case '=':          equals();              break;
        case '\u221a':     squareRoot();          break;  // √
        case '%':          percent();             break;
        case '1/x':        reciprocal();          break;
        case 'MC':         memoryClear();         break;
        case 'M+':         memoryAdd();           break;
        case 'M-':         memorySub();           break;
        case 'MS':         memoryStore();         break;
        case 'MR':         memoryRecall();        break;
      }
    });

  // ── Drag ────────────────────────────────────────────────────────────────
  var dragging = false, originX, originY, startLeft, startTop;

  handleEl.addEventListener('mousedown', function (e) {
    var rect  = calcEl.getBoundingClientRect();
    dragging  = true;
    originX   = e.clientX;
    originY   = e.clientY;
    startLeft = rect.left;
    startTop  = rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    calcEl.style.left = (startLeft + e.clientX - originX) + 'px';
    calcEl.style.top  = (startTop  + e.clientY - originY) + 'px';
  });

  document.addEventListener('mouseup', function () { dragging = false; });

}());
