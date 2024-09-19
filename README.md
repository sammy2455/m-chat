# Real-Time Chat Application

This is a real-time chat application built with Node.js, Express, Socket.IO, and SQLite. It features connection state recovery and uses Docker for easy deployment.

## Features

- Real-time messaging
- Connection state recovery
- SQLite database for message persistence
- Docker support for easy deployment and scaling
- Cluster mode for improved performance

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone the repository:
   ```
   https://github.com/sammy2455/m-chat.git
   cd m-chat
   ```

2. Build and start the Docker containers:
   ```
   docker-compose up -d
   ```

3. Access the application in your web browser:
   ```
   http://localhost:3000
   ```

## Project Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
├── index.html
└── db/
    └── chat.db
```

## Configuration

The application uses environment variables for configuration. You can modify these in the `docker-compose.yml` file:

- `PORT`: The port number the server will listen on (default: 3000)

## Development

To run the application in development mode:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

## Docker Commands

- Build and start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
