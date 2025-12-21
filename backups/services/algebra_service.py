import sympy as sp
from typing import Dict, List, Tuple
import numpy as np

class AlgebraService:
    def __init__(self):
        self.x = sp.Symbol('x')
    
    # ============ LINEAR EQUATION ============
    def solve_linear(self, a: float, b: float) -> Dict:
        """
        Solve linear equation: ax + b = 0
        Solution: x = -b/a
        
        Args:
            a (float): Coefficient of x
            b (float): Constant term
            
        Returns:
            dict: Solution and steps
        """
        try:
            if a == 0:
                raise ValueError("Coefficient 'a' cannot be zero for linear equation")
            
            # Symbolic solution
            equation = a * self.x + b
            solution_symbolic = sp.solve(equation, self.x)
            solution_value = float(solution_symbolic[0])
            
            # Steps
            steps = [
                {
                    "step": 1,
                    "description": "Linear equation form",
                    "expression": f"{a}x + {b} = 0"
                },
                {
                    "step": 2,
                    "description": "Isolate x term",
                    "expression": f"{a}x = {-b}"
                },
                {
                    "step": 3,
                    "description": "Divide by coefficient",
                    "expression": f"x = {-b}/{a}"
                },
                {
                    "step": 4,
                    "description": "Final solution",
                    "expression": f"x = {solution_value}"
                }
            ]
            
            # Verification
            verification = a * solution_value + b
            
            return {
                'success': True,
                'equation': f"{a}x + {b} = 0",
                'a': float(a),
                'b': float(b),
                'solution': solution_value,
                'solution_fraction': str(sp.Rational(a).limit_denominator() * (-b) / a),
                'steps': steps,
                'verification': {
                    'equation_result': float(verification),
                    'is_correct': abs(verification) < 1e-10
                }
            }
            
        except Exception as e:
            raise ValueError(f"Error solving linear equation: {str(e)}")
    
    # ============ QUADRATIC EQUATION ============
    def solve_quadratic(self, a: float, b: float, c: float) -> Dict:
        """
        Solve quadratic equation: ax² + bx + c = 0
        Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
        
        Args:
            a (float): Coefficient of x²
            b (float): Coefficient of x
            c (float): Constant term
            
        Returns:
            dict: Roots, discriminant, and detailed steps
        """
        try:
            if a == 0:
                raise ValueError("Coefficient 'a' cannot be zero for quadratic equation")
            
            # Symbolic solution
            equation = a * self.x**2 + b * self.x + c
            solutions = sp.solve(equation, self.x)
            
            # Convert to float
            roots = []
            for sol in solutions:
                if sol.is_real:
                    roots.append(float(sol))
                else:
                    # Complex number
                    roots.append({
                        'real': float(sol.as_real_imag()[0]),
                        'imag': float(sol.as_real_imag()[1])
                    })
            
            # Calculate discriminant
            discriminant = b**2 - 4*a*c
            
            # Steps
            steps = [
                {
                    "step": 1,
                    "description": "Quadratic equation form",
                    "expression": f"{a}x² + {b}x + {c} = 0"
                },
                {
                    "step": 2,
                    "description": "Identify coefficients",
                    "expression": f"a = {a}, b = {b}, c = {c}"
                },
                {
                    "step": 3,
                    "description": "Calculate discriminant (Δ = b² - 4ac)",
                    "expression": f"Δ = ({b})² - 4({a})({c}) = {discriminant}"
                }
            ]
            
            # Add analysis based on discriminant
            if discriminant > 0:
                steps.append({
                    "step": 4,
                    "description": "Discriminant > 0: Two distinct real roots",
                    "expression": f"Δ = {discriminant} > 0"
                })
                sqrt_discriminant = np.sqrt(discriminant)
                x1 = (-b + sqrt_discriminant) / (2*a)
                x2 = (-b - sqrt_discriminant) / (2*a)
                steps.append({
                    "step": 5,
                    "description": "Apply quadratic formula",
                    "expression": f"x = (-b ± √Δ) / 2a = ({-b} ± √{discriminant}) / {2*a}"
                })
                steps.append({
                    "step": 6,
                    "description": "Calculate roots",
                    "expression": f"x₁ = {x1}, x₂ = {x2}"
                })
                
            elif discriminant == 0:
                steps.append({
                    "step": 4,
                    "description": "Discriminant = 0: One repeated real root",
                    "expression": f"Δ = {discriminant} = 0"
                })
                x = -b / (2*a)
                steps.append({
                    "step": 5,
                    "description": "Apply quadratic formula",
                    "expression": f"x = -b / 2a = {-b} / {2*a}"
                })
                steps.append({
                    "step": 6,
                    "description": "Solution",
                    "expression": f"x = {x} (repeated root)"
                })
                
            else:  # discriminant < 0
                steps.append({
                    "step": 4,
                    "description": "Discriminant < 0: No real roots (complex roots)",
                    "expression": f"Δ = {discriminant} < 0"
                })
                real_part = -b / (2*a)
                imag_part = np.sqrt(abs(discriminant)) / (2*a)
                steps.append({
                    "step": 5,
                    "description": "Apply quadratic formula with complex numbers",
                    "expression": f"x = (-b ± i√|Δ|) / 2a"
                })
                steps.append({
                    "step": 6,
                    "description": "Complex solutions",
                    "expression": f"x₁ = {real_part} + {imag_part}i, x₂ = {real_part} - {imag_part}i"
                })
            
            # Verification
            verification = []
            for i, root in enumerate(roots):
                if isinstance(root, dict):
                    # Complex root
                    z = complex(root['real'], root['imag'])
                    result = a * z**2 + b * z + c
                else:
                    result = a * root**2 + b * root + c
                verification.append({
                    'root': root,
                    'result': float(abs(result)) if isinstance(result, complex) else float(result),
                    'is_correct': abs(result) < 1e-10
                })
            
            return {
                'success': True,
                'equation': f"{a}x² + {b}x + {c} = 0",
                'a': float(a),
                'b': float(b),
                'c': float(c),
                'discriminant': float(discriminant),
                'discriminant_type': 'positive' if discriminant > 0 else ('zero' if discriminant == 0 else 'negative'),
                'roots': roots,
                'steps': steps,
                'verification': verification
            }
            
        except Exception as e:
            raise ValueError(f"Error solving quadratic equation: {str(e)}")
    
    # ============ FACTORING QUADRATIC ============
    def factor_quadratic(self, a: float, b: float, c: float) -> Dict:
        """
        Factor quadratic expression: ax² + bx + c
        
        Args:
            a (float): Coefficient of x²
            b (float): Coefficient of x
            c (float): Constant term
            
        Returns:
            dict: Factored form and steps
        """
        try:
            # Symbolic factorization
            expr = a * self.x**2 + b * self.x + c
            factored = sp.factor(expr)
            
            return {
                'success': True,
                'original': f"{a}x² + {b}x + {c}",
                'original_latex': sp.latex(expr),
                'factored': str(factored),
                'factored_latex': sp.latex(factored),
                'is_factorable': str(factored) != str(expr)  # Check if factorization changed
            }
            
        except Exception as e:
            raise ValueError(f"Error factoring quadratic: {str(e)}")
    
    # ============ POLYNOMIAL EQUATION ============
    def solve_polynomial(self, coefficients: List[float]) -> Dict:
        """
        Solve polynomial equation from coefficients
        
        Args:
            coefficients (list): List of coefficients [a_n, a_{n-1}, ..., a_1, a_0]
                                for a_n*x^n + a_{n-1}*x^{n-1} + ... + a_1*x + a_0 = 0
        
        Returns:
            dict: Roots and analysis
        """
        try:
            if not coefficients or len(coefficients) == 0:
                raise ValueError("Coefficients list cannot be empty")
            
            # Remove leading zeros
            while len(coefficients) > 1 and coefficients[0] == 0:
                coefficients = coefficients[1:]
            
            degree = len(coefficients) - 1
            
            # Build polynomial expression
            poly_expr = sum(coefficients[i] * self.x**(degree - i) for i in range(len(coefficients)))
            
            # Solve
            solutions = sp.solve(poly_expr, self.x)
            
            # Convert solutions
            roots = []
            for sol in solutions:
                if sol.is_real:
                    roots.append(float(sol))
                else:
                    roots.append({
                        'real': float(sol.as_real_imag()[0]),
                        'imag': float(sol.as_real_imag()[1])
                    })
            
            return {
                'success': True,
                'degree': degree,
                'polynomial': str(poly_expr),
                'polynomial_latex': sp.latex(poly_expr),
                'roots': roots,
                'num_roots': len(roots),
                'num_real_roots': sum(1 for r in roots if isinstance(r, float))
            }
            
        except Exception as e:
            raise ValueError(f"Error solving polynomial: {str(e)}")
