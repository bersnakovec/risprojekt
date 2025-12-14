<h1>Todo Aplikacija</h1>
Celostna aplikacija za upravljanje opravil z Java Spring Boot backend-om in React frontend-om.

<hr>

<h2>📄Dodatna dokumentacija</h2>

[Več podrobnosti ](DETAILS.md)

[Poročilo testiranja](testiranje/porocilo_testiranja.md)

<hr>

<h2>⚙️ Tehnologije in orodja</h2>

<h3>Frontend</h3>
<ul>
  <li><strong>Jezik:</strong> JavaScript (ES6+), JSX</li>
  <li><strong>Okvir (framework):</strong> React <code>^19.2.0</code></li>
  <li><strong>Router:</strong> React Router DOM <code>^7.9.4</code></li>
  <li><strong>HTTP odjemalec:</strong> Axios <code>^1.12.2</code></li>
  <li><strong>UI knjižnice:</strong>
    <ul>
      <li>Material UI (<code>@mui/material</code> <code>^7.3.4</code>)</li>
      <li>Material Icons (<code>@mui/icons-material</code> <code>^7.3.4</code>)</li>
      <li>Emotion (<code>@emotion/react</code> <code>^11.14.0</code>)</li>
      <li>Bootstrap <code>^5.3.8</code></li>
    </ul>
  </li>
  <li><strong>Testiranje:</strong>
    <ul>
      <li>@testing-library/react <code>^16.3.0</code></li>
      <li>@testing-library/jest-dom <code>^6.9.1</code></li>
      <li>@testing-library/user-event <code>^13.5.0</code></li>
      <li>@testing-library/dom <code>^10.4.1</code></li>
      <li>web-vitals <code>^2.1.4</code></li>
    </ul>
  </li>
</ul>

<h3>Backend</h3>
<ul>
  <li><strong>Jezik:</strong> Java <code>21</code></li>
  <li><strong>Okvir (framework):</strong> Spring Boot <code>3.5.7</code></li>
  <li><strong>Knjižnice:</strong>
    <ul>
      <li>spring-boot-starter-web – REST API</li>
      <li>spring-boot-starter-data-jpa – JPA/Hibernate ORM</li>
      <li>com.h2database:h2 – spominska baza za razvoj</li>
      <li>com.mysql:mysql-connector-j – povezava z MySQL</li>
      <li>org.projectlombok:lombok – avtomatizacija getterjev/setterjev</li>
      <li>spring-boot-starter-test – testiranje</li>
    </ul>
  </li>
  <li><strong>Gradnik projekta:</strong> Apache Maven</li>
  <li><strong>IDE priporočila:</strong> IntelliJ IDEA, VS Code, Eclipse</li>
  <li><strong>Verzijski nadzor:</strong> Git + GitHub</li>
</ul>

<hr>

<h2>🧩 Projektna struktura (logika)</h2>

<table>
  <thead>
    <tr>
      <th>Sloj</th>
      <th>Opis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Model (models)</strong></td>
      <td>JPA entitete, npr. <code>Task.java</code></td>
    </tr>
    <tr>
      <td><strong>DAO (dao)</strong></td>
      <td>Repository vmesniki za dostop do baze (<code>TaskRepository</code>)</td>
    </tr>
    <tr>
      <td><strong>Controller (controllers)</strong></td>
      <td>REST API endpointi (<code>TaskController</code>)</td>
    </tr>
    <tr>
      <td><strong>Frontend Components</strong></td>
      <td>UI komponente – prikaz nalog, obrazci, navigacija</td>
    </tr>
    <tr>
      <td><strong>Services (frontend)</strong></td>
      <td><code>axios</code> funkcije za komunikacijo z backendom</td>
    </tr>
  </tbody>
</table>

<hr>


<h2>📁 Struktura projekta</h2>

