# CODERSE präsentiert: Code-casts

Die aktuelle _Release_-Version dieses Projekts kann unter: https://coderse.software-engineering.education aufgerufen werden.
Installation ist keine notwendig. Sie können sich einen eigenen Account erstellen (die E-Mail-Adresse muss nicht valide sein).

Code-Cast ist eine Web-Applikation, um umfangreiche Code-Dateien mithilfe von Sprachnachrichten zu erläutern. Es gibt die Möglichkeit Stellen im Code zu markieren und mit Sprachnachrichten zu verbinden. Außerdem kann man alle Sprachnachrichten als ein "Code-Cast" anhören. Es gibt außerdem die Möglichkeit den Code-Cast mit anderen zu teilen. Betrachter benötigen dafür keinen eigenen Account. Ziel ist es den Code durch Sprachnachrichten verständlich erklären zu können. Dies vereinfacht die Dokumentation von Code für die Gruppenarbeit oder auch die Vorstellung von Code, beispielsweise in der Lehre.

## Screenshots der Anwendung:


## Kommentare.md:

Erreichter Zustand: Die Applikation wurde wie in der Projektvision geplant umgesetzt.

Nicht implementiert wurde die Bearbeitung von mehr als einer Person an einem Codecast. Das heißt, die Aussage:"[...] indem mehrere Teammitglieder zum geteilten Code wichtige Anmerkungen machen können" haben wir nicht implementiert. Die Möglichkeit einen Cast gemeinsam zu bearbeiten funktioniert theoretisch durch die Nutzung eines gemeinsamen Accounts. Wir haben diese Funktion nicht implementiert, da es technisch nicht möglich ist gleichzeitig Aufnahmen zu einem Cast aufzunehmen. 
Die Übersicht der Casts haben wir anders als geplant implementiert. Wir haben diese in dem Home-Screen gelegt und nicht wie gedacht direkt auf der rechetn Seite des Create-Screens.

Zusammenfassung der Arbeitsaufteilung:
Wir haben gemeinschaftlich an der Applikation gearbeitet und nur in einzelnen Fällen Aufgaben allein erledigt. Wir haben uns über Discord und persönlich getroffen und vor jeder Sitzung in Driver und Navigator aufgeteilt. Für Sitzungen über Discord haben wir den Liveshare von Visual Studio Code und das Bildschirmteilen über Discord verwendet. Da wir zusammen gearbeitet haben, wäre es sehr schwer, einzelne Programmbestandteile einzelnen Personen zuzuschreiben. 

## Ablauf der einzelnen Sitzungen

Sitzungsablauf

Unsere 1. Sitzung: 28.02.22 13:30

- Grundsätzliche Struktur auf Miro
- Funktionen des MVP definieren
- Aufteilung erster Aufgaben
- Aufbau User-Edit-Screen + HTML-Implementierung

Unsere 2. Sitzung: 01.03.22 08:00 - 12:00

- Datei Drag and Drop
- Timeline Entries erstellen
- Komponenten Kommunikation

Unsere 3. Sitzung: 01.03.22 20:00 - 22:00

- Verschönerungen im CSS

Unsere 4. Sitzung: 02.03.22 8:30 - 13:00

- Strukturierung durch MVC
- Aufnahme von Audio-Daten
- Korrekte Anzeige von Audio-Daten im AudioPlayer

Unsere 5. Sitzung: 02.03.22 16:45 - 17:15

- Verschönerungen im CSS

Unsere 6. Sitzung: 03.03.22 08:45 - 10:45

- Code Cast kann erstellt werden
- Generelle Datenverwaltung in Models
- Verbinden von Daten mit UI 
    -> Audios können abgespielt werden
    -> Timeline Einträge können gelöscht werden
    -> Timeline Eintäge und Cast können benannt werden

Unsere 7. Sitzung: 03.03.22 20:11 - 21:11

- CSS Verbesserungen (user select / neue Buttons / DropZone)
- File Select

Unsere 8. Sitzung: 04.03.22 08:00 - 12:05

- Navigation zwischen den Audios
- Gesamten Cast abspielen
- Timer und Markierung der einzelnen Timeline Entrys beim Abspielen

Unsere 9. Sitzung: 07.03.22 09:00 - 13:10

- Bug fixes -> Audios können nun gestoppt und gelöscht werden
- Audioaufnahme wurde verbessert -> weitere Icons
- Markierung des Codes wurde eingeführt und verbessert

TODO:
    - RecordManager:
        - wenn geskippt wird und dann gestoppt, soll auch der cast gestoppt werden
        - cast-end event muss geworfen werden, wenn der letzte track fertig ist -> zeigt wieder den play button an und versteckt den stopp button
        

Unsere 10. Sitzung: 08.03.22 09:45 - 12:20

- Markierungen werden hervorgehoben, wenn man über die Audio hovert
- Zusammengehörige Markierungen werden beim hovern über diese angezeigt
- Audio-Abspiel-Bugs wurden behoben
- Es ist nun möglich Aufnahmen zu skippen, solte man diese einzeln abspielen
- Der Start Cast Button wird nur angezeigt, sollte ein valides File geladen werden
- Der Audio-Title einer Aufnahme kann nun auch im nachhinein mit einem Click auf den Titel verändert werden
- Sollte bei der Audioaufnahme kein Titel vergeben werden, wird ein nummerierter Titel vergeben


Unsere 11. Sitzung: 09.03.22 10:00 - 11:00

