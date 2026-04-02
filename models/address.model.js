import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String, required: false },
  phone: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
