import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./FormComponent.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import ChartComp from "./ChartComp";

import { useState, useEffect } from "react";

function FormComponent({ formTarget }) {
  const [timeRange, setTimeRange] = useState(0);
  const [timeUnit, setTimeUnit] = useState("s");
  const [errorTimeRange, setErrorTimeRange] = useState(0);
  const [errorTimeUnit, setErrorTimeUnit] = useState("s");
  const [btnValue, setBtnValue] = useState("Start Querying");
  const [multiplier, setMultiplier] = useState(-5);
  const [on, setOn] = useState(false);

  const [data, setData] = useState([
    [{ type: "string", label: "Time" }, "% of Failures", "Average Failure %"],
    [[new Date().toLocaleTimeString()], 0, 0],
  ]);

  useEffect(() => {
    if (on && multiplier > 0) {
      const timeout = setInterval(() => {
        // Code that executes every 'multiplier'seconds

        callBackend(timeRange + timeUnit, errorTimeRange + errorTimeUnit);
      }, multiplier);
      return () => clearInterval(timeout);
    }
  }, [multiplier, errorTimeRange, on, timeUnit, timeRange, errorTimeUnit]);

  // Call Backend function
  const callBackend = (queryFrequency, errorRange) => {
    console.log(queryFrequency, errorRange);
    // Use axios to call the backend.

    axios
      .get("http://localhost:4000/alert", {
        params: { queryFrequency: queryFrequency, errorRange: errorRange },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.alertStatus) {
          console.log("THERE IS AN ALERT");
          console.log(
            "failures: ",
            res.data.failures,
            "total: ",
            res.data.total,
            "percentage: ",
            res.data.percentage,
            "average Failures: ",
            res.data.averageErrors
          );
          alert("There is an anomalous reading");
        } else {
          console.log("No alert.");
        }

        // Updating the data array
        const percentage = res.data.percentage;
        const averagePercentage = res.data.averageErrors;
        let current = new Date();
        if (percentage != null) {
          // const timeOut = [
          //   current.getHours(),
          //   current.getMinutes(),
          //   current.getMilliseconds(),
          // ];
          current = current.toLocaleTimeString();

          setData((oldArray) => [
            ...oldArray,
            [current, percentage, averagePercentage],
          ]);
        }
      })
      .catch((err) => {
        // error found
        console.log(err);
      });
  };

  return (
    <div className="verticalClass horizontalClass justify-content-start">
      <Form className="d-flex flex-column justify-content-center align-items-center">
        <Row style={{ marginTop: "15px" }}>
          <Col style={{ fontWeight: "bold", fontSize: "15px" }}>
            Set the API query range:
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="Form-group d-flex justify-content-end">
              <Form.Control
                style={{ maxWidth: "60%" }}
                type="text"
                placeholder="0"
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                }}
              />
              {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3 Form-group justify-content-center">
              {/* <Form.Label style={{ color: "rgba(0, 0, 0, 0)" }}>Unit</Form.Label> */}
              <Form.Select
                style={{ maxWidth: "50%" }}
                value={timeUnit}
                onChange={(e) => {
                  setTimeUnit(e.target.value);
                }}
              >
                <option>ms</option>
                <option>s</option>
                <option>m</option>
                <option>h</option>
                <option>d</option>
                <option>w</option>
              </Form.Select>
              {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
            </Form.Group>
          </Col>
        </Row>
        {/*--------------------------- END OF API QUERY RANGE ---------------------------*/}
        <Row style={{ marginTop: "15px" }}>
          <Col style={{ fontWeight: "bold", fontSize: "15px" }}>
            Set the error query range:
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="Form-group d-flex justify-content-end">
              <Form.Control
                style={{ maxWidth: "60%" }}
                type="text"
                placeholder="0"
                value={errorTimeRange}
                onChange={(e) => {
                  setErrorTimeRange(e.target.value);
                }}
              />
              {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3 Form-group justify-content-center">
              {/* <Form.Label style={{ color: "rgba(0, 0, 0, 0)" }}>Unit</Form.Label> */}
              <Form.Select
                style={{ maxWidth: "50%" }}
                value={errorTimeUnit}
                onChange={(e) => {
                  setErrorTimeUnit(e.target.value);
                }}
              >
                <option>ms</option>
                <option>s</option>
                <option>m</option>
                <option>h</option>
                <option>d</option>
                <option>w</option>
              </Form.Select>
              {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "10px" }}
          onClick={(event) => {
            event.preventDefault();

            if (timeRange <= 0 || errorTimeRange <= 0) {
              alert("Invalid Query range.");
              setTimeRange(0);
              setErrorTimeRange(0);
              return;
            }

            if (timeUnit === "ms") {
              setMultiplier(1);
            } else if (timeUnit === "s") {
              setMultiplier(1000 * timeRange);
            } else if (timeUnit === "m") {
              setMultiplier(1000 * 60 * timeRange);
            } else if (timeUnit === "h") {
              setMultiplier(1000 * 60 * 60 * timeRange);
            } else if (timeUnit === "d") {
              setMultiplier(1000 * 60 * 60 * 24 * timeRange);
            } else if (timeUnit === "w") {
              setMultiplier(1000 * 60 * 60 * 24 * 7 * timeRange);
            }

            if (btnValue === "Start Querying") {
              setBtnValue("Stop Querying");
              setOn(true);
              console.log("Started Querying");
            } else {
              setBtnValue("Start Querying");
              setOn(false);
              setMultiplier(-5);
              console.log("Stopped Querying");
            }
          }}
        >
          {btnValue}
        </Button>
      </Form>
      <ChartComp data={data} />
    </div>
  );
}

export default FormComponent;
