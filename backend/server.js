require("dotenv").config();
const assert = require("assert");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = process.env.INFLUXDB_TOKEN;
const url = process.env.SERVER_URL;
// console.log(url);
const client = new InfluxDB({ url, token });
let org = process.env.ORG_NAME;
let bucket = `testBucket`;
let errorWriteApi = client.getWriteApi(org, "errorBucket", "ns");

// Configuring the app
const express = require("express");
const app = express();
const cors = require("cors");

const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const queryApi = client.getQueryApi(org); //Any bucket in the db can be queried from the same queryApi

app.get("/alert", (req, res) => {
  // Getting data from the user
  console.log("request is: ", req.query);
  const queryFrequency = "-" + req.query.queryFrequency;
  const errorRange = "-" + req.query.errorRange;
  const measureName = req.query.queryFrequency;

  console.log("here: ", queryFrequency, errorRange);

  // Building dynamic queries

  const dataQuery = `from(bucket:"testBucket") |> range(start: ${queryFrequency}) |> filter(fn: (r) => r._measurement == "measurement1")`;

  const errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${measureName}") |> mean()`;

  let numFailures = 0;
  let total = 0;

  queryApi.queryRows(dataQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      // console.log(o.http_status_code);
      total++;
      if (o.http_status_code == 200) {
      } else {
        numFailures++;
      }
    },
    error(error) {
      console.error(error);
      console.log("\nFinished ERROR");
    },
    complete() {
      let toCompare = true;
      console.log("First Query", numFailures, total);
      // FIRST QUERY COMPLETED
      let output = 5;
      let percentage = 0;
      if (total != 0) {
        percentage = (100 * numFailures) / total;
      }
      queryApi.queryRows(errorQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          if (output == null) {
            toCompare = false;
          } else {
            output = o._value;
          }
        },
        error(error) {
          console.error(error);
          console.log("\nFinished ERROR");
        },
        complete() {
          alertStatus = false;
          console.log("percentage and output are: ", percentage, output);
          if (toCompare && percentage > output) {
            console.log("ALERTING");
            alertStatus = true;
          }
          if (total != 0) {
            let point2 = new Point(measureName).floatField(
              "errors",
              percentage
            );
            errorWriteApi.writePoint(point2);
            errorWriteApi.flush();
            console.log(point2);
          } else {
            console.log("not written");
          }

          res.json({
            alertStatus: alertStatus,
            failures: numFailures,
            total: total,
            percentage: percentage,
          });
          numFailures = 0;
          toCompare = true;
          total = 0;
          percentage = 0;
        },
      });
    },
  });
});

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

// app.get("/measure", (req, res) => {
//   //
//   const measureName = req.body.measureName.toString();
//   console.log(measureName);
//   const errorQuery = `from(bucket: "errorBucket") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "${measureName}")`;
//   queryApi.queryRows(errorQuery, {
//     next(row, tableMeta) {
//       const o = tableMeta.toObject(row);
//       console.log(o);
//     },
//     error(error) {
//       console.error(error);
//       console.log("\nFinished ERROR");
//       res.json({ success: "false" });
//     },
//     complete() {
//       res.json({ success: "true" });
//     },
//   });
// });

// const measurementCheck = (measureName) => {

// };

app.listen(4000);
