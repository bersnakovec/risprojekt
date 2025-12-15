<h1>📄 Poročilo o unit testiranju zaledja</h1>

<h2>📚 Opis testov</h2>

<h3>1. UserServiceTest</h3>
<strong>Test UserServiceTest</strong> preverja poslovno logiko, povezano z registracijo uporabnika.

<ul><li><strong>Pozitivni scenarij</strong> preverja uspešno registracijo uporabnika, kadar uporabniško ime in e-pošta še ne obstajata. Test preveri, ali se uporabnik pravilno ustvari in ali se geslo ustrezno zakodira.</li>

<li><strong>Negativni scenarij</strong> preverja, ali se ob poskusu registracije z že obstoječim uporabniškim imenom sproži ustrezna izjema.</li>
</ul>
Ti testi so pomembni, ker zagotavljajo pravilno delovanje osnovne logike aplikacije brez zagona baze podatkov ali Spring konteksta.

<h3>2. AuthControllerTest</h3>
<strong>Test AuthControllerTest</strong> preverja delovanje REST endpointa za prijavo uporabnika.

<ul><li><strong>Pozitivni scenarij</strong> preverja uspešno prijavo uporabnika in vračilo JWT žetona ob pravilnih prijavnih podatkih.</li>

<li><strong>Negativni scenarij</strong> preverja, ali sistem ob napačnih prijavnih podatkih vrne statusno kodo 401 Unauthorized in ustrezno sporočilo.</li></ul>

Ti testi so pomembni, saj zagotavljajo pravilno delovanje avtentikacijskega mehanizma in pravilno obravnavo napak na nivoju kontrolerja.

<h3>3. TaskControllerTest</h3>
<strong>Test TaskControllerTest</strong> preverja delovanje REST API končnih točk za upravljanje nalog (tasks).

<ul><li><strong>Pozitivni scenarij</strong> testira uspešno kreiranje nove naloge preko POST <code>/api/tasks</code> endpointa. Test preverja, ali se naloga pravilno ustvari, ali se vrne HTTP status 201 CREATED, ter ali je trenutno avtenticirani uporabnik avtomatsko dodan med uporabnike naloge. Test uporablja <code>@WithMockUser</code> anotacijo za simulacijo avtentifikacije.</li>

<li><strong>Negativni scenarij</strong> testira brisanje neobstoječe naloge preko DELETE <code>/api/tasks/{id}</code> endpointa. Test preverja, ali sistem pravilno obravnava poskus brisanja naloge, ki ne obstaja ali do katere uporabnik nima dostopa. Pričakuje se HTTP status 404 NOT FOUND, pri čemer test tudi preverja, da <code>repository.deleteById()</code> metoda nikoli ni klicana, kar zagotavlja varnost aplikacije.</li></ul>

Ti testi so pomembni, ker zagotavljajo pravilno delovanje osnovnih CRUD operacij na nalogah ter pravilno implementacijo varnostnih mehanizmov, ki preprečujejo nepooblaščen dostop do podatkov drugih uporabnikov.

<hr>

<h2>👦 Člani skupine in odgovornosti</h2>

<table>
  <thead>
    <tr>
      <th>Ime in priimek</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Gašper Kavčič</td>
      <td>Implementacija in testiranje <code>UserServiceTest</code></td>
    </tr>
    <tr>
      <td>Gašper Kavčič</td>
      <td>Implementacija in testiranje <code>AuthControllerTest</code></td>
    </tr>
    <tr>
      <td>Timotej Lipic</td>
      <td>Implementacija in testiranje <code>TaskControllerTest</code> (kreiranje naloge)</td>
    </tr>
    <tr>
      <td>Timotej Lipic</td>
      <td>Implementacija in testiranje <code>TaskControllerTest</code> (brisanje neobstoječe naloge)</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>📊 Analiza uspešnosti testov</h2>

<ul>
<li>Test <code>UserServiceTest</code> potrjuje, da se uporabnik ob pravilnih vhodnih podatkih uspešno registrira, pri čemer se preverja pravilno kodiranje gesla in vračanje uporabniškega objekta. Hkrati test potrjuje, da sistem prepreči registracijo ob poskusu uporabe že obstoječega uporabniškega imena, kar zagotavlja doslednost in integriteto podatkov.</li>

<li>Test <code>AuthControllerTest</code> potrjuje pravilno delovanje prijavnega mehanizma, saj ob uspešni prijavi vrača ustrezen HTTP status in avtentikacijski žeton. Negativni scenarij preverja, da sistem ob napačnih prijavnih podatkih pravilno zavrne dostop in vrne statusno kodo 401, kar prispeva k varnosti aplikacije.</li>

<li>Test <code>TaskControllerTest</code> potrjuje pravilno delovanje osnovnih CRUD operacij za upravljanje nalog. Pozitivni scenarij potrjuje, da se nova naloga uspešno ustvari in shrani v sistem, pri čemer se avtenticirani uporabnik avtomatsko doda k nalogi. Negativni scenarij preverja varnostne mehanizme aplikacije, saj zagotavlja, da sistem pravilno zavrne poskus brisanja neobstoječe naloge ali naloge, do katere uporabnik nima dostopa. S pomočjo testov je bila odkrita pomembnost pravilne implementacije <code>findByIdAndUsersContaining</code> metode, ki zagotavlja, da uporabniki lahko dostopajo le do svojih nalog.</li>
</ul>

<hr>