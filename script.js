import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

const URL = "https://teachablemachine.withgoogle.com/models/ClM8BVYcE/";

let isInhale = true;
let indexs = 0;

const arrows_l = document.querySelectorAll(".arrow-l");
const arrowArray_l = Array.from(arrows_l).reverse();
const arrows_t = document.querySelectorAll(".arrow-t");
const arrowArray_t = Array.from(arrows_t);
const arrows_r = document.querySelectorAll(".arrow-r");
const arrowArray_r = Array.from(arrows_r);
const arrows_b = document.querySelectorAll(".arrow-b");
const arrowArray_b = Array.from(arrows_b).reverse();

const arrowArray = arrowArray_l.concat(arrowArray_t, arrowArray_r, arrowArray_b);
const sideArray = [arrowArray_l, arrowArray_t, arrowArray_r, arrowArray_b];

function arrowloop() {
    arrowArray.forEach((arrow, index) => {
        setTimeout(() => {
            indexs = index;
            arrow.style.opacity = "1";
            if (index % 4 === 0) {
                sideArray.forEach(side => side.forEach(arrows => arrows.style.opacity = "0"));
                arrow.style.opacity = "1";
            }
        }, index * 1000);
    });
}

function startLoop() {
    arrowloop();
    setInterval(arrowloop, arrowArray.length * 1000);
}

async function createModel() {
    console.log("Loading model...");

    // โหลด Speech Commands API แบบไดนามิก
    const speech = await import("https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands");

    // ตรวจสอบว่ามีฟังก์ชัน create หรือไม่
    console.log("speechCommands.create:", speech.default.create);

    // ตรวจสอบว่า URL ถูกกำหนดค่าหรือไม่
    const URL = "https://teachablemachine.withgoogle.com/models/ClM8BVYcE/";  // เปลี่ยนเป็นลิงก์โมเดลของคุณ

    if (!URL) {
        console.error("❌ URL is not defined!");
        return;
    }

    // สร้างตัวจดจำเสียง
    const recognizer = speech.default.create("BROWSER_FFT", undefined, URL + "model.json", URL + "metadata.json");

    await recognizer.ensureModelLoaded();
    console.log("✅ Model loaded successfully!");

    return recognizer;
}



async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels();
    const labelContainer = document.getElementById("label-container");

    classLabels.forEach(() => labelContainer.appendChild(document.createElement("div")));

    recognizer.listen(result => {
        const square = document.querySelector(".square");
        const squareText = document.querySelector(".square-text");

        if (!(indexs >= 4 && indexs < 8)) {
            squareText.style.color = "white";
            if (result.scores[1] >= 0.7) {
                square.style.backgroundColor = "red";
                squareText.textContent = "Exhale Detect";
            } else if (result.scores[2] >= 0.7) {
                square.style.backgroundColor = "green";
                squareText.textContent = "Inhale Detect";
            } else {
                square.style.backgroundColor = "gray";
                squareText.textContent = "Cannot Detect";
            }
        } else {
            square.style.backgroundColor = "orange";
            squareText.style.color = "black";
            squareText.textContent = "Hold!";
        }

        isInhale = !isInhale;
    }, {
        includeSpectrogram: true,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.75
    });
}

init();
startLoop();
