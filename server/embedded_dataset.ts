import fs from 'fs';
import path from 'path';

// Try to load the data from the embedded CSV file
let bottleData: string;

try {
  // In development or when file is available
  const csvPath = path.resolve(__dirname, 'embedded_dataset.csv');
  bottleData = fs.readFileSync(csvPath, 'utf-8');
} catch (error) {
  // Fallback for Vercel deployment (embedding a small subset of the data)
  // This is just an emergency fallback in case neither the original dataset nor the embedded CSV is available
  bottleData = `id,name,size,proof,abv,spirit_type,brand_id,popularity,image_url,avg_msrp,fair_price,shelf_price,total_score,wishlist_count,vote_count,bar_count,ranking
164,Blanton's Original Single Barrel,750,93,46.5,Bourbon,10,100737,https://d1w35me0y6a2bb.cloudfront.net/newproducts/rec8QcHSZugg64kQy,74.99,104.52,139.86,92451,8983,29697,53771,1
2848,Eagle Rare 10 Year,750,,45,Bourbon,542,100519,https://d1w35me0y6a2bb.cloudfront.net/newproducts/ecce066b-6b3d-4b58-bd04-8bf9c67e3e92,39.99,66.25,49.99,82217,8744,25989,47484,2
4984,"E.H. Taylor, Jr. Small Batch",750,,50,Bourbon,210,100407,https://d1w35me0y6a2bb.cloudfront.net/newproducts/recE8VJ2hGGJwZjdh,44.99,94.43,93.57,61777,8161,19475,34141,3
466,Buffalo Trace,750,90,45,Bourbon,245,100447,https://d1w35me0y6a2bb.cloudfront.net/newproducts/recbYY28UjL8EfuFD,26.99,41.82,36.96,49610,3403,12293,33914,4
135,Weller Special Reserve,750,90,45,Bourbon,64,100287,https://d1w35me0y6a2bb.cloudfront.net/newproducts/recEEUDU5pEIpHHGu,24.99,69.45,65.41,44664,5001,14248,25415,5`;
}

export { bottleData };