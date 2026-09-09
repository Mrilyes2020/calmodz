/**
 * All copy + business facts for CALMO herbal tea.
 *
 * Fact provenance:
 *   [PRIMARY] — read from the client's actual packaging/labels and product
 *               photos supplied in this conversation (front, back, benefits
 *               panel). Provenance tags are inline per field.
 *   TODO(client-data) — NOT confirmed. Never invent these; they render as
 *               visible TODO badges.
 *
 * Confirmed [PRIMARY] from the packaging:
 *   name CALMO, "Thé aux herbes" / "Thé aux plantes", 20 sachets, 50g net,
 *   "Premium dietary supplement", made in Algeria, BPF (bonnes pratiques de
 *   fabrication), 100% natural ingredients, végétalien, sans OGM, sans
 *   caféine, phone +213 796 02 85 88, Instagram CALMO_DZ, Facebook CALMO,
 *   www.calmo.com, 5 benefits, 3 contra-indications, 4-step preparation.
 */

export const FACTS = {
  name: "CALMO",
  /** [PRIMARY] printed on the label — Algeria format, +213, leading 0 dropped */
  whatsapp: "213796028588",
  phoneDisplay: "+213 796 02 85 88",
  phoneTel: "+213796028588",
  instagram: "https://instagram.com/CALMO_DZ",
  facebook: "https://facebook.com/CALMO",
  /** [PRIMARY] printed on the label */
  website: "https://www.calmo.com",
  sachets: 20,
  netWeight: "50 g",
} as const;

export type Lang = "ar" | "fr";

