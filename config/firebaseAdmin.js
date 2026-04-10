const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// جلوگیری duplicate initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;