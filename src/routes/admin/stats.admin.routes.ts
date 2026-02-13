import { Router } from "express";

const router = Router();

router.route("/products").get((req, res) => {
  res.json({ message: "Admin products" });
});
router.route("/overview").get((req, res) => {
  res.json({ message: "Admin overview" });
});
router.route("/analysis").get((req, res) => {
  res.json({ message: "Admin analysis" });
});
router.route("/settings").get((req, res) => {
  res.json({ message: "Admin settings" });
});
router.route("/sales").get((req, res) => {
  res.json({ message: "Admin sales" });
});
router.route("/users").get((req, res) => {
  res.json({ message: "Admin users" });
});
router.route("/users-activity").get((req, res) => {
  res.json({ message: "Admin users activity" });
});

export default {
  path: "/stats",
  router,
};
