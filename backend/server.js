const app = require("express")();
require("dotenv").config;
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token = process.env.INFLUXDB_TOKEN;
const url = process.env.SERVER_URL;
const client = new InfluxDB({ url, token });
let org = process.env.ORG_NAME;
let bucket = `testBucket`;

runQry = async () => {
  try {
    //
  } catch (err) {
    console.log(`Error is: ${err}`);
  }
};
