import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const auth = getAuth();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence enabled");
  })
  .catch((error) => {
    console.error(error);
  });