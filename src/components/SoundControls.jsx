function SoundControls() {
    return (

        <div className="card shadow-sm mt-3">

            <div className="card-header py-2">
                <strong>Sound Controls</strong>
            </div>

            <div className="card-body">

                {/* Tempo (BPM) */}

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

                    <div className="form-text">
                        To replace <code>&lt;tempo_bpm&gt;</code> (e.g. <code>setcps(&lt;tempo_bpm&gt;/60/4)</code>)
                    </div>

                </div>

                {/* Reverb ON/OFF */}

                <div className="form-check mb-3">

                    <input className="form-check-input" type="checkbox" id="reverb_on" />

                    <label className="form-check-label" htmlFor="reverb_on">
                        Reverb ON
                    </label>

                    <div className="form-text">
                        If checked, <code>&lt;reverb_on&gt;</code> becomes <code> room 0.35</code>
                    </div>

                </div>

                {/* Master Gain */}

                <div className="mb-1">

                    <label htmlFor="master_gain" className="form-label">
                        Master Gain: <span id="master_gain_label">1.0</span>
                    </label>

                    <input 
                        id="master_gain"
                        type="range"
                        className="form-range"
                        defaultValue={1.0}
                        min={0}
                        max={2}
                        step={0.05}
                        onInput={(e) => {
                            const lab = document.getElementById('master_gain_label');
                            if (lab) lab.textContent = String(Number(e.target.value).toFixed(2));
                        }}
                    />

                    <div className="form-text">
                        Use as <code> gain &lt;master_gain&gt;</code>
                    </div>

                </div>

            </div>

        </div>
    );
}
export default SoundControls;
