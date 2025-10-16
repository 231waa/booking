import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentReference,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { User, UserProfile } from '../entities/user.entity';

const USERS_COLLECTION = 'users';

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string
): Promise<void> => {
  const userRef: DocumentReference = doc(db, USERS_COLLECTION, uid);
  await setDoc(userRef, {
    uid,
    email,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userRef: DocumentReference = doc(db, USERS_COLLECTION, uid);
  const userSnap: DocumentSnapshot = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      uid: data['uid'],
      email: data['email'],
      name: data['name'],
      photoURL: data['photoURL'],
      createdAt: data['createdAt']?.toDate() || new Date(),
      updatedAt: data['updatedAt']?.toDate()
    } as User;
  }

  return null;
};

export const updateUserProfile = async (
  uid: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  const userRef: DocumentReference = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp()
  });
};
