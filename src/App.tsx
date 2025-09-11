import React, { useState, useEffect, useCallback } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

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
          waitingForNewValue: true,
          history: [calculation, ...prevState.history.slice(0, 9)]
        };
      }
      
      return {
        ...prevState,
        operation: nextOperation,
        waitingForNewValue: true
      };
    });
  }, [state.display]);

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
      performOperation('+');
    } else if (key === '-') {
      performOperation('-');
    } else if (key === '*') {
      performOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      calculate();
    } else if (key === 'Escape') {
      allClear();
    } else if (key === 'Backspace') {
      clear();
    }
  }, [inputNumber, inputDecimal, performOperation, calculate, allClear, clear]);

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
      default: "bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-md font-bold text-2xl",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center p-8">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Calculator */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex-1 max-w-md backdrop-blur-sm">
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6 border border-gray-200 shadow-inner">
              <div className="text-right">
                <div className="text-gray-600 text-base h-8 font-semibold">
                  {state.previousValue !== null && state.operation 
                    ? `${state.previousValue} ${state.operation}` 
                    : ''
                  }
                </div>
                <div className="text-gray-900 text-5xl font-bold mt-3 truncate tracking-tight">
                  {state.display}
                </div>
              </div>
            </div>
            
            <div className="text-gray-600 text-sm text-center font-semibold">
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
            <Button onClick={() => performOperation('÷')} variant="operator">
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button onClick={() => performOperation('×')} variant="operator">
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button onClick={() => performOperation('-')} variant="operator">
              -
            </Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button onClick={() => performOperation('+')} variant="operator">
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
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 flex-1 max-w-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-2xl font-bold">History</h2>
            {state.history.length > 0 && (
              <button
                onClick={allClear}
                className="text-gray-600 hover:text-gray-800 transition-colors p-3 rounded-xl hover:bg-gray-100 shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {state.history.length === 0 ? (
              <div className="text-gray-500 text-center py-16 font-semibold text-lg">
                No calculations yet
              </div>
            ) : (
              state.history.map((calculation, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                >
                  <div className="text-gray-800 font-mono text-base font-semibold">
                    {calculation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;