import { useAuth } from "../middlewares/authMiddleare";
import { router } from "./authRoutes";

router.post("/logout", useAuth, handleLogout);