<pre>
RISPROJEKT/
├─ backend/
│  └─ tasklist/
│     ├─ src/
│     │  ├─ main/
│     │  │  ├─ java/com/example/tasklist/
│     │  │  │  ├─ controllers/        # REST kontrolerji (TaskController)
│     │  │  │  ├─ dao/                # Dostop do baze (TaskRepository)
│     │  │  │  ├─ models/             # JPA entitete (Task)
│     │  │  │  └─ TasklistApplication.java  # Glavni Spring Boot razred
│     │  │  └─ resources/
│     │  │     └─ application.properties   # Nastavitve baze, port itd.
│     │  └─ test/
│     │     └─ java/com/example/tasklist/TasklistApplicationTests.java
│     ├─ pom.xml
│     └─ (ostale Maven datoteke)
│
└─ frontend/
   ├─ public/
   │  ├─ index.html
   │  ├─ favicon.ico
   │  ├─ manifest.json
   │  └─ robots.txt
   ├─ src/
   │  ├─ components/
   │  │  ├─ Landing/        # začetna stran
   │  │  ├─ Navbar/         # navigacijska vrstica
   │  │  ├─ PageNotFound/   # 404 stran
   │  │  └─ Tasks/          # komponenta za seznam opravil
   │  ├─ routing/           # usmerjanje (Routing.js)
   │  ├─ services/          # klici na backend (axios)
   │  ├─ App.js             # glavna React komponenta
   │  ├─ index.js           # vstopna točka aplikacije
   │  └─ (ostale datoteke)
   ├─ package.json
   ├─ .env
   └─ README.md
</pre>

<hr>

<h2>🛠️ Uporabljena orodja in verzije</h2>

<ul>
  <li><strong>Node.js:</strong> 22.x ali novejši</li>
  <li><strong>npm:</strong> 10.x ali novejši</li>
  <li><strong>Java Development Kit (JDK):</strong> 21</li>
  <li><strong>Spring Boot CLI:</strong> 3.5.7</li>
  <li><strong>Maven:</strong> 3.9.x</li>
  <li><strong>MySQL Server:</strong> 8.0+</li>
  <li><strong>Git:</strong> 2.43+ (za verzioniranje kode)</li>
  <li><strong>IDE:</strong> IntelliJ IDEA / VS Code</li>
  <li><strong>Browser:</strong> Chrome / Firefox (za razvoj in testiranje frontenda)</li>
</ul>

<hr>

<h2>🧱 Standardi kodiranja</h2>

<h3>Frontend (React)</h3>
<ul>
  <li>Komponente: <code>PascalCase</code> (npr. <code>TaskList</code>, <code>Navbar</code>)</li>
  <li>Spremenljivke/funkcije: <code>camelCase</code></li>
  <li>Ena komponenta na datoteko (<code>Component.js</code>, <code>Component.css</code>)</li>
  <li>ESLint ("react-app") + priporočljivo Prettier formatiranje</li>
</ul>

<h3>Backend (Java)</h3>
<ul>
  <li>Razredi: <code>PascalCase</code>, metode/spremenljivke <code>camelCase</code></li>
  <li>Paketi: <code>lowercase</code></li>
  <li>REST endpointi po konvenciji <code>/api/...</code></li>
  <li>Uporabi <code>@RestController</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Entity</code></li>
</ul>

<hr>

