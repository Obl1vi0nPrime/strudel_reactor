function ProcButtons() {
  return (
      <div className="btn-toolbar gap-2 flex-wrap">
          <div className="btn-group">
              <button id="process_play" className="btn btn-primary">
                  ▶ Proc &amp; Play
              </button>
              <button id="process" className="btn btn-outline-primary">
                  ⚙ Preprocess
              </button>
          </div>
      </div>
  );
}

export default ProcButtons;