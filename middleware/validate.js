


const {connection, pool}=require("../db/db")

const validate=(req,res,next)=>{
    const {email}=req.body
 
    
    const q="SELECT `email` from registration WHERE email=?"
pool.query(q,[email], (err,result)=>{
    if(err)return res.status(500).send({"error":`cannot process req ${err}`})
    if(result.length>0)res.status(300).send({"error":"tenant alredy present please login"})
    else{
        next()
    }
})
     
}

module.exports={
    validate
}