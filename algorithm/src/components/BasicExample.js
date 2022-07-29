import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./BasicExample.css";
import Row from "react-bootstrap/Row";
function BasicExample() {
  return (
    <Form className="d-flex flex-column justify-content-center  align-items-center">
      <Row>
        <Form.Group className="mb-3 Form-group" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            {/* We'll never share your email with anyone else. */}
          </Form.Text>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3 Form-group" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3 Form-group" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default BasicExample;
