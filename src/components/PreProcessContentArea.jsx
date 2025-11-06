function PreProcessContentArea() {
  return (
      <div className="col-md-8">
          <div className="card shadow-sm mb-3">
              <div className="card-header d-flex justify-content-between align-items-center py-2">
                  <strong>Text to preprocess</strong>
                  <span className="text-muted small">Placeholders: &lt;p1_Radio&gt;</span>
              </div>

              <div className="card-body p-0">
                  <div className="form-floating">
                      <textarea
                          id="proc"
                          className="form-control border-0 rounded-0"
                          style={{ height: '46vh', fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}
                          placeholder="Write Strudel code here…"
                      />
                      <label htmlFor="proc">Write Strudel code here…</label>
                  </div>
              </div>

              <div className="card-footer py-2">
                  <small className="text-muted">
                      Toggle <code>p1: ON/HUSH</code> on the right, then click <b>Preprocess</b>.
                  </small>
              </div>
          </div>
      </div>
  );
}

export default PreProcessContentArea;