# echo
![Echo loading](./docs/echo_loading.gif)

**echo** is a DIY video conferencing software hacked together while coping with endless online meetings during COVID lockdowns.

echo currently provides the following features:
- Video calling with multiple peers
- Calls are restricted to groups requiring valid pass code
- Limited video effects, such as background blurring and replacement
- Muting of video and audio

![Echo call](./docs/echo_call.jpg)

In the future, the following features might be considered:
- Inserting images into background replacement
- Other cool WebGL background / foreground effects
- Better mobile support
  
However, I've moved onto other projects now, so will have to see if this ever happens 😉 

![Echo group call](./docs/echo_group.jpg)
## Architecture

![Echo architecture](./docs/echo_architecture.png)

Echo is comprised of the following components:

### Backend
.NET and SignalR are used for websockets communication. Websockets makes it easier and more efficient to fulfill the necessary peer-2-peer handshakes required as part of the WebRTC signaling process.

![Echo network components](./docs/echo_network1.png)

### Frontend
React is used as the front-end library in this project, alongside SignalR to receive and send Websockets signals to the SignalR hub on the backend. `simple-peer` is used to help handle the peer-2-peer negotiations when setting up WebRTC connections.

Grommet is used as the UI component and theming library, allowing us to make use of `styled-components` alongside pre-made components for efficient development. 

## Connection lifecycle

![Echo network flow](./docs/echo_network2.png)

The process for a new peer joining a call can broken down into the following lifecycle phases:
1. **Initialisation** (blue)
     - A new users opens the echo web page, initialising a new SignalR Websocket connection between client and server
2. **Group setup** (green)
   - User chooses between creating a new group call or existing and existing one
   - In the case they choose an existing group call, a signal will be sent to other peers which exist as part of that group to add the user to their group
   - If no group exists, a group does not exist signal will be returned
3. **Connection setup** (yellow)
   -  If the user provides echo with permission to access their video and audio, and connection request will be made to other group members to establish a peer-to-peer connection
4. **Streaming** (orange)
    - Once the user is successfully connected with another peer, their are able to send and receive WebRTC signals which can be used to stream video and audio

5. **Disconnection** (red)
    - When a user closes the webpage, or leaves the call - a disconnection signal is sent to all other peers to remove the user from the call

## Effects

![Echo video pipeline](./docs/echo_video-pipeline.png)

To achieve modern video chat features such as background removal or blurring, we used Tensorflow.js and the Tensorflow BodyPix model to track figures in the video feed and use this outline to blur or change the colour of the background.

The updated video feed is then rendered using the HTML canvas API and streamed via WebRTC.

![Echo effects](./docs/echo_effects.jpg)

## Developing
### Requirements

- .NET CLI v5.0

### Running .NET and React locally

- Run while watching for client and API changes: `dotnet run watch`
- This needs to be run over HTTPS, so go to https://localhost:5001/

### Running Docker container locally

- Build Docker container: `docker build -t ryanachten/echo-app .`
- Run Docker container: `docker run -p 8080:80 ryanachten/echo-app`
- App should then be accessible on http://localhost:8080

![Echo login](./docs/echo_login.jpg)