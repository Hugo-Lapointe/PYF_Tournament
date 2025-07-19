import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function getTeamMap() {
  const querySnapshot = await getDocs(collection(db, 'teams'));
  const teamMap = {};
  querySnapshot.forEach((doc) => {
    teamMap[doc.id] = doc.data().name;
  });
  return teamMap;
}
