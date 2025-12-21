import { useState } from 'react'

/**
 * Test page untuk debug 3D visualization
 */
const DebugVisualization = () => {
  const [testHtml, setTestHtml] = useState(null)

  const generateTestVisualization = () => {
    // Simple test dengan Plotly 3D surface
    const testHTML = `
<div id="test-plot" style="width:100%;height:700px;"></div>
<script>
console.log('🔍 Test visualization script running');

// Check if Plotly is available
if (typeof Plotly !== 'undefined') {
  console.log('✅ Plotly is available');
  
  var data = [{
    type: 'surface',
    z: [[1,2,3,4,5],
         [2,3,4,5,6],
         [3,4,5,6,7],
         [4,5,6,7,8],
         [5,6,7,8,9]]
  }];
  
  var layout = {
    title: 'Test 3D Surface',
    scene: {
      xaxis: {title: 'X'},
      yaxis: {title: 'Y'},
      zaxis: {title: 'Z'}
    }
  };
  
  var testPlot = document.getElementById('test-plot');
  if (testPlot) {
    console.log('✅ Test plot container found');
    Plotly.newPlot('test-plot', data, layout);
    console.log('✅ Plotly chart created');
  } else {
    console.error('❌ Test plot container not found');
  }
} else {
  console.error('❌ Plotly is NOT available');
}
</script>
    `
    setTestHtml(testHTML)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug 3D Visualization</h1>
      
      <button 
        onClick={generateTestVisualization}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Generate Test Visualization
      </button>

      {testHtml && (
        <div style={{ marginTop: '30px' }}>
          <h2>Test Result:</h2>
          <div dangerouslySetInnerHTML={{ __html: testHtml }} />
          <p style={{ marginTop: '20px', color: '#666' }}>
            Lihat console browser untuk debug messages. Buka DevTools dengan F12.
          </p>
        </div>
      )}
    </div>
  )
}

export default DebugVisualization
