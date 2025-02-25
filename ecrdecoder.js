//returns a json object containing the transaction data

const fieldLengths = {
  invoiceNo_01: 6,
  batchNo_02: 6,
  terminalId_03: 8,
  merchantId_04: 15,
  hostName_05: 6,
  approvalCode_06: 6,
  responseCode_07: 2,
  rrn_08: 12,
  cardBin_09: 12,
  cardLast_10: 4,
  cardType_11: 16,
  expData_12: 4,
  entryMode_13: 2,
  cardHolderName_14: 36,
  transAmount_15: 12,
  ecrRefNo_16: 10,
  binReqNo_17: 6,
};

function getFieldLength(fieldname) {
  return fieldLengths[fieldname];
}

function getLengthAccumUpTo(fieldname) {
  let curLength = 0;
  let keys = Object.keys(fieldLengths);

  keys = keys.sort((element1, element2) => {
    let elem1 = parseInt(element1.substr(element1.length - 2, 2));
    let elem2 = parseInt(element2.substr(element2.length - 2, 2));

    return elem1 - elem2;
  });

  // console.log("sorted keys", keys);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const len = fieldLengths[key];

    if (key == fieldname) return curLength;

    //accum the cur length
    curLength += len;
  }
}

function decodeTranData(data) {
  if (data.length != 163) return null;

  //start braking up
  let tran = {};

  const fieldNames = Object.keys(fieldLengths);
  fieldNames.forEach((fieldName) => {
    const length = getFieldLength(fieldName);
    const from = getLengthAccumUpTo(fieldName);

    // console.log("field Name", fieldName);
    // console.log("from", from);
    // console.log("length", length);

    // console.log("decoding", fieldName);
    // console.log("from " + from + " length  " + length);

    //remove the field id at the trail
    const fName = fieldName.substr(0, fieldName.length - 3);
    tran[fName] = data.substr(from, length);
  });

  return tran;
}

function createDummyTran() {}

module.exports.decodeTranData = decodeTranData;
