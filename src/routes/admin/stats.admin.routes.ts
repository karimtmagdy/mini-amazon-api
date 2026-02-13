import { Router } from "express";

const router = Router();
const { route } = router;

route("/products").get((req, res) => {
  res.json({ message: "Admin products" });
});
route("/overview").get((req, res) => {
  res.json({ message: "Admin overview" });
});
route("/analysis").get((req, res) => {
  res.json({ message: "Admin analysis" });
});
route("/settings").get((req, res) => {
  res.json({ message: "Admin settings" });
});
route("/sales").get((req, res) => {
  res.json({ message: "Admin sales" });
});
route("/users").get((req, res) => {
  res.json({ message: "Admin users" });
});
route("/users-activity").get((req, res) => {
  res.json({ message: "Admin users activity" });
});

export default {
  path: "/stats",
  router,
};
