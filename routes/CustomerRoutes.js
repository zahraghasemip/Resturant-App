const express = require("express");
const Admin = require("../middlewares/Admin");
const Auth = require("../middlewares/Auth");
const router = express.Router();
const Customer = require("../models/CustomerModel");
const {
  validateCreateCustomer,
  validateUpdateCustomer,
} = require("../validators/CustomerValidator");

router.get("/api/customers", Auth, async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});
router.get("/api/customers/:id", [Auth, Admin], async (req, res) => {
  const mongoose = require("mongoose");
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("bad id");
  const customer = await Customer.findById(req.params.id);
  if (customer) res.send(customer);
  else res.status(404).send("not found");
});
router.post("/api/customers", async (req, res) => {
  const { error } = validateCreateCustomer(req.body);
  if (error) return res.status(400).send({ message: error.message });
  let customer = new Customer({
    name: req.body.name,
  });

  customer = await customer.save();
  res.send(customer);
});
router.put("/api/customers/:customerId", async (req, res) => {
  const { error } = validateUpdateCustomer({
    ...req.body,
    customerId: req.params.customerId,
  });
  if (error) return res.status(400).send({ message: error.message });
  let customer = await customer.findById(req.params.customerId);
  if (!customer) return res.status(404).send({ message: "user not found" });
  customer.name = req.body.name;
  customer = await customer.save();
  res.send(customer);
});
router.delete("/api/customers/:customerId", async (req, res) => {
  await customer.findByIdAndRemove(req.params.customerId);
  res.status(200).send("deleted");
});
module.exports = router;
