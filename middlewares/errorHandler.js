function errorHandler(err, req, res, next) {
    let status = 500
    let message = "Internal Server Error"

    console.log('ERROR>>>',err)

    switch (err.name) {
        case "cannotEmpty":
            status = 400
            message = "Please fill in all the blank"
            break;
        case "EmailPasswordInvalid":
            status = 400
            message = "Invalid email or password"
            break;
        case "JsonWebTokenError":
        case "AuthenticationError":
            status = 401
            message = "Authentication Error"
            break;
        case "SequelizeValidationError":
            status = 400
            message = err.errors[0].message
            break;
        case "SequelizeForeignKeyConstraintError":
            status = 400,
            message = "Something went wrong, please use the valid format"
            break;
            case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400
            message = err.errors[0].message
            break;
        case "NotFound":
            status = 404
            message = "Data not found"
            break;
        case "AlreadyJoin":
            status = 400
            message = "You alreaady joined this activity"
        case "AlreadyClaimed":
            status = 400
            message = "You already claimed this reward"

    }

    console.log('STATUS >>>', status, message)
    res.status(status).json({ message })
}

module.exports = errorHandler