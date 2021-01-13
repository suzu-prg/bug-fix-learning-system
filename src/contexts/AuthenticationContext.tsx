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
}

export const AuthenticationContext = React.createContext<Authentication>({
  user: undefined,
  userId: undefined,
  isFirstGroup: undefined,
  signOut: () => false,
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
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

export const AuthenticationProvider: React.FC = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [initialized, setInitialized] = React.useState(false);
  const [user, setUser] = React.useState<firebase.User>();
  const [isFirstGroup, setIsFirstGroup] = React.useState<boolean>();
  const history = useHistory();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setInitialized(true);
      setUser(user ?? undefined);
    });
  }, []);

  React.useEffect(() => {
    if (!loading) return;
    const userId = user?.uid;
    if (!userId) return;

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
  }, [loading, user]);

  const signOut = React.useCallback(() => {
    (async () => {
      await firebase.auth().signOut();
      setLoading(true);
      setIsFirstGroup(undefined);
      history.push("/");
    })();
    return true;
  }, []);

  if (initialized && !user) {
    return (
      <>
        <div>
          申込み時に入力したメールアドレスでサインインしてください。初めてサインインする際は、自動的に新しいアカウントが作成されます。
        </div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </>
    );
  }

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user: user,
        userId: user?.uid,
        isFirstGroup,
        signOut,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};
