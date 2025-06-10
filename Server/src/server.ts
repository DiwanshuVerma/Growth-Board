import { createApp } from "./app";
import connectToDB from "./config/db";
import "dotenv/config"

(async () => {
  await connectToDB();
  const app = createApp();
  app.listen(process.env.PORT || 5000, () => console.log('Server running'));
})();
