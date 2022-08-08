import "./App.css";
import FormComponent from "./components/FormComponent";
import NavbarComponent from "./components/NavbarComponent";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { useState, useEffect } from "react";
function App() {
  const [forms, setForms] = useState([]);
  // const [toRemove, setToRemove] = useState(false);
  // const [currKey, setCurrKey] = useState(-1);

  const removeCurrListener = (currentKey) => {
    console.log("At this point, forms is: ", forms);
  };
  // useEffect(() => {
  //   if (toRemove && currKey > 0) {
  //     console.log("forms is: ", forms);
  //     let copy = forms;
  //     copy.splice(currKey, 1);
  //     setForms(copy);
  //     setToRemove(false);
  //     setCurrKey(-1);
  //     console.log("Updated arr is: ", copy);
  //     console.log("updated forms is: ", forms);
  //   }
  // }, [toRemove]);

  const addForm = () => {
    const newElement = (
      <Row className="d-flex justify-content-center" key={forms.length}>
        <FormComponent />
        <Button
          key={forms.length}
          variant="danger"
          type="submit"
          value={forms.length}
          style={{
            maxWidth: "180px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
          onClick={(props) => {
            props.preventDefault();
            const currentKey = props.target.getAttribute("value");
            // console.log("Current key is: ", currentKey);
            // console.log("before removing: ", forms);
            removeCurrListener(currentKey);
            // setCurrKey(currentKey);
            // setToRemove(true);

            // console.log(arr);
            // setForms((oldArray) => [oldArray.splice(currentKey, 1)]);
          }}
        >
          Remove Listener
        </Button>
        <hr style={{ color: "blue" }} />
      </Row>
    );

    // add a form to the forms array.
    // setForms((oldArr) => [...oldArr, newElement]);
    setForms((oldArray) => [...oldArray, newElement]);
    console.log("AFTER ADDING NEW ELEMENT: ", forms);
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
              // event.preventDefault();
              addForm();
              console.log("New listener added");
              const key = forms.length;
              console.log("key", key);
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
