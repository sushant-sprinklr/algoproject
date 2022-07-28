require("dotenv").config();
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = process.env.INFLUXDB_TOKEN;
const url = process.env.SERVER_URL;
// console.log(url);
const client = new InfluxDB({ url, token });
let org = process.env.ORG_NAME;
let bucket = `testBucket`;
let errorWriteApi = client.getWriteApi(org, "errorBucket", "ns");
const queryApi = client.getQueryApi(org); //Any bucket in the db can be queried from the same queryApi
const errorQuery =
  'from(bucket: "errorBucket") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "measurement1") |> mean()';

// queryApi
//   .queryRaw(errorQuery)
//   .then((result) => {
//     console.log(result);

//     const csv = result.split(",");
//     output = Number(csv[csv.length - 3]);
//     console.log(output);
//   })
//   .finally(() => {});

queryApi.queryRows(errorQuery, {
  next(row, tableMeta) {
    const o = tableMeta.toObject(row);
    // console.log(o._value);
  },
  error(error) {
    console.error(error);
    console.log("\nFinished ERROR");
  },
  complete() {
    console.log("First Query");
  },
});

// let point2 = new Point("measurement1").floatField("errors", 3000);
// errorWriteApi.writePoint(point2);
// errorWriteApi.flush();
// console.log(point2);
return;
