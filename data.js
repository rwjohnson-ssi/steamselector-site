const products = [
  {
    id: "TD600-1_2",
    model: "TD600",
    size: "1/2\"",
    type: "Thermodynamic",
    material: "Stainless Steel",
    maxPMO: 600,
    capacity: 100,
    image: "https://www.bbcpump.com/wp-content/uploads/manufacturer//Watson-McDaniel-TD600-Thermodynamic-Steam-Trap.jpg"  // from search
  },
  {
    id: "TD600-3_4",
    model: "TD600",
    size: "3/4\"",
    type: "Thermodynamic",
    material: "Stainless Steel",
    maxPMO: 600,
    capacity: 150,
    image: "https://www.toboaenergy.com/wp-content/uploads/2024/03/WatsonMcDanielTD600SteamTrap-pdf.jpg"
  },
  {
    id: "TD600L-1_2",
    model: "TD600L",
    size: "1/2\"",
    type: "Thermodynamic",
    material: "Stainless Steel",
    maxPMO: 600,
    capacity: 100,
    image: "https://www.toboaenergy.com/wp-content/uploads/2024/03/WatsonMcDanielTD600SteamTrap-pdf.jpg"
  },
  {
    id: "TD600L-3_4",
    model: "TD600L",
    size: "3/4\"",
    type: "Thermodynamic",
    material: "Stainless Steel",
    maxPMO: 600,
    capacity: 150,
    image: "https://www.bbcpump.com/wp-content/uploads/manufacturer//Watson-McDaniel-TD600-Thermodynamic-Steam-Trap.jpg"
  },
  {
    id: "WFT-3_4",
    model: "WFT",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 125,
    capacity: 200,
    image: "https://i.ebayimg.com/images/g/prIAAOSwf05XOzmi/s-l1200.jpg"
  },
  {
    id: "FT-1_2",
    model: "FT",
    size: "1/2\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 225,
    capacity: 150,
    image: "https://integrityelectricdirect.com/wp-content/uploads/2022/10/IMG_0590-scaled.jpg"
  },
  {
    id: "FT601-SS-3_4",
    model: "FT601 (Stainless Steel)",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Stainless Steel",
    maxPMO: 450,
    capacity: 300,
    image: "https://www.yodify.com/cdn-cgi/image/quality=100,fit=scale-down,format=auto/https://cdn-images.yodify.com//productimages/Watson-McDaniel/FT600-FT601-Float-Thermostatic-Steam-Trap/wAJQx/ac2f646c-a737-45c8-a517-c98c5f78f134/FT600-FT601.png"
  },
  {
    id: "FT601-SS-1",
    model: "FT601 (Stainless Steel)",
    size: "1\"",
    type: "Float & Thermostatic",
    material: "Stainless Steel",
    maxPMO: 450,
    capacity: 400,
    image: "https://www.yodify.com/cdn-cgi/image/quality=100,fit=scale-down,format=auto/https://cdn-images.yodify.com//productimages/Watson-McDaniel/FT600-FT601-Float-Thermostatic-Steam-Trap/wAJQx/cf91e4ac-e628-413a-9400-e0e6075e769d/FT600-FT601-Float-Thermostatic-Steam-Trap.png"
  },
  {
    id: "FT600-CS-3_4",
    model: "FT600 (Cast Steel)",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Cast Steel",
    maxPMO: 450,
    capacity: 300,
    image: "https://www.yodify.com/cdn-cgi/image/quality=100,fit=scale-down,format=auto/https://cdn-images.yodify.com//productimages/Watson-McDaniel/FT600-FT601-Float-Thermostatic-Steam-Trap/wAJQx/ac2f646c-a737-45c8-a517-c98c5f78f134/FT600-FT601.png"
  },
  {
    id: "FT600-CS-1",
    model: "FT600 (Cast Steel)",
    size: "1\"",
    type: "Float & Thermostatic",
    material: "Cast Steel",
    maxPMO: 450,
    capacity: 400,
    image: "https://www.yodify.com/cdn-cgi/image/quality=100,fit=scale-down,format=auto/https://cdn-images.yodify.com//productimages/Watson-McDaniel/FT600-FT601-Float-Thermostatic-Steam-Trap/wAJQx/cf91e4ac-e628-413a-9400-e0e6075e769d/FT600-FT601-Float-Thermostatic-Steam-Trap.png"
  },
  {
    id: "USIB450-1_2",
    model: "USIB450",
    size: "1/2\"",
    type: "Inverted Bucket",
    material: "Cast Iron",
    maxPMO: 450,
    capacity: 100,
    image: "https://www.watsonmcdaniel.com/Images/Product1/SubProduct5/TabDetial/Uni-Module-dimension-USIB450-1.jpg"
  },
  {
    id: "USIB450-3_4",
    model: "USIB450",
    size: "3/4\"",
    type: "Inverted Bucket",
    material: "Cast Iron",
    maxPMO: 450,
    capacity: 150,
    image: "https://www.watsonmcdaniel.com/Images/Product1/SubProduct5/TabDetial/Uni-Module-dimension-USIB450-1.jpg"
  },
  {
    id: "FTT-065-1_2",
    model: "FTT-065",
    size: "1/2\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 65,
    capacity: 150,
    image: "https://cdn.radwell.com/productgoogleimages/d9103ca08b124aaf90549ebc125795cc.jpg"
  },
  {
    id: "FTT-145-3_4",
    model: "FTT-145",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 145,
    capacity: 250,
    image: "https://i.ebayimg.com/images/g/2RIAAeSwyNhntKBA/s-l1200.jpg"
  },
  {
    id: "FTT-225-1",
    model: "FTT-225",
    size: "1\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 225,
    capacity: 350,
    image: "https://sbindustrialsupply.com/wp-content/uploads/imported/1/11/NEW-WATSON-MCDANIEL-FTT-225-STEAM-TRAP-FTT225-173918413111.JPG"
  },
  {
    id: "WFT-015-3_4",
    model: "WFT-015",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 15,
    capacity: 100,
    image: "https://www.watsonmcdaniel.com/Images/steamtraps/WFT/Capacity-Chart-WFT.png"
  },
  {
    id: "WFT-030-1",
    model: "WFT-030",
    size: "1\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 30,
    capacity: 150,
    image: "https://www.watsonmcdaniel.com/Images/steamtraps/WFT/Capacity-Chart-WFT.png"
  },
  {
    id: "WFT-075-1_1_2",
    model: "WFT-075",
    size: "1 1/2\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 75,
    capacity: 300,
    image: "https://www.watsonmcdaniel.com/Images/steamtraps/WFT/Capacity-Chart-WFT.png"
  },
  {
    id: "FT3-015-13-N-3_4",
    model: "FT3-015-13-N",
    size: "3/4\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 15,
    capacity: 100,
    image: "https://www.watsonmcdaniel.com/Images/steamtraps/FT/Capacity-Chart-FT.png"
  },
  {
    id: "FT4-015-14-N-1",
    model: "FT4-015-14-N",
    size: "1\"",
    type: "Float & Thermostatic",
    material: "Cast Iron",
    maxPMO: 15,
    capacity: 150,
    image: "https://integrityelectricdirect.com/wp-content/uploads/2022/10/IMG_0590-scaled.jpg"
  }
];