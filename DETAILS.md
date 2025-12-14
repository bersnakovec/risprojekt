<h1>Diagram primerov uporabe</h1>
<img width="1151" height="821" alt="RIS_vaja_5" src="https://github.com/user-attachments/assets/d02ea286-a123-47b5-bba8-d0dfead90772" />

<hr>

<h1>Razredni diagram</h1>

![R_diagram](https://github.com/user-attachments/assets/794b4945-345e-4544-b5c6-c452fd070f6d)

---

## Opisi razredov in metod

### Task
Model za opravilo. Hrani podatke o nalogi, roku, statusu in dodeljenih uporabnikih.
Metode:
- getId / setId: dobi/nastavi ID naloge
- getName / setName: dobi/nastavi ime naloge
- getDateDue / setDateDue: dobi/nastavi rok
- isChecked / setChecked: preveri/nastavi ali je naloga opravljena
- getUsers / setUsers: dobi/nastavi dodeljene uporabnike
- getStatus / setStatus: dobi/nastavi status opravila
- addUser: doda novega uporabnika k opravilu

### Invitation
Model za obdelavo povabil drugih uporabnikov k opravilu
Metode:
- accept: sprejem povabila
- decline: zavrnitev povabila

### User
Model za uporabnika. Hrani podatke o uporabniškem imenu, emailu, geslu, vlogi.
Metode:
- getId / setId: dobi/nastavi ID uporabnika
- getUsername / setUsername: dobi/nastavi uporabniško ime
- getEmail / setEmail: dobi/nastavi email
- getPassword / setPassword: dobi/nastavi geslo
- getRole / setRole: dobi/nastavi vlogo
- getCreatedAt / setCreatedAt: dobi/nastavi čas ustvarjanja
- getAuthorities: vrne vloge za Spring Security
- isAccountNonExpired, isAccountNonLocked, isCredentialsNonExpired, isEnabled: preveri status računa

### TaskController
REST API za upravljanje nalog. Omogoča pridobivanje, urejanje, brisanje, dodeljevanje uporabnikov.
Metode:
- getAll: vrne vse naloge za prijavljenega uporabnika
- getById: vrne podrobnosti naloge
- create: ustvari novo nalogo
- update: posodobi nalogo
- delete: izbriše nalogo
- addUserToTask: doda uporabnika k nalogi
- removeUserFromTask: odstrani uporabnika iz naloge

### UserService
Logika za delo z uporabniki (registracija, prijava, iskanje).
Metode:
- loadUserByUsername: poišče uporabnika za prijavo
- registerUser: ustvari novega uporabnika
- findByUsername: poišče uporabnika po imenu

### TaskRepository
Vmesnik za dostop do podatkov o nalogah.
Metode:
- findByUsersContaining: najde naloge, kjer je uporabnik dodeljen
- findByUsersContainingAndNameContainingIgnoreCase: najde naloge po uporabniku in iskalnem nizu
- findByIdAndUsersContaining: najde nalogo po ID in uporabniku

### UserRepository
Vmesnik za dostop do podatkov o uporabnikih.
Metode:
- findByUsername: poišče uporabnika po imenu
- findByEmail: poišče uporabnika po emailu
- existsByUsername: preveri ali obstaja uporabnik s tem imenom
- existsByEmail: preveri ali obstaja uporabnik s tem emailom

### AuthController
API za prijavo in registracijo uporabnikov.
Metode:
- login: prijava uporabnika
- register: registracija novega uporabnika

### JwtUtil
Pomaga pri generiranju in preverjanju JWT žetonov.
Metode:
- generateToken: ustvari JWT žeton
- validateToken: preveri veljavnost žetona
- extractUsername: izlušči uporabniško ime iz žetona

### SecurityConfig
Nastavitve varnosti za aplikacijo (Spring Security).

### JwtAuthenticationFilter
Filter za preverjanje JWT žetonov v zahtevkih.

<hr>

<h1>Podrobni opisi primerov </h1>

<section id="pu-01">
  <h2>Primer uporabe: Ustvarjanje seznama opravil (PU-01)</h2>

  <p><strong>ID:</strong> PU-01</p>
  <p><strong>Cilj:</strong> Ustvariti nov seznam opravil, v katerega bo uporabnik kasneje dodajal opravila.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je uspešno prijavljen v aplikacijo.<br />
  Uporabniku je prikazan vmesnik za delo z opravili.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  V bazi je shranjen nov seznam opravil, vezan na uporabnika.<br />
  Seznam se prikaže med uporabnikovimi seznami.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik izbere možnost »Ustvari seznam opravil«.</li>
    <li>Sistem prikaže obrazec za vnos imena (in po želji opisa) seznama.</li>
    <li>Uporabnik vnese ime seznama.</li>
    <li>Uporabnik klikne gumb »Shrani«.</li>
    <li>Sistem preveri veljavnost vnesenih podatkov.</li>
    <li>Sistem ustvari nov seznam opravil in ga shrani v bazo.</li>
    <li>Sistem prikaže posodobljen pogled z novim seznamom.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik doda opis seznama</strong>
      <ol>
        <li>3a. Uporabnik poleg imena vnese še opis.</li>
        <li>5a. Sistem shrani tudi opis seznama.</li>
      </ol>
    </li>
    <li><strong>A2 – Uporabnik prekliče ustvarjanje seznama</strong>
      <ol>
        <li>4a. Namesto »Shrani« uporabnik izbere »Prekliči«.</li>
        <li>5a. Sistem zapre obrazec brez sprememb v bazi.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Ime seznama ni vneseno</strong><br />
      Sistem prikaže sporočilo »Ime seznama je obvezno« in uporabniku omogoči popravek.
    </li>
    <li><strong>E2 – Napaka pri shranjevanju v bazo</strong><br />
      Sistem prikaže sporočilo, da seznama ni bilo mogoče ustvariti, ter ponudi možnost novega poskusa.
    </li>
  </ul>
</section>

<hr />

<section id="pu-02">
  <h2>Primer uporabe: Urejanje opravil (PU-02)</h2>

  <p><strong>ID:</strong> PU-02</p>
  <p><strong>Cilj:</strong> Uporabnik želi upravljati svoja opravila (dodajanje, spreminjanje, brisanje, označevanje kot dokončano).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  Uporabnik ima vsaj en seznam opravil.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Stanje opravil (ustvarjena, posodobljena, izbrisana, spremenjen status) je usklajeno z dejanji uporabnika.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik odpre svoj seznam opravil.</li>
    <li>Uporabnik izbere eno od možnosti: dodajanje, urejanje, brisanje, označevanje, filtriranje, razvrščanje.</li>
    <li>Sistem preusmeri uporabnika na ustrezen podrejeni primer uporabe (npr. Dodajanje opravila).</li>
    <li>Po končanem podrejenem PU sistem prikaže posodobljen seznam opravil.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <p>Odvisni od podrejenih PU (npr. preklic dodajanja, neuspešen izbris).</p>

  <h3>Izjeme</h3>
  <p>Odvisni od podrejenih PU (npr. napaka baze, neveljavni podatki).</p>
</section>

<hr />

<section id="pu-03">
  <h2>Primer uporabe: Dodajanje opravila (PU-03)</h2>

  <p><strong>ID:</strong> PU-03</p>
  <p><strong>Cilj:</strong> Uporabnik želi ustvariti novo opravilo v svojem seznamu opravil, da lahko spremlja svoje zadolžitve.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik mora biti prijavljen v sistem.<br />
  Uporabnik mora imeti dostop do svojega seznama opravil.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Novo opravilo je shranjeno v bazo podatkov.<br />
  Sistem posodobi seznam opravil in prikaže novo opravilo uporabniku.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik odpre aplikacijo in izbere možnost »Dodaj opravilo«.</li>
    <li>Sistem prikaže obrazec za vnos podatkov o opravilu.</li>
    <li>Uporabnik vnese ime opravila in po želji opis.</li>
    <li>Uporabnik potrdi dodajanje opravila.</li>
    <li>Sistem preveri veljavnost podatkov.</li>
    <li>Sistem shrani novo opravilo v bazo.</li>
    <li>Sistem prikaže posodobljen seznam opravil, ki vključuje tudi novo opravilo.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik želi dodati tudi rok opravila</strong>
      <ol>
        <li>Sistem prikaže dodatno polje »Rok opravila«.</li>
        <li>Uporabnik vnese datum in uro roka.</li>
        <li>Sistem shrani rok skupaj z opravilom.</li>
      </ol>
    </li>
    <li><strong>A2 – Uporabnik prekliče dodajanje</strong>
      <ol>
        <li>Uporabnik klikne »Prekliči«.</li>
        <li>Sistem se vrne na pregled obstoječih opravil brez sprememb.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neveljavni podatki (npr. prazno ime opravila)</strong><br />
      Sistem prikaže obvestilo o napaki.<br />
      Uporabnik mora popraviti podatke.
    </li>
    <li><strong>E2 – Napaka pri shranjevanju (npr. problem z bazo)</strong><br />
      Sistem prikaže sporočilo »Opravila ni bilo mogoče shraniti.«<br />
      Uporabniku ponudi možnost ponovnega poskusa.
    </li>
  </ul>
</section>

<hr />

<section id="pu-04">
  <h2>Primer uporabe: Dodajanje roka opravila (extend) (PU-04)</h2>

  <p><strong>ID:</strong> PU-04</p>
  <p><strong>Cilj:</strong> Uporabnik želi opravilom dodati rok.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong> Opravilo mora obstajati.</p>

  <p><strong>Stanje sistema po PU:</strong> Posodobljeno opravilo z rokom.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik pri dodajanju ali urejanju opravila izbere možnost »Dodaj rok«.</li>
    <li>Sistem prikaže vnos datuma in ure.</li>
    <li>Uporabnik potrdi.</li>
    <li>Sistem validira rok.</li>
    <li>Sistem shrani posodobljeno opravilo.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik izbriše rok</strong></li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neveljaven datum</strong> → obvestilo.</li>
  </ul>
</section>

<hr />

<section id="pu-05">
  <h2>Primer uporabe: Povabljanje gosta k opravilu (PU-05)</h2>

  <p><strong>ID:</strong> PU-05</p>
  <p><strong>Cilj:</strong> Uporabnik želi povabiti gosta k sodelovanju na opravilu.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije<br />
  Povabljen gost</p>

  <p><strong>Predpogoji:</strong><br />
  Opravilo obstaja.<br />
  Uporabnik je lastnik ali ima pravice za deljenje.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  V sistemu obstaja zapis povabila, povezan z opravilom in gostom.<br />
  Povabilo ima začetni status (npr. »poslano, čaka na odgovor«).</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik izbere opravilo in možnost »Povabi gosta«.</li>
    <li>Sistem prikaže obrazec za vnos e-pošte gosta.</li>
    <li>Uporabnik potrdi.</li>
    <li>Sistem preveri, ali uporabnik obstaja.</li>
    <li>Sistem ustvari povabilo.</li>
    <li>Sistem pošlje povabilo gostu.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Gost še nima računa</strong> → sistem ponudi registracijo.</li>
    <li><strong>A2 – Uporabnik doda več gostov hkrati</strong></li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neveljavna e-pošta</strong> → napaka.</li>
    <li><strong>E2 – Napaka pri ustvarjanju ali pošiljanju povabila</strong><br />
      Sistem prikaže sporočilo o napaki in uporabniku omogoči ponoven poskus.
    </li>
  </ul>
</section>

<hr />

<section id="pu-06">
  <h2>Primer uporabe: Nastavljanje pravic za gost (PU-06)</h2>

  <p><strong>ID:</strong> PU-06</p>
  <p><strong>Cilj:</strong> Določiti, kaj povabljeni gost lahko dela z deljenim opravilom (npr. samo ogled, tudi urejanje, označevanje kot dokončano).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik<br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong><br />
  Opravilo obstaja.<br />
  Povabilo za gosta obstaja ali se ravno ustvarja.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  V bazi so shranjena pravila/dovoljenja za posameznega gosta na posameznem opravilu.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik pri povabilu gosta odpre nastavitve pravic.</li>
    <li>Sistem prikaže možnosti (npr. »Ogled«, »Urejanje«, »Označevanje kot dokončano«).</li>
    <li>Uporabnik izbere želene pravice.</li>
    <li>Uporabnik potrdi izbiro.</li>
    <li>Sistem shrani pravice v bazo in jih poveže s povabilom/gostom.</li>
    <li>Sistem ob potrditvi ali ob pošiljanju povabila uporabi te pravice.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Kasnejša sprememba pravic</strong>
      <ol>
        <li>1a. Uporabnik odpre že obstoječe povabilo.</li>
        <li>2a. Spremeni pravice.</li>
        <li>3a. Sistem posodobi zapise v bazi.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Uporabnik poskuša nastaviti pravice samemu sebi</strong><br />
      Sistem zavrne spremembo in prikaže obvestilo, da se pravice lastnika ne spreminjajo na ta način.
    </li>
  </ul>
</section>

<hr />

<section id="pu-07">
  <h2>Primer uporabe: Ustvarjanje povabila za gosta (PU-07)</h2>

  <p><strong>ID:</strong> PU-07</p>
  <p><strong>Cilj:</strong> Sistem pripravi formalno povabilo, povezano z opravilom in gostom.</p>

  <p><strong>Akterji:</strong><br />
  Sistem To-Do aplikacije</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je sprožil povabilo.<br />
  Podatki o gostu in opravilih so znani.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  V bazi je shranjen zapis povabila (gost, opravilo, pravice, status, žeton/povezava).</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Sistem prejme zahtevo za ustvarjanje povabila.</li>
    <li>Sistem generira unikatni identifikator ali povezavo za povabilo.</li>
    <li>Sistem shrani povabilo v bazo (vključno z dovoljenji in začetnim statusom »čaka na odgovor«).</li>
    <li>Sistem vrne informacijo, da je povabilo ustvarjeno, in sproži PU-08 (pošiljanje).</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <p>— (sistemski proces, brez uporabniških variant)</p>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Napaka pri zapisovanju povabila v bazo</strong><br />
      Sistem ne ustvarja povabila in prijavljenemu uporabniku sporoči, da povabila trenutno ni mogoče ustvariti.
    </li>
  </ul>
</section>

<hr />

<section id="pu-08">
  <h2>Primer uporabe: Pošiljanje povabila gostu (PU-08)</h2>

  <p><strong>ID:</strong> PU-08</p>
  <p><strong>Cilj:</strong> Povabljenemu gostu poslati obvestilo (npr. e-mail) z možnostjo sprejema ali zavrnitve povabila.</p>

  <p><strong>Akterji:</strong><br />
  Sistem To-Do aplikacije<br />
  Povabljen gost</p>

  <p><strong>Predpogoji:</strong> Povabilo je že ustvarjeno.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Status povabila je posodobljen na »poslano«; sistem hrani čas pošiljanja.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Sistem pridobi podatke povabila in e-poštni naslov gosta.</li>
    <li>Sistem pripravi vsebino e-pošte s povezavo do povabila.</li>
    <li>Sistem pošlje e-pošto gostu.</li>
    <li>Sistem ob uspešnem pošiljanju zabeleži status »poslano«.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Več prejemnikov</strong><br />
      Sistem pošlje e-pošto vsakemu gostu posebej in za vsakega zabeleži status.
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neuspešno pošiljanje e-pošte</strong><br />
      Sistem zabeleži napako in status povabila (npr. »napaka pri pošiljanju«) ter lahko obvesti lastnika opravila.
    </li>
  </ul>
</section>

<hr />

<section id="pu-09">
  <h2>Primer uporabe: Izbris opravila (PU-09)</h2>

  <p><strong>ID:</strong> PU-09</p>
  <p><strong>Cilj:</strong> Odstraniti nepotrebno ali napačno opravilo s seznama.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  Opravilo obstaja in uporabnik ima pravico brisanja.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Opravilo (in po potrebi povezana povabila) je odstranjeno iz baze.<br />
  Seznam opravil je posodobljen.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik izbere opravilo, ki ga želi izbrisati.</li>
    <li>Uporabnik klikne možnost »Izbriši«.</li>
    <li>Sistem prikaže potrditveno okno (»Ali želite res izbrisati opravilo?«).</li>
    <li>Uporabnik potrdi brisanje.</li>
    <li>Sistem preveri pravice uporabnika.</li>
    <li>Sistem izbriše opravilo iz baze in po potrebi povezana povabila.</li>
    <li>Sistem prikaže posodobljen seznam brez izbranega opravila.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik prekliče brisanje</strong>
      <ol>
        <li>4a. Uporabnik izbere »Prekliči«.</li>
        <li>5a. Sistem zapre dialog, brez sprememb.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Uporabnik nima pravice brisanja</strong><br />
      Sistem prikaže sporočilo, da uporabnik nima dovoljenja za brisanje.
    </li>
    <li><strong>E2 – Napaka pri brisanju v bazi</strong><br />
      Sistem obvesti uporabnika, da opravila ni bilo mogoče izbrisati, in ga pusti v seznamu.
    </li>
  </ul>
</section>

<hr />

<section id="pu-10">
  <h2>Primer uporabe: Pregled opravil (PU-10)</h2>

  <p><strong>ID:</strong> PU-10</p>
  <p><strong>Cilj:</strong> Prikaz seznama uporabnikovih opravil (vse, filtrirana ali razvrščena).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  V sistemu obstajajo opravila ali pa je seznam lahko prazen.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Stanje podatkov v bazi ostane nespremenjeno; spremeni se le prikaz (pogled) uporabniku.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik odpre aplikacijo ali izbere svoj seznam opravil.</li>
    <li>Sistem pridobi vsa uporabnikova opravila iz baze.</li>
    <li>Sistem jih prikaže v uporabniškem vmesniku (privzeto po določenem kriteriju).</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik uporabi filtriranje ali razvrščanje</strong>
      <ol>
        <li>2a. Uporabnik spremeni kriterij pogleda.</li>
        <li>3a. Sistem ponovno prikaže seznam glede na izbrane filtre/kriterije.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Napaka pri branju iz baze</strong><br />
      Sistem prikaže obvestilo o napaki in morda prazno stran.
    </li>
  </ul>
</section>

<hr />

<section id="pu-11">
  <h2>Primer uporabe: Razvrsti opravila (PU-11)</h2>

  <p><strong>ID:</strong> PU-11</p>
  <p><strong>Cilj:</strong> Spremeniti vrstni red prikaza opravil (npr. po datumu, imenu, statusu).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  V sistemu obstaja vsaj eno opravilo.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Podatki o opravilih ostanejo nespremenjeni, spremeni se način prikaza (lahko pa se shrani izbran kriterij razvrščanja kot nastavitev).</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik v seznamu opravil odpre meni za razvrščanje.</li>
    <li>Uporabnik izbere kriterij (npr. »po roku«, »po imenu«, »po statusu«).</li>
    <li>Sistem razvrsti seznam opravil po izbranem kriteriju.</li>
    <li>Sistem prikaže posodobljen seznam.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Uporabnik izbere več kriterijev (npr. najprej po statusu, nato po datumu)</strong>
      <ol>
        <li>2a. Uporabnik določi primarni in sekundarni kriterij.</li>
        <li>3a. Sistem uporabi oba kriterija pri razvrščanju.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neznan kriterij razvrščanja (programska napaka)</strong><br />
      Sistem uporabi privzeto razvrščanje (npr. po datumu ustvarjanja) in zabeleži napako v logih.
    </li>
  </ul>
</section>

<hr />

<section id="pu-12">
  <h2>Primer uporabe: Filtriranje opravil (PU-12)</h2>

  <p><strong>ID:</strong> PU-12</p>
  <p><strong>Cilj:</strong> Prikazati le tista opravila, ki izpolnjujejo pogoje filtra (ime, rok, status …).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  V sistemu obstaja vsaj eno opravilo.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Baza ostane nespremenjena; v vmesniku se prikaže le podmnožica opravil.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik v seznamu opravil izbere možnost »Filtriraj opravila«.</li>
    <li>Sistem prikaže obrazec z različnimi filtri (ime, rok, status).</li>
    <li>Uporabnik izbere in nastavi želene filtre.</li>
    <li>Uporabnik potrdi filtriranje.</li>
    <li>Sistem uporabi izbrane filtre in pridobi ustrezna opravila.</li>
    <li>Sistem prikaže filtriran seznam.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Filtriranje po imenu (extend PU-13)</strong></li>
    <li><strong>A2 – Filtriranje po roku (extend PU-14)</strong></li>
    <li><strong>A3 – Filtriranje po statusu (extend PU-15)</strong></li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Nobeno opravilo ne ustreza pogojem</strong><br />
      Sistem prikaže prazen seznam in sporočilo »Ni opravil, ki ustrezajo filtrom«.
    </li>
  </ul>
</section>

<hr />

<section id="pu-13">
  <h2>Primer uporabe: Filtriranje po imenu (PU-13)</h2>

  <p><strong>ID:</strong> PU-13</p>
  <p><strong>Cilj:</strong> Prikazati opravila, katerih ime ustreza vnesenemu iskalnemu nizu.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong> Uporabnik je v pogledu filtra ali v iskalnem polju.</p>

  <p><strong>Stanje sistema po PU:</strong> Nespremenjeno; prikaz je omejen na zadetke.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik vpiše iskani niz (del ali celotno ime opravila) v polje za filtriranje po imenu.</li>
    <li>Uporabnik potrdi filtriranje.</li>
    <li>Sistem poišče vsa uporabnikova opravila, katerih ime vsebuje iskani niz.</li>
    <li>Sistem prikaže seznam najdenih opravil.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Iskanje sproti</strong><br />
      2a. Sistem sproti ob vnosu posodablja seznam zadetkov.
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Prazen iskalni niz</strong><br />
      Sistem prikaže vse naloge (brez filtra) ali prikaže obvestilo, da je niz prazen (odvisno od dizajna).
    </li>
  </ul>
</section>

<hr />

<section id="pu-14">
  <h2>Primer uporabe: Filtriranje po roku opravila (PU-14)</h2>

  <p><strong>ID:</strong> PU-14</p>
  <p><strong>Cilj:</strong> Prikazati opravila znotraj določenega roka (npr. do določenega datuma).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong> Vsaj nekatera opravila imajo nastavljen rok.</p>

  <p><strong>Stanje sistema po PU:</strong> Nespremenjeno; prikaz omejen na opravila v izbranem časovnem intervalu.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik izbere možnost »Filtriraj po roku«.</li>
    <li>Sistem prikaže polja za vnos datuma (npr. »do datuma« ali »od – do«).</li>
    <li>Uporabnik vnese želeni datum(e).</li>
    <li>Uporabnik potrdi filtriranje.</li>
    <li>Sistem poišče opravila z rokom v izbranem obdobju.</li>
    <li>Sistem prikaže ustrezna opravila.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Filtriranje po zapadlih opravilih</strong>
      <ol>
        <li>3a. Uporabnik izbere možnost »prikaži vsa zapadla opravila«.</li>
        <li>5a. Sistem poišče vsa opravila z rokom v preteklosti.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Neveljaven datum</strong><br />
      Sistem prikaže sporočilo o napaki in ne izvede filtriranja.
    </li>
  </ul>
</section>

<hr />

<section id="pu-15">
  <h2>Primer uporabe: Filtriranje po statusu opravila (PU-15)</h2>

  <p><strong>ID:</strong> PU-15</p>
  <p><strong>Cilj:</strong> Prikaz opravil glede na njihov status (npr. »v teku«, »dokončano«, »zapadlo«).</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem</p>

  <p><strong>Predpogoji:</strong> Opravila imajo določene statuse.</p>

  <p><strong>Stanje sistema po PU:</strong> Nespremenjeno; uporabnik vidi le opravila izbranega statusa.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik izbere možnost »Filtriraj po statusu«.</li>
    <li>Sistem prikaže seznam možnih statusov.</li>
    <li>Uporabnik izbere enega ali več statusov (npr. samo »nedokončano«).</li>
    <li>Uporabnik potrdi filtriranje.</li>
    <li>Sistem prikaže seznam opravil z izbranim statusom.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Izbranih več statusov</strong>
      <ol>
        <li>3a. Uporabnik označi več statusov (npr. »v teku« in »zapadlo«).</li>
        <li>5a. Sistem prikaže vsa opravila, ki ustrezajo kateremu koli izbranemu statusu.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Ni opravil z izbranim statusom</strong><br />
      Sistem prikaže prazen seznam in obvestilo.
    </li>
  </ul>
</section>

<hr />

<section id="pu-16">
  <h2>Primer uporabe: Označi opravilo kot dokončano (PU-16)</h2>

  <p><strong>ID:</strong> PU-16</p>
  <p><strong>Cilj:</strong> Spremeniti status opravila v »dokončano«.</p>

  <p><strong>Akterji:</strong><br />
  Prijavljen uporabnik (lastnik ali upravičen)<br />
  Sistem<br />
  Povabljeni gost (če ima pravice)</p>

  <p><strong>Predpogoji:</strong><br />
  Opravilo obstaja.<br />
  Uporabnik ali gost ima pravico označevanja.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Status izbranega opravila je posodobljen na »dokončano«, zabeležijo se čas in uporabnik, ki je status spremenil.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Uporabnik ali povabljeni gost v seznamu najde želeno opravilo.</li>
    <li>Klikne na kontrolnik »Označi kot dokončano« (checkbox, gumb …).</li>
    <li>Sistem preveri pravice akterja.</li>
    <li>Sistem spremeni status opravila na »dokončano«.</li>
    <li>Sistem posodobi prikaz (npr. prečrtano, zelena ikona).</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Preklic označitve (vrnitev v nedokončano)</strong>
      <ol>
        <li>2a. Uporabnik ponovno klikne na označeno opravilo.</li>
        <li>4a. Sistem spremeni status nazaj na »nedokončano«.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Akter nima pravic za spremembo statusa</strong><br />
      Sistem prikaže sporočilo o pomanjkanju pravic.
    </li>
    <li><strong>E2 – Napaka pri shranjevanju statusa</strong><br />
      Sistem obvesti uporabnika, da statusa ni bilo mogoče posodobiti, in vmesnik vrne v prejšnje stanje.
    </li>
  </ul>
</section>

<hr />

<section id="pu-17">
  <h2>Primer uporabe: Pregled deljenih opravil (PU-17)</h2>

  <p><strong>ID:</strong> PU-17</p>
  <p><strong>Cilj:</strong> Povabljeni gost želi videti opravila, ki so bila z njim deljena.</p>

  <p><strong>Akterji:</strong><br />
  Sistem<br />
  Povabljeni gost (če ima pravice)</p>

  <p><strong>Predpogoji:</strong><br />
  Gost ima ustvarjen račun in je prijavljen.<br />
  Obstaja vsaj eno povabilo, ki ga je gost sprejel.</p>

  <p><strong>Stanje sistema po PU:</strong> Nespremenjeno; gre le za prikaz podatkov.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Povabljeni gost se prijavi v aplikacijo.</li>
    <li>Izbere možnost »Deljena opravila« ali podoben pogled.</li>
    <li>Sistem izvede PU-18: Preveri dovoljenje za vsako relevantno opravilo (include).</li>
    <li>Sistem prikaže seznam opravil, do katerih ima gost dostop.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Gost vidi opravila po različnih lastnikih</strong><br />
      3a. Sistem lahko prikaže opravila grupirana po lastnikih.
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Napaka pri branju podatkov ali dovoljenj</strong><br />
      Sistem prikaže obvestilo, da deljenih opravil trenutno ni mogoče prikazati.
    </li>
  </ul>
</section>

<hr />

<section id="pu-18">
  <h2>Primer uporabe: Preveri dovoljenje (PU-18)</h2>

  <p><strong>ID:</strong> PU-18</p>
  <p><strong>Cilj:</strong> Sistem preveri, ali ima trenutni uporabnik (npr. gost) pravico do ogleda ali urejanja določenega opravila.</p>

  <p><strong>Akterji:</strong><br />
  Sistem<br />
  Povabljeni gost<br />
  Prijavljen uporabnik</p>

  <p><strong>Predpogoji:</strong><br />
  Uporabnik je prijavljen.<br />
  Obstaja zapis povabila ali pravic za gosta.</p>

  <p><strong>Stanje sistema po PU:</strong> Nespremenjeno; le preverjanje pravic.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Sistem prejme zahtevo za dostop do opravila (npr. gost želi videti deljeno opravilo).</li>
    <li>Sistem poišče povabilo/pravice za kombinacijo (uporabnik, opravilo).</li>
    <li>Sistem preveri, ali je povabilo sprejeto in katera pravice ima gost.</li>
    <li>Sistem vrne rezultat: »dovoljeno« ali »prepovedano« ter katere akcije so dovoljene.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Privzete pravice za lastnika</strong><br />
      2a. Če je uporabnik lastnik opravila, sistem preskoči preverjanje povabila in mu omogoči vse akcije.
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Dovoljenja/povabilo ni najdeno</strong><br />
      Sistem obravnava dostop kot nedovoljen.
    </li>
  </ul>
</section>

<hr />

<section id="pu-19">
  <h2>Primer uporabe: Odpri povabilo za opravila (PU-19)</h2>

  <p><strong>ID:</strong> PU-19</p>
  <p><strong>Cilj:</strong> Povabljeni gost želi odpreti povabilo, ki ga je prejel (npr. preko e-pošte), in videti podrobnosti.</p>

  <p><strong>Akterji:</strong><br />
  Sistem<br />
  Povabljeni gost</p>

  <p><strong>Predpogoji:</strong> Povabilo obstaja in ima veljaven identifikator/povezavo.</p>

  <p><strong>Stanje sistema po PU:</strong> Status povabila je lahko posodobljen (npr. »ogledano«).</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Gost klikne povezavo v prejetem povabilu ali odpre povabilo znotraj aplikacije.</li>
    <li>Sistem prebere identifikator povabila.</li>
    <li>Sistem poišče povabilo v bazi.</li>
    <li>Sistem prikaže podrobnosti povabila (informacije o opravilu, lastniku, pravicah, gumb »Sprejmi« / »Zavrni«).</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Gost ni prijavljen</strong>
      <ol>
        <li>1a. Sistem gostu najprej ponudi prijavo/registracijo.</li>
        <li>1b. Po uspešni prijavi sistem ponovno odpre povabilo.</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Povabilo ne obstaja ali je poteklo</strong><br />
      Sistem prikaže sporočilo, da je povabilo neveljavno ali poteklo, in ne omogoči sprejema.
    </li>
  </ul>
</section>

<hr />

<section id="pu-20">
  <h2>Primer uporabe: Sprejmi povabilo (PU-20)</h2>

  <p><strong>ID:</strong> PU-20</p>
  <p><strong>Cilj:</strong> Gost želi sprejeti povabilo in dobiti dostop do deljenega opravila.</p>

  <p><strong>Akterji:</strong><br />
  Sistem<br />
  Povabljeni gost</p>

  <p><strong>Predpogoji:</strong><br />
  Povabilo je veljavno in odprto (PU-19).<br />
  Gost je prijavljen.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Status povabila je posodobljen na »sprejeto«.<br />
  Gost ima v sistemu aktivne pravice za ustrezno opravilo.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Gost odpre povabilo (PU-19).</li>
    <li>Gost klikne gumb »Sprejmi«.</li>
    <li>Sistem preveri veljavnost povabila (ni poteklo, ni že sprejeto/odklonjeno).</li>
    <li>Sistem spremeni status povabila na »sprejeto«.</li>
    <li>Sistem ustvari zapis dostopa med gostom in opravilom (če še ne obstaja).</li>
    <li>Sistem obvesti gosta, da je povabilo uspešno sprejeto, in mu ponudi gumb »Pojdi na opravilo«.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Gost spremeni odločitev po sprejemu (npr. želi »odstraniti dostop«)</strong>
      <ol>
        <li>6a. Gost v nastavitvah dostopa izbere možnost »Zapusti deljeno opravilo«.</li>
        <li>6b. Sistem odstrani povezavo med gostom in opravilom in po potrebi status povabila spremeni (npr. »preklicano z gostove strani«).</li>
      </ol>
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Povabilo je že sprejel nekdo drug</strong> (ne bi se smelo zgoditi, če je vezano na enak e-poštni naslov)<br />
      Sistem prikaže sporočilo, da je povabilo že uporabljeno.
    </li>
    <li><strong>E2 – Napaka pri shranjevanju statusa</strong><br />
      Sistem obvesti gosta, da sprejem ni uspel, povabilo ostane v prejšnjem statusu.
    </li>
  </ul>
</section>

<hr />

<section id="pu-21">
  <h2>Primer uporabe: Sprejmi povabilo (zavrnitev) (PU-21)</h2>

  <p><strong>ID:</strong> PU-21</p>
  <p><strong>Cilj:</strong> Gost želi povabilo zavrniti in ne dobiti dostopa do deljenega opravila.</p>

  <p><strong>Akterji:</strong><br />
  Sistem<br />
  Povabljeni gost</p>

  <p><strong>Predpogoji:</strong><br />
  Povabilo je veljavno in odprto (PU-19).<br />
  Gost je prijavljen ali dostopa preko veljavne povezave.</p>

  <p><strong>Stanje sistema po PU:</strong><br />
  Status povabila je posodobljen na »zavrnjeno«.<br />
  Gost ne dobi pravic do opravila.</p>

  <h3>Scenarij</h3>
  <ol>
    <li>Gost odpre povabilo (PU-19).</li>
    <li>Gost klikne gumb »Zavrni«.</li>
    <li>Sistem preveri veljavnost povabila.</li>
    <li>Sistem nastavi status povabila na »zavrnjeno«.</li>
    <li>Sistem prikaže sporočilo, da je povabilo zavrnjeno in da gost ne bo imel dostopa do opravila.</li>
  </ol>

  <h3>Alternativni tokovi</h3>
  <ul>
    <li><strong>A1 – Gost si premisli in kasneje želi dostop</strong><br />
      5a. Gost kontaktira lastnika opravila, ta pa ustvari novo povabilo (ponoven zagon PU-05).
    </li>
  </ul>

  <h3>Izjeme</h3>
  <ul>
    <li><strong>E1 – Povabilo je že zavrnjeno ali poteklo</strong><br />
      Sistem prikaže informativno sporočilo, da je povabilo že neaktivno.
    </li>
  </ul>
</section>
