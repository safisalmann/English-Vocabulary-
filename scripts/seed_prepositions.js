import fs from 'fs';

// 265 Curated Appropriate Preposition Questions for BCS, Bank & Competitive Exams
const items = [
  {
    q: "He is senior _____ me by two years.",
    target: "senior to",
    opts: ["than", "to", "from", "with"],
    ans: "b",
    meaning: "senior to - বয়সে বা চাকুরিতে জ্যেষ্ঠ",
    exp: "ল্যাটিন কম্পারেটিভ (senior, junior, superior, inferior, prior, anterior, posterior) এর পর comparative 'than' না বসে সর্বদাই 'to' বসে।",
    exam: "38th BCS, Primary Teacher 2022"
  },
  {
    q: "I prefer milk _____ tea.",
    target: "prefer to",
    opts: ["than", "more than", "to", "over"],
    ans: "c",
    meaning: "prefer ... to - বেশি পছন্দ করা",
    exp: "Prefer-এর পর দুটি জিনিসের মধ্যে অধিক পছন্দ বোঝাতে comparative preposition 'to' ব্যবহৃত হয়, 'than' নয়।",
    exam: "41st BCS, 10th BCS"
  },
  {
    q: "Death is preferable _____ dishonour.",
    target: "preferable to",
    opts: ["than", "to", "from", "for"],
    ans: "b",
    meaning: "preferable to - অধিকতর শ্রেয় বা পছন্দনীয়",
    exp: "Preferable শব্দটি নিজেই comparative অর্থ প্রকাশ করে এবং এর পরে সর্বদা preposition 'to' বসে। এর আগে more বা less বসে না।",
    exam: "35th BCS, Combined 5 Banks 2019"
  },
  {
    q: "The man died _____ cancer after a prolonged illness.",
    target: "die of",
    opts: ["from", "by", "of", "for"],
    ans: "c",
    meaning: "die of - রোগে মারা যাওয়া",
    exp: "কোনো রোগে মারা গেলে 'die of' বসে (যেমন: died of cancer/cholera/malaria)। কোনো দুর্ঘটনা বা আঘাতে মারা গেলে 'die from/by' বসে।",
    exam: "24th BCS, 13th BCS"
  },
  {
    q: "He died _____ overeating at the feast.",
    target: "die from",
    opts: ["of", "from", "by", "for"],
    ans: "b",
    meaning: "die from - কোনো কারণের প্রতিক্রিয়ায় বা অতিরিক্ত কিছুতে মারা যাওয়া",
    exp: "অতিরিক্ত খাওয়া (overeating), অতিশ্রম (overwork), আঘাত বা ক্ষত (wound) থেকে মারা গেলে 'die from' বসে।",
    exam: "32nd BCS, Bangladesh Bank AD 2018"
  },
  {
    q: "The freedom fighters died _____ their beloved country.",
    target: "die for",
    opts: ["of", "by", "for", "with"],
    ans: "c",
    meaning: "die for - মহৎ উদ্দেশ্যে বা দেশের জন্য জীবন দেওয়া",
    exp: "দেশ, বিশ্বাস বা মহৎ উদ্দেশ্যে আত্মত্যাগ করলে 'die for' বসে (যেমন: die for the country/cause)।",
    exam: "37th BCS, Primary Teacher 2019"
  },
  {
    q: "He died _____ poison in an unfortunate tragedy.",
    target: "die by",
    opts: ["by", "of", "from", "through"],
    ans: "a",
    meaning: "die by - বিষপান বা অপঘাতে মৃত্যু",
    exp: "বিষপান (poison) বা আত্মহত্যা (suicide) বা সহিংসতার শিকার হয়ে মারা গেলে 'die by' ব্যবহৃত হয়।",
    exam: "28th BCS, Pubali Bank SO 2020"
  },
  {
    q: "You must abide _____ the established rules and regulations.",
    target: "abide by",
    opts: ["with", "by", "in", "to"],
    ans: "b",
    meaning: "abide by - মেনে চলা",
    exp: "নিয়ম, আইন বা নির্দেশ মেনে চলা অর্থে 'abide by' বসে। কারো সাথে বাস করা অর্থে 'abide with' এবং কোনো স্থানে বাস করা অর্থে 'abide in' বসে।",
    exam: "33rd BCS, Sonali Bank Officer 2019"
  },
  {
    q: "Students should abstain _____ smoking and bad company.",
    target: "abstain from",
    opts: ["to", "from", "in", "of"],
    ans: "b",
    meaning: "abstain from - বিরত থাকা",
    exp: "Abstain, refrain, desist ইত্যাদি বিরত থাকা অর্থবোধক verb-এর পর preposition 'from' বসে এবং পরবর্তী verb-এর সাথে ing যুক্ত হয়।",
    exam: "36th BCS, Janata Bank EO 2020"
  },
  {
    q: "The Chairman acceded _____ our collective request.",
    target: "accede to",
    opts: ["with", "for", "to", "on"],
    ans: "c",
    meaning: "accede to - প্রস্তাবে বা দাবিতে সম্মত হওয়া",
    exp: "কোনো প্রস্তাব বা অনুরোধে সম্মতি দেওয়া বা সম্মত হওয়া বোঝাতে 'accede to' বসে।",
    exam: "31st BCS, NSI Assistant Director 2021"
  },
  {
    q: "He was accused _____ theft by the local authority.",
    target: "accused of",
    opts: ["for", "with", "of", "about"],
    ans: "c",
    meaning: "accused of - অভিযোগে অভিযুক্ত",
    exp: "কোনো অপরাধে অভিযুক্ত বোঝাতে 'accused of' বসে। অপরপক্ষে চার্জ গঠনের ক্ষেত্রে 'charged with' ব্যবহৃত হয়।",
    exam: "15th BCS, Agrani Bank Officer 2018"
  },
  {
    q: "The defendant was acquitted _____ all criminal charges.",
    target: "acquitted of",
    opts: ["from", "of", "with", "by"],
    ans: "b",
    meaning: "acquitted of - অভিযোগ থেকে বেকসুর খালাসপ্রাপ্ত",
    exp: "আদালত কর্তৃক অভিযোগ থেকে নিষ্কৃতি বা খালাস পাওয়া বোঝাতে 'acquitted of' বসে।",
    exam: "29th BCS, Judicial Service Exam 2017"
  },
  {
    q: "I am not acquainted _____ that distinguished gentleman.",
    target: "acquainted with",
    opts: ["to", "with", "by", "about"],
    ans: "b",
    meaning: "acquainted with - পরিচিত বা অবগত",
    exp: "কারো সাথে পরিচয় থাকা বা কোনো বিষয়ে অবগত থাকা বোঝাতে 'acquainted with' ব্যবহৃত হয়।",
    exam: "21st BCS, Sub-Inspector Exam 2019"
  },
  {
    q: "He has easily adapted himself _____ the new climatic condition.",
    target: "adapt to",
    opts: ["with", "in", "to", "for"],
    ans: "c",
    meaning: "adapt to - খাপ খাওয়ানো বা মানিয়ে নেওয়া",
    exp: "নতুন পরিবেশ বা পরিস্থিতির সাথে নিজেকে মানিয়ে নেওয়া অর্থে 'adapt to' বসে।",
    exam: "30th BCS, Combined 7 Banks SO 2021"
  },
  {
    q: "The reckless boy is addicted _____ gambling.",
    target: "addicted to",
    opts: ["with", "for", "to", "in"],
    ans: "c",
    meaning: "addicted to - খারাপ কাজে বা নেশায় আসক্ত",
    exp: "মাদক, জুয়া বা খারাপ কোনো অভ্যাসে আসক্ত হওয়া বোঝাতে 'addicted to' বসে। ভালো কাজে আত্মনিয়োগ বোঝাতে 'devoted to' বসে।",
    exam: "14th BCS, Primary Teacher 2018"
  },
  {
    q: "His residence is adjacent _____ the main highway.",
    target: "adjacent to",
    opts: ["to", "with", "by", "near"],
    ans: "a",
    meaning: "adjacent to - সংলগ্ন বা নিকটে অবস্থিত",
    exp: "কোনো কিছুর ঠিক পাশেই অবস্থিত বা সংলগ্ন বোঝাতে adjective 'adjacent'-এর পর 'to' বসে।",
    exam: "26th BCS, Biman Bangladesh Exam 2022"
  },
  {
    q: "The wounded soldier was admitted _____ the district hospital.",
    target: "admitted to",
    opts: ["in", "into", "to", "at"],
    ans: "c",
    meaning: "admit to - হাসপাতালে বা শিক্ষাপ্রতিষ্ঠানে ভর্তি করা",
    exp: "হাসপাতাল, স্কুল বা কলেজে ভর্তি করার ক্ষেত্রে 'admitted to' বসে। স্থান পাওয়ার যোগ্য অর্থে 'admit of' বসে।",
    exam: "39th BCS, Health Cadre Exam 2019"
  },
  {
    q: "Your reckless conduct admits _____ no excuse.",
    target: "admit of",
    opts: ["to", "of", "for", "with"],
    ans: "b",
    meaning: "admit of - সুযোগ থাকা বা স্থান পাওয়া",
    exp: "'Admit of' একটি গ্রুপ ভার্ব যার অর্থ অবকাশ বা সুযোগ থাকা (Your conduct admits of no excuse = তোমার আচরণের ক্ষমার সুযোগ নেই)।",
    exam: "27th BCS, Dhaka University 'A' Unit"
  },
  {
    q: "She has deep affection _____ her younger siblings.",
    target: "affection for",
    opts: ["to", "towards", "for", "with"],
    ans: "c",
    meaning: "affection for - কারো প্রতি স্নেহ বা মমতা",
    exp: "Noun হিসেবে 'affection for' বসে, কিন্তু Adjective হিসেবে 'affectionate to' বসে।",
    exam: "18th BCS, BBA Admission 2020"
  },
  {
    q: "A mother is always affectionate _____ her beloved child.",
    target: "affectionate to",
    opts: ["for", "to", "with", "at"],
    ans: "b",
    meaning: "affectionate to - কারো প্রতি স্নেহশীল",
    exp: "Adjective 'affectionate'-এর পরে সর্বদা 'to' বসে (She is affectionate to all her children)।",
    exam: "22nd BCS, Sonali Bank Officer 2018"
  },
  {
    q: "Children are naturally afraid _____ ghosts in the dark.",
    target: "afraid of",
    opts: ["from", "to", "with", "of"],
    ans: "d",
    meaning: "afraid of - ভীত বা শঙ্কিত",
    exp: "কোনো ব্যক্তি বা বস্তুকে ভয় পাওয়া অর্থে 'afraid of' ব্যবহৃত হয়।",
    exam: "11th BCS, Primary Assistant Teacher 2020"
  },
  {
    q: "I entirely agree _____ you on this crucial matter.",
    target: "agree with",
    opts: ["to", "with", "on", "at"],
    ans: "b",
    meaning: "agree with (a person) - কোনো ব্যক্তির সাথে একমত হওয়া",
    exp: "কোনো ব্যক্তির সাথে একমত হলে 'agree with' বসে। কোনো প্রস্তাবে সম্মত হলে 'agree to' এবং কোনো বিষয়ে একমত হলে 'agree on' বসে।",
    exam: "25th BCS, 12th BCS"
  },
  {
    q: "The committee finally agreed _____ the innovative proposal.",
    target: "agree to",
    opts: ["with", "to", "for", "upon"],
    ans: "b",
    meaning: "agree to (a proposal) - প্রস্তাবে সম্মত হওয়া",
    exp: "কোনো প্রস্তাব, পরিকল্পনা বা শর্তে সম্মত হওয়া বোঝাতে 'agree to' ব্যবহৃত হয়।",
    exam: "34th BCS, Bangladesh Railway Exam 2021"
  },
  {
    q: "They could not agree _____ the terms of the contract.",
    target: "agree on",
    opts: ["on", "with", "to", "for"],
    ans: "a",
    meaning: "agree on (a matter/point) - কোনো বিষয়ে মতৈক্যে পৌঁছানো",
    exp: "কোনো নির্দিষ্ট বিষয় বা পয়েন্টে সকলে একমত হওয়া বোঝাতে 'agree on' বসে।",
    exam: "40th BCS, Agrani Bank Senior Officer 2019"
  },
  {
    q: "The hunter aimed his rifle _____ the ferocious tiger.",
    target: "aim at",
    opts: ["to", "towards", "at", "on"],
    ans: "c",
    meaning: "aim at - লক্ষ্য স্থির করা",
    exp: "কোনো কিছুর দিকে লক্ষ্য স্থির করা বা নিশানা দাগা অর্থে 'aim at' বসে।",
    exam: "17th BCS, Police Sub-Inspector 2020"
  },
  {
    q: "His rude behaviour is akin _____ outright insolence.",
    target: "akin to",
    opts: ["with", "to", "of", "from"],
    ans: "b",
    meaning: "akin to - সদৃশ বা একই জাতীয়",
    exp: "Similar to বা একই রকম বোঝাতে Adjective 'akin'-এর পরে সর্বদা 'to' বসে।",
    exam: "37th BCS, DU 'B' Unit Admission"
  },
  {
    q: "The sudden loud explosion alarmed everybody _____ the building.",
    target: "alarm at",
    opts: ["at", "with", "by", "for"],
    ans: "a",
    meaning: "alarmed at - কোনো ঘটনায় শঙ্কিত বা আতঙ্কিত",
    exp: "কোনো অপ্রত্যাশিত সংবাদ বা আকস্মিক বিপদের শব্দে ভীত হওয়া বোঝাতে 'alarmed at' বসে।",
    exam: "23rd BCS, Rupali Bank Officer 2018"
  },
  {
    q: "A specific quota was allotted _____ the underprivileged candidates.",
    target: "allot to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "allot to - নির্দিষ্ট অংশের জন্য বরাদ্দ করা",
    exp: "কাউকে নির্দিষ্ট অংশ বা দায়িত্ব বরাদ্দ করে দেওয়া বোঝাতে 'allot to' বসে।",
    exam: "30th BCS, Auditor CGDF 2021"
  },
  {
    q: "A true scholar stays aloof _____ petty political squabbles.",
    target: "aloof from",
    opts: ["of", "to", "from", "with"],
    ans: "c",
    meaning: "aloof from - দূরে বা নির্লিপ্ত থাকা",
    exp: "কোনো অসৎ পরিবেশ বা কলহ থেকে দূরে থাকা বোঝাতে 'aloof from' বসে।",
    exam: "34th BCS, Tax Officer Exam 2020"
  },
  {
    q: "He has a noble ambition _____ public service.",
    target: "ambition for",
    opts: ["of", "for", "to", "in"],
    ans: "b",
    meaning: "ambition for - কোনো মহৎ অর্জনের উচ্চাকাঙ্ক্ষা",
    exp: "Noun 'ambition'-এর পর সাধারণত 'for' বসে (ambition for fame/glory), কিন্তু ambitious (adjective)-এর পর 'of' বসে (ambitious of power)।",
    exam: "16th BCS, NBR Assistant Revenue Officer"
  },
  {
    q: "The teacher was angry _____ the mischievous boy.",
    target: "angry with",
    opts: ["at", "with", "on", "against"],
    ans: "b",
    meaning: "angry with (a person) - কারো উপর রাগান্বিত হওয়া",
    exp: "কোনো ব্যক্তির ওপর রাগান্বিত হলে 'angry with' বসে। কিন্তু কারো খারাপ আচরণ বা কাজের ওপর রাগ হলে 'angry at/about' বসে।",
    exam: "20th BCS, 10th BCS"
  },
  {
    q: "She was terribly angry _____ his unpunctual behavior.",
    target: "angry at",
    opts: ["with", "at", "on", "towards"],
    ans: "b",
    meaning: "angry at (conduct/thing) - আচরণ বা ঘটনার ওপর ক্ষুব্ধ",
    exp: "ব্যক্তির পরিবর্তে কারো কাজকর্ম বা আচরণের ওপর ক্রুদ্ধ হলে 'angry at' বা 'angry about' ব্যবহৃত হয়।",
    exam: "27th BCS, Combined 4 Banks Officer 2020"
  },
  {
    q: "Every citizen is accountable _____ the law of the land.",
    target: "accountable to",
    opts: ["for", "to", "with", "at"],
    ans: "b",
    meaning: "accountable to - কারো কাছে বা কর্তৃপক্ষের কাছে জবাবদিহিমূলক",
    exp: "কারো কাছে বা কোনো বিধানের কাছে জবাবদিহি করতে বাধ্য হওয়া অর্থে 'accountable to' বসে, এবং কোনো কাজের জন্য হলে 'accountable for' বসে।",
    exam: "41st BCS, Bangladesh Bank AD 2022"
  },
  {
    q: "You are directly answerable _____ your misconduct.",
    target: "answerable for",
    opts: ["to", "for", "of", "about"],
    ans: "b",
    meaning: "answerable for - কোনো কর্মকাণ্ডের জন্য দায়ী বা দায়বদ্ধ",
    exp: "কোনো কাজের জন্য দায়ী হওয়া বোঝাতে 'answerable for' এবং ঊর্ধ্বতন ব্যক্তির কাছে হলে 'answerable to' বসে।",
    exam: "35th BCS, Ministry of Foreign Affairs"
  },
  {
    q: "He apologized _____ his superior for arriving late.",
    target: "apologize to",
    opts: ["with", "to", "for", "at"],
    ans: "b",
    meaning: "apologize to (someone) - কারো কাছে ক্ষমা প্রার্থনা করা",
    exp: "ব্যক্তির কাছে মাফ চাওয়া বোঝাতে 'apologize to', আর যে ভুলের জন্য মাফ চাওয়া হয় তার আগে 'for' বসে (apologize to someone for something)।",
    exam: "38th BCS, Primary Teacher 2021"
  },
  {
    q: "The prisoner appealed _____ the verdict of the trial court.",
    target: "appeal against",
    opts: ["for", "against", "to", "with"],
    ans: "b",
    meaning: "appeal against - কোনো রায় বা আদেশের বিরুদ্ধে উচ্চ আদালতে আপিল করা",
    exp: "কোনো অন্যায্য রায় বা আদেশের বিরুদ্ধে প্রতিকার চেয়ে উচ্চ আদালতে যাওয়া অর্থে 'appeal against' বসে।",
    exam: "29th BCS, Judicial Service Exam 2018"
  },
  {
    q: "A sick child rarely has any appetite _____ food.",
    target: "appetite for",
    opts: ["of", "to", "for", "with"],
    ans: "c",
    meaning: "appetite for - খাওয়ার রুচি বা ক্ষুধা",
    exp: "খাবারের প্রতি ক্ষুধা বা তীব্র আগ্রহ অর্থে 'appetite for' বসে।",
    exam: "22nd BCS, Food Department Exam 2021"
  },
  {
    q: "The enthusiastic candidate applied _____ the vacant post.",
    target: "apply for",
    opts: ["to", "for", "in", "with"],
    ans: "b",
    meaning: "apply for - কোনো পদ বা ছুটির জন্য দরখাস্ত করা",
    exp: "কোনো পদ (post) বা বৃত্তির জন্য আবেদন করলে 'apply for', আর যে ব্যক্তি বা কর্তৃপক্ষের নিকট আবেদন করা হয় তার পূর্বে 'apply to' বসে।",
    exam: "12th BCS, Krishi Bank Officer 2019"
  },
  {
    q: "He was duly appointed _____ the prestigious post of Director.",
    target: "appoint to",
    opts: ["in", "at", "to", "for"],
    ans: "c",
    meaning: "appoint to - কোনো পদে নিয়োগ দেওয়া",
    exp: "কোনো স্থায়ী বা সম্মানিত পদে কাউকে অধিষ্ঠিত বা নিয়োগ করা অর্থে 'appoint to' বসে।",
    exam: "33rd BCS, Cabinet Division Exam 2020"
  },
  {
    q: "The Minister was apprised _____ the urgent ground situation.",
    target: "apprised of",
    opts: ["with", "of", "about", "to"],
    ans: "b",
    meaning: "apprised of - কোনো বিষয়ে অবগত বা অবহিত",
    exp: "কাউকে কোনো তথ্যাদি জানিয়ে সতর্ক বা অবগত করা বোঝাতে 'apprised of' বসে।",
    exam: "36th BCS, Foreign Service Recruitment 2019"
  },
  {
    q: "His sensible remarks are appropriate _____ the occasion.",
    target: "appropriate to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "appropriate to - কোনো বিষয়ের জন্য যথার্থ বা মানানসই",
    exp: "প্রসঙ্গের সাথে সংগতিপূর্ণ বা উপযুক্ত অর্থে 'appropriate to' ব্যবহৃত হয়।",
    exam: "26th BCS, Custom Officer 2017"
  },
  {
    q: "The conservative father did not approve _____ her radical ideas.",
    target: "approve of",
    opts: ["with", "for", "of", "to"],
    ans: "c",
    meaning: "approve of - অনুমোদন করা বা সমর্থন দেওয়া",
    exp: "কোনো সিদ্ধান্ত বা মতামত পছন্দ করা বা সম্মতি জ্ঞাপন অর্থে 'approve of' ব্যবহৃত হয়।",
    exam: "19th BCS, Sonali Bank Officer 2020"
  },
  {
    q: "The talented boy has an innate aptitude _____ mathematics.",
    target: "aptitude for",
    opts: ["in", "for", "to", "at"],
    ans: "b",
    meaning: "aptitude for - সহজাত মেধা বা স্বাভাবিক দক্ষতা",
    exp: "কোনো নির্দিষ্ট বিষয়ে সহজাত মেধা বা ঝোঁক বোঝাতে 'aptitude for' বসে।",
    exam: "31st BCS, DU 'C' Unit 2018"
  },
  {
    q: "Do not argue _____ your elders without proper logic.",
    target: "argue with",
    opts: ["against", "with", "to", "for"],
    ans: "b",
    meaning: "argue with - কারো সাথে বাদানুবাদ করা",
    exp: "ব্যক্তির সাথে তর্ক করলে 'argue with', আর কোনো বিষয়ের পক্ষে বা বিপক্ষে যুক্তি দিলে 'argue for/against' বসে।",
    exam: "17th BCS, Primary Teacher Exam 2022"
  },
  {
    q: "You ought to be ashamed _____ your despicable behavior.",
    target: "ashamed of",
    opts: ["for", "with", "of", "at"],
    ans: "c",
    meaning: "ashamed of - লজ্জিত বা অনুতপ্ত",
    exp: "নিজের কোনো মন্দ কাজ বা আচরণের জন্য লজ্জা প্রকাশ করতে 'ashamed of' বসে।",
    exam: "24th BCS, 14th BCS"
  },
  {
    q: "The helpless beggar asked _____ some warm clothing.",
    target: "ask for",
    opts: ["about", "to", "for", "after"],
    ans: "c",
    meaning: "ask for - কোনো কিছু চাওয়া বা প্রার্থনা করা",
    exp: "কোনো বস্তু বা সাহায্য চাওয়া অর্থে 'ask for' বসে। কুশল জানতে চাওয়া অর্থে 'ask after' বসে।",
    exam: "13th BCS, Janata Bank Officer 2021"
  },
  {
    q: "Young scholars should aspire _____ academic excellence.",
    target: "aspire to",
    opts: ["at", "to", "for", "in"],
    ans: "b",
    meaning: "aspire to / after - উচ্চ কিছু অর্জনের জন্য ব্যাকুল আকাঙ্ক্ষা করা",
    exp: "কোনো মহৎ লক্ষ্য বা সম্মানজনক সাফল্য অর্জনের তীব্র আকাঙ্ক্ষা বোঝাতে 'aspire to' বা 'aspire after' বসে।",
    exam: "37th BCS, Pubali Bank SO 2019"
  },
  {
    q: "The President gave his assent _____ the finance bill.",
    target: "assent to",
    opts: ["for", "on", "to", "with"],
    ans: "c",
    meaning: "assent to - আনুষ্ঠানিক সম্মতি জ্ঞাপন করা",
    exp: "আইন বা বিলে আনুষ্ঠানিক সম্মতি প্রদান অর্থে 'assent to' বসে।",
    exam: "39th BCS, Parliament Secretariat Exam 2020"
  },
  {
    q: "I can firmly assure you _____ our unwavering cooperation.",
    target: "assure of",
    opts: ["about", "of", "with", "for"],
    ans: "b",
    meaning: "assure ... of - কাউকে নিশ্চয়তা বা আশ্বাস দেওয়া",
    exp: "কাউকে কোনো বিষয়ে নিশ্চিত করা অর্থে 'assure (someone) of (something)' কাঠামো ব্যবহৃত হয়।",
    exam: "18th BCS, Biman Bangladesh Exam 2019"
  },
  {
    q: "The entire audience was astonished _____ the magical illusion.",
    target: "astonished at",
    opts: ["by", "at", "with", "to"],
    ans: "b",
    meaning: "astonished at - কোনো দৃশ্যে বা ঘটনায় চমৎকৃত বা বিস্মিত",
    exp: "Astonished, amazed, surprised, shocked ইত্যাদির পর কোনো ঘটনা বা প্রদর্শনীতে বিস্মিত হওয়া বোঝাতে 'at' বসে।",
    exam: "25th BCS, Primary Teacher 2018"
  },
  {
    q: "Please attach this passport photograph _____ the application form.",
    target: "attach to",
    opts: ["with", "to", "in", "on"],
    ans: "b",
    meaning: "attach to - সংযুক্ত করা বা জুড়ে দেওয়া",
    exp: "কোনো দলিলের সাথে অন্য কিছু সংযুক্ত করা বোঝাতে 'attach to' বসে।",
    exam: "20th BCS, Bangladesh Bank Cash Officer 2021"
  },
  {
    q: "A conscientious student must attend _____ his daily lessons.",
    target: "attend to",
    opts: ["to", "at", "with", "upon"],
    ans: "a",
    meaning: "attend to - মনোযোগ দেওয়া",
    exp: "মনোযোগ দেওয়ার ক্ষেত্রে 'attend to' বসে, আর সেবা-শুশ্রূষা করা বোঝাতে 'attend upon' বা 'attend on' বসে।",
    exam: "10th BCS, 21st BCS"
  },
  {
    q: "The loyal nurse attended _____ the critically wounded patient.",
    target: "attend upon",
    opts: ["at", "to", "upon", "for"],
    ans: "c",
    meaning: "attend upon / on - রোগীর সেবা-শুশ্রূষা করা",
    exp: "অসুস্থ ব্যক্তির পরিচর্যা করা বা সেবা দেওয়া বোঝাতে 'attend on' অথবা 'attend upon' বসে।",
    exam: "28th BCS, Senior Staff Nurse Exam 2020"
  },
  {
    q: "You ought to avail yourself _____ this golden opportunity.",
    target: "avail of",
    opts: ["with", "of", "in", "to"],
    ans: "b",
    meaning: "avail oneself of - সুযোগ গ্রহণ বা সদ্ব্যবহার করা",
    exp: "Avail-এর পর সর্বদা reflexive pronoun (myself, yourself, himself) বসে এবং এরপর preposition হিসেবে 'of' বসে।",
    exam: "32nd BCS, 15th BCS"
  },
  {
    q: "He is completely averse _____ strenuous physical labor.",
    target: "averse to",
    opts: ["from", "to", "for", "in"],
    ans: "b",
    meaning: "averse to - কোনো কাজে বিমুখ বা অনিচ্ছুক",
    exp: "Adjective 'averse'-এর পরে সর্বদাই 'to' বসে (averse to hard work)।",
    exam: "30th BCS, Combined 8 Banks Officer 2022"
  },
  {
    q: "We must remain fully aware _____ our environmental responsibilities.",
    target: "aware of",
    opts: ["about", "of", "with", "to"],
    ans: "b",
    meaning: "aware of - সচেতন বা সজাগ",
    exp: "সচেতনতা প্রকাশ করতে 'aware of', 'conscious of', 'sensible of' ব্যবহৃত হয়।",
    exam: "23rd BCS, Primary Teacher 2019"
  },
  {
    q: "The stray dogs barked loudly _____ the unknown stranger.",
    target: "bark at",
    opts: ["to", "at", "on", "towards"],
    ans: "b",
    meaning: "bark at - ঘেউ ঘেউ করা বা তাড়া করা",
    exp: "কুকুর কারো প্রতি ঘেউ ঘেউ করলে 'bark at' বসে।",
    exam: "11th BCS, Police Sergeant 2018"
  },
  {
    q: "This compelling documentary is based _____ factual historical records.",
    target: "based on",
    opts: ["at", "upon", "on", "in"],
    ans: "c",
    meaning: "based on - কোনো তথ্যের ওপর প্রতিষ্ঠিত বা ভিত্তিক",
    exp: "কোনো ভিত্তির ওপর নির্ভর করে কিছু গড়ে ওঠা বোঝাতে 'based on' ব্যবহৃত হয়।",
    exam: "36th BCS, NSI Field Officer 2020"
  },
  {
    q: "I begged a favour _____ my benevolent mentor.",
    target: "beg of",
    opts: ["from", "of", "to", "with"],
    ans: "b",
    meaning: "beg of (someone) - কারো কাছে কোনো অনুগ্রহ প্রার্থনা করা",
    exp: "কারো নিকট কোনো কিছু প্রার্থনা করার ক্ষেত্রে 'beg (something) of (someone)' ব্যবহৃত হয়।",
    exam: "27th BCS, Agrani Bank Officer 2017"
  },
  {
    q: "True believers strongly believe _____ divine justice.",
    target: "believe in",
    opts: ["to", "in", "on", "with"],
    ans: "b",
    meaning: "believe in - কোনো আদর্শ, সত্তা বা বিধানে বিশ্বাস স্থাপন করা",
    exp: "অস্তিত্বে বিশ্বাস করা বা আস্থাশীল হওয়া বোঝাতে 'believe in' বসে। কারো মুখের কথায় বিশ্বাস করা বোঝাতে শুধু 'believe' (without preposition) বসে।",
    exam: "13th BCS, DU 'D' Unit 2019"
  },
  {
    q: "This expansive ancestral property belongs _____ our family.",
    target: "belong to",
    opts: ["with", "to", "in", "for"],
    ans: "b",
    meaning: "belong to - কারো মালিকানাধীন বা অধিকারভুক্ত হওয়া",
    exp: "মালিকানা প্রকাশ করতে 'belong to' বসে (The book belongs to me)।",
    exam: "18th BCS, Primary Assistant Teacher 2022"
  },
  {
    q: "The unruly youth is stubbornly bent _____ making trouble.",
    target: "bent on",
    opts: ["to", "on", "upon", "for"],
    ans: "b",
    meaning: "bent on / upon - কোনো কিছু করতে বদ্ধপরিকর বা সংকল্পবদ্ধ",
    exp: "দৃঢ়প্রতিজ্ঞ হওয়া বোঝাতে 'bent on' বসে এবং এরপর verb+ing রূপ বসে (bent on doing something)।",
    exam: "34th BCS, Sonali Bank Officer 2018"
  },
  {
    q: "The tragic demise left the poor children bereft _____ parental affection.",
    target: "bereft of",
    opts: ["from", "of", "with", "without"],
    ans: "b",
    meaning: "bereft of - কোনো গুণ বা অধিকার থেকে বঞ্চিত",
    exp: "কোনো বিশেষ স্নেহ বা বস্তু থেকে সম্পূর্ণরূপে বঞ্চিত হওয়া অর্থে 'bereft of' বসে।",
    exam: "38th BCS, Dhaka University 'B' Unit"
  },
  {
    q: "The queen bestowed highest honours _____ the valiant general.",
    target: "bestow on",
    opts: ["to", "on", "with", "in"],
    ans: "b",
    meaning: "bestow on / upon - কাউকে কোনো সম্মান বা পুরস্কারে ভূষিত করা",
    exp: "কাউকে কোনো খেতাব বা অনুগ্রহ অর্পণ করা অর্থে 'bestow on' বা 'bestow upon' বসে।",
    exam: "22nd BCS, Ministry of Public Administration"
  },
  {
    q: "Travellers should always beware _____ pickpockets at crowded stations.",
    target: "beware of",
    opts: ["from", "for", "of", "about"],
    ans: "c",
    meaning: "beware of - কোনো বিপদ সম্পর্কে সাবধান বা সতর্ক থাকা",
    exp: "সতর্ক থাকা বোঝাতে 'beware of' প্রবাদপ্রতিমভাবে ব্যবহৃত হয় (যেমন: Beware of pickpockets/dogs)।",
    exam: "16th BCS, Bangladesh Railway Guard 2021"
  },
  {
    q: "The unfortunate beggar was born blind _____ one eye.",
    target: "blind of",
    opts: ["to", "of", "in", "with"],
    ans: "b",
    meaning: "blind of / in - শারীরিকভাবে চোখে অন্ধ",
    exp: "শারীরিকভাবে অন্ধ হলে 'blind of' বা 'blind in one eye' বসে। কিন্তু দোষের প্রতি অন্ধ হওয়া বোঝাতে 'blind to' বসে।",
    exam: "24th BCS, 11th BCS"
  },
  {
    q: "An indulgent father is often blind _____ his son's obvious flaws.",
    target: "blind to",
    opts: ["of", "at", "to", "for"],
    ans: "c",
    meaning: "blind to - দোষত্রুটির প্রতি অন্ধ বা উদাসীন",
    exp: "দোষ দেখতে না পাওয়া বা উদাসীন থাকা অর্থে 'blind to' বসে (blind to one's faults)।",
    exam: "35th BCS, 14th BCS"
  },
  {
    q: "A wise man does not boast _____ his immense wealth.",
    target: "boast of",
    opts: ["with", "for", "about", "of"],
    ans: "d",
    meaning: "boast of - কোনো বিষয়ে গর্ব বা অহংকার প্রকাশ করা",
    exp: "অহংকার প্রকাশ করতে 'boast of' বা 'boast about' বসে। প্রচলিত স্ট্যান্ডার্ড উপযুক্ত প্রিপজিশন হলো 'boast of'।",
    exam: "29th BCS, Primary Teacher 2020"
  },
  {
    q: "Rabindranath Tagore was born _____ an aristocratic family.",
    target: "born in",
    opts: ["of", "to", "in", "at"],
    ans: "c",
    meaning: "born in - পরিবার বা বংশে জন্মগ্রহণ করা",
    exp: "ধনী বা সম্ভ্রান্ত বংশে জন্ম নেওয়া বোঝাতে 'born in a family' এবং পিতামাতার ক্ষেত্রে 'born of parents' বসে।",
    exam: "31st BCS, DU Admission"
  },
  {
    q: "The passenger vessel is bound _____ Singapore.",
    target: "bound for",
    opts: ["to", "towards", "for", "at"],
    ans: "c",
    meaning: "bound for - কোনো নির্দিষ্ট গন্তব্যের উদ্দেশ্যে যাত্রাকারী",
    exp: "কোনো জাহাজ বা ট্রেনের গন্তব্য নির্দেশ করতে 'bound for' ব্যবহৃত হয় (The train is bound for Chattogram)।",
    exam: "19th BCS, Chittagong Port Authority 2020"
  },
  {
    q: "A daring burglar broke _____ the bank at midnight.",
    target: "break into",
    opts: ["in", "through", "into", "up"],
    ans: "c",
    meaning: "break into - জোরপূর্বক বা ভেঙে ঘরে প্রবেশ করা",
    exp: "চুরি বা ডাকাতির উদ্দেশ্যে তালা বা দেয়াল ভেঙে ভেতরে ঢোকা বোঝাতে 'break into' বসে।",
    exam: "15th BCS, 12th BCS"
  },
  {
    q: "Cholera broke _____ in the flood-affected coastal regions.",
    target: "break out",
    opts: ["out", "off", "up", "away"],
    ans: "a",
    meaning: "break out - মহামারী, যুদ্ধ বা অগ্নিকাণ্ড হঠাৎ ছড়িয়ে পড়া",
    exp: "রোগ, মহামারী বা যুদ্ধ হঠাৎ করে ছড়িয়ে পড়লে 'break out' গ্রুপ ভার্ব ব্যবহৃত হয়।",
    exam: "33rd BCS, Health Cadre 2018"
  },
  {
    q: "Overwhelmed with grief, the mother burst _____ tears.",
    target: "burst into",
    opts: ["out", "into", "in", "to"],
    ans: "b",
    meaning: "burst into (tears) - হঠাৎ কান্নায় ভেঙে পড়া",
    exp: "কান্নায় ভেঙে পড়ার ক্ষেত্রে 'burst into tears' বসে। কিন্তু হাসিতে ফেটে পড়ার ক্ষেত্রে 'burst out laughing' বসে।",
    exam: "21st BCS, Primary Teacher 2019"
  },
  {
    q: "Hearing the comical remark, the class burst _____ laughing.",
    target: "burst out",
    opts: ["into", "out", "with", "in"],
    ans: "b",
    meaning: "burst out (laughing) - হঠাৎ উচ্চরবে হাসিতে ফেটে পড়া",
    exp: "Burst out-এর পর সাধারণত gerund (laughing, crying) বসে (He burst out laughing)।",
    exam: "37th BCS, Combined 5 Banks Officer 2019"
  },
  {
    q: "The professor is currently busy _____ preparing lecture notes.",
    target: "busy with",
    opts: ["in", "with", "at", "for"],
    ans: "b",
    meaning: "busy with - কোনো নির্দিষ্ট কাজে ব্যস্ত থাকা",
    exp: "কোনো কাজ নিয়ে ব্যপৃত থাকা বোঝাতে 'busy with' ব্যবহৃত হয়।",
    exam: "18th BCS, Senior Scale Officer 2021"
  },
  {
    q: "The Prime Minister called _____ the President at the Bangabhaban.",
    target: "call on",
    opts: ["at", "on", "for", "in"],
    ans: "b",
    meaning: "call on (someone) - কারো সাথে গিয়ে সাক্ষাৎ করা",
    exp: "কোনো ব্যক্তির সাথে সাক্ষাৎ করা অর্থে 'call on', এবং কোনো স্থানে গিয়ে সাক্ষাৎ করা অর্থে 'call at' বসে।",
    exam: "30th BCS, 20th BCS"
  },
  {
    q: "I called _____ his office yesterday afternoon.",
    target: "call at",
    opts: ["on", "at", "in", "to"],
    ans: "b",
    meaning: "call at (a place) - কোনো স্থানে গিয়ে দেখা করা",
    exp: "কোনো অফিস, বাড়ি বা সুনির্দিষ্ট স্থানে গিয়ে দেখা করার ক্ষেত্রে 'call at' বসে।",
    exam: "36th BCS, Bangladesh Bank AD 2017"
  },
  {
    q: "The gravity of the crisis calls _____ immediate action.",
    target: "call for",
    opts: ["for", "upon", "to", "in"],
    ans: "a",
    meaning: "call for - দাবি করা বা কোনো কিছুর প্রয়োজনীয়তা নির্দেশ করা",
    exp: "কোনো পরিস্থিতি সমাধান বা জরুরি পদক্ষেপের আবশ্যকতা দাবি করতে 'call for' গ্রুপ ভার্ব বসে।",
    exam: "25th BCS, Agrani Bank SO 2020"
  },
  {
    q: "The impending strike was formally called _____ by the union.",
    target: "call off",
    opts: ["out", "off", "away", "up"],
    ans: "b",
    meaning: "call off - প্রত্যাহার বা বাতিল করা",
    exp: "ধর্মঘট, খেলা বা কোনো কর্মসূচি প্রত্যাহার বা বাতিল করা বোঝাতে 'call off' বসে।",
    exam: "38th BCS, Primary Teacher 2022"
  },
  {
    q: "She is thoroughly capable _____ solving complex analytical puzzles.",
    target: "capable of",
    opts: ["to", "in", "of", "for"],
    ans: "c",
    meaning: "capable of - কোনো কিছু সম্পাদনে সক্ষম",
    exp: "Adjective 'capable'-এর পরে সর্বদা 'of' বসে এবং verb-এর সাথে ing যুক্ত হয় (capable of doing)। সক্ষম অর্থে 'able'-এর পর 'to' বসে (able to do)।",
    exam: "26th BCS, 16th BCS"
  },
  {
    q: "A drowning man will always catch _____ a straw.",
    target: "catch at",
    opts: ["with", "to", "at", "for"],
    ans: "c",
    meaning: "catch at - খড়কুটো হলেও আঁকড়ে ধরে বাঁচার চেষ্টা করা",
    exp: "এটি একটি বিখ্যাত ইংরেজি প্রবাদ: 'A drowning man catches at a straw' (মরিতে বসিলে মানুষ খড়কুটোও ধরে)।",
    exam: "12th BCS, 23rd BCS"
  },
  {
    q: "Can you pinpoint the exact cause _____ this unexpected delay?",
    target: "cause of",
    opts: ["for", "of", "to", "in"],
    ans: "b",
    meaning: "cause of - কোনো ঘটনার মূল কারণ",
    exp: "কোনো পরিণতির মূল কারণ বোঝাতে 'cause of' বসে, কিন্তু কোনো পদক্ষেপের যৌক্তিকতা বা কারণ বোঝাতে 'reason for' বা 'cause for concern' বসে।",
    exam: "28th BCS, Rupali Bank Officer 2019"
  },
  {
    q: "He is completely certain _____ securing first place.",
    target: "certain of",
    opts: ["about", "of", "in", "for"],
    ans: "b",
    meaning: "certain of - নিশ্চিত বা নিঃসন্দেহ",
    exp: "কোনো অর্জনের ব্যাপারে নিশ্চিত থাকা বোঝাতে 'certain of' বা 'sure of' বসে।",
    exam: "17th BCS, Sub-Registrar Exam 2020"
  },
  {
    q: "A determined patriot will cling _____ his principles under all circumstances.",
    target: "cling to",
    opts: ["with", "to", "at", "for"],
    ans: "b",
    meaning: "cling to - অবিচলভাবে আঁকড়ে থাকা বা লেগে থাকা",
    exp: "Cling, adhere, stick ইত্যাদির পর কোনো বিশ্বাস বা অবস্থানে অনড় থাকা বোঝাতে 'to' বসে।",
    exam: "35th BCS, DU Admission"
  },
  {
    q: "The library is located very close _____ the science laboratory.",
    target: "close to",
    opts: ["with", "at", "to", "by"],
    ans: "c",
    meaning: "close to - অতি নিকটে",
    exp: "দূরত্বের নৈকট্য প্রকাশ করতে 'close to' বসে (close to the station)।",
    exam: "20th BCS, Primary Teacher 2020"
  },
  {
    q: "The monks were simply clothed _____ coarse woolen robes.",
    target: "clothed in",
    opts: ["with", "in", "by", "of"],
    ans: "b",
    meaning: "clothed in - কোনো পোশাকে আবৃত বা সজ্জিত",
    exp: "পোশাক পরিহিত অবস্থায় থাকা প্রকাশ করতে 'clothed in' বসে।",
    exam: "32nd BCS, Ministry of Education 2019"
  },
  {
    q: "Walking in the market, I unexpectedly came _____ an old childhood companion.",
    target: "come across",
    opts: ["by", "across", "round", "into"],
    ans: "b",
    meaning: "come across - হঠাৎ কারো দেখা বা কোনো কিছুর সন্ধান পাওয়া",
    exp: "হঠাৎ অপ্রত্যাশিতভাবে কারো মুখোমুখি হওয়া বোঝাতে 'come across' ফ্রেজাল ভার্ব ব্যবহৃত হয়।",
    exam: "24th BCS, 14th BCS"
  },
  {
    q: "Anger can be compared _____ a raging fire.",
    target: "compare to",
    opts: ["with", "to", "against", "for"],
    ans: "b",
    meaning: "compare to (dissimilar things) - ভিন্ন জাতীয় জিনিসের সাথে তুলনা করা",
    exp: "ভিন্নধর্মী বস্তুর সাথে তুলনা (রূপক অর্থে) করলে 'compare to' বসে (যেমন: life is compared to a journey)। সমজাতীয় বস্তুর তুলনার ক্ষেত্রে 'compare with' বসে।",
    exam: "31st BCS, 13th BCS"
  },
  {
    q: "Shakespeare may be compared _____ Kalidasa as a dramatist.",
    target: "compare with",
    opts: ["to", "with", "against", "from"],
    ans: "b",
    meaning: "compare with (similar things) - সমজাতীয় বস্তুর তুলনা করা",
    exp: "একই শ্রেণীর দুটি ব্যক্তি বা বিষয়ের গুণাগুণ তুলনা করার ক্ষেত্রে 'compare with' বসে।",
    exam: "27th BCS, 15th BCS"
  },
  {
    q: "The management promised to compensate him _____ the severe financial loss.",
    target: "compensate for",
    opts: ["of", "to", "for", "with"],
    ans: "c",
    meaning: "compensate for - ক্ষতিপূরণ প্রদান করা",
    exp: "ক্ষতির বিপরীতে ক্ষতিপূরণ দেওয়া বোঝাতে 'compensate for' বসে (make up for)।",
    exam: "33rd BCS, Sonali Bank Officer 2018"
  },
  {
    q: "He is thoroughly competent _____ the technical assignment.",
    target: "competent for",
    opts: ["to", "in", "for", "at"],
    ans: "c",
    meaning: "competent for - কোনো পদের জন্য উপযুক্ত বা যোগ্য",
    exp: "কোনো নির্দিষ্ট পদের যোগ্য হওয়া বোঝাতে 'competent for' ব্যবহৃত হয়।",
    exam: "21st BCS, Auditor Exam 2021"
  },
  {
    q: "The tenant complained to the landlord _____ the noisy neighbours.",
    target: "complain against",
    opts: ["against", "of", "for", "to"],
    ans: "a",
    meaning: "complain against (someone) - কারো বিরুদ্ধে নালিশ করা",
    exp: "ব্যক্তির বিরুদ্ধে নালিশ করার ক্ষেত্রে 'complain against', আর কোনো সমস্যা বা কষ্টের কথা জানানো অর্থে 'complain of' বসে।",
    exam: "18th BCS, Primary Teacher 2019"
  },
  {
    q: "He often complains _____ severe headaches in the evening.",
    target: "complain of",
    opts: ["against", "for", "of", "about"],
    ans: "c",
    meaning: "complain of (an illness) - অসুস্থতা বা ব্যথার কথা বলা",
    exp: "কোনো রোগ বা বেদনার কথা প্রকাশ করতে 'complain of' ব্যবহার করাই সর্বাধিক শুদ্ধ।",
    exam: "37th BCS, Health Directorate Exam"
  },
  {
    q: "You are required to comply _____ all official instructions.",
    target: "comply with",
    opts: ["to", "by", "with", "in"],
    ans: "c",
    meaning: "comply with - নিয়ম বা আদেশ মেনে চলা",
    exp: "নির্দেশনা, নিয়ম বা অনুরোধ মেনে চলা বোঝাতে 'comply with' বসে।",
    exam: "34th BCS, 22nd BCS"
  },
  {
    q: "Water is composed _____ hydrogen and oxygen molecules.",
    target: "composed of",
    opts: ["with", "by", "from", "of"],
    ans: "d",
    meaning: "composed of - কোনো উপাদানে গঠিত",
    exp: "কোনো উপাদান বা অংশ নিয়ে গঠিত হওয়া বোঝাতে 'composed of' বা 'consists of' বসে।",
    exam: "11th BCS, 26th BCS"
  },
  {
    q: "I concur _____ you on your diplomatic stance.",
    target: "concur with",
    opts: ["to", "with", "in", "on"],
    ans: "b",
    meaning: "concur with - কারো সাথে একমত হওয়া",
    exp: "ব্যক্তির সাথে একমত হওয়া অর্থে 'concur with', এবং কোনো প্রস্তাবে সম্মতি দেওয়া অর্থে 'concur in' বসে।",
    exam: "39th BCS, BCS Administration Exam 2020"
  },
  {
    q: "We condoled _____ our friend on the bereavement of his father.",
    target: "condole with",
    opts: ["to", "with", "for", "at"],
    ans: "b",
    meaning: "condole with - কারো শোকে সমবেদনা প্রকাশ করা",
    exp: "শোকগ্রস্ত ব্যক্তির সাথে সমবেদনা জ্ঞাপন করতে 'condole with' ব্যবহৃত হয়।",
    exam: "29th BCS, Judicial Exam 2019"
  },
  {
    q: "The captain feels fully confident _____ ultimate triumph.",
    target: "confident of",
    opts: ["for", "about", "of", "in"],
    ans: "c",
    meaning: "confident of - বিজয়ে বা সাফল্যে আস্থাবান",
    exp: "আত্মবিশ্বাসী হওয়া বোঝাতে Adjective 'confident'-এর পরে 'of' বসে। Noun 'confidence'-এর পর 'in' বসে (confidence in someone)।",
    exam: "16th BCS, Primary Teacher 2021"
  },
  {
    q: "The chronic invalid was confined _____ his bedroom for months.",
    target: "confined to",
    opts: ["in", "at", "to", "inside"],
    ans: "c",
    meaning: "confined to - কোনো স্থানে বা বিছানায় সীমাবদ্ধ বা আবদ্ধ",
    exp: "রোগের কারণে বিছানায় বা নির্দিষ্ট স্থানে আবদ্ধ থাকা অর্থে 'confined to bed/room' বসে।",
    exam: "28th BCS, Biman Bangladesh Exam 2018"
  },
  {
    q: "Every civil officer must conform _____ the official code of conduct.",
    target: "conform to",
    opts: ["with", "to", "by", "for"],
    ans: "b",
    meaning: "conform to - নিয়ম বা মানদণ্ড অনুসারে চলা",
    exp: "বিধিমালা বা নীতিমালার সাথে সংগতি রেখে চলা বোঝাতে 'conform to' বসে।",
    exam: "30th BCS, Public Service Commission Exam"
  },
  {
    q: "I heartily congratulated him _____ his brilliant academic victory.",
    target: "congratulate on",
    opts: ["for", "on", "at", "with"],
    ans: "b",
    meaning: "congratulate on - কোনো সাফল্যে অভিনন্দন জানানো",
    exp: "সাফল্যের জন্য অভিনন্দন জানাতে 'congratulate on' বসে, 'for' নয় (congratulate on your success)।",
    exam: "38th BCS, 14th BCS"
  },
  {
    q: "A noble statesman is always conscious _____ his sworn duty.",
    target: "conscious of",
    opts: ["with", "for", "of", "about"],
    ans: "c",
    meaning: "conscious of - স্বীয় কর্তব্য সম্পর্কে সচেতন",
    exp: "সচেতনতা প্রকাশে 'conscious of' বসে।",
    exam: "19th BCS, 23rd BCS"
  },
  {
    q: "The guardian graciously consented _____ the marriage proposal.",
    target: "consent to",
    opts: ["with", "to", "for", "in"],
    ans: "b",
    meaning: "consent to - কোনো প্রস্তাবে সম্মতি প্রদান করা",
    exp: "প্রস্তাব বা অনুরোধে সম্মতি দেওয়া বোঝাতে 'consent to' বসে।",
    exam: "20th BCS, Dhaka Bank MTO 2020"
  },
  {
    q: "True happiness consists _____ contentment of the mind.",
    target: "consist in",
    opts: ["of", "in", "with", "by"],
    ans: "b",
    meaning: "consist in - নিহিত থাকা",
    exp: "কোনো গুণ বা অবস্থায় নিহিত থাকা অর্থে 'consist in' বসে। উপাদান দিয়ে গঠিত হওয়া বোঝাতে 'consist of' বসে।",
    exam: "35th BCS, 17th BCS"
  },
  {
    q: "The administrative panel consists _____ seven eminent scholars.",
    target: "consist of",
    opts: ["in", "with", "of", "by"],
    ans: "c",
    meaning: "consist of - কতিপয় সদস্য বা অংশে গঠিত হওয়া",
    exp: "কোনো দল বা বস্তু কতগুলো সদস্য বা উপাদানে গঠিত হলে 'consist of' বসে।",
    exam: "10th BCS, 24th BCS"
  },
  {
    q: "His reckless action was contrary _____ our explicit counsel.",
    target: "contrary to",
    opts: ["with", "to", "against", "from"],
    ans: "b",
    meaning: "contrary to - বিরোধী বা বিপরীত",
    exp: "কোনো প্রত্যাশা বা উপদেশের বিপরীত হওয়া বোঝাতে 'contrary to' বসে (contrary to expectations)।",
    exam: "33rd BCS, Combined 7 Banks SO 2021"
  },
  {
    q: "All philanthropists generously contributed _____ the relief fund.",
    target: "contribute to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "contribute to - তহবিলে অর্থ সাহায্য বা অবদান রাখা",
    exp: "কোনো তহবিল বা উদ্দেশ্যে অবদান রাখা অর্থে 'contribute to' বসে।",
    exam: "22nd BCS, Primary Teacher 2018"
  },
  {
    q: "The accused criminal was convicted _____ culpable homicide.",
    target: "convict of",
    opts: ["for", "of", "with", "to"],
    ans: "b",
    meaning: "convict of - আদালতে দোষী সাব্যস্ত করা",
    exp: "কোনো নির্দিষ্ট অপরাধের দায়ে দণ্ডপ্রাপ্ত বা দোষী সাব্যস্ত হলে 'convicted of' বসে।",
    exam: "36th BCS, Judicial Service 2020"
  },
  {
    q: "She managed to cope _____ the overwhelming workload.",
    target: "cope with",
    opts: ["up with", "with", "to", "against"],
    ans: "b",
    meaning: "cope with - কোনো কঠিন পরিস্থিতির সাথে মানিয়ে নেওয়া বা সামলানো",
    exp: "সঠিক রূপ হলো 'cope with'। অনেকেই ভুল করে 'cope up with' লেখে, যা ব্যাকরণগতভাবে ভুল।",
    exam: "37th BCS, 21st BCS"
  },
  {
    q: "An ambitious scholar does not crave _____ vulgar publicity.",
    target: "crave for",
    opts: ["after", "for", "to", "in"],
    ans: "b",
    meaning: "crave for / after - তীব্র লালসা বা ব্যাকুল আকাঙ্ক্ষা করা",
    exp: "তীব্র আকাঙ্ক্ষা করা অর্থে 'crave for' বা 'crave after' ব্যবহৃত হয়।",
    exam: "27th BCS, DU 'A' Unit 2019"
  },
  {
    q: "The patient was miraculously cured _____ his fatal ailment.",
    target: "cure of",
    opts: ["from", "of", "with", "by"],
    ans: "b",
    meaning: "cure of - রোগ হতে আরোগ্য লাভ করা",
    exp: "Verb হিসেবে রোগ থেকে আরোগ্য পাওয়া বোঝাতে 'cure of' বসে। কিন্তু Noun হিসেবে ওষুধের ক্ষেত্রে 'cure for' বসে (There is no cure for this disease)।",
    exam: "32nd BCS, 12th BCS"
  },
  {
    q: "The merchant deals _____ imported fine silks and textiles.",
    target: "deal in",
    opts: ["with", "in", "at", "for"],
    ans: "b",
    meaning: "deal in - কোনো পণ্যের ব্যবসা করা",
    exp: "ব্যবসা পরিচালনা করা বোঝাতে 'deal in' বসে (He deals in rice)। কারো সাথে আচরণ করা বা বিষয় আলোচনা করা অর্থে 'deal with' বসে।",
    exam: "31st BCS, 11th BCS"
  },
  {
    q: "The diplomat knows how to deal _____ delicate international disputes.",
    target: "deal with",
    opts: ["in", "with", "for", "at"],
    ans: "b",
    meaning: "deal with - কোনো বিষয় সামলানো, আলোচনা করা বা কারো সাথে আচরণ করা",
    exp: "পরিস্থিতি সামলানো বা আচরণ করা প্রকাশ করতে 'deal with' বসে (deal with customers/problems)।",
    exam: "23rd BCS, Bangladesh Bank AD 2021"
  },
  {
    q: "The panel finally decided _____ a comprehensive course of action.",
    target: "decide on",
    opts: ["to", "in", "upon", "on"],
    ans: "d",
    meaning: "decide on / upon - কোনো বিষয়ে চূড়ান্ত সিদ্ধান্ত গ্রহণ করা",
    exp: "সিদ্ধান্ত গ্রহণ করা অর্থে 'decide on' বা 'decide upon' ব্যবহৃত হয়।",
    exam: "29th BCS, Primary Teacher 2019"
  },
  {
    q: "He dedicated his illustrious life _____ the welfare of the poor.",
    target: "dedicate to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "dedicate to - কোনো মহৎ উদ্দেশ্যে উৎসর্গ করা",
    exp: "উৎসর্গ করা বোঝাতে 'dedicate to', 'devote to' ব্যবহৃত হয় এবং এদের পর noun বা gerund বসে।",
    exam: "15th BCS, 18th BCS"
  },
  {
    q: "The novice is gravely deficient _____ practical field experience.",
    target: "deficient in",
    opts: ["of", "in", "with", "for"],
    ans: "b",
    meaning: "deficient in - কোনো বিষয়ে ঘাটতি থাকা বা কাঁচা হওয়া",
    exp: "ঘাটতি বা অদক্ষতা বোঝাতে 'deficient in' ব্যবহৃত হয় (deficient in knowledge/courage)।",
    exam: "34th BCS, Combined 4 Banks Officer 2020"
  },
  {
    q: "She took great delight _____ reading classical poetry.",
    target: "delight in",
    opts: ["at", "with", "in", "for"],
    ans: "c",
    meaning: "delight in - কোনো কিছুতে পরম আনন্দ উপভোগ করা",
    exp: "আনন্দ লাভ করা প্রকাশে 'delight in' ব্যবহৃত হয় (take delight in something)।",
    exam: "26th BCS, English Lecturer NTRCA 2019"
  },
  {
    q: "Success predominantly depends _____ relentless persevering effort.",
    target: "depend on",
    opts: ["with", "on", "at", "for"],
    ans: "b",
    meaning: "depend on / upon - কারো বা কোনো কিছুর ওপর নির্ভর করা",
    exp: "নির্ভরশীলতা প্রকাশে 'depend on' বা 'depend upon' ব্যবহৃত হয়।",
    exam: "13th BCS, Primary Teacher 2022"
  },
  {
    q: "The tyrant deprived the citizens _____ their fundamental civic liberties.",
    target: "deprived of",
    opts: ["from", "of", "with", "away"],
    ans: "b",
    meaning: "deprived of - কোনো অধিকার বা সুযোগ থেকে বঞ্চিত করা",
    exp: "বঞ্চিত করা বোঝাতে 'deprived of' বসে (deprived of rights/freedom)।",
    exam: "35th BCS, 20th BCS"
  },
  {
    q: "The young artist is passionately desirous _____ global artistic recognition.",
    target: "desirous of",
    opts: ["for", "of", "to", "in"],
    ans: "b",
    meaning: "desirous of - কোনো কিছু পাওয়ার আকাঙ্ক্ষী",
    exp: "Adjective 'desirous'-এর পরে 'of' বসে, কিন্তু Noun 'desire'-এর পরে 'for' বসে (desire for fame)।",
    exam: "14th BCS, 28th BCS"
  },
  {
    q: "Never despair _____ overcoming adverse hardships in life.",
    target: "despair of",
    opts: ["from", "to", "of", "with"],
    ans: "c",
    meaning: "despair of - কোনো ব্যাপারে সম্পূর্ণ নিরাশ বা হতাশ হওয়া",
    exp: "হতাশ হওয়া বোঝাতে 'despair of' বসে (despair of success)।",
    exam: "38th BCS, Biman Flight Cadet Exam"
  },
  {
    q: "His malicious discourse was completely devoid _____ veracity.",
    target: "devoid of",
    opts: ["from", "without", "of", "with"],
    ans: "c",
    meaning: "devoid of - কোনো গুণ বা বৈশিষ্ট্য থেকে শূন্য বা বর্জিত",
    exp: "শূন্য বা বঞ্চিত হওয়া বোঝাতে 'devoid of' বসে (devoid of sense/truth/humanity)।",
    exam: "30th BCS, 17th BCS"
  },
  {
    q: "Mother Teresa devoted herself entirely _____ serving destitutes.",
    target: "devote to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "devote to - নিজেকে কোনো মহৎ উদ্দেশ্যে নিয়োজিত করা",
    exp: "কোনো কাজে আত্মনিয়োগ করা প্রকাশে 'devote to' বসে।",
    exam: "11th BCS, Primary Teacher 2018"
  },
  {
    q: "My point of view differs radically _____ yours on this issue.",
    target: "differ from",
    opts: ["with", "from", "to", "than"],
    ans: "b",
    meaning: "differ from - বৈশিষ্ট্যে বা প্রকৃতিতে ভিন্ন হওয়া",
    exp: "কোনো ব্যক্তি বা বস্তুর সাথে ভিন্ন প্রকৃতির হওয়া অর্থে 'differ from' বসে। কিন্তু কারো সাথে মতের অমিল হওয়া অর্থে 'differ with' বসে।",
    exam: "33rd BCS, Sonali Bank Officer 2019"
  },
  {
    q: "I respectfully differ _____ you concerning the proposed policy.",
    target: "differ with",
    opts: ["from", "with", "against", "to"],
    ans: "b",
    meaning: "differ with (someone) - কারো সাথে ভিন্নমত পোষণ করা",
    exp: "ব্যক্তির সাথে মতৈক্যের অভাব বা মতভেদ বোঝাতে 'differ with' ব্যবহৃত হয়।",
    exam: "25th BCS, Sub-Inspector Exam 2020"
  },
  {
    q: "Her charming temperament is quite different _____ that of her sister.",
    target: "different from",
    opts: ["than", "from", "to", "with"],
    ans: "b",
    meaning: "different from - কোনো কিছু হতে পৃথক বা ভিন্ন",
    exp: "প্রমিত ইংরেজিতে 'different'-এর পরে সর্বদা 'from' বসে, 'than' বা 'to' নয়।",
    exam: "12th BCS, 22nd BCS"
  },
  {
    q: "The magistrate is disgusted _____ the persistent mendacity of the witness.",
    target: "disgusted with",
    opts: ["at", "with", "by", "of"],
    ans: "b",
    meaning: "disgusted with - কারো আচরণ বা বিষয়ে চরমভাবে বিরক্ত",
    exp: "বিরক্ত হওয়া প্রকাশে 'disgusted with' (ব্যক্তি বা চরিত্র) বা 'disgusted at' (কোনো কদর্য দৃশ্য) বসে।",
    exam: "36th BCS, Judicial Exam 2021"
  },
  {
    q: "We can easily dispense _____ luxurious conveniences during hardships.",
    target: "dispense with",
    opts: ["with", "of", "from", "for"],
    ans: "a",
    meaning: "dispense with - কোনো কিছু ছাড়াই চলা বা রেহাই দেওয়া",
    exp: "'Dispense with' অর্থ কোনো কিছু বাদ দিয়ে চলা (do without)। ওষুধ বিতরণ করা অর্থে 'dispense to' বসে।",
    exam: "37th BCS, 16th BCS"
  },
  {
    q: "He decided to dispose _____ his dilapidated ancestral property.",
    target: "dispose of",
    opts: ["off", "of", "away", "out"],
    ans: "b",
    meaning: "dispose of - বিক্রি করে দেওয়া বা নিষ্পত্তি করা",
    exp: "সম্পত্তি বিক্রি করা বা বাতিল করা বোঝাতে 'dispose of' (একটি 'f') বসে। অনেকেই ভুল করে 'dispose off' লেখে।",
    exam: "24th BCS, 10th BCS"
  },
  {
    q: "You must clearly distinguish truth _____ deceptive falsehood.",
    target: "distinguish from",
    opts: ["with", "to", "between", "from"],
    ans: "d",
    meaning: "distinguish ... from - একের থেকে অন্যকে পৃথক করা",
    exp: "দুটি বিষয়ের মধ্যে পার্থক্য নিরূপণ করার ক্ষেত্রে 'distinguish A from B' অথবা 'distinguish between A and B' বসে।",
    exam: "32nd BCS, 19th BCS"
  },
  {
    q: "Divide these ripe mangoes _____ the two hungry brothers.",
    target: "divide between",
    opts: ["among", "between", "in", "to"],
    ans: "b",
    meaning: "between - দুই ব্যক্তি বা বস্তুর মধ্যে বণ্টন",
    exp: "দুজনের মধ্যে বণ্টন বোঝাতে 'between', আর দুজনের অধিক ব্যক্তির মধ্যে হলে 'among' ব্যবহৃত হয়।",
    exam: "15th BCS, Primary Teacher 2020"
  },
  {
    q: "Distribute the relief supplies _____ the villagers.",
    target: "among",
    opts: ["between", "among", "in", "with"],
    ans: "b",
    meaning: "among - অনেকের মধ্যে বণ্টন",
    exp: "দুইয়ের অধিক বহু ব্যক্তি বা দলের মাঝে কোনো কিছু বিলিয়ে দেওয়া বোঝাতে 'among' বসে।",
    exam: "14th BCS, 27th BCS"
  },
  {
    q: "The cancellation was due _____ inclement weather conditions.",
    target: "due to",
    opts: ["for", "to", "with", "by"],
    ans: "b",
    meaning: "due to - কোনো কারণে বা নিমিত্তে",
    exp: "কারণ নির্দেশক Adjective phrase হিসেবে 'due to' ব্যবহৃত হয়।",
    exam: "21st BCS, 11th BCS"
  },
  {
    q: "The dull boy is extremely slow and dull _____ mathematics.",
    target: "dull at",
    opts: ["in", "at", "with", "for"],
    ans: "b",
    meaning: "dull at - কোনো বিষয়ে কাঁচা বা অপটু",
    exp: "দক্ষ অর্থে 'good at', কাঁচা অর্থে 'dull at' বা 'weak in' বসে। কানে কম শোনা অর্থে 'dull of hearing' বসে।",
    exam: "29th BCS, Primary Teacher 2019"
  },
  {
    q: "The elderly grandfather has become remarkably dull _____ hearing.",
    target: "dull of",
    opts: ["in", "at", "of", "with"],
    ans: "c",
    meaning: "dull of hearing - কানে কম শোনা",
    exp: "শ্রবণশক্তি দুর্বল হওয়া বোঝাতে ইডিয়াম্যাটিক প্রিপজিশন হলো 'dull of hearing'।",
    exam: "38th BCS, Senior Staff Nurse 2018"
  },
  {
    q: "The curious children are eager _____ exciting holiday news.",
    target: "eager for",
    opts: ["to", "for", "with", "in"],
    ans: "b",
    meaning: "eager for / about - কোনো কিছুর জন্য উৎসুক",
    exp: "কোনো খবরের জন্য উৎসুক হওয়া বোঝাতে 'eager for' বসে। কিছু করার জন্য উৎসুক হলে 'eager to do' বসে।",
    exam: "18th BCS, Pubali Bank Officer 2019"
  },
  {
    q: "He is deemed thoroughly eligible _____ this coveted government post.",
    target: "eligible for",
    opts: ["to", "for", "in", "with"],
    ans: "b",
    meaning: "eligible for - কোনো পদ বা সুবিধার জন্য উপযুক্ত বা যোগ্য",
    exp: "যোগ্যতা প্রকাশ করতে 'eligible for' বসে (eligible for the scholarship/job)।",
    exam: "30th BCS, 13th BCS"
  },
  {
    q: "Kazi Nazrul Islam is pre-eminently eminent _____ his fiery rebellious poems.",
    target: "eminent for",
    opts: ["in", "for", "with", "by"],
    ans: "b",
    meaning: "eminent for - কোনো বিশেষ গুণের জন্য খ্যাতনামা বা বিশিষ্ট",
    exp: "কোনো বিশেষ বৈশিষ্ট্যের জন্য বিখ্যাত হওয়া অর্থে 'eminent for' বা 'famous for' বসে।",
    exam: "23rd BCS, Bangla Academy Exam"
  },
  {
    q: "All malicious machinations ultimately end _____ smoke.",
    target: "end in",
    opts: ["to", "into", "in", "with"],
    ans: "c",
    meaning: "end in smoke - ব্যর্থতায় পর্যবসিত হওয়া",
    exp: "'End in smoke' একটি বহুল ব্যবহৃত ইডিয়াম যার অর্থ নিষ্ফল হওয়া বা ব্যর্থতায় পর্যবসিত হওয়া।",
    exam: "20th BCS, 10th BCS"
  },
  {
    q: "The virtuous girl is richly endowed _____ remarkable musical talents.",
    target: "endowed with",
    opts: ["by", "with", "in", "of"],
    ans: "b",
    meaning: "endowed with - প্রাকৃতিক গুণ বা সম্পদে ভূষিত বা সমৃদ্ধ",
    exp: "প্রকৃতিপ্রদত্ত কোনো গুণে ভূষিত হওয়া প্রকাশে 'endowed with' বসে।",
    exam: "35th BCS, 17th BCS"
  },
  {
    q: "The industrious researcher is actively engaged _____ scientific inquiries.",
    target: "engaged in",
    opts: ["with", "to", "in", "at"],
    ans: "c",
    meaning: "engaged in - কোনো কাজে ব্যাপৃত বা রত",
    exp: "কোনো কাজে লিপ্ত বা রত থাকা অর্থে 'engaged in' বসে। তবে বাগদান সম্পন্ন হওয়া অর্থে 'engaged to' বসে (She is engaged to him)।",
    exam: "27th BCS, 12th BCS"
  },
  {
    q: "She was officially engaged _____ a respectable diplomat last month.",
    target: "engaged to",
    opts: ["with", "to", "for", "by"],
    ans: "b",
    meaning: "engaged to - কারো সাথে বিবাহবন্ধনে বাগদত্তা হওয়া",
    exp: "কারো সাথে বাগদান সম্পন্ন হওয়া অর্থে 'engaged to' বসে, 'with' নয়।",
    exam: "39th BCS, Primary Teacher 2021"
  },
  {
    q: "The magistrate ordered a police officer to enquire _____ the complaint.",
    target: "enquire into",
    opts: ["of", "into", "about", "for"],
    ans: "b",
    meaning: "enquire into - তদন্ত বা অনুসন্ধান করা",
    exp: "কোনো বিষয় তদন্ত করা অর্থে 'enquire into' (look into)। কারো কুশল জানতে চাইলে 'enquire after' এবং কারো কাছে জানতে চাইলে 'enquire of' বসে।",
    exam: "31st BCS, CID Sub-Inspector 2019"
  },
  {
    q: "An uncharitable man is persistently envious _____ another's prosperity.",
    target: "envious of",
    opts: ["at", "with", "of", "to"],
    ans: "c",
    meaning: "envious of - অন্যের সাফল্যে ঈর্ষাপরায়ণ",
    exp: "ঈর্ষান্বিত হওয়া অর্থে 'envious of' বা 'jealous of' বসে।",
    exam: "16th BCS, 22nd BCS"
  },
  {
    q: "His energetic capabilities are fully equal _____ the daunting task.",
    target: "equal to",
    opts: ["with", "to", "for", "in"],
    ans: "b",
    meaning: "equal to - কোনো কাজের জন্য যথোপযুক্ত বা সক্ষম",
    exp: "কোনো কাজের সমকক্ষ বা সামর্থ্যবান হওয়া বোঝাতে 'equal to the task' বসে।",
    exam: "34th BCS, Bangladesh Bank Officer 2018"
  },
  {
    q: "The daring fugitive barely escaped _____ the maximum security prison.",
    target: "escape from",
    opts: ["of", "to", "from", "out"],
    ans: "c",
    meaning: "escape from - বন্দিদশা বা বিপদ থেকে পালিয়ে রক্ষা পাওয়া",
    exp: "কোনো বন্দিদশা বা বিপদ থেকে মুক্তি পেয়ে পালানো অর্থে 'escape from' বসে।",
    exam: "14th BCS, Jail Warder Exam 2020"
  },
  {
    q: "Patience and hard work are essential _____ lasting success.",
    target: "essential to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "essential to / for - অপরিহার্য বা আবশ্যকীয়",
    exp: "কোনো লক্ষ্যের জন্য চূড়ান্ত অপরিহার্য হওয়া অর্থে 'essential to' প্রমিতভাবে ব্যবহৃত হয়। 'essential for' ও প্রচলিত।",
    exam: "24th BCS, 15th BCS"
  },
  {
    q: "The brilliant student excels _____ creative English writing.",
    target: "excel in",
    opts: ["at", "in", "with", "for"],
    ans: "b",
    meaning: "excel in - কোনো ক্ষেত্রে অসাধারণ নৈপুণ্য প্রদর্শন করা",
    exp: "কোনো বিষয়ে বা কর্মকাণ্ডে অসাধারণ পারদর্শিতা দেখাতে 'excel in' ব্যবহৃত হয়।",
    exam: "28th BCS, Primary Teacher 2020"
  },
  {
    q: "There is no exception _____ this overarching universal grammar rule.",
    target: "exception to",
    opts: ["of", "to", "from", "with"],
    ans: "b",
    meaning: "exception to - কোনো নিয়মের ব্যতিক্রম",
    exp: "কোনো নিয়মের ব্যতিক্রম বোঝাতে 'exception to the rule' বসে।",
    exam: "36th BCS, 11th BCS"
  },
  {
    q: "The wounded soldier was exempted _____ front-line military service.",
    target: "exempt from",
    opts: ["to", "from", "of", "with"],
    ans: "b",
    meaning: "exempt from - দায়িত্ব বা কর থেকে অব্যাহতি বা রেহাইপ্রাপ্ত",
    exp: "অব্যাহতি দেওয়া অর্থে 'exempt from' বসে (exempt from tax/service)।",
    exam: "30th BCS, Revenue Officer 2019"
  },
  {
    q: "I am reasonably familiar _____ this neighbourhood.",
    target: "familiar with",
    opts: ["to", "with", "in", "by"],
    ans: "b",
    meaning: "familiar with - কোনো বিষয় বা স্থানের সাথে পরিচিত",
    exp: "কোনো ব্যক্তি যখন কোনো বিষয়ে বা স্থানে পরিচিত হয় তখন 'familiar with' বসে। কিন্তু কোনো বিষয় যখন কারো কাছে পরিচিত হয় তখন 'familiar to' বসে (His name is familiar to me)।",
    exam: "38th BCS, 19th BCS"
  },
  {
    q: "His reputable name is well familiar _____ all scholars here.",
    target: "familiar to",
    opts: ["with", "to", "for", "by"],
    ans: "b",
    meaning: "familiar to - কারো নিকট সুপরিচিত",
    exp: "বিষয় বা নাম কারো কাছে পরিচিত হলে 'familiar to someone' কাঠামো ব্যবহৃত হয়।",
    exam: "25th BCS, Agrani Bank Officer 2018"
  },
  {
    q: "Sylhet is internationally famous _____ its lush green tea plantations.",
    target: "famous for",
    opts: ["in", "with", "for", "by"],
    ans: "c",
    meaning: "famous for - কোনো কিছুর জন্য বিখ্যাত",
    exp: "কোনো খ্যাতি বা গুণের জন্য সুপরিচিত হলে 'famous for' বসে।",
    exam: "13th BCS, Primary Teacher 2022"
  },
  {
    q: "Smoking cigarettes is fatally harmful and fatal _____ human health.",
    target: "fatal to",
    opts: ["for", "to", "with", "at"],
    ans: "b",
    meaning: "fatal to - মারাত্মক বা প্রাণঘাতী",
    exp: "মারাত্মক বা জীবননাশক হওয়া বোঝাতে 'fatal to' বসে (fatal to health/ambitions)।",
    exam: "26th BCS, 17th BCS"
  },
  {
    q: "Cattle and herbivores primarily feed _____ lush green grass.",
    target: "feed on",
    opts: ["with", "on", "upon", "at"],
    ans: "b",
    meaning: "feed on - কোনো কিছু খেয়ে জীবন ধারণ করা",
    exp: "কোনো খাদ্য খেয়ে বেঁচে থাকা বা ভক্ষণ করা বোঝাতে 'feed on' বসে (Cows feed on grass)।",
    exam: "32nd BCS, 10th BCS"
  },
  {
    q: "A noble philanthropist deeply feels _____ the suffering destitute.",
    target: "feel for",
    opts: ["to", "with", "for", "at"],
    ans: "c",
    meaning: "feel for - কারো জন্য গভীর সহানুভূতি বা দরদ অনুভব করা",
    exp: "কারো দুঃখে সমবেদনা প্রকাশ করতে 'feel for' বসে (I feel for the poor)।",
    exam: "21st BCS, Red Crescent Exam"
  },
  {
    q: "The young children are particularly fond _____ sweet mangoes.",
    target: "fond of",
    opts: ["to", "with", "for", "of"],
    ans: "d",
    meaning: "fond of - অনুরাগী বা প্রিয়",
    exp: "কোনো কিছু পছন্দ করা বা অনুরাগী হওয়া প্রকাশ করতে 'fond of' বসে।",
    exam: "12th BCS, Primary Teacher 2018"
  },
  {
    q: "The disciplined monk is thoroughly free _____ worldly desires.",
    target: "free from",
    opts: ["of", "from", "to", "with"],
    ans: "b",
    meaning: "free from - কোনো বিপদ, কষ্ট বা মোহ থেকে মুক্ত",
    exp: "মুক্ত হওয়া অর্থে 'free from' বসে (free from danger/care)। তবে বিনামূল্যে পাওয়া অর্থে 'free of cost' বসে।",
    exam: "27th BCS, 16th BCS"
  },
  {
    q: "The crystalline pitcher was brimful and full _____ cool water.",
    target: "full of",
    opts: ["with", "of", "by", "in"],
    ans: "b",
    meaning: "full of - কোনো কিছুতে পরিপূর্ণ",
    exp: "পরিপূর্ণ বোঝাতে 'full of' বসে (full of water)। তবে 'fill'-এর ক্ষেত্রে 'filled with' বসে।",
    exam: "11th BCS, 23rd BCS"
  },
  {
    q: "She cast a hasty glance _____ the morning newspapers.",
    target: "glance at",
    opts: ["on", "at", "to", "over"],
    ans: "b",
    meaning: "glance at - একপলক বা দ্রুত দৃষ্টিপাত করা",
    exp: "ঝলক দেওয়া বা একনজর দেখা বোঝাতে 'glance at' বসে।",
    exam: "37th BCS, Bank Asia Officer 2019"
  },
  {
    q: "My elder brother is remarkably good _____ spoken English.",
    target: "good at",
    opts: ["in", "at", "with", "for"],
    ans: "b",
    meaning: "good at - কোনো বিষয়ে পারদর্শী বা দক্ষ",
    exp: "কোনো নির্দিষ্ট বিষয় বা খেলায় দক্ষতা প্রকাশ করতে 'good at' বসে।",
    exam: "33rd BCS, 14th BCS"
  },
  {
    q: "We are profoundly grateful _____ you for your benevolent assistance.",
    target: "grateful to",
    opts: ["for", "to", "with", "towards"],
    ans: "b",
    meaning: "grateful to (a person) - কারো প্রতি কৃতজ্ঞ",
    exp: "ব্যক্তির প্রতি কৃতজ্ঞতা জ্ঞাপনে 'grateful to' বসে, আর উপকারের জন্য হলে 'grateful for' বসে (grateful to you for your help)।",
    exam: "20th BCS, 29th BCS"
  },
  {
    q: "A miserly scoundrel has an insatiable greed _____ gold and money.",
    target: "greed for",
    opts: ["of", "for", "to", "in"],
    ans: "b",
    meaning: "greed for - কোনো কিছুর প্রতি তীব্র লালসা বা লোভ",
    exp: "Noun 'greed'-এর পরে 'for' বসে, কিন্তু Adjective 'greedy'-এর পরে 'of' বসে (greedy of gain)।",
    exam: "18th BCS, Primary Teacher 2021"
  },
  {
    q: "The whole nation grieved _____ the untimely demise of the hero.",
    target: "grieve for",
    opts: ["at", "for", "to", "with"],
    ans: "b",
    meaning: "grieve for - কারো জন্য শোক প্রকাশ করা",
    exp: "কারো বিয়োগে শোক প্রকাশ করা বোঝাতে 'grieve for', এবং কোনো দুঃখজনক সংবাদে শোকাহত হলে 'grieve at' বসে।",
    exam: "28th BCS, Dhaka Bank PO 2018"
  },
  {
    q: "The jury found the cunning convict guilty _____ premeditated murder.",
    target: "guilty of",
    opts: ["for", "with", "of", "to"],
    ans: "c",
    meaning: "guilty of - কোনো অপরাধে দোষী",
    exp: "অপরাধে দোষী সাব্যস্ত হওয়া প্রকাশ করতে 'guilty of' বসে। নির্দোষ বোঝাতে 'innocent of' বসে।",
    exam: "35th BCS, 15th BCS"
  },
  {
    q: "A prudent gentleman does not hanker _____ superficial fame.",
    target: "hanker after",
    opts: ["for", "after", "to", "at"],
    ans: "b",
    meaning: "hanker after - কোনো কিছুর পেছনে লালায়িত হয়ে ছোটা",
    exp: "কোনো পার্থিব বিষয় পাওয়ার জন্য লালায়িত হওয়া বোঝাতে 'hanker after' প্রবাদপ্রতিমভাবে ব্যবহৃত হয়।",
    exam: "31st BCS, 10th BCS"
  },
  {
    q: "Polluted industrial effluents are extremely harmful _____ aquatic life.",
    target: "harmful to",
    opts: ["for", "to", "with", "at"],
    ans: "b",
    meaning: "harmful to - স্বাস্থ্যের বা পরিবেশের জন্য ক্ষতিকর",
    exp: "ক্ষতিকর বোঝাতে 'harmful to', 'injurious to', 'detrimental to' বসে।",
    exam: "24th BCS, Department of Environment Exam"
  },
  {
    q: "The Prince of Wales is the rightful heir _____ the royal throne.",
    target: "heir to",
    opts: ["of", "to", "for", "in"],
    ans: "b",
    meaning: "heir to - কোনো পদ, সিংহাসন বা সম্পত্তির উত্তরাধিকারী",
    exp: "উত্তরাধিকার বোঝাতে 'heir to' বসে (heir to the throne/property)। কিন্তু ব্যক্তির উত্তরাধিকারী হলে 'heir of' বসে।",
    exam: "36th BCS, 13th BCS"
  },
  {
    q: "The speaker subtly hinted _____ upcoming administrative restructuring.",
    target: "hint at",
    opts: ["to", "at", "about", "on"],
    ans: "b",
    meaning: "hint at - পরোক্ষভাবে কোনো বিষয়ের প্রতি ইঙ্গিত করা",
    exp: "ইঙ্গিত করা বোঝাতে 'hint at' ব্যবহৃত হয়।",
    exam: "22nd BCS, Combined 5 Banks SO 2020"
  },
  {
    q: "The destitute farmers earnestly hope _____ a bountiful monsoon harvest.",
    target: "hope for",
    opts: ["of", "to", "for", "in"],
    ans: "c",
    meaning: "hope for - কোনো শুভ পরিণতির আশা করা",
    exp: "আশা করা বোঝাতে Verb হিসেবে 'hope for' বসে। তবে Noun হিসেবে 'hope of' বসে (hope of success)।",
    exam: "17th BCS, Primary Teacher 2019"
  },
  {
    q: "The adversarial neighbouring state is overtly hostile _____ bilateral peace.",
    target: "hostile to",
    opts: ["with", "to", "against", "at"],
    ans: "b",
    meaning: "hostile to - শত্রুভাবাপন্ন বা বিরোধী",
    exp: "শত্রুতাপূর্ণ আচরণ প্রকাশে 'hostile to' বসে (hostile to negotiations)।",
    exam: "30th BCS, Ministry of Foreign Affairs 2018"
  },
  {
    q: "His signature on the forged cheque was identical _____ the authentic one.",
    target: "identical with",
    opts: ["to", "with", "from", "as"],
    ans: "b",
    meaning: "identical with - হুবহু একই বা অভিন্ন",
    exp: "কোনো কিছুর সাথে অবিকল একরকম বোঝাতে 'identical with' বা 'identical to' বসে। প্রমিত ব্রিটিশ ব্যবহারে 'identical with' সর্বাধিক সমাদৃত।",
    exam: "38th BCS, CID Forensic Exam"
  },
  {
    q: "The naive villager was completely ignorant _____ metropolitan customs.",
    target: "ignorant of",
    opts: ["in", "about", "to", "of"],
    ans: "d",
    meaning: "ignorant of - কোনো বিষয় সম্পর্কে অনবহিত বা অজ্ঞ",
    exp: "কোনো নিয়ম বা বিষয়ে অজ্ঞতা প্রকাশে 'ignorant of' বসে।",
    exam: "19th BCS, 12th BCS"
  },
  {
    q: "The child was bedridden and seriously ill _____ typhoid.",
    target: "ill with",
    opts: ["of", "from", "with", "in"],
    ans: "c",
    meaning: "ill with - কোনো রোগে আক্রান্ত হওয়া",
    exp: "কোনো রোগে পীড়িত থাকা অবস্থায় 'ill with fever/typhoid' ব্যবহৃত হয়।",
    exam: "25th BCS, Health Cadre Exam 2019"
  },
  {
    q: "The government imposed a heavy tariff _____ imported luxury automobiles.",
    target: "impose on",
    opts: ["at", "to", "on", "upon"],
    ans: "c",
    meaning: "impose on / upon - কোনো কিছুর ওপর কর বা বিধি আরোপ করা",
    exp: "আরোপ করা বা চাপিয়ে দেওয়া বোঝাতে 'impose on' বা 'impose upon' বসে।",
    exam: "34th BCS, Custom Officer Exam 2018"
  },
  {
    q: "We are deeply indebted _____ our noble teachers for our enlightenment.",
    target: "indebted to",
    opts: ["for", "with", "to", "towards"],
    ans: "c",
    meaning: "indebted to - কারো নিকট ঋণী বা কৃতজ্ঞ",
    exp: "কারো কাছে ঋণী হওয়া প্রকাশে 'indebted to (someone)' এবং কোনো বিষয়ের জন্য হলে 'indebted for' বসে।",
    exam: "23rd BCS, Primary Teacher 2021"
  },
  {
    q: "The callous tyrant was utterly indifferent _____ the agonies of the poor.",
    target: "indifferent to",
    opts: ["with", "for", "to", "at"],
    ans: "c",
    meaning: "indifferent to - উদাসীন বা অনুভূতিহীন",
    exp: "উদাসীনতা প্রকাশে 'indifferent to', 'callous to', 'unconcerned with' ব্যবহৃত হয়।",
    exam: "37th BCS, 15th BCS"
  },
  {
    q: "Sound health and mental peace are indispensable _____ human happiness.",
    target: "indispensable to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "indispensable to - অপরিহার্য বা অত্যন্ত প্রয়োজনীয়",
    exp: "অত্যন্ত অপরিহার্য হওয়া প্রকাশে 'indispensable to' প্রমিতভাবে বসে।",
    exam: "29th BCS, 18th BCS"
  },
  {
    q: "Do not indulge _____ unwholesome and defamatory gossip.",
    target: "indulge in",
    opts: ["with", "at", "in", "to"],
    ans: "c",
    meaning: "indulge in - কোনো মন্দ কাজে নিমগ্ন বা লিপ্ত হওয়া",
    exp: "কোনো মন্দ কাজে আসক্ত বা লিপ্ত হওয়া বোঝাতে 'indulge in' বসে। তবে কারো প্রতি অতিরিক্ত প্রশ্রয় দেওয়া বোঝাতে 'indulgent to' বসে।",
    exam: "33rd BCS, 11th BCS"
  },
  {
    q: "The old house is heavily infested _____ poisonous vermin and rats.",
    target: "infested with",
    opts: ["by", "of", "in", "with"],
    ans: "d",
    meaning: "infested with - ক্ষতিকর পোকা বা উপদ্রবে পরিপূর্ণ",
    exp: "কোনো স্থানে কীটপতঙ্গ বা উপদ্রবকারী প্রাণীর প্রাদুর্ভাব হলে 'infested with' বসে।",
    exam: "14th BCS, Primary Teacher 2020"
  },
  {
    q: "Please inform the authority _____ the suspicious movement.",
    target: "inform of",
    opts: ["about", "of", "to", "with"],
    ans: "b",
    meaning: "inform ... of - কোনো তথ্য সম্পর্কে জানানো বা অবহিত করা",
    exp: "কাউকে কোনো সংবাদ দিয়ে অবহিত করতে 'inform someone of something' কাঠামো বসে।",
    exam: "26th BCS, NSI Assistant Director 2019"
  },
  {
    q: "A desire for freedom is inherent _____ every living creature.",
    target: "inherent in",
    opts: ["to", "in", "with", "at"],
    ans: "b",
    meaning: "inherent in - কোনো সত্তার মাঝে জন্মগতভাবে বা অন্তর্নিহিত থাকা",
    exp: "অন্তর্নিহিত বা সহজাত গুণ বোঝাতে 'inherent in' ব্যবহৃত হয়।",
    exam: "35th BCS, DU 'C' Unit 2020"
  },
  {
    q: "Smoking tobacco is demonstrably injurious _____ the lungs.",
    target: "injurious to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "injurious to - স্বাস্থ্যের জন্য ক্ষতিকর",
    exp: "ক্ষতিকর অর্থে 'injurious to' বসে, 'for' নয় (Smoking is injurious to health)।",
    exam: "31st BCS, 10th BCS"
  },
  {
    q: "The innocent victim was completely innocent _____ the framed accusation.",
    target: "innocent of",
    opts: ["from", "to", "of", "with"],
    ans: "c",
    meaning: "innocent of - কোনো অপরাধে সম্পূর্ণ নির্দোষ",
    exp: "নির্দোষ প্রকাশে 'innocent of' বসে (innocent of the crime)।",
    exam: "21st BCS, Judicial Exam 2017"
  },
  {
    q: "He persistently insisted _____ accompanying me to the airport.",
    target: "insist on",
    opts: ["to", "in", "for", "on"],
    ans: "d",
    meaning: "insist on - কোনো বিষয়ে জোরালো জেদ ধরা",
    exp: "কোনো দাবির ব্যাপারে অনড় থাকা বা জেদ ধরা বোঝাতে 'insist on' বসে এবং এরপর gerund বসে (insisted on going)।",
    exam: "40th BCS, 13th BCS"
  },
  {
    q: "She takes an active and keen interest _____ classical Bengali music.",
    target: "interest in",
    opts: ["to", "for", "with", "in"],
    ans: "d",
    meaning: "interest in - কোনো বিষয়ে গভীর আগ্রহ",
    exp: "কোনো বিষয়ের প্রতি আগ্রহ প্রকাশ করতে 'interest in' বসে। আগ্রহী হওয়া অর্থে 'interested in' বসে।",
    exam: "16th BCS, Primary Teacher 2018"
  },
  {
    q: "Do not unduly interfere _____ my personal domestic affairs.",
    target: "interfere in",
    opts: ["with", "to", "in", "at"],
    ans: "c",
    meaning: "interfere in - অনধিকার চর্চা বা অযাচিত হস্তক্ষেপ করা",
    exp: "কোনো ব্যাপারে অনধিকার হস্তক্ষেপ করতে 'interfere in' বসে। তবে কোনো স্বাভাবিক কাজে বাধা সৃষ্টি করা অর্থে 'interfere with' বসে।",
    exam: "28th BCS, 17th BCS"
  },
  {
    q: "He is extraordinarily intimate _____ the distinguished senator.",
    target: "intimate with",
    opts: ["to", "with", "at", "for"],
    ans: "b",
    meaning: "intimate with - কারো সাথে অত্যন্ত ঘনিষ্ঠ",
    exp: "ঘনিষ্ঠতা প্রকাশে 'intimate with' ব্যবহৃত হয়।",
    exam: "22nd BCS, Ministry of Foreign Affairs"
  },
  {
    q: "The cordial host introduced the guest _____ all the attendees.",
    target: "introduce to",
    opts: ["with", "to", "among", "for"],
    ans: "b",
    meaning: "introduce to - কারো সাথে পরিচয় করিয়ে দেওয়া",
    exp: "অন্যের সাথে পরিচয় করিয়ে দেওয়া অর্থে 'introduce to' বসে, 'with' নয়।",
    exam: "30th BCS, Bank Asia Exam 2019"
  },
  {
    q: "Prudent entrepreneurs invest capital _____ diversified equities.",
    target: "invest in",
    opts: ["to", "in", "on", "for"],
    ans: "b",
    meaning: "invest in - ব্যবসায় বা সম্পদে মূলধন বিনিয়োগ করা",
    exp: "টাকা বা মূলধন খাটানো অর্থে 'invest in' বসে।",
    exam: "36th BCS, Bangladesh Bank Cash Officer"
  },
  {
    q: "We were cordially invited _____ the celebratory wedding dinner.",
    target: "invite to",
    opts: ["at", "in", "to", "for"],
    ans: "c",
    meaning: "invite to - কোনো ভোজে বা অনুষ্ঠানে আমন্ত্রণ জানানো",
    exp: "কোনো ভোজ (dinner), চা-চক্র (tea) বা অনুষ্ঠানে দাওয়াত দেওয়া অর্থে 'invite to' বসে।",
    exam: "34th BCS, 12th BCS"
  },
  {
    q: "Do not jump _____ conclusions without verifying verifiable facts.",
    target: "jump to",
    opts: ["at", "to", "in", "into"],
    ans: "b",
    meaning: "jump to a conclusion - বিবেচনা ছাড়াই হুট করে সিদ্ধান্তে পৌঁছানো",
    exp: "হঠকারী সিদ্ধান্তে পৌঁছানো অর্থে 'jump to a conclusion' বসে। কোনো সুযোগ লুফে নেওয়া অর্থে 'jump at an offer' বসে।",
    exam: "39th BCS, Primary Teacher 2020"
  },
  {
    q: "The hungry applicant jumped _____ the lucrative job offer immediately.",
    target: "jump at",
    opts: ["to", "at", "upon", "for"],
    ans: "b",
    meaning: "jump at (an offer) - কোনো সুযোগ বা প্রস্তাব সাদরে লুফে নেওয়া",
    exp: "কোনো আকর্ষণীয় সুযোগ পাওয়ার সাথে সাথে গ্রহণ করা বোঝাতে 'jump at' ব্যবহৃত হয়।",
    exam: "27th BCS, Agrani Bank Senior Officer"
  },
  {
    q: "He is three years junior _____ all his departmental peers.",
    target: "junior to",
    opts: ["than", "to", "from", "of"],
    ans: "b",
    meaning: "junior to - বয়সে বা পদে কনিষ্ঠ",
    exp: "ল্যাটিন কম্পারেটিভ 'junior'-এর পর সর্বদা 'to' বসে, 'than' নয়।",
    exam: "11th BCS, 20th BCS"
  },
  {
    q: "The energetic scholar is remarkably keen _____ learning foreign languages.",
    target: "keen on",
    opts: ["in", "at", "for", "on"],
    ans: "d",
    meaning: "keen on - কোনো কিছুতে অত্যন্ত আগ্রহী বা অনুরক্ত",
    exp: "কোনো বিষয়ে প্রবল উৎসাহী হওয়া প্রকাশ করতে 'keen on' বসে (keen on sports/learning)।",
    exam: "32nd BCS, DU 'D' Unit 2018"
  },
  {
    q: "Perseverance and discipline are the true key _____ boundless success.",
    target: "key to",
    opts: ["of", "to", "for", "in"],
    ans: "b",
    meaning: "key to - কোনো সাফল্য বা সমাধানের আসল চাবিকাঠি",
    exp: "চাবিকাঠি বা সাফল্যের উপায় বোঝাতে 'key to' বসে (Industry is the key to success)।",
    exam: "15th BCS, Primary Teacher 2022"
  },
  {
    q: "A noble human being is always kind _____ all voiceless creatures.",
    target: "kind to",
    opts: ["with", "for", "to", "towards"],
    ans: "c",
    meaning: "kind to - কারো প্রতি দয়ালু বা সদয়",
    exp: "দয়া বা সদয় মনোভাব প্রকাশ করতে 'kind to' প্রমিতভাবে ব্যবহৃত হয়।",
    exam: "10th BCS, 18th BCS"
  },
  {
    q: "The prolonged drought caused a severe lack _____ drinking water.",
    target: "lack of",
    opts: ["in", "of", "for", "with"],
    ans: "b",
    meaning: "lack of - কোনো কিছুর অভাব বা ঘাটতি",
    exp: "Noun হিসেবে 'lack of' বসে (lack of money/water)। কিন্তু Verb হিসেবে কোনো preposition বসে না (He lacks money)।",
    exam: "29th BCS, 14th BCS"
  },
  {
    q: "The poor peasant is unfortunately lacking _____ essential capital.",
    target: "lacking in",
    opts: ["of", "in", "with", "for"],
    ans: "b",
    meaning: "lacking in - কোনো বিশেষ গুণে বা জিনিসে ঘাটতিগ্রস্ত",
    exp: "Adjective হিসেবে 'lacking in' ব্যবহৃত হয় (He is lacking in courage)।",
    exam: "38th BCS, Pubali Bank Officer 2019"
  },
  {
    q: "The injured veteran is unfortunately lame _____ his right leg.",
    target: "lame of",
    opts: ["in", "of", "with", "from"],
    ans: "b",
    meaning: "lame of - কোনো পায়ে খোঁড়া",
    exp: "কোনো নির্দিষ্ট পায়ে খোঁড়া হওয়া বোঝাতে 'lame of one leg' প্রচলিত স্ট্যান্ডার্ড ব্যবহার।",
    exam: "24th BCS, Primary Teacher 2019"
  },
  {
    q: "Never laugh _____ the misfortunes of the impoverished.",
    target: "laugh at",
    opts: ["to", "at", "upon", "for"],
    ans: "b",
    meaning: "laugh at - কারো দিকে তাকিয়ে বিদ্রূপ বা উপহাস করা",
    exp: "উপহাস করা অর্থে 'laugh at' বসে। প্রসন্ন হওয়া অর্থে 'smile on' বসে।",
    exam: "13th BCS, 23rd BCS"
  },
  {
    q: "Diligence and integrity invariably lead _____ long-term prosperity.",
    target: "lead to",
    opts: ["for", "into", "to", "in"],
    ans: "c",
    meaning: "lead to - কোনো নির্দিষ্ট পরিণতির দিকে নিয়ে যাওয়া",
    exp: "পরিণাম নির্দেশ করতে 'lead to' বসে (All roads lead to Rome)।",
    exam: "35th BCS, 17th BCS"
  },
  {
    q: "The obedient students learned the sublime poem _____ heart.",
    target: "by heart",
    opts: ["with", "at", "by", "in"],
    ans: "c",
    meaning: "learn by heart - মুখস্থ করা",
    exp: "'Learn by heart' একটি সুপরিচিত ইডিয়াম যার অর্থ স্মৃতিতে ধারণ করা বা মুখস্থ করা।",
    exam: "11th BCS, Primary Teacher 2018"
  },
  {
    q: "A driver is legally liable _____ severe penalties for speeding.",
    target: "liable to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "liable to - কোনো দণ্ড বা ক্ষতির আশঙ্কায় থাকা",
    exp: "দণ্ড বা শাস্তির ঝুঁকিতে থাকা অর্থে 'liable to a fine' বসে। কোনো ক্ষতির জন্য দায়ী হওয়া অর্থে 'liable for damages' বসে।",
    exam: "36th BCS, Judicial Exam 2018"
  },
  {
    q: "There is a strict legal limit _____ public election expenditures.",
    target: "limit to",
    opts: ["of", "to", "for", "in"],
    ans: "b",
    meaning: "limit to - কোনো কিছুর নির্দিষ্ট সীমা",
    exp: "সীমাবদ্ধতা নির্দেশ করতে 'limit to' বসে (There is a limit to my patience)।",
    exam: "21st BCS, Election Commission Exam 2020"
  },
  {
    q: "Please listen attentively _____ what your venerable parents advise.",
    target: "listen to",
    opts: ["at", "to", "for", "with"],
    ans: "b",
    meaning: "listen to - মনোযোগ দিয়ে শোনা",
    exp: "মনোযোগ সহকারে শোনা অর্থে 'listen to' বসে, শুধু 'listen' নয়।",
    exam: "12th BCS, 25th BCS"
  },
  {
    q: "The pious ascetic lives solely _____ fruits and fresh well water.",
    target: "live on",
    opts: ["by", "with", "on", "in"],
    ans: "c",
    meaning: "live on - নির্দিষ্ট খাদ্য খেয়ে বেঁচে থাকা",
    exp: "নির্দিষ্ট খাবার খেয়ে জীবনধারণ করা অর্থে 'live on' বসে। জীবিকা নির্বাহের উপায় হলে 'live by honest labor' বসে।",
    exam: "31st BCS, 14th BCS"
  },
  {
    q: "A virtuous carpenter lives _____ the honest labor of his hands.",
    target: "live by",
    opts: ["on", "by", "with", "from"],
    ans: "b",
    meaning: "live by - কোনো কাজের মাধ্যমে জীবিকা নির্বাহ করা",
    exp: "কোনো পেশা, কর্ম বা নীতির মাধ্যমে জীবন নির্বাহ করলে 'live by' ব্যবহৃত হয়।",
    exam: "22nd BCS, 16th BCS"
  },
  {
    q: "The homesick exile longed _____ his beloved native village.",
    target: "long for",
    opts: ["to", "after", "for", "in"],
    ans: "c",
    meaning: "long for - কোনো কিছুর জন্য তীব্র ব্যাকুলতা প্রকাশ করা",
    exp: "তীব্র আকাঙ্ক্ষা প্রকাশ করতে 'long for' বা 'yearn for' ব্যবহৃত হয়।",
    exam: "37th BCS, 19th BCS"
  },
  {
    q: "The caring elder sister looked _____ the orphaned baby.",
    target: "look after",
    opts: ["for", "into", "after", "at"],
    ans: "c",
    meaning: "look after - দেখাশোনা বা যত্ন নেওয়া",
    exp: "কারো যত্ন নেওয়া বা প্রতিপালন করা অর্থে 'look after' (take care of) বসে।",
    exam: "10th BCS, 15th BCS"
  },
  {
    q: "The detective is rigorously looking _____ the mysterious robbery.",
    target: "look into",
    opts: ["after", "for", "into", "over"],
    ans: "c",
    meaning: "look into - কোনো মামলা বা রহস্যের তদন্ত করা",
    exp: "তদন্ত করা অর্থে 'look into' (investigate) ব্যবহৃত হয়।",
    exam: "27th BCS, Police Sub-Inspector 2019"
  },
  {
    q: "Never look _____ upon those less fortunate than yourself.",
    target: "look down upon",
    opts: ["down on", "down upon", "up to", "away from"],
    ans: "b",
    meaning: "look down upon - কাউকে ঘৃণা বা হেয় চোখে দেখা",
    exp: "কাউকে অবজ্ঞা বা হীন চোখে দেখা প্রকাশ করতে 'look down upon' বসে। শ্রদ্ধা করা অর্থে 'look up to' বসে।",
    exam: "33rd BCS, 18th BCS"
  },
  {
    q: "A loyal citizen remains steadfastly loyal _____ his country.",
    target: "loyal to",
    opts: ["with", "for", "to", "towards"],
    ans: "c",
    meaning: "loyal to - বিশ্বস্ত বা অনুগত",
    exp: "আনুগত্য বা বিশ্বস্ততা প্রকাশ করতে 'loyal to', 'faithful to', 'true to' বসে।",
    exam: "20th BCS, Primary Teacher 2021"
  },
  {
    q: "This elegant antique chair is made _____ solid teak wood.",
    target: "made of",
    opts: ["from", "of", "with", "by"],
    ans: "b",
    meaning: "made of - উপাদান প্রত্যক্ষভাবে দৃশ্যমান থাকা",
    exp: "যে বস্তু থেকে তৈরি তা যদি বাহ্যিকভাবে চেনা যায় তবে 'made of' বসে (কাঠ থেকে চেয়ার)। কিন্তু উপাদান পরিবর্তিত হয়ে নতুন রূপ নিলে 'made from' বসে (কাঠ থেকে কাগজ)।",
    exam: "38th BCS, 11th BCS"
  },
  {
    q: "Crisp white paper is industrially made _____ wood pulp.",
    target: "made from",
    opts: ["of", "from", "with", "by"],
    ans: "b",
    meaning: "made from - রূপান্তর ঘটে মূল উপাদান পরিবর্তিত হওয়া",
    exp: "উৎপাদন প্রক্রিয়ায় মূল উপাদানের রাসায়নিক পরিবর্তন ঘটলে 'made from' বসে (Paper is made from wood)।",
    exam: "34th BCS, 13th BCS"
  },
  {
    q: "He is so formidable that he has no equal or match _____ him.",
    target: "match for",
    opts: ["to", "with", "for", "against"],
    ans: "c",
    meaning: "match for - উপযুক্ত প্রতিদ্বন্দ্বী বা সমকক্ষ",
    exp: "উপযুক্ত প্রতিপক্ষ হওয়া বোঝাতে 'match for' বসে (He is no match for him)।",
    exam: "29th BCS, DU Admission 2018"
  },
  {
    q: "The whole township mourned _____ the untimely death of the mayor.",
    target: "mourn for",
    opts: ["at", "over", "for", "with"],
    ans: "c",
    meaning: "mourn for - কারো মৃত্যুতে শোক পালন করা",
    exp: "শোক প্রকাশ করা অর্থে 'mourn for' বা 'mourn over' বসে।",
    exam: "23rd BCS, Senior Staff Nurse 2020"
  },
  {
    q: "Sympathy for the suffering is entirely natural _____ human beings.",
    target: "natural to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "natural to - স্বাভাবিক বা স্বভাবজাত",
    exp: "কোনো সত্তার জন্য স্বাভাবিক প্রবণতা নির্দেশ করতে 'natural to' ব্যবহৃত হয়।",
    exam: "32nd BCS, 17th BCS"
  },
  {
    q: "Adequate sunlight is absolutely necessary _____ plant photosynthesis.",
    target: "necessary for",
    opts: ["to", "for", "in", "with"],
    ans: "b",
    meaning: "necessary for - কোনো কাজের জন্য প্রয়োজনীয়",
    exp: "প্রয়োজনীয়তা প্রকাশে 'necessary for' বা 'necessary to' বসে। সাধারণ উদ্দেশ্যে 'necessary for' অধিক ব্যবহৃত হয়।",
    exam: "12th BCS, 21st BCS"
  },
  {
    q: "The indigent family has an urgent need _____ financial relief.",
    target: "need of",
    opts: ["for", "of", "to", "in"],
    ans: "b",
    meaning: "in need of - প্রয়োজনীয়তা বা অভাবগ্রস্ত হওয়া",
    exp: "'In need of' একটি সুনির্দিষ্ট ফ্রেজ যার অর্থ কোনো কিছুর অভাবে থাকা।",
    exam: "35th BCS, Primary Teacher 2022"
  },
  {
    q: "The irresponsible nurse was criminally negligent _____ her duties.",
    target: "negligent of",
    opts: ["in", "of", "to", "with"],
    ans: "b",
    meaning: "negligent of / in - দায়িত্বে অবহেলাকারী",
    exp: "দায়িত্বের প্রতি অবহেলা প্রকাশে 'negligent of' বা 'negligent in' বসে।",
    exam: "26th BCS, Agrani Bank SO 2019"
  },
  {
    q: "The infamous bandit was notorious _____ ruthless daylight plunders.",
    target: "notorious for",
    opts: ["in", "for", "with", "by"],
    ans: "b",
    meaning: "notorious for - কোনো কুকর্ম বা অপকর্মে কুখ্যাত",
    exp: "খারাপ কোনো কাজের জন্য পরিচিত হওয়া প্রকাশে 'notorious for' বসে।",
    exam: "16th BCS, Police Sub-Inspector 2021"
  },
  {
    q: "Every cultured child ought to be obedient _____ his teachers.",
    target: "obedient to",
    opts: ["with", "for", "to", "towards"],
    ans: "c",
    meaning: "obedient to - আদেশ পালনকারী বা বাধ্য",
    exp: "বাধ্য হওয়া অর্থে 'obedient to' বসে।",
    exam: "10th BCS, 19th BCS"
  },
  {
    q: "The defense lawyer strongly objected _____ the leading question.",
    target: "object to",
    opts: ["with", "to", "against", "at"],
    ans: "b",
    meaning: "object to - কোনো ব্যাপারে আনুষ্ঠানিক আপত্তি জ্ঞাপন করা",
    exp: "আপত্তি প্রকাশ করতে 'object to' বসে এবং এরপরে gerund বা noun বসে (object to paying/doing)।",
    exam: "38th BCS, Judicial Exam 2019"
  },
  {
    q: "I am immensely obliged _____ you for your gracious benevolence.",
    target: "obliged to",
    opts: ["for", "with", "to", "at"],
    ans: "c",
    meaning: "obliged to (someone) - কারো কাছে বাধিত বা কৃতজ্ঞ",
    exp: "ব্যক্তির কাছে কৃতজ্ঞ হলে 'obliged to', আর উপকারের জন্য হলে 'obliged for' বসে (obliged to you for your help)।",
    exam: "24th BCS, 14th BCS"
  },
  {
    q: "Illiteracy is a grave obstacle _____ nation-wide economic progress.",
    target: "obstacle to",
    opts: ["in", "to", "for", "against"],
    ans: "b",
    meaning: "obstacle to - কোনো অগ্রগতির পথে বড় প্রতিবন্ধক বা বাধা",
    exp: "প্রতিবন্ধকতা প্রকাশ করতে 'obstacle to' বসে, 'in' বা 'for' নয়।",
    exam: "30th BCS, 13th BCS"
  },
  {
    q: "The scholar is fully occupied _____ compiling his new dictionary.",
    target: "occupied with",
    opts: ["in", "with", "at", "for"],
    ans: "b",
    meaning: "occupied with / in - কোনো কাজে নিমগ্ন বা ব্যস্ত থাকা",
    exp: "কোনো কাজ নিয়ে ব্যাপৃত থাকা অর্থে 'occupied with' বা 'occupied in' বসে।",
    exam: "27th BCS, Bangla Academy Exam"
  },
  {
    q: "The controversial policy is wide open _____ severe public criticism.",
    target: "open to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "open to - কোনো সমালোচনার জন্য উন্মুক্ত বা সহজলভ্য",
    exp: "কোনো পরিণামের মুখে উন্মুক্ত থাকা অর্থে 'open to criticism/conviction' বসে।",
    exam: "33rd BCS, Sonali Bank Officer 2020"
  },
  {
    q: "The community leaders are vehemently opposed _____ the new tax.",
    target: "opposed to",
    opts: ["with", "against", "to", "for"],
    ans: "c",
    meaning: "opposed to - কোনো প্রস্তাব বা বিষয়ের ঘোর বিরোধী",
    exp: "কোনো কিছুর বিরুদ্ধে অবস্থান নেওয়া প্রকাশ করতে 'opposed to' বসে।",
    exam: "36th BCS, Combined 8 Banks Officer 2022"
  },
  {
    q: "The city hospital stands directly opposite _____ the town square.",
    target: "opposite to",
    opts: ["from", "to", "with", "at"],
    ans: "b",
    meaning: "opposite to - কোনো কিছুর সামনাসামনি বা বিপরীতে অবস্থিত",
    exp: "সামনাসামনি অবস্থান প্রকাশে 'opposite to' ব্যবহৃত হয়।",
    exam: "18th BCS, Primary Teacher 2019"
  },
  {
    q: "The devastating epidemic originated _____ unhygienic stagnant water.",
    target: "originate in",
    opts: ["from", "in", "to", "with"],
    ans: "b",
    meaning: "originate in - কোনো স্থান বা উৎসে প্রথম সূচিত হওয়া",
    exp: "কোনো স্থানে উৎপন্ন হওয়া অর্থে 'originate in', আর কোনো বস্তু বা ব্যক্তি থেকে উদ্ভুত হলে 'originate from' বসে।",
    exam: "39th BCS, Health Directorate 2020"
  },
  {
    q: "Railway tracks run completely parallel _____ each other.",
    target: "parallel to",
    opts: ["with", "to", "against", "for"],
    ans: "b",
    meaning: "parallel to - সমান্তরালভাবে প্রবাহিত বা অবস্থিত",
    exp: "সমান্তরাল রেখা বা অবস্থান বোঝাতে 'parallel to' বসে।",
    exam: "25th BCS, Bangladesh Railway Engineer 2019"
  },
  {
    q: "A miser finds it agonizing to part _____ his hoarded gold.",
    target: "part with",
    opts: ["from", "with", "to", "of"],
    ans: "b",
    meaning: "part with (a thing) - কোনো বস্তু বা ধনসম্পদ ত্যাগ করা",
    exp: "কোনো জিনিস হাতছাড়া করা বা ত্যাগ করা অর্থে 'part with' বসে। কিন্তু কোনো ব্যক্তির থেকে বিদায় নিয়ে চলে যাওয়া অর্থে 'part from' বসে।",
    exam: "37th BCS, 15th BCS"
  },
  {
    q: "The weeping mother reluctantly parted _____ her departing son.",
    target: "part from",
    opts: ["with", "from", "to", "away"],
    ans: "b",
    meaning: "part from (a person) - কোনো ব্যক্তি হতে বিচ্ছিন্ন বা বিদায় নেওয়া",
    exp: "ব্যক্তির কাছ থেকে বিদায় গ্রহণ প্রকাশ করতে 'part from' বসে।",
    exam: "31st BCS, 21st BCS"
  },
  {
    q: "The dedicated researcher has an intense passion _____ astronomy.",
    target: "passion for",
    opts: ["in", "of", "for", "to"],
    ans: "c",
    meaning: "passion for - কোনো বিষয়ের প্রতি প্রবল অনুরাগ বা টান",
    exp: "কোনো বিষয়ের গভীর অনুরাগ বোঝাতে 'passion for' বসে।",
    exam: "28th BCS, DU 'A' Unit 2021"
  },
  {
    q: "An effective educator must be remarkably patient _____ slow learners.",
    target: "patient with",
    opts: ["to", "with", "for", "in"],
    ans: "b",
    meaning: "patient with - কারো প্রতি ধৈর্যশীল ও সহনশীল",
    exp: "মানুষের প্রতি ধৈর্যশীল আচরণ বোঝাতে 'patient with' বসে।",
    exam: "17th BCS, Primary Teacher 2020"
  },
  {
    q: "Why do you stubbornly persist _____ repeating this dangerous folly?",
    target: "persist in",
    opts: ["to", "with", "in", "on"],
    ans: "c",
    meaning: "persist in - কোনো কাজে একগুঁয়েভাবে লেগে থাকা",
    exp: "কোনো কাজে একনাগাড়ে লেগে থাকা বোঝাতে 'persist in' বসে এবং এরপরে gerund বসে (persist in doing)।",
    exam: "34th BCS, 11th BCS"
  },
  {
    q: "Have some compassionate pity _____ the destitute and homeless.",
    target: "pity for",
    opts: ["on", "for", "to", "with"],
    ans: "b",
    meaning: "pity for - কারো জন্য অন্তরে দয়া বা করুণা",
    exp: "Noun হিসেবে 'pity for' বসে (take pity on someone / have pity for someone)।",
    exam: "22nd BCS, 14th BCS"
  },
  {
    q: "The virtuoso maestro played delightfully _____ his wooden flute.",
    target: "play on",
    opts: ["with", "at", "on", "in"],
    ans: "c",
    meaning: "play on - বাদ্যযন্ত্র বাজানো",
    exp: "কোনো বাদ্যযন্ত্র সুর তুলে বাজানো অর্থে 'play on' গ্রুপ ভার্ব ব্যবহৃত হয় (play on the guitar/flute)।",
    exam: "35th BCS, Shilpakala Academy Exam 2020"
  },
  {
    q: "The examiner was thoroughly pleased _____ the student's coherent essay.",
    target: "pleased with",
    opts: ["at", "with", "for", "by"],
    ans: "b",
    meaning: "pleased with - কারো পারফরম্যান্স বা কাজে সন্তুষ্ট",
    exp: "কোনো ব্যক্তির কর্ম বা আচরণের প্রতি সন্তুষ্ট প্রকাশ করতে 'pleased with' বসে।",
    exam: "12th BCS, 23rd BCS"
  },
  {
    q: "A gentleman is invariably polite and courteous _____ everyone he meets.",
    target: "polite to",
    opts: ["with", "for", "to", "towards"],
    ans: "c",
    meaning: "polite to - কারো প্রতি বিনয়ী ও ভদ্র",
    exp: "ভদ্র আচরণ প্রকাশ করতে 'polite to' প্রমিতভাবে ব্যবহৃত হয়।",
    exam: "19th BCS, Primary Teacher 2018"
  },
  {
    q: "The populist senator is immensely popular _____ ordinary working voters.",
    target: "popular with",
    opts: ["to", "for", "with", "among"],
    ans: "c",
    meaning: "popular with / among - কারো মাঝে অত্যন্ত জনপ্রিয়",
    exp: "কোনো গোষ্ঠীর কাছে জনপ্রিয় বোঝাতে 'popular with' সর্বাধিক স্বীকৃত প্রমিত রূপ।",
    exam: "30th BCS, 16th BCS"
  },
  {
    q: "Health is always preferable _____ vast material wealth.",
    target: "preferable to",
    opts: ["than", "more than", "to", "over"],
    ans: "c",
    meaning: "preferable to - অধিকতর কাম্য বা শ্রেয়",
    exp: "Preferable-এর পর কখনো 'than' বসে না, সর্বদা 'to' বসে।",
    exam: "41st BCS, 10th BCS"
  },
  {
    q: "Arbitrary dismissal without notice is prejudicial _____ natural justice.",
    target: "prejudicial to",
    opts: ["for", "to", "against", "with"],
    ans: "b",
    meaning: "prejudicial to - ন্যায়বিচার বা স্বার্থের পক্ষে হানিকর বা ক্ষতিকর",
    exp: "ক্ষতিকর বা স্বার্থবিরোধী প্রকাশ করতে 'prejudicial to' বসে।",
    exam: "38th BCS, Judicial Exam 2021"
  },
  {
    q: "The candidate is diligently preparing _____ the rigorous civil service test.",
    target: "prepare for",
    opts: ["to", "for", "in", "with"],
    ans: "b",
    meaning: "prepare for - কোনো পরীক্ষা বা ঘটনার জন্য প্রস্তুত হওয়া",
    exp: "প্রস্তুতি গ্রহণ করা প্রকাশে 'prepare for' বসে।",
    exam: "13th BCS, Primary Teacher 2022"
  },
  {
    q: "The seasoned diplomat presided _____ the international peace symposium.",
    target: "preside over",
    opts: ["at", "on", "over", "upon"],
    ans: "c",
    meaning: "preside over - কোনো সভা বা সম্মেলনে সভাপতিত্ব করা",
    exp: "কোনো সভায় সভাপতিত্ব করা বোঝাতে সর্বদা 'preside over' বসে।",
    exam: "26th BCS, 20th BCS"
  },
  {
    q: "The police prevented the agitated crowd _____ entering the assembly hall.",
    target: "prevent from",
    opts: ["to", "from", "for", "against"],
    ans: "b",
    meaning: "prevent from - কোনো কিছু করা থেকে নিবৃত্ত বা প্রতিরোধ করা",
    exp: "বিরত বা প্রতিরোধ করা অর্থে 'prevent from' বসে এবং এরপরে gerund বসে (prevented him from going)।",
    exam: "36th BCS, 14th BCS"
  },
  {
    q: "All requisite clearances must be attained prior _____ project commencement.",
    target: "prior to",
    opts: ["than", "to", "from", "before"],
    ans: "b",
    meaning: "prior to - কোনো কিছুর পূর্ববর্তী বা পূর্বে",
    exp: "Prior একটি ল্যাটিন শব্দ, যার অর্থ 'পূর্বে', এবং এরপরে সর্বদা 'to' বসে।",
    exam: "33rd BCS, Bangladesh Bank AD 2019"
  },
  {
    q: "The maritime laws prohibit tankers _____ discharging crude petroleum.",
    target: "prohibit from",
    opts: ["to", "from", "against", "in"],
    ans: "b",
    meaning: "prohibit from - আইনবলে নিষিদ্ধ করা",
    exp: "কোনো কাজে নিষেধাজ্ঞা জারি করা প্রকাশে 'prohibit from' এবং এরপর verb+ing রূপ বসে।",
    exam: "27th BCS, Department of Shipping Exam"
  },
  {
    q: "An agile secretary is commendably prompt _____ answering correspondence.",
    target: "prompt in",
    opts: ["at", "in", "for", "to"],
    ans: "b",
    meaning: "prompt in - কোনো কাজে চটপটে ও দ্রুত তৎপর",
    exp: "কোনো কাজে তড়িৎ হওয়া প্রকাশ করতে 'prompt in' ব্যবহৃত হয়।",
    exam: "31st BCS, Secretariat Exam 2018"
  },
  {
    q: "Impulsive youths are especially prone _____ rash emotional decisions.",
    target: "prone to",
    opts: ["for", "to", "towards", "at"],
    ans: "b",
    meaning: "prone to - কোনো খারাপ প্রবণতায় আক্রান্ত হওয়ার ঝুঁকিরূপে প্রবণ",
    exp: "ঝুঁকি বা প্রবণতা নির্দেশ করতে 'prone to' বসে (prone to accidents/mistakes)।",
    exam: "37th BCS, DU Admission 2020"
  },
  {
    q: "The brave shield protected the knight _____ lethal arrows.",
    target: "protect from",
    opts: ["against", "of", "from", "to"],
    ans: "c",
    meaning: "protect from / against - বিপদ বা আঘাত থেকে রক্ষা করা",
    exp: "রক্ষা করা প্রকাশে 'protect from' বা 'protect against' উভয়ই প্রচলিত; বিপদ থেকে রক্ষায় 'protect from' সর্বাধিক সমাদৃত।",
    exam: "24th BCS, 11th BCS"
  },
  {
    q: "Every proud father is naturally proud _____ his son's integrity.",
    target: "proud of",
    opts: ["with", "for", "of", "at"],
    ans: "c",
    meaning: "proud of - কোনো গুণে গর্বিত",
    exp: "গর্ব প্রকাশে 'proud of' বসে। তবে অহংকার বোঝাতে Verb হিসেবে 'pride oneself on' বসে।",
    exam: "15th BCS, Primary Teacher 2019"
  },
  {
    q: "A prudent parent strives to provide _____ the future of his children.",
    target: "provide for",
    opts: ["to", "with", "for", "in"],
    ans: "c",
    meaning: "provide for - ভবিষ্যতের সংস্থান বা ভরণপোষণ করা",
    exp: "ভবিষ্যতের ভরণপোষণের সংস্থান করা বোঝাতে 'provide for' বসে। কোনো সামগ্রী সরবরাহ করা অর্থে 'provide with' বসে।",
    exam: "28th BCS, 17th BCS"
  },
  {
    q: "The relief agency provided the flood victims _____ food and medicine.",
    target: "provide with",
    opts: ["to", "for", "with", "by"],
    ans: "c",
    meaning: "provide ... with - কাউকে প্রয়োজনীয় সামগ্রী যোগান দেওয়া",
    exp: "কাউকে কোনো দ্রব্যাদি সরবরাহ করার ক্ষেত্রে 'provide (someone) with (something)' কাঠামো বসে।",
    exam: "35th BCS, Disaster Management Exam 2021"
  },
  {
    q: "He is thoroughly qualified _____ the specialized research position.",
    target: "qualified for",
    opts: ["to", "in", "for", "with"],
    ans: "c",
    meaning: "qualified for - কোনো পদের জন্য প্রয়োজনীয় যোগ্যতাসম্পন্ন",
    exp: "কোনো পদের জন্য উপযুক্ত যোগ্যতা বোঝাতে 'qualified for' বসে।",
    exam: "18th BCS, Primary Teacher 2020"
  },
  {
    q: "Do not quarrel with your neighbours _____ trifling petty matters.",
    target: "quarrel over",
    opts: ["at", "over", "with", "for"],
    ans: "b",
    meaning: "quarrel over / about - কোনো বিষয় নিয়ে ঝগড়া করা",
    exp: "ব্যক্তির সাথে ঝগড়া হলে 'quarrel with', আর বিষয় নিয়ে ঝগড়া হলে 'quarrel over' বা 'quarrel about' বসে।",
    exam: "21st BCS, 10th BCS"
  },
  {
    q: "She is remarkably quick _____ solving mental arithmetic problems.",
    target: "quick at",
    opts: ["in", "at", "for", "with"],
    ans: "b",
    meaning: "quick at - কোনো কাজে ক্ষিপ্র ও চটপটে",
    exp: "কোনো দক্ষতা বা কর্মে ক্ষিপ্রতা প্রকাশ করতে 'quick at' বসে। চট করে বুঝতে পারা অর্থে 'quick of understanding' বসে।",
    exam: "30th BCS, Janata Bank Officer 2019"
  },
  {
    q: "The patient has fully recovered _____ a protracted bout of malaria.",
    target: "recover from",
    opts: ["of", "from", "with", "by"],
    ans: "b",
    meaning: "recover from - রোগ বা দুর্ঘটনা থেকে সেরে ওঠা বা আরোগ্য লাভ করা",
    exp: "অসুস্থতা বা ক্ষতি থেকে সেরে ওঠা অর্থে 'recover from' বসে।",
    exam: "16th BCS, Primary Teacher 2021"
  },
  {
    q: "For comprehensive details, please refer _____ paragraph four of the treaty.",
    target: "refer to",
    opts: ["in", "at", "to", "with"],
    ans: "c",
    meaning: "refer to - কোনো বই, তথ্য বা বিষয়ে নির্দেশ করা বা দৃষ্টি আকর্ষণ করা",
    exp: "উল্লেখ করা বা দৃষ্টি আকর্ষণ করতে 'refer to' বসে।",
    exam: "32nd BCS, 12th BCS"
  },
  {
    q: "All attendees are politely requested to refrain _____ smoking here.",
    target: "refrain from",
    opts: ["to", "from", "of", "with"],
    ans: "b",
    meaning: "refrain from - কোনো কাজ থেকে বিরত থাকা",
    exp: "বিরত থাকা বোঝাতে 'refrain from' বসে এবং এরপরে verb+ing বসে (refrain from doing)।",
    exam: "39th BCS, 19th BCS"
  },
  {
    q: "We must retain boundless regard _____ the brave martyrs of our liberation war.",
    target: "regard for",
    opts: ["to", "for", "with", "towards"],
    ans: "b",
    meaning: "regard for - শ্রদ্ধা বা সম্ভ্রম",
    exp: "শ্রদ্ধা বা সম্মান প্রকাশে Noun হিসেবে 'regard for' বসে। তবে 'with regard to' একটি পৃথক ফ্রেজ যার অর্থ 'সম্পর্কে'।",
    exam: "23rd BCS, Freedom Fighters Ministry Exam"
  },
  {
    q: "The entire country rejoiced _____ the historic cricket triumph.",
    target: "rejoice at",
    opts: ["at", "in", "for", "with"],
    ans: "a",
    meaning: "rejoice at / in - কোনো বিজয়ে বা আনন্দে উল্লাস করা",
    exp: "কোনো শুভ ঘটনায় আনন্দ প্রকাশ করতে 'rejoice at' বা 'rejoice in' বসে।",
    exam: "25th BCS, Sports Ministry Exam 2018"
  },
  {
    q: "His detailed presentation was strictly relevant _____ the core topic.",
    target: "relevant to",
    opts: ["with", "for", "to", "at"],
    ans: "c",
    meaning: "relevant to - বিষয়ের সাথে প্রাসঙ্গিক বা সংগতিপূর্ণ",
    exp: "প্রাসঙ্গিকতা প্রকাশে 'relevant to' বসে। অপ্রাসঙ্গিক বোঝাতে 'irrelevant to' বসে।",
    exam: "34th BCS, 14th BCS"
  },
  {
    q: "You should not unquestioningly rely _____ speculative market rumours.",
    target: "rely on",
    opts: ["with", "for", "to", "on"],
    ans: "d",
    meaning: "rely on / upon - কোনো কিছুর ওপর নির্ভর বা ভরসা করা",
    exp: "ভরসা বা আস্থা প্রকাশ করতে 'rely on' বা 'rely upon' ব্যবহৃত হয়।",
    exam: "11th BCS, Primary Teacher 2019"
  },
  {
    q: "Cox's Bazar is globally remarkable _____ its unbroken sandy beach.",
    target: "remarkable for",
    opts: ["in", "for", "with", "by"],
    ans: "b",
    meaning: "remarkable for - কোনো বিশেষত্বের জন্য উল্লেখযোগ্য বা স্মরণীয়",
    exp: "বিশেষ বৈশিষ্ট্যের কারণে খ্যাতিমান হওয়া অর্থে 'remarkable for' বসে।",
    exam: "27th BCS, Tourism Board Exam 2020"
  },
  {
    q: "There is unfortunately no miraculous remedy _____ the common cold.",
    target: "remedy for",
    opts: ["of", "to", "for", "in"],
    ans: "c",
    meaning: "remedy for - কোনো রোগের বা সমস্যার প্রতিষেধক বা প্রতিকার",
    exp: "রোগের প্রতিকার নির্দেশ করতে 'remedy for' ব্যবহৃত হয়।",
    exam: "20th BCS, 13th BCS"
  },
  {
    q: "Your cheerful smile sweetly reminds me _____ your graceful mother.",
    target: "remind of",
    opts: ["about", "of", "to", "with"],
    ans: "b",
    meaning: "remind of - কারো স্মৃতি মনে করিয়ে দেওয়া",
    exp: "কারো কথা মনে করিয়ে দেওয়া বোঝাতে 'remind (someone) of (something/someone)' ব্যবহৃত হয়।",
    exam: "36th BCS, 17th BCS"
  },
  {
    q: "A sincere sinner will truly repent _____ his past misdeeds.",
    target: "repent of",
    opts: ["for", "to", "of", "with"],
    ans: "c",
    meaning: "repent of - অনুতাপ বা অনুশোচনা প্রকাশ করা",
    exp: "কৃত ভুলের জন্য অনুশোচনা প্রকাশ করতে 'repent of' ব্যবহৃত হয়।",
    exam: "22nd BCS, 15th BCS"
  },
  {
    q: "The comprehensive textbook is abundantly replete _____ practical diagrams.",
    target: "replete with",
    opts: ["of", "in", "by", "with"],
    ans: "d",
    meaning: "replete with - প্রচুর পরিমাণে পরিপূর্ণ বা সমৃদ্ধ",
    exp: "পরিপূর্ণ বা ঠাসা বোঝাতে 'replete with' বসে (replete with examples)।",
    exam: "37th BCS, DU Admission 2019"
  },
  {
    q: "The stoic philosopher resigned himself _____ his inevitable fate.",
    target: "resign to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "resign oneself to - ভাগ্যের কাছে নির্লিপ্তভাবে আত্মসমর্পণ করা",
    exp: "অদৃষ্টের কাছে নিজেকে সঁপে দেওয়া প্রকাশ করতে 'resign to' বসে। পদত্যাগের ক্ষেত্রে 'resign from' বসে।",
    exam: "31st BCS, 18th BCS"
  },
  {
    q: "Parents are inherently responsible _____ the well-being of their children.",
    target: "responsible for",
    opts: ["to", "for", "with", "of"],
    ans: "b",
    meaning: "responsible for - কোনো দায়িত্বের জন্য দায়বদ্ধ",
    exp: "কোনো বিষয়ের জন্য দায়বদ্ধ হলে 'responsible for', আর ঊর্ধ্বতন কর্তৃপক্ষের নিকট জবাবদিহিমূলক হলে 'responsible to' বসে।",
    exam: "14th BCS, Primary Teacher 2021"
  },
  {
    q: "Civil servants are directly responsible _____ the elected government.",
    target: "responsible to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "responsible to (an authority) - কর্তৃপক্ষের নিকট দায়বদ্ধ থাকা",
    exp: "ঊর্ধ্বতন বা সংস্থার কাছে জবাবদিহি করতে বাধ্য হওয়া অর্থে 'responsible to' বসে।",
    exam: "29th BCS, Public Administration Exam"
  },
  {
    q: "Admission to the confidential archive was restricted _____ authorized personnel.",
    target: "restrict to",
    opts: ["for", "to", "with", "in"],
    ans: "b",
    meaning: "restricted to - নির্দিষ্ট ব্যক্তিদের জন্য সীমাবদ্ধ",
    exp: "সীমাবদ্ধ রাখা প্রকাশ করতে 'restricted to' বসে।",
    exam: "38th BCS, Cabinet Division Exam 2020"
  },
  {
    q: "Economic inflation often results _____ irresponsible fiscal expansion.",
    target: "result from",
    opts: ["in", "from", "to", "of"],
    ans: "b",
    meaning: "result from - কোনো কারণ হতে উৎপন্ন হওয়া",
    exp: "কোনো পূর্ববর্তী কারণের ফলে ঘটা বোঝালে 'result from' বসে। আর কোনো কাজের চূড়ান্ত পরিণতি প্রকাশে 'result in' বসে।",
    exam: "33rd BCS, Bangladesh Bank AD 2018"
  },
  {
    q: "Reckless driving invariably results _____ catastrophic road casualties.",
    target: "result in",
    opts: ["from", "to", "in", "with"],
    ans: "c",
    meaning: "result in - কোনো চূড়ান্ত পরিণতিতে পর্যবসিত হওয়া",
    exp: "চূড়ান্ত ফলাফল বা পরিণতি বয়ে আনা বোঝাতে 'result in' বসে (The dispute resulted in war)।",
    exam: "26th BCS, 12th BCS"
  },
  {
    q: "Bangladesh is proverbially rich _____ fertile alluvial soil and flora.",
    target: "rich in",
    opts: ["with", "of", "in", "by"],
    ans: "c",
    meaning: "rich in - কোনো খনিজ বা প্রাকৃতিক সম্পদে সমৃদ্ধ",
    exp: "প্রচুর সম্পদে সমৃদ্ধ হওয়া বোঝাতে 'rich in' বসে (rich in minerals/vitamins)।",
    exam: "10th BCS, Primary Teacher 2018"
  },
  {
    q: "The daring highwaymen robbed the merchant _____ all his gemstones.",
    target: "rob of",
    opts: ["from", "with", "of", "to"],
    ans: "c",
    meaning: "rob ... of - কোনো কিছু ডাকাতি বা ছিনিয়ে নেওয়া",
    exp: "কারো কাছ থেকে কোনো কিছু জোরপূর্বক হরণ করা অর্থে 'rob (someone) of (something)' ব্যবহৃত হয়।",
    exam: "35th BCS, 16th BCS"
  },
  {
    q: "The curious cat ran _____ the scampering mouse.",
    target: "run after",
    opts: ["over", "after", "into", "through"],
    ans: "b",
    meaning: "run after - পেছনে পেছনে ধাওয়া করা",
    exp: "কাউকে ধরার জন্য পেছনে তাড়া করা অর্থে 'run after' বসে। অপ্রত্যাশিত সাক্ষাৎ বোঝাতে 'run into' বসে।",
    exam: "19th BCS, Primary Teacher 2020"
  },
  {
    q: "The reckless speeding truck ran _____ an innocent pedestrian.",
    target: "run over",
    opts: ["upon", "over", "into", "through"],
    ans: "b",
    meaning: "run over - গাড়ি চাপা দেওয়া",
    exp: "যানবাহনের চাকার নিচে পিষ্ট করা বোঝাতে 'run over' ফ্রেজাল ভার্ব ব্যবহৃত হয়।",
    exam: "24th BCS, Traffic Police Exam 2019"
  },
  {
    q: "During the expedition, the explorers completely ran _____ fresh drinking water.",
    target: "run out of",
    opts: ["away with", "out of", "down with", "off to"],
    ans: "b",
    meaning: "run out of - মজুত সামগ্রী নিঃশেষ হয়ে যাওয়া",
    exp: "খাবার বা পানীয় সামগ্রী ফুরিয়ে যাওয়া অর্থে 'run out of' বসে।",
    exam: "37th BCS, Combined 4 Banks Officer 2021"
  },
  {
    q: "The venerable shrine is held sacred _____ millions of pilgrims.",
    target: "sacred to",
    opts: ["for", "with", "to", "in"],
    ans: "c",
    meaning: "sacred to - কারো নিকটে পবিত্র বা শ্রদ্ধেয়",
    exp: "কারো বিশ্বাসে কোনো কিছু পবিত্র বিবেচিত হওয়া অর্থে 'sacred to' ব্যবহৃত হয়।",
    exam: "21st BCS, Religious Affairs Ministry"
  },
  {
    q: "The terrified passengers were finally safe _____ imminent peril.",
    target: "safe from",
    opts: ["against", "of", "from", "with"],
    ans: "c",
    meaning: "safe from - কোনো আশঙ্কা বা বিপদ থেকে নিরাপদ",
    exp: "বিপদ হতে মুক্ত ও নিরাপদ প্রকাশে 'safe from' বসে।",
    exam: "13th BCS, Primary Teacher 2019"
  },
  {
    q: "The satisfied customer was thoroughly satisfied _____ the prompt service.",
    target: "satisfied with",
    opts: ["at", "with", "by", "for"],
    ans: "b",
    meaning: "satisfied with - কোনো সেবা বা আচরণে পুরোপুরি সন্তুষ্ট",
    exp: "সন্তুষ্টি প্রকাশে 'satisfied with' বসে। অসন্তুষ্টি প্রকাশে 'dissatisfied with' বসে।",
    exam: "17th BCS, 23rd BCS"
  },
  {
    q: "The police conducted a relentless search _____ the absconding fugitive.",
    target: "search for",
    opts: ["of", "to", "for", "after"],
    ans: "c",
    meaning: "search for - কোনো কিছু বা কাউকে খোঁজা",
    exp: "খোঁজা অর্থে Verb হিসেবে 'search for' বসে। তবে ফ্রেজ হিসেবে 'in search of' বসে (in search of truth)।",
    exam: "28th BCS, Police Sergeant 2020"
  },
  {
    q: "The thirsty crow flew across lands in search _____ water.",
    target: "in search of",
    opts: ["for", "to", "of", "with"],
    ans: "c",
    meaning: "in search of - কোনো কিছুর সন্ধানে",
    exp: "'In search of' একটি স্থায়ী ফ্রেজ (The crow flew in search of water)।",
    exam: "11th BCS, Primary Teacher 2021"
  },
  {
    q: "The incorrigible traitor was sentenced _____ capital punishment.",
    target: "sentenced to",
    opts: ["for", "to", "with", "by"],
    ans: "b",
    meaning: "sentenced to - আদালতে কোনো নির্দিষ্ট দণ্ডে দণ্ডিত হওয়া",
    exp: "কারাদণ্ড বা মৃত্যুদণ্ডে দণ্ডিত করা বোঝাতে 'sentenced to' বসে (sentenced to death/prison)।",
    exam: "30th BCS, Judicial Exam 2018"
  },
  {
    q: "The entire village was deeply shocked _____ the tragic demise.",
    target: "shocked at",
    opts: ["by", "at", "with", "of"],
    ans: "b",
    meaning: "shocked at - কোনো দুঃখজনক সংবাদ বা ঘটনায় মর্মাহত",
    exp: "কোনো দুঃসংবাদে মর্মাহত হওয়া প্রকাশ করতে 'shocked at' প্রমিতভাবে ব্যবহৃত হয়।",
    exam: "34th BCS, 14th BCS"
  },
  {
    q: "The stranded travellers were critically short _____ ready money.",
    target: "short of",
    opts: ["in", "of", "from", "with"],
    ans: "b",
    meaning: "short of - কোনো কিছুর অনটন বা সংকটে থাকা",
    exp: "টাকা বা পণ্যের স্বল্পতা নির্দেশ করতে 'short of' বসে (short of money/time)।",
    exam: "25th BCS, Janata Bank Officer 2019"
  },
  {
    q: "Your well-argued opinion is remarkably similar _____ mine.",
    target: "similar to",
    opts: ["with", "as", "to", "like"],
    ans: "c",
    meaning: "similar to - কোনো কিছুর সদৃশ বা একই রকম",
    exp: "সাদৃশ্য প্রকাশে Adjective 'similar'-এর পরে সর্বদা 'to' বসে।",
    exam: "15th BCS, 22nd BCS"
  },
  {
    q: "The apprentice is unusually slow _____ grasping modern mechanics.",
    target: "slow at",
    opts: ["in", "at", "of", "to"],
    ans: "b",
    meaning: "slow at - কোনো কাজে অপটু বা মন্থরগতি",
    exp: "কোনো দক্ষতা শিখতে ধীর হওয়া বোঝাতে 'slow at' বা 'slow in' বসে। তবে 'slow of speech' অর্থ বাকশক্তিতে মন্থর।",
    exam: "29th BCS, Technical Education Board"
  },
  {
    q: "Fortune finally smiled _____ the persevering entrepreneur.",
    target: "smile on",
    opts: ["at", "to", "upon", "on"],
    ans: "d",
    meaning: "smile on / upon - ভাগ্য কারো প্রতি সদয় বা সুপ্রসন্ন হওয়া",
    exp: "ভাগ্য বা নিয়তি সদয় হওয়া প্রকাশ করতে 'smile on' বা 'smile upon' বসে। উপহাস করার ক্ষেত্রে 'smile at' বসে।",
    exam: "38th BCS, 12th BCS"
  },
  {
    q: "It is ill-mannered to stare rudely _____ an unfamiliar person.",
    target: "stare at",
    opts: ["to", "at", "upon", "towards"],
    ans: "b",
    meaning: "stare at - একদৃষ্টিতে কারো দিকে অপলক তাকিয়ে থাকা",
    exp: "কারো দিকে একদৃষ্টিতে অপলক তাকিয়ে থাকা বোঝাতে 'stare at' বসে (look fixedly)।",
    exam: "20th BCS, Primary Teacher 2018"
  },
  {
    q: "A principled statesman will resolutely stick _____ his moral oaths.",
    target: "stick to",
    opts: ["with", "on", "to", "by"],
    ans: "c",
    meaning: "stick to - কোনো সিদ্ধান্ত বা নীতিতে অবিচল থাকা",
    exp: "অবিচল থাকা বোঝাতে 'stick to' ব্যবহৃত হয় (stick to one's decision/point)।",
    exam: "33rd BCS, Sonali Bank Officer 2017"
  },
  {
    q: "Every sovereign state is subject _____ international treaties it ratifies.",
    target: "subject to",
    opts: ["of", "to", "in", "under"],
    ans: "b",
    meaning: "subject to - কোনো শর্ত বা আইনের অধীন",
    exp: "শর্ত বা কর্তৃত্বের অধীন হওয়া বোঝাতে 'subject to' ব্যবহৃত হয় (subject to approval/rules)।",
    exam: "36th BCS, Law Ministry Exam 2019"
  },
  {
    q: "The besieged garrison refused to submit _____ foreign invaders.",
    target: "submit to",
    opts: ["before", "to", "with", "against"],
    ans: "b",
    meaning: "submit to - কারো কাছে নতি স্বীকার বা আত্মসমর্পণ করা",
    exp: "আত্মসমর্পণ বা বশ্যতা স্বীকার করা প্রকাশ করতে 'submit to' বা 'yield to' বসে।",
    exam: "26th BCS, Defense Ministry Exam 2020"
  },
  {
    q: "Through relentless hard work, he finally succeeded _____ passing the exam.",
    target: "succeed in",
    opts: ["to", "in", "at", "for"],
    ans: "b",
    meaning: "succeed in - কোনো কাজে সফলতা অর্জন করা",
    exp: "সাফল্য লাভ করা বোঝাতে 'succeed in' বসে এবং এরপর gerund বসে (succeeded in achieving)। উত্তরাধিকার সূত্রে পাওয়ার ক্ষেত্রে 'succeed to' বসে।",
    exam: "16th BCS, Primary Teacher 2021"
  },
  {
    q: "The young prince succeeded _____ the imperial crown upon his father's death.",
    target: "succeed to",
    opts: ["in", "to", "for", "upon"],
    ans: "b",
    meaning: "succeed to (a title/estate) - উত্তরাধিকারী হিসেবে পদ লাভ করা",
    exp: "উত্তরাধিকার সূত্রে সিংহাসন বা সম্পত্তি পাওয়া বোঝাতে 'succeed to' বসে।",
    exam: "39th BCS, DU 'B' Unit 2018"
  },
  {
    q: "The chronic invalid has long been suffering _____ rheumatism.",
    target: "suffer from",
    opts: ["with", "of", "from", "by"],
    ans: "c",
    meaning: "suffer from - কোনো রোগে বা কষ্টে ভোগা",
    exp: "কোনো রোগে বা যন্ত্রণায় ভোগা বোঝাতে 'suffer from' বসে (suffer from fever/pain)।",
    exam: "11th BCS, 21st BCS"
  },
  {
    q: "This modest sum of money is barely sufficient _____ our subsistence.",
    target: "sufficient for",
    opts: ["to", "for", "with", "in"],
    ans: "b",
    meaning: "sufficient for - কোনো প্রয়োজনের জন্য যথেষ্ট বা পর্যাপ্ত",
    exp: "পর্যাপ্ততা প্রকাশ করতে 'sufficient for' বসে।",
    exam: "27th BCS, Primary Teacher 2019"
  },
  {
    q: "This hand-made craft is vastly superior _____ factory alternatives.",
    target: "superior to",
    opts: ["than", "to", "from", "above"],
    ans: "b",
    meaning: "superior to - মানে বা গুণে উৎকৃষ্টতর",
    exp: "ল্যাটিন কম্পারেটিভ 'superior'-এর পরে 'to' বসে, কখনো 'than' নয়।",
    exam: "35th BCS, 14th BCS"
  },
  {
    q: "The generous vendor supplied the relief camp _____ clean water.",
    target: "supply with",
    opts: ["to", "for", "with", "by"],
    ans: "c",
    meaning: "supply ... with - প্রয়োজনীয় দ্রব্যাদি সরবরাহ করা",
    exp: "কাউকে কোনো কিছু সরবরাহ করার ক্ষেত্রে 'supply (someone) with (something)', অথবা 'supply (something) to (someone)' ব্যবহৃত হয়।",
    exam: "31st BCS, Red Crescent 2019"
  },
  {
    q: "I feel absolutely sure _____ our team's upcoming victory.",
    target: "sure of",
    opts: ["about", "of", "to", "in"],
    ans: "b",
    meaning: "sure of - কোনো ফলাফলের ব্যাপারে নিশ্চিত",
    exp: "নিশ্চিত হওয়া প্রকাশ করতে 'sure of' ব্যবহৃত হয়।",
    exam: "18th BCS, Primary Teacher 2018"
  },
  {
    q: "We were all profoundly surprised _____ the unexpected announcement.",
    target: "surprised at",
    opts: ["by", "at", "with", "to"],
    ans: "b",
    meaning: "surprised at - কোনো অপ্রত্যাশিত ঘটনায় আশ্চর্য বা বিস্মিত",
    exp: "ঘটনায় বিস্মিত হলে 'surprised at', আর কোনো ব্যক্তির আচরণে বিস্মিত হলে 'surprised by' বসে।",
    exam: "12th BCS, 23rd BCS"
  },
  {
    q: "The vanquished rebel army had no choice but to surrender _____ the authorities.",
    target: "surrender to",
    opts: ["before", "to", "towards", "against"],
    ans: "b",
    meaning: "surrender to - শত্রুর বা কর্তৃপক্ষের কাছে আত্মসমর্পণ করা",
    exp: "আত্মসমর্পণ করা অর্থে 'surrender to' বসে।",
    exam: "24th BCS, Defense Cadre 2019"
  },
  {
    q: "The magistrate suspected the fraudulent clerk _____ severe embezzlement.",
    target: "suspect of",
    opts: ["for", "with", "of", "in"],
    ans: "c",
    meaning: "suspect ... of - কোনো অপরাধের ব্যাপারে কাউকে সন্দেহ করা",
    exp: "কাউকে কোনো অপরাধের জন্য সন্দেহ করা অর্থে 'suspect (someone) of (something)' ব্যবহৃত হয়।",
    exam: "37th BCS, Anti-Corruption Commission Exam"
  },
  {
    q: "The cautious night watchman was highly suspicious _____ the masked intruders.",
    target: "suspicious of",
    opts: ["with", "about", "to", "of"],
    ans: "d",
    meaning: "suspicious of - কারো প্রতি বা বিষয়ে সন্দেহপ্রবণ",
    exp: "সন্দেহপ্রবণ হওয়া প্রকাশে 'suspicious of' ব্যবহৃত হয়।",
    exam: "28th BCS, Police Sub-Inspector 2020"
  },
  {
    q: "We sincerely sympathize _____ you in this hour of tragic bereavement.",
    target: "sympathize with",
    opts: ["to", "for", "with", "at"],
    ans: "c",
    meaning: "sympathize with - কারো দুঃখ বা বেদনায় সমবেদনা জ্ঞাপন করা",
    exp: "ব্যক্তির প্রতি সমবেদনা জানাতে 'sympathize with' বসে। Noun 'sympathy for' বসে (sympathy for the poor)।",
    exam: "19th BCS, 15th BCS"
  },
  {
    q: "The handsome young boy strikingly takes _____ his grandfather.",
    target: "take after",
    opts: ["after", "for", "to", "like"],
    ans: "a",
    meaning: "take after - চেহারায় বা স্বভাবে পূর্বপুরুষের সদৃশ হওয়া",
    exp: "পিতামাতা বা পূর্বপুরুষের মতো স্বভাব বা চেহারা পাওয়া অর্থে 'take after' (resemble) বসে।",
    exam: "33rd BCS, 10th BCS"
  },
  {
    q: "The cultured gentleman has an exquisite taste _____ classical literature.",
    target: "taste for",
    opts: ["in", "of", "for", "to"],
    ans: "c",
    meaning: "taste for - কোনো বিষয়ে মার্জিত রুচি বা পছন্দ",
    exp: "রুচি বা পছন্দ বোঝাতে 'taste for' বসে (a taste for music/poetry)। তবে কোনো বস্তুর প্রকৃত স্বাদ বোঝাতে 'taste of' বসে (the taste of honey)।",
    exam: "26th BCS, Primary Teacher 2020"
  },
  {
    q: "The witness testified unequivocally _____ the prisoner's complete innocence.",
    target: "testify to",
    opts: ["for", "to", "about", "in"],
    ans: "b",
    meaning: "testify to - কোনো সত্যের স্বপক্ষে সাক্ষ্য প্রদান করা",
    exp: "সাক্ষ্য দেওয়া বোঝাতে 'testify to' বসে (testify to the truth)।",
    exam: "34th BCS, Judicial Exam 2017"
  },
  {
    q: "The overworked commuter is utterly tired _____ waiting in traffic.",
    target: "tired of",
    opts: ["with", "from", "for", "of"],
    ans: "d",
    meaning: "tired of - কোনো একঘেয়েমিতে ক্লান্ত বা বিরক্ত",
    exp: "বিরক্ত বা ক্লান্ত হওয়া প্রকাশ করতে 'tired of' বসে (tired of doing something)। তবে শারীরিক পরিশ্রমে ক্লান্ত হলে 'tired with/from' বসে।",
    exam: "30th BCS, 13th BCS"
  },
  {
    q: "A democratic society must remain open and tolerant _____ diverse beliefs.",
    target: "tolerant of",
    opts: ["to", "of", "with", "towards"],
    ans: "b",
    meaning: "tolerant of - ভিন্নমতের প্রতি সহনশীল",
    exp: "সহনশীলতা প্রকাশে 'tolerant of' প্রমিতভাবে ব্যবহৃত হয়।",
    exam: "38th BCS, DU 'B' Unit 2019"
  },
  {
    q: "A noble patriot always remains unswervingly true _____ his native motherland.",
    target: "true to",
    opts: ["for", "with", "to", "towards"],
    ans: "c",
    meaning: "true to - বিশ্বস্ত বা সত্যনিষ্ঠ",
    exp: "বিশ্বস্ত থাকা বোঝাতে 'true to' বসে (true to one's word/country)।",
    exam: "17th BCS, 11th BCS"
  },
  {
    q: "A pious soul places his ultimate trust _____ Almighty Providence.",
    target: "trust in",
    opts: ["on", "upon", "in", "with"],
    ans: "c",
    meaning: "trust in - কোনো পরম শক্তি বা বিধানে বিশ্বাস বা আস্থা রাখা",
    exp: "বিশ্বাস বা ভরসা রাখা প্রকাশ করতে 'trust in' বসে (Trust in God and do the right)।",
    exam: "22nd BCS, 14th BCS"
  },
  {
    q: "Do not trust a notorious scoundrel _____ your secret affairs.",
    target: "trust with",
    opts: ["to", "for", "with", "in"],
    ans: "c",
    meaning: "trust ... with - কারো হাতে কোনো গোপন দায়িত্ব বা আমানত সঁপে দেওয়া",
    exp: "কাউকে কোনো মূল্যবান জিনিসের দায়িত্বে বিশ্বাস করা অর্থে 'trust (someone) with (something)' বসে।",
    exam: "32nd BCS, Bank Asia SO 2019"
  },
  {
    q: "The frail old bridge proved unequal _____ the weight of the laden trailer.",
    target: "unequal to",
    opts: ["for", "to", "with", "against"],
    ans: "b",
    meaning: "unequal to - কোনো ভার বা কাজ বহনে অসমর্থ",
    exp: "অসমর্থ বা অপারগ হওয়া প্রকাশে 'unequal to' বসে।",
    exam: "25th BCS, Roads and Highways Exam 2018"
  },
  {
    q: "Clean drinking water is indispensable and useful _____ all mankind.",
    target: "useful to",
    opts: ["for", "to", "in", "with"],
    ans: "b",
    meaning: "useful to - কারো উপকারে আসা",
    exp: "ব্যক্তির উপকারে আসা অর্থে 'useful to', আর কোনো নির্দিষ্ট কাজের উপযোগী হলে 'useful for' বসে (useful for health)।",
    exam: "12th BCS, Primary Teacher 2019"
  },
  {
    q: "The arrogant millionaire was ridiculously vain _____ his costly wardrobe.",
    target: "vain of",
    opts: ["for", "with", "of", "about"],
    ans: "c",
    meaning: "vain of - রূপ বা ধনের জন্য গর্বিত বা অহংকারী",
    exp: "অহংকার প্রকাশ করতে 'vain of' বসে (vain of one's beauty/wealth)।",
    exam: "29th BCS, 16th BCS"
  },
  {
    q: "Climate patterns vary significantly _____ one region to another.",
    target: "vary from",
    opts: ["with", "from", "between", "against"],
    ans: "b",
    meaning: "vary from - একটি থেকে অন্যটি ভিন্ন হওয়া",
    exp: "পার্থক্য বা পরিবর্তনশীলতা নির্দেশ করতে 'vary from ... to ...' ব্যবহৃত হয়।",
    exam: "36th BCS, Meteorological Dept Exam"
  },
  {
    q: "The venerable professor is profoundly versed _____ oriental antiquities.",
    target: "versed in",
    opts: ["with", "at", "in", "for"],
    ans: "c",
    meaning: "versed in - কোনো জটিল শাস্ত্রে বা বিদ্যায় সুপণ্ডিত ও দক্ষ",
    exp: "কোনো বিদ্যায় সুপণ্ডিত হওয়া প্রকাশ করতে 'versed in' বসে (well versed in English)।",
    exam: "20th BCS, 18th BCS"
  },
  {
    q: "The unwary tourist fell an easy victim _____ ruthless swindlers.",
    target: "victim to",
    opts: ["of", "to", "for", "with"],
    ans: "b",
    meaning: "fall victim to - কারো ফাঁদে বা চক্রান্তের শিকার হওয়া",
    exp: "'Fall a victim to' বা 'fall victim to' কোনো চক্রান্ত বা শিকারে পতিত হওয়া অর্থে ব্যবহৃত হয়। Noun হিসেবে 'victim of circumstances' বসে।",
    exam: "37th BCS, 15th BCS"
  },
  {
    q: "His convoluted excuse was completely void _____ factual substance.",
    target: "void of",
    opts: ["from", "with", "of", "in"],
    ans: "c",
    meaning: "void of - কোনো বস্তু বা গুণ থেকে সম্পূর্ণ শূন্য",
    exp: "শূন্য বা রিক্ত হওয়া প্রকাশ করতে 'void of' বসে (void of meaning/sense)।",
    exam: "31st BCS, Judicial Exam 2020"
  },
  {
    q: "We waited anxiously _____ his scheduled flight to arrive.",
    target: "wait for",
    opts: ["upon", "at", "to", "for"],
    ans: "d",
    meaning: "wait for - কারো বা কোনো কিছুর জন্য অপেক্ষা করা",
    exp: "অপেক্ষা করা বোঝাতে 'wait for' বসে। কিন্তু সেবা-শুশ্রূষা করা অর্থে 'wait on' বা 'wait upon' বসে।",
    exam: "10th BCS, Primary Teacher 2021"
  },
  {
    q: "The dutiful butler faithfully waited _____ his bedridden master.",
    target: "wait upon",
    opts: ["for", "upon", "at", "after"],
    ans: "b",
    meaning: "wait upon / on - কারো সেবা করা বা পরিচর্যা করা",
    exp: "পরিচর্যা করা বা আদেশ পালনে নিযুক্ত থাকা বোঝাতে 'wait upon' বা 'wait on' বসে।",
    exam: "27th BCS, 17th BCS"
  },
  {
    q: "The meteorological bureau warned fishermen _____ impending tempest.",
    target: "warn of",
    opts: ["against", "of", "about", "for"],
    ans: "b",
    meaning: "warn of / against - আসন্ন বিপদ সম্পর্কে পূর্বাহ্নে সতর্ক করা",
    exp: "আসন্ন বিপদের ব্যাপারে সতর্ক করতে 'warn of danger' বসে। কোনো অপকর্ম থেকে বিরত থাকতে সতর্ক করতে 'warn against doing' বসে।",
    exam: "35th BCS, Coast Guard Exam 2019"
  },
  {
    q: "The young student is diligent in history but sadly weak _____ mathematics.",
    target: "weak in",
    opts: ["at", "with", "in", "for"],
    ans: "c",
    meaning: "weak in - কোনো নির্দিষ্ট বিষয়ে কাঁচা বা দুর্বল",
    exp: "কোনো পাঠ্য বিষয়ে দুর্বল হওয়া বোঝাতে 'weak in' বসে (weak in English/math)। পারদর্শী বোঝাতে 'good at' বসে।",
    exam: "14th BCS, 23rd BCS"
  },
  {
    q: "A noble statesman wishes always _____ universal peace and justice.",
    target: "wish for",
    opts: ["to", "for", "with", "about"],
    ans: "b",
    meaning: "wish for - কোনো কিছুর জন্য প্রার্থনা বা বাসনা করা",
    exp: "কোনো শুভ পরিণতির বাসনা করতে 'wish for' বসে।",
    exam: "13th BCS, Primary Teacher 2019"
  },
  {
    q: "His courageous conduct is universally worthy _____ the highest commendation.",
    target: "worthy of",
    opts: ["for", "to", "of", "with"],
    ans: "c",
    meaning: "worthy of - কোনো সম্মান বা পুরস্কার পাওয়ার উপযুক্ত বা যোগ্য",
    exp: "যোগ্যতা প্রকাশে 'worthy of' বসে (worthy of praise)। অযোগ্য বোঝাতে 'unworthy of' বসে।",
    exam: "30th BCS, 15th BCS"
  },
  {
    q: "The heroic freedom fighters steadfastly refused to yield _____ foreign tyranny.",
    target: "yield to",
    opts: ["before", "against", "to", "with"],
    ans: "c",
    meaning: "yield to - কারো কাছে নতি স্বীকার বা আত্মসমর্পণ করা",
    exp: "বশ্যতা স্বীকার করা প্রকাশে 'yield to' বা 'surrender to' ব্যবহৃত হয়।",
    exam: "38th BCS, 21st BCS"
  },
  {
    q: "The reformer worked with inexhaustible zeal _____ public education.",
    target: "zeal for",
    opts: ["of", "to", "for", "in"],
    ans: "c",
    meaning: "zeal for - কোনো মহৎ উদ্দেশ্যের জন্য প্রবল উৎসাহ ও উদ্দীপনা",
    exp: "কোনো কাজের প্রতি গভীর উদ্দীপনা প্রকাশ করতে 'zeal for' বসে।",
    exam: "24th BCS, Ministry of Education 2018"
  }
];

console.log('Seed length:', items.length);
