import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import UserStore from "../store/userStore";
import { auth } from "../config/firebaseConfig";

const userLogin = async (email, password) => {
  try {
    const sanitizedEmail = email.trim();
    console.log("Logging in with:", sanitizedEmail);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      sanitizedEmail,
      password,
    );

    const user = userCredential.user;
    UserStore.getState().setUser(user);

    return user; // ✅ return user
  } catch (error) {
    console.error("Error during login:", error);

    // ✅ Normalize Firebase Auth error codes
    let message = "An error occurred during login.";
    if (error.code === "auth/invalid-credential") {
      message = "Invalid email or password.";
    } else if (error.code === "auth/user-not-found") {
      message = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      message = "Incorrect password.";
    }

    throw new Error(message);
  }
};

const userSignOutPage = async () => {
  try {
    await signOut(auth);
    UserStore.getState().clearUser();
    localStorage.clear();

    window.location.replace("/");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw new Error("An error occurred during sign out. Please try again.");
  }
};

export { userLogin, userSignOutPage };
