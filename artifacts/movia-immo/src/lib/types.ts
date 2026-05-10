export interface Bien {
  id: string;
  titre: string;
  description: string;
  type_bien: 'appartement' | 'villa' | 'riad' | 'maison' | 'terrain' | 'commercial' | 'bureau' | 'studio';
  transaction: 'vente' | 'location';
  prix: number;
  devise: string;
  ville: string;
  commune?: string;
  quartier?: string;
  surface?: number;
  chambres?: number;
  salles_bain?: number;
  caracteristiques?: string[];
  statut: string;
  proprietaire_id?: string;
  date_mise_a_jour?: string;
  created_at?: string;
}

export interface Media {
  id: string;
  bien_id: string;
  url: string;
  type?: string;
}

export interface RadarEntry {
  nom: string;
  telephone: string;
  email: string;
  ville: string;
  type_bien: string;
  transaction: string;
  description: string;
}

export const MOROCCAN_CITIES: Record<string, { communes: string[]; quartiers: Record<string, string[]> }> = {
  Tanger: {
    communes: ['Tanger-Médina', 'Tanger-Assilah', 'Fahs-Anjra'],
    quartiers: {
      'Tanger-Médina': ['Médina', 'Malabata', 'Centre-ville', 'Boukhalef', 'Branes', 'Iberia', 'Mesnana'],
      'Tanger-Assilah': ['Assilah', 'Mdiq'],
      'Fahs-Anjra': ['Fnideq', 'Martil'],
    },
  },
  Casablanca: {
    communes: ['Casablanca-Anfa', 'Aïn Chock', 'Hay Hassani', 'Bernoussi'],
    quartiers: {
      'Casablanca-Anfa': ['Gauthier', 'Maarif', 'Anfa', 'Ain Diab', 'Racine', 'Val Fleuri'],
      'Aïn Chock': ['Sidi Maarouf', 'Hay Mohammadi', 'Ain Chock'],
      'Hay Hassani': ['Hay Hassani', 'Lissasfa', 'Ain Sebaa'],
      'Bernoussi': ['Bernoussi', 'Sidi Bernoussi'],
    },
  },
  Rabat: {
    communes: ['Rabat', 'Salé', 'Témara'],
    quartiers: {
      'Rabat': ['Hay Riad', 'Agdal', 'Hassan', 'Souissi', 'Médina', 'Océan', 'Yacoub El Mansour'],
      'Salé': ['Bettana', 'Tabriquet', 'Laâyoune'],
      'Témara': ['Témara', 'Harhoura'],
    },
  },
  Marrakech: {
    communes: ['Marrakech-Médina', 'Guéliz', 'Ménara'],
    quartiers: {
      'Marrakech-Médina': ['Médina', 'Mouassine', 'Riad Zitoun'],
      'Guéliz': ['Guéliz', 'Hivernage', 'Palmeraie', 'Semlalia'],
      'Ménara': ['Ménara', 'Massira'],
    },
  },
  Fès: {
    communes: ['Fès-Médina', 'Fès-Jdid'],
    quartiers: {
      'Fès-Médina': ['Médina', 'Bab Guissa', 'Andalous'],
      'Fès-Jdid': ['Saïss', 'Route de Sefrou'],
    },
  },
  Agadir: {
    communes: ['Agadir', 'Inzegane'],
    quartiers: {
      'Agadir': ['Centre', 'Talborjt', 'Hay Mohammadi', 'Founty'],
      'Inzegane': ['Inzegane'],
    },
  },
};

export const TYPE_BIEN_LABELS: Record<string, string> = {
  appartement: 'Appartement',
  villa: 'Villa',
  riad: 'Riad',
  maison: 'Maison',
  terrain: 'Terrain',
  commercial: 'Local commercial',
  bureau: 'Bureau',
  studio: 'Studio',
};

