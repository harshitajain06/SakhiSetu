export default {
  // Common
  common: {
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
  },
  
  // Navigation
  nav: {
    home: 'Home',
    learn: 'Learn',
    community: 'Community',
    insights: 'Insights',
    tracker: 'Tracker',
    logout: 'Logout',
    switchHealthFlow: 'Switch Health Flow',
    settings: 'Settings',
    language: 'Language',
  },

  // Learn Screen
  learn: {
    title: 'Maternal Health',
    exploreModules: 'Explore Modules',
    pregnancyBasics: 'Pregnancy Basics',
    pregnancyBasicsDesc: 'Understanding the fundamentals of pregnancy and what to expect.',
    prenatalCare: 'Prenatal Care',
    prenatalCareDesc: 'Essential healthcare practices during your pregnancy journey.',
    nutritionDiet: 'Nutrition & Diet',
    nutritionDietDesc: 'Healthy eating habits and nutritional needs during pregnancy.',
    postpartumCare: 'Postpartum Care',
    postpartumCareDesc: 'Recovery and self-care after giving birth.',
    newbornCare: 'Newborn Care',
    newbornCareDesc: 'Essential tips for caring for your newborn baby.',
    breastfeedingGuide: 'Breastfeeding Guide',
    breastfeedingGuideDesc: 'Comprehensive guide to successful breastfeeding.',
    maternalWellness: 'Maternal Wellness',
    maternalWellnessDesc: 'Mental health and emotional well-being during and after pregnancy.',
    exerciseFitness: 'Exercise & Fitness',
    exerciseFitnessDesc: 'Safe exercise routines and staying active during pregnancy.',
  },

  // Pregnancy Basics Detail
  pregnancyBasics: {
    week: 'Week',
    trimester: 'Trimester',
    weekByWeek: 'Pregnancy Week by Week',
    overview: 'Overview',
    babyDevelopment: 'Baby Development',
    yourBody: 'Your Body',
    commonSymptoms: 'Common Symptoms',
    tipsForThisWeek: 'Tips for This Week',
    importantNote: 'Important Note',
  },

  // Prenatal Care
  prenatalCare: {
    title: 'Prenatal Care',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
    // PrenatalCare items
    prenatalCareItems: {
      item1: {
        title: 'First Trimester Care',
        content: 'The first trimester (weeks 1-12) is crucial for your baby\'s development. Here\'s what you need to know:',
        tips: [
          'Schedule your first prenatal appointment as soon as you know you\'re pregnant.',
          'Start taking prenatal vitamins with folic acid to prevent birth defects.',
          'Avoid alcohol, smoking, and recreational drugs completely.',
          'Limit caffeine intake to 200mg per day (about one cup of coffee).',
          'Eat small, frequent meals to manage nausea and morning sickness.',
          'Get plenty of rest - your body is working hard to support your baby\'s growth.',
          'Stay hydrated by drinking at least 8-10 glasses of water daily.'
        ],
        importantNote: 'The first trimester is when most birth defects occur, so following these guidelines is especially important during this time.'
      },
      item2: {
        title: 'Second Trimester Care',
        content: 'The second trimester (weeks 13-27) is often called the \'honeymoon period\' of pregnancy:',
        tips: [
          'Continue taking prenatal vitamins and eating a balanced diet.',
          'You\'ll likely have more energy now - enjoy light exercise like walking or prenatal yoga.',
          'Start feeling your baby move around weeks 18-22 - this is a special milestone!',
          'Schedule your anatomy scan (usually around week 20) to check your baby\'s development.',
          'Begin thinking about childbirth classes and creating a birth plan.',
          'Wear comfortable, supportive clothing as your body continues to change.',
          'Practice good posture to help with back pain as your belly grows.'
        ],
        importantNote: 'This is a great time to bond with your baby and prepare for the arrival of your little one.'
      },
      item3: {
        title: 'Third Trimester Care',
        content: 'The final trimester (weeks 28-40) brings you closer to meeting your baby:',
        tips: [
          'Continue regular prenatal checkups - you\'ll see your doctor more frequently now.',
          'Monitor your baby\'s movements daily - report any decrease in movement immediately.',
          'Prepare for labor by learning about the signs of labor and when to go to the hospital.',
          'Pack your hospital bag with essentials for you and your baby.',
          'Get plenty of rest and sleep on your left side to improve circulation.',
          'Eat smaller meals more frequently to avoid heartburn and indigestion.',
          'Stay active with gentle exercises, but listen to your body and rest when needed.'
        ],
        importantNote: 'If you experience any concerning symptoms like severe headaches, vision changes, or decreased fetal movement, contact your healthcare provider immediately.'
      },
      item4: {
        title: 'Prenatal Vitamins and Supplements',
        content: 'Proper nutrition through vitamins and supplements is essential for your baby\'s development:',
        tips: [
          'Folic acid (400-800 mcg daily) prevents neural tube defects - start before conception if possible.',
          'Iron helps prevent anemia and supports your baby\'s growth - your doctor will monitor your levels.',
          'Calcium (1000mg daily) supports your baby\'s bone development and your bone health.',
          'DHA/Omega-3 fatty acids support your baby\'s brain and eye development.',
          'Vitamin D helps with calcium absorption and immune function.',
          'Take your prenatal vitamins with food to reduce nausea.',
          'Always consult your doctor before taking any additional supplements.'
        ],
        importantNote: 'A balanced diet combined with prenatal vitamins ensures you and your baby get all necessary nutrients.'
      },
      item5: {
        title: 'Regular Checkups and Tests',
        content: 'Regular prenatal visits are crucial for monitoring your health and your baby\'s development:',
        tips: [
          'First trimester: Initial blood work, ultrasound, and genetic screening options.',
          'Second trimester: Anatomy scan, glucose screening for gestational diabetes, and blood tests.',
          'Third trimester: More frequent visits (every 2 weeks, then weekly), Group B Strep test, and monitoring baby\'s position.',
          'Keep track of your appointments and bring a list of questions to each visit.',
          'Discuss any concerns or symptoms with your healthcare provider openly.',
          'Understand the purpose of each test and screening recommended.',
          'Maintain a record of your pregnancy progress and test results.'
        ],
        importantNote: 'Regular prenatal care helps identify and manage potential complications early, ensuring the best outcomes for you and your baby.'
      },
      item6: {
        title: 'Managing Common Pregnancy Symptoms',
        content: 'Pregnancy brings various symptoms - here\'s how to manage them:',
        tips: [
          'Morning sickness: Eat small, frequent meals, avoid strong smells, try ginger tea or crackers.',
          'Fatigue: Get plenty of rest, take naps when possible, maintain a regular sleep schedule.',
          'Back pain: Use proper posture, wear supportive shoes, try prenatal massage or yoga.',
          'Heartburn: Eat smaller meals, avoid spicy foods, sleep propped up, avoid eating close to bedtime.',
          'Swelling: Elevate your feet, stay hydrated, avoid standing for long periods, wear comfortable shoes.',
          'Constipation: Eat fiber-rich foods, stay hydrated, exercise regularly, talk to your doctor about safe options.',
          'Mood changes: Practice relaxation techniques, talk to your partner or a counselor, join a support group.'
        ],
        importantNote: 'While many symptoms are normal, always discuss severe or concerning symptoms with your healthcare provider.'
      }
    }
  },

  // Postpartum Care
  postpartumCare: {
    title: 'Postpartum Care',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
  },

  // Exercise & Fitness
  exerciseFitness: {
    title: 'Exercise & Fitness',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
  },

  // Newborn Care
  newbornCare: {
    title: 'Newborn Care',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
  },

  // Maternal Wellness
  maternalWellness: {
    title: 'Maternal Wellness',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
  },

  // Nutrition & Diet
  nutritionDiet: {
    title: 'Nutrition & Diet',
    keyTips: 'Key Tips',
    importantNote: 'Important Note',
  },

  // Welcome Screen
  welcome: {
    welcomeBack: 'Welcome back!',
    subtitle: 'We\'re here to support your health journey',
    continue: 'Continue',
  },

  // Menstrual Health
  menstrual: {
    home: 'Home',
    tracker: 'Tracker',
    insights: 'Insights',
    learn: 'Learn',
    menstrualHealth: 'Menstrual Health',
    exploreCycleTracking: 'Explore Cycle Tracking',
    exploreModules: 'Explore Modules',
    journeyToUnderstanding: 'Your Journey to Periods',
    journeyToUnderstandingDesc: 'Explore the basics of menstrual health and well-being.',
    mythsAndFacts: 'Myths & Facts',
    mythsAndFactsDesc: 'Separate common beliefs from medical truths about menstruation.',
    stayingClean: 'Staying Clean',
    stayingCleanDesc: 'Guidance on hygiene practices during your menstrual cycle.',
    wellbeingConfidence: 'Well-being & Confidence',
    wellbeingConfidenceDesc: 'Tips for managing mood and staying confident during periods.',
    healthDietCare: 'Health Diet & Care',
    healthDietCareDesc: 'Nutrition advice and self-care tips for menstrual health.',
    // StayingClean items
    stayingCleanItems: {
      item1: {
        title: 'Daily Hygiene Practices',
        content: 'Maintaining good hygiene during your period is essential for your health and comfort. Here are some key practices to follow:',
        tips: [
          'Change your sanitary pad, tampon, or menstrual cup regularly (every 4-6 hours for pads, every 4-8 hours for tampons, and every 8-12 hours for cups).',
          'Wash your hands before and after changing your sanitary product.',
          'Clean your genital area with warm water and mild soap at least twice a day.',
          'Avoid using harsh soaps, douches, or scented products that can irritate sensitive skin.',
          'Wear clean, breathable cotton underwear and change it daily.',
          'Shower or bathe daily to stay fresh and comfortable.'
        ],
        importantNote: 'Proper hygiene helps prevent infections, reduces odor, and keeps you feeling confident throughout your period.'
      },
      item2: {
        title: 'Choosing the Right Sanitary Product',
        content: 'Selecting the right menstrual product is crucial for comfort and hygiene. Here\'s what you need to know:',
        tips: [
          'Pads: Best for beginners, easy to use, and available in various sizes. Change every 4-6 hours.',
          'Tampons: Internal protection that allows for swimming and sports. Change every 4-8 hours.',
          'Menstrual Cups: Reusable, eco-friendly option. Can be worn for up to 12 hours. Requires proper cleaning.',
          'Period Underwear: Absorbent underwear that can be used alone or as backup. Wash after each use.',
          'Choose products based on your flow (light, medium, or heavy) and comfort level.',
          'Always read the instructions on the product packaging for proper use.'
        ],
        importantNote: 'The best product is one that you feel comfortable using and that fits your lifestyle and flow.'
      },
      item3: {
        title: 'Proper Disposal of Sanitary Products',
        content: 'Disposing of sanitary products correctly is important for hygiene and environmental responsibility:',
        tips: [
          'Wrap used pads or tampons in toilet paper or the wrapper from the new product.',
          'Dispose of them in a covered trash bin - never flush pads or tampons down the toilet.',
          'If using a menstrual cup, empty it into the toilet, wash it with soap and water, and reinsert.',
          'Wash your hands thoroughly after handling any sanitary product.',
          'In public restrooms, use the provided disposal bins in the stalls.',
          'At home, empty your trash bin regularly to prevent odor.'
        ],
        importantNote: 'Proper disposal protects plumbing systems, prevents environmental pollution, and maintains cleanliness.'
      },
      item4: {
        title: 'Preventing Infections',
        content: 'Good hygiene practices can help prevent infections during your period:',
        tips: [
          'Change your sanitary product regularly to prevent bacterial growth.',
          'Avoid using scented pads or tampons as they can cause irritation.',
          'Wipe from front to back after using the toilet to prevent bacteria from entering the vagina.',
          'Wear breathable cotton underwear instead of synthetic materials.',
          'Avoid tight-fitting clothing that can trap moisture and heat.',
          'If you experience unusual discharge, itching, or odor, consult a healthcare provider.'
        ],
        importantNote: 'If you notice any signs of infection (unusual discharge, strong odor, itching, or discomfort), seek medical advice promptly.'
      },
      item5: {
        title: 'Bathing and Showering',
        content: 'Bathing during your period is not only safe but recommended for maintaining hygiene:',
        tips: [
          'You can and should shower or bathe daily during your period.',
          'Use warm water and mild, unscented soap to clean your body.',
          'Washing helps remove blood, reduce odor, and prevent infections.',
          'You can wash your hair during your period - it\'s completely safe.',
          'A warm bath can help relieve menstrual cramps and relax your muscles.',
          'After bathing, make sure to dry yourself thoroughly, especially the genital area.'
        ],
        importantNote: 'Bathing during your period is safe, hygienic, and can help you feel fresh and comfortable.'
      },
      item6: {
        title: 'Managing Odor',
        content: 'Some odor during menstruation is normal, but proper hygiene can help manage it:',
        tips: [
          'Change your sanitary product regularly - this is the most important step.',
          'Wash your genital area with warm water and mild soap daily.',
          'Wear breathable cotton underwear and change it daily.',
          'Avoid using scented products, sprays, or douches in the genital area.',
          'Stay hydrated and maintain a balanced diet.',
          'If you notice a strong, unusual odor, it may indicate an infection - consult a healthcare provider.'
        ],
        importantNote: 'A slight metallic smell is normal during menstruation. Strong, fishy, or foul odors may indicate an infection and should be checked by a doctor.'
      }
    },
    // WellbeingConfidence items
    wellbeingConfidenceItems: {
      item1: {
        title: 'Understanding Mood Changes',
        content: 'Mood changes during your period are normal and caused by hormonal fluctuations. Understanding this can help you manage your emotions better:',
        tips: [
          'Hormonal changes (estrogen and progesterone) affect neurotransmitters in your brain, which can cause mood swings.',
          'Common emotional symptoms include irritability, sadness, anxiety, or feeling overwhelmed.',
          'These feelings are temporary and usually improve once your period starts or ends.',
          'Track your mood patterns to understand your unique cycle.',
          'Remember that these emotions are valid and normal - you\'re not alone in experiencing them.',
          'Be patient and kind to yourself during this time.'
        ],
        importantNote: 'If mood changes are severe and significantly impact your daily life, consider speaking with a healthcare provider about Premenstrual Syndrome (PMS) or Premenstrual Dysphoric Disorder (PMDD).'
      },
      item2: {
        title: 'Managing Cramps and Discomfort',
        content: 'Menstrual cramps are common but manageable. Here are effective ways to find relief:',
        tips: [
          'Apply a heating pad or hot water bottle to your lower abdomen for 15-20 minutes.',
          'Take a warm bath to relax your muscles and ease discomfort.',
          'Gentle exercise like walking, yoga, or stretching can help reduce cramps.',
          'Over-the-counter pain relievers (like ibuprofen) can be effective - follow package instructions.',
          'Practice deep breathing or meditation to help relax your body.',
          'Stay hydrated and eat regular, balanced meals.'
        ],
        importantNote: 'If cramps are severe and don\'t respond to these methods, or if they interfere with your daily activities, consult a healthcare provider.'
      },
      item3: {
        title: 'Building Self-Confidence',
        content: 'Your period doesn\'t define you. Here are ways to maintain confidence during menstruation:',
        tips: [
          'Wear comfortable clothes that make you feel good about yourself.',
          'Remember that menstruation is a natural, healthy process - nothing to be ashamed of.',
          'Prepare ahead by having sanitary products ready so you feel prepared.',
          'Practice positive self-talk and remind yourself of your strengths.',
          'Surround yourself with supportive people who understand and respect your experience.',
          'Focus on activities you enjoy and that make you feel accomplished.'
        ],
        importantNote: 'Confidence comes from understanding and accepting your body\'s natural processes. You are strong and capable, period or not.'
      },
      item4: {
        title: 'Staying Active and Energized',
        content: 'Physical activity can actually help improve your period symptoms and boost your mood:',
        tips: [
          'Light to moderate exercise can reduce cramps, bloating, and mood swings.',
          'Activities like walking, yoga, swimming, or dancing are great options.',
          'Exercise releases endorphins, which are natural mood boosters.',
          'Listen to your body - if you feel tired, take it easy, but don\'t avoid all activity.',
          'Stay hydrated and eat nutritious foods to maintain energy levels.',
          'Get adequate sleep (7-9 hours) to help your body recover and maintain energy.'
        ],
        importantNote: 'You don\'t need to skip exercise during your period. In fact, staying active can make you feel better physically and emotionally.'
      },
      item5: {
        title: 'Nutrition for Well-being',
        content: 'Eating well during your period can help manage symptoms and maintain your energy:',
        tips: [
          'Eat iron-rich foods (leafy greens, beans, lean meats) to replace iron lost through bleeding.',
          'Include foods rich in magnesium (nuts, seeds, whole grains) to help reduce cramps.',
          'Stay hydrated by drinking plenty of water throughout the day.',
          'Limit processed foods, excess salt, and sugar which can worsen bloating and mood swings.',
          'Eat regular, balanced meals to maintain stable blood sugar and energy levels.',
          'Consider small, frequent meals if you experience nausea or digestive issues.'
        ],
        importantNote: 'A balanced diet supports your body during menstruation and can help reduce symptoms like cramps, bloating, and fatigue.'
      },
      item6: {
        title: 'Stress Management and Relaxation',
        content: 'Managing stress is especially important during your period when you may feel more sensitive:',
        tips: [
          'Practice relaxation techniques like deep breathing, meditation, or mindfulness.',
          'Get adequate sleep - aim for 7-9 hours per night.',
          'Take breaks when you need them - it\'s okay to slow down.',
          'Engage in activities you enjoy, such as reading, listening to music, or hobbies.',
          'Talk to friends, family, or a counselor if you\'re feeling overwhelmed.',
          'Avoid overcommitting yourself during your period - give yourself permission to rest.'
        ],
        importantNote: 'Taking care of your mental health is just as important as physical health. Don\'t hesitate to seek support when needed.'
      },
      item7: {
        title: 'Sleep and Rest',
        content: 'Quality sleep is essential for managing period symptoms and maintaining well-being:',
        tips: [
          'Aim for 7-9 hours of sleep per night, especially during your period.',
          'Create a comfortable sleep environment with appropriate temperature and lighting.',
          'Establish a regular sleep schedule, going to bed and waking up at similar times.',
          'Avoid screens (phone, TV) at least an hour before bedtime.',
          'Use a heating pad or warm bath before bed to help with cramps and promote relaxation.',
          'If discomfort keeps you awake, try different sleeping positions or use extra pillows for support.'
        ],
        importantNote: 'Adequate rest helps your body manage period symptoms, supports mood regulation, and maintains your overall health and energy.'
      }
    }
  },

  // Health Selection
  healthSelection: {
    appTitle: 'Sakhi Setu',
    menstrualHealth: 'Menstrual Health',
    menstrualHealthDesc: 'Track your cycle, understand symptoms, and access wellness resources for every stage.',
    exploreCycleTracking: 'Explore Cycle Tracking',
    maternalWellness: 'Maternal Wellness',
    maternalWellnessDesc: 'Comprehensive support for pregnancy, postpartum, and newborn care.',
    exploreMaternalWellness: 'Explore Maternal Wellness',
    dailyTips: 'Daily Wellness Tips',
    tip1: 'Prioritize self-care today. Even small moments of peace can make a big difference.',
    tip2: 'Stay hydrated throughout the day. Aim for 8-10 glasses of water for optimal health.',
    tip3: 'Get 7-9 hours of quality sleep each night to support your body\'s natural healing processes.',
    tip4: 'Practice deep breathing exercises for 5 minutes daily to reduce stress and anxiety.',
    tip5: 'Include at least 30 minutes of physical activity in your daily routine.',
    tip6: 'Eat a balanced diet rich in fruits, vegetables, and whole grains.',
    tip7: 'Take regular breaks from screens to protect your eye health and mental well-being.',
    tip8: 'Connect with loved ones regularly - social support is crucial for mental health.',
  },

  // Login/Register
  auth: {
    welcome: 'Welcome to SakhiSetu',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    fullName: 'Full Name',
    signIn: 'Sign in',
    forgotPassword: 'Forgot password?',
    loginSuccess: 'Login Successful',
    registerSuccess: 'Registration Successful',
    loginFailed: 'Login Failed',
    registerFailed: 'Registration Failed',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    signInWithGoogle: 'Sign in with Google',
    continueWithGoogle: 'Continue with Google',
    or: 'OR',
  },

  // Content Types
  contentType: {
    videos: 'Videos',
    imagesAndText: 'Images and Text',
  },

  // General
  general: {
    contentNotFound: 'Content not found',
    imageNotAvailable: 'Image not available',
  },

  // Community Screen
  community: {
    title: 'SakhiSetu Community',
    subtitle: 'Find health centers, counselors, and emergency resources nearby.',
    filterAll: 'All',
    filterHealthCenter: 'Health Center',
    filterLocalCounselor: 'Local Counselor',
    findNearbyHospitals: 'Find Nearby Hospitals',
    footerNote: 'Phone numbers work offline, but calling requires an active internet connection.',
  },

  // Home Screen
  home: {
    appTitle: 'Sakhi Setu',
    subtitle: 'Your Maternal Health Companion',
    loadingData: 'Loading your pregnancy data...',
    pregnancyProgress: 'Pregnancy Progress',
    week: 'Week',
    trimester: 'Trimester',
    babySize: 'Your baby is the size of a',
    welcomeTitle: 'Welcome to Your Pregnancy Journey',
    welcomeText: 'Set up your pregnancy tracker to get personalized insights and track your progress.',
    setupTracker: 'Set Up Pregnancy Tracker',
    babyDevelopment: "Baby's Development",
    symptomsTitle: 'Symptoms You May Experience',
    daysToGo: 'Days to Go',
    bloodPressure: 'Blood Pressure',
    weightGain: 'Weight Gain (kg)',
    appointments: 'Appointments',
    todaysFocus: "Today's Focus",
    upcomingAppointment: 'Upcoming Appointment',
    viewDetails: 'View Details',
    prenatalYoga: 'Prenatal Yoga & Meditation',
    yogaDescription: '15 minutes of gentle stretching and breathing exercises',
    startSession: 'Start Session',
    healthTips: 'Health Tips for You',
    nutrition: 'Nutrition',
    nutritionTip: 'Focus on folate-rich foods like leafy greens and citrus fruits',
    exercise: 'Exercise',
    exerciseTip: '30 minutes of moderate activity daily supports healthy pregnancy',
    sleep: 'Sleep',
    sleepTip: 'Aim for 7-9 hours of quality sleep for optimal recovery',
    hydration: 'Hydration',
    hydrationTip: 'Drink 8-10 glasses of water daily to support increased blood volume',
    mentalHealth: 'Mental Health',
    mentalHealthTip: 'Practice mindfulness and stress management techniques daily',
    prenatalVitamins: 'Prenatal Vitamins',
    vitaminsTip: 'Take your prenatal vitamins consistently for optimal nutrition',
    posture: 'Posture',
    postureTip: 'Maintain good posture and use proper body mechanics',
    temperature: 'Temperature',
    temperatureTip: 'Avoid hot tubs and saunas to prevent overheating',
    foodSafety: 'Food Safety',
    foodSafetyTip: 'Avoid raw fish, unpasteurized dairy, and deli meats',
    regularCheckups: 'Regular Checkups',
    checkupsTip: 'Attend all scheduled prenatal appointments for monitoring',
    communitySupport: 'Community Support',
    communityDescription: 'Connect with other expecting mothers and share your journey',
    activeMembers: 'Active Members',
    newPostsToday: 'New Posts Today',
    joinCommunity: 'Join Community',
    emergencyContacts: 'Emergency Contacts',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    sessionComplete: 'Session Complete!',
    sessionInProgress: 'Session in Progress',
    sessionPaused: 'Session Paused',
    sessionTips: 'Session Tips',
    tip1: 'Find a quiet, comfortable space',
    tip2: 'Focus on your breathing',
    tip3: 'Move gently and listen to your body',
    stepOf: 'Step {{current}} of {{total}}',
  },

  // Myth Detail Screen
  myth: {
    mythExplainer: 'Myth Explainer',
    myth: 'Myth',
    mythNotFound: 'Myth not found',
    theMyth: 'The Myth',
    fact: 'FACT',
    scientificFacts: 'Scientific Facts',
    healthyTip: 'Healthy Tip',
    conclusion: 'Conclusion',
    // Myths items
    mythsItems: {
      item1: {
        title: 'Can\'t enter temples during menstruation?',
        shortTitle: 'Temple Entry',
        mythStatement: 'Women should not enter a temple or perform religious rituals during menstruation because they are \'impure.\'',
        factCheck: 'Scientifically, menstruation is simply the shedding of the uterine lining — a healthy, natural body function. There is no impurity involved. The body is cleansing itself and maintaining fertility health.',
        scientificFacts: [
          'In old times, women were given rest during their periods since there were no sanitary products, and menstrual pain or fatigue made daily work difficult.',
          'To protect privacy and comfort, some traditions advised women to stay home — not because they were \'unclean,\' but to allow rest.',
          'Over time, this practical rule was misinterpreted as a religious restriction.',
          'Some later interpretations (like certain Smritis) added restrictions, but these are social customs, not divine commandments.',
          'In modern Hinduism, many priests and scholars confirm that menstruation does not make a woman impure spiritually.',
          'Many temples and spiritual leaders now openly say that women can enter temples and pray during menstruation.',
          'Doctors and health experts agree there\'s no scientific or hygienic reason to stop them.'
        ],
        healthyTip: 'Menstruation is natural. There\'s no scriptural, scientific, or spiritual reason to restrict temple entry.',
        conclusion: 'Menstruating women are not impure and should not be restricted from entering temples. Menstruation is natural, and there\'s no scriptural, scientific, or spiritual reason to restrict temple entry.'
      },
      item2: {
        title: 'Is it unclean to touch pickles?',
        shortTitle: 'Touch Pickles',
        mythStatement: 'You cannot touch pickles during your period.',
        factCheck: 'This is not true. Your period is a natural bodily process. It does not make you impure or affect food in any way.',
        scientificFacts: [
          'Menstruation is a normal and healthy part of a woman\'s life cycle.',
          'It does not carry any negative impact on food preparation or preservation.',
          'You can touch anything during your period without any concerns.'
        ],
        healthyTip: 'Feel free to continue your daily activities, including cooking and handling food, without any worries.',
        conclusion: 'This is not true. Your period is a natural bodily process. It does not make you impure or affect food in any way. You can touch anything! Menstruation is a normal and healthy part of a woman\'s life cycle, and it does not carry any negative impact on food preparation or preservation.'
      },
      item3: {
        title: 'Are you unclean during your period?',
        shortTitle: 'Unclean During Period',
        mythStatement: 'A woman is unclean or impure during her period.',
        factCheck: 'Menstruation is natural, healthy, and normal. The idea of being \'unclean\' is a myth rooted in old beliefs, not science.',
        scientificFacts: [
          'These ideas developed in times when people didn\'t understand biology and had no access to sanitary products, so menstrual blood was seen as something to be avoided.',
          'Over time, these beliefs turned into social rules and stigmas.',
          'Menstrual blood is just blood and uterine tissue — not dirty or toxic.',
          'As long as proper hygiene is maintained (regular changing of pads/tampons/cups and washing hands), there is no health risk to others.'
        ],
        healthyTip: 'Respect, education, and openness help end period stigma and ensure menstrual health for everyone.',
        conclusion: 'Menstruation is natural, healthy, and normal. The idea of being \'unclean\' is a myth rooted in old beliefs, not science. Respect, education, and openness help end period stigma and ensure menstrual health for everyone.'
      },
      item4: {
        title: 'Can\'t play sports during menstruation?',
        shortTitle: 'Play Sports',
        mythStatement: 'You can\'t or shouldn\'t play sports during your period.',
        factCheck: 'You can play sports, train, and exercise safely. In fact, movement often reduces pain and improves mood.',
        scientificFacts: [
          'Light to moderate activity (like walking, swimming, yoga, or even competitive sports) can reduce cramps, bloating, and mood swings by improving blood flow and releasing endorphins — your body\'s natural painkillers.',
          'There is no biological reason to avoid sports while on your period. Many professional athletes train and compete during menstruation.',
          'Staying hydrated and eating balanced meals can help maintain energy levels and reduce fatigue.',
          'Exercise usually relieves cramps and helps balance hormones.'
        ],
        healthyTip: 'If you have severe cramps, heavy bleeding, or dizziness, it\'s fine to rest or modify your workout — that\'s listening to your body, not giving in to a myth.',
        conclusion: 'You can play sports, train, and exercise safely. In fact, movement often reduces pain and improves mood. Playing sports will not worsen cramps or bleeding — exercise usually relieves cramps and helps balance hormones.'
      },
      item5: {
        title: 'Menstruation only for married women?',
        shortTitle: 'Only Married Women',
        mythStatement: 'Menstruation only happens to married women.',
        factCheck: 'This is completely false. Menstruation is a natural biological process that begins during puberty, typically between ages 9-16, regardless of marital status.',
        scientificFacts: [
          'Menstruation is a sign of reproductive maturity and begins when a girl reaches puberty.',
          'It has nothing to do with marriage or relationship status.',
          'All women and girls who have reached puberty will experience menstruation.',
          'The age of first period (menarche) varies but typically occurs between 9-16 years old.'
        ],
        healthyTip: 'Understanding that menstruation is a natural part of growing up helps reduce stigma and confusion.',
        conclusion: 'Menstruation is a natural biological process that begins during puberty, not marriage. All women experience menstruation once they reach reproductive age, regardless of their marital status.'
      },
      item6: {
        title: 'Will you get sick if you wash hair?',
        shortTitle: 'Wash Hair',
        mythStatement: 'You\'ll get sick if you wash your hair during your period.',
        factCheck: 'You will not get sick from washing your hair while menstruating. There\'s no scientific evidence linking hair washing to illness or menstrual problems.',
        scientificFacts: [
          'Washing your hair or bathing during your period is completely safe and actually helps maintain hygiene.',
          'The idea that cold water or washing could \'block blood flow\' or cause cramps is not true — menstrual flow is controlled by hormones, not water temperature.',
          'Keeping clean can even reduce odor, discomfort, and infection risk.'
        ],
        healthyTip: 'Use warm water if you feel cramps — it can relax your muscles and relieve pain.',
        conclusion: 'Washing your hair during your period does not make you sick. It\'s safe, hygienic, and can help you feel fresh and comfortable.'
      },
      item7: {
        title: 'Can\'t share a bed with family members?',
        shortTitle: 'Share Bed',
        mythStatement: 'During menstruation, a woman should not share a bed with others.',
        factCheck: 'There is no scientific or medical reason to avoid sharing a bed during your period. This belief comes from cultural taboos about \'impurity,\' not from facts or hygiene concerns.',
        scientificFacts: [
          'Menstrual blood is not dirty or contagious — it\'s just a mix of blood and uterine tissue.',
          'Sleeping next to someone while menstruating does not affect their health in any way.',
          'If proper hygiene is maintained (clean sanitary products, clean bedding, regular washing), there is no risk to anyone.',
          'The myth likely began in traditional societies that associated menstruation with ritual impurity, not with science.'
        ],
        healthyTip: 'You can share a bed comfortably. Using a pad, tampon, or menstrual cup that fits well and sleeping on a towel or darker sheets can prevent stains and help you rest better.',
        conclusion: 'Not sharing a bed during menstruation is a myth, not a health rule. Menstruation is natural and normal, and it\'s perfectly fine to sleep beside others during your period.'
      },
      item8: {
        title: 'Menstrual blood is inherently impure?',
        shortTitle: 'Blood Impure',
        mythStatement: 'Menstrual blood is inherently impure or toxic.',
        factCheck: 'Menstrual blood is just blood and uterine tissue — not dirty or toxic. It\'s a natural part of the reproductive cycle.',
        scientificFacts: [
          'Menstrual blood consists of blood, uterine tissue, and cervical mucus — all natural bodily substances.',
          'It is not toxic, dirty, or harmful to others when proper hygiene is maintained.',
          'The idea of impurity comes from cultural and religious beliefs, not scientific facts.',
          'With proper hygiene practices, there is no health risk associated with menstrual blood.'
        ],
        healthyTip: 'Maintaining good hygiene during your period (changing pads/tampons regularly, washing hands) is important for your own health and comfort.',
        conclusion: 'Menstrual blood is not impure or toxic. It\'s a natural part of the reproductive cycle. The idea of impurity is a cultural belief, not a scientific fact.'
      },
      item9: {
        title: 'Avoid certain foods during period?',
        shortTitle: 'Avoid Foods',
        mythStatement: 'You should avoid certain foods during your period.',
        factCheck: 'There\'s no medical reason to completely avoid specific foods while menstruating. However, some foods can affect how you feel, so it\'s more about balance, not restriction.',
        scientificFacts: [
          'You can eat anything, but some foods may worsen cramps, bloating, or mood swings if eaten in large amounts — like very salty, sugary, or processed foods.',
          'Caffeine might increase breast tenderness or irritability for some people, so moderation helps.',
          'Foods rich in iron, calcium, magnesium, and vitamin B (like leafy greens, fruits, nuts, and lean meats) can help restore energy and reduce fatigue.',
          'Dark chocolate in small amounts can even boost mood by increasing serotonin levels.'
        ],
        healthyTip: 'Eat balanced meals, drink plenty of water, and listen to what your body craves — sometimes it\'s signaling what it needs.',
        conclusion: 'You don\'t need to avoid any food during your period. Instead, focus on moderation and nourishment to feel your best.'
      },
      item10: {
        title: 'Is it forbidden to cook food during your period?',
        shortTitle: 'Cook Food',
        mythStatement: 'It is forbidden to cook food during your period.',
        factCheck: 'This is a myth based on cultural taboos, not on science or hygiene. There is no medical or biological reason that prevents a woman from cooking while menstruating.',
        scientificFacts: [
          'Menstruation is a normal bodily process, not a state of impurity.',
          'Cooking during your period does not contaminate food or affect anyone\'s health.',
          'These restrictions often originated in traditional beliefs about \'purity,\' not in scientific understanding.',
          'With good hygiene, cooking while on your period is completely safe and normal.'
        ],
        healthyTip: 'If you feel cramps or fatigue, you can choose to rest — but that\'s about comfort, not forbidden rules.',
        conclusion: 'Cooking during your period is not forbidden. It\'s a personal choice, and menstruation has no impact on food safety or cleanliness.'
      }
    }
  },

  // Insights Screen
  insights: {
    myPeriodTracker: 'My Period Tracker',
    onTime: 'On time',
    delayed: 'Delayed {{days}} days',
    editPeriodDates: 'Edit Period Dates',
    calendarLegend: 'Calendar Legend',
    periodDays: 'Period Days',
    predictedDays: 'Predicted Days',
    today: 'Today',
    symptomsLogged: 'Symptoms Logged',
    cycleInsights: 'Cycle Insights',
    averageCycleLength: 'Average Cycle Length:',
    days: 'days',
    cycleInsightText: 'Based on your tracked history. Consistency is key for accurate predictions.',
    // Month names
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },

  // Journey to Understanding Screen
  journey: {
    title: 'Your Journey to Periods',
    video1Title: 'What is a Period?',
    video1Desc: 'Understanding the basics of menstruation.',
    video2Title: 'How first periods feel like?',
    video2Desc: 'A detailed breakdown of the four phases.',
    video3Title: 'Period Cramps & Pain Relief',
    video3Desc: 'Effective strategies and remedies.',
    video4Title: 'What I do when I get my first period',
    video4Desc: 'Emotional changes during your cycle.',
    video5Title: 'Early Signs of Your Period',
    video5Desc: 'Recognizing the subtle body signals.',
    video6Title: 'How can I help my friends during their periods?',
    video6Desc: 'Supporting others during their menstrual cycle.',
    video7Title: 'How to maintain hygiene during periods?',
    video7Desc: 'Essential hygiene practices.',
    video8Title: 'What are sanitary pads, how to use them and dispose of them?',
    video8Desc: 'Complete guide to using sanitary pads.',
  },

  // Health Diet & Care Screen
  healthDietCare: {
    lessons: 'Lessons',
    video1Title: 'Foods to Eat During Your Period',
    video1Desc: 'Nutritious foods that help manage period symptoms.',
    video1Content: 'Hey there! Let\'s talk about giving your body the love it deserves during your period. Think of your period as your body doing some serious housekeeping - it\'s working hard, so it needs the right fuel! 🏠✨\n\nFirst things first - you\'re losing blood (about 30-80ml, which is like 2-5 tablespoons), and with that blood goes iron. Your body is basically saying "Hey, I need iron back!" So let\'s feed it well.\n\n🥩 If you eat meat: Lean red meat, chicken, and fish are like iron superchargers - your body absorbs them way better than plant sources. Think of them as the express lane for iron!\n\n🌱 If you\'re vegetarian: No worries! Spinach (cook it to unlock more iron), lentils, chickpeas, kidney beans, and tofu are your iron heroes. But here\'s the secret trick - pair them with vitamin C! Add some lemon to your spinach, have an orange with your beans, or throw bell peppers into your lentil curry. Vitamin C is like the key that unlocks iron absorption - it can boost it by up to 300%! 🗝️\n\nNow, about those mood swings and energy crashes... Your blood sugar is probably doing a rollercoaster ride. Complex carbs are your best friend here! Think quinoa, brown rice, oats, and whole-wheat bread. They\'re like slow-burning fuel that keeps you steady instead of those crazy ups and downs. Plus, they\'re packed with B vitamins that help your brain make the happy chemicals (serotonin) that keep you feeling good.\n\n🐟 Feeling those cramps? Omega-3s to the rescue! Fatty fish like salmon and mackerel are like natural painkillers. They tell those cramp-causing chemicals (prostaglandins) to chill out. Not a fish fan? No problem - walnuts, ground flaxseeds (grind them for better absorption!), and chia seeds work too. Try 1-2 servings of fish per week or sprinkle 1-2 tablespoons of ground flaxseeds on your oatmeal daily.\n\n🍫 Chocolate cravings? We\'ve got you covered! Dark chocolate (70% cocoa or higher) is actually GOOD for you during your period. It\'s packed with magnesium (64mg per ounce!) which helps relax those cranky muscles. Plus, it has mood-boosting compounds. So go ahead, enjoy that square of dark chocolate guilt-free! Almonds and bananas are also magnesium superstars.\n\n🥛 Don\'t forget calcium! Your bones and muscles need it, especially during heavy periods. Yogurt is a triple threat - calcium, protein, AND probiotics for happy digestion. If you skip dairy, fortified plant milks, tofu, and dark leafy greens have your back.\n\n🍓 Fresh fruits and veggies are like nature\'s multivitamin! Berries fight inflammation, leafy greens help make new red blood cells, and citrus fruits help you absorb all that iron. Plus, they keep your digestion happy when hormones are making things sluggish.\n\n💡 Pro tip: Add some anti-inflammatory spices to your meals! Turmeric, ginger, and cinnamon not only taste amazing but also help reduce cramps and inflammation. Try adding them to your soups, teas, or smoothies.\n\nRemember, you don\'t have to be perfect - just focus on adding these power foods to your meals and your body will thank you! 💪',
    video2Title: 'Iron-Rich Foods for Menstrual Health',
    video2Desc: 'Replenish iron lost during your period naturally.',
    video2Content: 'Let\'s talk iron - your body\'s secret weapon for energy! 💪 Every month during your period, you\'re losing iron (about 15-30mg per cycle), and your body needs it back ASAP.\n\nHere\'s the thing: not all iron is created equal! There are two types, and knowing the difference is like having a cheat code:\n\n🥩 Heme Iron (The Super Absorber): Found in animal products - your body loves this stuff! It\'s like the VIP entrance - gets absorbed 2-3 times better. Think lean red meat (2.5-3mg per serving), chicken or turkey (1-1.5mg), and fish like sardines or tuna (1-2mg). Liver is the iron champion (5-6mg!) but go easy - it\'s super rich.\n\n🌱 Non-Heme Iron (The Plant Power): For my veggie friends! Your body needs a little help absorbing this, but we\'ve got tricks. Lentils (3.3mg per cup), chickpeas (4.7mg - wow!), kidney beans (3.9mg), tofu (3-4mg), and fortified cereals (4-18mg depending on brand) are your go-tos. Dark leafy greens like cooked spinach (6.4mg per cup) are amazing - just cook them to unlock more iron!\n\n🍊 The Magic Combo: Here\'s where it gets fun! Pair your plant-based iron with vitamin C and watch the magic happen. Vitamin C is like the key that unlocks iron absorption - it can boost it by up to 300%! 🗝️✨\n\nTry these power combos:\n• Spinach salad with lemon dressing 🥗\n• Bean curry with bell peppers 🌶️\n• Lentil soup with tomatoes 🍅\n• Iron-fortified cereal with orange juice 🥣\n• Add strawberries to your oatmeal with iron-rich nuts 🍓\n\n💡 Pro Tip: Cook in a cast-iron pan! Especially with acidic foods like tomato sauce - it actually adds iron to your meal. How cool is that?\n\n⚠️ Watch Out For These Iron Blockers:\n• Tea or coffee with meals (wait 1-2 hours after eating)\n• Calcium supplements (space them 2-3 hours apart)\n• Too much whole grains at once (soak or sprout them to help!)\n\n⏰ Timing is Everything: Spread your iron intake throughout the day. Your body can only absorb so much at once, so think "little and often" rather than one big iron feast!\n\n🚨 When to Get Help: If you have heavy periods (soaking through a pad/tampon every hour or bleeding more than 7 days), you might need supplements. Look out for these signs:\n• Extreme fatigue (like you can\'t get out of bed)\n• Pale skin\n• Shortness of breath doing simple things\n• Dizzy spells\n• Cold hands and feet\n• Brittle nails\n• Weird cravings (like wanting to eat ice or dirt - yes, really!)\n\nIf this sounds like you, chat with your doctor. They can do a simple blood test to check your iron levels. Supplements can help, but always get professional advice first - too much iron can be dangerous!\n\nRemember: Food first, supplements second. Your body prefers getting nutrients from real food! 🍎',
    video3Title: 'Managing Period Cravings',
    video3Desc: 'Healthy ways to satisfy cravings during your cycle.',
    video3Content: 'Okay, let\'s be real - those period cravings are INTENSE! 🍫🍕 You\'re not weak-willed, you\'re not "emotional" - your hormones are literally messing with your brain chemistry. Let\'s understand what\'s happening and how to work WITH your body, not against it!\n\n🧠 The Science (Made Simple):\nDuring the week before your period, your hormones are doing a wild dance. This affects serotonin (your "happy chemical") levels. When serotonin drops, your brain panics and screams "GIVE ME CARBS NOW!" It\'s not you being dramatic - it\'s biology! 😅\n\n🍫 Chocolate Cravings - The Real Deal:\nChocolate cravings are SO common because chocolate is basically a mood-boosting cocktail! It contains:\n• Phenylethylamine (makes you feel good)\n• Theobromine (gentle energy boost)\n• Magnesium (relaxes muscles)\n\nDark chocolate (70% cocoa or higher) is your best friend here. It has MORE of the good stuff and LESS sugar, so you avoid that sugar crash that makes everything worse. Plus, it\'s actually good for you! One square = guilt-free satisfaction. 🎯\n\n🍓 Sweet Tooth? No Problem!:\nWhen sugar calls, answer with fruit! Berries are perfect - low sugar, high antioxidants, and that fiber keeps your blood sugar steady. Dates are nature\'s candy - sweet, chewy, and packed with potassium. A little raw honey or maple syrup? Totally fine in moderation. The key is pairing sweets with fiber or protein to avoid that energy rollercoaster.\n\n🥜 Salty Cravings Got You?:\nYour body might be asking for salt because of fluid changes. But skip the chips! Try:\n• Roasted nuts (almonds, cashews) - healthy fats + protein + salt = win! 🏆\n• Pumpkin seeds - magnesium bonus!\n• Lightly salted cucumber or celery - crunchy + hydrating\n• Seaweed snacks - iodine boost!\n\n💧 Wait... Are You Actually Thirsty?:\nHere\'s a sneaky one - sometimes your body confuses thirst for hunger! Before reaching for snacks, drink a glass of water and wait 15 minutes. You might find the craving disappears. Stay hydrated with 8-10 glasses of water daily, plus herbal teas (chamomile = relaxation, peppermint = digestion).\n\n⏰ Eat Regularly = Fewer Cravings:\nSkipping meals is like inviting cravings to a party. When blood sugar crashes, cravings go CRAZY. Eat every 3-4 hours:\n• Breakfast (don\'t skip it!)\n• Lunch\n• Afternoon snack\n• Dinner\n• Evening snack if needed\n\nEach meal should have protein + healthy fats + complex carbs. Think: eggs + avocado toast, Greek yogurt + berries, or chicken + quinoa + veggies.\n\n🍞 Carb Cravings? Smart Choices:\nYour body wants carbs to boost serotonin - that\'s normal! But choose wisely:\n✅ Whole grain bread\n✅ Quinoa\n✅ Brown rice\n✅ Sweet potatoes\n✅ Oats\n\nThese give you steady energy instead of that sugar spike and crash.\n\n🧘 Mindful Eating = Game Changer:\nSlow down! Your brain needs 20 minutes to realize you\'re full. Try this:\n• Put your fork down between bites\n• Chew thoroughly (like, really chew)\n• Taste your food - what flavors do you notice?\n• No phone/TV while eating\n• Ask yourself: "Am I actually hungry, or am I stressed/bored/tired?"\n\n🎯 The 80/20 Rule:\nBe realistic! Eat nutritious foods 80% of the time, treats 20% of the time. Complete restriction = binge city later. If you want chocolate, have it! Just be mindful. Plan your treats - knowing you CAN have something later makes it easier to wait.\n\n📦 Prep Like a Pro:\nWhen cravings hit, you grab what\'s easy. So make healthy stuff EASY:\n• Pre-portion nuts into small containers\n• Cut veggies and keep them in the fridge\n• Keep fruit visible (not hidden in drawers)\n• Have a water bottle with you always\n• Prep healthy snacks on Sunday for the week\n\n📝 Track Your Patterns:\nKeep a quick craving journal:\n• What do you crave?\n• When? (time of day, day of cycle)\n• What were you doing? (stressed? tired? bored?)\n• What helped?\n\nAfter a few cycles, you\'ll see patterns and can prepare better!\n\nRemember: Cravings are normal. You\'re not failing - you\'re human! Work WITH your body, not against it. 💕',
    video4Title: 'Hydration During Menstruation',
    video4Desc: 'Why staying hydrated is crucial during your period.',
    video4Content: 'Let\'s talk about water - your period\'s best friend! 💧 But here\'s the thing: when you\'re bloated, your first instinct might be to drink LESS water. STOP! That\'s actually making it worse. Let me explain why...\n\n🤔 The Bloating Paradox:\nYou\'re bloated, so you think "I\'ll drink less water." But here\'s the plot twist: drinking MORE water actually helps reduce bloating! Here\'s why:\n• Your kidneys need water to flush out excess sodium (the real bloating culprit)\n• Dehydration makes your body hold onto MORE water (it\'s scared you\'re running out!)\n• Water keeps your digestion moving (constipation = more bloating)\n\nSo drink up, buttercup! 🧈\n\n💧 How Much Water?:\nThe "8 glasses a day" rule is a starting point, but let\'s personalize it:\n• Basic formula: Half your body weight in ounces (140 lbs = 70 oz)\n• Heavy bleeding? Add 2-3 extra glasses\n• Active? Add 1-2 glasses per 30 minutes of exercise\n• Hot weather? Drink even more!\n\n🎯 Pro Tip: Check your pee! 💛\n• Pale yellow/clear = You\'re winning! ✅\n• Dark yellow = Drink more, stat! 🚨\n• Bright yellow (but you\'re drinking lots) = Probably B-vitamins, you\'re fine!\n\n🍵 Herbal Teas = Hydration Heroes:\nNot a plain water fan? No problem! Herbal teas count toward hydration AND give you bonus benefits:\n\n🌼 Chamomile: Like a warm hug in a cup! Reduces cramps, helps you relax, and might even help you sleep better.\n\n🫚 Ginger: The cramp-fighter! Studies show it can be as effective as ibuprofen for period pain. Plus, it helps with nausea. Win-win!\n\n🌿 Peppermint: Relaxes those cranky muscles (including your uterus) and helps with digestion when hormones make things sluggish.\n\n🍓 Raspberry Leaf: Old-school wisdom! May help tone uterine muscles. Many people swear by it.\n\n🍋 Morning Ritual - Warm Lemon Water:\nStart your day right! Warm water + lemon = magic combo:\n• Wakes up your digestion\n• Eases morning cramps\n• Gives you vitamin C (helps absorb iron from breakfast)\n• Sets a healthy tone for the day\n\n☕ Caffeine - Friend or Foe?:\nModerate caffeine (1-2 cups) is usually fine and might even help headaches. But:\n• Too much (4+ cups) = anxiety, worse breast tenderness, sleep issues\n• It\'s a diuretic, so drink extra water if you have coffee\n• Try to have it before 2 PM so it doesn\'t mess with your sleep\n\n🍷 Alcohol During Your Period:\nHonestly? It\'s not your friend right now. It:\n• Makes you dehydrated\n• Wrecks your sleep (even if you fall asleep easily)\n• Can make bleeding heavier\n• Worsens mood swings\n• Lowers blood sugar = more cravings\n\nIf you do drink, keep it to 1 drink max, have it with food, and drink extra water!\n\n🥥 Coconut Water - Nature\'s Sports Drink:\nLosing blood = losing electrolytes too. Coconut water is perfect:\n• Potassium (600mg per cup!)\n• Magnesium\n• Natural sugars for energy\n• Great if you feel lightheaded\n\nJust watch for added sugars - go for pure, unsweetened versions!\n\n🥒 Eat Your Water Too!:\nSome foods are basically water with nutrients:\n• Cucumbers (96% water!) - great for connective tissue\n• Watermelon (92% water) - antioxidants + helps with muscle soreness\n• Oranges (87% water) - vitamin C + potassium\n• Celery (95% water) - anti-inflammatory compounds\n• Strawberries, grapefruit, bell peppers - all water-rich!\n\n💡 Make Hydration Easy:\n• Get a cute water bottle (you\'ll want to use it!)\n• Set phone reminders\n• Mark your bottle with time goals\n• Flavor water with lemon, cucumber, mint, or berries\n• Drink a glass when you wake up, before meals, and before bed\n• Room temp or warm water might feel better than ice-cold during your period\n\n🚨 When You\'re Dehydrated:\nWatch for these red flags:\n• Dark urine\n• Dry mouth\n• Fatigue\n• Dizziness\n• Headaches\n• Constipation\n\nIf you see these, chug some water (and maybe coconut water for electrolytes)!\n\nRemember: Your body is 60% water. During your period, it needs even more support. Think of water as your body\'s internal cleaning crew - it helps flush out the bad stuff and keeps everything running smoothly! 💪✨',
    video5Title: 'Foods to Avoid During Your Period',
    video5Desc: 'Foods that may worsen cramps and bloating.',
    video5Content: 'Okay, real talk time! 🎤 Some foods are basically period villains - they make everything worse. Let\'s identify the culprits and why they\'re causing chaos:\n\n🧂 The Sodium Saboteurs:\nProcessed foods are sodium BOMBS. Here\'s the deal:\n• Canned soup = 800-1,200mg sodium (that\'s half your daily limit in one bowl!)\n• Fast food burger = 1,000-1,500mg\n• Chips = 150-300mg per serving\n\nSodium makes you hold onto water = bloating city! 💧💥 Read labels - aim for less than 140mg per serving.\n\n🍰 The Sugar Rollercoaster:\nRefined sugar (candies, sodas, pastries, white bread) is like a mood swing factory:\n• Blood sugar SPIKES (you feel great!)\n• Then it CRASHES (you feel terrible)\n• This triggers more cravings\n• Creates inflammation (worse cramps!)\n• Messes with your gut bacteria\n\nLimit to 25g (6 teaspoons) of added sugar daily. Check labels - "healthy" foods like flavored yogurt and granola bars can be sneaky!\n\n☕ Caffeine - The Double-Edged Sword:\nA little caffeine? Fine. Too much? Disaster:\n• Increases anxiety (hormones already doing that!)\n• Worsens breast tenderness\n• Disrupts sleep (you need good sleep during your period!)\n• Can cause headaches\n\nKeep it to 1-2 cups max, and have it early in the day.\n\n🍷 Alcohol - Just Don\'t:\nDuring your period, alcohol is basically your enemy:\n• Dehydrates you\n• Wrecks sleep quality\n• Makes mood swings worse\n• Can increase bleeding\n• Lowers blood sugar = cravings\n• Interferes with nutrient absorption\n\nIf you must, limit to 1 drink, have it with food, and drink extra water.\n\n🍟 Trans Fats - The Inflammation Makers:\nFound in fried foods and processed snacks:\n• Increase inflammation (worse cramps!)\n• Raise bad cholesterol\n• Lower good cholesterol\n\nSkip the fried stuff and processed snacks. Your cramps will thank you!\n\n🥛 Dairy - It Depends:\nSome people are sensitive to lactose or casein:\n• Can cause bloating and gas\n• May worsen cramps for some\n• But it\'s also great for calcium and protein!\n\nTry eliminating it for one cycle and see if you feel better. If dairy bothers you, try lactose-free options or fermented dairy (yogurt, kefir) which might be easier to digest.\n\n🌶️ Spicy Foods - Know Your Limits:\nSpicy food can:\n• Irritate your digestive system\n• Cause discomfort\n• Make bloating worse\n\nBut some people are fine with it! Know your body. If spicy food usually bothers you, skip it during your period.\n\n🥤 Carbonated Drinks - Gas Attack:\nBubbles = gas in your belly = more bloating! Plus, they\'re usually loaded with sugar or artificial sweeteners. Skip them, especially when you\'re already bloated.\n\n📝 The Food Diary Hack:\nEveryone is different! What bothers your friend might be fine for you. Keep a simple diary:\n• What you ate\n• When you ate it\n• How you felt (rate bloating/cramps 1-10)\n\nAfter a few cycles, patterns will emerge. You might discover that gluten, nightshades (tomatoes, peppers), or artificial additives trigger YOUR symptoms.\n\n✅ The Golden Rule:\nFocus on whole, unprocessed foods during your period:\n• Fresh fruits and vegetables\n• Whole grains\n• Lean proteins\n• Healthy fats\n• Lots of water\n\nThese foods are naturally lower in sodium, free of added sugars, and packed with nutrients your body needs.\n\nRemember: You don\'t have to be perfect! Just be aware. If you slip up and have some chips, don\'t beat yourself up. Just get back on track with your next meal. Your body is resilient! 💪',
    video6Title: 'Meal Planning for Your Cycle',
    video6Desc: 'Plan nutritious meals throughout your menstrual cycle.',
    video6Content: 'Your cycle is like a monthly journey with 4 different stops! 🗺️ Each phase has different needs, and knowing what your body wants at each stop makes the ride SO much smoother.\n\n🩸 Phase 1: Menstruation (Days 1-5) - The Rest Stop\nYou\'re bleeding, hormones are low, and you\'re probably tired. This is your body\'s "rest and recover" phase!\n\nWhat Your Body Needs:\n• Iron-rich foods (you\'re losing blood!)\n• Complex carbs (steady energy, no crashes)\n• Anti-inflammatory foods (fight those cramps!)\n• Warm, comforting meals (soups, stews)\n• Extra hydration\n\nMeal Ideas:\n• Lentil soup with veggies 🍲\n• Iron-fortified oatmeal with berries\n• Salmon with quinoa and greens\n• Warm vegetable curry with brown rice\n\nThink: comfort food that\'s actually good for you!\n\n🌱 Phase 2: Follicular (Days 6-14) - The Energy Boost\nYour period\'s over, estrogen is rising, and you\'re feeling GOOD! This is your "let\'s do this!" phase.\n\nWhat Your Body Needs:\n• Lean proteins (tissue repair, hormone building)\n• Whole grains (sustained energy)\n• Fresh veggies (fiber, vitamins)\n• This is the time to try new healthy recipes!\n\nMeal Ideas:\n• Grilled chicken with roasted veggies and quinoa\n• Chickpea salad with mixed greens\n• Whole grain pasta with protein and veggies\n• Stir-fried tofu with brown rice\n\nThink: fresh, energizing, colorful!\n\n🥚 Phase 3: Ovulation (Around Day 14) - The Peak\nEstrogen peaks, energy is high, you might feel amazing! This is your body\'s "prime time."\n\nWhat Your Body Needs:\n• Antioxidant-rich foods (support your body during this big event!)\n• Colorful fruits and veggies (rainbow = different nutrients)\n• Healthy fats (hormone production)\n• Omega-3s (support the process)\n\nMeal Ideas:\n• Mediterranean meals (fish, veggies, olive oil)\n• Colorful salads with nuts and seeds\n• Smoothie bowls with fruits and healthy fats\n\nThink: vibrant, nutrient-dense, balanced!\n\n🌙 Phase 4: Luteal (Days 15-28) - The PMS Zone\nProgesterone rises, and PMS might be knocking. This is your "be kind to yourself" phase.\n\nWhat Your Body Needs:\n• Complex carbs (your body wants them - give it good ones!)\n• Magnesium (cramps, mood, sleep)\n• B vitamins (especially B6 for mood)\n• Fiber (digestion can get sluggish)\n• You might need more calories - that\'s normal!\n\nMeal Ideas:\n• Whole grain toast with nut butter and banana\n• Magnesium smoothies (spinach + banana)\n• Complex carb meals with lean protein\n• Warm grain bowls with veggies and healthy fats\n\nThink: satisfying, nutrient-dense, comforting!\n\n💡 Meal Prep Like a Boss:\n• Batch cook on weekends (when you have energy!)\n• Cook big pots of lentils/beans\n• Prep whole grains (quinoa, brown rice)\n• Roast a variety of veggies\n• Make freezer-friendly meals (soups, stews)\n• Pre-portion healthy snacks\n\nCreate a "period pantry" with:\n• Iron-rich foods\n• Anti-inflammatory ingredients\n• Comfort foods that are also nutritious\n• Herbal teas\n\n🌈 The Rainbow Plate Rule:\nDifferent colors = different nutrients!\n• Red (tomatoes) = lycopene\n• Orange (carrots) = beta-carotene\n• Yellow (corn) = lutein\n• Green (leafy greens) = chlorophyll + folate\n• Blue/Purple (berries) = anthocyanins\n• White (garlic) = allicin\n\nAim for a rainbow on your plate - it\'s pretty AND healthy!\n\n👂 Listen to Your Body:\nYour hunger might change throughout your cycle:\n• Follicular phase = might need less\n• Luteal phase = might need more\n\nThat\'s NORMAL! Honor your hunger, but learn to tell the difference between:\n• True hunger (comes gradually, satisfied by various foods)\n• Emotional eating/cravings (sudden, specific foods)\n\nAdjust portions based on:\n• Your activity level\n• Your energy needs\n• How you feel\n\nSome days you need more, some days less - that\'s intuitive eating!\n\nRemember: You don\'t have to be perfect. Just tune into what your body needs at each phase. Your cycle is a guide, not a rulebook! 📖✨',
    video7Title: 'Supplements for Menstrual Health',
    video7Desc: 'Vitamins and minerals that support menstrual wellness.',
    video7Content: 'Food first, supplements second! 🍎 But sometimes your body needs a little extra help. Let\'s talk about supplements that can actually make a difference during your period - and how to use them safely!\n\n⚠️ IMPORTANT: Always chat with your doctor before starting supplements, especially if you have health conditions or take medications. Supplements can interact with meds and too much of some nutrients can be toxic!\n\n🩸 Iron - The Energy Booster:\nIf you have heavy periods (soaking through a pad/tampon every hour or bleeding 7+ days), you might need iron supplements.\n\nSigns you might need it:\n• Extreme fatigue\n• Pale skin\n• Shortness of breath\n• Dizziness\n• Weird cravings (like wanting to eat ice!)\n\nTypes:\n• Ferrous sulfate (cheap but can upset stomach)\n• Ferrous gluconate (gentler on tummy)\n• Heme iron (from animals, best absorbed)\n\nHow to take:\n• With vitamin C (boosts absorption!)\n• On empty stomach if you can (30-60 min before meals)\n• Avoid with coffee, tea, dairy, or calcium\n• Can cause dark stools (normal!)\n• Typical dose: 18-65mg daily\n\n🚨 Never take iron without doctor supervision - too much is dangerous!\n\n💪 Magnesium - The Cramp Fighter:\nThis is like the MVP of period supplements! It helps with:\n• Cramps (relaxes those cranky muscles)\n• Sleep (supports calming neurotransmitters)\n• Bloating (fluid balance)\n• Mood (neurotransmitter function)\n• Headaches\n\nTypes:\n• Magnesium glycinate (best absorbed, great for sleep) ⭐\n• Magnesium citrate (good absorption, might help with constipation)\n• Magnesium malate (good for energy)\n\nHow to take:\n• 200-400mg daily\n• Start low, increase gradually\n• Take in evening for sleep benefits\n• Too much = diarrhea (your body will tell you!)\n\n🧠 Vitamin B6 - The Mood Helper:\nHelps with:\n• PMS symptoms (especially mood)\n• Nausea\n• Energy levels\n• Menstrual pain\n\nHow to take:\n• 50-100mg daily\n• Works best as part of B-complex\n• Take with food\n• Some people find it helps sleep when taken in evening\n• ⚠️ Very high doses (200mg+ long-term) can cause nerve damage\n\n🐟 Omega-3s - The Inflammation Buster:\nThese are POWERFUL anti-inflammatories! Studies show they can reduce period pain by 30-40%!\n\nBenefits:\n• Reduces menstrual pain significantly\n• Reduces inflammation\n• Supports mood (DHA is crucial for brain health)\n• May reduce heavy bleeding\n\nTypes:\n• Fish oil (most common, get high quality tested for contaminants)\n• Algae-based (great for vegetarians/vegans)\n\nHow to take:\n• 1,000-3,000mg combined EPA/DHA daily\n• Take with meals containing fat\n• Store in fridge (prevents oxidation)\n• Fishy burps? Try enteric-coated capsules or take with meals\n\n☀️ Vitamin D - The Sunshine Vitamin:\nActually a hormone that affects SO many things!\n\nBenefits:\n• Supports mood (low D = higher depression risk)\n• Immune function\n• Calcium absorption (bone health)\n• May regulate cycles\n\nHow to take:\n• Get blood test first (25-hydroxyvitamin D)\n• Optimal: 40-60 ng/mL\n• Typical dose: 1,000-4,000 IU daily\n• Vitamin D3 preferred over D2\n• Take with fat-containing meal\n\n🥛 Calcium - The Bone Builder:\nImportant, but be careful - your body can only absorb ~500mg at a time!\n\nHow to take:\n• Split doses if supplementing\n• 1,000-1,200mg total daily (food + supplements)\n• Calcium citrate better absorbed than carbonate\n• Take with meals\n• Don\'t take with iron\n• Need vitamin D for absorption\n\nMany people get enough from food, so you might not need supplements!\n\n🛡️ Zinc - The Immune Supporter:\nEssential for:\n• Immune function\n• Wound healing\n• Hormone regulation\n\nHow to take:\n• 8-11mg daily (RDA for women)\n• Take with food (empty stomach = nausea)\n• Don\'t take with iron or calcium\n• Higher doses (up to 40mg) OK short-term for immune support\n\n🌿 Other Helpful Supplements:\n• Chasteberry - May help PMS and cycle regulation (research mixed)\n• Evening Primrose Oil - May help breast tenderness and PMS\n• Probiotics - Support gut health (affects inflammation and mood!)\n• CoQ10 - Antioxidant, may help energy and inflammation\n\n💡 Smart Supplement Tips:\n• Get blood work to identify deficiencies (don\'t guess!)\n• Quality matters - choose reputable brands\n• More isn\'t always better (some nutrients toxic in excess)\n• Supplements fill gaps, they don\'t replace food\n• Be patient - can take weeks to months to see benefits\n• Track symptoms to see what works\n• Consider cost - good supplements aren\'t cheap!\n\nRemember: If you\'re eating a nutrient-dense diet, you might not need many supplements. Food first, supplements to fill the gaps! 🎯',
    video8Title: 'Self-Care Practices During Periods',
    video8Desc: 'Holistic self-care tips for your menstrual cycle.',
    video8Content: 'Self-care during your period isn\'t selfish - it\'s ESSENTIAL! 💕 Your body is doing hard work, so let\'s give it the TLC it deserves.\n\n😴 Sleep - Your Superpower:\nGood sleep = better everything! During your period, you might need MORE sleep (that\'s normal!).\n\nCreate Your Sleep Sanctuary:\n• Cool room (65-68°F)\n• Dark (blackout curtains = game changer!)\n• Quiet (white noise machine if needed)\n• Consistent schedule (even weekends!)\n\nBedtime Ritual:\n• Dim lights 1 hour before bed\n• No screens (blue light = bye bye melatonin!)\n• Warm bath\n• Read a book\n• Gentle stretching\n• If pain keeps you up, take meds before bed (with doctor\'s OK)\n\nNight sweats? Have extra bedding ready and wear moisture-wicking PJs!\n\n🏃 Move Your Body (Gently!):\nYou don\'t have to run a marathon! Gentle movement is actually amazing:\n• Increases endorphins (natural painkillers!)\n• Improves circulation (reduces cramps)\n• Boosts mood\n• Reduces bloating\n\nTry These:\n• Walking (even 10-15 min helps!)\n• Gentle yoga\n• Stretching\n• Swimming (warm water = heaven!)\n• Tai chi\n• Light cycling\n\nListen to your body - some days you can do more, some days you need rest. Both are OK!\n\n🔥 Heat Therapy - Your Best Friend:\nHeat = instant relief! It increases blood flow, relaxes muscles, and blocks pain signals.\n\nHow to Use:\n• Heating pad or hot water bottle\n• Lower abdomen or lower back\n• 15-20 minutes at a time\n• Repeat as needed\n• Use towel as barrier (don\'t burn yourself!)\n\nBath Time Magic:\n• Warm (not hot!) bath\n• Add 1-2 cups Epsom salts (magnesium absorbed through skin!)\n• Soak 20-30 minutes\n• Add lavender or clary sage essential oils (properly diluted)\n\nPure relaxation! 🛁\n\n🧘 Stress Management:\nStress makes EVERYTHING worse. Let\'s chill out!\n\nDeep Breathing (4-7-8 Technique):\n• Inhale 4 counts\n• Hold 7 counts\n• Exhale 8 counts\n• Repeat 4-8 times\n\nMeditation:\n• 5-10 minutes is enough!\n• Use guided apps\n• Focus on breath\n• Body scan (notice each body part)\n\nMindfulness:\n• Be present while drinking coffee\n• Notice sensations during walks\n• Savor your food\n\nProgressive Muscle Relaxation:\nTense and release each muscle group - instant calm!\n\n💭 Emotional Self-Care:\nYour feelings are VALID! Hormones affect mood - that\'s science, not weakness.\n\nWhat to Do:\n• Allow yourself to cry (it\'s OK!)\n• Journal your feelings\n• Talk to trusted friends/family\n• Avoid major decisions (hormones affect judgment)\n• Be kind to yourself (talk like you would to a friend)\n• Do things that bring joy (reading, music, shows, nature)\n\nSet Boundaries:\n• Say NO to overwhelming commitments\n• Communicate your needs\n• Avoid energy-draining people\n• It\'s OK to withdraw and rest!\n\n🧼 Hygiene Matters:\n• Change products regularly (pads: 4-6 hrs, tampons: 4-8 hrs)\n• Wash hands before/after\n• Shower daily\n• Use gentle, pH-balanced cleansers\n• Try different products if you get irritation\n\nComfortable Clothes:\n• Cotton underwear\n• Loose-fitting pants/skirts\n• Comfortable bras (or go braless!)\n• Avoid tight clothes (can cause issues)\n\n📝 Track Your Cycle:\nKnowledge is power! Track:\n• Period dates\n• Flow intensity\n• Symptoms (physical + emotional)\n• Sleep quality\n• Energy levels\n• Food cravings\n• Exercise\n\nPatterns will emerge - you\'ll learn what works for YOU!\n\n🚨 When to Get Help:\nSome discomfort is normal, but severe symptoms need attention:\n• Severe pain (OTC meds don\'t help)\n• Extremely heavy bleeding (soaking through every hour)\n• Periods longer than 7 days\n• Severe mood changes/depression\n• Any concerning symptoms\n\nDon\'t suffer in silence - reach out!\n\nRemember: Self-care isn\'t selfish. It\'s how you show up for yourself so you can show up for life! Your body is doing amazing work - honor it with care and compassion. 💖✨',
    video9Title: 'Healthy Snacks for Period Days',
    video9Desc: 'Quick and nutritious snack ideas for your period.',
    video9Content: 'Snacks during your period aren\'t just about satisfying cravings - they\'re your secret weapon for stable energy, better mood, and managing symptoms! 🎯\n\nThe Perfect Snack Formula:\nProtein + Healthy Fats + Fiber = Sustained Energy & Satisfaction!\n\n🥜 Nuts & Seeds - The Powerhouses:\n• Almonds (23 nuts = 1 oz): 6g protein, 75mg magnesium, vitamin E\n• Walnuts: High in omega-3s (2.5g per oz) - anti-inflammatory!\n• Pumpkin Seeds: Magnesium superstars (150mg per oz!) + zinc + iron\n• Cashews: Magnesium, iron, zinc\n\nPro Tip: Pre-portion into small containers (1 oz servings) to avoid overeating. Choose raw or dry-roasted without added oils/salt/sugar.\n\n🍌 Fruits - Nature\'s Candy:\n• Bananas: Potassium (400mg!) + magnesium + B6 - perfect for bloating!\n• Berries: Antioxidant powerhouses, low sugar, high fiber\n• Apples: Pectin fiber + quercetin (anti-inflammatory)\n• Oranges: Vitamin C (helps iron absorption!)\n• Kiwi: Vitamin C + potassium\n\n🍼 Greek Yogurt - The Triple Threat:\n• High-quality protein (15-20g per serving)\n• Calcium (bone health!)\n• Probiotics (happy gut = happy you!)\n\nMake it delicious: Add fresh berries, drizzle of honey, nuts, or cinnamon. Plain yogurt = no added sugars!\n\n🥕 Hummus + Veggies - The Crunch Combo:\nHummus = protein + healthy fats + fiber + iron + magnesium\n\nPerfect Dippers:\n• Carrots (beta-carotene)\n• Cucumbers (96% water = hydration!)\n• Bell peppers (vitamin C)\n• Celery, broccoli, cherry tomatoes, snap peas\n\nMake your own or choose store-bought with minimal additives!\n\n🍫 Dark Chocolate - Yes, Really!:\n70% cocoa or higher = actually good for you!\n• Magnesium (64mg per oz)\n• Iron\n• Antioxidants\n• Mood boosters\n\n1-2 oz serving = guilt-free satisfaction! 🎉\n\n🥜 Trail Mix - Make Your Own:\nSkip the store-bought (too much sugar/salt!). Combine:\n• Raw nuts\n• Seeds\n• Unsweetened dried fruits\n• Dark chocolate chips (70%+)\n\nPortion into 1/4 cup servings!\n\n🍚 Rice Cakes + Nut Butter:\n• Brown rice cakes (more fiber)\n• Natural nut butter (almond, peanut, cashew)\n• Add banana or berries for extra nutrients\n\nComplex carbs + protein/fat = sustained energy!\n\n🥚 Hard-Boiled Eggs:\n• 6g high-quality protein\n• Vitamin D, B vitamins, choline\n• Satiating, stabilizes blood sugar\n\nBoil a batch on Sunday, keep in fridge all week!\n\n🥤 Smoothies - The Meal Replacement:\nPerfect when you don\'t feel like eating solid food!\n\nBuild Your Smoothie:\n• Base: Unsweetened plant milk or Greek yogurt\n• Greens: Spinach (mild when blended!)\n• Fruits: Berries, banana\n• Protein: Protein powder (optional)\n• Healthy fats: Nut butter, avocado, flaxseeds\n• Add-ins: Cinnamon, turmeric, ginger\n\nWatch portion sizes - they can get calorie-dense!\n\n🥔 Roasted Chickpeas - The Chip Alternative:\nCrunchy, salty, satisfying - but actually good for you!\n\nHow to Make:\n• Drain, rinse, pat dry canned chickpeas\n• Toss with olive oil + seasonings (garlic, paprika, cumin)\n• Roast at 400°F for 20-30 min until crispy\n• 7g protein + 6g fiber per 1/2 cup!\n\nStore in airtight container to stay crispy!\n\n💡 More Snack Ideas:\n• Cottage cheese + fruit (high protein, calcium)\n• Edamame (steamed soybeans - protein, fiber, iron)\n• Apple slices + almond butter\n• Veggie sticks + guacamole\n• Whole grain crackers + cheese or nut butter\n• Homemade energy balls (dates, nuts, seeds)\n\n📦 Snack Prep Strategy:\n• Prep on weekends (when you have energy!)\n• Portion into containers\n• Keep visible (eye level in fridge/pantry)\n• Have snacks everywhere (home, work, bag)\n• Remove less healthy options\n\n💧 Before You Snack:\nSometimes cravings = thirst! Drink water first, wait 15-20 minutes. Still hungry? Then snack!\n\n🧘 Eat Mindfully:\n• Sit down\n• No distractions (put phone away!)\n• Savor your food\n• This helps satisfaction and prevents overeating\n\nRemember: Snacks are your friend during your period! Choose wisely, prep ahead, and enjoy! 🎊 Nuts and seeds are nutritional powerhouses that provide a combination of protein, healthy fats, fiber, and essential minerals. Almonds are particularly excellent - a one-ounce serving (about 23 almonds) provides 6g of protein, 14g of healthy fats (mostly monounsaturated), 3.5g of fiber, 75mg of magnesium, and 200mg of potassium. They also contain vitamin E (an antioxidant) and calcium. Walnuts are unique among nuts for their high omega-3 content (specifically ALA, alpha-linolenic acid) - about 2.5g per ounce. They also provide protein, fiber, and various minerals. Pumpkin seeds are magnesium superstars (150mg per ounce) and also provide zinc, iron, and protein. They\'re particularly beneficial for menstrual health. Cashews provide magnesium, iron, and zinc. Macadamia nuts are high in monounsaturated fats. Portion control is important with nuts - while nutritious, they\'re calorie-dense. A serving is typically 1 ounce (about a small handful). To avoid overeating, pre-portion nuts into small containers. Choose raw or dry-roasted nuts without added oils, salt, or sugar when possible. Fresh fruits provide natural sugars for quick energy, along with fiber that slows sugar absorption, preventing blood sugar spikes. Bananas are period-friendly for multiple reasons: they provide potassium (about 400mg per medium banana), which helps balance sodium and reduce bloating; they contain magnesium (32mg) and vitamin B6 (0.4mg), both important for menstrual health; they\'re easy to digest and provide quick energy. Berries are antioxidant powerhouses - blueberries, strawberries, raspberries, and blackberries contain anthocyanins and other compounds that combat inflammation. They\'re relatively low in sugar compared to other fruits and high in fiber. Apples provide pectin (a type of soluble fiber) that supports digestive health and helps with satiety. They also contain quercetin, an anti-inflammatory compound. Other excellent fruit choices include: oranges (vitamin C for iron absorption), kiwi (vitamin C and potassium), and pears (fiber and hydration). Greek yogurt is an excellent snack choice, especially when combined with other nutrient-dense foods. It provides high-quality protein (about 15-20g per 6-ounce serving), which promotes satiety and helps stabilize blood sugar. It\'s rich in calcium (important for bone health and muscle function) and contains probiotics (beneficial bacteria that support gut health). The probiotics in yogurt may help with digestive issues that can occur during menstruation. Choose plain Greek yogurt to avoid added sugars, then add your own flavorings: fresh berries, a drizzle of honey, nuts, or a sprinkle of cinnamon. For those avoiding dairy, coconut yogurt or other plant-based yogurts fortified with calcium and probiotics are alternatives. Hummus with vegetables is a satisfying, nutrient-dense snack. Hummus provides protein (from chickpeas), healthy fats (from tahini and olive oil), fiber, and various minerals including iron and magnesium. Pair it with raw vegetables for additional fiber, vitamins, and hydration. Carrots provide beta-carotene (converts to vitamin A), fiber, and natural sweetness. Cucumbers are hydrating (96% water) and provide silica. Bell peppers are rich in vitamin C (important for iron absorption) and provide crunch and flavor. Other good dippers include: celery, broccoli florets, cherry tomatoes, and snap peas. Make your own hummus to control ingredients, or choose store-bought varieties with minimal additives. Dark chocolate (70% cocoa or higher) can satisfy chocolate cravings while providing actual health benefits. The higher cocoa content means more beneficial compounds and less sugar. Dark chocolate contains: magnesium (64mg per ounce in 70% dark chocolate), iron, antioxidants (flavonoids), and mood-enhancing compounds like theobromine and phenylethylamine. However, it\'s still calorie-dense and contains some sugar, so portion control is important. A serving is typically 1-2 ounces. Look for dark chocolate with minimal added ingredients - cocoa, cocoa butter, and a small amount of sugar are ideal. Trail mix can be an excellent snack if made thoughtfully. Create your own to control ingredients: combine raw nuts, seeds, and unsweetened dried fruits. Avoid pre-made trail mixes that often contain added sugars, oils, and excessive salt. Good combinations include: almonds, walnuts, pumpkin seeds, and unsweetened dried cranberries or raisins. Add dark chocolate chips (70% or higher) for a treat. Portion into small containers (about 1/4 cup servings) to avoid overeating. Rice cakes with nut butter provide a combination of complex carbohydrates and healthy fats/protein. Choose brown rice cakes for more fiber and nutrients. Top with natural nut butter (almond, peanut, or cashew) that contains only nuts and perhaps a small amount of salt - avoid those with added sugars or oils. This combination provides sustained energy: the rice cake offers quick carbohydrates, while the nut butter provides protein and fat that slow digestion and maintain satiety. Add sliced banana or berries for additional nutrients and flavor. Hard-boiled eggs are a convenient, protein-rich snack. One large egg provides about 6g of high-quality protein (containing all essential amino acids), along with various vitamins and minerals including vitamin D, B vitamins, and choline (important for brain health). Eggs are satiating and can help stabilize blood sugar. They\'re easy to prepare in advance - boil a batch at the beginning of the week and keep them refrigerated. Eat them plain, or add a sprinkle of salt, pepper, or your favorite seasoning. Smoothies can serve as a meal replacement or substantial snack. They\'re an excellent way to combine multiple beneficial ingredients. A well-designed smoothie might include: a base of unsweetened plant milk or Greek yogurt, leafy greens (spinach is mild-tasting when blended), fruits (berries, banana), protein powder (if desired), healthy fats (nut butter, avocado, or flaxseeds), and optional add-ins (cinnamon, turmeric, ginger). Smoothies provide hydration, fiber, protein, vitamins, and minerals. They\'re particularly useful when you don\'t feel like eating solid food but need nutrition. However, be mindful of portion sizes and ingredients - smoothies can become calorie-dense if not carefully constructed. Roasted chickpeas are a crunchy, satisfying snack that provides protein and fiber. Canned chickpeas can be drained, rinsed, patted dry, tossed with olive oil and seasonings (try garlic powder, paprika, cumin, or your favorite herbs), and roasted at 400°F for 20-30 minutes until crispy. They provide about 7g of protein and 6g of fiber per 1/2 cup serving, along with iron and magnesium. They\'re a healthier alternative to chips when you crave something crunchy and salty. Store in an airtight container to maintain crispness. Other excellent snack ideas include: cottage cheese with fruit (high protein, calcium), edamame (steamed soybeans - protein, fiber, iron), apple slices with almond butter, vegetable sticks with guacamole (healthy fats, fiber, vitamins), whole grain crackers with cheese or nut butter, and homemade energy balls made with dates, nuts, and seeds. Snack preparation and strategy: Prepare snacks in advance during times when you have energy (perhaps on weekends or during your follicular phase). Portion snacks into containers so they\'re ready when cravings hit. Keep healthy snacks visible and easily accessible - store them at eye level in your refrigerator or pantry. Remove or limit access to less healthy options. Have snacks available in multiple locations - at home, at work, in your bag - so you\'re not caught without healthy options. Listen to your body\'s hunger and fullness cues. Sometimes what feels like a craving is actually thirst, so drink water first. If you\'re still hungry/craving after 15-20 minutes, then have a snack. Eat snacks mindfully - sit down, avoid distractions, and savor your food. This helps with satisfaction and prevents overeating. The ideal snack combines protein, healthy fats, and fiber (and/or complex carbohydrates). This combination provides sustained energy, promotes satiety, and helps stabilize blood sugar. For example: apple + almond butter (fiber + protein/fat), Greek yogurt + berries + nuts (protein + fiber + healthy fats), or whole grain crackers + cheese (complex carbs + protein/fat).',
    video10Title: 'Managing Bloating Through Diet',
    video10Desc: 'Dietary strategies to reduce period bloating.',
    video10Content: 'Ugh, bloating! 😤 It\'s like your body decided to hold onto everything. But here\'s the thing - understanding WHY it happens helps you fight back!\n\nThe Bloat Breakdown:\nBloating = Water retention + Digestive gas (sometimes both at once = double trouble!)\n\n🌙 Why It Happens (The Hormone Story):\nDuring the week before your period, progesterone rises and basically tells your body:\n• "Hold onto ALL the sodium and water!" 💧\n• "Slow down digestion!" (constipation = more gas)\n• "Mess with gut bacteria!"\n\nIt\'s normal, but annoying. Let\'s work with your body, not against it!\n\n🧂 Sodium = The Main Culprit:\nFor every gram of sodium, your body holds 100ml of water! That\'s why reducing sodium is KEY.\n\nSodium Bombs to Avoid:\n• Canned soups (800-1,200mg per serving!)\n• Processed meats (deli, sausages, bacon)\n• Fast food\n• Frozen meals\n• Condiments (soy sauce, dressings, ketchup)\n• Chips, crackers, pretzels\n\nRead Labels: Aim for less than 140mg sodium per serving. Cook at home = control!\n\n🍌 Potassium to the Rescue:\nPotassium tells your kidneys to flush out sodium. It\'s like nature\'s diuretic!\n\nPotassium Powerhouses:\n• Bananas (400mg per medium)\n• Avocados (700mg per fruit!)\n• Sweet potatoes (540mg per medium)\n• Spinach (840mg per cooked cup!)\n• White beans (1,000mg per cup!)\n• Coconut water (600mg per cup)\n\nInclude these in every meal, especially the week before your period!\n\n💧 The Hydration Paradox:\nYou\'re bloated, so you drink less water... WRONG! This makes it WORSE because:\n• Your body panics and holds MORE water\n• Digestion slows (constipation = more bloating)\n• Kidneys can\'t flush sodium\n\nThe Fix: Drink MORE water (8-10 glasses daily) while reducing sodium. Your kidneys need water to flush the sodium out!\n\nHelpful Teas:\n• Peppermint (digestive issues)\n• Dandelion (natural diuretic)\n• Ginger (anti-inflammatory, aids digestion)\n\n🍽️ Eating Patterns Matter:\nLarge meals = overwhelmed digestive system (especially when progesterone already slowed things down!)\n\nBetter Approach:\n• Smaller, frequent meals (every 3-4 hours)\n• Chew thoroughly (digestion starts in your mouth!)\n• Eat slowly (swallowing air = gas)\n• Avoid large meals late evening\n\n🦠 Gut Health = Bloat Health:\nProbiotics help balance gut bacteria (hormones mess with this during your period!)\n\nProbiotic Foods:\n• Greek yogurt (live cultures)\n• Kefir\n• Fermented veggies (sauerkraut, kimchi - choose live cultures!)\n• Kombucha\n• Miso\n\nPrebiotics (Feed Good Bacteria):\n• Garlic, onions, leeks\n• Asparagus\n• Bananas\n• Whole grains\n\nIntroduce gradually - they can cause some gas initially as your gut adjusts!\n\n🥦 Gas-Producing Foods (Know Your Limits):\nThese can cause gas, but they\'re also super nutritious:\n• Beans/legumes\n• Cruciferous veggies (broccoli, cabbage, cauliflower)\n• Onions, garlic\n• Carbonated drinks\n• Some artificial sweeteners\n\nDon\'t eliminate - try:\n• Cooking thoroughly (easier to digest)\n• Smaller portions\n• Introduce gradually\n• Use digestive aids (Beano)\n• Avoid during worst bloating days if they consistently bother you\n\n🥤 Carbonated Drinks = Gas Attack:\nBubbles = gas in your belly = more bloating! Plus they\'re usually loaded with sugar. Skip them, especially during your period.\n\n💪 Magnesium - The Bloat Fighter:\nHelps regulate fluid balance and relaxes digestive muscles!\n\nMagnesium Sources:\n• Spinach (157mg per cooked cup)\n• Pumpkin seeds (150mg per oz)\n• Almonds (75mg per oz)\n• Dark chocolate (64mg per oz)\n• Whole grains, beans, fish\n\nSome people find 200-400mg daily supplement helps!\n\n🚶 Move It!:\nGentle movement is one of the BEST ways to reduce bloating:\n• Stimulates digestion (moves gas through!)\n• Supports lymphatic drainage\n• Increases circulation\n• Reduces stress (affects digestion)\n\nTry:\n• Walking (even 10-15 min helps!)\n• Gentle yoga with twists (moves gas!)\n• Stretching\n\n🚫 Habits That Add Air:\n• Chewing gum (swallowing air)\n• Drinking through straws\n• Eating too quickly\n• Talking while eating\n\nAvoid these, especially during your period!\n\n📝 Food Sensitivity Check:\nSome foods might bother you more during your period:\n• Lactose (dairy)\n• Fructose (some fruits)\n• Gluten (if sensitive)\n• FODMAPs (various foods)\n\nTrack It: Keep a food/symptom diary. Rate bloating 1-10. Look for patterns over several cycles!\n\n⏰ Timing is Everything:\nBloating often follows a pattern:\n• Worst: Days before period + first few days of period\n• Better: Rest of cycle\n\nPrepare:\n• Reduce sodium more carefully during bloating days\n• Plan looser clothing\n• Schedule important events (if possible) when bloating is less\n• Increase potassium-rich foods premenstrually\n\n💡 Be Realistic:\nSome bloating is NORMAL due to hormones. But if it\'s:\n• Severe\n• Persistent beyond your period\n• Accompanied by concerning symptoms (severe pain, weight gain, bowel changes)\n\n...then see a doctor! Could be IBS, SIBO, or other digestive issues.\n\nRemember: You\'re not broken - bloating is a normal part of the cycle. But these strategies can definitely help! 💪✨',
  },

  // Chat Screen
  chat: {
    initialMessage: 'Hello! I\'m here to help you with questions about menstrual and maternal health. How can I assist you today?',
    connectionError: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
    typeMessage: 'Type a message...',
    typeQuestion: 'Type your question...',
    send: 'Send',
    apiKeyInvalid: 'API key is invalid. Please check your OpenAI API key configuration.',
    tooManyRequests: 'Too many requests. Please wait a moment and try again.',
    error: 'Error',
    somethingWentWrong: 'Something went wrong',
  },

  // Menstrual Home Screen
  menstrualHome: {
    loadingData: 'Loading your menstrual data...',
    menstrualHealth: 'Menstrual Health',
    currentCycle: 'Current Cycle',
    dayOf: 'Day {{day}} of {{length}}',
    nextPeriodIn: 'Next period in {{days}} days',
    periodDue: 'Period is due',
    welcomeTitle: 'Welcome to Menstrual Health',
    setupText: 'Set up your menstrual cycle tracking to get personalized insights and predictions.',
    setupButton: 'Set Up Cycle Tracking',
    quickActions: 'Quick Actions',
    logPeriod: 'Log Period',
    logPeriodInfo: 'Track the start and end dates of your menstrual period to monitor your cycle patterns and predict future periods. This helps you understand your body\'s natural rhythm and identify any irregularities.',
    logSymptoms: 'Log Symptoms',
    logSymptomsInfo: 'Record symptoms like cramps, mood changes, bloating, and other physical or emotional changes throughout your cycle. This data helps you and your healthcare provider understand patterns and manage your health better.',
    viewCalendar: 'View Calendar',
    insights: 'Insights',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity',
    startTracking: 'Start tracking your cycle',
    periodLoggedFor: 'Period logged for',
    daysAgo: '{{days}} days ago',
    symptomsLogged: 'Symptoms logged',
    cycleInsights: 'Cycle Insights',
    averageCycleLength: 'Average Cycle Length',
    averagePeriodLength: 'Average Period Length',
    viewDetailedInsights: 'View Detailed Insights',
    healthTipsForYou: 'Health Tips for You',
    disposeSafely: 'Dispose Safely',
    disposeSafelyDesc: 'Wrap used pads properly and discard in bins; never flush pads.',
    trackYourCycle: 'Track Your Cycle',
    trackYourCycleDesc: 'Use the app calendar to note cycle length, flow, and symptoms. This will help you notice irregularities early.',
    restWell: 'Rest Well',
    restWellDesc: 'Good sleep supports hormonal balance and reduces stress during periods.',
    eatHealthy: 'Eat Healthy',
    eatHealthyDesc: 'Avoid excessive caffeine and junk food during menstruation as they may worsen cramps.',
    easeCramps: 'Ease Cramps',
    easeCrampsDesc: 'Keep a small heating pad or hot water bottle ready during periods to ease abdominal cramps and back pain.',
    exerciseTiming: 'Exercise Timing',
    exerciseTimingDesc: 'Avoid high-intensity workouts. Engage in light physical activity like walking or yoga.',
    regularCheckups: 'Regular Checkups',
    regularCheckupsDesc: 'Visit the doctor often to monitor mother\'s health, baby\'s growth, and detect complications early.',
    stayActive: 'Stay Active',
    stayActiveDesc: 'Gentle walks or prenatal yoga improve circulation, reduce back pain, and keep the mother energetic.',
    manageStress: 'Manage Stress',
    manageStressDesc: 'Simple breathing exercises, meditation, reduce anxiety and promote emotional well-being. Stress is not good for baby\'s health.',
    postnatalVisits: 'Postnatal Visits',
    postnatalVisitsDesc: 'Doctor checkups ensure proper healing, family planning advice, and long-term maternal health.',
    exerciseRegularly: 'Exercise Regularly',
    exerciseRegularlyDesc: 'At least 30 minutes of walking, cycling, or sports keeps the body fit and heart strong.',
    getEnoughSleep: 'Get Enough Sleep',
    getEnoughSleepDesc: '7–9 hours of quality sleep helps the brain rest, improves memory, and reduces stress.',
    limitScreenTime: 'Limit Screen Time',
    limitScreenTimeDesc: 'Too much phone or computer use strains eyes, affects posture, and disturbs sleep.',
    practiceGoodPosture: 'Practice Good Posture',
    practiceGoodPostureDesc: 'Sit and stand straight to avoid back pain, improve breathing, and boost self-confidence.',
    oralCare: 'Oral Care',
    oralCareDesc: 'Brush twice a day and floss regularly to prevent cavities, gum disease, and weak teeth.',
    personalHygiene: 'Personal Hygiene',
    personalHygieneDesc: 'Regular bathing, clean clothes, and trimmed nails protect against germs and skin infections.',
    safeEnvironment: 'Safe Environment',
    safeEnvironmentDesc: 'Keep your surroundings clean and avoid littering to reduce disease risk and promote community health.',
  },

  // Period Tracker Screen
  periodTracker: {
    loadingData: 'Loading your period data...',
    periodTracker: 'Period Tracker',
    nextPeriod: 'Next Period',
    notPredicted: 'Not predicted',
    inDays: 'In {{days}} days',
    today: 'Today',
    overdue: 'Overdue',
    setupTitle: 'Set Up Period Tracking',
    setupText: 'Start tracking your menstrual cycle to get personalized insights and predictions.',
    logFirstPeriod: 'Log Your First Period',
    recentSymptoms: 'Recent Symptoms',
    noSymptomsLogged: 'No symptoms logged yet',
    startTrackingSymptoms: 'Start tracking your symptoms',
    quickLog: 'Quick Log',
    logPeriod: 'Log Period',
    logSymptoms: 'Log Symptoms',
    recentCycles: 'Recent Cycles',
    noCycleHistory: 'No cycle history yet',
    startLoggingPeriods: 'Start logging your periods',
    regular: 'Regular',
    irregular: 'Irregular',
    logPeriodModal: 'Log Period',
    startDate: 'Start Date',
    endDate: 'End Date',
    selectStartDate: 'Select start date',
    selectEndDate: 'Select end date',
    cancel: 'Cancel',
    save: 'Save',
    logSymptomModal: 'Log Symptom',
    symptom: 'Symptom',
    severity: 'Severity',
    selectSymptom: 'Select a symptom',
    light: 'Light',
    moderate: 'Moderate',
    severe: 'Severe',
    selectSymptomTitle: 'Select Symptom',
    symptomDetails: 'Symptom Details',
    severityLabel: 'Severity:',
    recommendations: 'Recommendations:',
    consultDoctor: 'Please consult a doctor immediately',
    close: 'Close',
    successPeriodLogged: 'Period logged successfully!',
    successSymptomLogged: 'Symptom logged successfully!',
    errorSavePeriod: 'Failed to save period data. Please try again.',
    errorSaveSymptom: 'Failed to save symptom data. Please try again.',
    errorSelectSymptom: 'Please select a symptom',
    validationError: 'Validation Error',
    fixDateErrors: 'Please fix the date errors before saving',
    startDateRequired: 'Start date is required',
    invalidStartDate: 'Invalid start date format',
    startDateFuture: 'Start date cannot be in the future',
    endDateRequired: 'End date is required',
    invalidEndDate: 'Invalid end date format',
    endDateFuture: 'End date cannot be in the future',
    endBeforeStart: 'End date cannot be before start date',
    periodTooLong: 'Period cannot be longer than 10 days',
    selectStartDateTitle: 'Select Start Date',
    selectEndDateTitle: 'Select End Date',
    cramps: 'Cramps',
    bloating: 'Bloating',
    headache: 'Headache',
    fatigue: 'Fatigue',
    vomitNausea: 'Vomit/Nausea',
    digestiveIssues: 'Digestive issues',
    moodSwings: 'Mood swings',
  },

  // Cycle Insights Screen
  cycleInsights: {
    loadingInsights: 'Loading your cycle insights...',
    cycleInsights: 'Cycle Insights',
    keyInsights: 'Key Insights',
    averageCycleLength: 'Average Cycle Length',
    averagePeriodLength: 'Average Period Length',
    consistencyScore: 'Consistency Score',
    cyclesRegular: 'Your cycles are generally regular',
    cyclesNeedAttention: 'Your cycles may need attention',
    withinNormalRange: 'Within normal range (3-7 days)',
    mayNeedMedicalAttention: 'May need medical attention',
    veryConsistent: 'Very consistent cycle patterns',
    moderatelyConsistent: 'Moderately consistent',
    inconsistentPatterns: 'Inconsistent patterns',
    notEnoughData: 'Not enough data for insights',
    trackMoreCycles: 'Track more cycles to see patterns',
    cycleHistory: 'Cycle History',
    days: 'Days',
    noCycleHistoryYet: 'No cycle history yet',
    startLoggingPeriods: 'Start logging your periods',
    predictions: 'Predictions',
    nextPeriod: 'Next Period',
    fertileWindow: 'Fertile Window',
    ovulation: 'Ovulation',
    healthRecommendations: 'Health Recommendations',
    stayHydrated: 'Stay Hydrated',
    stayHydratedDesc: 'Your cycle patterns suggest you might benefit from increased water intake during your period.',
    noCycleDataYet: 'No Cycle Data Yet',
    startTrackingText: 'Start tracking your menstrual cycle to see personalized insights and predictions.',
  },

  // Pregnancy Tracker Screen
  pregnancyTracker: {
    loadingData: 'Loading your pregnancy data...',
    pregnancyTracker: 'Pregnancy Tracker',
    welcomeTitle: 'Welcome to Pregnancy Tracker',
    setDueDatePrompt: 'Set your due date to get started',
    setDueDate: 'Set Due Date',
    week: 'Week',
    trimester: 'Trimester',
    dueDate: 'Due Date:',
    daysToGo: '{{days}} days to go',
    weightGain: 'Weight Gain',
    bloodPressure: 'Blood Pressure',
    weeksPregnant: 'Weeks Pregnant',
    legend: 'Legend',
    dueDateLegend: 'Due Date',
    appointmentsLegend: 'Appointments',
    weightLogsLegend: 'Weight Logs',
    bpLogsLegend: 'BP Logs',
    milestonesLegend: 'Milestones',
    todaysSymptoms: 'Today\'s Symptoms',
    logSymptom: 'Log Symptom',
    noSymptomsLogged: 'No symptoms logged yet',
    startTrackingSymptoms: 'Start tracking your symptoms',
    quickLog: 'Quick Log',
    logWeight: 'Log Weight',
    logWeightInfo: 'Track your weight gain throughout pregnancy to monitor healthy weight progression and identify any concerns early. Regular weight monitoring helps ensure you\'re gaining weight at a healthy rate for both you and your baby.',
    logBP: 'Log BP',
    logBPInfo: 'Monitor your blood pressure regularly during pregnancy to detect preeclampsia or other complications early. High blood pressure during pregnancy can be dangerous for both mother and baby, so regular monitoring is crucial.',
    addAppointment: 'Add Appointment',
    addAppointmentInfo: 'Schedule and track your prenatal appointments, ultrasounds, and other medical visits to stay on top of your care. Regular prenatal care is essential for monitoring your baby\'s development and your health throughout pregnancy.',
    upcomingAppointments: 'Upcoming Appointments',
    at: 'at',
    pregnancyMilestones: 'Pregnancy Milestones',
    recentLogs: 'Recent Logs',
    weightHistory: 'Weight History',
    bloodPressureHistory: 'Blood Pressure History',
    setYourDueDate: 'Set Your Due Date',
    selectDueDatePrompt: 'Select your expected due date from the calendar below',
    selectYourDueDate: 'Select Your Due Date',
    dateRangeNote: 'Select a date within the next 10 months for a realistic pregnancy timeline',
    selected: 'Selected:',
    cancel: 'Cancel',
    setDueDateButton: 'Set Due Date',
    logWeightModal: 'Log Weight',
    enterWeightPrompt: 'Enter your current weight to track your pregnancy progress',
    weightKg: 'Weight (kg)',
    enterWeightPlaceholder: 'Enter weight in kg',
    saveWeight: 'Save Weight',
    logBloodPressure: 'Log Blood Pressure',
    enterBPPrompt: 'Enter your current blood pressure readings',
    systolic: 'Systolic',
    diastolic: 'Diastolic',
    saveBP: 'Save BP',
    addAppointmentModal: 'Add Appointment',
    scheduleAppointmentPrompt: 'Schedule your next medical appointment',
    appointmentType: 'Appointment Type',
    appointmentTypePlaceholder: 'e.g., Ultrasound, Checkup, Blood Test',
    date: 'Date',
    selectAppointmentDate: 'Select appointment date',
    time: 'Time',
    timePlaceholder: 'e.g., 10:00 AM',
    doctor: 'Doctor',
    doctorPlaceholder: 'Doctor\'s name',
    addAppointmentButton: 'Add Appointment',
    selectAppointmentDateTitle: 'Select Appointment Date',
    chooseAppointmentDate: 'Choose the date for your appointment',
    done: 'Done',
    appointments: 'Appointments',
    with: 'with',
    weightLogs: 'Weight Logs',
    loggedAt: 'Logged at',
    milestones: 'Milestones',
    completed: 'Completed',
    noDataForDate: 'No data for this date',
    tapQuickLogPrompt: 'Tap the quick log buttons to add information',
    close: 'Close',
    logSymptomModal: 'Log Symptom',
    symptom: 'Symptom',
    selectSymptom: 'Select a symptom',
    severity: 'Severity',
    selectSymptomTitle: 'Select Symptom',
    symptomDetails: 'Symptom Details',
    severityLabel: 'Severity:',
    recommendations: 'Recommendations:',
    consultDoctor: 'Please consult a doctor immediately',
    save: 'Save',
    backLegPain: 'Back/leg pain',
    frequentUrination: 'Frequent urination',
    swollenBreasts: 'Swollen breasts',
    vomitNausea: 'Vomit/Nausea',
    heartburn: 'Heartburn',
    abdominalPain: 'Abdominal pain',
    heartbeatDetectable: 'Heartbeat detectable',
    firstTrimesterScreening: 'First trimester screening',
    genderRevealPossible: 'Gender reveal possible',
    anatomyScan: 'Anatomy scan',
    viabilityMilestone: 'Viability milestone',
    thirdTrimesterBegins: 'Third trimester begins',
    userNotAuthenticated: 'User not authenticated',
    failedToSavePregnancyData: 'Failed to save pregnancy data',
    failedToLoadPregnancyData: 'Failed to load pregnancy data',
    failedToSaveWeightEntry: 'Failed to save weight entry',
    failedToSaveBPEntry: 'Failed to save blood pressure entry',
    failedToSaveAppointment: 'Failed to save appointment',
    failedToSaveSymptomData: 'Failed to save symptom data. Please try again.',
    pleaseSelectSymptom: 'Please select a symptom',
    pleaseEnterValidWeight: 'Please enter a valid weight',
    pleaseEnterRealisticWeight: 'Please enter a realistic weight (30-200 kg)',
    pleaseEnterValidBP: 'Please enter valid blood pressure values',
    pleaseEnterRealisticBP: 'Please enter realistic blood pressure values',
    pleaseFillAllAppointmentDetails: 'Please fill in all appointment details',
    validationError: 'Validation Error',
    fixDateErrors: 'Please fix the date errors before saving',
    dueDateRequired: 'Due date is required',
    invalidDateFormat: 'Invalid date format',
    dueDateMustBeFuture: 'Due date must be in the future',
    dueDateTooFar: 'Due date is too far in the future (max 10 months)',
    appointmentDateRequired: 'Appointment date is required',
    appointmentDateCannotBePast: 'Appointment date cannot be in the past',
    dueDateSaved: 'Due date saved successfully!',
    weightLogged: 'Weight logged successfully!',
    bpLogged: 'Blood pressure logged successfully!',
    appointmentAdded: 'Appointment added successfully!',
    symptomLogged: 'Symptom logged successfully!',
    light: 'Light',
    moderate: 'Moderate',
    severe: 'Severe',
  },
};

