const SerialPort = require("serialport");
const logger = require("./common/logger");

const INIT_COMMAND = "CMDCHST#";

let selectedPort;

/**
 * this routine performs teh usb connection initiation and the necessary data transfer
 * further , pax ecr communciation has been wrrapped using the routine.
 */

/**
 *
 * @param {the data to be written to the device} writeData
 * @param {time out which should be wait till the terminal responds} timeout
 * @returns
 */
async function getECRResultFromTerminal(writeData, timeout) {
  //a blocking call should be produced here , in order to wait for the result from the terminal
  return new Promise((resolve, reject) => {
    let paxPort;
    let databuffer = null;
    let databuffer_CheckStatus = null;

    let databuffer_secondPort = null;
    let databuffer_CheckStatus_secondPort = null;

    //periodically check the data , if not return with an error
    const checkBuffer = (resolution, timeout) => {
      logger.info("waiting for incoming data.. " + timeout + " seconds");
      timeout = timeout * 1000;

      return new Promise((resolve, reject) => {
        let lapsedTime = 0;
        const handle = setInterval(() => {
          //first check the buffer for valid data
          if (databuffer) {
            clearInterval(handle);
            return resolve(true);
          }

          lapsedTime += resolution;
          if (lapsedTime >= timeout) {
            clearInterval(handle);
            selectedPort.close();
            return resolve(false);
          }
        }, resolution);
      });
    };


    const checkBuffer_CheckStatus = (resolution, timeout) => {
      logger.info("waiting for incoming data.. " + timeout + " seconds");
      timeout = timeout * 1000;

      return new Promise((resolve, reject) => {
        let lapsedTime = 0;
        const handle = setInterval(() => {
          //first check the buffer for valid data
          if (databuffer_CheckStatus) {
            clearInterval(handle);
            return resolve(true);
          }

          lapsedTime += resolution;
          if (lapsedTime >= timeout) {
            clearInterval(handle);
            selectedPort.close();
            return resolve(false);
          }
        }, resolution);
      });
    };

    const checkBuffer_secondPort = (resolution, timeout) => {
      logger.info("waiting for incoming data.. " + timeout + " seconds");
      timeout = timeout * 1000;

      return new Promise((resolve, reject) => {
        let lapsedTime = 0;
        const handle = setInterval(() => {
          //first check the buffer for valid data
          if (databuffer_secondPort) {
            clearInterval(handle);
            return resolve(true);
          }

          lapsedTime += resolution;
          if (lapsedTime >= timeout) {
            clearInterval(handle);
            selectedPort.close();
            return resolve(false);
          }
        }, resolution);
      });
    };


    const checkBuffer_CheckStatus_secondPort = (resolution, timeout) => {
      logger.info("waiting for incoming data.. " + timeout + " seconds");
      timeout = timeout * 1000;

      return new Promise((resolve, reject) => {
        let lapsedTime = 0;
        const handle = setInterval(() => {
          //first check the buffer for valid data
          if (databuffer_CheckStatus_secondPort) {
            clearInterval(handle);
            return resolve(true);
          }

          lapsedTime += resolution;
          if (lapsedTime >= timeout) {
            clearInterval(handle);
            selectedPort.close();
            return resolve(false);
          }
        }, resolution);
      });
    };


    try {
      //attempt to list the connected ports
      SerialPort.list().then((ports) => {
          paxPort = ports.filter((p) => {
          console.log(p.path);
          console.log(p);

          console.log("Pax port pnpId :" + p.pnpId);

          // if (p.pnpId.includes("USB\\VID_2FB8&PID_2205&MI")){ //A910
          //   return p.pnpId.includes("USB\\VID_2FB8&PID_2205&MI");
          // } else if (p.pnpId.includes("USB\\VID_2FB8&PID_2466&MI")){ //A910s
          //   return p.pnpId.includes("USB\\VID_2FB8&PID_2466&MI");
          // }else if (p.pnpId.includes("USB\\VID_2FB8&PID_246E&MI")){ //A910s new version
          //   return p.pnpId.includes("USB\\VID_2FB8&PID_246E&MI");
          // }

          if (p.pnpId.includes("USB\\VID_2FB8&PID_2205&MI") && p.pnpId.includes("&0&0001")){ //A910
            return p.pnpId.includes("USB\\VID_2FB8&PID_2205&MI");
          } else if (p.pnpId.includes("USB\\VID_2FB8&PID_2466&MI") && p.pnpId.includes("&0&0002")){ //A910s old version
            return p.pnpId.includes("USB\\VID_2FB8&PID_2466&MI");
          }else if (p.pnpId.includes("USB\\VID_2FB8&PID_246E&MI") && p.pnpId.includes("&0&0000")){ //A910s new version
            return p.pnpId.includes("USB\\VID_2FB8&PID_246E&MI");
          }

          //return p.productId.includes("2205") && p.vendorId.includes("2FB8")
          //return p.manufacturer.includes("PAX");
        });

        // if (!ports || ports.length == 0) return reject("no serial device is connected");
        // if (!paxPort) return reject("no pax terminal connected");

        if (!ports || ports.length == 0) return reject("no serial device is connected");
        //if (!paxPort) return reject("no pax terminal connected");
        if (!paxPort || paxPort.length == 0) return reject("no pax terminal connected");

        //we have list of ports connected, we must select the ports with the highest number for regular communication
        //selectedPort = ports[ports.length - 1];

        //selectedPort = ports[0];
        selectedPort = paxPort[0];

        console.log("Pax com port length:" + paxPort.length);
        console.log("Pax com ports:" + paxPort);

        // console.log("com port length :" + ports.length);
        // console.log("com port 1 testing :" + ports[0].path);
        // console.log("com port 2 testing :" + ports[1].path);

        logger.info("port selected :" + selectedPort.path);
        console.log(selectedPort);

        console.log("com port testing selected port :" + selectedPort.path);

        //set up the port for communcation
        selectedPort = new SerialPort(selectedPort.path, 9600);
        let ReadLine = SerialPort.parsers.Readline;
        let parser = new ReadLine();
        selectedPort.pipe(parser);

        selectedPort.on("open", async () => {

          console.log("port opened, writing data to comport..");
          selectedPort.write(INIT_COMMAND);      
          const result_Ack = await checkBuffer_CheckStatus(3, 2);
          //if (!result_Ack) return reject("no data from CheckStatus - device in time out");

          if (!result_Ack){

            //selectedPort = ports[1];
            selectedPort = paxPort[1];

            logger.info("second port selected :" + selectedPort.path);
            console.log(selectedPort);

            selectedPort = new SerialPort(selectedPort.path, 9600);
            let ReadLine = SerialPort.parsers.Readline;
            let parser = new ReadLine();
            selectedPort.pipe(parser);

            selectedPort.on("open", async () => {

              selectedPort.write(INIT_COMMAND);
              const result_Ack = await checkBuffer_CheckStatus_secondPort(3, 2);
              if (!result_Ack) return reject("no data from CheckStatus - device in time out");

              selectedPort.write(writeData);
              const result = await checkBuffer_secondPort(200, timeout);
              if (!result) return reject("no data from Sale - device in time out");      
              return resolve(databuffer_secondPort);
            });
            selectedPort.on("close", () => {
              console.log("second port is closed");
            });

            selectedPort.on("error", (error) => {
              console.log("second port error", error);
            });

            selectedPort.on("data", (data) => {
              data = data.toString();
              console.log("data second port rbecieved ", data);

              if (data == "ACK") logger.info("Teminal ACK Recieved");
              //if data is ack we should omit it
              if (data != "ACK") {
                databuffer_secondPort = data;
                selectedPort.close();
              } else {
                databuffer_CheckStatus_secondPort = data;
              }
            });
          }else{
            selectedPort.write(writeData);
            const result = await checkBuffer(200, timeout);
            if (!result) return reject("no data from Sale - device in time out");
            return resolve(databuffer);
          }
        });

        selectedPort.on("close", () => {
          console.log("port is closed");
        });

        selectedPort.on("error", (error) => {
          console.log("error", error);
        });

        selectedPort.on("data", (data) => {
          data = data.toString();
          //console.log("data rbecieved ", data);
          if (data == "ACK") logger.info("Teminal ACK Recieved");
          //if data is ack we should omit it
          if (data != "ACK") {
            databuffer = data;
            selectedPort.close();
          } else{
            databuffer_CheckStatus = data;
          }
        });
      });
    } catch (error) {
      return reject("uknown error ", error);
    }
  });
}


module.exports.getECRResultFromTerminal = getECRResultFromTerminal;

