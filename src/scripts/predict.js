'use strict';

const tf = require('@tensorflow/tfjs-node');

let trainData;
let epochs;
let lags;
let epochText;


const handlePredict = async (req, res) => {
    trainData = req.body.trainData
    epochs = req.body.epochs
    lags = req.body.lags

    prepareTrain()
      .then(data => {

        predict(lags, 1, data.model, data.split_seq_X)
        .then(predict => {
            console.log(`Predictions: ${predict}`);
            const tsdata = [];
            tsdata.push(trainData);
            tsdata.push({
              X: trainData.X,
              y: predict.predictions,
              X_label: "test",
              y_label: "test2"
            });

            return res
                .status(200)
                .json(
                {
                    "predData": tsdata,
                    "lastEpoch": epochText,
                    "status": `Done Prediction`
                }
            );
          })
      });

};
  

const prepareTrain = event => {
  return new Promise(resolve => {
      split_sequences(trainData.y, lags).then(d => {
        const split_seq_X = d.seq_x;
        const split_seq_y = d.seq_y;

        console.log(split_seq_X)

        train(
            lags,
            epochs,
            1,
            split_seq_X,
            split_seq_y
        ).then(model => {
            console.log(`Done Training...`);
            resolve({model, split_seq_X, split_seq_y});
        });
      });
  });
};


const split_sequences = (sequence, n_steps) => {
  return new Promise(resolve => {
    let seq_x = [];
    let seq_y = [];

    for (let i = 0; i < sequence.length; i++) {
      let end_ix = i + n_steps;
      //console.debug(` i: ${i} end_ix:${end_ix}`);
      if (end_ix > sequence.length) break;
      seq_x.push(sequence.slice(i, end_ix));
      seq_y.push(sequence[end_ix - 1]);
    }

    resolve({ seq_x, seq_y });
  });
};


const train = async (
  n_steps,
  epochs,
  n_features,
  seq_x,
  seq_y
) => {
  let ten_X = tf.tensor2d(seq_x, [seq_x.length, n_steps]);
  let ten_y = tf.tensor1d(seq_y);

  let model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 50,
      activation: "relu",
      inputShape: [n_steps, n_features]
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"]
  });
  ten_X = ten_X.reshape([ten_X.shape[0], n_steps, n_features]);

  await model.fit(ten_X, ten_y, {
    epochs: epochs,
    onEpochEnd: async (epoch, log) => {
      epochText = `Epoch: ${epoch + 1} Loss:${logs.loss}}`
      console.log(epochText);
      callback(epoch, log);
    }
  });

  return new Promise(resolve => {
    resolve(model);
  });
};


/////////////////////////
const predict = (n_steps, n_features, model, seq_x) => {
  return new Promise(resolve => {
      let ten_X = tf.tensor2d(seq_x, [seq_x.length, n_steps]);
      ten_X = ten_X.reshape([ten_X.shape[0], n_steps, n_features]);
      let predictions = [];
      let count = 0;

      predictions = seq_x.map(date => {
          let predicted = model.predict(ten_X.slice(count, 1));
          count++;

          return predicted.dataSync()[0];
      });

      resolve({ predictions: predictions });
  });
};


module.exports = {
  handlePredict
};
