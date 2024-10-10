import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (cluster.isPrimary) {
    for (let i = 0; i < 2; i++) {
        cluster.fork({
            PORT: 3000 + i
        });
    }

    setupPrimary();
} else {
    const db = await open({
        filename: 'db/chat.db',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {},
        adapter: createAdapter()
    });

    // Servir archivos estáticos desde el directorio actual
    app.use(express.static(__dirname));

    // Ruta para servir el archivo HTML
    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'index.html'));
    });

    io.on('connection', async (socket) => {
        socket.on('chat message', async (msg, clientOffset, callback) => {
            let result;
            try {
                result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
            } catch (e) {
                if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                    callback();
                } else {
                    callback('Error al guardar el mensaje');
                }
                return;
            }
            io.emit('chat message', msg, result.lastID);
            if (typeof callback === 'function') {
                callback();
            }
        });

        if (!socket.recovered) {
            try {
                await db.each('SELECT id, content FROM messages WHERE id > ?',
                    [socket.handshake.auth.serverOffset || 0],
                    (_err, row) => {
                        socket.emit('chat message', row.content, row.id);
                    }
                )
            } catch (e) {
                console.error('Error al recuperar mensajes:', e);
            }
        }
    });

    const port = process.env.PORT;

    server.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
}