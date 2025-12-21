import sympy as sp
from scipy import integrate
import numpy as np
from typing import Dict, Optional, Tuple
import re

class IntegralService:
    def __init__(self):
        self.x = sp.Symbol('x')
        self.y = sp.Symbol('y')
    
    def parse_function(self, func_str: str) -> sp.Expr:
        """
        Parse string function to sympy expression
        Supports: polynomials, trig, exp, log, etc.
        """
        try:
            # Clean and normalize input
            func_str = func_str.strip()
            
            # Replace common notation
            func_str = func_str.replace('^', '**')
            func_str = func_str.replace('√', 'sqrt')
            
            # Parse using sympy
            expr = sp.sympify(func_str, locals={
                'x': self.x,
                'e': sp.E,
                'pi': sp.pi
            })
            
            return expr
        except Exception as e:
            raise ValueError(f"Invalid function expression: {str(e)}")
    
    def calculate_indefinite_integral(self, func_str: str) -> Dict:
        """
        Calculate indefinite integral ∫f(x)dx
        """
        try:
            # Parse function
            func = self.parse_function(func_str)
            
            # Calculate integral
            integral_result = sp.integrate(func, self.x)
            
            # Format results
            original_latex = sp.latex(func)
            integral_latex = sp.latex(integral_result)
            
            # Full integral expression with + C
            full_expression = f"\\int {original_latex} \\, dx = {integral_latex} + C"
            
            return {
                'success': True,
                'original_function': str(func),
                'original_latex': original_latex,
                'integral_result': str(integral_result),
                'integral_latex': integral_latex,
                'full_expression_latex': full_expression,
                'with_constant': f"{str(integral_result)} + C"
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating integral: {str(e)}")
    
    def calculate_definite_integral(self, func_str: str, lower: float, upper: float) -> Dict:
        """
        Calculate definite integral ∫[a,b]f(x)dx
        Combines symbolic and numerical integration from math_service.py
        """
        try:
            # Parse function
            func = self.parse_function(func_str)
            
            # Try symbolic integration first
            symbolic_result = None
            symbolic_value = None
            try:
                symbolic_result = sp.integrate(func, (self.x, lower, upper))
                symbolic_value = float(symbolic_result.evalf())
            except:
                pass
            
            # Numerical integration (always compute as backup)
            func_numeric = sp.lambdify(self.x, func, 'numpy')
            
            def integrand_func(x):
                try:
                    return func_numeric(x)
                except:
                    return 0
            
            numerical_value, error = integrate.quad(integrand_func, lower, upper)
            
            # Use symbolic if available and matches numerical
            if symbolic_value is not None:
                if abs(symbolic_value - numerical_value) < 0.01 * abs(numerical_value):
                    final_value = symbolic_value
                else:
                    final_value = numerical_value
            else:
                final_value = numerical_value
            
            # Format results
            original_latex = sp.latex(func)
            result_latex = sp.latex(symbolic_result) if symbolic_result else str(round(final_value, 6))
            
            full_expression = f"\\int_{{{lower}}}^{{{upper}}} {original_latex} \\, dx = {result_latex}"
            
            return {
                'success': True,
                'original_function': str(func),
                'original_latex': original_latex,
                'definite_result': str(symbolic_result) if symbolic_result else str(final_value),
                'result_latex': result_latex,
                'numerical_value': round(final_value, 6),
                'symbolic_result': str(symbolic_result) if symbolic_result else None,
                'error_estimate': error if error else None,
                'full_expression_latex': full_expression,
                'bounds': {'lower': lower, 'upper': upper}
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating definite integral: {str(e)}")
    
    def calculate_area_under_curve(self, func_str: str, lower: float, upper: float) -> Dict:
        """
        Calculate area under curve (absolute value of integral)
        """
        try:
            result = self.calculate_definite_integral(func_str, lower, upper)
            
            # Area is absolute value
            area = abs(result['numerical_value'])
            
            result['area'] = area
            result['description'] = f"Area under curve from x={lower} to x={upper}"
            
            return result
            
        except Exception as e:
            raise ValueError(f"Error calculating area: {str(e)}")
    
    def calculate_average_value(self, func_str: str, lower: float, upper: float) -> Dict:
        """
        Calculate average value of function over interval [a,b]
        Average value = (1/(b-a)) * ∫[a,b]f(x)dx
        """
        try:
            # Get definite integral
            integral_result = self.calculate_definite_integral(func_str, lower, upper)
            
            # Calculate average
            interval_length = upper - lower
            average_value = integral_result['numerical_value'] / interval_length
            
            return {
                'success': True,
                'function': func_str,
                'bounds': {'lower': lower, 'upper': upper},
                'integral_value': integral_result['numerical_value'],
                'average_value': round(average_value, 6),
                'formula': f"f_avg = (1/{interval_length}) * {integral_result['numerical_value']} = {average_value}"
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating average value: {str(e)}")
    
    def calculate_arc_length(self, func_str: str, lower: float, upper: float) -> Dict:
        """
        Calculate arc length of curve y=f(x) from x=a to x=b
        Arc length = ∫[a,b]√(1 + (f'(x))²)dx
        """
        try:
            # Parse function
            func = self.parse_function(func_str)
            
            # Calculate derivative
            derivative = sp.diff(func, self.x)
            
            # Arc length integrand: sqrt(1 + (f'(x))^2)
            integrand = sp.sqrt(1 + derivative**2)
            
            # Try symbolic integration
            try:
                symbolic_length = sp.integrate(integrand, (self.x, lower, upper))
                arc_length = float(symbolic_length.evalf())
            except:
                # Numerical integration
                integrand_func = sp.lambdify(self.x, integrand, 'numpy')
                arc_length, error = integrate.quad(integrand_func, lower, upper)
            
            return {
                'success': True,
                'function': str(func),
                'derivative': str(derivative),
                'arc_length': round(arc_length, 6),
                'bounds': {'lower': lower, 'upper': upper},
                'formula': f"L = ∫√(1 + (f'(x))²)dx from {lower} to {upper}"
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating arc length: {str(e)}")
    
    def calculate_surface_area_revolution(self, func_str: str, lower: float, upper: float, axis: str = 'x-axis') -> Dict:
        """
        Calculate surface area of solid of revolution
        Surface Area = 2π ∫[a,b] f(x)√(1 + (f'(x))²)dx  (x-axis)
        Surface Area = 2π ∫[a,b] x√(1 + (f'(x))²)dx  (y-axis)
        """
        try:
            func = self.parse_function(func_str)
            derivative = sp.diff(func, self.x)
            
            if axis == 'x-axis':
                # SA = 2π ∫ f(x)√(1 + (f'(x))²)dx
                integrand = 2 * sp.pi * func * sp.sqrt(1 + derivative**2)
            else:  # y-axis
                # SA = 2π ∫ x√(1 + (f'(x))²)dx
                integrand = 2 * sp.pi * self.x * sp.sqrt(1 + derivative**2)
            
            # Numerical integration
            integrand_func = sp.lambdify(self.x, integrand, 'numpy')
            
            def safe_integrand(x):
                try:
                    return integrand_func(x)
                except:
                    return 0
            
            surface_area, error = integrate.quad(safe_integrand, lower, upper)
            
            return {
                'success': True,
                'function': str(func),
                'axis': axis,
                'surface_area': round(surface_area, 6),
                'bounds': {'lower': lower, 'upper': upper},
                'error_estimate': error
            }
            
        except Exception as e:
            raise ValueError(f"Error calculating surface area: {str(e)}")
    
    def get_integration_steps(self, func_str: str) -> Dict:
        """
        Get step-by-step integration explanation
        """
        try:
            func = self.parse_function(func_str)
            
            steps = []
            step_count = 1
            
            # Step 1: Identify function type
            steps.append({
                'step': step_count,
                'title': 'Identify Function Type',
                'description': f'Given function: {sp.latex(func)}',
                'latex': sp.latex(func)
            })
            step_count += 1
            
            # Identify function type and provide steps
            if func.is_polynomial(self.x):
                steps.append({
                    'step': step_count,
                    'title': 'Apply Power Rule',
                    'description': 'For polynomial functions, use: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C',
                    'formula': '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C'
                })
                step_count += 1
            
            if func.has(sp.sin):
                steps.append({
                    'step': step_count,
                    'title': 'Trigonometric Integration',
                    'description': '∫sin(x)dx = -cos(x) + C',
                    'formula': '\\int \\sin(x) \\, dx = -\\cos(x) + C'
                })
                step_count += 1
            
            if func.has(sp.cos):
                steps.append({
                    'step': step_count,
                    'title': 'Trigonometric Integration',
                    'description': '∫cos(x)dx = sin(x) + C',
                    'formula': '\\int \\cos(x) \\, dx = \\sin(x) + C'
                })
                step_count += 1
            
            if func.has(sp.exp):
                steps.append({
                    'step': step_count,
                    'title': 'Exponential Integration',
                    'description': '∫eˣ dx = eˣ + C',
                    'formula': '\\int e^x \\, dx = e^x + C'
                })
                step_count += 1
            
            if func.has(1/self.x):
                steps.append({
                    'step': step_count,
                    'title': 'Logarithmic Integration',
                    'description': '∫(1/x)dx = ln|x| + C',
                    'formula': '\\int \\frac{1}{x} \\, dx = \\ln|x| + C'
                })
                step_count += 1
            
            # Calculate final result
            integral_result = sp.integrate(func, self.x)
            
            steps.append({
                'step': step_count,
                'title': 'Final Result',
                'description': 'Apply integration rules',
                'result': sp.latex(integral_result) + ' + C',
                'latex': f'\\int {sp.latex(func)} \\, dx = {sp.latex(integral_result)} + C'
            })
            
            return {
                'success': True,
                'function': str(func),
                'function_latex': sp.latex(func),
                'steps': steps,
                'total_steps': len(steps),
                'final_result': str(integral_result) + ' + C',
                'final_latex': sp.latex(integral_result) + ' + C'
            }
            
        except Exception as e:
            raise ValueError(f"Error generating steps: {str(e)}")
    
    def validate_function(self, func_str: str) -> Dict:
        """
        Validate if the function is integrable
        """
        try:
            func = self.parse_function(func_str)
            
            # Try to integrate
            try:
                integral = sp.integrate(func, self.x)
                is_integrable = True
                message = "Function is integrable"
            except:
                is_integrable = False
                message = "Function cannot be integrated symbolically"
            
            return {
                'valid': True,
                'is_integrable': is_integrable,
                'message': message,
                'parsed_function': str(func),
                'latex': sp.latex(func)
            }
            
        except Exception as e:
            return {
                'valid': False,
                'is_integrable': False,
                'message': str(e),
                'parsed_function': None
            }
    
    def evaluate_function(self, func_str: str, x_vals: np.ndarray) -> np.ndarray:
        """
        Evaluate function at given x values (for plotting)
        """
        try:
            func = self.parse_function(func_str)
            func_numeric = sp.lambdify(self.x, func, 'numpy')
            return func_numeric(x_vals)
        except Exception as e:
            raise ValueError(f"Error evaluating function: {str(e)}")
    
    def get_antiderivative_at_point(self, func_str: str, point: float) -> Dict:
        """
        Evaluate antiderivative at specific point (useful for C constant determination)
        """
        try:
            func = self.parse_function(func_str)
            antiderivative = sp.integrate(func, self.x)
            
            # Evaluate at point
            antideriv_func = sp.lambdify(self.x, antiderivative, 'numpy')
            value_at_point = float(antideriv_func(point))
            
            return {
                'success': True,
                'antiderivative': str(antiderivative),
                'point': point,
                'value': round(value_at_point, 6),
                'expression': f"F({point}) = {value_at_point}"
            }
            
        except Exception as e:
            raise ValueError(f"Error evaluating antiderivative: {str(e)}")