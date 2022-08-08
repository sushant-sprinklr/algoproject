import "./App.css";
import FormComponent from "./components/FormComponent";
import NavbarComponent from "./components/NavbarComponent";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useState, useEffect } from "react";
let keyVal = 0;
function App() {
  const [forms, setForms] = useState([]);
  const [toRemove, setToRemove] = useState(false);
  const [currKey, setCurrKey] = useState(-1);

  useEffect(() => {
    if (toRemove) {
      setForms((products) =>
        products.filter((el, index) => {
          return el.key != currKey;
        })
      );
      setToRemove(false);
    }
  }, [toRemove, forms, currKey]);

  const addForm = () => {
    const newElement = (
      <Row className="d-flex justify-content-center" key={keyVal}>
        <FormComponent />
        <Button
          variant="danger"
          value={keyVal}
          style={{
            maxWidth: "180px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
          onClick={(props) => {
            const currentKey = props.target.getAttribute("value");
            setToRemove(true);
            setCurrKey(currentKey);
          }}
        >
          Remove Listener
        </Button>
        <hr style={{ color: "blue" }} />
      </Row>
    );
    keyVal++;
    setForms((oldArray) => [...oldArray, newElement]);
  };

  return (
    <div className="App d-flex flex-column justify-content-center">
      <NavbarComponent />
      <Container className="d-flex flex-column justify-content-center">
        <Row className="justify-content-center">
          {forms}
          <Button
            variant="primary"
            type="submit"
            style={{
              maxWidth: "120px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            onClick={(event) => {
              addForm();
              console.log("New listener added");
            }}
          >
            Add Listener
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default App;
