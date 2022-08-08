import Button from "react-bootstrap/esm/Button";
import FormComponent from "./FormComponent";
import Row from "react-bootstrap/esm/Row";
const AppRow = () => {
  return (
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
};

export default AppRow;
