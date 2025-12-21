import numpy as np
from scipy import linalg
import sympy as sp
from typing import Dict, List, Optional, Tuple
import json

class LinearAlgebraService:
    def __init__(self):
        pass
    
    def parse_matrix(self, matrix_str: str) -> np.ndarray:
        """
        Parse matrix from string or list
        Input formats:
        - "[[1,2],[3,4]]" 
        - [[1,2],[3,4]]
        """
        try:
            if isinstance(matrix_str, str):
                matrix_data = json.loads(matrix_str)
            else:
                matrix_data = matrix_str
            
            return np.array(matrix_data, dtype=float)
        except Exception as e:
            raise ValueError(f"Invalid matrix format: {str(e)}")
    
    def matrix_determinant(self, matrix: List[List[float]]) -> Dict:
        try:
            A = self.parse_matrix(matrix)
            if A.shape[0] != A.shape[1]:
                raise ValueError("Matrix must be square to calculate determinant")
            
            det = np.linalg.det(A)
            
            symbolic_det = None
            if A.shape[0] <= 4:
                try:
                    # Gunakan nsimplify agar SymPy mencoba mengubah float ke rasional
                    A_sym = sp.Matrix(A.tolist())
                    symbolic_det = str(sp.simplify(A_sym.det()))
                except:
                    pass
            
            return {
                'determinant': float(det),
                'symbolic_determinant': symbolic_det,
                'matrix_size': [int(s) for s in A.shape], # Pastikan elemennya int standar
                'is_singular': bool(abs(det) < 1e-10)     # PAKSA KE BOOL PYTHON
            }
        except Exception as e:
            raise ValueError(f"Error calculating determinant: {str(e)}")
    
    def matrix_inverse(self, matrix: List[List[float]]) -> Dict:
        """Calculate matrix inverse"""
        try:
            A = self.parse_matrix(matrix)
            
            if A.shape[0] != A.shape[1]:
                raise ValueError("Matrix must be square to calculate inverse")
            
            det = np.linalg.det(A)
            if abs(det) < 1e-10:
                raise ValueError("Matrix is singular (determinant = 0), inverse does not exist")
            
            A_inv = np.linalg.inv(A)
            
            # Verify: A * A_inv = I
            verification = np.allclose(A @ A_inv, np.eye(A.shape[0]))
            
            return {
                'inverse': A_inv.tolist(),
                'determinant': float(det),
                'verification_passed': verification,
                'condition_number': float(np.linalg.cond(A))
            }
        except np.linalg.LinAlgError as e:
            raise ValueError(f"Matrix is singular or ill-conditioned: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error calculating inverse: {str(e)}")
    
    def matrix_eigenvalues(self, matrix: List[List[float]]) -> Dict:
        """Calculate eigenvalues and eigenvectors"""
        try:
            A = self.parse_matrix(matrix)
            
            if A.shape[0] != A.shape[1]:
                raise ValueError("Matrix must be square to calculate eigenvalues")
            
            eigenvalues, eigenvectors = np.linalg.eig(A)
            
            # Sort by eigenvalue magnitude
            idx = np.argsort(np.abs(eigenvalues))[::-1]
            eigenvalues = eigenvalues[idx]
            eigenvectors = eigenvectors[:, idx]
            
            eigen_pairs = []
            for i, (val, vec) in enumerate(zip(eigenvalues, eigenvectors.T)):
                eigen_pairs.append({
                    'eigenvalue': {
                        'real': float(val.real),
                        'imag': float(val.imag),
                        'magnitude': float(np.abs(val))
                    },
                    'eigenvector': vec.tolist()
                })
            
            return {
                'eigenvalues': [float(val.real) if val.imag == 0 else complex(val) for val in eigenvalues],
                'eigenvectors': eigenvectors.tolist(),
                'eigen_pairs': eigen_pairs,
                'trace': float(np.trace(A)),
                'is_diagonalizable': True  # Simplified check
            }
        except Exception as e:
            raise ValueError(f"Error calculating eigenvalues: {str(e)}")
    
    def matrix_decomposition(self, matrix: List[List[float]], method: str = 'lu') -> Dict:
        """
        Matrix decomposition: LU, QR, SVD, Cholesky
        """
        try:
            A = self.parse_matrix(matrix)
            
            result = {'method': method, 'original_matrix': A.tolist()}
            
            if method.lower() == 'lu':
                P, L, U = linalg.lu(A)
                result.update({
                    'P': P.tolist(),
                    'L': L.tolist(),
                    'U': U.tolist(),
                    'description': 'A = P·L·U decomposition'
                })
                
            elif method.lower() == 'qr':
                Q, R = np.linalg.qr(A)
                result.update({
                    'Q': Q.tolist(),
                    'R': R.tolist(),
                    'description': 'A = Q·R decomposition (Q is orthogonal)'
                })
                
            elif method.lower() == 'svd':
                U, S, Vt = np.linalg.svd(A)
                result.update({
                    'U': U.tolist(),
                    'singular_values': S.tolist(),
                    'Vt': Vt.tolist(),
                    'condition_number': float(S[0] / S[-1]) if S[-1] != 0 else float('inf'),
                    'rank': int(np.sum(S > 1e-10)),
                    'description': 'A = U·Σ·V^T decomposition'
                })
                
            elif method.lower() == 'cholesky':
                if A.shape[0] != A.shape[1]:
                    raise ValueError("Matrix must be square for Cholesky decomposition")
                if not np.allclose(A, A.T):
                    raise ValueError("Matrix must be symmetric for Cholesky decomposition")
                
                L = np.linalg.cholesky(A)
                result.update({
                    'L': L.tolist(),
                    'description': 'A = L·L^T decomposition (Cholesky)'
                })
            else:
                raise ValueError(f"Unknown decomposition method: {method}")
            
            return result
            
        except np.linalg.LinAlgError as e:
            raise ValueError(f"Decomposition failed: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error in decomposition: {str(e)}")
    
    def solve_linear_system(self, A: List[List[float]], b: List[float]) -> Dict:
        """
        Solve linear system Ax = b
        """
        try:
            A_matrix = self.parse_matrix(A)
            b_vector = np.array(b, dtype=float)
            
            if A_matrix.shape[0] != len(b_vector):
                raise ValueError("Matrix dimensions don't match vector dimensions")
            
            # Check if system is solvable
            det = np.linalg.det(A_matrix) if A_matrix.shape[0] == A_matrix.shape[1] else None
            
            # Solve system
            x = np.linalg.solve(A_matrix, b_vector)
            
            # Verify solution
            verification = np.allclose(A_matrix @ x, b_vector)
            residual = np.linalg.norm(A_matrix @ x - b_vector)
            
            return {
                'solution': x.tolist(),
                'verification_passed': verification,
                'residual': float(residual),
                'determinant': float(det) if det is not None else None,
                'condition_number': float(np.linalg.cond(A_matrix))
            }
            
        except np.linalg.LinAlgError:
            raise ValueError("System is singular or has no unique solution")
        except Exception as e:
            raise ValueError(f"Error solving system: {str(e)}")
    
    def matrix_operations(self, operation: str, matrix_a: List[List[float]], 
                         matrix_b: Optional[List[List[float]]] = None,
                         scalar: Optional[float] = None) -> Dict:
        """
        Basic matrix operations: add, subtract, multiply, scalar multiply, transpose, power
        """
        try:
            A = self.parse_matrix(matrix_a)
            result_data = {'operation': operation}
            
            if operation == 'transpose':
                result = A.T
                result_data['result'] = result.tolist()
                
            elif operation == 'scalar_multiply':
                if scalar is None:
                    raise ValueError("Scalar value required for scalar multiplication")
                result = scalar * A
                result_data['result'] = result.tolist()
                result_data['scalar'] = scalar
                
            elif operation == 'power':
                if scalar is None:
                    raise ValueError("Power value required")
                if A.shape[0] != A.shape[1]:
                    raise ValueError("Matrix must be square for power operation")
                result = np.linalg.matrix_power(A, int(scalar))
                result_data['result'] = result.tolist()
                result_data['power'] = int(scalar)
                
            elif operation in ['add', 'subtract', 'multiply']:
                if matrix_b is None:
                    raise ValueError(f"Second matrix required for {operation}")
                
                B = self.parse_matrix(matrix_b)
                
                if operation == 'add':
                    if A.shape != B.shape:
                        raise ValueError("Matrices must have same dimensions for addition")
                    result = A + B
                    
                elif operation == 'subtract':
                    if A.shape != B.shape:
                        raise ValueError("Matrices must have same dimensions for subtraction")
                    result = A - B
                    
                elif operation == 'multiply':
                    if A.shape[1] != B.shape[0]:
                        raise ValueError(f"Cannot multiply matrices: {A.shape} and {B.shape}")
                    result = A @ B
                
                result_data['result'] = result.tolist()
                result_data['matrix_b_shape'] = list(B.shape)  # ✅ Jadi list
                
            else:
                raise ValueError(f"Unknown operation: {operation}")
            
            result_data['matrix_a_shape'] = list(A.shape)  # ✅ Jadi list
            result_data['result_shape'] = list(result.shape) if 'result' in locals() else None  # ✅ Jadi list
            
            return result_data
            
        except Exception as e:
            raise ValueError(f"Error in matrix operation: {str(e)}")
    
    def matrix_rank(self, matrix: List[List[float]]) -> Dict:
        try:
            A = self.parse_matrix(matrix)
            rank = np.linalg.matrix_rank(A)
            
            return {
                'rank': int(rank),
                'matrix_shape': [int(s) for s in A.shape],
                'is_full_rank': bool(rank == min(A.shape)) # PAKSA KE BOOL PYTHON
            }
        except Exception as e:
            raise ValueError(f"Error calculating rank: {str(e)}")