// Firebase Firestore integration library
// This module provides database operations for the Community Health Platform.
// When Firebase is configured, it uses Firestore. Otherwise, it falls back to in-memory storage.

let db: any = null
let firestoreInitialized = false

// In-memory fallback store when Firebase is not configured
const memoryStore: Record<string, any[]> = {
  bloodDonations: [],
  cleaningDrives: [
    {
      id: "cd_1",
      title: "Community Park Cleanup",
      description: "Join us for a comprehensive cleanup of our local community park.",
      location: "Central Community Park, 123 Park Avenue",
      date: "2026-03-15",
      time: "9:00 AM - 2:00 PM",
      maxParticipants: 25,
      currentParticipants: 12,
      organizer: "Admin User",
      requirements: ["Gloves", "Water bottle", "Comfortable shoes", "Sun hat"],
      status: "upcoming",
      lat: 40.7829,
      lng: -73.9654,
    },
    {
      id: "cd_2",
      title: "Beach Cleanup Drive",
      description: "Help us keep our beaches clean and protect marine life.",
      location: "Sunset Beach, Coastal Road",
      date: "2026-03-22",
      time: "7:00 AM - 12:00 PM",
      maxParticipants: 30,
      currentParticipants: 18,
      organizer: "Environmental Team",
      requirements: ["Gloves", "Reusable bags", "Sunscreen", "Water bottle"],
      status: "upcoming",
      lat: 40.5731,
      lng: -73.9712,
    },
    {
      id: "cd_3",
      title: "Neighborhood Street Cleanup",
      description: "Let's work together to clean up our neighborhood streets.",
      location: "Main Street District",
      date: "2026-04-01",
      time: "10:00 AM - 3:00 PM",
      maxParticipants: 20,
      currentParticipants: 8,
      organizer: "Community Council",
      requirements: ["Gloves", "Trash bags", "Comfortable clothing"],
      status: "upcoming",
      lat: 40.7484,
      lng: -73.9857,
    },
  ],
  driveRegistrations: [],
  forumPosts: [
    {
      id: "fp_1",
      title: "Tips for First-Time Blood Donors",
      content: "I just donated blood for the first time and wanted to share some tips...\n\n1. Stay hydrated before your appointment\n2. Eat a healthy meal beforehand\n3. Wear comfortable clothing with sleeves that roll up\n4. Bring a snack for afterwards\n5. Take it easy for the rest of the day",
      author: "Sarah M.",
      authorId: "user_1",
      category: "blood-donation",
      likes: 24,
      replies: [
        { id: "r1", author: "Mike T.", content: "Great tips! I'd also add to avoid caffeine beforehand.", createdAt: "2026-02-10T14:00:00Z" },
        { id: "r2", author: "Lisa K.", content: "Thanks for sharing! This helped calm my nerves.", createdAt: "2026-02-11T09:30:00Z" },
      ],
      createdAt: "2026-02-10T10:00:00Z",
    },
    {
      id: "fp_2",
      title: "Community Garden Hygiene Best Practices",
      content: "As we start our community garden project, here are some hygiene practices to keep in mind...\n\n- Always wash hands before and after gardening\n- Use clean tools and sanitize shared equipment\n- Wear gloves when handling soil\n- Keep a first aid kit nearby",
      author: "Dr. James P.",
      authorId: "user_2",
      category: "hygiene",
      likes: 18,
      replies: [
        { id: "r3", author: "Anna R.", content: "Very helpful! Should we also wear masks when turning compost?", createdAt: "2026-02-12T11:00:00Z" },
      ],
      createdAt: "2026-02-11T16:00:00Z",
    },
    {
      id: "fp_3",
      title: "Upcoming Beach Cleanup - Volunteers Needed!",
      content: "We're organizing a beach cleanup on March 22nd and need volunteers! We had an amazing turnout last time and made a real difference. Let's do it again!\n\nMeeting point: Sunset Beach parking lot at 7 AM\nWhat to bring: Sunscreen, water, comfortable shoes",
      author: "Environmental Team",
      authorId: "user_3",
      category: "cleaning-drives",
      likes: 31,
      replies: [],
      createdAt: "2026-02-15T08:00:00Z",
    },
  ],
  blogPosts: [
    {
      id: "bp_1",
      title: "The Importance of Regular Blood Donation",
      slug: "importance-of-blood-donation",
      excerpt: "Learn why regular blood donation is crucial for community health and how it benefits both donors and recipients.",
      content: `# The Importance of Regular Blood Donation

Blood donation is one of the most impactful ways you can contribute to your community's health. Every two seconds, someone in the world needs blood.

## Why Donate Blood?

### Save Lives
A single blood donation can save up to three lives. Blood is used in surgeries, cancer treatments, chronic illnesses, and traumatic injuries.

### Health Benefits for Donors
- **Free health screening**: Every donation includes a mini-physical and blood tests
- **Reduced iron stores**: Regular donation helps maintain healthy iron levels
- **Cardiovascular benefits**: Studies suggest regular donors have lower risk of heart disease
- **Psychological well-being**: The satisfaction of helping others boosts mental health

### Community Impact
When enough people donate regularly, blood banks can maintain adequate supplies for emergencies and routine medical procedures.

## Who Can Donate?

Most healthy adults between 18-65 years old who weigh at least 50 kg can donate blood. Some temporary deferrals apply for recent travel, tattoos, or certain medications.

## How Often Can You Donate?

- **Whole blood**: Every 56 days (about 8 weeks)
- **Platelets**: Every 7 days, up to 24 times per year
- **Plasma**: Every 28 days

## Preparing for Your Donation

1. Get a good night's sleep
2. Eat a healthy meal
3. Drink plenty of water
4. Bring a valid ID
5. Wear comfortable clothing

Start your journey as a blood donor today and make a difference in someone's life!`,
      author: "Dr. Emily Chen",
      category: "health",
      tags: ["blood donation", "health", "community"],
      publishedAt: "2026-02-01T10:00:00Z",
      readTime: 5,
      image: "🩸",
    },
    {
      id: "bp_2",
      title: "10 Daily Hygiene Habits That Prevent Disease",
      slug: "daily-hygiene-habits",
      excerpt: "Simple daily habits that can significantly reduce your risk of infections and keep your community healthy.",
      content: `# 10 Daily Hygiene Habits That Prevent Disease

Good hygiene is your first line of defense against illness. Here are ten habits that can make a big difference.

## 1. Wash Your Hands Properly
Spend at least 20 seconds washing with soap and water. Don't forget under your nails and between fingers.

## 2. Brush and Floss Daily
Brush twice a day for two minutes each time. Floss at least once daily to prevent gum disease.

## 3. Shower or Bathe Daily
Regular bathing removes bacteria you pick up throughout the day and prevents skin infections.

## 4. Wear Clean Clothes
Change your clothes daily, especially undergarments and socks. Wash workout clothes after each use.

## 5. Clean High-Touch Surfaces
Regularly disinfect doorknobs, light switches, phone screens, and keyboards.

## 6. Practice Respiratory Hygiene
Cover your mouth when coughing or sneezing. Use tissues and dispose of them properly.

## 7. Keep Your Kitchen Clean
Sanitize countertops, cutting boards, and sponges regularly. Wash dishes promptly.

## 8. Manage Food Safety
Store food at proper temperatures, check expiration dates, and avoid cross-contamination.

## 9. Stay Home When Sick
Prevent spreading illness to others by staying home and resting when you're unwell.

## 10. Get Regular Health Checkups
Prevention is better than cure. Regular checkups catch problems early.

By following these simple habits, you can protect yourself and your community from preventable diseases.`,
      author: "Dr. Sarah Williams",
      category: "hygiene",
      tags: ["hygiene", "prevention", "daily habits"],
      publishedAt: "2026-02-05T14:00:00Z",
      readTime: 4,
      image: "🧼",
    },
    {
      id: "bp_3",
      title: "How Community Cleanups Improve Public Health",
      slug: "community-cleanups-public-health",
      excerpt: "Discover the direct link between clean environments and better community health outcomes.",
      content: `# How Community Cleanups Improve Public Health

Community cleanup drives do more than just beautify our neighborhoods — they have a direct, measurable impact on public health.

## Reducing Disease Vectors

Accumulated trash attracts rodents, mosquitoes, and other pests that carry diseases. By removing waste, we eliminate breeding grounds for disease vectors.

## Cleaner Water Sources

Litter and debris can contaminate local water sources. Regular cleanups prevent pollutants from entering streams, rivers, and groundwater.

## Mental Health Benefits

Studies show that clean, well-maintained environments reduce stress and anxiety. Living in clean neighborhoods is associated with better mental health outcomes.

## Physical Activity

Cleanup events encourage physical activity. Spending a few hours picking up litter, raking, and organizing is great exercise.

## Building Community

Working together on a shared goal strengthens social bonds, which is itself a protective factor for health.

## Air Quality

Removing organic waste reduces methane emissions and improves local air quality.

## How to Organize a Cleanup

1. Choose a location and date
2. Get permits if needed
3. Recruit volunteers through social media
4. Arrange for waste disposal
5. Provide safety equipment
6. Celebrate your success!

Join or organize a cleanup in your area today and be part of the solution!`,
      author: "Community Health Team",
      category: "environment",
      tags: ["cleanup", "environment", "public health"],
      publishedAt: "2026-02-10T09:00:00Z",
      readTime: 4,
      image: "🌿",
    },
    {
      id: "bp_4",
      title: "Mental Health: Why It Matters for Community Wellness",
      slug: "mental-health-community-wellness",
      excerpt: "Understanding the connection between individual mental health and overall community well-being.",
      content: `# Mental Health: Why It Matters for Community Wellness

Mental health is just as important as physical health. A community that prioritizes mental wellness creates a stronger, more resilient society.

## The Mind-Body Connection

Mental health directly affects physical health. Stress, anxiety, and depression can lead to:
- Weakened immune system
- Heart disease
- Digestive problems
- Chronic pain
- Sleep disorders

## Signs You Should Seek Help

- Persistent sadness or anxiety
- Withdrawal from social activities
- Changes in sleep or appetite
- Difficulty concentrating
- Feeling hopeless

## Community Resources

- **Crisis hotlines**: Available 24/7 for immediate support
- **Support groups**: Connect with others facing similar challenges
- **Community centers**: Many offer free counseling services
- **Online resources**: Teletherapy and mental health apps

## How Communities Can Help

1. **Reduce stigma**: Talk openly about mental health
2. **Create safe spaces**: Community centers and support groups
3. **Promote physical activity**: Exercise improves mental health
4. **Foster connection**: Social events and volunteer opportunities
5. **Educate**: Awareness campaigns and workshops

Remember: seeking help is a sign of strength, not weakness. Together, we can build mentally healthier communities.`,
      author: "Dr. Michael Rodriguez",
      category: "mental-health",
      tags: ["mental health", "wellness", "community"],
      publishedAt: "2026-02-14T11:00:00Z",
      readTime: 5,
      image: "🧠",
    },
  ],
  bloodBank: [
    { type: "A+", units: 45, status: "adequate", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "A-", units: 12, status: "low", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "B+", units: 38, status: "adequate", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "B-", units: 8, status: "critical", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "AB+", units: 22, status: "adequate", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "AB-", units: 5, status: "critical", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "O+", units: 52, status: "adequate", lastUpdated: "2026-02-17T08:00:00Z" },
    { type: "O-", units: 15, status: "low", lastUpdated: "2026-02-17T08:00:00Z" },
  ],
  leaderboard: [
    { id: "u1", name: "Sarah M.", points: 850, donations: 5, drives: 8, badges: ["First Donor", "Super Volunteer", "Community Hero"] },
    { id: "u2", name: "Mike T.", points: 720, donations: 4, drives: 6, badges: ["First Donor", "Regular Volunteer"] },
    { id: "u3", name: "Lisa K.", points: 680, donations: 3, drives: 7, badges: ["First Donor", "Eco Warrior"] },
    { id: "u4", name: "Dr. James P.", points: 590, donations: 6, drives: 2, badges: ["Blood Champion", "Mentor"] },
    { id: "u5", name: "Anna R.", points: 450, donations: 2, drives: 5, badges: ["First Donor", "Rising Star"] },
    { id: "u6", name: "Tom W.", points: 380, donations: 1, drives: 4, badges: ["First Donor"] },
    { id: "u7", name: "Emma L.", points: 340, donations: 3, drives: 2, badges: ["First Donor", "Regular Volunteer"] },
    { id: "u8", name: "Chris D.", points: 290, donations: 0, drives: 5, badges: ["Eco Warrior"] },
  ],
  notifications: [],
  healthTrackerData: [],
  userProfiles: [],
}

