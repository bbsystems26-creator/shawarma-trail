import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("places").first();
    if (existing) {
      return "Data already seeded";
    }

    const places = [
      // Tel Aviv
      { name: "שווארמה אמיל", slug: "shawarma-emil-tlv", address: "רחוב הכרמל 14, תל אביב", city: "תל אביב", region: "center" as const, lat: 32.0668, lng: 34.7702, kashrut: "none" as const, meatTypes: ["lamb", "beef"], style: ["laffa", "pita"], priceRange: 2 as const, avgRating: 4.7, reviewCount: 342, isFeatured: true, description: "שווארמה אגדית בלב שוק הכרמל. הבשר נחתך דק ומוגש עם תוספות טריות." },
      { name: "שווארמה הזקן והים", slug: "hazaken-veahayam", address: "רחוב דיזנגוף 88, תל אביב", city: "תל אביב", region: "center" as const, lat: 32.0785, lng: 34.7740, kashrut: "regular" as const, meatTypes: ["beef", "turkey"], style: ["laffa", "plate"], priceRange: 2 as const, avgRating: 4.3, reviewCount: 198, isFeatured: false, description: "שווארמה משובחת עם רטבים ביתיים." },
      { name: "מלך השווארמה", slug: "melech-hashawarma-tlv", address: "רחוב אלנבי 52, תל אביב", city: "תל אביב", region: "center" as const, lat: 32.0636, lng: 34.7696, kashrut: "none" as const, meatTypes: ["lamb", "mixed"], style: ["laffa", "pita", "plate"], priceRange: 3 as const, avgRating: 4.5, reviewCount: 276, isFeatured: true, description: "שווארמה פרימיום עם בשר כבש איכותי על האש." },

      // Jerusalem
      { name: "מושאבק", slug: "mushabak-jerusalem", address: "רחוב שלומציון 7, ירושלים", city: "ירושלים", region: "jerusalem" as const, lat: 31.7800, lng: 35.2230, kashrut: "mehadrin" as const, meatTypes: ["lamb", "beef"], style: ["laffa", "pita"], priceRange: 2 as const, avgRating: 4.8, reviewCount: 521, isFeatured: true, description: "המקום המיתולוגי של ירושלים. שווארמה בלאפה ענקית שלא תשכחו." },
      { name: "שווארמה אלראזי", slug: "alrazi-jerusalem", address: "רחוב סלאח א-דין 22, ירושלים", city: "ירושלים", region: "jerusalem" as const, lat: 31.7834, lng: 35.2325, kashrut: "none" as const, meatTypes: ["lamb"], style: ["laffa", "plate"], priceRange: 1 as const, avgRating: 4.6, reviewCount: 389, isFeatured: false, description: "שווארמת כבש אותנטית במזרח ירושלים." },
      { name: "שווארמה מחנה יהודה", slug: "machane-yehuda-shawarma", address: "שוק מחנה יהודה, ירושלים", city: "ירושלים", region: "jerusalem" as const, lat: 31.7850, lng: 35.2127, kashrut: "regular" as const, meatTypes: ["beef", "turkey"], style: ["pita", "plate"], priceRange: 2 as const, avgRating: 4.2, reviewCount: 156, isFeatured: false, description: "שווארמה טרייה בלב השוק." },

      // Haifa
      { name: "שווארמה פאדי", slug: "fadi-haifa", address: "רחוב חורי 12, חיפה", city: "חיפה", region: "north" as const, lat: 32.8134, lng: 34.9959, kashrut: "none" as const, meatTypes: ["lamb", "beef", "mixed"], style: ["laffa", "pita", "plate"], priceRange: 1 as const, avgRating: 4.9, reviewCount: 612, isFeatured: true, description: "נחשבת לאחת השווארמות הטובות בארץ. הבשר עסיסי, הלאפה טרייה, והמחיר הוגן." },
      { name: "שווארמה אבו חסן", slug: "abu-hassan-haifa", address: "ואדי ניסנאס, חיפה", city: "חיפה", region: "north" as const, lat: 32.8095, lng: 34.9920, kashrut: "none" as const, meatTypes: ["lamb"], style: ["laffa"], priceRange: 1 as const, avgRating: 4.4, reviewCount: 201, isFeatured: false, description: "שווארמת כבש מסורתית בלב ואדי ניסנאס." },

      // Nazareth
      { name: "שווארמה דיאנא", slug: "diana-nazareth", address: "רחוב פאולוס השישי 51, נצרת", city: "נצרת", region: "north" as const, lat: 32.6996, lng: 35.3035, kashrut: "none" as const, meatTypes: ["lamb", "beef"], style: ["laffa", "pita", "plate"], priceRange: 2 as const, avgRating: 4.7, reviewCount: 445, isFeatured: true, description: "מסעדה מיתולוגית בנצרת עם שווארמה שאין כמוה." },

      // Akko
      { name: "חומוס סעיד ושווארמה", slug: "said-akko", address: "העיר העתיקה, עכו", city: "עכו", region: "north" as const, lat: 32.9214, lng: 35.0686, kashrut: "none" as const, meatTypes: ["lamb", "mixed"], style: ["laffa", "pita"], priceRange: 1 as const, avgRating: 4.5, reviewCount: 334, isFeatured: false, description: "שילוב מנצח של חומוס ושווארמה בעיר העתיקה." },

      // Beer Sheva
      { name: "שווארמה הנגב", slug: "hanegev-beersheva", address: "רחוב הרצל 30, באר שבע", city: "באר שבע", region: "south" as const, lat: 31.2518, lng: 34.7913, kashrut: "regular" as const, meatTypes: ["beef", "turkey"], style: ["pita", "laffa"], priceRange: 1 as const, avgRating: 4.3, reviewCount: 178, isFeatured: false, description: "שווארמה כשרה משובחת בבירת הנגב." },
      { name: "אבו לאפי באר שבע", slug: "abu-lafi-beersheva", address: "שדרות רגר 44, באר שבע", city: "באר שבע", region: "south" as const, lat: 31.2490, lng: 34.7925, kashrut: "mehadrin" as const, meatTypes: ["beef"], style: ["laffa", "plate"], priceRange: 2 as const, avgRating: 4.1, reviewCount: 95, isFeatured: false, description: "לאפה ענקית עם שווארמה כשרה מהדרין." },

      // Ramat Gan
      { name: "שווארמה ביראם", slug: "biram-ramat-gan", address: "רחוב ביאליק 60, רמת גן", city: "רמת גן", region: "center" as const, lat: 32.0832, lng: 34.8128, kashrut: "regular" as const, meatTypes: ["beef", "lamb"], style: ["laffa", "pita"], priceRange: 2 as const, avgRating: 4.6, reviewCount: 287, isFeatured: true, description: "שווארמה קלאסית ברמת גן עם תור שתמיד שווה." },

      // Bnei Brak
      { name: "שווארמה המלך בני ברק", slug: "hamelech-bnei-brak", address: "רחוב רבי עקיבא 88, בני ברק", city: "בני ברק", region: "center" as const, lat: 32.0855, lng: 34.8344, kashrut: "badatz" as const, meatTypes: ["beef", "turkey"], style: ["pita", "laffa"], priceRange: 2 as const, avgRating: 4.4, reviewCount: 312, isFeatured: false, description: "שווארמה כשרה בד\"ץ עם הכשר מהודר." },

      // Petah Tikva
      { name: "שווארמה דוד", slug: "david-petah-tikva", address: "רחוב הרצל 1, פתח תקווה", city: "פתח תקווה", region: "center" as const, lat: 32.0841, lng: 34.8878, kashrut: "regular" as const, meatTypes: ["beef", "mixed"], style: ["laffa", "plate"], priceRange: 1 as const, avgRating: 4.2, reviewCount: 143, isFeatured: false, description: "שווארמה ביתית בפתח תקווה." },

      // Ashdod
      { name: "שווארמה אשדוד", slug: "shawarma-ashdod", address: "רחוב הנשיא 15, אשדוד", city: "אשדוד", region: "shfela" as const, lat: 31.8044, lng: 34.6553, kashrut: "mehadrin" as const, meatTypes: ["beef", "turkey"], style: ["pita", "laffa"], priceRange: 2 as const, avgRating: 4.0, reviewCount: 87, isFeatured: false, description: "שווארמה כשרה מהדרין באשדוד." },

      // Tiberias
      { name: "שווארמה הכנרת", slug: "hakinneret-tiberias", address: "רחוב הגליל 5, טבריה", city: "טבריה", region: "north" as const, lat: 32.7959, lng: 35.5312, kashrut: "regular" as const, meatTypes: ["lamb", "beef"], style: ["laffa", "pita"], priceRange: 1 as const, avgRating: 4.3, reviewCount: 167, isFeatured: false, description: "שווארמה עם נוף לכנרת." },

      // Eilat
      { name: "שווארמה אילת", slug: "shawarma-eilat", address: "שדרות התמרים 8, אילת", city: "אילת", region: "south" as const, lat: 29.5569, lng: 34.9517, kashrut: "regular" as const, meatTypes: ["beef", "turkey"], style: ["pita", "plate"], priceRange: 3 as const, avgRating: 3.8, reviewCount: 65, isFeatured: false, description: "שווארמה דרומית באילת." },

      // Netanya
      { name: "שווארמה נתניה", slug: "shawarma-netanya", address: "רחוב הרצל 22, נתניה", city: "נתניה", region: "center" as const, lat: 32.3286, lng: 34.8567, kashrut: "regular" as const, meatTypes: ["beef", "mixed"], style: ["laffa", "pita"], priceRange: 2 as const, avgRating: 4.1, reviewCount: 112, isFeatured: false, description: "שווארמה טובה בלב נתניה." },

      // Kfar Saba
      { name: "שווארמה על האש", slug: "al-haesh-kfar-saba", address: "רחוב ויצמן 70, כפר סבא", city: "כפר סבא", region: "center" as const, lat: 32.1782, lng: 34.9073, kashrut: "regular" as const, meatTypes: ["lamb", "beef"], style: ["fire", "laffa"], priceRange: 3 as const, avgRating: 4.5, reviewCount: 198, isFeatured: true, description: "שווארמה על האש הגלילית — חוויה אחרת לגמרי." },

      // Carmiel
      { name: "שווארמה כרמיאל", slug: "shawarma-carmiel", address: "מרכז מסחרי, כרמיאל", city: "כרמיאל", region: "north" as const, lat: 32.9136, lng: 35.2961, kashrut: "regular" as const, meatTypes: ["beef"], style: ["pita"], priceRange: 1 as const, avgRating: 4.0, reviewCount: 76, isFeatured: false, description: "שווארמה פשוטה וטעימה בכרמיאל." },

      // Ashkelon
      { name: "שווארמה אשקלון", slug: "shawarma-ashkelon", address: "רחוב הנשיא 3, אשקלון", city: "אשקלון", region: "shfela" as const, lat: 31.6688, lng: 34.5743, kashrut: "mehadrin" as const, meatTypes: ["beef", "turkey"], style: ["pita", "laffa"], priceRange: 1 as const, avgRating: 4.2, reviewCount: 134, isFeatured: false, description: "שווארמה כשרה באשקלון." },

      // Rehovot
      { name: "שווארמה רחובות", slug: "shawarma-rehovot", address: "רחוב הרצל 100, רחובות", city: "רחובות", region: "center" as const, lat: 31.8948, lng: 34.8113, kashrut: "regular" as const, meatTypes: ["beef", "mixed"], style: ["laffa", "pita", "plate"], priceRange: 2 as const, avgRating: 4.3, reviewCount: 145, isFeatured: false, description: "שווארמה מגוונת ברחובות." },

      // Herzliya
      { name: "שווארמה הרצליה", slug: "shawarma-herzliya", address: "רחוב סוקולוב 11, הרצליה", city: "הרצליה", region: "center" as const, lat: 32.1629, lng: 34.8447, kashrut: "none" as const, meatTypes: ["lamb", "beef"], style: ["laffa", "plate"], priceRange: 3 as const, avgRating: 4.4, reviewCount: 167, isFeatured: false, description: "שווארמה גורמה בהרצליה." },

      // Lod
      { name: "שווארמה אבו גוש", slug: "abu-gosh-lod", address: "רחוב הרצל 5, לוד", city: "לוד", region: "center" as const, lat: 31.9514, lng: 34.8957, kashrut: "none" as const, meatTypes: ["lamb", "mixed"], style: ["laffa"], priceRange: 1 as const, avgRating: 4.6, reviewCount: 234, isFeatured: true, description: "שווארמת כבש מיתולוגית בלוד." },

      // Umm al-Fahm
      { name: "שווארמה אום אל פחם", slug: "shawarma-umm-al-fahm", address: "רחוב ראשי, אום אל-פחם", city: "אום אל-פחם", region: "north" as const, lat: 32.5195, lng: 35.1526, kashrut: "none" as const, meatTypes: ["lamb"], style: ["laffa", "pita"], priceRange: 1 as const, avgRating: 4.7, reviewCount: 289, isFeatured: false, description: "שווארמת כבש אותנטית ערבית." },

      // Rishon LeZion
      { name: "שווארמה ראשון", slug: "shawarma-rishon", address: "רחוב רוטשילד 50, ראשון לציון", city: "ראשון לציון", region: "center" as const, lat: 31.9730, lng: 34.7925, kashrut: "regular" as const, meatTypes: ["beef", "turkey"], style: ["pita", "laffa"], priceRange: 2 as const, avgRating: 4.1, reviewCount: 98, isFeatured: false, description: "שווארמה כשרה בראשון לציון." },

      // Safed
      { name: "שווארמה צפת", slug: "shawarma-safed", address: "העיר העתיקה, צפת", city: "צפת", region: "north" as const, lat: 32.9646, lng: 35.4962, kashrut: "mehadrin" as const, meatTypes: ["beef"], style: ["pita"], priceRange: 2 as const, avgRating: 4.0, reviewCount: 56, isFeatured: false, description: "שווארמה כשרה מהדרין בצפת העתיקה." },

      // Yaffo
      { name: "שווארמה יפו", slug: "shawarma-yafo", address: "רחוב יפת 30, יפו", city: "יפו", region: "center" as const, lat: 32.0522, lng: 34.7563, kashrut: "none" as const, meatTypes: ["lamb", "beef", "mixed"], style: ["laffa", "pita", "plate", "fire"], priceRange: 2 as const, avgRating: 4.8, reviewCount: 478, isFeatured: true, description: "שווארמה על האש ביפו העתיקה — חוויה קולינרית." },
    ];

    for (const place of places) {
      await ctx.db.insert("places", {
        ...place,
        phone: "03-" + Math.floor(1000000 + Math.random() * 9000000),
        whatsapp: undefined,
        website: undefined,
        hasDelivery: Math.random() > 0.4,
        hasSeating: Math.random() > 0.3,
        openingHours: {
          sunday: "10:00-23:00",
          monday: "10:00-23:00",
          tuesday: "10:00-23:00",
          wednesday: "10:00-23:00",
          thursday: "10:00-23:00",
          friday: "10:00-15:00",
          saturday: place.kashrut === "none" ? "19:00-23:00" : "סגור",
        },
        images: [],
        menuUrl: undefined,
        isVerified: Math.random() > 0.5,
        claimedBy: undefined,
      });
    }

    return `Seeded ${places.length} shawarma places!`;
  },
});
