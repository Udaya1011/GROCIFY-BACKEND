import express from "express";
import { getRecipes, seedRecipes } from "../controller/recipe.controller.js";

const recipeRouter = express.Router();

recipeRouter.get("/list", getRecipes);
recipeRouter.post("/seed", seedRecipes); // Can protect with admin middleware if needed, leaving public for easy demo setup

export default recipeRouter;
