from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import uvicorn
from typing import Optional, Literal, List
import re

app = FastAPI(title="Advanced Math Calculator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ SOLID OF REVOLUTION MODELS ============
class VolumeRequest(BaseModel):
    function: str
    lower_bound: float
    upper_bound: float
    axis: Literal["x-axis", "y-axis"] = "x-axis"
    
    @validator('function')
    def validate_function(cls, v):
        allowed = re.compile(r'^[x0-9+\-*/().\s**sqrt()sincostanexplog]+$')
        if not allowed.match(v.replace(' ', '')):
            raise ValueError('Invalid function expression')
        return v
    
    @validator('upper_bound')
    def validate_bounds(cls, v, values):
        if 'lower_bound' in values and v <= values['lower_bound']:
            raise ValueError('Upper bound must be greater than lower bound')
        return v

# ============ LINEAR ALGEBRA MODELS ============
class MatrixRequest(BaseModel):
    matrix: List[List[float]]

class MatrixOperationRequest(BaseModel):
    operation: Literal["add", "subtract", "multiply", "transpose", "scalar_multiply", "power"]
    matrix_a: List[List[float]]
    matrix_b: Optional[List[List[float]]] = None
    scalar: Optional[float] = None

class LinearSystemRequest(BaseModel):
    A: List[List[float]]
    b: List[float]

class DecompositionRequest(BaseModel):
    matrix: List[List[float]]
    method: Literal["lu", "qr", "svd", "cholesky"] = "lu"

# ============ INTEGRAL CALCULATOR MODELS ============
class IndefiniteIntegralRequest(BaseModel):
    function: str
    
    @validator('function')
    def validate_function(cls, v):
        if not v or v.strip() == "":
            raise ValueError('Function cannot be empty')
        return v.strip()

class DefiniteIntegralRequest(BaseModel):
    function: str
    lower_bound: float
    upper_bound: float
    
    @validator('function')
    def validate_function(cls, v):
        if not v or v.strip() == "":
            raise ValueError('Function cannot be empty')
        return v.strip()
    
    @validator('upper_bound')
    def validate_bounds(cls, v, values):
        if 'lower_bound' in values and v <= values['lower_bound']:
            raise ValueError('Upper bound must be greater than lower bound')
        return v

class IntegralStepsRequest(BaseModel):
    function: str

# ============ ROOT ENDPOINT ============
@app.get("/")
def read_root():
    return {
        "message": "Advanced Math Calculator API",
        "status": "running",
        "version": "2.2",
        "modules": {
            "solid_of_revolution": {
                "endpoint": "/api/volume",
                "description": "Calculate volume of solids of revolution",
                "method": "POST"
            },
            "linear_algebra": {
                "endpoints": {
                    "/api/linear-algebra/determinant": "Calculate matrix determinant",
                    "/api/linear-algebra/inverse": "Calculate matrix inverse",
                    "/api/linear-algebra/eigenvalues": "Calculate eigenvalues and eigenvectors",
                    "/api/linear-algebra/decomposition": "Matrix decomposition (LU, QR, SVD, Cholesky)",
                    "/api/linear-algebra/solve": "Solve linear system Ax=b",
                    "/api/linear-algebra/operations": "Matrix operations",
                    "/api/linear-algebra/rank": "Calculate matrix rank"
                },
                "method": "POST"
            },
            "integral_calculator": {
                "endpoints": {
                    "/api/integral/indefinite": "Calculate indefinite integral ∫f(x)dx",
                    "/api/integral/definite": "Calculate definite integral ∫[a,b]f(x)dx with visualization",
                    "/api/integral/area": "Calculate area under curve",
                    "/api/integral/average-value": "Calculate average value of function",
                    "/api/integral/arc-length": "Calculate arc length of curve",
                    "/api/integral/surface-area": "Calculate surface area of solid",
                    "/api/integral/steps": "Get integration steps",
                    "/api/integral/riemann": "Visualize Riemann sum",
                    "/api/integral/visualize-3d": "3D visualization",
                    "/api/integral/antiderivative-viz": "Visualize antiderivative",
                    "/api/integral/comparison": "Compare integration methods",
                    "/api/integral/validate": "Validate function"
                },
                "method": "POST"
            }
        },
        "documentation": "/docs"
    }

# ============ SOLID OF REVOLUTION ROUTES ============
@app.post("/api/volume")
async def calculate_volume(request: VolumeRequest):
    try:
        from services.math_service import MathService
        from services.visualization_service import VisualizationService
        
        math_service = MathService()
        viz_service = VisualizationService()
        
        result = math_service.calculate_volume(
            request.function,
            request.lower_bound,
            request.upper_bound,
            request.axis
        )
        
        plot_data = viz_service.generate_plot(
            request.function,
            request.lower_bound,
            request.upper_bound,
            request.axis,
            result['volume_numerical']
        )
        
        return {
            "success": True,
            "module": "solid_of_revolution",
            "volume_numerical": result['volume_numerical'],
            "volume_symbolic": result['volume_symbolic'],
            "integral_expression": result['integral_expression'],
            "function": request.function,
            "bounds": {
                "lower": request.lower_bound,
                "upper": request.upper_bound
            },
            "axis": request.axis,
            "plot_2d": plot_data['plot_2d'],
            "plot_3d": plot_data['plot_3d']
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============ LINEAR ALGEBRA ROUTES ============

@app.post("/api/linear-algebra/determinant")
async def matrix_determinant(request: MatrixRequest):
    """Calculate determinant of a square matrix"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        from services.linear_algebra_visualization import LinearAlgebraVisualization
        
        la_service = LinearAlgebraService()
        la_viz = LinearAlgebraVisualization()
        
        result = la_service.matrix_determinant(request.matrix)
        
        # Add visualization
        import numpy as np
        matrix_viz = la_viz.visualize_matrix(np.array(request.matrix))
        result['matrix_visualization'] = matrix_viz
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "determinant",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/inverse")
async def matrix_inverse(request: MatrixRequest):
    """Calculate inverse of a square matrix"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        from services.linear_algebra_visualization import LinearAlgebraVisualization
        
        la_service = LinearAlgebraService()
        la_viz = LinearAlgebraVisualization()
        
        result = la_service.matrix_inverse(request.matrix)
        
        # Add visualizations
        import numpy as np
        original_viz = la_viz.visualize_matrix(np.array(request.matrix))
        inverse_viz = la_viz.visualize_matrix(np.array(result['inverse']))
        
        result['original_matrix_viz'] = original_viz
        result['inverse_matrix_viz'] = inverse_viz
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "inverse",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/eigenvalues")
async def matrix_eigenvalues(request: MatrixRequest):
    """Calculate eigenvalues and eigenvectors"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        from services.linear_algebra_visualization import LinearAlgebraVisualization
        
        la_service = LinearAlgebraService()
        la_viz = LinearAlgebraVisualization()
        
        result = la_service.matrix_eigenvalues(request.matrix)
        
        # Add visualization
        import numpy as np
        matrix = np.array(request.matrix)
        matrix_viz = la_viz.visualize_matrix(matrix)
        result['matrix_visualization'] = matrix_viz
        
        # Add eigenvector visualization for 2D or 3D
        if matrix.shape[0] == 2:
            eigenvalues = np.array([ep['eigenvalue']['real'] + 1j*ep['eigenvalue']['imag'] 
                                   for ep in result['eigen_pairs']])
            eigenvectors = np.array(result['eigenvectors'])
            eigen_viz = la_viz.visualize_eigenvectors_2d(matrix, eigenvalues, eigenvectors)
            result['eigenvectors_visualization'] = eigen_viz
        elif matrix.shape[0] == 3:
            eigenvalues = np.array([ep['eigenvalue']['real'] + 1j*ep['eigenvalue']['imag'] 
                                   for ep in result['eigen_pairs']])
            eigenvectors = np.array(result['eigenvectors'])
            eigen_viz = la_viz.visualize_eigenvectors_3d(matrix, eigenvalues, eigenvectors)
            result['eigenvectors_visualization_3d'] = eigen_viz
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "eigenvalues",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/decomposition")
async def matrix_decomposition(request: DecompositionRequest):
    """Perform matrix decomposition (LU, QR, SVD, Cholesky)"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        from services.linear_algebra_visualization import LinearAlgebraVisualization
        
        la_service = LinearAlgebraService()
        la_viz = LinearAlgebraVisualization()
        
        result = la_service.matrix_decomposition(request.matrix, request.method)
        
        # Add SVD visualization if method is SVD
        if request.method.lower() == 'svd':
            import numpy as np
            U = np.array(result['U'])
            S = np.array(result['singular_values'])
            Vt = np.array(result['Vt'])
            svd_viz = la_viz.visualize_svd(U, S, Vt)
            result['svd_visualization'] = svd_viz
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "decomposition",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/solve")
async def solve_linear_system(request: LinearSystemRequest):
    """Solve linear system Ax = b"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        
        la_service = LinearAlgebraService()
        result = la_service.solve_linear_system(request.A, request.b)
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "solve_system",
            "input": {
                "A": request.A,
                "b": request.b
            },
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/operations")
async def matrix_operations(request: MatrixOperationRequest):
    """Perform basic matrix operations"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        
        la_service = LinearAlgebraService()
        result = la_service.matrix_operations(
            request.operation,
            request.matrix_a,
            request.matrix_b,
            request.scalar
        )
        
        return {
            "success": True,
            "module": "linear_algebra",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/linear-algebra/rank")
async def matrix_rank(request: MatrixRequest):
    """Calculate matrix rank"""
    try:
        from services.linear_algebra_service import LinearAlgebraService
        
        la_service = LinearAlgebraService()
        result = la_service.matrix_rank(request.matrix)
        
        return {
            "success": True,
            "module": "linear_algebra",
            "operation": "rank",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============ INTEGRAL CALCULATOR ROUTES ============

@app.post("/api/integral/indefinite")
async def calculate_indefinite_integral(request: IndefiniteIntegralRequest):
    """Calculate indefinite integral ∫f(x)dx"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.calculate_indefinite_integral(request.function)
        
        return {
            "success": True,
            "module": "integral_calculator",
            "type": "indefinite",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/definite")
async def calculate_definite_integral(request: DefiniteIntegralRequest):
    """Calculate definite integral ∫[a,b]f(x)dx with visualization"""
    try:
        from services.integral_service import IntegralService
        from services.integral_visualization import IntegralVisualization
        
        integral_service = IntegralService()
        viz_service = IntegralVisualization()
        
        # Calculate integral
        result = integral_service.calculate_definite_integral(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        # Generate visualizations
        function_plot = viz_service.visualize_function(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        area_plot = viz_service.visualize_area_under_curve(
            request.function,
            request.lower_bound,
            request.upper_bound,
            result['numerical_value']
        )
        
        result['visualizations'] = {
            'function_plot': function_plot,
            'area_plot': area_plot
        }
        
        return {
            "success": True,
            "module": "integral_calculator",
            "type": "definite",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/area")
async def calculate_area_under_curve(request: DefiniteIntegralRequest):
    """Calculate area under curve"""
    try:
        from services.integral_service import IntegralService
        from services.integral_visualization import IntegralVisualization
        
        integral_service = IntegralService()
        viz_service = IntegralVisualization()
        
        result = integral_service.calculate_area_under_curve(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        # Add visualization
        area_plot = viz_service.visualize_area_under_curve(
            request.function,
            request.lower_bound,
            request.upper_bound,
            result['area']
        )
        
        result['visualization'] = area_plot
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/average-value")
async def calculate_average_value(request: DefiniteIntegralRequest):
    """Calculate average value of function over interval"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.calculate_average_value(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/arc-length")
async def calculate_arc_length(request: DefiniteIntegralRequest):
    """Calculate arc length of curve"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.calculate_arc_length(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/surface-area")
async def calculate_surface_area_revolution(request: VolumeRequest):
    """Calculate surface area of solid of revolution"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.calculate_surface_area_revolution(
            request.function,
            request.lower_bound,
            request.upper_bound,
            request.axis
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/steps")
async def get_integration_steps(request: IntegralStepsRequest):
    """Get step-by-step integration explanation"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.get_integration_steps(request.function)
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/riemann")
async def visualize_riemann_sum(request: DefiniteIntegralRequest):
    """Visualize Riemann sum approximation"""
    try:
        from services.integral_visualization import IntegralVisualization
        
        viz_service = IntegralVisualization()
        
        n_rectangles = 10  # Can be made a parameter
        riemann_plot = viz_service.visualize_riemann_sum(
            request.function,
            request.lower_bound,
            request.upper_bound,
            n_rectangles
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            "type": "riemann_sum",
            "visualization": riemann_plot,
            "n_rectangles": n_rectangles
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/visualize-3d")
async def visualize_3d_integral(request: DefiniteIntegralRequest):
    """Generate 3D visualization of integral"""
    try:
        from services.integral_visualization import IntegralVisualization
        
        viz_service = IntegralVisualization()
        plot_3d = viz_service.visualize_3d_integral(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            "visualization_3d": plot_3d
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/antiderivative-viz")
async def visualize_antiderivative(request: DefiniteIntegralRequest):
    """Visualize function and its antiderivative"""
    try:
        from services.integral_visualization import IntegralVisualization
        
        viz_service = IntegralVisualization()
        antideriv_plot = viz_service.visualize_antiderivative(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            "visualization": antideriv_plot
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/comparison")
async def compare_integration_methods(request: DefiniteIntegralRequest):
    """Compare different numerical integration methods"""
    try:
        from services.integral_visualization import IntegralVisualization
        
        viz_service = IntegralVisualization()
        comparison_plot = viz_service.create_comparison_plot(
            request.function,
            request.lower_bound,
            request.upper_bound
        )
        
        return {
            "success": True,
            "module": "integral_calculator",
            "visualization": comparison_plot
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/integral/validate")
async def validate_integral_function(request: IntegralStepsRequest):
    """Validate if function can be integrated"""
    try:
        from services.integral_service import IntegralService
        
        integral_service = IntegralService()
        result = integral_service.validate_function(request.function)
        
        return {
            "success": True,
            "module": "integral_calculator",
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)