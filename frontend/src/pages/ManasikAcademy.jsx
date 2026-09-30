import React, { useState } from "react";
import {
  BookOpen,
  Compass,
  HeartHandshake,
  HelpCircle,
  AlertTriangle,
  MapPin,
  ChevronDown,
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";

const ManasikPage = () => {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState("umrah"); // umrah, hajj, duas, ziyarat, masail, faq

  // Font Size Control State (Accessibility Feature)
  const [fontSize, setFontSize] = useState("normal"); // normal, large, xlarge

  // Copied State for Duas
  const [copiedId, setCopiedId] = useState(null);

  // FAQ Accordion Open State
  const [openFaq, setOpenFaq] = useState(null);

  // Font Class Helper
  const getFontSizeClass = () => {
    if (fontSize === "large") return "text-base";
    if (fontSize === "xlarge") return "text-lg";
    return "text-sm";
  };

  // Copy Handler
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. UMRAH STEPS DATA
  const umrahSteps = [
    {
      step: "01",
      titleUrdu: "احرام (احرام، نیت اور تلبیہ)",
      titleEn: "Ihram & Niyyat",
      desc: "Meeqat se pehle Ihram pehanna, 2 Rakat Nafl parhna aur Umrah ki niyyat karke Talbiyah pukarana.",
      duaArabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
      duaUrdu: "اے اللہ! میں عمرہ ki niyyat karta hoon, ise mere liye aasan farma aur qabul farma.",
      pabandiyan: ["Khaas khushbu lagana mana hai", "Naakhun aur baal katna mana hai", "Mardon ke liye silay hue kapde mana hain"],
      ghaltiyan: "Meeqat cross karne ke baad bina Ihram ke aage nikal jana.",
    },
    {
      step: "02",
      titleUrdu: "طواف (طوافِ عمرہ)",
      titleEn: "Tawaf-e-Umrah",
      desc: "Hajar-e-Aswad se shuru karke Khana Kaaba ke 7 chakkar lagana aur Maqam-e-Ibrahim par 2 Rakat Namaz parhna.",
      duaArabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      duaUrdu: "اے ہمارے رب! ہمیں دنیا me bhi bhalai de aur aakhirat me bhi bhalai de.",
      pabandiyan: ["Bina Wuzu Tawaf nahi hota", "Rukn-e-Yamani par sirf haath lagayein, kiss na karein"],
      ghaltiyan: "Chakkar ki ginti me bhool jana aur Hatim ke andar se guzar jana.",
    },
    {
      step: "03",
      titleUrdu: "سعی (صفا و مروہ)",
      titleEn: "Sa'i (Safa & Marwah)",
      desc: "Safa pahadi se shuru karke Marwah tak 7 chakkar lagana (Safa se Marwah 1, Marwah se Safa 2).",
      duaArabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ",
      duaUrdu: "Beshak Safa aur Marwah Allah ki nishaniyon me se hain.",
      pabandiyan: ["Mard hazraat green lights ke darmiyan tez chalein (Raml)"],
      ghaltiyan: "Safa se Marwah aur wapis Safa ko 1 chakkar samajhna.",
    },
    {
      step: "04",
      titleUrdu: "حلق یا قصر",
      titleEn: "Halq / Taqsir",
      desc: "Mardon ke liye sar ke baal mundwana (Halq) ya katwana (Taqsir). Khawatein 1 inch baal katein.",
      duaArabic: "اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ",
      duaUrdu: "Aaiye Allah! Baal mundwane walon aur katwane walon par raham farma.",
      pabandiyan: ["Jab tak baal na kat jayein Ihram ki pabandiyan barkarar rehti hain"],
      ghaltiyan: "Khud baal kaatne se pehle Ihram ke kapde utar dena.",
    },
  ];

  // 2. HAJJ DAYS DATA
  const hajjDays = [
    {
      day: "8 Zil-Hijjah",
      title: "Mina Me Qayam",
      desc: "Ihram pehan kar Mina rawana hona. Zohr, Asr, Maghrib, Isha aur agle din ki Fajr Mina me ada karna.",
    },
    {
      day: "9 Zil-Hijjah",
      title: "Arafat (Wuquf) & Muzdalifah",
      desc: "Hajj ka sabse ahem rukn (Wuquf-e-Arafat). Suraj dhalne ke baad Muzdalifah rawana hona aur raat wahan guzarna.",
    },
    {
      day: "10 Zil-Hijjah",
      title: "Rami, Qurbani, Halq & Tawaf",
      desc: "Bade Shaitan (Jamarat al-Aqaba) ko kankariyan marna, Qurbani karna, Baal katwana, aur Tawaf-e-Ziyarat karna.",
    },
    {
      day: "11-13 Zil-Hijjah",
      title: "Rami aur Mina Me Qayam",
      desc: "Teeno Shaitanon ko rozana kankariyan marna aur Mina me qayam karna.",
    },
    {
      day: "Rukhsat",
      title: "Tawaf-e-Wida",
      desc: "Makkah chhodne se pehle aakhri alwada'ee Tawaf karna (Wajib).",
    },
  ];

  // 3. DUAS DATA
  const duasList = [
    {
      id: 1,
      title: "Talbiyah (تلبیہ)",
      arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْکَ لاَ شَرِيكَ لَکَ",
      urdu: "Main hazir hoon, Aaiye Allah main hazir hoon. Tera koi sharik nahi. Beshak tamam tareefein aur neematain teri hain aur badshahi teri hai.",
    },
    {
      id: 2,
      title: "Tawaf Ki Dua (طواف کی دعا)",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      urdu: "Aaiye hamare Rab! Humein duniya me bhi bhalai de aur aakhirat me bhi bhalai de aur hamein aag ke azab se bacha.",
    },
    {
      id: 3,
      title: "Maidan-e-Arafat Ki Dua (عرفات کی دعا)",
      arabic: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْکُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى کُلِّ شَيْءٍ قَدِيرٌ",
      urdu: "Allah ke siwa koi mabood nahi, woh akele hain, unka koi sharik nahi, usi ki badshahi hai aur sab tareef usi ke liye hai.",
    },
  ];

  // 4. ZIYARAT DATA
  const ziyaratPlaces = [
    {
      name: "Masjid al-Haram (مکہ مکرمہ)",
      desc: "Duniya ki sabse muqaddas masjid jahan Khana Kaaba waqay hai. Ek namaz ka sawab 1 lakh namazon ke barabar hai.",
      adab: "Khushbu lagakar jayein, namaziyon ke aage se na guzrein.",
    },
    {
      name: "Ghar-e-Hira (غارِ حراء)",
      desc: "Jabal-e-Noor par waqay woh muqaddas ghar jahan Nabi S.A.W. par pehli wahi nazil hui thi.",
      adab: "Pahad chadhte waqt ihtiyat aur safai ka khayal rakhein.",
    },
    {
      name: "Masjid Nabawi (مدینہ منورہ)",
      desc: "Nabi Kareem S.A.W. ki masjid aur Aap S.A.W. ka Roza-e-Athar. Ek namaz ka sawab 1,000 namazon ke barabar hai.",
      adab: "Aawaz meethi aur dhimi rakhein, khushu-o-khuzu qaaim rakhein.",
    },
    {
      name: "Masjid Quba (مسجد قباء)",
      desc: "Islam ki pehli masjid. Yahan wuzu karke 2 Rakat Nafl parhna ek Umrah ke barabar sawab rakhta hai.",
      adab: "Ghar ya hotel se wuzu karke rawana hon.",
    },
  ];

  // 5. FAQ DATA
  const faqs = [
    {
      q: "Kya khawatein bina Mahram ke Hajj ya Umrah par ja sakti hain?",
      a: "Jadeed fiqhi aara aur Saudi rules ke mutabiq safe group ke sath khawatein ja sakti hain, lekin apne maslak ke aalim se zaroor tasdeeq karein.",
    },
    {
      q: "Agar Ihram me ghalti se khushbu lag jaye toh kya hoga?",
      a: "Thodi khushbu ya ghalti se lagne par Sadqah aur zyada lagne par Dam (qurbani) wajib hota hai.",
    },
    {
      q: "Buzurgon ya marizon ke liye Rami (kankari marna) ka kya hukm hai?",
      a: "Buzurg ya shdeed mariz kisi doosre shakhs ko apna naib bana kar kankariyan marwa sakte hain.",
    },
  ];

 return (
  <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 pb-24">
    {/* 2. QUICK NAVIGATION TABS (Horizontally Scrollable on Mobile) */}
    <div className="sticky sm:top-0 lg:top-5 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center lg:justify-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "umrah", label: "Umrah Guide", icon: BookOpen },
          { id: "hajj", label: "Hajj Guide", icon: Compass },
          { id: "duas", label: "Duaen", icon: HeartHandshake },
          { id: "ziyarat", label: "Muqaddas Maqamat", icon: MapPin },
          { id: "masail", label: "Masail & Ghaltiyan", icon: AlertTriangle },
          { id: "faq", label: "FAQ", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* MAIN CONTENT AREA */}
    <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8">
      {/* 3. UMRAH STEP-BY-STEP GUIDE */}
      {activeTab === "umrah" && (
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">🕋</span> Umrah Ke 4 Arkan (Timeline Guide)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tafseeli marahil, masnoon duaen aur bachtay hue aam ghaltiyan.
            </p>
          </div>

          <div className="space-y-6">
            {umrahSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 space-y-4 shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.titleEn}</h3>
                      <p className="text-sm font-serif text-emerald-700 dir-rtl">{item.titleUrdu}</p>
                    </div>
                  </div>
                </div>

                <p className={`text-slate-600 ${getFontSizeClass()}`}>{item.desc}</p>

                {/* MASNOON DUA CARD */}
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    🤲 Masnoon Dua:
                  </p>
                  <p className="text-xl font-serif text-emerald-950 dir-rtl">{item.duaArabic}</p>
                  <p className="text-xs text-slate-600 italic">"{item.duaUrdu}"</p>
                </div>

                {/* PABANDIYAN & GHALTIYAN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-800">Pabandiyan & Hidayat:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {item.pabandiyan.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl space-y-1">
                    <p className="font-bold text-rose-700">⚠️ Aam Ghalti:</p>
                    <p className="text-slate-600">{item.ghaltiyan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HAJJ STEP-BY-STEP GUIDE & TYPES */}
      {activeTab === "hajj" && (
        <div className="space-y-8">
          {/* TYPES OF HAJJ */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>Hajj Ki 3 Iqsām (انواعِ حج)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-emerald-800 text-sm">1. Hajj-e-Tamattu (حجِ تمتع)</h4>
                <p className="text-slate-600">Pehle Umrah karke Ihram khol dena, phir 8 Zil-Hijjah ko dobara Hajj ka Ihram pehanna (Sabse aam).</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-amber-800 text-sm">2. Hajj-e-Qiran (حجِ قران)</h4>
                <p className="text-slate-600">Umrah aur Hajj dono ka ek sath Ihram pehanna aur beech me Ihram na kholna.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-emerald-800 text-sm">3. Hajj-e-Ifrad (حجِ افراد)</h4>
                <p className="text-slate-600">Sirf Hajj ka Ihram pehanna (Isme Umrah shamil nahi hota).</p>
              </div>
            </div>
          </div>

          {/* DAY BY DAY HAJJ */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Hajj Ke Din-ba-Din Marahil</h3>
            <div className="space-y-4">
              {hajjDays.map((h, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {h.day}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{h.title}</h4>
                    <p className={`text-slate-600 ${getFontSizeClass()}`}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. DUAS SECTION */}
      {activeTab === "duas" && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">🤲 Masnoon Duaen</h2>
            <p className="text-xs text-slate-500 mt-1">Arabic text, Urdu tarjuma aur copy option.</p>
          </div>

          <div className="space-y-4">
            {duasList.map((dua) => (
              <div
                key={dua.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-800">{dua.title}</h3>
                  <button
                    onClick={() => handleCopy(dua.arabic, dua.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 transition cursor-pointer"
                    title="Copy Arabic Dua"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Large Arabic Font */}
                <p className="text-2xl sm:text-3xl font-serif text-slate-900 text-right leading-loose dir-rtl">
                  {dua.arabic}
                </p>

                <p className={`text-slate-600 italic border-t border-slate-100 pt-2 ${getFontSizeClass()}`}>
                  "{dua.urdu}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MUQADDAS MAQAMAT (ZIYARAT) */}
      {activeTab === "ziyarat" && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">🕌 Muqaddas Maqamat (Ziyarat)</h2>
            <p className="text-xs text-slate-500 mt-1">Makkah aur Madinah ki tareekhi va muqaddas jagahen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ziyaratPlaces.map((z, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{z.name}</span>
                  </h3>
                  <p className={`text-slate-600 ${getFontSizeClass()}`}>{z.desc}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-emerald-800">Adab: </span>
                  {z.adab}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. MASAIL AUR GHALTIYAN */}
      {activeTab === "masail" && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">⚖️ Masail & Fidyah Rules</h2>
            <p className="text-xs text-slate-500 mt-1">Ihram ki pabandiyan aur unka kaffarah/dam.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-white border border-rose-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <h3 className="font-bold text-rose-700 text-base">Ihram Ki Pabandiyan</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Khushbu daar sabun ya perfume istemal karna</li>
                <li>Mardon ka sar ya chehra dhakna</li>
                <li>Baal ya naakhun kaatna</li>
                <li>Shikaar karna ya jangal ke darakht kaatna</li>
              </ul>
            </div>

            <div className="bg-white border border-amber-200 p-5 rounded-2xl space-y-2 shadow-sm">
              <h3 className="font-bold text-amber-800 text-base">Dam / Fidyah Ke Bunyadi Masail</h3>
              <p className="text-slate-600">
                Kisi wajib ke chhootne ya shdeed mamnoo amal par **Dam (Qurbani)** wajib hoti hai. Chhoti ghaltiyon par **Sadqah (Sadqah-e-Fitr ke barabar)** dena hota hai.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. FAQ SECTION (ACCORDION) */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">❓ Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Khawatein, buzurgon aur aam sawalat ke jawabat.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between transition hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openFaq === idx ? "rotate-180 text-emerald-700" : "text-slate-400"
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  </div>
);
};

export default ManasikPage;