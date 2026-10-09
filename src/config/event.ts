import type { EventConfig } from "@/types/event";

// Edita aquí todos los datos publicados de la invitación.
export const eventConfig: EventConfig = {
  eventType: "birthday",
  title: "EMILIANO ULISES",
  subtitle: "Una misión de risas, juegos y sorpresas.",
  description: "¡El pequeño Emiliano Ulises cumple 4 años y quiere celebrar contigo una aventura llena de diversión, risas y muchas sorpresas!",
  age: 4,
  date: "",
  time: "",
  location: "Cocotitlán, Estado de México",
  address: "Dirección exacta por confirmar",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Cocotitl%C3%A1n%2C+Estado+de+M%C3%A9xico",
  theme: "minions",
  customColors: {
    primary: "#f5c900",
    accent: "#1674b8",
    background: "#fffbea",
    text: "#172b42",
  },
  hostName: "La familia de Emiliano",
  sections: {
    countdown: true,
    story: true,
    details: true,
    gallery: true,
    map: true,
    gifts: false,
    rsvp: true,
    timeline: false,
    music: false,
  },
  story: [
    {
      title: "¡Atención, equipo!",
      body: "El Comandante Emiliano Ulises necesita reunir a todos sus amigos para una misión súper secreta llena de diversión.",
    },
  ],
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
      alt: "Globos de colores para una celebración",
      caption: "Una misión llena de color",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
      alt: "Pastel decorado para una fiesta de cumpleaños",
      caption: "Algo dulce nos espera",
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
      alt: "Luces y ambiente de una fiesta",
      caption: "¡Que comience la aventura!",
    },
  ],
  timeline: [],
  gifts: { title: "Un detalle", message: "Tu compañía es el mejor regalo.", links: [] },
  rsvp: {
    enabled: true,
    phone: "525515333499",
    message: "Hola, confirmo mi asistencia al cumpleaños de Emiliano Ulises.",
  },
  confetti: { enabled: true, count: 48 },
};