async function initFirestore() {
  if (firestoreInitialized) return db

  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const hasValidConfig = Object.values(firebaseConfig).every(
      (value) => value && value !== "undefined" && String(value).trim() !== ""
    )

    if (!hasValidConfig) {
      console.log("Firestore: Using in-memory fallback (no Firebase config)")
      firestoreInitialized = true
      return null
    }

    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getFirestore } = await import("firebase/firestore")

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(app)
    firestoreInitialized = true
    return db
  } catch (error) {
    console.error("Failed to initialize Firestore, using in-memory fallback:", error)
    firestoreInitialized = true
    return null
  }
}

export async function getCollection(collectionName: string) {
  const firestore = await initFirestore()
  if (!firestore) {
    return memoryStore[collectionName] || []
  }
  try {
    const { collection, getDocs } = await import("firebase/firestore")
    const snapshot = await getDocs(collection(firestore, collectionName))
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  } catch {
    return memoryStore[collectionName] || []
  }
}

export async function addDocument(collectionName: string, data: any) {
  const firestore = await initFirestore()
  const id = `${collectionName.slice(0, 2)}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  if (!firestore) {
    const doc = { id, ...data }
    if (!memoryStore[collectionName]) memoryStore[collectionName] = []
    memoryStore[collectionName].push(doc)
    return doc
  }
  try {
    const { collection, addDoc } = await import("firebase/firestore")
    const docRef = await addDoc(collection(firestore, collectionName), data)
    return { id: docRef.id, ...data }
  } catch {
    const doc = { id, ...data }
    if (!memoryStore[collectionName]) memoryStore[collectionName] = []
    memoryStore[collectionName].push(doc)
    return doc
  }
}

export async function updateDocument(collectionName: string, docId: string, data: any) {
  const firestore = await initFirestore()
  if (!firestore) {
    const store = memoryStore[collectionName] || []
    const idx = store.findIndex((d: any) => d.id === docId)
    if (idx !== -1) {
      store[idx] = { ...store[idx], ...data }
      return store[idx]
    }
    return null
  }
  try {
    const { doc, updateDoc } = await import("firebase/firestore")
    await updateDoc(doc(firestore, collectionName, docId), data)
    return { id: docId, ...data }
  } catch {
    return null
  }
}

export async function deleteDocument(collectionName: string, docId: string) {
  const firestore = await initFirestore()
  if (!firestore) {
    const store = memoryStore[collectionName] || []
    const idx = store.findIndex((d: any) => d.id === docId)
    if (idx !== -1) store.splice(idx, 1)
    return true
  }
  try {
    const { doc, deleteDoc } = await import("firebase/firestore")
    await deleteDoc(doc(firestore, collectionName, docId))
    return true
  } catch {
    return false
  }
}

export { memoryStore }
