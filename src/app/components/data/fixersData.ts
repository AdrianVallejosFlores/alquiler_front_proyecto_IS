import { Ubicacion, Fixer } from "../../types";

// 📍 DATOS DE RESPUESTA PARA UBICACIONES
export const ubicacionesRespaldo: Ubicacion[] = [
  {
    id: 1,
    nombre: "Plaza 14 de Septiembre",
    posicion: [-17.394211, -66.156376] as [number, number],
  },
  {
    id: 2,
    nombre: "Cristo de la Concordia",
    posicion: [-17.383807, -66.134948] as [number, number],
  },
  {
    id: 3,
    nombre: "Universidad Mayor de San Simón",
    posicion: [-17.3933727, -66.1449641] as [number, number],
  },
  {
    id: 4,
    nombre: "Plaza Sucre",
    posicion: [-17.39224, -66.14805] as [number, number],
  },
  {
    id: 5,
    nombre: "Estadio Félix Capriles",
    posicion: [-17.379303, -66.16183] as [number, number],
  },
  {
    id: 6,
    nombre: "Terminal de Buses Cochabamba",
    posicion: [-17.3935, -66.1638] as [number, number],
  },
  {
    id: 7,
    nombre: "Sipe Sipe",
    posicion: [-17.453156738905427, -66.35647723119858] as [number, number],
  }
];

// 🔧 DATOS DE RESPUESTA PARA FIXERS - CORREGIDOS
export const fixersRespaldo: Fixer[] = [
  {
    _id: "1",
    nombre: "Juan Pérez",
    posicion: { lat: -17.394211, lng: -66.156376 },
    especialidad: "Plomería, Electricidad",
    descripcion: "Especialista en reparaciones domésticas",
    rating: 4.8,
    verified: true,
    whatsapp: "+59112345678",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "2",
    nombre: "María García",
    posicion: { lat: -17.383807, lng: -66.134948 },
    especialidad: "Carpintería, Pintura",
    descripcion: "Profesional en renovaciones de hogar",
    rating: 4.9,
    verified: true,
    whatsapp: "+59187654321",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "3",
    nombre: "Carlos López",
    posicion: { lat: -17.3933727, lng: -66.1449641 },
    especialidad: "Instalaciones, Gasfitería",
    descripcion: "Técnico certificado en instalaciones",
    rating: 4.7,
    verified: false,
    whatsapp: "+59155556666",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  }
];

