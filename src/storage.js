const fs = require("fs");
const dbPath = "./db.json";

const entries = [];

async function getAllEntries() {
  const rawdata = fs.readFileSync(dbPath);

  try {
    entries = JSON.parse(rawdata);
  } catch (err) {
    console.error("Unable to parse db, exiting");
    process.exit(1);
  }

  return entries;
}

async function add(entry) {
  entries.push(entry);

  const data = JSON.stringify(entries);
  fs.writeFileSync(dbPath, data);
}

async function seed() {
  add({ taco: "tuesdays" });
}

function init() {
  if (fs.existsSync(dbPath)) {
    console.log("Db.json found, using existing file");
  } else {
    const emptyList = [];

    const data = JSON.stringify(emptyList);

    fs.writeFileSync(dbPath, data);
  }
}

init();

module.exports = {
  getAllEntries,
  add,
  seed
};
