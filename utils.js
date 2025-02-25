function getPaddedString(data, char, totalLen) {
  //console.log("dataa", data);

  let tmp = "";
  for (let i = 0; i < totalLen - data.length; i++) {
    tmp = char + tmp;
  }
  tmp = tmp + data;

  //console.log("tttt", tmp);

  return tmp;
}

module.exports.getPaddedString = getPaddedString;
