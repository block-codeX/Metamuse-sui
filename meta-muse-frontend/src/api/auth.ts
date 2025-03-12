import axios from "./axios";
import store from "@/redux/store";
import { setAuthenticating } from "@/redux/slice/auth-slice";
import { toast } from "react-toastify";

export async function authenticateUser(data: any, type: "login" | "sign-up") {
	store.dispatch(setAuthenticating(true))
	const url = `/${type}`;
	await axios.post(url, data).then((res) => {
		const { data } = res
		if (type === "login") {
			localStorage.setItem("user", JSON.stringify(data))
			toast.success("Logged In")
			window.location.replace("/")
		}
		if (type === "sign-up") {
			toast.success("Account created successfully")
			window.location.replace("/auth/sign-in")
		} 
		store.dispatch(setAuthenticating(false))
	}).catch((err) => {
		store.dispatch(setAuthenticating(false))
		toast.error(err?.message)
	})
}
