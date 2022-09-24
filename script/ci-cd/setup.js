#!/usr/bin/sh

// ref: https://stackoverflow.com/questions/4837673/how-to-execute-mongo-commands-through-shell-scripts
// ref: https://www.digitalocean.com/community/tutorials/how-to-use-the-mongodb-shell

// ref: https://www.mongodb.com/docs/manual/tutorial/write-scripts-for-the-mongo-shell/
db = db.getSiblingDB('admin');

// ref: https://stackoverflow.com/questions/23943651/mongodb-admin-user-not-authorized
db.createUser({
    user: 'runner',
    pwd: 'mongodb',
    roles: [{ role: 'root', db: 'admin' }, 'readWrite'],
});

db.auth('runner', 'mongodb');

db = db.getSiblingDB('gitignored');

// ref: https://www.mongodb.com/docs/manual/reference/method/db.createCollection/

// program db
db.createCollection('tech');
db.createCollection('updatetime', { capped: true, size: 5242880, max: 5000 });

db = db.getSiblingDB('testGitignored');

// test db
db.createCollection('tech');
db.createCollection('updatetime', { capped: true, size: 5242880, max: 5000 });
