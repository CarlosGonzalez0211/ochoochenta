// Prices are in MXN and mirror the printed Ocho 80 menu.
// Every text field is { es, en }. `p` is a number, or `v` is a list of { l: label, p: price }.
const t = (es, en = es) => ({ es, en })

export const TABS = [
  { id: 'desayunos', label: t('Desayunos', 'Breakfast') },
  { id: 'entradas', label: t('Entradas', 'Starters') },
  { id: 'comidas', label: t('Comidas', 'Mains') },
  { id: 'mariscos', label: t('Mariscos', 'Seafood') },
  { id: 'parrilla', label: t('Parrilla', 'Grill') },
  { id: 'bebidas', label: t('Bebidas', 'Drinks') },
  { id: 'postres', label: t('Postres', 'Desserts') },
]

export const MENU = {
  desayunos: {
    image: 'enchiladas',
    sections: [
      {
        title: t('Desayunos', 'Breakfast'),
        items: [
          {
            n: t('Huevos al gusto', 'Eggs your way'),
            d: t(
              '2 huevos y 2 ingredientes a elegir: tocino, jamón, chorizo, nopales, a la mexicana, en salsa verde, salsa ranchera, espinacas, champiñones. Revueltos, estrellados o en omelette.',
              '2 eggs and 2 ingredients of your choice: bacon, ham, chorizo, cactus, a la mexicana, in green salsa, ranchera salsa, spinach, mushrooms. Scrambled, fried or as an omelette.'
            ),
            p: 148.8,
          },
          { n: t('Ropa vieja'), d: t('Huevo revuelto con deshebrada a la mexicana.', 'Scrambled eggs with shredded beef a la mexicana.'), p: 168.8 },
          { n: t('Huevos rancheros'), d: t('2 huevos estrellados sobre dos tortillas bañados en salsa ranchera, con frijoles y guisado.', '2 fried eggs on two tortillas covered in ranchera salsa, with beans and a stew of your choice.'), p: 148.8 },
          { n: t('Huevos divorciados'), d: t('Huevos estrellados sobre tortilla frita, bañados en salsa ranchera y salsa verde.', 'Fried eggs on crispy tortillas, one side ranchera salsa, the other green salsa.'), p: 148.8 },
          { n: t('Huevos sincronizados'), d: t('2 huevos estrellados sobre una quesadilla con jamón y salsa ranchera.', '2 fried eggs on a ham quesadilla with ranchera salsa.'), p: 158.8 },
        ],
      },
      {
        title: t('Guisados a elegir', 'Stews to choose from'),
        box: t(
          'Bistec en salsa verde · Asado de puerco en rojo · Chicharrón prensado · Chicharrón pella · Deshebrada en rojo · Deshebrada a la mexicana · Chile pasado con carne de puerco · Papas a la mexicana · Rajas con queso',
          'Steak in green salsa · Pork in red chile · Pressed pork rind · Soft pork rind · Shredded beef in red salsa · Shredded beef a la mexicana · Dried chile with pork · Potatoes a la mexicana · Poblano strips with cheese'
        ),
      },
      {
        title: t('Chilaquiles'),
        items: [
          {
            n: t('Chilaquiles', 'Chilaquiles'),
            d: t('En salsa roja o verde, con cebolla morada y crema.', 'In red or green salsa, with red onion and cream.'),
            v: [
              { l: t('Sencillos', 'Plain'), p: 128.8 },
              { l: t('Con huevo al gusto', 'With eggs'), p: 158.8 },
              { l: t('Con pollo o bistec', 'With chicken or steak'), p: 178.8 },
              { l: t('Con pollo o bistec y 2 huevos', 'With chicken or steak and 2 eggs'), p: 198.8 },
            ],
          },
        ],
      },
      {
        title: t('Más desayunos', 'More breakfasts'),
        items: [
          { n: t('Desayuno Deluxe'), d: t('Huevos al gusto, dos rebanadas de jamón, 2 piezas de pan tostado con mantequilla y frijoles. No incluye guisado.', 'Eggs your way, two slices of ham, 2 pieces of buttered toast and beans. Stew not included.'), p: 148.8 },
          { n: t('Desayuno Jr'), d: t('Huevo al gusto, 3 mini hot cakes, papas fritas y salchicha frita. No incluye guisado.', 'Egg your way, 3 mini hot cakes, french fries and fried sausage. Stew not included.'), p: 148.8 },
          { n: t('Desayuno Costeño'), d: t('Huevos estrellados sobre tortilla frita con camarones en salsa chipotle y frijoles. No incluye guisado.', 'Fried eggs on crispy tortilla with shrimp in chipotle sauce and beans. Stew not included.'), p: 168.8 },
          { n: t('Desayuno Norteño'), d: t('Huevos estrellados en tortilla frita con salsa de costilla y frijoles. No incluye guisado.', 'Fried eggs on crispy tortilla with rib salsa and beans. Stew not included.'), p: 168.8 },
          { n: t('Hot cakes'), d: t('3 piezas acompañadas de 2 rebanadas de jamón o tocino frito.', '3 pancakes with 2 slices of fried ham or bacon.'), p: 148.8 },
          { n: t('Molletes'), d: t('Sencillos, 4 piezas. Ingrediente extra por $30: jamón, chorizo o tocino.', 'Plain, 4 pieces. Extra ingredient for $30: ham, chorizo or bacon.'), p: 108.8 },
        ],
      },
    ],
  },

  entradas: {
    image: 'coctel',
    sections: [
      {
        title: t('Entradas', 'Starters'),
        items: [
          { n: t('Nachos con deshebrada', 'Nachos with shredded beef'), d: t('Queso tipo cheddar, frijoles, chiles en vinagre y 150 gr de brisket deshebrado.', 'Cheddar-style cheese, beans, pickled chiles and 150 g of shredded brisket.'), p: 198.8 },
          { n: t('Nachos Ocho 80'), d: t('Queso, frijoles, crema, pico de gallo, sirloin o pastor.', 'Cheese, beans, cream, pico de gallo, sirloin or al pastor.'), p: 228.8 },
          { n: t('Alitas o boneless', 'Wings or boneless'), d: t('7 piezas bañadas en tu salsa: BBQ, búfalo, mango habanero, pimienta limón o naturales.', '7 pieces tossed in your choice of sauce: BBQ, buffalo, mango habanero, lemon pepper or plain.'), p: 198.8 },
          { n: t('Ensalada de pechuga a la parrilla', 'Grilled chicken salad'), p: 198.8 },
          { n: t('Queso fundido', 'Melted cheese'), d: t('Con chorizo, champiñones, rajas o natural.', 'With chorizo, mushrooms, poblano strips, or plain.'), p: 148.8 },
          { n: t('Coctel de camarones', 'Shrimp cocktail'), v: [{ l: t('Mediano', 'Medium'), p: 138.8 }, { l: t('Grande', 'Large'), p: 168.8 }] },
          { n: t('Gringas'), d: t('Tortillas de harina con pastor y queso.', 'Flour tortillas with al pastor and cheese.'), p: 148.8 },
        ],
      },
      {
        title: t('Quesadillas y más', 'Quesadillas & more'),
        compact: true,
        items: [
          { n: t('Quesadilla sencilla', 'Plain quesadilla'), p: 88.8 },
          { n: t('Quesadilla de sirloin', 'Sirloin quesadilla'), p: 168.8 },
          { n: t('Carne seca preparada', 'Prepared dried beef'), p: 88.8 },
        ],
      },
    ],
  },

  comidas: {
    image: 'fajitas',
    sections: [
      {
        title: t('Comidas', 'Mains'),
        items: [
          { n: t('Milanesa de res o pollo', 'Breaded beef or chicken cutlet'), d: t('200 gr de bistec o pechuga empanizada + 2 guarniciones.', '200 g of breaded steak or chicken breast + 2 sides.'), p: 178.8 },
          { n: t('Bistec a la plancha o a la mexicana', 'Griddled steak or a la mexicana'), d: t('200 gr de bistec sazonado a la plancha + 2 guarniciones.', '200 g of seasoned griddled steak + 2 sides.'), p: 178.8 },
          { n: t('Platillo Mexicano', 'Mexican platter'), d: t('1 chile relleno, 1 enchilada verde de pollo, 1 enchilada roja de queso, 1 taco de deshebrada, 1 flauta de pollo, arroz y frijoles refritos.', '1 stuffed chile, 1 green chicken enchilada, 1 red cheese enchilada, 1 shredded beef taco, 1 chicken flauta, rice and refried beans.'), p: 178.8 },
          { n: t('Platillo Tampiqueño', 'Tampiqueño platter'), d: t('150 gr de bistec a la plancha con cebolla caramelizada, 1 enchilada roja o verde, 1 guisado a elegir, guacamole a la mexicana y frijoles refritos.', '150 g griddled steak with caramelized onion, 1 red or green enchilada, 1 stew of your choice, guacamole a la mexicana and refried beans.'), p: 228.8 },
        ],
      },
      {
        title: t('Antojitos', 'Traditional plates'),
        compact: true,
        items: [
          { n: t('Enchiladas verdes o rojas de pollo o queso', 'Green or red enchiladas, chicken or cheese'), p: 158.8 },
          { n: t('Chiles rellenos, 2 piezas', 'Stuffed chiles, 2 pieces'), p: 158.8 },
          { n: t('Fajitas de res, pollo o mixtas a la mexicana', 'Beef, chicken or mixed fajitas a la mexicana'), p: 178.8 },
          { n: t('Tacos dorados de res o pollo, 4 piezas', 'Crispy beef or chicken tacos, 4 pieces'), p: 158.8 },
          { n: t('Flautas de res o pollo, 4 piezas', 'Beef or chicken flautas, 4 pieces'), p: 148.8 },
        ],
      },
      {
        title: t('Guarniciones a elegir', 'Sides to choose from'),
        box: t('Arroz · Espagueti · Frijoles · Papas a la francesa', 'Rice · Spaghetti · Beans · French fries'),
      },
    ],
  },

  mariscos: {
    image: 'molcajete',
    sections: [
      {
        title: t('Mariscos', 'Seafood'),
        items: [
          { n: t('Filete de pescado', 'Fish fillet'), d: t('Al mojo de ajo, a la plancha o empanizado. Se sirve con arroz, papas fritas y ensalada.', 'Garlic butter, griddled or breaded. Served with rice, french fries and salad.'), p: 178.8 },
          { n: t('Camarones', 'Shrimp'), d: t('En salsa chipotle, empanizados, fiesta, al mojo de ajo y/o culichis. 8 piezas con pan con mantequilla.', 'Chipotle sauce, breaded, fiesta, garlic butter and/or culichi. 8 pieces with buttered bread.'), p: 248.8 },
          { n: t('Tacos Gobernador, 3 piezas', 'Gobernador tacos, 3 pieces'), p: 178.8 },
          { n: t('Tacos de pescado capeado, 3 piezas', 'Battered fish tacos, 3 pieces'), p: 168.8 },
        ],
      },
      {
        title: t('Tostadas', 'Tostadas'),
        items: [
          {
            n: t('Tostadas', 'Tostadas'),
            v: [
              { l: t('Ceviche de pescado', 'Fish ceviche'), p: 78.8 },
              { l: t('Ceviche de camarón', 'Shrimp ceviche'), p: 88.8 },
              { l: t('Aguachiles verdes o rojos', 'Green or red aguachiles'), p: 138.8 },
              { l: t('Tostada de atún fresco con mango', 'Fresh tuna tostada with mango'), p: 138.8 },
            ],
          },
        ],
      },
      {
        title: t('Del molcajete', 'From the molcajete'),
        compact: true,
        items: [
          { n: t('Tosticeviche'), p: 128.8 },
          { n: t('Aguachiles verdes o rojos', 'Green or red aguachiles'), p: 248.8 },
          { n: t('Extra de camarón', 'Extra shrimp'), p: 78.8 },
        ],
      },
    ],
  },

  parrilla: {
    image: 'parrillada',
    sections: [
      {
        title: t('Parrilladas para 2 personas', 'Grill platters for 2'),
        note: t('Todas acompañadas de 2 papas asadas, chiles toreados, cebollita asada y aguacate.', 'All served with 2 baked potatoes, blistered chiles, grilled spring onions and avocado.'),
        items: [
          { n: t('Parrillada de sirloin', 'Sirloin platter'), d: t('500 gr de sirloin', '500 g of sirloin'), p: 398.8 },
          { n: t('Parrillada de carne al pastor', 'Al pastor platter'), d: t('500 gr de pastor', '500 g of al pastor'), p: 398.8 },
          { n: t('Parrillada mar y tierra', 'Surf & turf platter'), d: t('250 gr de camarón y 250 gr de bistec', '250 g of shrimp and 250 g of steak'), p: 398.8 },
        ],
      },
      {
        title: t('Cortes', 'Steaks'),
        items: [
          { n: t('T-Bone'), d: t('350 gr a las brasas, con papa asada, chile toreado y cebollita.', '350 g charcoal-grilled, with baked potato, blistered chile and grilled spring onion.'), p: 380.8 },
          { n: t('Rib Eye'), d: t('350 gr a las brasas, con papa asada, chile toreado y cebollita.', '350 g charcoal-grilled, with baked potato, blistered chile and grilled spring onion.'), p: 438.8 },
        ],
      },
      {
        title: t('Tacos'),
        compact: true,
        items: [
          { n: t('Tacos de alambre', 'Alambre tacos'), p: 218.8 },
          { n: t('Tacos de sirloin', 'Sirloin tacos'), p: 228.8 },
          { n: t('Tacos de pastor', 'Al pastor tacos'), p: 198.8 },
        ],
      },
      {
        title: t('Caldos', 'Soups'),
        compact: true,
        items: [
          { n: t('Caldo de res', 'Beef soup'), p: 178.8 },
          { n: t('Caldo ranchero', 'Ranchero soup'), p: 178.8 },
          { n: t('Caldo cantinero', 'Cantinero soup'), p: 178.8 },
        ],
      },
      {
        title: t('Extras'),
        compact: true,
        items: [
          { n: t('Guisado', 'Stew'), p: 68.8 },
          { n: t('Papa asada (mantequilla y queso)', 'Baked potato (butter and cheese)'), p: 78.8 },
          { n: t('Papa asada con pastor', 'Baked potato with al pastor'), p: 98.8 },
          { n: t('Papa asada con sirloin', 'Baked potato with sirloin'), p: 98.8 },
          { n: t('Chiles toreados, 5 piezas', 'Blistered chiles, 5 pieces'), p: 48.8 },
          { n: t('Guacamole a la mexicana, 150 g', 'Guacamole a la mexicana, 150 g'), p: 88.8 },
          { n: t('Papas fritas', 'French fries'), p: 48.8 },
          { n: t('Porciones extra: ranch o crema', 'Extra portions: ranch or cream'), p: 28.8 },
          { n: t('Frijoles, arroz y/o espagueti', 'Beans, rice and/or spaghetti'), p: 48.8 },
        ],
      },
    ],
  },

  bebidas: {
    image: 'aguas',
    sections: [
      {
        title: t('Bebidas', 'Drinks'),
        items: [
          { n: t('Refrescos', 'Sodas'), d: t('Coca-Cola, Fresca, Fanta, Manzanita, Sprite, Mineral.', 'Coca-Cola, Fresca, Fanta, Manzanita, Sprite, sparkling mineral water.'), p: 48.8 },
        ],
      },
      {
        title: t('Aguas, jugos y más', 'Waters, juices & more'),
        compact: true,
        items: [
          { n: t('Limonada natural o mineral', 'Lemonade, still or sparkling'), p: 48.8 },
          { n: t('Limonada de frutos rojos natural o mineral', 'Berry lemonade, still or sparkling'), p: 58.8 },
          { n: t('Naranjada natural y mineral', 'Orangeade, still or sparkling'), p: 48.8 },
          { n: t('Agua fresca (refill)', 'Agua fresca (refill)'), p: 48.8 },
          { n: t('Fuze Tea'), p: 48.8 },
          { n: t('Té helado o shakeado', 'Iced or shaken tea'), p: 58.8 },
          { n: t('Jugo verde', 'Green juice'), p: 68.8 },
          { n: t('Jugo de naranja', 'Orange juice'), p: 58.8 },
          { n: t('Agua embotellada', 'Bottled water'), p: 28.8 },
          { n: t('Chocomilk'), p: 48.8 },
          { n: t('Café (refill)', 'Coffee (refill)'), p: 48.8 },
          { n: t('Licuado de plátano, mango o fresa', 'Banana, mango or strawberry smoothie'), p: 68.8 },
        ],
      },
    ],
  },

  postres: {
    image: 'pastel',
    sections: [
      {
        title: t('Postres', 'Desserts'),
        items: [
          {
            n: t('Postre del día', 'Dessert'),
            d: t('Todos a un mismo precio.', 'All at the same price.'),
            p: 68.8,
            list: [
              t('Pay de queso con mermelada de zarzamora', 'Cheesecake with blackberry jam'),
              t('Pay de queso con chispas de chocolate', 'Cheesecake with chocolate chips'),
              t('Pastel de zanahoria', 'Carrot cake'),
              t('Pan de elote', 'Sweet corn cake'),
            ],
          },
        ],
      },
    ],
  },
}
