module.exports = {
    ERROR : {
      MESSAGE : "Something went wrong"
    },
    SUCCESS : {
    },
    ARTICLE:{
        STATUS:{
            IN_PROGRESS:"processing",
            COMPLETED:"completed",
            FAILED:"failed"
        },
        ERROR : {
            NOT_FOUND: "Article not found",
            CREATION_FAILED : "Error in creating article",
            FETCH_FAILED : "Error in fetching article",
            NOT_ALLOWED : "You are not allowed to access this article",
        },
        SUCCESS :{
            CREATED : "Article created successfully",
        }
    },
    WORDPRESS:{
      ERROR : {
        USERNAME: "you have entered an invalid username",
        PASSWORD: "you have entered an invalid password",
        DOMAIN: "you have entered an invalid domain",
        GENERIC_ERR: "something went wrong",
        RECONNECT_ERR: "Authorization failed. Please re-connect the app.",
        NOT_CONNECTED: "You are not connected to wordpress",
        CONNECTED: "You are already connected to wordpress",
        ALREADY_CONNECTED_DOMAIN : "Domain is is already connected with another user",
        PUBLISH : "Error in publishing article to wordpress",
        RECONNECT: "Either username or password has been Changed. Please re-connect the wordpress.",
        DISCONNECT : "Something went wrong while disconnecting wordpress",
      },
      SUCCESS:{
        CONNECTED: "You have connected to wordpress successfully",
        PUBLISHED: "Article published successfully",
      },
      ROUTE_TYPE:{
        USERS: "users",
        CATEGORIES: "categories",
        TAGS: "tags"
      },
      PUBLISH_STATUS:{
        1: "publish",
        2: "private",
        3: "draft",
        4: "pending",
        3: "future"
      }
    },
    COMMON:{
        DEFAULT_LOCATIONS : [
            {
              "name": "United States",
              "full_name": "United States",
              "type": "Country",
              "country_code": "US",
              "reach": 227000000
            },
            {
              "name": "United Kingdom",
              "full_name": "United Kingdom",
              "type": "Country",
              "country_code": "GB",
              "reach": 41400000
            },
            {
              "name": "India",
              "full_name": "India",
              "type": "Country",
              "country_code": "IN",
              "reach": 34620000
            },
            {
              "name": "Canada",
              "full_name": "Canada",
              "type": "Country",
              "country_code": "CA",
              "reach": 22700000
            },
            {
              "name": "Singapore",
              "full_name": "Singapore",
              "type": "Country",
              "country_code": "SG",
              "reach": 4910000
            },
            {
              "name": "Australia",
              "full_name": "Australia",
              "type": "Country",
              "country_code": "AU",
              "reach": 13600000
            },
            {
              "name": "New York",
              "full_name": "New York, United States",
              "type": "State",
              "country_code": "US",
              "reach": 23600000
            },
            {
              "name": "London",
              "full_name": "London, United Kingdom",
              "type": "City",
              "country_code": "GB",
              "reach": 19900000
            }
          ],
        ERROR:{
            LOCATION_FETCH:"Something went wrong while fetching location"

        },
        SUCCESS:{

        }
    }

}