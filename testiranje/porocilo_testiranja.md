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
  </tbody>
</table>

<hr>

<h2>📊 Analiza uspešnosti testov</h2>

<ul>
<li>Test <code>UserServiceTest</code> potrjuje, da se uporabnik ob pravilnih vhodnih podatkih uspešno registrira, pri čemer se preverja pravilno kodiranje gesla in vračanje uporabniškega objekta. Hkrati test potrjuje, da sistem prepreči registracijo ob poskusu uporabe že obstoječega uporabniškega imena, kar zagotavlja doslednost in integriteto podatkov.</li>

<li>Test <code>AuthControllerTest</code> potrjuje pravilno delovanje prijavnega mehanizma, saj ob uspešni prijavi vrača ustrezen HTTP status in avtentikacijski žeton. Negativni scenarij preverja, da sistem ob napačnih prijavnih podatkih pravilno zavrne dostop in vrne statusno kodo 401, kar prispeva k varnosti aplikacije.</li>
</ul>

<hr>