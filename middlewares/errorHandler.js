function errorHandler(err, res, res, next) {
    let status = 500
    let message = "Internal Server Error"

    switch (err.name) {
        
    }

    console.log(err)
    res.status(status).json({ message })
}

module.exports = errorHandler