import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class RFIDDatabase {
  async registerUser(rfidUUID: string) {
    const userRef = doc(db, "users", rfidUUID);
    const userData = {
      rfidUUID,
      registeredAt: new Date().toISOString()
    };

    await setDoc(userRef, userData, { merge: true });
    return userData;
  }

  async getUser(rfidUUID: string) {
    const userRef = doc(db, "users", rfidUUID);
    const docSnap = await getDoc(userRef);

    return docSnap.exists() ? docSnap.data() : null;
  }
}

export default new RFIDDatabase();
