/**
 * Real data from the Google Sheet (used as fallback when sheet is unavailable).
 * Column mapping: ID→id, Fabric→fabric, Name→name, Original Price→original_price,
 *   Offer Price→offer_price, Status→status, Date→deal_date, Photo_Url→image_url
 */
export const SAMPLE_DEALS = [
  { id:1,  fabric:"Pattu", name:"Fancy", original_price:800,  offer_price:250, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982338/Saree11_dndzdp.jpg" },
  { id:2,  fabric:"Pattu", name:"Fancy", original_price:900,  offer_price:250, status:"sold",   deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982337/Saree12_hnpdu9.jpg" },
  { id:3,  fabric:"Pattu", name:"Fancy", original_price:1000, offer_price:250, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982289/sareee7_vj1w9u.jpg" },
  { id:4,  fabric:"Pattu", name:"Fancy", original_price:800,  offer_price:250, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982287/saree8_cmttoi.jpg" },
  { id:5,  fabric:"Pattu", name:"Fancy", original_price:750,  offer_price:150, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982287/saree9_btha52.jpg" },
  { id:6,  fabric:"Pattu", name:"Fancy", original_price:800,  offer_price:250, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982169/sare1_xrnwzc.jpg" },
  { id:7,  fabric:"Pattu", name:"Fancy", original_price:900,  offer_price:250, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982168/saree2_ufpz9h.jpg" },
  { id:8,  fabric:"Pattu", name:"Fancy", original_price:1000, offer_price:260, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982167/saree4_hnckms.jpg" },
  { id:9,  fabric:"Pattu", name:"Fancy", original_price:1100, offer_price:300, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982166/saree5_r7yxoh.jpg" },
  { id:10, fabric:"Pattu", name:"Fancy", original_price:900,  offer_price:240, status:"active", deal_date:"09/06/2026", image_url:"https://res.cloudinary.com/dq6jpmn1z/image/upload/v1780982166/saree6_zsnncf.jpg" },
];
