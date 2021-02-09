const http = require('http');
const hostname = '0.0.0.0';
const port = 8080;

// ========= GLOBAL VARIABLES =================
// Link with the coordinates to be sent
var saved_link = "No saved link yet";

// ========= CRYPTO MODULE ====================
const crypto = require('crypto');
const algorithm = 'aes-256-ecb';
const secretKey = "EYGZRIXJPWNBYKEDIPXBPNIJIIENYTLC";
const iv = crypto.randomBytes(16);
// Decryption function
const decrypt = (hash) => {
	// Creation of a buffer
	var encrypted = Buffer.from(hash.toString(), 'base64')
	// Decypher module initialization
	decipher = crypto.createDecipheriv(algorithm, secretKey, '')
	decipher.setAutoPadding(false)
	// Decyperhing
	result = decipher.update(encrypted).toString('utf-8');
	result += decipher.final().toString('utf-8');
	return result;
};

// ========= HTTP SERVER ======================
var server = http.createServer(function (req, res) {
	// GET    
	if (req.method === "GET") {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		// Returns the most new coordinates
		res.end(saved_link);
	}
	// POST
	else if (req.method === "POST") {  
		// Body collection
		var body = "";
		req.on("data", function (chunk) {
		body += chunk;
	});
		
		// Main POST response
		req.on("end", function(){
			// Message decryption
			var result = "";
			try {
				result = decrypt(body);
			} catch(error) {
				result = error.toString() + "\n" +
						 "POST body: " + body + "\n";
			}
			// Response
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/plain');
			if (result.substring(0,5) == "MAPS:"){
				var link = "https://www.google.es/maps/search/?api=1&query=";
				link += result.substring(5).replace(/[^\x20-\x7E]+/g, "");;
				saved_link = link;
				res.end("Link received \n");
			} else {
				res.statusCode = 400;
				res.end("Message not recognized\n");
			}
		});
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
