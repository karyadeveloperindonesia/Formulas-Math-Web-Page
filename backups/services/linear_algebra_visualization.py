import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import plotly.graph_objects as go
import io
import base64

class LinearAlgebraVisualization:
    
    def visualize_matrix(self, matrix: np.ndarray) -> str:
        """Create heatmap visualization of matrix"""
        try:
            fig, ax = plt.subplots(figsize=(8, 6))
            im = ax.imshow(matrix, cmap='RdBu_r', aspect='auto')
            ax.set_title('Matrix Heatmap', fontsize=14, fontweight='bold')
            
            plt.colorbar(im, ax=ax)
            
            # PERBAIKAN: Aktifkan minor ticks agar grid muncul
            ax.set_xticks(np.arange(matrix.shape[1]))
            ax.set_yticks(np.arange(matrix.shape[0]))
            ax.set_xticks(np.arange(-.5, matrix.shape[1], 1), minor=True)
            ax.set_yticks(np.arange(-.5, matrix.shape[0], 1), minor=True)
            ax.grid(which='minor', color='gray', linestyle='-', linewidth=0.5)
            
            for i in range(matrix.shape[0]):
                for j in range(matrix.shape[1]):
                    # Tambahkan pengecekan jika nilai sangat kecil, tampilkan 0
                    val = matrix[i, j]
                    ax.text(j, i, f'{val:.2f}', ha="center", va="center", 
                            color="white" if abs(val) > (matrix.max()/2) else "black")
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
        except Exception as e:
            raise ValueError(f"Error visualizing matrix: {str(e)}")
    
    def visualize_eigenvectors_2d(self, matrix: np.ndarray, eigenvalues, eigenvectors) -> str:
        """Visualize eigenvectors in 2D"""
        try:
            if matrix.shape[0] != 2:
                raise ValueError("Only 2x2 matrices supported for 2D visualization")
            
            fig, ax = plt.subplots(figsize=(8, 8))
            
            # Plot eigenvectors - PERBAIKAN: Pastikan hanya ambil bagian REAL
            origin = np.zeros((2, len(eigenvalues))) 
            eigenvectors_real = eigenvectors.real # Ambil komponen riil
            
            colors = ['red', 'green', 'blue']
            ax.quiver(origin[0], origin[1], eigenvectors_real[0], eigenvectors_real[1],
                     color=colors[:len(eigenvalues)], scale=1, scale_units='xy', 
                     angles='xy', width=0.015, label='Eigenvectors')
            
            # Tambahkan lingkaran satuan (unit circle) untuk referensi
            theta = np.linspace(0, 2*np.pi, 100)
            ax.plot(np.cos(theta), np.sin(theta), linestyle='--', color='gray', alpha=0.5)
            
            ax.set_xlim(-3, 3)
            ax.set_ylim(-3, 3)
            ax.set_aspect('equal')
            ax.grid(True, alpha=0.3)
            ax.axhline(y=0, color='k', linewidth=0.5)
            ax.axvline(x=0, color='k', linewidth=0.5)
            ax.set_title('Eigenvectors Visualization', fontsize=14, fontweight='bold')
            ax.legend()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
        except Exception as e:
            raise ValueError(f"Error visualizing eigenvectors: {str(e)}")
    
    def visualize_eigenvectors_3d(self, matrix: np.ndarray, eigenvalues, eigenvectors) -> str:
        """Visualize eigenvectors in 3D using Plotly"""
        try:
            if matrix.shape[0] != 3:
                raise ValueError("Only 3x3 matrices supported for 3D visualization")
            
            # Create figure
            fig = go.Figure()
            
            # Add coordinate axes
            axis_length = 3
            fig.add_trace(go.Scatter3d(
                x=[0, axis_length], y=[0, 0], z=[0, 0],
                mode='lines', line=dict(color='black', width=2),
                name='X-axis', showlegend=False
            ))
            fig.add_trace(go.Scatter3d(
                x=[0, 0], y=[0, axis_length], z=[0, 0],
                mode='lines', line=dict(color='black', width=2),
                name='Y-axis', showlegend=False
            ))
            fig.add_trace(go.Scatter3d(
                x=[0, 0], y=[0, 0], z=[0, axis_length],
                mode='lines', line=dict(color='black', width=2),
                name='Z-axis', showlegend=False
            ))
            
            # Plot eigenvectors
            colors = ['red', 'green', 'blue']
            for i, (val, vec) in enumerate(zip(eigenvalues, eigenvectors.T)):
                vec_normalized = vec / np.linalg.norm(vec) * 2
                
                fig.add_trace(go.Scatter3d(
                    x=[0, vec_normalized[0]],
                    y=[0, vec_normalized[1]],
                    z=[0, vec_normalized[2]],
                    mode='lines+markers',
                    line=dict(color=colors[i], width=6),
                    marker=dict(size=[0, 10], color=colors[i]),
                    name=f'λ={val.real:.2f}'
                ))
            
            fig.update_layout(
                title='3D Eigenvectors Visualization',
                scene=dict(
                    xaxis_title='X',
                    yaxis_title='Y',
                    zaxis_title='Z',
                    aspectmode='cube'
                ),
                width=800,
                height=600
            )
            
            return fig.to_html(include_plotlyjs='cdn')
            
        except Exception as e:
            raise ValueError(f"Error visualizing 3D eigenvectors: {str(e)}")
    
    def visualize_svd(self, U, S, Vt) -> str:
        """Visualize SVD components"""
        try:
            fig, axes = plt.subplots(1, 3, figsize=(15, 5))
            
            # U matrix
            im1 = axes[0].imshow(U, cmap='RdBu_r', aspect='auto')
            axes[0].set_title('U (Left Singular Vectors)', fontweight='bold')
            plt.colorbar(im1, ax=axes[0])
            
            # Singular values
            axes[1].bar(range(len(S)), S, color='steelblue')
            axes[1].set_title('Singular Values (Σ)', fontweight='bold')
            axes[1].set_xlabel('Index')
            axes[1].set_ylabel('Value')
            axes[1].grid(True, alpha=0.3)
            
            # Vt matrix
            im3 = axes[2].imshow(Vt, cmap='RdBu_r', aspect='auto')
            axes[2].set_title('V^T (Right Singular Vectors)', fontweight='bold')
            plt.colorbar(im3, ax=axes[2])
            
            plt.tight_layout()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.read()).decode()
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
        except Exception as e:
            raise ValueError(f"Error visualizing SVD: {str(e)}")