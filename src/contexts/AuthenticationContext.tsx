import firebase from "firebase/app";
import React from "react";

import { firestore } from "../firebaseApp";
import { useHistory } from "react-router-dom";

export interface Authentication {
  user?: firebase.User;
  userId?: string;
  isFirstGroup?: boolean;
  changeAnonymousUser: () => boolean;
  loading: boolean;
}

export const AuthenticationContext = React.createContext<Authentication>({
  user: undefined,
  userId: undefined,
  isFirstGroup: undefined,
  changeAnonymousUser: () => false,
  loading: true,
});

interface UserInfo {
  isFirstGroup: boolean;
}

interface GroupCount {
  firstCount: number;
  secondCount: number;
}

export function useAuthentication(): Authentication {
  return React.useContext(AuthenticationContext);
}

export const AuthenticationProvider: React.FC = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [isFirstGroup, setIsFirstGroup] = React.useState<boolean>();
  const history = useHistory();

  React.useEffect(() => {
    if (!loading) return;

    (async () => {
      await firebase.auth().signInAnonymously();
      const userId = firebase.auth().currentUser?.uid as string;
      const docRef = firestore
        .collection("userInfos")
        .doc(userId) as firebase.firestore.DocumentReference<UserInfo>;
      const doc = await docRef.get();
      const userInfo = doc.data();
      if (userInfo?.isFirstGroup) {
        setIsFirstGroup(userInfo.isFirstGroup);
      } else {
        const groupCountDocRef = firestore
          .collection("groupCounts")
          .doc(
            "groupCount"
          ) as firebase.firestore.DocumentReference<GroupCount>;
        const groupCountDoc = await groupCountDocRef.get();
        const groupCount = groupCountDoc.data();
        const newIsFirstGroup =
          Number(groupCount?.firstCount) <= Number(groupCount?.secondCount);
        if (newIsFirstGroup) {
          groupCountDocRef
            .update({ firstCount: firebase.firestore.FieldValue.increment(1) })
            .then();
        } else {
          groupCountDocRef
            .update({ secondCount: firebase.firestore.FieldValue.increment(1) })
            .then();
        }
        docRef.set({ isFirstGroup: newIsFirstGroup }, { merge: true }).then();
        setIsFirstGroup(newIsFirstGroup);
      }
      setLoading(false);
    })();
  }, [loading]);

  return (
    <AuthenticationContext.Provider
      value={{
        user: firebase.auth().currentUser ?? undefined,
        userId: firebase.auth().currentUser?.uid,
        isFirstGroup,
        changeAnonymousUser: React.useCallback(() => {
          if (loading) return false;

          (async () => {
            await firebase.auth().signOut();
            setLoading(true);
            setIsFirstGroup(undefined);
            history.push("/");
          })();
          return true;
        }, [loading]),
        loading,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};