// 🧰 DATOS ADICIONALES DE FIXERS PREDEFINIDOS (con _id agregado) - CORREGIDOS
export const fixersDefinidos: Fixer[] = [
  {
    _id: "1",
    nombre: "José Quiroga",
    posicion: { lat: -17.3935, lng: -66.1570 },
    especialidad: "Electricista",
    descripcion: "Instalaciones y reparaciones eléctricas residenciales.",
    rating: 4.6,
    verified: true,
    whatsapp: "",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "2",
    nombre: "Lucía Ramos",
    posicion: { lat: -17.3989, lng: -66.1568 },
    especialidad: "Plomera",
    descripcion: "Reparación de cañerías y sistemas de agua potable.",
    rating: 4.3,
    verified: true,
    whatsapp: "+59171000002",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "3",
    nombre: "Marcos Gonzales",
    posicion: { lat: -17.3892, lng: -66.1575 },
    especialidad: "Carpintero",
    descripcion: "Fabricación y reparación de muebles personalizados.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000003",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "4",
    nombre: "Sandra Molina",
    posicion: { lat: -17.4023, lng: -66.1425 },
    especialidad: "Pintora",
    descripcion: "Decoración y pintura de interiores y exteriores.",
    rating: 4.5,
    verified: true,
    whatsapp: "+59171000004",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "5",
    nombre: "Fernando Paredes",
    posicion: { lat: -17.3910, lng: -66.1450 },
    especialidad: "Gasfitero",
    descripcion: "Instalación y mantenimiento de sistemas de gas domiciliario.",
    rating: 4.2,
    verified: false,
    whatsapp: "+59171000005",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "6",
    nombre: "Roxana López",
    posicion: { lat: -17.3768, lng: -66.1561 },
    especialidad: "Cerrajera",
    descripcion: "Cambio de cerraduras y duplicado de llaves.",
    rating: 4.4,
    verified: true,
    whatsapp: "+59171000006",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "7",
    nombre: "Carlos Rodríguez",
    posicion: { lat: -17.4067, lng: -66.1623 },
    especialidad: "Mecánico",
    descripcion: "Mantenimiento automotriz general y eléctricos.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000007",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "8",
    nombre: "Verónica Vargas",
    posicion: { lat: -17.3825, lng: -66.1662 },
    especialidad: "Costurera",
    descripcion: "Confección y reparación de prendas de vestir.",
    rating: 4.3,
    verified: false,
    whatsapp: "+59171000008",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "9",
    nombre: "Luis Torrico",
    posicion: { lat: -17.4005, lng: -66.1712 },
    especialidad: "Albañil",
    descripcion: "Construcción de muros, pisos y reparaciones generales.",
    rating: 4.5,
    verified: true,
    whatsapp: "+59171000009",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "10",
    nombre: "María Céspedes",
    posicion: { lat: -17.3702, lng: -66.1389 },
    especialidad: "Jardinera",
    descripcion: "Diseño y mantenimiento de jardines.",
    rating: 4.7,
    verified: true,
    whatsapp: "+59171000010",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  // ... (todos los demás fixers, manteniendo la misma estructura)
  {
    _id: "46",
    nombre: "Carla Quispe",
    posicion: { lat: -17.4002, lng: -66.1385 },
    especialidad: "Repostera",
    descripcion: "Tortas y postres personalizados.",
    rating: 4.8,
    verified: true,
    whatsapp: "+59171000046",
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "47", // ✅ CORREGIDO: Cambiado de "4" a "47" para evitar duplicados
    nombre: "Juan Pérez - Electricista",
    posicion: { lat: -17.39224, lng: -66.14805 },
    especialidad: "Electricidad",
    descripcion: "Especialista en instalaciones eléctricas residenciales e industriales",
    rating: 4.8,
    whatsapp: "+59164893768",
    verified: true,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "48", // ✅ CORREGIDO: Cambiado de "5" a "48" para evitar duplicados
    nombre: "María López - Plomera",
    posicion: { lat: -17.394211, lng: -66.156376 },
    especialidad: "Plomería",
    descripcion: "Reparación de tuberías, instalaciones sanitarias y gasfitería",
    rating: 4.6,
    whatsapp: "+59179876543",
    verified: true,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "49", // ✅ CORREGIDO: Cambiado de "6" a "49" para evitar duplicados
    nombre: "Carlos García - Pintor",
    posicion: { lat: -17.3933727, lng: -66.1449641 },
    especialidad: "Pintura",
    descripcion: "Pintura interior y exterior, preparación de superficies, texturizados",
    rating: 4.7,
    whatsapp: "+59177966624",
    verified: true,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "50", // ✅ CORREGIDO: Cambiado de "7" a "50" para evitar duplicados
    nombre: "Ana Torres - Gasista",
    posicion: { lat: -17.3910, lng: -66.1500 },
    especialidad: "Gas",
    descripcion: "Instalación y reparación de sistemas de gas natural y envasado",
    rating: 4.9,
    whatsapp: "+59170234567",
    verified: false,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "51", // ✅ CORREGIDO: Cambiado de "8" a "51" para evitar duplicados
    nombre: "Luis Fernández - Carpintero",
    posicion: { lat: -17.3950, lng: -66.1520 },
    especialidad: "Carpintería",
    descripcion: "Muebles a medida, reparaciones en madera, instalación de closets",
    rating: 4.5,
    whatsapp: "+59170345678",
    verified: true,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "52", // ✅ CORREGIDO: Cambiado de "9" a "52" para evitar duplicados
    nombre: "Roberto Silva - Cerrajero",
    posicion: { lat: -17.3895, lng: -66.1490 },
    especialidad: "Cerrajería",
    descripcion: "Apertura de puertas, cambio de cerraduras, sistemas de seguridad",
    rating: 4.8,
    whatsapp: "+59170456789",
    verified: true,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  },
  {
    _id: "53", // ✅ CORREGIDO: Cambiado de "10" a "53" para evitar duplicados
    nombre: "Sofía Mendoza - Jardinería",
    posicion: { lat: -17.3960, lng: -66.1470 },
    especialidad: "Jardinería",
    descripcion: "Diseño de jardines, poda de árboles, mantenimiento de áreas verdes",
    rating: 4.4,
    whatsapp: "+59170567890",
    verified: false,
    imagenPerfil: "/default-avatar.png" // ✅ AGREGADO
  }
];