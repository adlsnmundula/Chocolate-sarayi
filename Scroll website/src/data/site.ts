// Converte "2 500 Kz" em 2500
export const parsePrice = (price: string) => Number(price.replace(/\D/g, ""));

// Formata 2500 como "2 500 Kz"
export const formatKz = (value: number) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`;

// Helper para imagens (Pexels CDN)
export const photo = (id: number, w = 800, h = Math.round(w * 0.75)) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const CONTACT = {
  phone: "+244 923 876 030",
  phoneHref: "tel:+244923876030",
  email: "chocolatsarayiluanda@gmail.com",
  address: "Avenida 21 de Janeiro, Morro Bento",
  city: "Luanda, Angola",
  hours: "06:00 – 22:00",
  mapsQuery: "Avenida 21 de Janeiro, Morro Bento, Luanda, Angola",
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
    "Avenida 21 de Janeiro, Morro Bento, Luanda, Angola"
  )}&output=embed`,
  mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Avenida 21 de Janeiro, Morro Bento, Luanda, Angola"
  )}`,
};

export const MENU_FILTERS = ["Todos", "Chocolates", "Sobremesas", "Bebidas", "Sanduíches"] as const;
export type MenuFilter = (typeof MENU_FILTERS)[number];

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Exclude<MenuFilter, "Todos">;
  image: string;
  /** Imagem de reserva caso o ficheiro principal ainda não exista em public/images/menu/ */
  fallbackImage?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Bolo de Chocolate",
    description: "Fofinho, cremoso e irresistível.",
    price: "2 500 Kz",
    category: "Sobremesas",
    image: photo(3740237),
  },
  {
    id: 2,
    name: "Brownie com Gelado",
    description: "O equilíbrio perfeito.",
    price: "2 800 Kz",
    category: "Sobremesas",
    image: photo(17146248),
  },
  {
    id: 3,
    name: "Crepe de Morango",
    description: "Doce, leve e delicioso.",
    price: "2 500 Kz",
    category: "Sobremesas",
    image: photo(38858020),
  },
  {
    id: 4,
    name: "Waffle Clássico",
    description: "Crocante por fora, macio por dentro.",
    price: "2 800 Kz",
    category: "Sobremesas",
    image: photo(4437920),
  },
  {
    id: 5,
    name: "Milkshake de Chocolate",
    description: "Refrescante e cremoso.",
    price: "2 000 Kz",
    category: "Bebidas",
    image: photo(11512980),
  },
  {
    id: 6,
    name: "Café Expresso",
    description: "Sabor puro.",
    price: "1 200 Kz",
    category: "Bebidas",
    image: photo(28496565),
  },
  {
    id: 7,
    name: "Sanduíche Especial",
    description: "Perfeito para qualquer hora.",
    price: "2 500 Kz",
    category: "Sanduíches",
    image: photo(8979161),
  },
  {
    id: 8,
    name: "Chocolate Quente",
    description: "Aquece o coração.",
    price: "1 800 Kz",
    category: "Bebidas",
    image: photo(34567210),
  },
  {
    id: 9,
    name: "Trufas de Chocolate Negro",
    description: "Intensas, sedosas e artesanais.",
    price: "1 500 Kz",
    category: "Chocolates",
    image: photo(12521142),
  },
  {
    id: 10,
    name: "Caixa de Chocolates Artesanais",
    description: "Uma seleção para oferecer ou saborear.",
    price: "3 500 Kz",
    category: "Chocolates",
    image: photo(37857736),
  },
  {
    id: 11,
    name: "Waffle de Frutas",
    description: "Frutas frescas, gelado e calda de chocolate.",
    price: "3 000 Kz",
    category: "Sobremesas",
    image: photo(17558647),
  },
  {
    id: 12,
    name: "Sanduíche Club com Batata",
    description: "Camadas generosas acompanhadas de batata crocante.",
    price: "3 200 Kz",
    category: "Sanduíches",
    image: photo(36961392),
  },
  {
    id: 13,
    name: "Crepe com Gelado e Caramelo",
    description: "Crepe macio, gelado de baunilha e calda de caramelo.",
    price: "2 800 Kz",
    category: "Sobremesas",
    image: "/images/menu/crepe-gelado-caramelo.jpg",
    fallbackImage: photo(17558647),
  },
  {
    id: 14,
    name: "Mini Waffles de Chocolate",
    description: "Bolinhas de waffle com chocolate e chocolate branco.",
    price: "2 500 Kz",
    category: "Sobremesas",
    image: "/images/menu/mini-waffles-chocolate.jpg",
    fallbackImage: photo(4437920),
  },
  {
    id: 15,
    name: "Panquecas com Calda de Chocolate",
    description: "Panquecas douradas com manteiga e calda de chocolate.",
    price: "2 600 Kz",
    category: "Sobremesas",
    image: "/images/menu/panquecas-chocolate.jpg",
    fallbackImage: photo(4437920),
  },
  {
    id: 16,
    name: "Taça de Gelado com Brownie",
    description: "Brownie em pedaços, gelado e calda de chocolate.",
    price: "3 200 Kz",
    category: "Sobremesas",
    image: "/images/menu/taca-gelado-brownie.jpg",
    fallbackImage: photo(19087694),
  },
  {
    id: 17,
    name: "Crepe Salgado com Chips",
    description: "Crepe recheado, servido com batata chips.",
    price: "2 900 Kz",
    category: "Sanduíches",
    image: "/images/menu/crepe-salgado-chips.jpg",
    fallbackImage: photo(8979161),
  },
  {
    id: 18,
    name: "Cappuccino Decorado",
    description: "Cappuccino cremoso com arte latte.",
    price: "1 500 Kz",
    category: "Bebidas",
    image: "/images/menu/cappuccino.jpg",
    fallbackImage: photo(15801079),
  },
];

// Vídeos verticais (9:16) para o menu em formato TikTok. Os itens sem vídeo usam a fotografia.
export const MENU_VIDEOS: Record<number, string> = {
  1: "https://videos.pexels.com/video-files/14287190/14287190-hd_1080_1920_30fps.mp4",
  2: "https://videos.pexels.com/video-files/31745144/13525410_1080_1920_30fps.mp4",
  3: "https://videos.pexels.com/video-files/34164461/14484025_1080_1920_24fps.mp4",
  4: "https://videos.pexels.com/video-files/9566003/9566003-hd_1080_1920_30fps.mp4",
  5: "https://videos.pexels.com/video-files/30781979/13166830_1080_1920_25fps.mp4",
  6: "https://videos.pexels.com/video-files/31264406/13351827_2160_3840_25fps.mp4",
  8: "https://videos.pexels.com/video-files/6463449/6463449-hd_1080_1920_30fps.mp4",
  11: "https://videos.pexels.com/video-files/36170482/15339279_1080_1920_30fps.mp4",
  13: "https://videos.pexels.com/video-files/35554469/15064646_2160_3840_25fps.mp4",
  15: "https://videos.pexels.com/video-files/39831177/16988588_1080_1920_30fps.mp4",
  16: "https://videos.pexels.com/video-files/12662121/12662121-hd_1080_2048_50fps.mp4",
  18: "https://videos.pexels.com/video-files/13736520/13736520-uhd_2160_3840_24fps.mp4",
};


