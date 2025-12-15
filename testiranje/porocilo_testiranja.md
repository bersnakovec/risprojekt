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

<h3>3. TaskSharingControllerTest</h3>
<strong>Test TaskSharingControllerTest</strong> preverja delovanje endpointa za deljenje nalog med uporabniki.

<ul>
<li><strong>Pozitivni scenarij</strong> preverja, ali lahko uporabnik uspešno doda drugega uporabnika k nalogi prek ustreznega endpointa. Test simulira prijavljenega uporabnika in preveri, da je endpoint dosegljiv in vrne status 200.</li>
</ul>
Ti testi so pomembni, ker zagotavljajo pravilno delovanje funkcionalnosti za skupinsko delo in sodelovanje med uporabniki, kar je ključno za večuporabniško uporabo aplikacije.

<h3>4. TaskCompletionControllerTest</h3>
<strong>Test TaskCompletionControllerTest</strong> preverja delovanje endpointa za označevanje skupnih nalog kot opravljenih.

<ul>
<li><strong>Pozitivni scenarij</strong> preverja, ali lahko uporabnik, ki je del skupne naloge, uspešno označi nalogo kot opravljeno. Test preveri, da se status naloge ustrezno spremeni in da endpoint vrne status 200 ter posodobljen objekt naloge.</li>
</ul>
Ti testi so pomembni, ker zagotavljajo, da lahko več uporabnikov sodeluje pri opravljanju nalog in da se spremembe pravilno zabeležijo v sistemu.

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
      <td>Lenart Beršnak</td>
      <td>Implementacija in testiranje <code>TaskControllerTest</code></td>
    </tr>
  </tbody>
</table>

<hr>

<h2>📊 Analiza uspešnosti testov</h2>

<ul>
<li>Test <code>UserServiceTest</code> potrjuje, da se uporabnik ob pravilnih vhodnih podatkih uspešno registrira, pri čemer se preverja pravilno kodiranje gesla in vračanje uporabniškega objekta. Hkrati test potrjuje, da sistem prepreči registracijo ob poskusu uporabe že obstoječega uporabniškega imena, kar zagotavlja doslednost in integriteto podatkov.</li>

<li>Test <code>AuthControllerTest</code> potrjuje pravilno delovanje prijavnega mehanizma, saj ob uspešni prijavi vrača ustrezen HTTP status in avtentikacijski žeton. Negativni scenarij preverja, da sistem ob napačnih prijavnih podatkih pravilno zavrne dostop in vrne statusno kodo 401, kar prispeva k varnosti aplikacije.</li>

<li>Testa v <code>TaskSharingControllerTest</code> potrjujeta, da lahko uporabnik uspešno doda drugega uporabnika k nalogi in da sistem pravilno obravnava skupno lastništvo nalog in da lahko vsak uporabnik, ki je del skupne naloge, to nalogo tudi uspešno označi kot opravljeno.</li>
</ul>

<hr>