require("dotenv").config();
const moment = require("moment");
const cron = require("node-cron");
const axios = require("axios");
const notifier = require("./notifier");

const PINCODE = process.env.PINCODE;
const EMAIL = process.env.EMAIL;
const AGE = process.env.AGE;

async function main() {
  try {
    cron.schedule("*/10 * * * * *", async () => {
      await checkAvailability();
    });
  } catch (e) {
    console.log("an error occured: " + JSON.stringify(e, null, 2));
    throw e;
  }
}

async function checkAvailability() {
  let datesArray = await fetchNext10Days();
  datesArray.forEach((date) => {
    getSlotsForDate(date);
  });
}

function getSlotsForDate(DATE) {
  let config = {
    method: "get",
    url:
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
      PINCODE +
      "&date=" +
      DATE,
    headers: {
      accept: "application/json",
      "Accept-Language": "hi_IN",
    },
  };

  axios(config)
    .then(function (slots) {
      let sessions = slots.data.sessions;
      let validSlots = sessions.filter(
        (slot) => slot.min_age_limit <= AGE && slot.available_capacity > 0
      );
      console.log({ date: DATE, validSlots: validSlots.length });
      if (validSlots.length > 0) {
        notifyMe(validSlots);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function notifyMe(validSlots) {
  let centerString = "";
  const sendData = validSlots.map((validSlot) => {
    centerString += validSlot.name + ", ";
    return {
      name: validSlot.name,
      date: validSlot.date,
      pincode: validSlot.pincode,
      from: validSlot.from,
      to: validSlot.to,
      fee_type: validSlot.fee_type,
      vaccine: validSlot.vaccine,
      min_age_limit: validSlot.min_age_limit,
      slots: validSlot.slots,
    };
  });
  let slotDetails = JSON.stringify(sendData, null, "\t");
  centerString = centerString.replace(/,\s*$/, "");

  notifier.sendEmail(
    EMAIL,
    "VACCINE AVAILABLE at " + centerString,
    slotDetails,
    (err, result) => {
      if (err) {
        console.error({ err });
      }
    }
  );
}

async function fetchNext10Days() {
  let dates = [];
  let today = moment();
  for (let i = 0; i < 10; i++) {
    let dateString = today.format("DD-MM-YYYY");
    dates.push(dateString);
    today.add(1, "day");
  }
  return dates;
}

main().then(() => {
  console.log("Vaccine availability checker started.");
});
