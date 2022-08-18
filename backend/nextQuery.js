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
const queryFrequency = "-10s";
const errorRange = "-1d";

let map = new Map();
const dataQuery = `from(bucket:"testBucket") |> range(start: ${queryFrequency}) |> filter(fn: (r) => r._measurement == "measurement1")`;
let mapSize = 0;
let numErrors = 0;
function toCall() {
  // Getting data from the user
  console.log("being called");

  // Building dynamic queries

  numErrors = 0;
  mapSize = 0;

  map = new Map();

  queryApi.queryRows(dataQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      // console.log(o.http_status_code);
      mapSize++;
      if (!map.has(o.api_key)) {
        map.set(o.api_key, {
          totalCalls: 0,
          200: 0,
          204: 0,
          400: 0,
          401: 0,
          404: 0,
          430: 0,
          504: 0,
          exec_time_avg: 0,
        });
      }

      const status = o.http_status_code;

      const mapObject = map.get(o.api_key);

      mapObject.totalCalls += 1;

      const exec_time_var = parseFloat(o.total_request_exec_time);

      mapObject.exec_time_avg =
        (mapObject.exec_time_avg * (mapObject.totalCalls - 1) + exec_time_var) /
        mapObject.totalCalls;

      if (status == 200) {
        mapObject["200"] += 1;
      } else if (status == 204) {
        mapObject["204"] += 1;
      } else if (status == 400) {
        mapObject["400"] += 1;
      } else if (status == 401) {
        mapObject["401"] += 1;
      } else if (status == 404) {
        mapObject["404"] += 1;
      } else if (status == 430) {
        mapObject["430"] += 1;
      } else if (status == 504) {
        mapObject["504"] += 1;
      }

      map.set(o.api_key, mapObject);

      //   console.log(mapObject);
    },
    error(error) {
      console.error(error);
      console.log("\nFinished ERROR");
    },
    complete() {
      // Iterate through the map and compare it to the moving median (of percentages) of the values from errorBucket
      // Use measurement = api_key for this.
      // Compare with the past 1 day of this
      map.forEach((mapObject, api_key) => {
        // Iterator

        let tHundAvg = 0;
        let tHundFourAvg = 0;
        let fHundAvg = 0;
        let fHundOneAvg = 0;
        let fHundFourAvg = 0;
        let fHundThirtyAvg = 0;
        let fiveHundFourAvg = 0;
        let average_time = 0;

        let errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "tHund") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            tHundAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "tHundFour") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            tHundFourAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "fHund") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            fHundAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "fHundOne") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            fHundOneAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "fHundFour") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            fHundFourAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "fHundThirty") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            fHundThirtyAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "fiveHundFour") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            fiveHundFourAvg = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        errorQuery = `from(bucket: "errorBucket") |> range(start: ${errorRange}) |> filter(fn: (r) => r._measurement == "${api_key}" and r._field == "exec_time_avg") |> movingAverage(n: 20)`;

        queryApi.queryRows(errorQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            average_time = o._value;
          },
          error(error) {
            console.error(error);
            console.log("\nFinished ERROR");
          },
          complete() {},
        });

        let mapWritten = false;

        const tot = mapObject.totalCalls;
        failuresData = {
          api_key: api_key,
          total: mapObject.totalCalls,
          exec_time_error: mapObject.exec_time_avg > average_time,
          avg_past_exec_time: average_time,
          exec_time_avg: mapObject.exec_time_avg,
          tHundAvg: tHundAvg,
          tHundNumber: mapObject["200"],
          tHundFourError: mapObject["204"] / tot > tHundFourAvg,
          tHundFourAvg: tHundFourAvg,
          tHundFourNumber: mapObject["204"],
          fHundError: mapObject["400"] / tot > fHundAvg,
          fHundAvg: fHundAvg,
          fHundNumber: mapObject["400"],
          fHundOneError: mapObject["401"] / tot > fHundOneAvg,
          fHundOneAvg: fHundOneAvg,
          fHundOneNumber: mapObject["401"],
          fHundFourError: mapObject["404"] / tot > fHundFourAvg,
          fHundFourAvg: fHundFourAvg,
          fHundFourNumber: mapObject["404"],
          fHundThirtyError: mapObject["430"] / tot > fHundThirtyAvg,
          fHundThirtyAvg: fHundThirtyAvg,
          fHundThirtyNumber: mapObject["430"],
          fiveHundFourError: mapObject["504"] / tot > fiveHundFourAvg,
          fiveHundFourAvg: fiveHundFourAvg,
          fiveHundFourNumber: mapObject["504"],
        };

        // console.log(failuresData);

        // Writing to the errorQuery bucket.
        let point2 = new Point(api_key)
          .floatField("totalCalls", mapObject.totalCalls)
          .floatField("exec_time_avg", mapObject.exec_time_avg)
          .floatField("tHund", mapObject["200"] / mapObject.totalCalls)
          .floatField("tHundFour", mapObject["204"] / mapObject.totalCalls)
          .floatField("fHund", mapObject["400"] / mapObject.totalCalls)
          .floatField("fHundOne", mapObject["401"] / mapObject.totalCalls)
          .floatField("fHundfour", mapObject["404"] / mapObject.totalCalls)
          .floatField("fHundThirty", mapObject["430"] / mapObject.totalCalls)
          .floatField("fiveHundFour", mapObject["504"] / mapObject.totalCalls);
        errorWriteApi.writePoint(point2);
        errorWriteApi.flush();
        // console.log(point2);
        // console.log(failuresData, point2);

        if (failuresData.exec_time_error) {
          console.log("EXECUTING TIME ERROR", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.tHundFourError) {
          console.log("204 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.fHundError) {
          console.log("400 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.fHundOneError) {
          console.log("401 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.fHundFourError) {
          console.log("404 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.fHundThirtyError) {
          console.log("430 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
        if (failuresData.fiveHundFourError) {
          console.log("504 Error", failuresData.api_key);
          if (!mapWritten) {
            mapWritten = true;
            numErrors++;
          }
        }
      });
      console.log(numErrors, mapSize);
    },
  });
}

toCall();

// clearInterval(timerId);
setInterval(toCall, 10 * 1000);

// const sleep = (milliseconds) => {
//   const date = Date.now();
//   let currentDate = null;
//   do {
//     currentDate = Date.now();
//   } while (currentDate - date < milliseconds);
// };

app.listen(4000);
