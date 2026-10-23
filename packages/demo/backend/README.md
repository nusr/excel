# Demo Backend

The demo backend provides the collaboration WebSocket server and SQLite persistence.
See the [database implementation](./src/db.ts) for the schema and queries.

## Configuration

Create a `.env` file in the backend process working directory:

```plaintext
# .env
SERVER_PORT=4000
```

`SERVER_PORT` sets the HTTP and WebSocket server port. The database file is
`dev.db` in the process working directory; see [Connection configuration](#connection-configuration)
for test and isolation behavior.

## Collaboration persistence

Build the workspace library before starting the backend:

```sh
yarn workspace excel-collab build
yarn workspace backend start
```

The backend initializes each room before accepting sync, loads the authoritative
Yjs binary state, and saves binary state plus coordinate JSON atomically to
SQLite after updates. Writes are serialized per document. Failed saves are
logged and close connected clients with code 1011; unsaved rooms remain cached
for retry. Closing the last connection waits for pending saves before releasing
the room. SIGINT/SIGTERM closes connections and flushes persistence.

The `document.y_state` BLOB column is added automatically to existing databases.
Rows containing only legacy JSON migrate on first connection. Back up `dev.db`
before deployment. Protocol v3 requires all clients and the server to upgrade
together. Persisted v2 binaries migrate before synchronization and are saved
with their JSON projection; pre-v2 Yjs graphs require JSON migration.
The JSON REST response does not expose binary state.

## REST content updates

`PUT /document/:id` and `POST /sync` return HTTP 409 for content replacement
once a document has persisted Yjs state or its collaborative room is loading
or active. This prevents JSON-only writes from being silently overwritten by
the authoritative CRDT state. Metadata-only updates and JSON initialization
before collaboration remain supported. After collaboration starts, edit
document content through Yjs rather than REST snapshot replacement.

## Connection configuration

The WebSocket URL is `ws://host:port/<document-id>?protocol=3`. Missing or
incompatible protocol parameters close with code 1008 before loading the room.
With `y-websocket`, pass `{ params: { protocol: '3' } }` to its provider options.

`SERVER_PORT` selects the backend port. SQLite uses `dev.db` in the process
working directory; there is no database-path environment variable. Run isolated
instances from separate working directories rather than sharing a database.
`NODE_ENV=test` uses an in-memory database.

The frontend accepts `VITE_BACKEND_URL` (HTTP origin) and `VITE_WEBSOCKET_URL`
(WebSocket origin). Select a document using its URL hash, such as
`/#my-document`.
