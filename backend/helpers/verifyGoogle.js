const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const googleVerify = async (token) => {

    // No entiendo por qué el try catch no va
    try {

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,  
        
        });
        const payload = ticket.getPayload();
        return payload;
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Token de google no válido',
            token: ''
        });
    }



}

module.exports = { googleVerify };