<h2>▶️Navodila za nameščanje in zagon (za uporabnika brez ničesar nameščenega)</h2>
<h2>Kratek uvod</h2>
Ta projekt vsebuje dve ločeni aplikaciji: backend (Spring Boot, Java) v tasklist in frontend (React) v frontend. Backend po privzetih nastavitvah pričakuje MySQL bazo, vendar je na voljo tudi hiter način z uporabo vgrajene H2 baze (navodila spodaj). Backend teče na privzetem portu 8080; frontend v razvoju na 3000.
<ol>
    <li><strong>Predpogoji (kaj namestiti)</strong></li>
    <ul>
        <li>Java JDK 21 (npr. Eclipse Temurin / Adoptium ali Oracle/OpenJDK). Prenesi z: https://www.oracle.com/java/technologies/downloads/#java21 (izberi JDK 21).</li>
        <li>Git (opcijsko, če želiš klonirati repozitorij): https://git-scm.com</li>
        <li>(Neobvezno) MySQL Workbench, če želiš zagnati aplikacijo z MySQL podatkovno bazo: https://dev.mysql.com/downloads/workbench/</li>
        <li>Node.js (vključuje npm) — priporočam LTS (npr. 18 ali 20): https://nodejs.org</li>
        <li>(Ni potreben) Maven — v projektu je Maven Wrapper (mvnw / mvnw.cmd), zato ni nujno da nameščaš Maven globalno.</li>
    </ul>
    <li><strong>Priprava podatkovne baze</strong></li>
    <ul>
        <li>
            Koraki za hitro vzpostavitev lokalne MySQL baze z uporabo MySQL Workbench:
            <ol>
                <li>Zaženi MySQL Server in odpri MySQL Workbench. Poveži se na lokalni instance (host: <code>localhost</code>, port: <code>3306</code>) z uporabnikom <code>root</code>.</li>
                <li>Odpri novo SQL okno (SQL Editor) in zaženi naslednje ukaze, da ustvariš bazo in namenski uporabnik (zamenjaj geslo z močnim geslom):
                    ```sql
                    CREATE DATABASE IF NOT EXISTS `toDoList` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                    CREATE USER IF NOT EXISTS 'taskuser'@'localhost' IDENTIFIED BY 'MojeVarnoGeslo123!';
                    GRANT ALL PRIVILEGES ON `toDoList`.* TO 'taskuser'@'localhost';
                    FLUSH PRIVILEGES;
                    ```
                </li>
                <li>Osveži panel <strong>Schemas</strong> v Workbenchu in preveri, da se pojavi shema <code>toDoList</code>.</li>
                <li>Posodobi konekcijske podatke v <code>backend/tasklist/src/main/resources/application.properties</code> tako, da uporabljaš novega uporabnika:
                    ```properties
                    spring.datasource.url=jdbc:mysql://localhost:3306/toDoList?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
                    spring.datasource.username=taskuser
                    spring.datasource.password=MojeVarnoGeslo123!
                    ```
                </li>
            </ol>
        </li>
    </ul>
    <li><strong>Zagon backenda</strong></li>
        <ul>
            <li>Odpri cmd.exe in se preko cd ukazov pomakni v <code>.../tasklist/backend/tasklist mapo</code></li>
            <li>Napiši ukaz <strong>mvnw spring-boot:run</strong></li>
            <li>S tem si zagnal zaledje aplikacije</li>
        </ul>
    <li>Zagon frontenda</li>
        <ul>
            <li>Odpri nov cmd.exe in se pomakni v .../tasklist/frontend mapo</li>
            <li>Napiši ukaz <strong> npm start </strong>
            <li>S tem si zagnal obličje aplikacije, in dokončal zagon.</li>
        </ul>
</ol>

<hr>

<h2>🤝 Navodila za prispevanje</h2>

<ol>
  <li><strong>Fork</strong>-aj repozitorij</li>
  <li>Ustvari novo vejo:
    <pre>git checkout -b feature/ime-funkcionalnosti</pre>
  </li>
  <li>Naredi spremembe in commitaj:
    <pre>git commit -m "feat: dodan filter po statusu nalog"</pre>
  </li>
  <li>Pushaj in odpri <strong>Pull Request</strong>.</li>
</ol>

<hr>

<h2>🎯 Vizija projekta</h2>
<p>
  Naša vizija je ustvariti preprosto, odzivno in razširljivo aplikacijo za upravljanje nalog, ki bo uporabnikom pomagala organizirati vsakodnevna opravila, povečati produktivnost in izboljšati timsko sodelovanje. Aplikacija je namenjena vsem, ki želijo hitro ustvariti in spremljati seznam nalog brez kompleksnih nastavitev.
