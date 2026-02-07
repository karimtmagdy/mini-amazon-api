import "dotenv/config";
import app from "./app";
import { Database } from "./config/data/db";
const PORT = process.env.PORT || 8000;

void (async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    await Database.getInstance();
  } catch (error) {
    console.log("Server connection error", error);
  }
})();