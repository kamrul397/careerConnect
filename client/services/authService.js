import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { logoutJwt } from "./authApi";

const googleProvider = new GoogleAuthProvider();

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleLogin = () =>
  signInWithPopup(auth, googleProvider);

export const logoutUser = () =>
  signOut(auth);

export const logout = async () => {
  await logoutJwt();
  await logoutUser();
};

export const updateUserProfile = (name, photoURL) =>
  updateProfile(auth.currentUser, {
    displayName: name,
    photoURL,
  });
