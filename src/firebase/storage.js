import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "./config";

export const uploadFile = async (path, file) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const getFileURL = async (path) => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (path) => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};
