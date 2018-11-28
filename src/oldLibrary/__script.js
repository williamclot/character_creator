#!/usr/bin/env node

const fs = require('fs')

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', main);

let i = 0;

function testName( fileName ) {
  const regex = /(__.*)|(.*\.json)|(poses)/;
  return ! regex.test( fileName );
}

function main( data ) {
  const fileNames = data.split('\n');

  const filtered = fileNames.filter( testName );
  
  for ( let file of filtered ) {
    try {
      const fileText = fs.readFileSync(`./${ file }`);
      const formatted = fileText.
      console.log(x.length);

    } catch ( error ) {
      console.error( error )
    }
  }

}

