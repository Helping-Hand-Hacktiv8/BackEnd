## Endpoints

List of Available Endpoints
-`POST/login`
-`POST/register`
-`POST/googleLogin`
-`GET/users/profile/:id`
-`PUT/users/profile/:id`
-`DELETE/users/profile/:id`
-`GET/activities`
-`POST/activities`
-`GET/activities/:id`
-`PUT/activities/:id`
-`DELETE/activities/:id`
-`PATCH/activities/cancel/:id`
-`PUT/activities/finish/:id`
-`GET/rewards`
-`GET/user-activities`
-`POST/user-activities`
-`GET/user-activities/:id`
-`DELETE/user-activities/:id`
-`GET/user-rewards`
-`POST/user-rewards`
-`GET/user-rewards/:id`


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
           "id": <integer>,
            "name": <string>,
            "description": <string>,
            "fromDate": "<date>,
            "toDate": <date>,
            "participant": <integer>,
            "reward": <integer>,
            "location": <string>,
            "lat": <float>,
            "status": <string>,
            "lon": <float>,
            "photoAct": <string> || <file>,
            "UserActivity":[
                {
                    "id":<integer>,
                    "UserId":<integer>,
                    "ActivityId":<integer>,
                    "role":<string>
                }
            ]
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
        "photoAct":<file>
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
- status 403:
    ```js
    {
        "message":"Access Forbidden"
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

### PATCH /activities/cancel/:id
#### Description
- patch the status of activity to cancelled

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
    "message":"Activity has been cancelled"
   }

### PUT /activities/finish/:id
#### Description
- edit status of activity to done and submit token transfer to participant

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
        "arrayUser":[
            {
                "id":<integer>,
                "UserId":<integer>,
                "ActivityId":<integer>,
                "role":"Participant"
            }
        ]
    }
    ```


#### Response
- status 200:
    ```js
   {
    "message":"Activity finished"
   }

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

### GET /rewards
#### Description
- get all rewards item

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
           "id":<integer>,
           "name":<string>,
           "description":<string>,
           "companyName":<string>,
           "price":<integer>
           "photoProduct":<file> || <string>
        }
    ]
    ```

### GET /user-activities
#### Description
- get all UserActivities with corresponding user id

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
           "id":<integer>,
           "UserId":<integer>,
           "ActivityId":<integer>,
           "role":<string>,
           "Activity":{
                "id": <integer>,
                "name": <string>,
                "description": <string>,
                "fromDate": "<date>,
                "toDate": <date>,
                "participant": <integer>,
                "reward": <integer>,
                "location": <string>,
                "lat": <float>,
                "status": <string>,
                "lon": <float>,
                "photoAct": <string> || <file>,
           },
           "User":{
                "id": <integer>,
                "name":<string>,
                "email":<string>,
                "profileImg": <file>,
                "token": <integer>,
                "phoneNumber": <string>
           },
        }
    ]
    ```

### POST /user-activities
#### Description
- create new UserActivity as participant

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
        ActivityId:<integer>
    }
    ```

#### Response
- status 201:
    ```js
   {
        "message":"Successfully joined a new activity"
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
        "message":"You already joined this activity"
   }
    ```

### GET /user-activities/:id
#### Description
- get UserActivity based on id

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```
- Params
    ```js
    {
        id:<integer>
    }
    ```

- Body
    ```js
    {
        ActivityId:<integer>
    }
    ```

#### Response
- status 200:
    ```js
    {
           "id":<integer>,
           "UserId":<integer>,
           "ActivityId":<integer>,
           "role":<string>,
           "Activity":{
                "id": <integer>,
                "name": <string>,
                "description": <string>,
                "fromDate": "<date>,
                "toDate": <date>,
                "participant": <integer>,
                "reward": <integer>,
                "location": <string>,
                "lat": <float>,
                "status": <string>,
                "lon": <float>,
                "photoAct": <string> || <file>,
           },
           "User":{
                "id": <integer>,
                "name":<string>,
                "email":<string>,
                "profileImg": <file>,
                "token": <integer>,
                "phoneNumber": <string>
           },
    }
    ```
### DELETE /user-activities/:id
#### Description
- delete UserActivity

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```

- Params
    ```js
    {
        id:<integer>
    }
    ```

- Body
    ```js
    {
        ActivityId:<integer>
    }
    ```

#### Response
- status 200:
    ```js
   {
        "message":"Successfully exited the activity"
   }
    ```


### GET /user-rewards
#### Description
- get all UserRewards with corresponding user id

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
           "id":<integer>,
           "UserId":<integer>,
           "RewardId":<integer>,
           "status":<string>
        }
    ]
    ```

### POST /user-rewards
#### Description
- create new UserReward from chosen rward

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
        RewardId:<integer>
    }
    ```

#### Response
- status 201:
    ```js
    {
        "message":"Your reward successfully claimed"
    }
    ```

- status 400:
    ```js
    {
        "message":"You already claimed this reward"
    }
    ```

- status 400:
    ```js
    {
        "message":"Please fill in all the blank"
    }
    ```

### GET /user-rewards/:id
#### Description
- get a UserReward with params id

#### Request
- Headers
    ```js
    {
        access_token:<string>
    }
    ```

- Params
    ```js
    {
        id:<integer>
    }
    ``

#### Response
- status 200:
    ```js
    {
        "id":<integer>,
        "UserId":<integer>,
        "RewardId":<integer>,
        "status":<string>
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

