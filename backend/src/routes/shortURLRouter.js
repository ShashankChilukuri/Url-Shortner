import { Router } from "express";
import { createShortUrl, deleteUrl, editUrl, getLongUrl, getUserUrls } from "../controllers/shortUrlController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";


const shortURLRouter = Router();


shortURLRouter.post("/", isLoggedIn, createShortUrl)

shortURLRouter.get("/my/urls",isLoggedIn, getUserUrls);

shortURLRouter.delete("/", isLoggedIn, deleteUrl)
shortURLRouter.put("/edit", isLoggedIn, editUrl);
// redirect router "/api/s/shortCode"
shortURLRouter.get("/:shortcode", getLongUrl)


// TE http://localhost:3000/api/url/NtNgv65 404 (Not Found)
export default shortURLRouter;
