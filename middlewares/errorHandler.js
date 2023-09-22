function errorHandler(err, res, res, next) {
    let status = 500
    let message = "Internal Server Error"

    switch (err.name) {
        case "cannotEmpty":
            status = 400
            message = "Please fill in all the blank"
        case "EmailPasswordInvalid":
            status = 400
            message = "Invalid email or password"
        case "JsonWebTokenError":
        case "AuthenticationError":
            status = 401
            message = "Authentication Error"
        case "SequelizeValidationError":
            status = 400
            message = err.errors[0].message
        case "SequelizeForeignKeyConstraintError":
            status = 400,
            message = "Something went wrong, please use the valid format"
        case "SequelizevalidationError":
        case "SequelizeUniqueConstraintError":
            status = 400
            message = err.errors[0].message
        case "NotFound":
            status = 404
            message = "Data not found"
    }

    console.log(err)
    res.status(status).json({ message })
}

module.exports = errorHandler