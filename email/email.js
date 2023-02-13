const sgMail = require('@sendgrid/mail')
const SEND_GRID_API_KEY = "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"

sgMail.setApiKey(SEND_GRID_API_KEY)

//FUNCTION TO SEND USER WELCOME MAIL

const userWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: "juniorbuba4real@gmail.com",
        subject: "welcome to login_node",
        text: `Hello ${name}, you have successfully signed up and we thank you for that`
    })
}

//FUNCTION TO SEND GOODBYE MAIL

const userGoodbyeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: "juniorbuba4real@gmail.com",
        subject: "We hate to see you go",
        text: `Hello ${name}, you have successfully deleted your account`
    })
}

module.exports = { userWelcomeMail, userGoodbyeMail}