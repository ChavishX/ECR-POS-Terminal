const { getECRResultFromTerminal } = require("./usbcom");
const { decodeTranData } = require("./ecrdecoder");
const { validate } = require("./tran");
const express = require("express");
const { handleError } = require("./error/errorHandler");
const { BadRequest, ServerError } = require("./error/BaseError");
const { getPaddedString } = require("./common/utils");

const logger = require("./common/logger");
const { SERVER_ERROR, OK } = require("./error/statusCodes");
const app = express();
const cors  = require('cors');

const INIT_TIMEOUT = 4;
const SALE_TIMEOUT = 30;

const SALE_COMMAND = "CMDSALK"; 

app.use(cors())
//sac added
app.options('*', cors());
app.use(express.json());


//console.log('using the new version with cors enabled')

app.post("/api/vi/dosale", async (req, res) => {
  logger.info("do sale requst");
  try {
    if (!req.body) throw new BadRequest("request body is empty");
    const error = await validate(req.body);
    if (error) throw new BadRequest(error);
    //attempt to perform the transaction
    const amtStr = req.body.amount.toString();

    const amt = getPaddedString(amtStr, "0", 12);
    const saleCommand = SALE_COMMAND + amt + "#";

    let result;

    try {
      result = await getECRResultFromTerminal(saleCommand, SALE_TIMEOUT);
      if (result == "CNA") throw new ServerError("Command not accepted");

      //attempt to decode the transaction
      const trans = decodeTranData(result);
      res.status(OK).send(trans);


    } catch (error) {
      throw new ServerError(error);
    }

    console.log("result", result);
  } catch (error) {
    handleError(error, res);
  }
});

app.listen(5000, (error) => {
  if (error) logger.error("failed to start at port " + 5000);
  else logger.info("started at port " + 5000);
});
