const jwt =require('jsonwebtoken')

//Authorization: brazer token

const verifyToken = (req,res,next)=>{
    const authHear=req.header('Authorization')
    const token =authHear && authHear.split(' ')[1]//phantu to la chu brazer, 1 la token

    if(!token)
    return res.status(401).json({ success:false, message:'access token not found'})

    try{
        const decoded =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId =decoded.userId
        next() //kiem tra xong thi next
    }
    catch(err){
        console.log(err)
        return res.status(403).json({success:false, message:'Invalid token'})
    }
}
module.exports=verifyToken