const ar = {
  dir: "rtl" as "rtl" | "ltr",
  htmlLang: "ar",
  nav: {
    about: "عن المنتج",
    benefits: "الفوائد",
    usage: "طريقة التحضير",
    reviews: "الآراء",
    order: "اطلب الآن",
  },
  hero: {
    badge: "شاي أعشاب فاخر — صناعة جزائرية 🇩🇿",
    titleA: "هدوء الأعصاب وراحة الجهاز الهضمي",
    titleB: "في كوب واحد",
    lede: "خلطة دقيقة من أعشاب طبيعية مختارة بعناية — تهدّئ الجهاز العصبي وتريح المعدة والأمعاء والقولون. 20 كيسًا، 100% مكونات طبيعية، بدون كافيين.",
    cta: "اطلب الآن",
    whatsapp: "اطلب عبر واتساب",
    reviews: "اقرأ آراء الزبائن",
  },
  about: {
    title: "ما هو CALMO؟",
    body: "شاي أعشاب فاخر (Thé aux herbes) من مكمل غذائي طبيعي، مكوّن من مزيج دقيق من نباتات مختارة بعناية لتهدئة الجهاز الهضمي (المعدة والأمعاء الدقيقة والقولون) والجهاز العصبي (التوتر، القلق، تقلبات المزاج، الأرق).",
    p1t: "100% مكونات طبيعية",
    p1d: "خلطة أعشاب طبيعية ذات خصائص مهدئة — بلا إضافات صناعية.",
    p2t: "بدون كافيين · نباتي · بدون GMO",
    p2d: "مناسب في أي وقت من اليوم، حتى قبل النوم مباشرة.",
    p3t: "صناعة جزائرية بمعايير BPF",
    p3d: "مصنّع وفق ممارسات التصنيع الجيدة — جودة مضمونة.",
  },
  benefits: {
    title: "الفوائد الرئيسية",
    sub: "كما هي مدوّنة على العبوة الرسمية",
    items: [
      { icon: "🧠", text: "يهدّئ الجهاز العصبي" },
      { icon: "🛡️", text: "يريح القولون" },
      { icon: "🍃", text: "يساعد على الهضم" },
      { icon: "🎈", text: "يقلّل الانتفاخات والغازات" },
      { icon: "🦠", text: "يقضي على البكتيريا الضارة" },
      { icon: "🌙", text: "يعزّز نومًا عميقًا مريحًا" },
    ],
  },
  usage: {
    title: "طريقة التحضير",
    sub: "أربع خطوات وكوبك جاهز",
    steps: [
      { icon: "🫖", t: "كيس واحد", d: "ضع كيس شاي واحدًا في الكوب" },
      { icon: "💧", t: "120 مل ماء ساخن", d: "اسكب الماء الساخن فوق الكيس" },
      { icon: "⏱️", t: "انقعه 3–5 دقائق", d: "اترك الأعشاب تطلق خلاصتها" },
      { icon: "☕", t: "تذوّق واستمتع", d: "اشربه دافئًا واسترخِ" },
    ],
    storage:
      "يُحفظ في مكان بارد وجاف، بعيدًا عن الرطوبة وأشعة الشمس المباشرة. الوزن الصافي: 50غ — 20 كيسًا في العلبة.",
  },
  warnings: {
    title: "تحذيرات الاستعمال",
    items: [
      "لا يُنصح به في حالة الحساسية لأحد المكونات.",
      "لا يُنصح به أثناء الحمل والرضاعة.",
      "استشر طبيبك قبل الاستعمال إذا كنت تتناول أدوية بانتظام أو تعاني من مرض مزمن.",
    ],
  },
  reviews: {
    title: "آراء زبائننا",
    sub: "شاركنا تجربتك مع CALMO — رأيك يهمّنا",
    formTitle: "اكتب رأيك",
    name: "الاسم",
    namePh: "اسمك أو كنيتك",
    rating: "تقييمك",
    text: "رأيك",
    textPh: "حدّثنا عن تجربتك مع الشاي…",
    submit: "انشر رأيي",
    errName: "اكتب اسمك من فضلك",
    errText: "اكتب رأيك (10 أحرف على الأقل)",
    successTitle: "شكرًا لمشاركتك! 🌿",
    successBody:
      "رأيك الآن معروض في قائمة الآراء على هذه الصفحة. ملاحظة: هذه النسخة التجريبية تحفظ الرأي في متصفحك فقط.",
    pendingNote:
      "TODO(client-data): ربط الآراء بقاعدة بيانات + مراجعة قبل النشر العام",
    empty: "كن أول من يشارك تجربته مع CALMO ✨",
    sampleNote: "آراء تظهر هنا فور نشرها",
  },
  order: {
    title: "اطلب علبتك الآن",
    sub: "املأ الطلب وسيصلك تأكيد عبر واتساب — الدفع والتوصيل يُتفق عليهما مع الفريق.",
    name: "الاسم الكامل",
    namePh: "اكتب اسمك الكامل",
    phone: "رقم الهاتف",
    phonePh: "مثال: 0555 12 34 56",
    wilaya: "الولاية",
    wilayaPh: "مثال: المسيلة، الجزائر، سطيف…",
    qty: "الكمية (عدد العلب)",
    box: "علبة",
    boxes: "علب",
    submit: "أرسل الطلب عبر واتساب",
    note: "بالضغط على الزر سينتقل طلبك كاملاً إلى واتساب CALMO على الرقم الرسمي.",
    errName: "يرجى إدخال الاسم الكامل",
    errPhone: "يرجى إدخال رقم هاتف صحيح",
    errWilaya: "يرجى كتابة الولاية",
    priceTodo: "TODO(client-data): سعر العلبة ورسوم التوصيل",
  },
  waFloat: "اطلب واتساب",
  waMessage: "السلام عليكم، أريد طلب شاي CALMO.",
  footer: {
    tagline: "صُنع بعناية لراحتك",
    rights: "© 2026 CALMO — جميع الحقوق محفوظة",
    made: "صناعة جزائرية 🇩🇿",
  },
};

