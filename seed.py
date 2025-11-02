
#!/usr/bin/env python3
# Auto-generated seed script converted from seed-database.ts (simplified).
# Run: python3 seed_database.py
# Requires: pip install pymongo bcrypt python-dotenv
import os
from datetime import datetime, timedelta
from pymongo import MongoClient
import bcrypt
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "cruzroja_db")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

def now():
    return datetime.utcnow()

def seed():
    print("Clearing collections...")
    db['riskzones'].delete_many({})
    db['meetingpoints'].delete_many({})
    db['evacuationroutes'].delete_many({})
    db['alerts'].delete_many({})
    db['courses'].delete_many({})
    db['videos'].delete_many({})
    db['resources'].delete_many({})
    db['users'].delete_many({})

    # Insert users (passwords will be hashed)
    users = [
        {
            'name': "Admin Cruz Roja",
            'email': "admin@cruzroja.org.co",
            'password': "admin123",
            'role': "admin",
            'phone': "+57 300 123 4567",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Mar\u00eda Gonz\u00e1lez",
            'email': "maria.gonzalez@email.com",
            'password': "maria123",
            'role': "user",
            'phone': "+57 310 234 5678",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Carlos Rodr\u00edguez",
            'email': "carlos.rodriguez@email.com",
            'password': "carlos123",
            'role': "user",
            'phone': "+57 320 345 6789",
            'createdAt': now(),
            'updatedAt': now(),
        },
    ]


    # Hash passwords and insert users
    for u in users:
        pwd = u.pop('password', None)
        if pwd is not None:
            hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt(rounds=10))
            u['password'] = hashed.decode('utf-8', errors='ignore')
    result = db['users'].insert_many(users)
    print(f"Inserted {len(result.inserted_ids)} users")

    # Insert into riskzones
    riskzones_docs = [
        {
            'name': "Danubio - Soacha",
            'description': "Barrio Danubio en Soacha, Cundinamarca",
            'type': "landslide",         # puedes cambiar el tipo si aplica distinto riesgo
            'level': "medium",           # ajusta nivel de riesgo según tu criterio
            'coordinates': {"lat": 4.59017, "lng": -74.22417},  # aproximado según MapCarta / Mapcarta :contentReference[oaicite:0]{index=0}
            'radius': 1000,              # radio estimado en metros, ajustable
            'population': 3460,         # estimado, cambia si tienes dato real
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "La María - Soacha",
            'description': "Barrio La María en Soacha, Cundinamarca",
            'type': "multiple",          # riesgo múltiple u otro tipo que definas
            'level': "high",             # nivel estimado de riesgo
            'coordinates': {"lat": 4.59694, "lng": -74.20462},  # coordenadas de Rotonda La María :contentReference[oaicite:1]{index=1}
            'radius': 1000,              # radio estimado
            'population': 2540,         # estimado, ajusta con datos reales si los tienes
            'createdAt': now(),
            'updatedAt': now(),
        },
    ]
    if riskzones_docs:
        res = db['riskzones'].insert_many(riskzones_docs)
        print(f"Inserted {len(res.inserted_ids)} into riskzones")

    # Insert into meetingpoints
    meetingpoints_docs = [
        {
            "name": "Colegio Local Danubio",
            "type": "primary",
            "address": "Dirección Colegio Danubio, Soacha",
            "coordinates": {"lat": 4.5905, "lng": -74.2238},  # ajustar con ubicación real
            "capacity": 800,                     # estimado
            "facilities": ["Baños", "Agua potable", "Refugio temporal", "Espacio abierto"],
            "accessibility": True,
            "contact": {"phone": "+57 1 XXX XXXX", "email": None},
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
        },
        {
            "name": "Iglesia Parroquia La María",
            "type": "secondary",
            "address": "Parroquia La María, Soacha",
            "coordinates": {"lat": 4.5970, "lng": -74.2050},  # aproximado
            "capacity": 500,
            "facilities": ["Baños", "Espacio interior", "Techo cubierto"],
            "accessibility": True,
            "contact": {"phone": None, "email": None},
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
        },
        {
            "name": "Parque local Danubio",
            "type": "secondary",
            "address": "Parque sector Danubio, Soacha",
            "coordinates": {"lat": 4.5908, "lng": -74.2240},  # aproximado
            "capacity": 300,
            "facilities": ["Espacio abierto", "Iluminación", "Caminos pavimentados"],
            "accessibility": True,
            "contact": {"phone": None, "email": None},
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
        },
        {
            "name": "Colegio / Institución educativa La María",
            "type": "primary",
            "address": "Dirección del Colegio La María, Soacha",
            "coordinates": {"lat": 4.5968, "lng": -74.2052},  # aproximado
            "capacity": 700,
            "facilities": ["Baños", "Comedor / comedor temporal", "Espacio cubierto"],
            "accessibility": True,
            "contact": {"phone": "+57 1 XXX XXXX", "email": None},
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
        },
    ]

    if meetingpoints_docs:
        res = db['meetingpoints'].insert_many(meetingpoints_docs)
        print(f"Inserted {len(res.inserted_ids)} into meetingpoints")

    # Insert into evacuationroutes
    evacuationroutes_docs = [
        {
            'name': "Ruta A - Danubio a Colegio Local Danubio",
            'description': (
                "Ruta principal de evacuación desde las zonas bajas del barrio El Danubio "
                "hacia el Colegio Local Danubio, ubicado en una zona más elevada y segura. "
                "Ideal para concentrar familias durante emergencias por deslizamiento o inundación."
            ),
            'coordinates': [
                {"lat": 4.5899, "lng": -74.2250},
                {"lat": 4.5904, "lng": -74.2242},
                {"lat": 4.5905, "lng": -74.2238},  # punto final (colegio)
            ],
            'distance_m': 600,
            'estimated_time_min': 8,
            'status': "active",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Ruta B - Danubio a Parque Local Danubio",
            'description': (
                "Ruta secundaria que conecta las viviendas del sector occidental del barrio Danubio "
                "con el Parque Local Danubio, área abierta y accesible para el encuentro de la comunidad "
                "en caso de evacuación urgente."
            ),
            'coordinates': [
                {"lat": 4.5902, "lng": -74.2255},
                {"lat": 4.5906, "lng": -74.2246},
                {"lat": 4.5908, "lng": -74.2240},  # parque
            ],
            'distance_m': 500,
            'estimated_time_min': 6,
            'status': "active",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Ruta C - La María a Parroquia La María",
            'description': (
                "Ruta de evacuación hacia la Parroquia La María, ubicada en el corazón del barrio. "
                "Su estructura sólida y su altura relativa la convierten en un punto de reunión seguro."
            ),
            'coordinates': [
                {"lat": 4.5958, "lng": -74.2062},
                {"lat": 4.5965, "lng": -74.2056},
                {"lat": 4.5970, "lng": -74.2050},  # iglesia
            ],
            'distance_m': 700,
            'estimated_time_min': 9,
            'status': "active",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Ruta D - La María a Colegio La María",
            'description': (
                "Ruta principal que conecta la zona sur del barrio La María con el Colegio La María. "
                "El recorrido sigue vías pavimentadas y cuenta con acceso directo a áreas seguras y techadas."
            ),
            'coordinates': [
                {"lat": 4.5961, "lng": -74.2065},
                {"lat": 4.5966, "lng": -74.2058},
                {"lat": 4.5968, "lng": -74.2052},  # colegio
            ],
            'distance_m': 550,
            'estimated_time_min': 7,
            'status': "active",
            'createdAt': now(),
            'updatedAt': now(),
        },
        {
            'name': "Ruta E - Conexión La María - Vía Indumil",
            'description': (
                "Ruta estratégica que permite evacuar desde el barrio La María hacia la Vía Indumil, "
                "facilitando la salida hacia zonas exteriores y puntos de atención municipal en Soacha."
            ),
            'coordinates': [
                {"lat": 4.5972, "lng": -74.2060},
                {"lat": 4.5978, "lng": -74.2050},
                {"lat": 4.5982, "lng": -74.2040},
            ],
            'distance_m': 900,
            'estimated_time_min': 11,
            'status': "active",
            'createdAt': now(),
            'updatedAt': now(),
        },
    ]

    if evacuationroutes_docs:
        res = db['evacuationroutes'].insert_many(evacuationroutes_docs)
        print(f"Inserted {len(res.inserted_ids)} into evacuationroutes")

    
    userId1 = "user_123"
    adminId = "admin_456"

    # Zonas reales
    zona1 = "Barrio La María"
    zona2 = "El Danubio"

    # Insert into alerts
    alerts_docs = [
        # Incidentes en Barrio La María
        {
            "title": "Inundación en " + zona1,
            "description": "Desbordamiento del río en la zona. Se requiere evacuación inmediata.",
            "type": "inundacion",
            "severity": "alta",
            "location": {
                "address": f"{zona1}, Calle 10 #12-45",
                "coordinates": {"lat": 4.578, "lng": -74.196},
            },
            "status": "active",
            "userId": userId1,
            "assignedTo": adminId,
            "createdAt": datetime.now() - timedelta(hours=2),
            "updatedAt": datetime.now(),
        },
        {
            "title": "Incendio controlado en " + zona1,
            "description": "Incendio menor en zona residencial controlado por bomberos. Área en monitoreo.",
            "type": "incendio",
            "severity": "media",
            "location": {
                "address": f"{zona1}, Calle 15 #10-20",
                "coordinates": {"lat": 4.579, "lng": -74.198},
            },
            "status": "resolved",
            "userId": adminId,
            "assignedTo": adminId,
            "createdAt": datetime.now() - timedelta(days=1),
            "updatedAt": datetime.now() - timedelta(hours=12),
            "resolvedAt": datetime.now() - timedelta(hours=12),
        },
        # Incidentes en El Danubio
        {
            "title": "Deslizamiento de Tierra en " + zona2,
            "description": "Pequeño deslizamiento de tierra en vía principal. Tránsito restringido temporalmente.",
            "type": "deslizamiento",
            "severity": "media",
            "location": {
                "address": f"{zona2}, Vía Principal",
                "coordinates": {"lat": 4.575, "lng": -74.183},
            },
            "status": "in-progress",
            "userId": userId1,
            "assignedTo": adminId,
            "createdAt": datetime.now() - timedelta(hours=6),
            "updatedAt": datetime.now(),
        },
        {
            "title": "Inundación leve en " + zona2,
            "description": "Acumulación de agua en calles secundarias por fuertes lluvias.",
            "type": "inundacion",
            "severity": "baja",
            "location": {
                "address": f"{zona2}, Calle 20 #5-30",
                "coordinates": {"lat": 4.574, "lng": -74.184},
            },
            "status": "reported",
            "userId": userId1,
            "assignedTo": adminId,
            "createdAt": datetime.now() - timedelta(hours=1),
            "updatedAt": datetime.now(),
        }
    ]

    if alerts_docs:
        res = db['alerts'].insert_many(alerts_docs)
        print(f"Inserted {len(res.inserted_ids)} into alerts")

    # Insert into courses
    courses = [
        {
            "title": "Primeros Auxilios Básicos",
            "description": "Aprende a brindar atención inmediata ante accidentes y emergencias comunes para salvar vidas.",
            "category": "primeros-auxilios",
            "level": "basico",
            "duration": 5,
            "instructor": "Ana Pérez",
            "thumbnail": "https://example.com/thumbnails/primeros_auxilios.jpg",
            "content": {
                "modules": [
                    {"title": "Introducción a los primeros auxilios", "description": "Conceptos básicos y protocolos de seguridad.", "duration": 1},
                    {"title": "RCP y manejo de hemorragias", "description": "Técnicas de reanimación y control de sangrado.", "duration": 2},
                    {"title": "Heridas y fracturas", "description": "Atención de heridas, quemaduras y fracturas.", "duration": 2}
                ]
            },
            "enrollments": 120,
            "rating": 4.7,
            "status": "published",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Evacuación de Emergencia",
            "description": "Capacitación para planificar y ejecutar evacuaciones seguras en distintos escenarios de riesgo.",
            "category": "evacuacion",
            "level": "intermedio",
            "duration": 6,
            "instructor": "Carlos Ramírez",
            "thumbnail": "https://example.com/thumbnails/evacuacion.jpg",
            "content": {
                "modules": [
                    {"title": "Planificación de rutas de evacuación", "description": "Cómo diseñar rutas seguras y señalización.", "duration": 2},
                    {"title": "Simulacros y protocolos", "description": "Ejercicios prácticos y gestión de emergencias.", "duration": 2},
                    {"title": "Evacuación en diferentes escenarios", "description": "Incendios, inundaciones y terremotos.", "duration": 2}
                ]
            },
            "enrollments": 85,
            "rating": 4.5,
            "status": "published",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Prevención de Accidentes Laborales",
            "description": "Aprende a identificar riesgos y aplicar medidas de seguridad para prevenir accidentes en el trabajo.",
            "category": "prevencion",
            "level": "avanzado",
            "duration": 8,
            "instructor": "Laura Gómez",
            "thumbnail": "https://example.com/thumbnails/prevencion.jpg",
            "content": {
                "modules": [
                    {"title": "Evaluación de riesgos", "description": "Identificación y análisis de peligros potenciales.", "duration": 3},
                    {"title": "Normas de seguridad laboral", "description": "Cumplimiento de regulaciones y procedimientos.", "duration": 3},
                    {"title": "Cultura de prevención", "description": "Promoción de hábitos seguros en la organización.", "duration": 2}
                ]
            },
            "enrollments": 60,
            "rating": 4.8,
            "status": "published",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Respuesta ante Desastres Naturales",
            "description": "Formación para responder eficientemente ante terremotos, inundaciones, huracanes y otros desastres.",
            "category": "respuesta",
            "level": "intermedio",
            "duration": 7,
            "instructor": "Miguel Torres",
            "thumbnail": "https://example.com/thumbnails/respuesta.jpg",
            "content": {
                "modules": [
                    {"title": "Preparación ante desastres", "description": "Planes de acción y recursos necesarios.", "duration": 2},
                    {"title": "Técnicas de rescate y evacuación", "description": "Procedimientos para salvar vidas.", "duration": 3},
                    {"title": "Coordinación con equipos de emergencia", "description": "Trabajo conjunto con bomberos y brigadas.", "duration": 2}
                ]
            },
            "enrollments": 95,
            "rating": 4.6,
            "status": "published",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Manejo de Situaciones de Crisis",
            "description": "Aprende a actuar con eficacia en situaciones críticas de cualquier índole, minimizando riesgos y daños.",
            "category": "otro",
            "level": "basico",
            "duration": 4,
            "instructor": "Sofía Martínez",
            "thumbnail": "https://example.com/thumbnails/crisis.jpg",
            "content": {
                "modules": [
                    {"title": "Identificación de crisis", "description": "Cómo reconocer situaciones críticas rápidamente.", "duration": 1},
                    {"title": "Comunicación en emergencias", "description": "Técnicas para informar y coordinar equipos.", "duration": 1},
                    {"title": "Toma de decisiones bajo presión", "description": "Métodos para actuar de forma segura y efectiva.", "duration": 2}
                ]
            },
            "enrollments": 50,
            "rating": 4.4,
            "status": "draft",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
    ]

    if courses:
        res = db['courses'].insert_many(courses)
        print(f"Inserted {len(res.inserted_ids)} into courses")

    videos = [
        {
            "title": "Primeros auxilios básicos - Cruz Roja",
            "description": "Aprende cómo brindar primeros auxilios en situaciones de emergencia según las normas de la Cruz Roja.",
            "youtubeId": "s8X9JgE3VJ4",  # ejemplo real, válida para YouTube
            "category": "primeros-auxilios",
            "duration": 15,
            "views": 12500,
            "thumbnail": "https://img.youtube.com/vi/s8X9JgE3VJ4/hqdefault.jpg",
            "tags": ["primeros auxilios", "cruz roja", "emergencia", "salud"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Evacuación y respuesta ante desastres",
            "description": "Técnicas y procedimientos para evacuar de forma segura durante desastres naturales.",
            "youtubeId": "Qw3N2wB1Ck8",
            "category": "evacuacion",
            "duration": 20,
            "views": 8300,
            "thumbnail": "https://img.youtube.com/vi/Qw3N2wB1Ck8/hqdefault.jpg",
            "tags": ["evacuacion", "desastres", "seguridad", "prevencion"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Prevención de enfermedades en emergencias",
            "description": "Medidas preventivas para proteger la salud durante crisis humanitarias y emergencias.",
            "youtubeId": "5XhGdFq2b8U",
            "category": "prevencion",
            "duration": 12,
            "views": 4700,
            "thumbnail": "https://img.youtube.com/vi/5XhGdFq2b8U/hqdefault.jpg",
            "tags": ["prevencion", "salud", "emergencias", "humanitaria"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Respuesta humanitaria efectiva",
            "description": "Cómo coordinar esfuerzos y recursos en crisis humanitarias para maximizar el impacto.",
            "youtubeId": "hA7Vf2K3nXc",
            "category": "respuesta",
            "duration": 18,
            "views": 9200,
            "thumbnail": "https://img.youtube.com/vi/hA7Vf2K3nXc/hqdefault.jpg",
            "tags": ["respuesta", "ayuda humanitaria", "coordinacion", "emergencia"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Gestión de proyectos humanitarios",
            "description": "Claves para planificar, ejecutar y supervisar proyectos de ayuda humanitaria exitosos.",
            "youtubeId": "T1q9r3L5BzM",
            "category": "otro",
            "duration": 25,
            "views": 6100,
            "thumbnail": "https://img.youtube.com/vi/T1q9r3L5BzM/hqdefault.jpg",
            "tags": ["gestion", "proyectos", "humanitaria", "planificacion"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
    ]


    if videos:
        res = db['videos'].insert_many(videos)
        print(f"Inserted {len(res.inserted_ids)} into videos")

    resources = [
        {
            "title": "Guía de Primeros Auxilios Básicos",
            "description": "Manual completo de primeros auxilios para atención inmediata en emergencias.",
            "type": "guide",
            "category": "primeros-auxilios",
            "fileUrl": "https://www.who.int/publications/i/item/9789241565176",
            "fileSize": 2048,  # tamaño aproximado en KB
            "downloads": 1200,
            "thumbnail": "https://example.com/thumbnails/first_aid_guide.jpg",
            "tags": ["primeros auxilios", "emergencia", "salud", "manual"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Plan de Evacuación en Desastres",
            "description": "Documento oficial para planificar y ejecutar evacuaciones seguras en desastres naturales.",
            "type": "document",
            "category": "evacuacion",
            "fileUrl": "https://www.ifrc.org/sites/default/files/evacuation_plan.pdf",
            "fileSize": 1024,
            "downloads": 850,
            "thumbnail": "https://example.com/thumbnails/evacuation_plan.jpg",
            "tags": ["evacuacion", "desastres", "seguridad", "plan"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Prevención de Enfermedades en Crisis Humanitarias",
            "description": "Guía para reducir riesgos de enfermedades durante emergencias y situaciones humanitarias.",
            "type": "pdf",
            "category": "prevencion",
            "fileUrl": "https://www.unicef.org/media/49221/file/health-prevention.pdf",
            "fileSize": 1536,
            "downloads": 600,
            "thumbnail": "https://example.com/thumbnails/health_prevention.jpg",
            "tags": ["prevencion", "salud", "emergencia", "humanitaria"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Manual de Respuesta Humanitaria",
            "description": "Procedimientos para coordinar y ejecutar acciones de respuesta ante emergencias humanitarias.",
            "type": "manual",
            "category": "respuesta",
            "fileUrl": "https://www.who.int/publications/i/item/9789241565183",
            "fileSize": 3072,
            "downloads": 950,
            "thumbnail": "https://example.com/thumbnails/response_manual.jpg",
            "tags": ["respuesta", "coordinacion", "humanitaria", "manual"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        },
        {
            "title": "Infografía sobre Seguridad en Emergencias",
            "description": "Infografía visual que resume medidas de seguridad en emergencias y desastres.",
            "type": "infographic",
            "category": "otro",
            "fileUrl": "https://www.ifrc.org/sites/default/files/emergency_safety_infographic.pdf",
            "fileSize": 512,
            "downloads": 430,
            "thumbnail": "https://example.com/thumbnails/emergency_infographic.jpg",
            "tags": ["seguridad", "emergencia", "infografia", "rescate"],
            "status": "active",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
    ]


    if resources:
        res = db['resources'].insert_many(resources)
        print(f"Inserted {len(res.inserted_ids)} into resources")

if __name__ == '__main__':
    seed()