export const LANGUAGES = ['FR', 'AR', 'EN', 'ES'] as const;
export type Language = typeof LANGUAGES[number];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  FR: {
    nav_home: 'Accueil',
    nav_catalogue: 'Catalogue',
    nav_publish: 'Publier mon bien',
    hero_title: 'Trouvez votre',
    hero_title2: 'bien idéal au Maroc',
    hero_sub: 'Des milliers de propriétés premium disponibles — vente et location',
    search_placeholder: 'Rechercher par ville, quartier...',
    vente: 'Vente',
    location: 'Location',
    all: 'Tous',
    prestige_section: 'Vente Prestige',
    location_section: 'Location Dynamique',
    cities_section: 'Explorez par Ville',
    cta_view: 'Voir le bien',
    cta_contact: 'Contacter',
    cta_publish: 'Publier chez nous',
    form_name: 'Nom complet',
    form_phone: 'Téléphone',
    form_email: 'Email',
    form_city: 'Ville',
    form_type: 'Type de bien',
    form_transaction: 'Type de transaction',
    form_description: 'Description',
    form_submit: 'Envoyer la demande',
    whatsapp_msg: 'Bonjour, je suis intéressé par le bien',
    filter_type: 'Type de bien',
    filter_city: 'Ville',
    filter_commune: 'Commune',
    filter_quartier: 'Quartier',
    filter_min_prix: 'Prix min',
    filter_max_prix: 'Prix max',
    sort_recent: 'Plus récent',
    sort_price_asc: 'Prix croissant',
    sort_price_desc: 'Prix décroissant',
    sort_area: 'Surface',
    no_results: 'Aucun bien disponible pour le moment',
    listings: 'annonces',
    bedrooms: 'ch.',
    bathrooms: 'sdb.',
    sqm: 'm²',
    for_sale: 'à vendre',
    for_rent: 'à louer',
    install_app: 'Installer Movia App',
    similar: 'Biens similaires',
    characteristics: 'Caractéristiques',
    success_submit: 'Votre demande a été envoyée avec succès !',
  },
  AR: {
    nav_home: 'الرئيسية',
    nav_catalogue: 'الكتالوج',
    nav_publish: 'نشر عقارك',
    hero_title: 'اعثر على',
    hero_title2: 'عقارك المثالي في المغرب',
    hero_sub: 'آلاف العقارات المتميزة — بيعًا وإيجارًا',
    search_placeholder: 'ابحث بالمدينة أو الحي...',
    vente: 'بيع',
    location: 'إيجار',
    all: 'الكل',
    prestige_section: 'بيع فاخر',
    location_section: 'إيجار ديناميكي',
    cities_section: 'استكشف حسب المدينة',
    cta_view: 'عرض العقار',
    cta_contact: 'اتصل',
    cta_publish: 'انشر عندنا',
    form_name: 'الاسم الكامل',
    form_phone: 'الهاتف',
    form_email: 'البريد الإلكتروني',
    form_city: 'المدينة',
    form_type: 'نوع العقار',
    form_transaction: 'نوع المعاملة',
    form_description: 'الوصف',
    form_submit: 'إرسال الطلب',
    whatsapp_msg: 'مرحباً، أنا مهتم بالعقار',
    filter_type: 'نوع العقار',
    filter_city: 'المدينة',
    filter_commune: 'البلدية',
    filter_quartier: 'الحي',
    filter_min_prix: 'الحد الأدنى للسعر',
    filter_max_prix: 'الحد الأقصى للسعر',
    sort_recent: 'الأحدث',
    sort_price_asc: 'السعر تصاعدي',
    sort_price_desc: 'السعر تنازلي',
    sort_area: 'المساحة',
    no_results: 'لا توجد عقارات متاحة حاليًا',
    listings: 'إعلانات',
    bedrooms: 'غرف',
    bathrooms: 'حمام',
    sqm: 'م²',
    for_sale: 'للبيع',
    for_rent: 'للإيجار',
    install_app: 'تثبيت تطبيق موفيا',
    similar: 'عقارات مشابهة',
    characteristics: 'المميزات',
    success_submit: 'تم إرسال طلبك بنجاح!',
  },
  EN: {
    nav_home: 'Home',
    nav_catalogue: 'Catalogue',
    nav_publish: 'List my property',
    hero_title: 'Find your',
    hero_title2: 'ideal property in Morocco',
    hero_sub: 'Thousands of premium properties — for sale and rent',
    search_placeholder: 'Search by city, neighborhood...',
    vente: 'Sale',
    location: 'Rent',
    all: 'All',
    prestige_section: 'Prestige Sales',
    location_section: 'Dynamic Rentals',
    cities_section: 'Explore by City',
    cta_view: 'View property',
    cta_contact: 'Contact',
    cta_publish: 'List with us',
    form_name: 'Full name',
    form_phone: 'Phone',
    form_email: 'Email',
    form_city: 'City',
    form_type: 'Property type',
    form_transaction: 'Transaction type',
    form_description: 'Description',
    form_submit: 'Send request',
    whatsapp_msg: 'Hello, I am interested in property',
    filter_type: 'Property type',
    filter_city: 'City',
    filter_commune: 'Municipality',
    filter_quartier: 'Neighborhood',
    filter_min_prix: 'Min price',
    filter_max_prix: 'Max price',
    sort_recent: 'Most recent',
    sort_price_asc: 'Price ascending',
    sort_price_desc: 'Price descending',
    sort_area: 'Area',
    no_results: 'No properties available at this time',
    listings: 'listings',
    bedrooms: 'bd.',
    bathrooms: 'ba.',
    sqm: 'm²',
    for_sale: 'for sale',
    for_rent: 'for rent',
    install_app: 'Install Movia App',
    similar: 'Similar properties',
    characteristics: 'Features',
    success_submit: 'Your request has been sent successfully!',
  },
  ES: {
    nav_home: 'Inicio',
    nav_catalogue: 'Catálogo',
    nav_publish: 'Publicar mi propiedad',
    hero_title: 'Encuentra tu',
    hero_title2: 'propiedad ideal en Marruecos',
    hero_sub: 'Miles de propiedades premium — venta y alquiler',
    search_placeholder: 'Buscar por ciudad, barrio...',
    vente: 'Venta',
    location: 'Alquiler',
    all: 'Todos',
    prestige_section: 'Venta Prestigio',
    location_section: 'Alquiler Dinámico',
    cities_section: 'Explorar por Ciudad',
    cta_view: 'Ver propiedad',
    cta_contact: 'Contactar',
    cta_publish: 'Publicar con nosotros',
    form_name: 'Nombre completo',
    form_phone: 'Teléfono',
    form_email: 'Correo electrónico',
    form_city: 'Ciudad',
    form_type: 'Tipo de propiedad',
    form_transaction: 'Tipo de transacción',
    form_description: 'Descripción',
    form_submit: 'Enviar solicitud',
    whatsapp_msg: 'Hola, estoy interesado en la propiedad',
    filter_type: 'Tipo de propiedad',
    filter_city: 'Ciudad',
    filter_commune: 'Municipio',
    filter_quartier: 'Barrio',
    filter_min_prix: 'Precio mín',
    filter_max_prix: 'Precio máx',
    sort_recent: 'Más reciente',
    sort_price_asc: 'Precio ascendente',
    sort_price_desc: 'Precio descendente',
    sort_area: 'Superficie',
    no_results: 'No hay propiedades disponibles en este momento',
    listings: 'anuncios',
    bedrooms: 'hab.',
    bathrooms: 'baños',
    sqm: 'm²',
    for_sale: 'en venta',
    for_rent: 'en alquiler',
    install_app: 'Instalar Movia App',
    similar: 'Propiedades similares',
    characteristics: 'Características',
    success_submit: '¡Tu solicitud ha sido enviada con éxito!',
  },
};
