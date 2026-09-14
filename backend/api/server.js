import dns from "dns";
import connectDB from "./config/db.js";
import app from "./app.js";




// Custom DNS Resolver Setup
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Load Environment Variables

// Connect Database
// connectDB();

const PORT = process.env.PORT ;
const CLIENT_URL = process.env.CLIENT_URL ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}===${CLIENT_URL}`);
});