function DJControls() {
  return (
      <div>
          <div className="form-check">
              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                  p1: ON
              </label>
          </div>
          
          <div className="form-check">
              <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                  p1: HUSH
              </label>
          </div>

          {/* Tempo control */}
          <div className="mb-3">
              <label htmlFor="tempo" className="form-label">Tempo (BPM)</label>
              <input
                  id="tempo"
                  type="number"
                  className="form-control"
                  defaultValue={120}
                  min={40}
                  max={220}
                  step={1}
              />
          </div>


      </div>
  );
}

export default DJControls;