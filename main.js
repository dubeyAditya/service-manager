#!/usr/bin/env node

const exec = require("child_process").execSync;
const { commands, visionServices } = require("./config");
const operation = process.argv[2];
const serviceName = process.argv[3] || "ibmqmfvisionwebservice.exe";

if (!commands.includes(operation)) {
  console.error("Exiting not a valid argument!!");
  process.exit(0);
}

let cmd;
switch (operation) {
  case "debug":
    introspection(visionServices);
    break;
  case "status":
    introspection([serviceName]);
    break;
  default:
    cmd = `powershell -Command Start-Process cmd -Verb RunAs -ArgumentList '/c net  ${operation} ${serviceName}'`;
    process.stdout.write(exec(cmd));
    break;
}

function introspection(services) {
  try {
    for (let i = 0, cmd, serviceName; i < services.length; i++) {
      serviceName = services[i];
      cmd = `sc query ${serviceName}`;
      process.stdout.write(exec(cmd));
    }
  } catch (ex) {
    let unknownService = ex.cmd.split(" ")[2];
    process.stdout.write(
      `\nSERVICE_NAME : ${unknownService} Does NOT Exists !\n`
    );
    process.exit(0);
  }
}
