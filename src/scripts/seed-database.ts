import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "cruz_roja_db"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Clear existing data
    console.log("🗑️  Clearing existing data...")
    await db.collection("users").deleteMany({})
    await db.collection("alerts").deleteMany({})
    await db.collection("risk_zones").deleteMany({})
    await db.collection("meeting_points").deleteMany({})
    await db.collection("evacuation_routes").deleteMany({})
    await db.collection("courses").deleteMany({})
    await db.collection("videos").deleteMany({})
    await db.collection("resources").deleteMany({})

    // Seed Users
    console.log("👥 Seeding users...")
    const usersResult = await db.collection("users").insertMany([
      {
        name: "Admin Cruz Roja",
        email: "admin@cruzroja.org.co",
        password: "$2a$10$YourHashedPasswordHere", // Password: admin123
        role: "admin",
        phone: "+57 300 123 4567",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "María González",
        email: "maria.gonzalez@email.com",
        password: "$2a$10$YourHashedPasswordHere",
        role: "user",
        phone: "+57 310 234 5678",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@email.com",
        password: "$2a$10$YourHashedPasswordHere",
        role: "user",
        phone: "+57 320 345 6789",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${usersResult.insertedCount} users`)

    const adminId = usersResult.insertedIds[0]
    const userId1 = usersResult.insertedIds[1]

    // Seed Risk Zones
    console.log("🗺️  Seeding risk zones...")
    const riskZonesResult = await db.collection("risk_zones").insertMany([
      {
        name: "Zona Norte - Barrio Popular",
        level: "high",
        type: "flood",
        coordinates: { lat: 4.711, lng: -74.0721 },
        radius: 2000,
        population: 45000,
        incidents: 12,
        description: "Zona propensa a inundaciones durante temporada de lluvias",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: "Zona Centro - Distrito Financiero",
        level: "medium",
        type: "earthquake",
        coordinates: { lat: 4.6097, lng: -74.0817 },
        radius: 1500,
        population: 78000,
        incidents: 7,
        description: "Zona con edificaciones antiguas susceptibles a sismos",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: "Zona Sur - Ladera",
        level: "critical",
        type: "landslide",
        coordinates: { lat: 4.5709, lng: -74.1273 },
        radius: 3000,
        population: 32000,
        incidents: 18,
        description: "Alto riesgo de deslizamientos por pendiente pronunciada",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: "Zona Este - Industrial",
        level: "high",
        type: "fire",
        coordinates: { lat: 4.6486, lng: -74.0536 },
        radius: 2500,
        population: 56000,
        incidents: 15,
        description: "Zona industrial con riesgo de incendios",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: "Zona Oeste - Residencial",
        level: "low",
        type: "multiple",
        coordinates: { lat: 4.6533, lng: -74.1234 },
        radius: 1800,
        population: 42000,
        incidents: 3,
        description: "Zona residencial con bajo nivel de riesgo",
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ])
    console.log(`✅ Created ${riskZonesResult.insertedCount} risk zones`)

    // Seed Meeting Points
    console.log("📍 Seeding meeting points...")
    const meetingPointsResult = await db.collection("meeting_points").insertMany([
      {
        name: "Parque Simón Bolívar",
        type: "primary",
        address: "Calle 63 #68-95, Bogotá",
        coordinates: { lat: 4.657, lng: -74.0918 },
        capacity: 15000,
        facilities: ["Baños", "Agua potable", "Primeros auxilios", "Iluminación"],
        accessibility: true,
        contact: { phone: "+57 1 234 5678", email: "simon.bolivar@cruzroja.org.co" },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Estadio El Campín",
        type: "primary",
        address: "Carrera 30 #57-60, Bogotá",
        coordinates: { lat: 4.6467, lng: -74.0776 },
        capacity: 36000,
        facilities: ["Baños", "Agua potable", "Primeros auxilios", "Cocina", "Refugio"],
        accessibility: true,
        contact: { phone: "+57 1 345 6789", email: "campin@cruzroja.org.co" },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Plaza de Bolívar",
        type: "secondary",
        address: "Carrera 7 #11-10, Bogotá",
        coordinates: { lat: 4.5981, lng: -74.0758 },
        capacity: 5000,
        facilities: ["Baños", "Agua potable", "Primeros auxilios"],
        accessibility: true,
        contact: { phone: "+57 1 456 7890" },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Parque Nacional",
        type: "secondary",
        address: "Carrera 7 #39-43, Bogotá",
        coordinates: { lat: 4.62, lng: -74.065 },
        capacity: 8000,
        facilities: ["Baños", "Agua potable", "Iluminación"],
        accessibility: true,
        contact: { phone: "+57 1 567 8901" },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Centro Comercial Andino",
        type: "emergency",
        address: "Carrera 11 #82-71, Bogotá",
        coordinates: { lat: 4.67, lng: -74.055 },
        capacity: 3000,
        facilities: ["Baños", "Agua potable", "Primeros auxilios", "Seguridad"],
        accessibility: true,
        contact: { phone: "+57 1 678 9012", email: "andino@cruzroja.org.co" },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${meetingPointsResult.insertedCount} meeting points`)

    // Seed Evacuation Routes
    console.log("🛣️  Seeding evacuation routes...")
    const evacuationRoutesResult = await db.collection("evacuation_routes").insertMany([
      {
        name: "Ruta A - Norte a Parque Simón Bolívar",
        description: "Ruta principal de evacuación desde zona norte hacia el refugio del Parque Simón Bolívar",
        coordinates: [
          { lat: 4.711, lng: -74.0721, order: 0 },
          { lat: 4.695, lng: -74.0815, order: 1 },
          { lat: 4.68, lng: -74.0875, order: 2 },
          { lat: 4.657, lng: -74.0918, order: 3 },
        ],
        startPoint: {
          name: "Zona Norte - Barrio Popular",
          lat: 4.711,
          lng: -74.0721,
        },
        endPoint: {
          name: "Parque Simón Bolívar",
          lat: 4.657,
          lng: -74.0918,
        },
        distance: 7500,
        estimatedTime: 90,
        difficulty: "easy",
        status: "active",
        accessibility: true,
        warnings: ["Cruce de avenida principal en punto 2"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ruta B - Centro a Estadio El Campín",
        description: "Ruta de evacuación desde el distrito financiero hacia el Estadio El Campín",
        coordinates: [
          { lat: 4.6097, lng: -74.0817, order: 0 },
          { lat: 4.625, lng: -74.08, order: 1 },
          { lat: 4.64, lng: -74.078, order: 2 },
          { lat: 4.6467, lng: -74.0776, order: 3 },
        ],
        startPoint: {
          name: "Zona Centro - Distrito Financiero",
          lat: 4.6097,
          lng: -74.0817,
        },
        endPoint: {
          name: "Estadio El Campín",
          lat: 4.6467,
          lng: -74.0776,
        },
        distance: 4200,
        estimatedTime: 50,
        difficulty: "easy",
        status: "active",
        accessibility: true,
        warnings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ruta C - Sur (Ladera) a Plaza de Bolívar",
        description: "Ruta de evacuación de emergencia desde zona de ladera hacia centro histórico",
        coordinates: [
          { lat: 4.5709, lng: -74.1273, order: 0 },
          { lat: 4.58, lng: -74.11, order: 1 },
          { lat: 4.59, lng: -74.09, order: 2 },
          { lat: 4.5981, lng: -74.0758, order: 3 },
        ],
        startPoint: {
          name: "Zona Sur - Ladera",
          lat: 4.5709,
          lng: -74.1273,
        },
        endPoint: {
          name: "Plaza de Bolívar",
          lat: 4.5981,
          lng: -74.0758,
        },
        distance: 6800,
        estimatedTime: 120,
        difficulty: "difficult",
        status: "active",
        accessibility: false,
        warnings: ["Pendiente pronunciada", "Terreno irregular", "Posible deslizamiento"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ruta D - Este (Industrial) a Parque Nacional",
        description: "Ruta de evacuación desde zona industrial hacia Parque Nacional",
        coordinates: [
          { lat: 4.6486, lng: -74.0536, order: 0 },
          { lat: 4.64, lng: -74.058, order: 1 },
          { lat: 4.63, lng: -74.062, order: 2 },
          { lat: 4.62, lng: -74.065, order: 3 },
        ],
        startPoint: {
          name: "Zona Este - Industrial",
          lat: 4.6486,
          lng: -74.0536,
        },
        endPoint: {
          name: "Parque Nacional",
          lat: 4.62,
          lng: -74.065,
        },
        distance: 3500,
        estimatedTime: 45,
        difficulty: "moderate",
        status: "active",
        accessibility: true,
        warnings: ["Tráfico vehicular pesado"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ruta E - Oeste a Centro Comercial Andino",
        description: "Ruta alternativa desde zona residencial oeste hacia refugio temporal",
        coordinates: [
          { lat: 4.6533, lng: -74.1234, order: 0 },
          { lat: 4.66, lng: -74.1, order: 1 },
          { lat: 4.665, lng: -74.08, order: 2 },
          { lat: 4.67, lng: -74.055, order: 3 },
        ],
        startPoint: {
          name: "Zona Oeste - Residencial",
          lat: 4.6533,
          lng: -74.1234,
        },
        endPoint: {
          name: "Centro Comercial Andino",
          lat: 4.67,
          lng: -74.055,
        },
        distance: 8200,
        estimatedTime: 100,
        difficulty: "moderate",
        status: "active",
        accessibility: true,
        warnings: ["Ruta larga", "Múltiples cruces"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ruta F - Emergencia Rápida Centro",
        description: "Ruta de evacuación rápida para emergencias críticas en el centro",
        coordinates: [
          { lat: 4.6097, lng: -74.0817, order: 0 },
          { lat: 4.605, lng: -74.078, order: 1 },
          { lat: 4.5981, lng: -74.0758, order: 2 },
        ],
        startPoint: {
          name: "Distrito Financiero",
          lat: 4.6097,
          lng: -74.0817,
        },
        endPoint: {
          name: "Plaza de Bolívar",
          lat: 4.5981,
          lng: -74.0758,
        },
        distance: 1800,
        estimatedTime: 20,
        difficulty: "easy",
        status: "active",
        accessibility: true,
        warnings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${evacuationRoutesResult.insertedCount} evacuation routes`)

    // Seed Alerts
    console.log("🚨 Seeding alerts...")
    const alertsResult = await db.collection("alerts").insertMany([
      {
        title: "Inundación en Zona Norte",
        description: "Desbordamiento del río en el barrio Popular. Se requiere evacuación inmediata.",
        type: "inundacion",
        severity: "alta",
        location: {
          address: "Barrio Popular, Calle 80 #10-20",
          coordinates: { lat: 4.711, lng: -74.0721 },
        },
        status: "active",
        userId: userId1,
        assignedTo: adminId,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Incendio Forestal Controlado",
        description: "Incendio en zona boscosa fue controlado por bomberos. Área en monitoreo.",
        type: "incendio",
        severity: "media",
        location: {
          address: "Cerros Orientales, Sector La Calera",
          coordinates: { lat: 4.72, lng: -73.98 },
        },
        status: "resolved",
        userId: adminId,
        assignedTo: adminId,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        title: "Deslizamiento de Tierra",
        description: "Deslizamiento menor en zona sur. Vía cerrada temporalmente.",
        type: "deslizamiento",
        severity: "media",
        location: {
          address: "Vía al Llano, Km 15",
          coordinates: { lat: 4.5709, lng: -74.1273 },
        },
        status: "in-progress",
        userId: userId1,
        assignedTo: adminId,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${alertsResult.insertedCount} alerts`)

    // Seed Courses
    console.log("📚 Seeding courses...")
    const coursesResult = await db.collection("courses").insertMany([
      {
        title: "Primeros Auxilios Básicos",
        description: "Aprende las técnicas fundamentales de primeros auxilios para responder ante emergencias comunes.",
        category: "primeros-auxilios",
        level: "basico",
        duration: 8,
        instructor: "Dr. Juan Pérez",
        thumbnail: "/first-aid-training.jpg",
        content: {
          modules: [
            { title: "Evaluación de la escena", description: "Cómo evaluar la seguridad", duration: 1 },
            { title: "RCP básico", description: "Reanimación cardiopulmonar", duration: 2 },
            { title: "Control de hemorragias", description: "Técnicas de control", duration: 2 },
            { title: "Vendajes y férulas", description: "Inmovilización básica", duration: 2 },
            { title: "Práctica final", description: "Simulacro práctico", duration: 1 },
          ],
        },
        enrollments: 1247,
        rating: 4.8,
        status: "published",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Evacuación y Rescate",
        description: "Protocolos de evacuación en diferentes tipos de emergencias y técnicas de rescate básico.",
        category: "evacuacion",
        level: "intermedio",
        duration: 12,
        instructor: "Ing. Ana Martínez",
        thumbnail: "/evacuation-training.jpg",
        content: {
          modules: [
            { title: "Planificación de evacuación", description: "Diseño de rutas", duration: 2 },
            { title: "Evacuación en incendios", description: "Protocolos específicos", duration: 3 },
            { title: "Evacuación en inundaciones", description: "Técnicas de rescate", duration: 3 },
            { title: "Puntos de encuentro", description: "Gestión de refugios", duration: 2 },
            { title: "Simulacro completo", description: "Práctica integral", duration: 2 },
          ],
        },
        enrollments: 856,
        rating: 4.6,
        status: "published",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "RCP Avanzado y DEA",
        description: "Técnicas avanzadas de reanimación cardiopulmonar y uso de desfibrilador externo automático.",
        category: "primeros-auxilios",
        level: "avanzado",
        duration: 16,
        instructor: "Dra. Laura Gómez",
        thumbnail: "/cpr-training.jpg",
        content: {
          modules: [
            { title: "RCP en adultos", description: "Técnicas avanzadas", duration: 4 },
            { title: "RCP pediátrico", description: "Niños y bebés", duration: 4 },
            { title: "Uso del DEA", description: "Desfibrilador automático", duration: 3 },
            { title: "Manejo de vía aérea", description: "Técnicas avanzadas", duration: 3 },
            { title: "Certificación práctica", description: "Examen final", duration: 2 },
          ],
        },
        enrollments: 543,
        rating: 4.9,
        status: "published",
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Gestión de Crisis y Emergencias",
        description: "Coordinación y liderazgo en situaciones de emergencia a gran escala.",
        category: "respuesta",
        level: "avanzado",
        duration: 20,
        instructor: "Cnel. Roberto Silva",
        thumbnail: "/crisis-management.jpg",
        content: {
          modules: [
            { title: "Sistemas de comando", description: "Estructura organizacional", duration: 4 },
            { title: "Comunicación en crisis", description: "Protocolos de comunicación", duration: 3 },
            { title: "Logística de emergencia", description: "Gestión de recursos", duration: 4 },
            { title: "Coordinación interinstitucional", description: "Trabajo en equipo", duration: 4 },
            { title: "Casos de estudio", description: "Análisis de emergencias reales", duration: 5 },
          ],
        },
        enrollments: 312,
        rating: 4.7,
        status: "published",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Prevención de Incendios",
        description: "Identificación de riesgos, prevención y respuesta inicial ante incendios.",
        category: "prevencion",
        level: "basico",
        duration: 6,
        instructor: "Bombero Carlos Ruiz",
        thumbnail: "/fire-prevention.jpg",
        content: {
          modules: [
            { title: "Triángulo del fuego", description: "Fundamentos de combustión", duration: 1 },
            { title: "Tipos de extintores", description: "Clasificación y uso", duration: 2 },
            { title: "Rutas de evacuación", description: "Diseño y señalización", duration: 1 },
            { title: "Práctica con extintores", description: "Simulacro práctico", duration: 2 },
          ],
        },
        enrollments: 1089,
        rating: 4.5,
        status: "published",
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${coursesResult.insertedCount} courses`)

    // Seed Videos
    console.log("🎥 Seeding videos...")
    const videosResult = await db.collection("videos").insertMany([
      {
        title: "Cómo realizar RCP correctamente",
        description: "Tutorial paso a paso de reanimación cardiopulmonar en adultos",
        youtubeId: "dQw4w9WgXcQ",
        category: "primeros-auxilios",
        duration: 480,
        views: 15234,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["RCP", "primeros auxilios", "emergencias", "reanimación"],
        status: "active",
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Qué hacer en caso de terremoto",
        description: "Protocolo de seguridad durante y después de un sismo",
        youtubeId: "dQw4w9WgXcQ",
        category: "prevencion",
        duration: 360,
        views: 23456,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["terremoto", "sismo", "prevención", "seguridad"],
        status: "active",
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Evacuación segura en incendios",
        description: "Cómo evacuar un edificio durante un incendio de forma segura",
        youtubeId: "dQw4w9WgXcQ",
        category: "evacuacion",
        duration: 420,
        views: 18765,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["incendio", "evacuación", "seguridad", "emergencia"],
        status: "active",
        createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Primeros auxilios para quemaduras",
        description: "Tratamiento inicial de quemaduras de diferentes grados",
        youtubeId: "dQw4w9WgXcQ",
        category: "primeros-auxilios",
        duration: 300,
        views: 12890,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["quemaduras", "primeros auxilios", "tratamiento"],
        status: "active",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Maniobra de Heimlich",
        description: "Cómo actuar ante un atragantamiento",
        youtubeId: "dQw4w9WgXcQ",
        category: "primeros-auxilios",
        duration: 240,
        views: 20123,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["atragantamiento", "Heimlich", "primeros auxilios"],
        status: "active",
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Preparación de kit de emergencia",
        description: "Elementos esenciales para tu kit de emergencia familiar",
        youtubeId: "dQw4w9WgXcQ",
        category: "prevencion",
        duration: 540,
        views: 16543,
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        tags: ["kit de emergencia", "preparación", "prevención"],
        status: "active",
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${videosResult.insertedCount} videos`)

    // Seed Resources
    console.log("📄 Seeding resources...")
    const resourcesResult = await db.collection("resources").insertMany([
      {
        title: "Manual de Primeros Auxilios",
        description: "Guía completa de primeros auxilios con ilustraciones y procedimientos detallados",
        type: "manual",
        category: "primeros-auxilios",
        fileUrl: "/resources/manual-primeros-auxilios.pdf",
        fileSize: 5242880,
        downloads: 3456,
        thumbnail: "/first-aid-training.jpg",
        tags: ["manual", "primeros auxilios", "guía", "procedimientos"],
        status: "active",
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Protocolo de Evacuación",
        description: "Documento oficial con protocolos de evacuación para diferentes tipos de emergencias",
        type: "document",
        category: "evacuacion",
        fileUrl: "/resources/protocolo-evacuacion.pdf",
        fileSize: 2097152,
        downloads: 2789,
        thumbnail: "/evacuation-training.jpg",
        tags: ["protocolo", "evacuación", "emergencias"],
        status: "active",
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Infografía: Qué hacer en un terremoto",
        description: "Guía visual rápida de acciones durante un sismo",
        type: "infographic",
        category: "prevencion",
        fileUrl: "/resources/infografia-terremoto.pdf",
        fileSize: 1048576,
        downloads: 5678,
        tags: ["infografía", "terremoto", "prevención", "visual"],
        status: "active",
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Guía de Prevención de Incendios",
        description: "Manual de prevención y respuesta ante incendios en el hogar y trabajo",
        type: "guide",
        category: "prevencion",
        fileUrl: "/resources/guia-incendios.pdf",
        fileSize: 3145728,
        downloads: 2345,
        tags: ["guía", "incendios", "prevención", "seguridad"],
        status: "active",
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        title: "Lista de Verificación de Emergencias",
        description: "Checklist para preparación familiar ante emergencias",
        type: "document",
        category: "prevencion",
        fileUrl: "/resources/checklist-emergencias.pdf",
        fileSize: 524288,
        downloads: 4123,
        tags: ["checklist", "preparación", "familia", "emergencias"],
        status: "active",
        createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ])
    console.log(`✅ Created ${resourcesResult.insertedCount} resources`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Users: ${usersResult.insertedCount}`)
    console.log(`   Risk Zones: ${riskZonesResult.insertedCount}`)
    console.log(`   Meeting Points: ${meetingPointsResult.insertedCount}`)
    console.log(`   Evacuation Routes: ${evacuationRoutesResult.insertedCount}`)
    console.log(`   Alerts: ${alertsResult.insertedCount}`)
    console.log(`   Courses: ${coursesResult.insertedCount}`)
    console.log(`   Videos: ${videosResult.insertedCount}`)
    console.log(`   Resources: ${resourcesResult.insertedCount}`)
    console.log("\n✅ You can now use the application with test data!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  } finally {
    await client.close()
    console.log("\n👋 Disconnected from MongoDB")
  }
}

seedDatabase()
