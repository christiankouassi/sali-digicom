# DESIGN.md — SALI DigiCom (Reconstruction REA Exacte de `https://digital-cover.com/`)

## 1. Preuve de Décompilation REA (`https://digital-cover.com/`)
Source décompilée depuis les bundles de production de `https://digital-cover.com/` (Awwwards Site of the Day) :
- **HTML & Routes** : `index.html`, `our-services.html`, `about-us.html`, `contact.html`
- **Feuille de style** : `main.css` (`191 Ko`, grille fluide 24 colonnes `4.1666vw`, monochrome pur)
- **Moteur & Chunks JS** : `main.js` (`228 Ko`), `chunk-930.js` (`Intro.js`), `chunk-239.js` (`Sentence.js`), `chunk-500.js` & `chunk-955.js` (`ProjectGallery.js`), `chunk-104.js` (`Services.js`), `chunk-842.js` (`SimpleKeyFigures.js`)
- **Objet 3D WebGL (`<canvas id="gl">` + `prism.png`)** : Anneau losange arrondi torsadé de Möbius (`45°`) en obsidienne noire brillante à reflets spéculaires chrome liquide argenté/blanc (`world.prism`), animé en rotation continue, parallaxe curseur et waypoints de scroll (`data-webgl-section`).

---

## 2. Système Chromatiqué Strictement Monochrome (Zéro Couleur Parasite)
Aucune carte bleutée `#131722`, aucun or `#BDA67F`, aucun vert `#1d9878`. Exclusivement le système `digital-cover.com` :
- `--dc-bg` : `#090909` (Fond global de scène et canvas WebGL)
- `--dc-fade` : `#080808` (Fondu inférieur des visuels éditoriaux `linear-gradient(180deg, rgba(8,8,8,0.3) 35.39%, #080808 100%)`)
- `--dc-roof` : `#181818` (Sommet du toit prismatique SVG `1440x235` du footer)
- `--dc-rule` : `#363636` (Filet horizontal footer et bordures basses des champs de formulaire)
- `--dc-ring` : `#4c4c4c` (Anneau fin `1px` des cercles `.e-cta` et losanges radio `15x15px` `rotate(45deg)` au repos)
- `--dc-muted` : `#9A9A9A` / `#646464` (Textes secondaires lisibles AA et ligne de base du loader)
- `--dc-ink` : `#FFFFFF` (Typographie principale, traits SVG, remplissage au survol des `.e-cta` et `.e-prism-cta`)

---

## 3. Système Typographique (`Poppins` Regular 400 & Bold 700)
Conformément à `main.css` de `digital-cover.com` :
1. **Monument Hero (`.c-intro__title`)** : `Poppins` **700 Bold**, `clamp(64px, 18.5vw, 270px)` (`line-height: 0.92`, `letter-spacing: -0.03em`), 2 mots monumentaux (`SALI` en haut à gauche, `DigiCom` en bas à droite) qui s'écartent horizontalement au scroll autour du prisme 3D.
2. **Navigation Plein Écran (`.menu__item`)** : `Poppins` **700 Bold**, `clamp(36px, 8.5vh, 92px)`, décalage `translateX(30px)` au survol, atténuation `opacity: 0.3` des entrées non survolées.
3. **Titres & Manifestes de Section (`h2`, `.dc-statement`)** : `Poppins` **400 Regular** (jamais Bold sur les phrases de section), `clamp(23px, 2.5vw, 36px)` / `line-height: 1.45` pour les manifestes multi-lignes et `clamp(28px, 2.8vw, 40px)` (`<= 2 lignes`) pour les titres `<h2>`.
4. **Indicateur Losange (`.dc-lead-tag`)** : `Poppins` **400 Regular**, `20px` / `30px`, précédé d'un carré `7x7px` `1px solid #FFFFFF` `border-radius: 2px` tourné à `-45deg`.
5. **Chiffres Clés Creux (`.b-skf__number`) & Ville Footer (`.footer__city-name`)** : `Poppins` **700 Bold**, `clamp(52px, 6.5vw, 92px)`, `color: transparent; -webkit-text-stroke: 1px #FFFFFF` (se remplissant en `#FFFFFF` pur au survol sur `Casablanca`).

---

## 4. Architecture des 8 Séquences & Copy Deck Purifié (Français — Zéro AI Slop)

### Séquence 0 — Loader Minimaliste (`00%` -> `100%`)
- Compteur centré `Poppins` Regular `20px` + ligne horizontale `1px` `#FFFFFF` sur `#646464`, transition rapide (`650ms`) et contournement instantané en environnement automatisé (`navigator.webdriver`) pour une inspection immédiate.

### Séquence 1 — Header Fixe `mix-blend-mode: difference` & Hero `c-intro`
- **Header** : Uniquement 2 éléments aux extrémités de la grille 24 colonnes :
  - Gauche (`offset-1`) : Emblème géométrique facetté SALI en polygones blancs purs (`38x22px`).
  - Droite : `Menu` / `Fermer` + losange arrondi SVG `35x35px` (`stroke-dasharray: 129` -> `stroke-dashoffset: 258` au survol) et double barre centrale pivotant à `±45deg`.
