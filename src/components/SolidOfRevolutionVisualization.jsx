import { useState, useEffect, useRef } from 'react'
import { get3DVisualization } from '../services/api'
import '../styles/calculators.css'

/**
 * Komponen untuk menampilkan 3D Visualization dari solid of revolution
 */
const SolidOfRevolutionVisualization = () => {
  const [function_, setFunction] = useState('sqrt(x)')
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(4)
  const [visualization, setVisualization] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [volume, setVolume] = useState(null)
  const containerRef = useRef(null)

  const handleDownload = () => {
    if (window.Plotly && containerRef.current) {
      const plotElement = containerRef.current.querySelector('.plotly-plot-container')
      if (plotElement) {
        window.Plotly.downloadImage(plotElement, {
          format: 'png',
          width: 1200,
          height: 800,
          filename: `solid_of_revolution_${Date.now()}`
        })
      }
    }
  }

  const handleVisualize = async () => {
    if (!function_.trim()) {
      setError('Function tidak boleh kosong')
      return
    }

    if (upperBound <= lowerBound) {
      setError('Upper bound harus lebih besar dari lower bound')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 Requesting 3D visualization for:', { function_, lowerBound, upperBound })
      const response = await get3DVisualization(function_, lowerBound, upperBound)

      console.log('📦 API Response:', response)
      console.log('📦 Response type:', typeof response)
      console.log('📦 Response keys:', Object.keys(response))

      // API mengembalikan Plotly JSON langsung atau dengan struktur
      let vizData = null
      let volumeValue = null

      // Check berbagai kemungkinan struktur response
      if (response.data && response.layout) {
        // Response adalah Plotly JSON langsung
        console.log('✅ Response adalah Plotly JSON langsung')
        vizData = response
        volumeValue = response.volume || response.vol || null
      } else if (response.visualization_3d && typeof response.visualization_3d === 'object' && response.visualization_3d.data) {
        // Response memiliki visualization_3d dengan Plotly JSON object
        console.log('✅ Response memiliki visualization_3d (object)')
        vizData = response.visualization_3d
        volumeValue = response.volume || null
      } else if (response.plot_3d) {
        // Response memiliki plot_3d - bisa string atau object
        console.log('🔄 Processing plot_3d field...')
        console.log('📋 plot_3d type:', typeof response.plot_3d)
        
        if (typeof response.plot_3d === 'string') {
          // JSON string - parse it
          try {
            console.log('🔄 Parsing plot_3d from JSON string...')
            vizData = JSON.parse(response.plot_3d)
            console.log('✅ Successfully parsed plot_3d JSON string')
          } catch (parseErr) {
            console.error('❌ Failed to parse plot_3d string:', parseErr)
            // Try as HTML
            vizData = response.plot_3d
            console.log('⚠️ Treating plot_3d as HTML string instead')
          }
        } else if (typeof response.plot_3d === 'object' && response.plot_3d.data) {
          // Already parsed object
          console.log('✅ plot_3d is already an object')
          vizData = response.plot_3d
        }
        
        // Handle volume field names (backend sends volume_numerical)
        volumeValue = response.volume_numerical || response.volume || null
        console.log('📊 Volume value:', volumeValue)
      } else if (response.visualization_3d && typeof response.visualization_3d === 'string') {
        // Response memiliki HTML string
        console.log('✅ Response adalah HTML string')
        vizData = response.visualization_3d
        volumeValue = response.volume || null
      }

      if (vizData) {
        console.log('✅ Setting visualization data')
        setVisualization(vizData)
        setVolume(volumeValue)
        setError(null)
      } else {
        console.error('❌ Tidak bisa extract visualization dari response')
        console.error('Response structure:', JSON.stringify(response, null, 2))
        setError('Gagal membuat visualisasi 3D: Format response tidak dikenali')
      }
    } catch (err) {
      console.error('❌ Error:', err)
      setError('Error: ' + err.message)
      setVisualization(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example) => {
    setFunction(example)
  }

  // Effect untuk ensure Plotly library ter-load
  useEffect(() => {
    // Check if Plotly already loaded
    if (window.Plotly) {
      console.log('✅ Plotly library already loaded')
      return
    }

    // Load Plotly dari CDN jika belum ter-load
    console.log('⏳ Plotly library not found, loading from CDN...')
    const script = document.createElement('script')
    script.src = 'https://cdn.plot.ly/plotly-2.26.0.min.js'
    script.async = true
    script.onload = () => {
      console.log('✅ Plotly library loaded successfully from CDN')
      window.Plotly_Loaded = true
    }
    script.onerror = () => {
      console.error('❌ Failed to load Plotly from CDN')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [])

  // Effect untuk render Plotly setelah data berubah
  useEffect(() => {
    if (visualization && containerRef.current) {
      console.log('🎨 Rendering Plotly visualization...')
      
      try {
        let plotData = visualization
        
        // Jika visualization adalah string, parse JSON
        if (typeof visualization === 'string') {
          try {
            plotData = JSON.parse(visualization)
            console.log('✅ Parsed visualization from JSON string')
          } catch (parseErr) {
            console.warn('⚠️ Could not parse visualization as JSON, assuming HTML string')
            containerRef.current.innerHTML = visualization
            return
          }
        }

        // Check if visualization is JSON object dengan data dan layout
        if (typeof plotData === 'object' && plotData.data && plotData.layout) {
          console.log('✅ Visualization is valid Plotly JSON object')
          
          // Configure layout untuk better rendering
          const layout = {
            ...plotData.layout,
            autosize: true,
            margin: { l: 0, r: 0, t: 40, b: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: '#f8f9fa',
            scene: {
              ...plotData.layout.scene,
              xaxis: { 
                ...plotData.layout.scene?.xaxis, 
                autorange: true 
              },
              yaxis: { 
                ...plotData.layout.scene?.yaxis, 
                autorange: true 
              },
              zaxis: { 
                ...plotData.layout.scene?.zaxis, 
                autorange: true 
              },
            }
          }

          // Render dengan Plotly
          if (window.Plotly) {
            console.log('✅ window.Plotly is available, rendering...')
            const plotElement = containerRef.current.querySelector('.plotly-plot-container')
            if (plotElement) {
              try {
                window.Plotly.newPlot(plotElement, plotData.data, layout, {
                  responsive: true,
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                  staticPlot: false,
                  toImageButtonOptions: {
                    format: 'png',
                    filename: `solid_of_revolution_${Date.now()}`,
                    height: 800,
                    width: 1200,
                    scale: 2
                  }
                })

                // Force proper sizing
                plotElement.style.width = '100%'
                plotElement.style.height = '100%'
                plotElement.style.touchAction = 'manipulation'

                console.log('✅ Plotly rendered successfully')
              } catch (renderErr) {
                console.error('❌ Error rendering Plotly:', renderErr)
                setError(`Rendering error: ${renderErr.message}`)
              }
            } else {
              console.error('❌ Plot container element not found')
              setError('Plot container not found')
            }
          } else {
            console.warn('⚠️ Plotly library tidak ditemukan di window')
            console.warn('⚠️ Mencoba load ulang Plotly...')
            
            // Try loading Plotly one more time
            const script = document.createElement('script')
            script.src = 'https://cdn.plot.ly/plotly-2.26.0.min.js'
            script.async = true
            script.onload = () => {
              console.log('✅ Plotly re-loaded, attempting to render...')
              if (window.Plotly && containerRef.current) {
                const plotElement = containerRef.current.querySelector('.plotly-plot-container')
                if (plotElement) {
                  window.Plotly.newPlot(plotElement, plotData.data, layout, {
                    responsive: true,
                    displayModeBar: true,
                  })
                }
              }
            }
            document.head.appendChild(script)
            setError('⚠️ Plotly library sedang di-load, silakan tunggu...')
          }
        } else {
          console.error('❌ Data bukan Plotly JSON format')
          console.error('Visualization data:', visualization)
          setError('Format data tidak dikenali. Expected: {data: [...], layout: {...}}')
        }
      } catch (err) {
        console.error('❌ Rendering error:', err)
        setError(`Rendering error: ${err.message}`)
      }
    }
  }, [visualization])

  return (
    <div className="calculator-section">
      <h2>Visualisasi 3D - Solid of Revolution</h2>
      <p className="section-description">
        Lihat visualisasi 3D dari solid yang terbentuk ketika kurva f(x) diputar mengelilingi sumbu x.
        Gunakan mouse untuk merotasi, scroll untuk zoom, dan klik-drag untuk pan.
      </p>

      <div className="calculator-input-group">
        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="3d-function">Fungsi:</label>
            <input
              id="3d-function"
              type="text"
              value={function_}
              onChange={(e) => setFunction(e.target.value)}
              placeholder="Contoh: sqrt(x), x**2, sin(x)"
              className="input-field"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-field-group">
            <label htmlFor="3d-lower">Batas Bawah (a):</label>
            <input
              id="3d-lower"
              type="number"
              value={lowerBound}
              onChange={(e) => setLowerBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
          <div className="input-field-group">
            <label htmlFor="3d-upper">Batas Atas (b):</label>
            <input
              id="3d-upper"
              type="number"
              value={upperBound}
              onChange={(e) => setUpperBound(parseFloat(e.target.value))}
              className="input-field"
              step="0.1"
            />
          </div>
        </div>

        <button onClick={handleVisualize} disabled={loading} className="btn btn-primary">
          {loading ? 'Membuat Visualisasi...' : 'Tampilkan 3D'}
        </button>
      </div>

      {/* Contoh fungsi */}
      <div className="examples">
        <p className="label-small">Contoh fungsi:</p>
        <div className="example-buttons">
          <button onClick={() => handleExampleClick('sqrt(x)')} className="btn-example">
            √x
          </button>
          <button onClick={() => handleExampleClick('x')} className="btn-example">
            x
          </button>
          <button onClick={() => handleExampleClick('sin(x)')} className="btn-example">
            sin(x)
          </button>
          <button onClick={() => handleExampleClick('exp(-x)')} className="btn-example">
            e⁻ˣ
          </button>
          <button onClick={() => handleExampleClick('1/(x+1)')} className="btn-example">
            1/(x+1)
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* 3D Visualization */}
      {visualization && (
        <div className="visualization-container">
          <div className="visualization-header">
            <div className="visualization-info">
              <p>
                <strong>Fungsi:</strong> f(x) = {function_}
                <br />
                <strong>Sumbu Rotasi:</strong> Sumbu X
                <br />
                <strong>Interval:</strong> [{lowerBound}, {upperBound}]
                {volume !== null && (
                  <>
                    <br />
                    <strong>Volume:</strong> {typeof volume === 'number' ? volume.toFixed(4) : volume}
                  </>
                )}
              </p>
            </div>
            <button 
              className="download-btn" 
              onClick={handleDownload}
              title="Download plot 3D sebagai PNG"
            >
              📥 Download PNG
            </button>
          </div>

          <div className="plot-3d-wrapper" ref={containerRef}>
            <div 
              className="plotly-plot-wrapper"
              style={{ width: '100%', minHeight: '600px' }}
            >
              <div className="plotly-plot-container" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
          
          <div className="visualization-tips">
            <h4>💡 Tips Navigasi:</h4>
            <ul>
              <li><strong>Rotasi:</strong> Klik dan drag dengan mouse</li>
              <li><strong>Zoom:</strong> Gunakan scroll mouse</li>
              <li><strong>Pan:</strong> Klik-drag sambil menekan Shift</li>
              <li><strong>Reset:</strong> Klik double untuk reset tampilan</li>
              <li><strong>Download:</strong> Klik tombol "Download PNG" di atas atau gunakan menu chart</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SolidOfRevolutionVisualization
