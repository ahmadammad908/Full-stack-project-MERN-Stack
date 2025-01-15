import {VERIFICATION_EMAIL_TEMPLATE,  PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "../mail/emailTemplates.js"
import {mailtrapClient, sender} from '../mail/mailtrap.config.js'

export const sendVerificationEmail  = async (email,verificationToken) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully", response)
    } catch (error) {
        console.error(`Error sending verification`, error)
        throw new Error (`Error sending Verification email: ${error}`)
        
    }
}

///Send WelcomeEmail

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            template_uuid:"e4e5cdf5-d1a8-4934-bad8-39208c2b72ec",
            template_variables: {
				company_info_name: "Auth Company",
				name: name,
			},
        });

        console.log("Welcome Email sent  successfully", response)
    } catch (error) {
        
    }
}
export const sendPasswordResetEmail = async (email,resetURL) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject:"Reset your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category:"Password reset"
        })
        console.log(response)
    } catch (error) {
        throw new Error(`Error sending password reset email: ${error}`);
        
    }
}
export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
        
    }
}