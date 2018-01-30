const { EventEmitter } = require('events');
const EditorDocument = require('./EditorDocument');
const TextOperation = require('../../shared/TextOperation');

class Editor extends EventEmitter {
    constructor(io, id, opt) {
        super();
        this.io = io;
        this.ioNsp = this.io.of(`/${id}`);

        this.document = new EditorDocument();

        this.team = opt.team;
        this.language = opt.language;
        this.filename = opt.filename;

        this.ownerId = null;
        this.curUser = null;

        this.ioNsp.on('connection', this.onSocketConnection.bind(this));
    }

    onSocketConnection(socket) {
        socket.on('disconnect', this.onSocketDisconnect.bind(this, socket));
        socket.on('init', this.onSocketInit.bind(this, socket));
        socket.on('control', this.onSocketControl.bind(this, socket));
        socket.on('release', this.onSocketRelease.bind(this, socket));
        socket.on('save', this.onSocketSave.bind(this, socket));
        socket.on('op', this.onSocketOp.bind(this, socket));
    }

    onSocketDisconnect(socket) {
        if (this.userIsCurUser(socket)) {
            this.curUser = null;
            this.ioNsp.emit('curUser', this.curUser);
        }
    }

    onSocketInit(socket) {
        socket.emit('state', {
            namespace: this.ioNsp.name,
            team: this.team,
            language: this.team,
            filename: this.team,

            curUser: this.curUser,
            text: this.document.getText(),
        });
    }

    onSocketControl(socket) {
        if (this.userIsOwner(socket)) {
            this.curUser = {
                ...socket.client.user,
                socketId: socket.id,
            };
            this.ioNsp.emit('cur-user', this.curUser);
        }
    }

    onSocketRelease(socket) {
        if (this.userIsCurUser(socket)) {
            this.curUser = null;
            this.ioNsp.emit('cur-user', this.curUser);
        }
    }

    onSocketSave(socket) {
        if (this.userIsCurUser(socket)) {
            this.document.save();
            this.emit('save');
        }
    }

    onSocketOp(socket, op) {
        if (this.userIsCurUser(socket)) {
            this.document.applyOperation(TextOperation.fromObject(op));
            this.ioNsp.emit('op', op);
        }
    }

    userIsOwner(socket) {
        const { user } = socket.client;
        if (user) {
            if (
                user.role === 'ADMIN' ||
                user.role === 'MODERATOR' ||
                user.id === this.ownerId
            ) {
                return true;
            }
        }

        return false;
    }

    userIsCurUser(socket) {
        if (this.curUser && this.curUser.socketId === socket.id) {
            return true;
        }

        return false;
    }

    setOwner(user) {
        this.ownerId = user.id;
        if (this.curUser) {
            this.curUser = null;
            this.ioNsp.emit('cur-user', null);
        }
    }

    dispose() {
        for (const key of Object.keys(this.ioNsp.connected)) {
            this.ioNsp.connected[key].disconnect();
        }

        this.ioNsp.removeAllListeners();
        delete this.io.nsps[this.ioNsp.name];
    }
}

module.exports = Editor;
