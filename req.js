var axios = require("axios");
require("dotenv").config();

const STATE = process.env.STATE;
const DISTRICT = process.env.DISTRICT;

async function getState(cb, callback) {
  var config = {
    method: "get",
    url: "https://cdn-api.co-vin.in/api/v2/admin/location/states\n",
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      const states = response.data.states.filter(
        (state) => state.state_name == STATE
      );
      stateID = states[0].state_id;
      return cb(stateID, callback);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getDistrict(state, cb) {
  var config = {
    method: "get",
    url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state}\n`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      const districts = response.data.districts.filter(
        (district) => district.district_name == DISTRICT
      );
      const districtID = districts[0].district_id;
      console.log(districtID);
      return districtID;
      cb(districtID);
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function main() {
  let x = await getState(getDistrict);
  console.log(x);
}

main();
