# Proposed Backend Updates for Search & Suggestions

To establish a production-ready search system, the backend search service and controllers should be updated to address key mapping differences and search reliability issues.

---

## 1. Search Suggestions Field Mapping (`/api/search/suggestions`)

### The Issue
* The search suggestions endpoint `GET /api/search/suggestions` returns an object of the form:
  ```json
  {
    "success": true,
    "suggestions": [
      { "text": "Buka Kitchen", "type": "vendor" }
    ],
    "query": "buka"
  }
  ```
* However, the frontend search components historically expected a `results` field in the response (e.g. `response.results` instead of `response.suggestions`), causing autocomplete suggestions to not render.

### Recommendation
Ensure the suggestions endpoint or client mapping is consistent. (We have updated the frontend to support both `response.suggestions` and `response.results` to maintain backward compatibility, but standardizing on a single payload pattern is recommended).

---

## 2. Robust Vendor & Dish Search (`/api/search`)

### The Issue
* The backend search logic for vendors, dishes, and combos in `services/search.service.js` uses strict MongoDB `$text` indices (e.g., `{ $text: { $search: query } }`).
* **MongoDB `$text` search limitations**:
  1. It only matches complete words or word stems (e.g., searching `"buk"` will fail to match a vendor named `"Buka"`).
  2. It relies on the indexes being built successfully. If indexes are not built on the collections, the search will fail or yield empty results.
* This results in search queries for clearly visible vendor names (e.g., partial substring queries) returning empty results.

### Recommendation
Update `services/search.service.js` to utilize case-insensitive regular expression matching (`RegExp` or `$regex` queries) instead of strict `$text` indices, which is much more tolerant of partial/substring inputs.

Example update for `searchVendors` in `services/search.service.js`:
```javascript
const searchVendors = async (query, limit, includeUnavailable) => {
  try {
    const regex = new RegExp(query, "i");
    
    // Find food items matching the query to get vendor IDs
    const foodItems = await FoodItem.find({
      $or: [
        { category: regex },
        { "subCategory.name": regex },
        { "subCategory.items.name": regex }
      ]
    }).select("vendor");
    const vendorIdsFromFood = foodItems.map((v) => v.vendor);

    const matchStage = {
      $or: [
        { _id: { $in: vendorIdsFromFood } }, 
        { name: regex },
        { "storeDetails.storeName": regex },
        { description: regex }
      ],
    };
    if (!includeUnavailable) matchStage.isActive = true;

    const vendors = await VendorProfile.aggregate([
      { $match: matchStage },
      {
        $project: {
          type: { $literal: "vendor" },
          id: "$_id",
          name: 1,
          image: { $ifNull: ["$logoUrl", "$profileImage", "$bannerUrl"] },
          isOpen: "$isActive",
          averageRating: { $ifNull: ["$averageRating", 0] },
          totalRating: { $ifNull: ["$ratingCount", 0] },
          _id: 0,
        },
      },
      { $limit: limit },
    ]);

    return vendors;
  } catch (err) {
    logger.error(`Vendor search error: ${err.message}`);
    return [];
  }
};
```

Apply similar regex substring logic to `searchFoodItems`, `searchCombos`, and `searchPlates` to support partial word search matches for all dishes and items.

---

## 3. Cryptographically Verified Paystack Webhooks (`/api/payments/webhook`)

### The Issue
* Currently, the customer checkout flow verifies Paystack payments via **client-initiated polling** (`GET /api/payments/verify?reference=...`).
* This approach relies entirely on the client keeping their browser tab open. If the browser is closed or refreshed prematurely, or if a user intercepts and mocks the frontend verify request, order statuses may become out of sync or vulnerable to client-side manipulation.

### Recommendation
* Implement a secure Paystack Webhook endpoint on the backend (e.g., `POST /api/payments/webhook`).
* **Signature Verification Middleware:** Verify incoming events using the `x-paystack-signature` header and the server's Paystack Secret Key to prevent spoofing.
* **Database Updates:** Capture the `charge.success` event, parse the order ID from the transaction metadata, and update the order status directly to `paid` and set the transaction reference.
* **Real-time Frontend Notification:** Emit a Socket.io event (e.g., `payment_verified`) to the corresponding user room to trigger immediate navigation to the order tracking page on the frontend, removing the need for a 3-second polling interval.

---

## 4. Rider-Customer Support Chat Architecture

### The Issue
* There is currently no direct in-app chat communication channel between customers and assigned delivery riders during active tracking.

### Recommendation
* Establish a room-based WebSocket channel under Socket.io for orders (e.g. namespace `/chat`, room `order_[orderId]`).
* Implement messages logging in the database to support delivery reviews and dispute resolutions.
* Establish backend middleware to restrict access to chat rooms exclusively to the customer who placed the order and the rider assigned to the delivery.
