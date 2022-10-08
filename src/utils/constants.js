module.exports = {
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
        },
        SUCCESS :{
            CREATED : "Article created successfully",
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