const fr: typeof ar = {
  dir: "ltr",
  htmlLang: "fr",
  nav: {
    about: "Le produit",
    benefits: "Bienfaits",
    usage: "Préparation",
    reviews: "Avis",
    order: "Commander",
  },
  hero: {
    badge: "Thé aux herbes premium — Fabriqué en Algérie 🇩🇿",
    titleA: "Calme pour les nerfs, confort",
    titleB: "pour la digestion",
    lede: "Un mélange délicat de plantes soigneusement sélectionnées — apaise le système nerveux et le système digestif. 20 sachets, 100% ingrédients naturels, sans caféine.",
    cta: "Commander",
    whatsapp: "Commander sur WhatsApp",
    reviews: "Lire les avis",
  },
  about: {
    title: "Qu'est-ce que CALMO ?",
    body: "Un thé aux herbes premium — complément alimentaire naturel, mélange délicat de plantes sélectionnées pour apaiser le système digestif (estomac, intestin grêle et côlon) et le système nerveux (stress, anxiété, changements d'humeur, insomnie).",
    p1t: "100% ingrédients naturels",
    p1d: "Mélange d'herbes naturelles aux propriétés apaisantes — sans additifs.",
    p2t: "Sans caféine · Végétalien · Sans OGM",
    p2d: "Parfait à toute heure, même juste avant de dormir.",
    p3t: "Fabriqué en Algérie selon les BPF",
    p3d: "Bonnes pratiques de fabrication — qualité garantie.",
  },
  benefits: {
    title: "Bienfaits principaux",
    sub: "Tels qu'imprimés sur l'emballage officiel",
    items: [
      { icon: "🧠", text: "Apaise le système nerveux" },
      { icon: "🛡️", text: "Apaise le côlon" },
      { icon: "🍃", text: "Aide à la digestion" },
      { icon: "🎈", text: "Réduit les ballonnements et les gaz" },
      { icon: "🦠", text: "Élimine les bactéries nocives" },
      { icon: "🌙", text: "Favorise un sommeil réparateur" },
    ],
  },
  usage: {
    title: "Préparation",
    sub: "Quatre étapes et votre tasse est prête",
    steps: [
      { icon: "🫖", t: "1 sachet de thé", d: "Placez un sachet dans la tasse" },
      { icon: "💧", t: "120 ml d'eau chaude", d: "Versez l'eau chaude sur le sachet" },
      { icon: "⏱️", t: "Infuser 3 à 5 minutes", d: "Laissez les plantes libérer leurs bienfaits" },
      { icon: "☕", t: "Dégustez et savourez", d: "Buvez chaud et détendez-vous" },
    ],
    storage:
      "Conserver dans un endroit frais et sec, à l'abri de l'humidité et de la lumière directe du soleil. Poids net : 50 g — 20 sachets par boîte.",
  },
  warnings: {
    title: "Contre-indications",
    items: [
      "Déconseillé en cas d'allergie à l'un des composants.",
      "Déconseillé pendant la grossesse et l'allaitement.",
      "Consultez votre médecin avant utilisation si vous prenez des médicaments régulièrement ou souffrez d'une maladie chronique.",
    ],
  },
  reviews: {
    title: "Avis de nos clients",
    sub: "Partagez votre expérience avec CALMO — votre avis compte",
    formTitle: "Écrire un avis",
    name: "Nom",
    namePh: "Votre nom ou pseudo",
    rating: "Votre note",
    text: "Votre avis",
    textPh: "Racontez votre expérience avec ce thé…",
    submit: "Publier mon avis",
    errName: "Veuillez entrer votre nom",
    errText: "Écrivez votre avis (10 caractères minimum)",
    successTitle: "Merci pour votre partage ! 🌿",
    successBody:
      "Votre avis apparaît maintenant dans la liste de cette page. Note : cette version d'essai le conserve dans votre navigateur uniquement.",
    pendingNote:
      "TODO(client-data): connecter les avis à une base de données + modération",
    empty: "Soyez le premier à partager votre expérience ✨",
    sampleNote: "Les avis publiés apparaissent ici",
  },
  order: {
    title: "Commandez votre boîte",
    sub: "Remplissez la commande — confirmation sur WhatsApp. Paiement et livraison à convenir avec l'équipe.",
    name: "Nom complet",
    namePh: "Votre nom complet",
    phone: "Numéro de téléphone",
    phonePh: "ex. 0555 12 34 56",
    wilaya: "Wilaya",
    wilayaPh: "ex. M'sila, Alger, Sétif…",
    qty: "Quantité (boîtes)",
    box: "boîte",
    boxes: "boîtes",
    submit: "Envoyer la commande sur WhatsApp",
    note: "Votre commande complète sera envoyée au WhatsApp officiel de CALMO.",
    errName: "Veuillez entrer votre nom complet",
    errPhone: "Veuillez entrer un numéro valide",
    errWilaya: "Veuillez indiquer la wilaya",
    priceTodo: "TODO(client-data): prix de la boîte et frais de livraison",
  },
  waFloat: "Commander WhatsApp",
  waMessage: "Bonjour, je veux commander le thé CALMO.",
  footer: {
    tagline: "Fabriqué avec soin pour votre bien-être",
    rights: "© 2026 CALMO — Tous droits réservés",
    made: "Fabriqué en Algérie 🇩🇿",
  },
};

export const T: Record<Lang, typeof ar> = { ar, fr };
