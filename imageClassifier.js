const fetch = require("node-fetch");
const { Readable } = require('stream');
const tf = require('@tensorflow/tfjs-node');
const PImage = require('pureimage')

module.exports = async ({ modelUrl, imageUrl }) => {
    const modelURL = `${modelUrl}model.json`;
    const response = await fetch(`${modelUrl}metadata.json`)
    const body = await response.text();
    const model = await tf.loadLayersModel(modelURL);
    model.classes = JSON.parse(body).labels;
    try {
        const data = await fetch(imageUrl);
        const contentType = data.headers.get("Content-Type");
        const buffer = await data.buffer();
        const stream = new Readable({
            read() {
                this.push(buffer)
                this.push(null);
            }
        });
        let imageBitmap;

        if ((/png/).test(contentType)) {
            imageBitmap = await PImage.decodePNGFromStream(stream);
        }

        if ((/jpe?g/).test(contentType)) {
            imageBitmap = await PImage.decodeJPEGFromStream(stream);
        }

        const prediction = tf.tidy(() => {
            let img = tf.browser.fromPixels(imageBitmap).toFloat();
            img = tf.image.resizeNearestNeighbor(img, [model.inputs[0].shape[1], model.inputs[0].shape[2]]);
            const offset = tf.scalar(127.5);
            const normalized = img.sub(offset).div(offset);
            const batched = normalized.reshape([1, model.inputs[0].shape[1], model.inputs[0].shape[2], model.inputs[0].shape[3]]);
            return model.predict(batched);
        });


        const values = await prediction.data();
        const topK = Math.min(model.classes.length, values.length);

        const valuesAndIndices = [];
        for (let i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }

        valuesAndIndices.sort((a, b) => {
            return b.value - a.value;
        });

        const topkValues = new Float32Array(topK);
        const topkIndices = new Int32Array(topK);
        for (let i = 0; i < topK; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }

        const predictions = []
        for (let i = 0; i < topkIndices.length; i++) {
            predictions.push({
                class: model.classes[topkIndices[i]],
                score: topkValues[i]
            });
        }
        return predictions;
    } catch (error) {
        console.log(error)
        return error
    }
}