</p>
<p>
  Želimo zagotoviti prijazno uporabniško izkušnjo z jasnimi kontrolami za dodajanje, urejanje in filtriranje nalog, prioritizacijo ter možnostjo povezanosti s preprostimi bazo podatkov. V daljšem smislu želimo omogočiti tudi enostavno razširljivost — npr. dodajanje oznak, rokov, obvestil in skupinske rabe.
</p>
<p>
  Cilj je, da aplikacija izboljša uporabniško izkušnjo pri upravljanju nalog z intuitivnim vmesnikom, hitrim odgovorom na uporabniške vnose in jasnim prikazom prioritete ter stanja nalog. S tem želimo pomagati uporabnikom, da hitreje dokončajo svoje obveznosti in lažje sledijo napredku pri večjih projektih.
</p>

<hr>

<h2>📚 Besednjak</h2>
<p>Kratek seznam ključnih izrazov in njihov pomen v kontekstu te aplikacije:</p>
<ul>
  <li><strong>Naloga (Task)</strong> – osnovni objekt v aplikaciji, ki predstavlja opravilo. V modelu <code>Task.java</code> ima polja <code>id</code>, <code>name</code>, <code>dateDue</code> (rok) in <code>checked</code> (označena kot dokončano).</li>
  <li><strong>Seznam nalog</strong> – zbirka vseh nalog, ki jih upravljamo v aplikaciji; prikazano na frontend komponenti <code>Tasks</code>.</li>
  <li><strong>Status / checked</strong> – označuje, ali je naloga že dokončana.</li>
  <li><strong>Rok (dateDue)</strong> – datum, do katerega naj bi bila naloga opravljena.</li>
  <li><strong>CRUD</strong> – standardni podatkovni operacije: Create, Read, Update, Delete.</li>
  <li><strong>REST API</strong> – vmesnik za komunikacijo med frontend in backend.</li>
  <li><strong>Endpoint</strong> – posamezen URL (npr. <code>/api/tasks</code> ali <code>/api/tasks/{id}</code>) za interakcijo z API-jem.</li>
  <li><strong>Baza podatkov</strong> – prostor, kjer se shranjujejo vse naloge. V razvoju se uporablja H2, v praksi pa MySQL.</li>
  <li><strong>Shranjevanje v bazo</strong> – del programa, ki skrbi za branje in zapisovanje podatkov v bazo.</li>
  <li><strong>Controller</strong> – del programa na strežniku, ki prejme zahtevo iz aplikacije (npr. »prikaži naloge«) in vrne odgovor.</li>
  <li><strong>Frontend (React)</strong> – uporabniški vmesnik aplikacije, ki uporablja komponente za prikaz in upravljanje nalog.</li>
  <li><strong>Axios</strong> – orodje, ki frontend-u omogoča pošiljanje zahtevkov na API (npr. dodaj nalogo, izbriši nalogo).</li>
  <li><strong>CORS</strong> – nastavitev, ki omogoča, da se spletna stran in strežnik lahko pogovarjata med seboj, tudi če sta na različnih naslovih.</li>
  <li><strong>Iskanje (search)</strong> – možnost filtriranja nalog po imenu.</li>
</ul>

<hr>

<h3>Pravila</h3>
<ul>
  <li>Jasna commit sporočila (<code>feat:</code>, <code>fix:</code>, <code>refactor:</code>)</li>
  <li>Preveri, da se aplikacija zažene brez napak</li>
  <li>Ne puščaj nepotrebnih komentarjev in datotek</li>
</ul>

<hr>


<h2>📬 Kontakt</h2>
<ul>
  <li><strong>Avtorji:</strong> Lenart Beršnak in Gašper Kavčič</li>
  <li><strong>Repozitorij:</strong> https://github.com/bersnakovec/risprojekt</li>
  <li><strong>Težave/ideje:</strong> odpri <em>Issue</em> ali <em>Pull Request</em></li>
</ul>

<hr>