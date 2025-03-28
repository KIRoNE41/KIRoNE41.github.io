const arrows_l = document.querySelectorAll(".arrow-l");
        const arrowArray_l = Array.from(arrows_l).reverse();
        const arrows_t = document.querySelectorAll(".arrow-t");
        const arrowArray_t = Array.from(arrows_t);
        const arrows_r = document.querySelectorAll(".arrow-r");
        const arrowArray_r = Array.from(arrows_r);
        const arrows_b = document.querySelectorAll(".arrow-b");
        const arrowArray_b = Array.from(arrows_b).reverse();

        const arrowArray = arrowArray_l.concat(arrowArray_t.concat(arrowArray_r.concat(arrowArray_b)));
        const sideArray = [arrowArray_l, arrowArray_t, arrowArray_r, arrowArray_b];

        // const URL = "https://teachablemachine.withgoogle.com/models/CWdZJLSFO/";
        // const URL = "https://teachablemachine.withgoogle.com/models/ClM8BVYcE/";
        const URL = "https://teachablemachine.withgoogle.com/models/ClM8BVYcE/";
        let isInhale = true;
        let indexs = 0;
        function arrowloop() {
            
            const square = document.querySelector(".square");
            arrowArray.forEach((arrow, index) => {
                setTimeout(() => {
                    indexs = index;
                    arrow.style.opacity = "1";
                    // console.log(index)
                    if (index % 4 === 0) {
                        sideArray.forEach((side) => {
                            side.forEach((arrows) => {
                                arrows.style.opacity = "0";
                                arrow.style.opacity = "1";
                            });
                        });
                    
                    }

                    
                }, index * 1000);
            });
        }

        function startLoop() {
            arrowloop();
            setInterval(arrowloop, (arrowArray.length) * 1000); // Repeat every time after the full cycle
        }

        init(); 
        
        
        async function createModel() {
            const checkpointURL = URL + "model.json"; // model topology
            const metadataURL = URL + "metadata.json"; // model metadata

            const recognizer = speechCommands.create(
                "BROWSER_FFT", 
                undefined, 
                checkpointURL,
                metadataURL
            );
            
            await recognizer.ensureModelLoaded();
            return recognizer;
        }

        async function init() {

            // const loader = document.getElementById('loader');
            const loading = document.getElementById("loading");
            const labelContainer = document.getElementById("label-container");
            const container = document.querySelector(".container");
            // loader.style.display = "block";
            loading.style.display = "block";
            container.style.display = "none";


            const recognizer = await createModel();
            
            const classLabels = recognizer.wordLabels();
            // loader.style.display = "none";
            loading.style.display = "none";
            container.style.display = "block";

            for (let i = 0; i < classLabels.length; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }

            recognizer.listen(result => {
                const scores = result.scores;
                for (let i = 0; i < classLabels.length; i++) {
                    const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                    labelContainer.childNodes[i].innerHTML = classPrediction;
                }

                // Change square color based on inhale/exhale
                const square = document.querySelector(".square");
                const squareText = document.querySelector(".square-text");
                console.log(indexs)

                if (!(indexs >= 4 && indexs < 8)){
                    squareText.style.color = "white"
                    if (result.scores[1] >= 0.7) {
                        square.style.backgroundColor = "red"; // Breathing out
                        squareText.textContent = "มีการหายใจออก";

                    } else if (result.scores[2] >= 0.7) {
                        square.style.backgroundColor = "green"; // Breathing in
                        squareText.textContent = "มีการหายใจเข้า";

                    }
                    else{
                        square.style.backgroundColor = "gray"; // Breathing out
                        squareText.textContent = "ไม่พบเจอ";

                    }
                }
                else{
                    square.style.backgroundColor = "orange"; // Breathing out
                    squareText.style.color = "black"
                    squareText.textContent = "กลั้นหายใจไว้!";

                }

                    // Toggle inhale/exhale for next cycle
                    isInhale = !isInhale;
            }, {
                includeSpectrogram: true,
                probabilityThreshold: 0.75,
                invokeCallbackOnNoiseAndUnknown: true,
                overlapFactor: 0.75
            });
        }
