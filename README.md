# Skipuleggi – Einstaklingsverkefni

## Inngangur

Hugmyndin að verkefninu kom út frá áhuga á einfaldri og notendavænni síðu til að skipuleggja daglegt líf. Markmiðið var að sameina hefðbundna verkefnalista og habit tracking í einu vefforriti þar sem notandi getur bæði skipulagt verkefni og fylgst með venjum sínum. 

Verkefnið tengist vefforritun þar sem það felur í sér bæði framenda og bakenda, samskipti á milli þeirra í gegnum vefþjónustu, og gagnageymslu í gagnagrunni. 


## Útfærsla

Í verkefninu voru eftirfarandi skilyrði uppfyllt:

- **Bakendi útfærður**  
  Bakendi var útfærður með Hono og sér um alla gagnavinnslu og samskipti við gagnagrunn.

- **Vefþjónusta**  
  REST API var útfært með endpoints fyrir lista, verkefni og venjur (CRUD virkni). 

- **Framendi útfærður með frameworki**  
  Framendi var útfærður með React og TypeScript þar sem notandi getur unnið með gögn í gegnum viðmót.

- **Gagnagrunnur notaður**  
  PostgreSQL gagnagrunnur var notaður í gegnum Prisma ORM til að geyma lista, verkefni og venjur.

- **Hýsing**  
  Verkefnið er keyrandi á vefnum þar sem bakendinn er hýstur á Render og framendinn er hýstur á Netlify. 


## Tækni

Í verkefninu var eftirfarandi tækni notuð: 

- **React + TypeScript**  
  Notað til að byggja upp framenda. 

- **Hono**  
  Node.js vefþjónn var notaður til að útfæra REST API.

- **Prisma ORM**  
  Notað til að einfalda samskipti við gagnagrunn og skilgreina gagnamódel.

- **PostgreSQL**  
  SQL gagnagrunnur sem geymir öll gögn (lista, verkefni og venjur).

- **Netlify og Render**  
  Notað til að deploya verkefninu og gera það aðgengilegt á netinu.

- **CSS (Flexbox og Grid)**  
  Notað til að útfæra skipulag viðmótsins og gera það skýrt og notendavænt.


## Hvað gekk vel

Uppsetning á fullstack kerfi gekk vel þar sem framendi og bakendi tengdust í gegnum API. Það að nota Prisma einfaldaði vinnuna við gagnagrunninn mikið og gerði gagnamódelið skýrt. Hýsing framendans á Netlify gekk vel og notendaviðmótið varð skýrt og auðvelt í notkun með góðri skiptingu á milli componenta. 


## Hvað gekk illa

Uppsetning á gagnagrunni í hýsingu tók tíma þar sem það þurfti að leysa villur sem komu upp tengdar tengingu og réttindum. Environment variables og tenging milli framendans og bakendans í deployment voru flóknari en áætlað var og tók langan tíma að leysa. CSS stílarnir gátu stundum verið leiðinlegir vegna conflicting styles og import vandamála. Það tók mjög langan tíma að fá forritið til þess að líta út eins og það átti að gera. 


## Hvað var áhugavert

- Að sjá hvernig allir partar vefforrits tengjast, s.s. framendi, bakendi og gagnagrunnur.
- Habit tracking og streak lógík var sérstaklega áhugaverð þar sem þarf útreikninga út frá sögulegum gögnum.


## Niðurstaða

Verkefnið uppfyllir öll helstu skilyrði og er fullkeyrandi vefforrit sem sameinar verkefnalista, habit tracking og dagatal. Með verkefninu fékkst ágætis reynsla af fullstack þróun, gagnagrunnum og deployment. 

## Live síða 

Bakendi: https://einstaklingsverkefni-czy4.onrender.com/

Framendi: https://einstaklingsverkefni.netlify.app/