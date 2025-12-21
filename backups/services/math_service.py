import sympy as sp
from scipy import integrate
import numpy as np
from typing import Dict, Optional

class MathService:
    def __init__(self):
        self.x = sp.Symbol('x')
        self.y = sp.Symbol('y')
    
    def parse_function(self, func_str: str) -> sp.Expr:
        """Parse string function to sympy expression"""
        try:
            # Replace common mathematical functions
            func_str = func_str.replace('^', '**')
            # Parse using sympy
            expr = sp.sympify(func_str, locals={'x': self.x})
            return expr
        except Exception as e:
            raise ValueError(f"Invalid function expression: {str(e)}")
    
    def calculate_volume(self, func_str: str, a: float, b: float, axis: str) -> Dict:
        """
        Calculate volume of solid of revolution
        V = π ∫[a,b] [f(x)]² dx  (for x-axis rotation)
        """
        try:
            func = self.parse_function(func_str)
            
            if axis == "x-axis":
                # Disk method: V = π ∫[a,b] [f(x)]² dx
                integrand = sp.pi * func**2
            else:  # y-axis rotation
                # Shell method: V = 2π ∫[a,b] x·f(x) dx
                integrand = 2 * sp.pi * self.x * func
            
            # Try symbolic integration
            volume_symbolic = None
            integral_expr = None
            try:
                integral_indefinite = sp.integrate(integrand, self.x)
                volume_symbolic = sp.integrate(integrand, (self.x, a, b))
                integral_expr = sp.latex(integrand)
                
                # Try to evaluate symbolically
                volume_symbolic_value = float(volume_symbolic.evalf())
            except:
                volume_symbolic_value = None
            
            # Numerical integration (always compute as backup)
            func_numeric = sp.lambdify(self.x, integrand, 'numpy')
            
            def integrand_func(x):
                try:
                    return func_numeric(x)
                except:
                    return 0
            
            volume_numerical, error = integrate.quad(integrand_func, a, b)
            
            # Use symbolic if available and matches numerical
            if volume_symbolic_value is not None:
                if abs(volume_symbolic_value - volume_numerical) < 0.01 * volume_numerical:
                    volume_result = volume_symbolic_value
                else:
                    volume_result = volume_numerical
            else:
                volume_result = volume_numerical
            
            return {
                'volume_numerical': round(volume_result, 6),
                'volume_symbolic': str(volume_symbolic) if volume_symbolic else None,
                'integral_expression': integral_expr if integral_expr else f"π∫[{a},{b}] ({func_str})² dx",
                'error_estimate': error if error else None
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating volume: {str(e)}")
    
    def evaluate_function(self, func_str: str, x_vals: np.ndarray) -> np.ndarray:
        """Evaluate function at given x values"""
        try:
            func = self.parse_function(func_str)
            func_numeric = sp.lambdify(self.x, func, 'numpy')
            return func_numeric(x_vals)
        except Exception as e:
            raise ValueError(f"Error evaluating function: {str(e)}")