import { nanoid } from "nanoid";
import { ShortURL } from "../models/shorturl.model.js";


export const createShortUrl = async (req, res) => {
 try {
   const { customUrl, expiresAt, originalUrl, title } = req.body;
   const userId = req.user.id;
   if (!originalUrl) {
     console.log("Long url not found !!!");
     return res.status(400).send({
       message: "Original url is required",
     });
   }
   let shortCode;
   if (customUrl) {
     shortCode = customUrl;
     const exist = ShortURL.findOne({
       shortCode,
     });
     if (exist) {
       console.log("This shortCode already exist");
       return res.status(400).send({
         message: "Please try another shortCode",
       });
     }
   } else {
     shortCode = nanoid(7);
     let exist = await ShortURL.findOne({
       shortCode,
     });
     while (exist) {
       shortCode = nanoid(7);
       exist = await ShortURL.findOne({
         shortCode,
       });
     }
   }
   const newUrl = new ShortURL({
     originalUrl,
     shortCode,
     userId,
   });
   await newUrl.save();
   return res.status(201).send(
     newUrl,
   );
 } catch (error) {
   console.error(error);
   return res.status(500).json({
     message: "Internal server error ",
   });
 }
};


export const getLongUrl = async (req, res) => {
 try {


   const shortCode = req.params.shortcode;


   const exist = await ShortURL.findOne({shortCode:shortCode});


   if(!exist){
       console.log("Short code not found");
       res.status(404).send({ message : "BAD_REQUEST"});
   }
 await exist.updateOne({ $inc: { clickCount: 1 } });
   return res.redirect(exist.originalUrl); // by default the status code is 302
   // return res.redirect(301,exist.originalUrl);


 } catch (error) {
   console.error(error);
   return res.status(500).json({ message: "Internal server error "});
 }
};


export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const urls = await ShortURL.find({ userId,isDeleted: false  })
    console.log(urls)

    const totalUrls = await ShortURL.countDocuments({ userId,isDeleted: false  });

    return res.status(200).json({
      urls,
      totalUrls,
      totalPages: Math.ceil(totalUrls / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getUserUrls:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// backend
export const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.body;   // ✅ directly from body
    const userId = req.user._id; 

    const url = await ShortURL.findOne({ shortCode});
    console.log(url)
    if (!url) {
      return res.status(404).json({ message: "Short URL not found or unauthorized" ,url});
    }

    await url.updateOne({ isDeleted: true }); // soft delete
    return res.json({ message: "Short URL deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const editUrl = async (req, res) => {
  try {
    // const { shortCode } = req.params;   // Identify URL
    const userId = req.user._id;        // Logged-in user
    const { shortCode,originalUrl, title, expiresAt } = req.body; // Fields to update

    // Find URL
    const url = await ShortURL.findOne({ shortCode, isDeleted: false });
    if (!url) {
      return res.status(404).json({ message: "Short URL not found or deleted" });
    }

    // Update only provided fields
    if (originalUrl) url.originalUrl = originalUrl;
    if (title) url.title = title;
    if (expiresAt) url.expiresAt = new Date(expiresAt);

    await url.save();

    return res.status(200).json({
      message: "Short URL updated successfully",
      url
    });
  } catch (err) {
    console.error("Edit URL error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};