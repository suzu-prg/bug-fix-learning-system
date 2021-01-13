import firebase from "firebase/app";
import React from "react";

import { firestore } from "../firebaseApp";
import { useHistory } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export interface Authentication {
  user?: firebase.User;
  userId?: string;
  isFirstGroup?: boolean;
  signOut: () => boolean;
  loading: boolean;
}

export const AuthenticationContext = React.createContext<Authentication>({
  user: undefined,
  userId: undefined,
  isFirstGroup: undefined,
  signOut: () => false,
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

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
};

export const AuthenticationProvider: React.FC = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [isFirstGroup, setIsFirstGroup] = React.useState<boolean>();
  const history = useHistory();

  React.useEffect(() => {
    if (!loading) return;
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;
    console.log(userId);

    (async () => {
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
  }, [loading, firebase.auth().currentUser]);

  return (
    <AuthenticationContext.Provider
      value={{
        user: firebase.auth().currentUser ?? undefined,
        userId: firebase.auth().currentUser?.uid,
        isFirstGroup,
        signOut: React.useCallback(() => {
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
      {!firebase.auth().currentUser ? (
        <>
          <div>以下のフォームでサインインしてください。初めてサインインする際は、自動的に新しいアカウントが作成されます。</div>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </>
      ) : (
        props.children
      )}
    </AuthenticationContext.Provider>
  );
};
