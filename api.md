## Endpoints

List of Available Endpoints
-`POST/login`
-`POST/register`
-`GET/users/profile/:id`
-`PUT/users/profile/:id`
-`DELETE/users/profile/:id`
-`GET/activities`
-`POST/activities`
-`GET/activities/:id`
-`PUT/activities/:id`
-`DELETE/activities/:id`

### POST /login
#### Description
- login of user

#### Request

- Body
    ```js
    {
        "email":<string>,
        "password":<string>
    }
    ```

#### Response
- status 200:
    ```js
    {
        "access_token":<string>,
        "dataUser":{
            "id": <integer>,
            "name": <string>,
            "email": <string>,
            "profileImg": <file>,
            "token": <integer>,
            "phoneNumber": <string>
        }
    }
    ```

- status 401:
    ```js
    {
        "message":"Invalid email or password"
    }

    ```

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

### POST /register
#### Description
- register new user to the app

- Body
    ```js
    {
        "name":<string>,
        "email":<string>,
        "password":<string>
    }
    ```

#### Response
- status 201:
    ```js
    {
        "id": <integer>,
        "name":<string>,
        "email":<string>,
        "profileImg": <file>,
        "token": <integer>,
        "phoneNumber": <string>
    }
    ```

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

- status 400:
    ```js
    {
        "message":"Email has been registered"
    }
    ```

- status 400:
    ```js
    {
        "message":"Email input is invalid"
    }
    ```

### GET /users/profile/:id
#### Description
- get user by id

- Params
    ```js
    {
        id:<integer>
    }
    ```

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```

#### Response
- status 200:
    ```js
    {
        "id": <integer>,
        "name":<string>,
        "email":<string>,
        "profileImg": <file>,
        "token": <integer>,
        "phoneNumber": <string>
    }

### PUT /users/profile/:id
#### Description
- edit user by id

- Params
    ```js
    {
        id:<integer>
    }
    ```

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```

- Body
    ```js
    {
        "id": <integer>,
        "name":<string>,
        "email":<string>,
        "password":<string>,
        "profileImg": <file>,
        "phoneNumber": <string>
    }
    ```


#### Response
- status 200:
    ```js
    {
        "message":"Your profile has been successfully updated."
    }

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```


### DELETE /users/profile/:id
#### Description
- delete user by ID

- Params
    ```js
    {
        id:<integer>
    }
    ```

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```




#### Response
- status 200:
    ```js
    {
        "message":"User <string> successfully deleted"
    }


### GET /activities
#### Description
- get all activities

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```

#### Response
- status 200:
    ```js
    [
        {
           "id": 1,
            "name": "Mencuri hatinya",
            "description": "biasalah cinta itu buta",
            "fromDate": "2023-08-29",
            "toDate": "2023-12-25",
            "participant": 2,
            "reward": 5,
            "location": "none",
            "lat": 0,
            "status": "Pending",
            "lon": 0,
            "photoAct": "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
        }
    ]


### POST /activities
#### Description
- add new activity

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```
- Body
    ```js
    {
        "name":<string>, 
        "description":<string>, 
        "fromDate":<date>, 
        "toDate":<date>, 
        "participant":<integer>, 
        "reward":<integer>, 
        "location":<string>, 
        "lat":<float>, 
        "lon":<float>, 
        "photoAct":<file>,
        "status":<string>
    }
    ```

#### Response
- status 201:
    ```js
   {
    "message":"New activity successfully created!"
   }

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

- status 400:
    ```js
    {
        "message":"From date must be above current date"
    }
    ```

- status 400:
    ```js
    {
        "message":"To date must be above current date"
    }
    ```

### PUT /activities/:id
#### Description
- edit activity by id

#### Request
- Params
    ```js
    {
        id:<integer>
    }
    ```

- Headers
    ```js
    {
        access_token:<string>
    }
    ```

- Body
    ```js
    {
        "name":<string>, 
        "description":<string>, 
        "fromDate":<date>, 
        "toDate":<date>, 
        "participant":<integer>, 
        "reward":<integer>, 
        "location":<string>, 
        "lat":<float>, 
        "lon":<float>, 
        "photoAct":<file>,
        "status":<string>
    }
    ```


#### Response
- status 200:
    ```js
   {
    "message":"Activity successfully updated"
   }

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

- status 400:
    ```js
    {
        "message":"From date must be above current date"
    }
    ```

- status 400:
    ```js
    {
        "message":"To date must be above current date"
    }
    ```

### DELETE /activities/:id
#### Description
- delete activity by id

#### Request
- Params
    ```js
    {
        id:<integer>
    }
    ```

- Headers
    ```js
    {
        access_token:<string>
    }
    ```


#### Response
- status 200:
    ```js
   {
    "message":"Activity successfully updated"
   }

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

- status 400:
    ```js
    {
        "message":"From date must be above current date"
    }
    ```

- status 400:
    ```js
    {
        "message":"To date must be above current date"
    }
    ```

### Global message

#### Response
- status 500:
    ```js
    {
        "message":"Internal Server Error"
    }
    ```

- status 401:
    ```js
    {
        "message":"Authentication Error"
    }
    ```

- status 404:
    ```js
    {
        "message":"Data not found"
    }
    ```