- Entfernen der Log-Statements
- Auslagern der Drop-View
- Auslagern der Magic Numbers
- Eslint Fehler behoben


Unsere 12. Sitzung: 10.03.22 10:00 - 14:30

- Hash Router zur Navigation in der SPA
- Tooltip feature über Css Klassen und HTMl Elemente


Unsere 13. Sitzung: 11.03.22 10:30 - 14:00 , 15:00 - 16:00

- Appwrite Test und Überarbeitung
- User Authentication gestartet
- Login Page gestartet (kein css)


Unsere 14. Sitzung: 12.03.22 13:00 - 14:00 , 15:00 - 17:30

- Navbar Veränderung während dem routing
- User Authentication 
- Login Page 


Unsere 15. Sitzung: 13.03.22 11:00 - 12:30

- Home screen cast liste mit Cast Collection verbunden
- Appwrite Verbesserungen
- Login Verbesserungen


Unsere 16. Sitzung: 13.03.22 17:00 - 19:00

- Register Screen (fast fertig (wieder nur JS))


Unsere 17. Sitzung: 14.03.2022 10:51

Löst folgende Probleme:
- Zu viele Serveranfragen wenn nicht authorisiert
- wenn nicht eingeloggt -> man gibt "home" oder eine andere route einfach oben rein, dann läd die Seite trotzdem 


Unsere 18. Sitzung: 14.03.2022 17:00 - 19:00

- major bugfixes
- Navigation Account dropdown
- Registration beendet


Unsere 19. Sitzung: 15.03.2022 09:00 - 13:00
- erstellen von .ogg Audio Daten möglich
- erstellen von txt Datei für Code möglich
- Start Datensicherung in der Cloud


Unsere 20. Sitzung 15.03.2022
- Share Feature durch dynamische Route
- Router fixes bezüglich des sharens
- Copy to Clipboard feature


Unsere 21. Sitzung 16.03.2022 
- View-Button auf Cast auf Home-Screen: Per Klick wird auf create Cast gewechselt (Audio in View angezeigt (in Bearbeitung))
- Cast wird als JSON in Appwrite gesichert
- Der markierte Code wird als Text File auf Appwrite gespeichert
- Die AudioFiles werden als .ogg auf Appwrite gespeichert
    

Unsere 22. Sitzung 16.03.2022 
- Heruntergeladene Audios können abgespielt werden
- Code Cast kann editiert werden
- Major bug fixes


Unsere 23. Sitzung 17.03.2022 
- Share View funktioniert
- Creator wird angezeigt
    

Unsere 24. Sitzung 17.03.2022 
- Permissions für Cast editen gelöst -> Bevor dem Edit wird überprüft ob der User, welcher den Cast erstellt hat der derzeitige User ist
- Code Cast delete im Home Screen
- Files aus Storage werden gelöscht, wenn diese aus dem Cast entfernt werden (erst beim speichern der Änderungen)
    

Unsere 25. Sitzung 18.03.2022 
- CSS/HTML Verbesserungen


Unsere 26. Sitzung 19.03.2022 
- Update Account feature


Unsere 27. Sitzung 20.03.2022 
- Update CSS/HTML für Homescreen


Unsere 28. Sitzung 21.03.2022 
- Gelöst: Appwrite Bug: Hochgeladenes TXT wird nicht geupdated -> code kann nicht gesichert werden
- Copy to Clipboard hinzugefügt
- Share-Link kann nicht bearbeitet werden


Unsere 29. Sitzung 22.03.2022 
- Es wird eine Errormessage nun angezeigt, wenn beim Login / Registrierung / Accountänderung etwas falsch läuft


Unsere 30. Sitzung 23.03.2022 
- Einfaches (noch verbesserbares) Onboarding bei Cast Creation mit Verbindung zum LocalStorage
- Tooltips am Home Screen
- Fixes for build


Unsere 31. Sitzung 26.03.2022 9:00-13:00 Uhr
- Drag and Drop der einzelnen Entries in der Playerlist + Update in Database


Unsere 32. Sitzung 30.03.2022 
- Große UI Verbesserungen
- Popupmöglichkeit


Unsere 33. Sitzung 31.03.2022 
- Audiobug behoben: Wenn Audioaufnahme läuft und von Create Cast weggewechselt wird wird nun gefragt, ob die Audio gespeichert werden soll
- Intro verbessert


Unsere 34. Sitzung 31.03.2022 
- Success modal für copy to clipboard und browser unabhaengigkeit 
- Help Button to restart tutorial


Unsere 35. Sitzung 04.04.2022
- UI-Verbesserungen: Loading-Icon bei Save, Abstandsverbesserungen, Save-Button leitet zu Homescreen, Home-Tab ist versteckt auf Home-Account, Codeview tiefer
- Help / Tutorial in home -> Abspielen nach erstem LogIn
- Fix Audio-Title Bug


Unsere 36. Sitzung 05.04.22
- Login möglich nun durch drücken der Entertaste im Passwortfeld
- Copy to clipboard popup wurde verlängert
- Verbesserung des Tutorials, auf dem Homescreen sowie beim erstellen eines Casts
- Cast Titel wird auf Filenamen gesetzt
- Aufnahme Animation wird angezeigt, um die Nutzer:innen über die laufende Aufnahme zu informieren

Unsere 37. Sitzung 05.04.22
- Impressum hinzugefügt im Homescreen 


### Verwendete Ressourcen
https://feathericons.com/
https://github.com/feathericons/feather#feather
Logo-Font: https://www.fontsquirrel.com/fonts/norwester unter der SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
