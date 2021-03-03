const sendAcceptedAsTeamMemberMail = function(details) {
    return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
 
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Ideathon 2020</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        a {
            text-decoration: none;
        }
    </style>
</head>
 
<body style="margin: 0; padding: 0; background-color: #3635C1; color: #ffffff">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 10px 0 30px 0">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                    style="border-collapse: collapse">
                    <tr>
                        <td align="center" bgcolor="#70bbd9" style="
                                    color: #ffffff;
                                    font-size: 28px;
                                    font-weight: bold;
                                    font-family: Roboto, sans-serif;
                                ">
                                <a href="https://ideathon.dscvit.com">
                                <img src="https://i.ibb.co/4FLj3Db/banner-1.png" alt="Ideathon 2020" width="100%"
                                height="130" style="display: block" />
                                </a>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#3635C1" style="padding: 40px 30px 40px 30px; color: #ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="
                                                color: #fea1be;
                                                font-family: Roboto, sans-serif;
                                                font-size: 24px;
                                                padding: 20px 0 15px 0;
                                                text-decoration: underline;
                                                text-decoration-color: #fea1be;
                                            ">
                                        <b>Team join acceptance request</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="260" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td style="
                                                                        color: #ffffff;
                                                                        font-family: Roboto, sans-serif;
                                                                        font-size: 15px;
                                                                        line-height: 20px;
                                                                    ">
                                                                  
                                                                <p style="color: #ffffff">Hi there!
                                                                <br>
                                                                We are happy to inform you that ${details.name} has accepted your request to join their team. Please find their contact details as follows
                                                                <br>
                                                                Name: ${details.name}
                                                                <br>
                                                                Email ID: <span style="background-color: #ffffff">${details.email}</span></p>
                                                                <br>
                                                                    <p style="color: #ffffff;">We look forward to seeing your submission at Ideathon 2020. Click here to proceed with your submission.
                                                                    <br>
                                                                    <a href="https://portal.ideathon.dscvit.com/login" style="background-color: #ffffff">portal.ideathon.dscvit.com/login</a>
                                                                </p>
                                                                <br>
                                                                <p style="color: #ffffff;">Good luck!</p>
                                                                <br>
                                                                <p style="color: #ffffff;>Team DSC VIT</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="font-size: 0; line-height: 0" width="20">&nbsp;</td>
                                                <td width="260" valign="top">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td>
                                                                <img src="https://i.ibb.co/xCS30v8/Ideathon-Board.png"
                                                                    alt="" width="80%" height="auto"
                                                                    style="display: block" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td bgcolor="#3635C1" style="padding: 30px 30px 30px 30px">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="
                                                color: #fea1be;
                                                font-family: Roboto, sans-serif;
                                                font-size: 24px;
                                                padding: 0px 0 15px 0;
                                                text-decoration: underline;
                                                text-decoration-color: #fea1be;
                                            ">
                                        <b>Chapter Socials</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #ffffff; font-family: Roboto, sans-serif; font-size: 14px"
                                        width="75%">
                                        <b style="color: #fea1be">Riddhi Gupta</b><br />Point of Contact<br />
                                        <a href="mailto:mailriddhigupta@gmail.com"
                                            style="color: #ffffff">mailriddhigupta@gmail.com</a><br />
                                        <a href="tel:+919408955501" style="color: #ffffff">+91 9408955501</a><br />
                                    </td>
                                    <td style="color: #ffffff; font-family: Roboto, sans-serif; font-size: 14px"
                                        width="75%">
                                        <b style="color: #fea1be">Shubham Srivastava</b><br />Point of Contact<br />
                                        <a href="mailto:shubhamsriv99@outlook.com"
                                            style="color: #ffffff">shubhamsriv99@outlook.com</a><br />
                                        <a href="tel:+919818891967" style="color: #ffffff">+91 9818891967</a><br />
                                    </td>
                                </tr>
                                <tr>
                                    <td width="100%">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <br /><br /><br />
                                            </tr>
                                            <tr>
                                                <td style="
                                                            font-family: Roboto, sans-serif;
                                                            font-size: 12px;
                                                            font-weight: bold;
                                                        ">
                                                    <a href="https://instagram.com/dscvitvellore"
                                                        style="color: #ffffff">
                                                        <img src="https://i.ibb.co/fFPCfDh/insta-white.png"
                                                            alt="Instagram" width="30" height="30"
                                                            style="display: block" border="0" />
                                                    </a>
                                                </td>
                                                <td style="font-size: 0; line-height: 0" width="20">&nbsp;</td>
                                                <td style="
                                                            font-family: Roboto, sans-serif;
                                                            font-size: 12px;
                                                            font-weight: bold;
                                                        ">
                                                    <a href="https://facebook.com/dscvitvellore" style="color: #ffffff">
                                                        <img src="https://i.ibb.co/kBmZDL4/fb-white.png" alt="Facebook"
                                                            width="30" height="30" style="display: block" border="0" />
                                                    </a>
                                                </td>
                                                <td style="font-size: 0; line-height: 0" width="20">&nbsp;</td>
                                                <td style="
                                                            font-family: Roboto, sans-serif;
                                                            font-size: 12px;
                                                            font-weight: bold;
                                                        ">
                                                    <a href="https://twitter.com/dscvit" style="color: #ffffff">
                                                        <img src="https://i.ibb.co/f14BkmM/twitter-white.png"
                                                            alt="Twitter" width="30" height="30" style="display: block"
                                                            border="0" />
                                                    </a>
                                                </td>
                                                <td style="font-size: 0; line-height: 0" width="20">&nbsp;</td>
                                                <td style="
                                                            font-family: Roboto, sans-serif;
                                                            font-size: 12px;
                                                            font-weight: bold;
                                                        ">
                                                    <a href="https://www.linkedin.com/company/dscvit/"
                                                        style="color: #ffffff">
                                                        <img src="https://i.ibb.co/thkV50w/linkedin.png" alt="LinkedIn"
                                                            width="30" height="30" style="display: block" border="0" />
                                                    </a>
                                                </td>
                                                <td style="font-size: 0; line-height: 0" width="20">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
 
</html>
    `
}

module.exports = sendAcceptedAsTeamMemberMail;;