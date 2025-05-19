import jwt from 'jsonwebtoken'

const JWT_SECRET = '7d2252ce729daacce68af4d9af63e62af1e61a7ef8375e6d68d37cb9029991a1'

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization

        if(!token)
            res.status(401).json({
                message: 'Acesso negado.'
            })

        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)

        console.log(decoded.id)

        next()
    }
    catch(err) {
        res.status(401).json({
            message: 'Acesso negado.',
            error: err.message
        })
    }
}

export default auth