const MongoClient = require('mongodb').MongoClient;
const MONGO_PATH = 'mongodb://localhost:27017/socialnetwork';


function add(protocol, username, email, password, done){
    return MongoClient.connect(MONGO_PATH, (err, db) => {
        return db.collection('users')[protocol]({
            username,
			email,
            password,
            rights: 1,
            profile: {comments: [], friends: []},
        }, done);
    });
};

// function find(protocol, username, done){
//     return MongoClient.connect(MONGO_PATH, (err, db) => {
//         return db.collection('users')[protocol]({
//             username
//         }, (err, result) => {
//             if(err) return done(err);
//             return done(null, result);
//         });
//     });
// }
//
//
// function findUser(protocol, username, done){
//     return MongoClient.connect(MONGO_PATH, (err, db) => {
//         return db.collection('users')[protocol]({
//             username: username
//         }, (err, result) => {
//             if(err) {
// 				console.log(err);
// 				return done(err);
//
// 			}
// 			if (result) {
// 				console.log(result);
// 				return done(null, result);
// 			}
//         });
//     });
// }

function loginCheck(protocol, username, password, done){
    return MongoClient.connect(MONGO_PATH, (err, db) => {
        return db.collection('users')[protocol]({
            username,
            password
        }, (err, result) => {
            if(err) return done(err);
            return done(null, result);
        });
    });
}


module.exports = {
	register: (username, email, password, done) => {
        return add('insertOne', username, email, password, done);
    },
	loginCheck: (username, password, done) => {
        return loginCheck('findOne', username, password, (err, result) => {
            if(err) return done(err);
            return done(null, result);
        });
    }
};
