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
    video2Title: 'Iron-Rich Foods for Menstrual Health',
    video2Desc: 'Replenish iron lost during your period naturally.',
    video3Title: 'Managing Period Cravings',
    video3Desc: 'Healthy ways to satisfy cravings during your cycle.',
    video4Title: 'Hydration During Menstruation',
    video4Desc: 'Why staying hydrated is crucial during your period.',
    video5Title: 'Foods to Avoid During Your Period',
    video5Desc: 'Foods that may worsen cramps and bloating.',
    video6Title: 'Meal Planning for Your Cycle',
    video6Desc: 'Plan nutritious meals throughout your menstrual cycle.',
    video7Title: 'Supplements for Menstrual Health',
    video7Desc: 'Vitamins and minerals that support menstrual wellness.',
    video8Title: 'Self-Care Practices During Periods',
    video8Desc: 'Holistic self-care tips for your menstrual cycle.',
    video9Title: 'Healthy Snacks for Period Days',
    video9Desc: 'Quick and nutritious snack ideas for your period.',
    video10Title: 'Managing Bloating Through Diet',
    video10Desc: 'Dietary strategies to reduce period bloating.',
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

