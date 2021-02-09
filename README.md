# gmaps-HTTP-Server
Server that receives a coordinates and generates a google maps link to them.

## Sending coordinates
For sending coordinates, a message shal be posted in the format:
"MAPS:x_coordinate,y_coordinate"
The message shall be encrypted with AES256ECB, using the encryption key shown in the code.

## Getting coordinates
When a GET is requested, the server will provide a link with a pin with the last received coordinates.
