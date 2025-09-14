import React, { useState, useEffect, useCallback } from 'react';
import { Delete, RotateCcw, History, Sun, Moon, X } from 'lucide-react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  history: string[];
}

function App() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    history: []
  });

  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: num,
          waitingForNewValue: false
        };
      }
      
      return {
        ...prevState,
        display: prevState.display === '0' ? num : prevState.display + num
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: '0.',
          waitingForNewValue: false
        };
      }
      
      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.'
        };
      }
      
      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0'
    }));
  }, []);

  const allClear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      history: []
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      history: []
    }));
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(state.display);
    
    setState(prevState => {
      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForNewValue: true
        };
      }
      
      if (prevState.operation && !prevState.waitingForNewValue) {
        const currentValue = prevState.previousValue || 0;
        let result: number;
        
        switch (prevState.operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            return prevState;
        }
        
        const calculation = `${currentValue} ${prevState.operation} ${inputValue} = ${result}`;
        
        return {
          ...prevState,
          display: String(result),
          previousValue: result,
          operation: nextOperation,
          waitingForNewValue: nextOperation !== '',
          history: [calculation, ...prevState.history.slice(0, 19)]
        };
      }
      
      return {
        ...prevState,
        operation: nextOperation,
        waitingForNewValue: true
      };
    });
  }, [state.display]);

  const handleOperationPress = useCallback((operation: string) => {
    setState(prevState => {
      if (prevState.previousValue !== null && prevState.operation && !prevState.waitingForNewValue) {
        const inputValue = parseFloat(prevState.display);
        const currentValue = prevState.previousValue;
        let result: number;
        
        switch (prevState.operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            result = inputValue;
        }
        
        const calculation = `${currentValue} ${prevState.operation} ${inputValue} = ${result}`;
        
        return {
          ...prevState,
          display: String(result),
          previousValue: result,
          operation: operation,
          waitingForNewValue: true,
          history: [calculation, ...prevState.history.slice(0, 19)]
        };
      }
      
      const inputValue = parseFloat(prevState.display);
      return {
        ...prevState,
        previousValue: prevState.previousValue === null ? inputValue : prevState.previousValue,
        operation: operation,
        waitingForNewValue: true
      };
    });
  }, []);

  const calculate = useCallback(() => {
    performOperation('');
  }, [performOperation]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
    if (key >= '0' && key <= '9') {
      inputNumber(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === '+') {
      handleOperationPress('+');
    } else if (key === '-') {
      handleOperationPress('-');
    } else if (key === '*') {
      handleOperationPress('×');
    } else if (key === '/') {
      event.preventDefault();
      handleOperationPress('÷');
    } else if (key === 'Enter' || key === '=') {
      calculate();
    } else if (key === 'Escape') {
      allClear();
    } else if (key === 'Backspace') {
      clear();
    }
  }, [inputNumber, inputDecimal, handleOperationPress, calculate, allClear, clear]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const Button = ({ 
    onClick, 
    className, 
    children, 
    variant = 'default' 
  }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    variant?: 'default' | 'operator' | 'action' | 'equals';
  }) => {
    const baseClasses = "h-16 rounded-xl font-bold text-xl transition-all duration-200 hover:shadow-lg active:scale-95 border flex items-center justify-center";
    
    const variantClasses = {
      default: isDarkMode 
        ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600 shadow-md font-bold text-2xl"
        : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-md font-bold text-2xl",
      operator: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500 shadow-lg font-bold text-xl",
      action: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 shadow-lg font-bold text-lg",
      equals: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 shadow-lg font-bold text-xl"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-300 flex items-center justify-center p-8 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-pink-100 to-pink-200'
    }`}>
      <div className="max-w-md w-full relative">
        {/* Calculator */}
        <div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          {/* Header with controls */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
            >
              <History className="w-5 h-5" />
            </button>
            
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Calculator
            </h1>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="mb-8">
            <div className={`rounded-2xl p-8 mb-6 border shadow-inner transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
            }`}>
              <div className="text-right">
                <div className={`text-base h-8 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {state.previousValue !== null && state.operation 
                    ? `${state.previousValue} ${state.operation}` 
                    : ''
                  }
                </div>
                <div className={`text-5xl font-bold mt-3 truncate tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.display}
                </div>
              </div>
            </div>
            
            <div className={`text-sm text-center font-semibold ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Use keyboard for faster input
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {/* Row 1 */}
            <Button onClick={allClear} variant="action" className="col-span-2">
              All Clear
            </Button>
            <Button onClick={clear} variant="action">
              <Delete className="w-5 h-5 mx-auto" />
            </Button>
            <Button onClick={() => handleOperationPress('÷')} variant="operator">
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button onClick={() => handleOperationPress('×')} variant="operator">
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button onClick={() => handleOperationPress('-')} variant="operator">
              -
            </Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button onClick={() => handleOperationPress('+')} variant="operator">
              +
            </Button>

            {/* Row 5 */}
            <Button onClick={() => inputNumber('0')} className="col-span-2">
              0
            </Button>
            <Button onClick={inputDecimal}>.</Button>
            <Button onClick={calculate} variant="equals">
              =
            </Button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className={`absolute top-0 right-0 w-80 h-full rounded-3xl p-6 shadow-2xl border backdrop-blur-sm transition-all duration-300 transform translate-x-full ml-4 ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                History
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={clearHistory}
                  className={`p-2 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className={`p-2 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.history.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No calculations yet</p>
                </div>
              ) : (
                state.history.map((calculation, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-sm font-mono break-all">
                      {calculation}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;