import axios from "axios";

export default axios.create({
	// Change this in production to the actual API URL
	// remove server from vite.config.ts in production
	baseURL: "https://blockathon.onrender.com",
});
