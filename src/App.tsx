import React, { useState, useEffect, useCallback } from 'react';
import { Delete, RotateCcw, History, Sun, Moon, X, Menu, Calculator, Minus } from 'lucide-react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  history: string[];
  memory: number;
}

function App() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    history: [],
    memory: 0
  });

  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'history' | 'memory'>('history');
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      history: []
    }));
  }, []);

  const backspace = useCallback(() => {
    setState(prevState => {
      if (prevState.display.length > 1) {
        return {
          ...prevState,
          display: prevState.display.slice(0, -1)
        };
      }
      return {
        ...prevState,
        display: '0'
      };
    });
  }, []);

  const percentage = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: String(parseFloat(prevState.display) / 100)
    }));
  }, []);

  const square = useCallback(() => {
    const value = parseFloat(state.display);
    const result = value * value;
    setState(prevState => ({
      ...prevState,
      display: String(result),
      history: [`sqr(${value}) = ${result}`, ...prevState.history.slice(0, 19)]
    }));
  }, [state.display]);

  const squareRoot = useCallback(() => {
    const value = parseFloat(state.display);
    const result = Math.sqrt(value);
    setState(prevState => ({
      ...prevState,
      display: String(result),
      history: [`√(${value}) = ${result}`, ...prevState.history.slice(0, 19)]
    }));
  }, [state.display]);

  const reciprocal = useCallback(() => {
    const value = parseFloat(state.display);
    const result = 1 / value;
    setState(prevState => ({
      ...prevState,
      display: String(result),
      history: [`1/(${value}) = ${result}`, ...prevState.history.slice(0, 19)]
    }));
  }, [state.display]);

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

  const memoryStore = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: parseFloat(prevState.display)
    }));
  }, []);

  const memoryRecall = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: String(prevState.memory),
      waitingForNewValue: true
    }));
  }, []);

  const memoryClear = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: 0
    }));
  }, []);

  const memoryAdd = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: prevState.memory + parseFloat(prevState.display)
    }));
  }, []);

  const memorySubtract = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: prevState.memory - parseFloat(prevState.display)
    }));
  }, []);

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
      clearEntry();
    } else if (key === 'Backspace') {
      backspace();
    } else if (key === '%') {
      percentage();
    }
  }, [inputNumber, inputDecimal, handleOperationPress, calculate, clearEntry, backspace, percentage]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const Button = ({ 
    onClick, 
    className, 
    children, 
    variant = 'default',
    size = 'normal'
  }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    variant?: 'default' | 'operator' | 'action' | 'equals' | 'memory';
    size?: 'normal' | 'wide';
  }) => {
    const baseClasses = "h-12 rounded-sm font-medium text-lg transition-all duration-150 hover:bg-opacity-80 active:scale-95 border-0 flex items-center justify-center";
    
    const variantClasses = {
      default: isDarkMode 
        ? "bg-gray-600 hover:bg-gray-500 text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-900",
      operator: isDarkMode
        ? "bg-gray-600 hover:bg-gray-500 text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-900",
      action: isDarkMode
        ? "bg-gray-600 hover:bg-gray-500 text-white"
        : "bg-gray-200 hover:bg-gray-300 text-gray-900",
      equals: "bg-purple-500 hover:bg-purple-600 text-white",
      memory: isDarkMode
        ? "bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
    };

    const sizeClasses = {
      normal: "",
      wide: "col-span-2"
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`h-screen flex transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className={`w-80 border-r flex flex-col transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          {/* Sidebar Header */}
          <div className="flex border-b">
            <button
              onClick={() => setSidebarTab('history')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                sidebarTab === 'history'
                  ? isDarkMode
                    ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                    : 'bg-white text-gray-900 border-b-2 border-purple-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setSidebarTab('memory')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                sidebarTab === 'memory'
                  ? isDarkMode
                    ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                    : 'bg-white text-gray-900 border-b-2 border-purple-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Memory
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {sidebarTab === 'history' ? (
              <div>
                {state.history.length === 0 ? (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg mb-2">There's no history yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={clearHistory}
                        className={`p-2 rounded hover:bg-opacity-80 transition-all duration-200 ${
                          isDarkMode
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    {state.history.map((calculation, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded text-right transition-all duration-200 hover:bg-opacity-80 cursor-pointer ${
                          isDarkMode 
                            ? 'hover:bg-gray-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-sm font-mono break-all">
                          {calculation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {state.memory === 0 ? (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg mb-2">There's nothing saved in memory.</p>
                  </div>
                ) : (
                  <div className={`p-4 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="text-right text-2xl font-mono mb-2">
                      {state.memory}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={memoryClear} variant="memory" className="flex-1">
                        MC
                      </Button>
                      <Button onClick={memoryRecall} variant="memory" className="flex-1">
                        MR
                      </Button>
                      <Button onClick={memoryAdd} variant="memory" className="flex-1">
                        M+
                      </Button>
                      <Button onClick={memorySubtract} variant="memory" className="flex-1">
                        M-
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Calculator */}
      <div className="flex-1 flex flex-col">
        {/* Title Bar */}
        <div className={`flex items-center justify-between px-4 py-2 border-b ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded hover:bg-opacity-80 transition-all duration-200 ${
                isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-200'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>
            <Calculator className="w-4 h-4" />
            <span className="font-medium">Calculator</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Standard</span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded hover:bg-opacity-80 transition-all duration-200 ${
                isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="flex-1 flex flex-col justify-end p-6">
          <div className="text-right mb-8">
            <div className={`text-sm mb-2 h-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {state.previousValue !== null && state.operation 
                ? `${state.previousValue} ${state.operation}` 
                : ''
              }
            </div>
            <div className="text-6xl font-light tracking-tight">
              {state.display}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button onClick={percentage} variant="action">%</Button>
            <Button onClick={clearEntry} variant="action">CE</Button>
            <Button onClick={clear} variant="action">C</Button>
            <Button onClick={backspace} variant="action">
              <Delete className="w-5 h-5" />
            </Button>

            {/* Row 2 */}
            <Button onClick={reciprocal} variant="action">¹⁄ₓ</Button>
            <Button onClick={square} variant="action">x²</Button>
            <Button onClick={squareRoot} variant="action">²√x</Button>
            <Button onClick={() => handleOperationPress('÷')} variant="operator">÷</Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button onClick={() => handleOperationPress('×')} variant="operator">×</Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button onClick={() => handleOperationPress('-')} variant="operator">-</Button>

            {/* Row 5 */}
            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button onClick={() => handleOperationPress('+')} variant="operator">+</Button>

            {/* Row 6 */}
            <Button onClick={() => inputNumber('0')} size="wide">0</Button>
            <Button onClick={inputDecimal}>.</Button>
            <Button onClick={calculate} variant="equals">=</Button>
          </div>

          <div className={`text-center text-sm mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Use keyboard for faster input
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;