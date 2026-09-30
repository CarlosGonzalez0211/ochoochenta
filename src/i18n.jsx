import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const UBER_URL =
  'https://www.ubereats.com/mx-en/store/ocho80/FP6fW0WzVzSU3Hr3OPXAqg?diningMode=DELIVERY&sc=SEARCH_SUGGESTION'

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ocho 80 Restaurant-Bar')}&query_place_id=ChIJafrQKwBd54YR_Rz1bpTWGHA`

export const CONTACT = {
  instagram: 'ocho80_restaurantbar',
  tiktok: 'ocho__80',
  facebook: 'Ocho 80 Restaurant Bar',
  email: 'laocho80rb@gmail.com',
  phone: '656 859 0210',
  phoneHref: 'tel:+526568590210',
  address: 'Av. Gómez Morín #680, Zaragoza, Ciudad Juárez, México, 32575',
}

// Google Business Profile "Ocho 80 Restaurant-Bar"
export const GOOGLE = {
  placeId: 'ChIJafrQKwBd54YR_Rz1bpTWGHA',
  rating: 4.9,
  count: 44,
  // stars -> number of reviews, as listed on the profile
  breakdown: { 5: 41, 4: 2, 3: 0, 2: 1, 1: 0 },
}
GOOGLE.profileUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ocho 80 Restaurant-Bar')}&query_place_id=${GOOGLE.placeId}`
GOOGLE.writeUrl = `https://search.google.com/local/writereview?placeid=${GOOGLE.placeId}`

