const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) => {
  sgMail.send({
    to:email,
    from:'taskmanager.shivangi@gmail.com',
    subject: 'Welcome to My Task Manager',
    text: 'Welcome to the app, ' + name + '!. Hope you enjoy using this application to manage your tasks.'
  }).then(() => {
    // Celebrate
  }).catch(error => {
    // Log friendly error
    console.error(error);

    if (error.response) {
      // Extract error msg
      const {message, code, response} = error;

      // Extract response msg
      const {headers, body} = response;

      console.error(body);
    }
  })
}

const sendCancelEmail = (email,name) => {
  sgMail.send({
    to:email,
    from:'taskmanager.shivangi@gmail.com',
    subject: 'Sad to see you go',
    text: 'Hi, ' + name + '! Hope you enjoyed using the application. Please reply to this email to let us know why you removed your account. Your feedback is very much appreciated! Feel free to join again.'
  }).then(() => {
    // Celebrate
  }).catch(error => {
    // Log friendly error
    console.error(error);

    if (error.response) {
      // Extract error msg
      const {message, code, response} = error;

      // Extract response msg
      const {headers, body} = response;

      console.error(body);
    }
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}