- **Hero (`c-intro`)** :
  - Mot supérieur gauche : `SALI`
  - Mot inférieur droite : `DigiCom`
  - Au centre (`z-index` intercalé + `<canvas id="gl">`) : Prisme de Möbius 3D obsidienne-chrome en rotation fluide et inclinaison souris.
  - Bas gauche (`<h1>` sur 2 lignes max) : `L'agence qui façonne votre présence digitale.`
  - Sous-texte concis : `Sites web sur mesure, identité de marque et stratégie sociale à Casablanca.`
  - Droite : Cercle magnétique `.e-cta` (`1px solid #4c4c4c`, `clamp(165px, 15vw, 220px)`) avec flèche courbe `47x34` et balayage circulaire blanc `cubic-bezier(0.23, 1, 0.32, 1)` -> `Démarrer un projet`.

### Séquence 2 — Statement & CTA (`b-content-button`)
- Gauche (`offset-2 col-11`, `<p className="dc-statement">`, `Poppins` 400) :
  `Nous dessinons, développons et pilotons des plateformes web conçues pour le référencement naturel et la conversion.`
- Droite (`offset-2 col-7`) : Cercle `.e-cta` -> `Simuler un site`.

### Séquence 3 — Cadre Panoramique & Showreel (`b-video`)
- `offset-2 col-20`, ratio `16:9`, vidéo architecturale sombre en boucle (`autoplay muted loop playsinline`) voilée à `30%` `#090909`, surmontée au centre du bouton losange arrondi blanc `63x63px` (`Explorer` / `Pause`) permettant d'ouvrir le mode plein cadre des réalisations SALI DigiCom.

### Séquence 4 — Phrase Cinétique au Scroll (`b-sentence`)
- Scène sticky (`185vh`) au-dessus du Prisme 3D qui pivote sur son axe :
  `Quel que soit votre secteur, nous hissons votre image digitale au niveau d'exigence que mérite votre marque.`

### Séquence 5 — Galerie Perspective 3D & Bouton Prisme (`b-project-gallery`)
- Titre `<h2>` (`<= 2 lignes`) : `Nos pôles d'exécution`
- 4 grands cadres visuels alternés gauche/droite émergeant en profondeur avec fondu inférieur `#080808`, titre latéral synchronisé à droite et bouton central `.e-prism-cta` (`160x160px`, `viewBox="0 0 165 165"`, tracé progressif `stroke-dasharray: 481` lié au scroll + icône 4 losanges `34x34` qui s'écartent au survol) :
  1. `Plateformes & Architecture Web` — Sites vitrines haute couture, e-commerce et applications React sur mesure.
  2. `Identité & Direction Artistique` — Systèmes graphiques, chartes éditoriales et territoires de marque durables.
  3. `Acquisition SEO & Social Media` — Référencement organique, création de contenus et gestion de communautés.
  4. `Systèmes IA & Automatisation` — Intégration d'outils métiers, qualification de leads et flux connectés.

### Séquence 6 — Liste Éditoriale des Expertises & Chiffres Clés Creux (`b-services` + `b-skf`)
- Gauche : Photographie architecturale verticale fondue dans `#080808` en partie basse, qui change avec fluidité au survol de chaque expertise.
- Droite : Liste typographique pure sans boîtes, filet blanc `1px` `scaleX(0 -> 1)` directionnel au survol :
  - `Conseil & Cadrage Stratégique`
  - `Design d'Interface & Expérience`
  - `Développement Web & E-Commerce`
  - `Community Management & Contenu`
  - `Référencement Naturel & Performance`
  - Cercle `.e-cta` -> `Configurer une offre`
- Bande `b-skf` (Chiffres clés en contour blanc `1px` `-webkit-text-stroke`, décalés verticalement comme `digital-cover.com`) :
  - `4` — `Pôles complémentaires réunis au sein du studio`
  - `100%` — `Architectures conçues sur mesure pour chaque client`
  - `24h` — `Délai maximal de retour sur votre cadrage chiffré`

### Séquence 7 — Sélecteur Interactif à Losanges (`t-forms`) & Configurateurs SALI DigiCom
- Indicateur losange : `Contact`
- Titre `<h2>` (`<= 2 lignes`) : `Que recherchez-vous ?`
- 3 lignes interactives monumentales (`clamp(24px, 2.6vw, 38px)`) précédées d'un losange `15x15px` (`1px solid #4c4c4c` -> rempli `#FFFFFF` au survol / sélection) :
  1. `Lancer le configurateur Site Web` -> Déploie `QuestionnaireFlow` (`serviceType="website"`) en thème monochrome noir & blanc `digital-cover.com`.
  2. `Lancer le configurateur Social Media` -> Déploie `QuestionnaireFlow` (`serviceType="community"`) en thème monochrome noir & blanc `digital-cover.com`.
  3. `Écrire directement au studio` -> Déploie le formulaire épuré à filets inférieurs `#363636` relié à `POST /api/send-email` (`nom`, `email`, `téléphone`, `entreprise`, `message`) + cercle `.e-cta` `Envoyer`.

### Séquence 8 — Footer à Toit Prismatique (`footer.footer`)
- Arche triangulaire SVG `1440x235` (`#090909` -> `#181818`) + filet `#363636`.
- Gauche : `Où nous trouver` + ville monumentale **`Casablanca`** en contour blanc `1px` (`-webkit-text-stroke: 1px #FFFFFF; color: transparent`, plein `#FFFFFF` au survol).
- Droite : Coordonnées directes (`+212 753-012924`, `salisdigicom@gmail.com`, `Casablanca, Maroc`), bouton pilule `.e-button` vers la maison-mère `SALI Capital Group` (`https://salicapitalgroup.com`) et crédits photographiques.
