const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey('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');

const sendCredentialsEmail = async (email, username, password) => {
  try {
    const msg = {
      to: "suvamswagatamp@gmail.com",
      from: 'suvampandar@gmail.com', // Replace with your own email address
      subject: 'Credentials for Login',
      text: `Hello ${username},\n\nYour login credentials are as follows:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease use these credentials to log in.\n\nBest regards,\nYour Application`,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error occurred while sending email:', error);
  }
};



module.exports = { sendCredentialsEmail };





//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