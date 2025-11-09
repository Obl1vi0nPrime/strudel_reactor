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
import D3Graph from './components/D3Graph';
import SoundControls from './components/SoundControls';
import 'bootstrap/dist/css/bootstrap.min.css';
let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function SetupButtons() {

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
}



export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

// WORK IN PROGRESS FOR SOUNDCONTROLS FEATURE IMPLEMENT^n
export function Proc() {

    
    // Get raw text from the textarea 
    var textarea = document.getElementById('proc');
    var raw = '';
    if (textarea) {
        raw = textarea.value;
    }

    // Control elements 
    const tempoInput = document.getElementById('tempo');
    const reverbCheck = document.getElementById('reverb_on');
    const gainSlider = document.getElementById('master_gain');
    const radioHush = document.getElementById('flexRadioDefault2');

    var tempo = 140; //default val for now
    if (tempoInput && tempoInput.value !== '') {
        tempo = Number(tempoInput.value);
    }

    var reverbChecked = false;
    if (reverbCheck && reverbCheck.checked) {
        reverbChecked = true;
    }

    var masterGain = 1.0;
    if (gainSlider && gainSlider.value !== ' ') {
        masterGain = Number(gainSlider.value);
    }

    var out = raw; // Copy and replace tags.

    // Replace the <tempo_bpm>
    out = out.replaceAll('<tempo_bpm>', String(tempo));

    // Replace the <reverb_on>
    var reverbText = '';
    if (reverbChecked) {
        reverbText = '.room(0.35)'; 
    }
    out = out.replaceAll('<reverb_on>', reverbText);

    // Replace the <master_gain>
    out = out.replaceAll('<master_gain>', String(masterGain.toFixed(2)));

    // Replace the <p1_radio> old placeholder
    if (out.includes('<p1_Radio>')) {
        var replaceValue = '';
        if (radioHush && radioHush.checked) {
            replaceValue = '_';
        }
        out = out.replaceAll('<p1_Radio>', replaceValue);
    }

    // To check for missing placeholders
    const leftover = out.match(/<(p1_Radio|tempo_bpm|reverb_on|master_gain)>/);
    if (leftover) {
        console.error('Leftover tag not replaced:', leftover[0]);
        alert('Unreplaced tag found: ' + leftover[0] + '\nClick Preprocess again or fix spelling/placement.');
        return;
    }


    //
    console.log('Processed Code: \n', out);
    if (globalEditor) {
        globalEditor.setCode(out);
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
        <nav className="navbar navbar-dark bg-dark justify-content-center mb-4">
            <span className="navbar-brand mb-0 h1 text-light">🎵 Strudel Demo 🎵</span>
        </nav>
        <main>

            <div className="container-fluid">
                <div className="row">
                    <D3Graph></D3Graph>
                    <PreProcessContentArea></PreProcessContentArea>
                    <div className="col-md-4">

                        <nav>
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
                        <SoundControls></SoundControls>
                    </div>
                </div>
            </div>
            <canvas id="roll"></canvas>
        </main >
    </div >
);


}