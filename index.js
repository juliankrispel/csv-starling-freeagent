const { parse } = require("csv-parse");
const fs = require('fs')
const [file, fileTo] = process.argv.filter((v) => v.endsWith(".csv"));
const assert = require("assert");
const csvRead = fs.readFileSync(file);
const records = [];
assert(file != null, 'Need file input')
assert(fileTo != null, "Need fileTo input");

const parser = parse({
  delimiter: ",",
});

parser.on("readable", function () {
  let record;
  while ((record = parser.read()) !== null) {
    records.push([record[0], record[4], record[2]]);
  }
});
// Catch any error
parser.on("error", function (err) {
  console.error(err.message);
});

// Test that the parsed records matched the expected records
parser.on("end", function () {
  const [first, ...rest] = records;
  assert(first[0] === 'Date', "Date must be specified");
  assert(first[1].includes('Amount'), "Amount must be specified");
  assert(first[2] === 'Reference', "Reference must be specified");
  console.log({ first });
  console.log({ rest });
  let newCsv = ''
  rest.forEach((row) => (newCsv += row.join(",") + "\n"));
  fs.writeFileSync(fileTo, newCsv);
});
// Write data to the stream
parser.write(csvRead);
parser.end();
