import numpy as np
import plotly.graph_objects as go
from services.math_service import MathService

class VisualizationService:
    def __init__(self):
        self.math_service = MathService()
    
    def generate_plot(self, func_str: str, a: float, b: float, axis: str, volume: float) -> dict:
        """Generate both 2D and 3D visualizations"""
        plot_2d = self.generate_2d_plot(func_str, a, b, axis)
        plot_3d = self.generate_3d_plot(func_str, a, b, axis, volume)
        
        return {
            'plot_2d': plot_2d,
            'plot_3d': plot_3d
        }
    
    def generate_2d_plot(self, func_str: str, a: float, b: float, axis: str) -> str:
        """Generate 2D plot of the function using Plotly"""
        try:
            x = np.linspace(a, b, 500)
            y = self.math_service.evaluate_function(func_str, x)
            
            # Create Plotly figure for 2D
            fig = go.Figure()
            
            # Add main function curve
            fig.add_trace(go.Scatter(
                x=x, y=y,
                mode='lines',
                name=f'f(x) = {func_str}',
                line=dict(color='blue', width=2)
            ))
            
            # Add fill area
            fig.add_trace(go.Scatter(
                x=x, y=y,
                fill='tozeroy',
                fillcolor='rgba(0, 100, 200, 0.2)',
                name='Area',
                line=dict(color='rgba(0,0,0,0)')
            ))
            
            fig.update_layout(
                title=f'Function to be rotated around {axis}',
                xaxis_title='x',
                yaxis_title='f(x)',
                hovermode='x unified',
                plot_bgcolor='rgba(240,240,240,0.5)',
                width=800,
                height=500
            )
            
            # Convert to JSON
            plotly_json = fig.to_json()
            
            return plotly_json
        except Exception as e:
            raise ValueError(f"Error generating 2D plot: {str(e)}")
    
    def generate_3d_plot(self, func_str: str, a: float, b: float, axis: str, volume: float) -> str:
        """Generate 3D plot of solid of revolution using Plotly"""
        try:
            # Generate the solid of revolution
            x_vals = np.linspace(a, b, 100)
            y_vals = self.math_service.evaluate_function(func_str, x_vals)
            
            # Create rotation surface
            theta = np.linspace(0, 2*np.pi, 50)
            
            if axis == "x-axis":
                # Rotate around x-axis
                X, Theta = np.meshgrid(x_vals, theta)
                R = np.outer(np.ones(len(theta)), y_vals)
                Y = R * np.cos(Theta)
                Z = R * np.sin(Theta)
            else:
                # Rotate around y-axis (shell method visualization)
                Y, Theta = np.meshgrid(y_vals, theta)
                R = np.outer(np.ones(len(theta)), x_vals)
                X = R * np.cos(Theta)
                Z = R * np.sin(Theta)
            
            # Create Plotly figure
            fig = go.Figure(data=[
                go.Surface(
                    x=X, y=Y, z=Z,
                    colorscale='Viridis',
                    showscale=False,
                    opacity=0.9
                )
            ])
            
            fig.update_layout(
                title=f'Solid of Revolution (Volume = {volume:.4f})',
                scene=dict(
                    xaxis_title='X',
                    yaxis_title='Y',
                    zaxis_title='Z',
                    aspectmode='data'
                ),
                width=800,
                height=600
            )
            
            # Convert to JSON
            plotly_json = fig.to_json()
            
            return plotly_json
            
        except Exception as e:
            raise ValueError(f"Error generating 3D plot: {str(e)}")