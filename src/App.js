import './App.css';
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DJControls from './components/DJControls';
import PlayButtons from './components/PlayButtons';
import ProcButtons from './components/ProcButtons';
import PreProcessContentArea from './components/PreProcessContentArea';
let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function SetupButtons() {

    const on = (id, ev, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(ev, fn);
    };

    on('play', 'click', () => globalEditor && globalEditor.evaluate());
    on('stop', 'click', () => globalEditor && globalEditor.stop());
    on('process', 'click', () => Proc());
    on('process_play', 'click', () => {
        Proc();
        globalEditor && globalEditor.evaluate();
    });


    /*
    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => {
        Proc()
    }
    )
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    }
    )
    */
}



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

// Simplyfying the processor, replaces <p1_radio> using our radio buttons
export function Proc() {

    const textArea = document.getElementById('proc');
    if (!textArea) {
        return;
    }

    const raw = textArea.value || "";

    // Check if HUSH is selected
    const hushChecked = document.getElementById('flexRadioDefault2')?.checked;
    const p1 = hushChecked ? "_" : ""; // hush -> "_" | on -> "";

    // Replace all <p1_Radio tags in text
    //const replaced = raw.replaceAll("<p1_Radio>", p1);

    
    /*
    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
    */

    const tempoEl = document.getElementById('tempo');
    const tempo = Number(tempoEl?.value) > 0 ? Number(tempoEl.value) : 120;
    const replaced = raw
        .replaceAll("<p1_Radio>", p1)
        .replaceAll("<tempo_bpm>", String(tempo));

    // send replaced code to strudel editor 
    if (globalEditor) {
        globalEditor.setCode(replaced);
    }
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

export default function StrudelDemo() {

const hasRun = useRef(false);

useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
        document.getElementById('proc').value = stranger_tune
        SetupButtons()
        Proc()
    }

}, []);


return (
    <div>
        <h2>Strudel Demo</h2>
        <main>

            <div className="container-fluid">
                <div className="row">

                    <PreProcessContentArea></PreProcessContentArea>
                    <div className="col-md-4">

                        <nav>
                            {/* add tempo input just above buttons */}
                            <div className="mb-3">
                                <label htmlFor="tempo" className="form-label">Tempo (BPM):</label>
                                <input
                                    id="tempo"
                                    type="number"
                                    className="form-control"
                                    defaultValue={120}
                                    min={40}
                                    max={200}
                                />
                            </div>
                            <ProcButtons></ProcButtons>
                            <br />
                            <PlayButtons></PlayButtons>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                        <div id="editor" />
                        <div id="output" />
                    </div>
                 
                    <div className="col-md-4">
                        <DJControls></DJControls>
                    </div>
                </div>
            </div>
            <canvas id="roll"></canvas>
        </main >
    </div >
);


}