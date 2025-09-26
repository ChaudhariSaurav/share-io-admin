import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import UserStore from "../store/userStore";
import { auth } from "../config/firebaseConfig";

const userLogin = async (email, password) => {
  try {
    const sanitizedEmail = email.trim("");
    console.log("Logging in with:", sanitizedEmail, password);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      sanitizedEmail,
      password,
    );
    const user = userCredential.user;
    UserStore.getState().setUser(user);
    window.location.replace("/dashboard");
    return user;
  } catch (error) {
    console.error("Error during login:", error.message);
  }
};

const userSignOutPage = async () => {
  try {
    await signOut(auth);
    localStorage.clear();

    window.location.replace("/*");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw new Error("An error occurred during sign out. Please try again.");
  }
};

export { userLogin, userSignOutPage };
