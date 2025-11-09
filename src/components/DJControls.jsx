function DJControls() {
  return (
      <div>
          <div className="card shadow-sm mt-3">
              <div className="card-header py-2">
                <strong>p1 Track Control</strong>
              </div>
              <div className="card-body">
                  <div className="btn-group w-100" role="group" aria-label="p1 group">
                    <input type = "radio" className="btn-check" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked></input>
                      <label className="btn btn-outline-secondary" htmlFor="flexRadioDefault1">
                        p1: ON
                      </label>
                    <input type ="radio" className="btn-check" name="flexRadioDefault" id="flexRadioDefault2"></input>
                      <label className="btn btn-outline-secondary" htmlFor="flexRadioDefault2"> p1: HUSH </label>
                  </div>

              </div>
          </div>


      </div>
  );
}

export default DJControls;