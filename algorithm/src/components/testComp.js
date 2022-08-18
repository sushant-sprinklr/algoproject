import emailjs from "emailjs-com";
const emailID = "sushant.guha@sprinklr.com";

const testEmail = () => {
  emailjs
    .sendForm(
      "service_9p7nvto",
      "template_dzpn8cg",
      { emailID: emailID },
      "GlBHyRPWZz4sUcRAm"
    )
    .then(
      (result) => {
        console.log(result.text);
        console.log("SENT THE SHIT");
      },
      (error) => {
        console.log(error.text);
      }
    );
};
