import "./App.css";
import FormComponent from "./components/FormComponent";
import NavbarComponent from "./components/NavbarComponent";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useState } from "react";
function App() {
  const [forms, setForms] = useState([]);
  const addForm = () => {
    // add a form to the forms array.
    setForms((oldArray) => [
      ...oldArray,
      <Row>
        <FormComponent />
        <hr style={{ color: "blue" }} />
      </Row>,
    ]);
    console.log(forms);
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
              event.preventDefault();
              addForm();
              // call the function to add a form.
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
