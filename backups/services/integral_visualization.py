import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import plotly.graph_objects as go
import io
import base64
from services.integral_service import IntegralService

class IntegralVisualization:
    def __init__(self):
        self.integral_service = IntegralService()
    
    def visualize_function(self, func_str: str, lower: float, upper: float) -> str:
        """
        Visualize function for integration
        """
        try:
            # Generate x values
            x = np.linspace(lower - 1, upper + 1, 500)
            y = self.integral_service.evaluate_function(func_str, x)
            
            fig, ax = plt.subplots(figsize=(10, 6))
            
            # Plot function
            ax.plot(x, y, 'b-', linewidth=2, label=f'f(x) = {func_str}')
            
            # Highlight integration region
            x_fill = np.linspace(lower, upper, 500)
            y_fill = self.integral_service.evaluate_function(func_str, x_fill)
            ax.fill_between(x_fill, 0, y_fill, alpha=0.3, color='blue', label='Integration region')
            
            # Mark bounds
            ax.axvline(x=lower, color='red', linestyle='--', linewidth=1.5, label=f'x = {lower}')
            ax.axvline(x=upper, color='red', linestyle='--', linewidth=1.5, label=f'x = {upper}')
            
            # Axes
            ax.axhline(y=0, color='k', linewidth=0.5)
            ax.axvline(x=0, color='k', linewidth=0.5)
            ax.grid(True, alpha=0.3)
            
            ax.set_xlabel('x', fontsize=12)
            ax.set_ylabel('f(x)', fontsize=12)
            ax.set_title(f'Function: f(x) = {func_str}', fontsize=14, fontweight='bold')
            ax.legend()
            
            # Save to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            raise ValueError(f"Error visualizing function: {str(e)}")
    
    def visualize_area_under_curve(self, func_str: str, lower: float, upper: float, integral_value: float) -> str:
        """
        Visualize area under curve with shading
        """
        try:
            # Generate x values
            x_range = np.linspace(lower - 1, upper + 1, 500)
            y_range = self.integral_service.evaluate_function(func_str, x_range)
            
            # Integration region
            x_fill = np.linspace(lower, upper, 500)
            y_fill = self.integral_service.evaluate_function(func_str, x_fill)
            
            fig, ax = plt.subplots(figsize=(12, 7))
            
            # Plot function
            ax.plot(x_range, y_range, 'b-', linewidth=2.5, label=f'f(x) = {func_str}')
            
            # Fill area
            ax.fill_between(x_fill, 0, y_fill, alpha=0.4, color='skyblue', label=f'Area = {integral_value:.4f}')
            
            # Mark bounds
            y_lower = self.integral_service.evaluate_function(func_str, np.array([lower]))[0]
            y_upper = self.integral_service.evaluate_function(func_str, np.array([upper]))[0]
            
            ax.plot([lower, lower], [0, y_lower], 'r--', linewidth=2)
            ax.plot([upper, upper], [0, y_upper], 'r--', linewidth=2)
            ax.plot(lower, y_lower, 'ro', markersize=8, label=f'({lower}, {y_lower:.2f})')
            ax.plot(upper, y_upper, 'ro', markersize=8, label=f'({upper}, {y_upper:.2f})')
            
            # Axes
            ax.axhline(y=0, color='k', linewidth=0.8)
            ax.axvline(x=0, color='k', linewidth=0.8)
            ax.grid(True, alpha=0.3, linestyle='--')
            
            ax.set_xlabel('x', fontsize=14, fontweight='bold')
            ax.set_ylabel('f(x)', fontsize=14, fontweight='bold')
            ax.set_title(f'Definite Integral: ∫[{lower}, {upper}] f(x)dx = {integral_value:.4f}', 
                        fontsize=16, fontweight='bold')
            ax.legend(fontsize=11, loc='best')
            
            # Save to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=120, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            raise ValueError(f"Error visualizing area: {str(e)}")
    
    def visualize_riemann_sum(self, func_str: str, lower: float, upper: float, n_rectangles: int = 10) -> str:
        """
        Visualize Riemann sum approximation
        """
        try:
            x = np.linspace(lower, upper, 500)
            y = self.integral_service.evaluate_function(func_str, x)
            
            # Calculate rectangle positions
            dx = (upper - lower) / n_rectangles
            x_rect = np.linspace(lower, upper - dx, n_rectangles)
            y_rect = self.integral_service.evaluate_function(func_str, x_rect + dx/2)  # Midpoint
            
            fig, ax = plt.subplots(figsize=(12, 7))
            
            # Plot function
            ax.plot(x, y, 'b-', linewidth=2, label=f'f(x) = {func_str}')
            
            # Draw rectangles
            for i in range(n_rectangles):
                ax.bar(x_rect[i] + dx/2, y_rect[i], width=dx, alpha=0.3, 
                      edgecolor='red', color='yellow', linewidth=1.5)
            
            # Calculate Riemann sum
            riemann_sum = np.sum(y_rect * dx)
            
            ax.axhline(y=0, color='k', linewidth=0.5)
            ax.axvline(x=0, color='k', linewidth=0.5)
            ax.grid(True, alpha=0.3)
            
            ax.set_xlabel('x', fontsize=12)
            ax.set_ylabel('f(x)', fontsize=12)
            ax.set_title(f'Riemann Sum Approximation (n={n_rectangles}): ≈ {riemann_sum:.4f}', 
                        fontsize=14, fontweight='bold')
            ax.legend()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            raise ValueError(f"Error visualizing Riemann sum: {str(e)}")
    
    def visualize_3d_integral(self, func_str: str, lower: float, upper: float) -> str:
        """
        3D visualization showing area as volume (plotly)
        """
        try:
            # Generate mesh
            x = np.linspace(lower, upper, 50)
            y_vals = self.integral_service.evaluate_function(func_str, x)
            
            # Create 3D surface by rotating around x-axis
            theta = np.linspace(0, 2*np.pi, 30)
            X, Theta = np.meshgrid(x, theta)
            Y = np.outer(np.cos(theta), y_vals)
            Z = np.outer(np.sin(theta), y_vals)
            
            fig = go.Figure(data=[
                go.Surface(
                    x=X, y=Y, z=Z,
                    colorscale='Viridis',
                    showscale=True,
                    opacity=0.9
                )
            ])
            
            fig.update_layout(
                title=f'3D Visualization: Rotating f(x)={func_str} around x-axis',
                scene=dict(
                    xaxis_title='X',
                    yaxis_title='Y',
                    zaxis_title='Z',
                    aspectmode='data'
                ),
                width=900,
                height=700
            )
            
            return fig.to_html(include_plotlyjs='cdn')
            
        except Exception as e:
            raise ValueError(f"Error creating 3D visualization: {str(e)}")
    
    def visualize_antiderivative(self, func_str: str, lower: float, upper: float) -> str:
        """
        Plot both function and its antiderivative
        """
        try:
            import sympy as sp
            
            # Parse and integrate
            func = self.integral_service.parse_function(func_str)
            antideriv = sp.integrate(func, self.integral_service.x)
            
            # Generate x values
            x = np.linspace(lower - 1, upper + 1, 500)
            y_func = self.integral_service.evaluate_function(func_str, x)
            
            # Evaluate antiderivative
            antideriv_lambda = sp.lambdify(self.integral_service.x, antideriv, 'numpy')
            y_antideriv = antideriv_lambda(x)
            
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
            
            # Plot original function
            ax1.plot(x, y_func, 'b-', linewidth=2, label=f'f(x) = {func_str}')
            ax1.fill_between(x[(x >= lower) & (x <= upper)], 
                           0, 
                           y_func[(x >= lower) & (x <= upper)], 
                           alpha=0.3, color='blue')
            ax1.axhline(y=0, color='k', linewidth=0.5)
            ax1.axvline(x=0, color='k', linewidth=0.5)
            ax1.grid(True, alpha=0.3)
            ax1.set_ylabel('f(x)', fontsize=12)
            ax1.set_title('Original Function', fontsize=14, fontweight='bold')
            ax1.legend()
            
            # Plot antiderivative
            ax2.plot(x, y_antideriv, 'r-', linewidth=2, label=f'F(x) = {str(antideriv)}')
            ax2.axhline(y=0, color='k', linewidth=0.5)
            ax2.axvline(x=0, color='k', linewidth=0.5)
            ax2.axvline(x=lower, color='g', linestyle='--', alpha=0.5)
            ax2.axvline(x=upper, color='g', linestyle='--', alpha=0.5)
            ax2.grid(True, alpha=0.3)
            ax2.set_xlabel('x', fontsize=12)
            ax2.set_ylabel('F(x)', fontsize=12)
            ax2.set_title('Antiderivative (Indefinite Integral)', fontsize=14, fontweight='bold')
            ax2.legend()
            
            plt.tight_layout()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            raise ValueError(f"Error visualizing antiderivative: {str(e)}")
    
    def create_comparison_plot(self, func_str: str, lower: float, upper: float, 
                              methods: list = ['left', 'right', 'midpoint', 'trapezoid']) -> str:
        """
        Compare different numerical integration methods
        """
        try:
            x = np.linspace(lower, upper, 500)
            y = self.integral_service.evaluate_function(func_str, x)
            
            n = 10  # Number of subdivisions
            dx = (upper - lower) / n
            
            fig, axes = plt.subplots(2, 2, figsize=(16, 12))
            axes = axes.flatten()
            
            for idx, method in enumerate(methods[:4]):
                ax = axes[idx]
                ax.plot(x, y, 'b-', linewidth=2, label=f'f(x) = {func_str}')
                
                x_points = np.linspace(lower, upper, n + 1)
                
                if method == 'left':
                    y_points = self.integral_service.evaluate_function(func_str, x_points[:-1])
                    for i in range(n):
                        ax.bar(x_points[i], y_points[i], width=dx, alpha=0.3, 
                              align='edge', edgecolor='red', color='yellow')
                    approx = np.sum(y_points * dx)
                    
                elif method == 'right':
                    y_points = self.integral_service.evaluate_function(func_str, x_points[1:])
                    for i in range(n):
                        ax.bar(x_points[i+1], y_points[i], width=-dx, alpha=0.3,
                              align='edge', edgecolor='red', color='yellow')
                    approx = np.sum(y_points * dx)
                    
                elif method == 'midpoint':
                    x_mid = (x_points[:-1] + x_points[1:]) / 2
                    y_mid = self.integral_service.evaluate_function(func_str, x_mid)
                    for i in range(n):
                        ax.bar(x_mid[i], y_mid[i], width=dx, alpha=0.3,
                              edgecolor='red', color='yellow')
                    approx = np.sum(y_mid * dx)
                    
                elif method == 'trapezoid':
                    y_points = self.integral_service.evaluate_function(func_str, x_points)
                    for i in range(n):
                        ax.fill([x_points[i], x_points[i+1], x_points[i+1], x_points[i]],
                               [0, 0, y_points[i+1], y_points[i]], 
                               alpha=0.3, color='yellow', edgecolor='red')
                    approx = np.sum((y_points[:-1] + y_points[1:]) / 2 * dx)
                
                ax.axhline(y=0, color='k', linewidth=0.5)
                ax.grid(True, alpha=0.3)
                ax.set_title(f'{method.capitalize()} Rule: ≈ {approx:.4f}', fontweight='bold')
                ax.legend()
            
            plt.tight_layout()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            raise ValueError(f"Error creating comparison plot: {str(e)}")