const STRINGS = {
  es: {
    decimal: ',',
    nav: { menu: 'Menú', promos: 'Promociones', gallery: 'Galería', reviews: 'Reseñas', visit: 'Visítanos', order: 'Pedir ahora' },
    hero: {
      kicker: 'Restaurant · Bar',
      title: 'Sabor mexicano, buen ambiente.',
      sub: 'Desayunos, antojitos, mariscos, parrilladas y tus bebidas favoritas en Ciudad Juárez.',
      cta: 'Ver el menú',
      reelLabel: 'Video de platillos y bebidas de Ocho 80',
      play: 'Reproducir video',
      pause: 'Pausar video',
      open: 'Abierto ahora',
      reviews: 'opiniones',
    },
    promos: {
      title: 'Promociones',
      sub: 'Los mejores días para venir con tu banda.',
      thu: 'Jueves',
      thuHead: 'Jueves de karaoke',
      thuScript: 'y litros',
      thuFrom: 'A partir de las',
      thuTime: '7:00 P.M.',
      thuPerks: ['Buen ambiente', 'Buena música', 'Y buena compañía'],
      thuLitros: 'Litros en',
      fri: 'Viernes',
      friHead: 'Viernes de',
      friTitle: 'Ladies Night',
      friBig: 'Bebidas gratis',
      friPerks: ['Buen ambiente', 'Comida deliciosa', 'Tus bebidas favoritas'],
      friTerms: '*Aplican términos y condiciones.',
    },
    menu: {
      title: 'Nuestro menú',
      sub: 'Precios en pesos mexicanos (MXN). Los precios del restaurante pueden variar de los de Uber Eats.',
      priceNote:
        'Los precios de este menú son para consumo en el restaurante. En Uber Eats los precios pueden ser distintos.',
      orderCta: 'Pedir por Uber Eats',
      barNote: 'Pregunta en el restaurante por nuestra selección de bar, cocteles y litros.',
    },
    order: {
      title: 'Antes de continuar',
      body: 'Vas a salir de esta página para pedir en Uber Eats. Ahí los precios pueden ser distintos a los del menú del restaurante (Uber Eats puede incluir cargos de servicio y de envío).',
      go: 'Continuar a Uber Eats',
      cancel: 'Volver al menú',
    },
    reviews: {
      title: 'Reseñas',
      sub: 'Lo que nuestros clientes dicen en Google.',
      outOf: 'de 5',
      count: (n) => `${n} ${n === 1 ? 'reseña' : 'reseñas'} en Google`,
      seeAll: 'Ver todas en Google',
      write: 'Escribir una reseña',
      via: 'Reseñas publicadas en Google',
    },
    gallery: { title: 'Sabor y ambiente', sub: 'Un vistazo a lo que te espera en la mesa y en la barra.' },
    visit: {
      title: 'Visítanos',
      addressLabel: 'Dirección',
      directions: 'Cómo llegar',
      contact: 'Contacto',
      social: 'Síguenos',
      emailLabel: 'Correo',
      phoneLabel: 'Teléfono',
      orderTitle: '¿Prefieres en casa?',
      orderBody: 'Pídenos por Uber Eats y recibe tu comida donde estés.',
    },
    footer: { rights: 'Todos los derechos reservados.' },
    marquee: ['Desayunos', 'Mariscos', 'Parrilladas', 'Litros $88.80', 'Jueves de karaoke', 'Viernes de Ladies Night', 'Antojitos mexicanos'],
    eyebrow: { menu: 'Sabor de la casa', promos: 'Esta semana', gallery: 'De la cocina y la barra', reviews: 'Lo que dicen', visit: 'Ciudad Juárez' },
    langLabel: 'Idioma',
    close: 'Cerrar',
  },
  en: {
    decimal: '.',
    nav: { menu: 'Menu', promos: 'Specials', gallery: 'Gallery', reviews: 'Reviews', visit: 'Visit', order: 'Order now' },
    hero: {
      kicker: 'Restaurant · Bar',
      title: 'Mexican flavor, great vibes.',
      sub: 'Breakfast, traditional plates, seafood, grill platters and your favorite drinks in Ciudad Juárez.',
      cta: 'See the menu',
      reelLabel: 'Video of Ocho 80 dishes and drinks',
      play: 'Play video',
      pause: 'Pause video',
      open: 'Open now',
      reviews: 'reviews',
    },
    promos: {
      title: 'Specials',
      sub: 'The best nights to come with your crew.',
      thu: 'Thursday',
      thuHead: 'Karaoke Thursday',
      thuScript: '& liters',
      thuFrom: 'Starting at',
      thuTime: '7:00 P.M.',
      thuPerks: ['Great vibes', 'Great music', 'Great company'],
      thuLitros: 'Liters for',
      fri: 'Friday',
      friHead: 'Friday',
      friTitle: 'Ladies Night',
      friBig: 'Free drinks',
      friPerks: ['Great vibes', 'Delicious food', 'Your favorite drinks'],
      friTerms: '*Terms and conditions apply.',
    },
    menu: {
      title: 'Our menu',
      sub: 'Prices in Mexican pesos (MXN). In-restaurant prices may differ from Uber Eats.',
      priceNote: 'Prices on this menu are for dining in. Uber Eats prices may be different.',
      orderCta: 'Order on Uber Eats',
      barNote: 'Ask at the restaurant about our bar selection, cocktails and liters.',
    },
    order: {
      title: 'Before you continue',
      body: 'You are about to leave this site and order on Uber Eats. Prices there may be different from the restaurant menu (Uber Eats may add service and delivery fees).',
      go: 'Continue to Uber Eats',
      cancel: 'Back to menu',
    },
    reviews: {
      title: 'Reviews',
      sub: 'What our guests say on Google.',
      outOf: 'out of 5',
      count: (n) => `${n} Google ${n === 1 ? 'review' : 'reviews'}`,
      seeAll: 'See all on Google',
      write: 'Write a review',
      via: 'Reviews posted on Google (shown in the original Spanish)',
    },
    gallery: { title: 'Flavor & atmosphere', sub: 'A peek at what is waiting for you at the table and the bar.' },
    visit: {
      title: 'Visit us',
      addressLabel: 'Address',
      directions: 'Get directions',
      contact: 'Contact',
      social: 'Follow us',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      orderTitle: 'Rather stay in?',
      orderBody: 'Order through Uber Eats and get your food wherever you are.',
    },
    footer: { rights: 'All rights reserved.' },
    marquee: ['Breakfast', 'Seafood', 'Grill platters', 'Liters $88.80', 'Karaoke Thursday', 'Ladies Night Friday', 'Mexican classics'],
    eyebrow: { menu: 'House flavors', promos: 'This week', gallery: 'From the kitchen & the bar', reviews: 'What people say', visit: 'Ciudad Juárez' },
    langLabel: 'Language',
    close: 'Close',
  },
}

const Ctx = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('ocho80-lang')
      if (saved === 'es' || saved === 'en') return saved
    } catch {}
    return 'es'
  })
  const [orderOpen, setOrderOpen] = useState(false)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('ocho80-lang', lang)
    } catch {}
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      s: STRINGS[lang],
      tr: (o) => (o ? o[lang] : ''),
      orderOpen,
      openOrder: () => setOrderOpen(true),
      closeOrder: () => setOrderOpen(false),
    }),
    [lang, orderOpen]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
