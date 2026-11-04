// Transcrito de las fotos del menú impreso. Precios en MXN; p=[mediano 12oz, grande 16oz] o [precio único].
// per: d=desayuno c=comida t=tarde n=noche · t: h=caliente f=frío a=cualquiera
export const TABS=[['cafe','Café caliente'],['frio','Frío y frappés'],['chai','Chai, tés y smoothies'],['comer','Para comer'],['bar','Bar y bebidas']];
export const SECS=[
['espressos','cafe','Espressos','espresso','dctn','h'],['calientes','cafe','Especialidades calientes','latte','dctn','h','Mediano 12 oz · Grande 16 oz'],
['extras','cafe','Extras',null,'dctn','a','Descafeinado: +$4 MXN'],
['frias','frio','Especialidades frías','iced','ct','f','Mediano 12 oz · Grande 16 oz'],['frappes','frio','Frappés','frappe','ct','f'],['kids','frio','Frappés para niños','kids','ctn','f'],
['chai','chai','Chai','degascup','tn','h'],['tes','chai','Tés y tisanas','pink','dtn','h','Calientes, fríos o frappé · Mediano 12 oz · Grande 16 oz'],['smoothies','chai','Smoothies','smoothies','ct','f','Mediano 12 oz · Grande 16 oz'],
['croissants','comer','Croissants','croissant','dct','a'],['paninis','comer','Paninis','panini1','ct','a','Tradicionales $68 · Gourmet $71'],['galletas','comer','Galletas',null,'dtn','a','Consume local'],
['refrescos','bar','Refrescos y agua','cola','dctn','f'],['cerveza','bar','Cerveza y sidra',null,'ctn','f']
].map(([id,cat,title,img,per,t,sub])=>({id,cat,title,img,per,t,sub}));
const R=`espressos|Espresso||36
espressos|Espresso doble||39
espressos|Espresso cortado||39
espressos|Espresso con panna|Con crema batida|40
espressos|Espresso macchiato caramelo||40
calientes|Espresso americano|Espresso doble y agua|46|49
calientes|Vienés|Con leche y crema batida|69|71
calientes|Capuccino|Sabor vainilla y canela|62|66
calientes|Latte|Con crema irlandesa y cocoa|62|66
calientes|Macchiato caramelo||67|69
calientes|Moka|Con crema batida y chocolate|67|69
calientes|Café Degas|Crema batida, jarabes de licor de café y vainilla|69
calientes|Café Tampico|Sabor a coco, con coco rallado|68
calientes|Beso de Ángel|Sabor a rompope|67|69
calientes|Lechero||60|66
calientes|Chocolate caliente|Con leche|54|59
calientes|Chocolate blanco|Con crema batida|69|71
extras|Leche entera, light o deslactosada light||9
extras|Leche de soya o de coco||12
extras|Leche de almendra||13
extras|Shot de espresso||10
frias|Espresso americano frío|Café americano con hielo|60|64
frias|Capuccino helado|Crema batida y granillo de chocolate|67|69
frias|Café Degas frío|Crema batida, coco y canela|67
frias|Moka helado|Crema batida, granillo y chocolate derretido|67|69
frappes|Granita|A base de café|62|67
frappes|Capuccino frappé|Café, crema batida y granillo|70|75
frappes|Moka frappé|Chocolate líquido y crema batida|70|75
frappes|Chocolate|Café, crema batida y chispas de chocolate|70|75
frappes|Chocolate blanco|Café, crema batida y chocolate blanco|70|75
frappes|Coco|Base de leche, crema batida y coco rallado|73|76
frappes|Cookies 'n Cream|Café, crema batida y galleta entera|70|75
frappes|Caramelo|Café, crema batida y jarabe|70|75
frappes|Cajeta|Café, crema batida y jarabe|70|75
kids|Coco|Base de leche, topping de coco tostado|70|75
kids|Palomitas|Base de leche, nuez, vainilla y palomitas|70|75
kids|Chocolate|Base de leche, granillo de colores|70|75
chai|Frambuesa|Big Train|68|73
chai|Chocolate|Big Train|68|73
chai|Té verde|Big Train|68|73
chai|Vainilla|Oregon Chai|68|73
chai|Té verde|Oregon Chai|68|73
chai|Original té verde|Oregon Chai|68|73
chai|Manzana con canela|Oregon Chai|68|73
chai|Masala Chai|Té negro, naranja, canela, jengibre, clavo y vainilla|72|77
chai|Elefante|Té negro, vainilla y canela|72|77
chai|Tigre|Té negro, clavo y cardamomo|72|77
chai|Power|Té negro antioxidante de matcha|72|77
chai|Tucán|Té negro, especias, mango y coco|72|77
chai|Tortuga|Té verde, vainilla y canela|72|77
chai|Flamingo|Té negro y vainilla, descafeinado, sin azúcar|75|79
chai|Orca|Té negro y especias, sin azúcar|75|79
chai|Matcha té verde|David Rio|72|77
croissants|Jamón con queso||69
croissants|Ensalada de pollo||69
croissants|Pepperoni con queso||69
extras|Café descafeinado (extra)|Para cualquier café caliente, frío o frappé|4
tes|Té negro · Frutas de la pasión|Caliente, frío o frappé|48|51
tes|Té negro · Durazno|Caliente, frío o frappé|48|51
tes|Té negro · Oriental Spice|Caliente, frío o frappé|48|51
tes|Té verde · Menta|Caliente, frío o frappé|48|51
tes|Té verde · Verde Champagne|Caliente, frío o frappé|48|51
tes|Tisana · Frutos cordiales|Herbal y frutal|48|51
tes|Tisana · Fresa kiwi|Herbal y frutal|48|51
tes|Tisana · Herbal relax|Herbal y frutal|48|51
tes|Tisana · Ponche de guayaba|Herbal y frutal|48|51
tes|Tisana · Maracuyá|Herbal y frutal|48|51
tes|Tisana · Fantasía tropical|Herbal y frutal|48|51
tes|Tisana · Morao de la selva|Herbal y frutal|48|51
tes|Tisana · Manzanilla lavanda|Herbal y frutal|48|51
smoothies|Smoothie · Frutos rojos|De frutas|60|63
smoothies|Smoothie · Tamarindo|De frutas|60|63
smoothies|Smoothie · Mango|De frutas|60|63
smoothies|Smoothie · Fresa|De frutas|60|63
smoothies|Smoothie · Piña|De frutas|60|63
smoothies|Smoothie · Limón|De frutas|60|63
smoothies|Smoothie · Piña colada|De frutas|60|63
paninis|Italiano|Tradicional · Pan artesanal con salvado de trigo, jamón de pavo, pepperoni, salami y aderezo de la casa|68
paninis|Hawaiano|Tradicional · Pan artesanal con salvado de trigo, jamón de pavo, piña, queso manchego, aderezo de la casa y salsa chipotle|68
paninis|Salami|Tradicional · Pan artesanal con salvado de trigo, jamón de pavo, salami, queso amarillo y aderezo de la casa|68
paninis|Tres quesos|Tradicional · Pan artesanal con salvado de trigo, jamón de pavo, queso amarillo, manchego, panela y aderezo de la casa|68
paninis|Americano|Tradicional · Pan artesanal con salvado de trigo, jamón de pavo, tocino de pavo, queso amarillo y aderezo de la casa|68
paninis|Suizo|Tradicional · Pan artesanal brioche, jamón de pavo, champiñones, queso gouda, tocino, piña, manchego, roast beef y aderezo de la casa|68
paninis|Europeo|Gourmet · Pan artesanal con salvado de trigo, salsa tártara, jamón de pavo, queso manchego y aderezo de la casa|71
paninis|Boloñés|Gourmet · Pan artesanal integral con salvado de trigo y especias, jamón de pavo, pepperoni, queso manchego y salsa de tomate con chipotle|71
paninis|Español|Gourmet · Pan artesanal con hierbas finas, jamón de pavo, chorizo español, queso manchego y aderezo de la casa|71
paninis|Serrano|Gourmet · Pan artesanal con hierbas finas, jamón serrano, queso manchego, aceite de oliva y aderezo de la casa|71
galletas|Galleta · Chocolate||51
galletas|Galleta · M&M's||51
galletas|Galleta · Chispas de chocolate||51
galletas|Galleta · Arándanos||51
refrescos|Coca-Cola|355 ml|33
refrescos|Coca-Cola Light|355 ml|33
refrescos|Fanta|355 ml|33
refrescos|Escudo|355 ml|33
refrescos|Delaware Punch|355 ml|33
refrescos|Sprite|355 ml|33
refrescos|Topo Chico|340 ml|33
refrescos|San Pellegrino mineral|250 ml|41
refrescos|San Pellegrino aranciata|330 ml|47
refrescos|San Pellegrino aranciata rossa|330 ml|47
refrescos|San Pellegrino limonata melograno|330 ml|47
refrescos|Juguito Del Valle (niños)|250 ml|24
refrescos|Perrier mineral|330 ml|30
refrescos|Ciel natural|600 ml|28
refrescos|Jugo Boing|340 ml|30
refrescos|Dr Pepper|330 ml|57
refrescos|Evian|500 ml|57
refrescos|Fiji|500 ml|57
cerveza|Bohemia Clara|Nacional · 355 ml|41
cerveza|Bohemia Oscura|Nacional · 355 ml|41
cerveza|XX Lager|Nacional · 355 ml|41
cerveza|XX Ámbar|Nacional · 355 ml|41
cerveza|Heineken|Importada · 355 ml|44
cerveza|Amstel Ultra|Importada · 355 ml|44
cerveza|Miller High Life|Importada · 355 ml|44
cerveza|Strongbow manzana dorada|330 ml|44
cerveza|Strongbow fresa|330 ml|44`;
const S=Object.fromEntries(SECS.map(s=>[s.id,s]));
export const ITEMS=R.split('\n').map((l,id)=>{const[sec,n,d,a,b]=l.split('|');const s=S[sec];
 return{id,sec,cat:s.cat,n,d,p:b?[+a,+b]:[+a],per:s.per,t:s.t}});
