<h1>Navodila za nameščanje in zagon (za uporabnika brez ničesar nameščenega)</h1>
<h2>Kratek uvod</h2>
Ta projekt vsebuje dve ločeni aplikaciji: backend (Spring Boot, Java) v tasklist in frontend (React) v frontend. Backend po privzetih nastavitvah pričakuje MySQL bazo, vendar je na voljo tudi hiter način z uporabo vgrajene H2 baze (navodila spodaj). Backend teče na privzetem portu 8080; frontend v razvoju na 3000.
<ol>
    <li>Predpogoji (kaj namestiti)</li>
    <ul>
        <li>Java JDK 21 (npr. Eclipse Temurin / Adoptium ali Oracle/OpenJDK). Prenesi z: https://www.oracle.com/java/technologies/downloads/#java21 (izberi JDK 21).</li>
        <li>Git (opcijsko, če želiš klonirati repozitorij): https://git-scm.com</li>
        <li>(Neobvezno) MySQL Workbench, če želiš zagnati aplikacijo z MySQL podatkovno bazo: https://dev.mysql.com/downloads/workbench/</li>
        <li>Node.js (vključuje npm) — priporočam LTS (npr. 18 ali 20): https://nodejs.org</li>
        <li>(Ni potreben) Maven — v projektu je Maven Wrapper (mvnw / mvnw.cmd), zato ni nujno da nameščaš Maven globalno.</li>
    </ul>
    <li>Priprava podatkovne baze</li>
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
    <li>Zagon backenda</li>
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