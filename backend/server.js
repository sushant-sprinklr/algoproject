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

// let point2 = new Point("measurement1").floatField("errors", 3000);
// errorWriteApi.writePoint(point2);
// errorWriteApi.flush();
// console.log(point2);
// return;

const queryApi = client.getQueryApi(org); //Any bucket in the db can be queried from the same queryApi

const dataQuery =
  'from(bucket:"testBucket") |> range(start: -10s) |> filter(fn: (r) => r._measurement == "measurement1")';

const errorQuery =
  'from(bucket: "errorBucket") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "measurement1") |> mean()';

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
        if (toCompare && numFailures > output) {
          console.log("ALERTING");
        }
        let point2 = new Point("measurement1").floatField(
          "errors",
          numFailures
        );
        errorWriteApi.writePoint(point2);
        errorWriteApi.flush();
        console.log(point2);
        numFailures = 0;
        toCompare = true;
        total = 0;
      },
    });
  },
});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

