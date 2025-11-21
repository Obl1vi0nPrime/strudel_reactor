let originalLog = null;
const logArray = [];

export default function console_monkey_patch() {
    if (originalLog) return;

    originalLog = console.log;

    console.log = function (...args) {
        const str = args.join(" ");

        // Detect Strudel hap logs
        if (str.startsWith("%c[hap] ")) {
            const clean = str.replace("%c[hap] ", "");
            logArray.push(clean);

            // keep last 100 logs
            if (logArray.length > 100) {
                logArray.shift();
            }

            const event = new CustomEvent("d3Data", { detail: [...logArray] });
            document.dispatchEvent(event);
        }

        // Always call the original console.log
        originalLog.apply(console, args);
    };
}

// used by D3Graph
export function getD3Data() {
    return [...logArray];
}

export function subscribe(eventName, listener) {
    document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName, listener) {
    document.removeEventListener(eventName, listener);
}
