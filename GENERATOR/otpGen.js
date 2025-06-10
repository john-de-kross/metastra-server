function generateOtp() {
    let otp = ''
    for (let i = 0; i < 6; i++) {
        const randomNum = Math.floor(Math.random() * 10);
        otp += randomNum
        
    }
    
    return otp;
    
}
module.exports = generateOtp;