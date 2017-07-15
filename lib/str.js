const strToHex = (str) => {
  let hex = '';
	for(let i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}

function toHex(strTx) {
	var hexTr = '';
	for(var i=0;i<strTx.length;i++) {
		hexTr += ''+strTx.charCodeAt(i).toString(16);
	}
	return hexTr;
}

const hexToStr = (hexTr) => {
    var hex = hexTr.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const toJSON = str => JSON.parse(str)

module.exports = { strToHex, hexToStr, toJSON }