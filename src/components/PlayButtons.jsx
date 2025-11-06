function PlayButtons() {
    return (
      <div className = "btn-group mt-2">
            <button id="play" className="btn btn-outline-success"> ▶ Play</button>
            <button id="stop" className="btn btn-outline-danger"> ■ Stop</button>
      </div>
  );
}

export default PlayButtons;