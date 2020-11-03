var canvas = document.getElementById('mojaGra');
var ctx = canvas.getContext('2d');
var pong = {};

// konstruktor obiektu pilka
function Pilka(promien, kolor) {
    this.x       = 0,
    this.y       = 0,
    this.offsetX = 0,
    this.offsetY = 0,
    this.promien = promien,
    this.kolor   = kolor,
    this.rysuj   = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.promien, 0, Math.PI*2);
        ctx.fillStyle = this.kolor;
        ctx.fill();
        ctx.closePath();
    }
}

// konstruktor obiektu gracz (rakietka)
function Rakietka(nazwa, szerokosc, dlugosc, offset, kolor) {
    this.x         = 0;
    this.y         = 0;
    this.wynik     = 0;
    this.nazwa     = nazwa;
    this.szerokosc = szerokosc;
    this.dlugosc   = dlugosc;
    this.offset    = offset;
    this.kolor     = kolor;
    //this.doGory    = false;
    //this.doDolu    = false;
    this.wPrawo    = false;
    this.wLewo     = false;
    this.rysuj     = function() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.szerokosc, this.dlugosc);
        ctx.fillStyle = this.kolor;
        ctx.fill();
        ctx.closePath();
    }
}

// inicjacja nowej gry
function graInit() {
    pong.stan      = 0;  // 0: poczatek, 1: gra w trakcie, 2: zdobyty punkt, 3: koniec
    pong.pauza     = true;
    pong.pilka     = new Pilka(10, '#d50');
    pong.gracz = new Rakietka('Gracz', 100, 15, 7, '#07e');
    pong.liczbaZyc = 10;
    pong.zwyciezca = 0;
    graReset();
}

// reset po zdobyciu punktu
function graReset() {
    pong.pilka.x          = canvas.width/2;
    pong.pilka.y          = canvas.height/2;
    pong.pauza            = true;
    pong.pilka.offsetX    = 6;
    pong.pilka.offsetY    = 2;
    pong.gracz.x      = (canvas.width - pong.gracz.szerokosc)/2;
    pong.gracz.y      = (canvas.height - pong.gracz.dlugosc);
}

// obsluga klawiszy strzałka prawo i lewo, spacja - zdarzenie nacisniecia klawisza
function keyDownHandler(e) {
    if (e.keyCode == 37) { pong.gracz.wPrawo = true; } else
    if (e.keyCode == 39) { pong.gracz.wLewo = true; } else
    if (e.keyCode == 32) { pong.pauza = !pong.pauza }
}

// obsluga klawiszy strzałka prawo i lewo - zdarzenie puszczenia klawisza
function keyUpHandler(e) {
    if (e.keyCode == 37) { pong.gracz.wPrawo = false; } else
    if (e.keyCode == 39) { pong.gracz.wLewo = false; }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// weryfikacja czy rakietka odbija pilke
function czyOdbiciePilki(rect,circle){
    var dx=Math.abs(circle.x-(rect.x+rect.szerokosc/2));
    var dy=Math.abs(circle.y-(rect.y+rect.dlugosc/2));
    if( dx > circle.promien+rect.szerokosc/2 ){ return(false); }
    if( dy > circle.promien+rect.dlugosc/2 ){ return(false); }
    if( dx <= rect.szerokosc ){ return(true); }
    if( dy <= rect.dlugosc ){ return(true); }
    var dx=dx-rect.szerokosc;
    var dy=dy-rect.dlugosc
    return(dx*dx+dy*dy<=circle.promien*circle.promien);
}

// wyswietlanie wyniku
function wyswietlWynik() {
    ctx.font = "16px Verdana";
    ctx.fillStyle = "#d46";
    ctx.textAlign = "right";
    ctx.fillText(pong.gracz.nazwa + ": " + pong.gracz.wynik, canvas.width - 20, 20);
}

// wyswietl naglowek
function wyswietlNaglowek(tekst) {
    ctx.font = '20px Verdana';
    ctx.fillStyle = '#e60';
    ctx.textAlign = 'center';
    ctx.fillText(tekst, canvas.width/2, 60);
}

// wyswietl wskazowki
function wyswietlWskazowki(tekst) {
    ctx.font = '14px Verdana';
    ctx.fillStyle = '#e60';
    ctx.textAlign = 'center';
    ctx.fillText(tekst, canvas.width/2, 90);
}

// rysuj stan gry
function graRysuj() {
    pong.pilka.rysuj();
    pong.gracz.rysuj();
    wyswietlWynik();
}

// wykonaj przeksztalcenia gry
function graPrzeksztalc() {
    // przesuniecie pilki o offset
    pong.pilka.x += pong.pilka.offsetX;
    pong.pilka.y += pong.pilka.offsetY;

    // obsluga odbic pilki od poziomych scian
    if (pong.pilka.y + pong.pilka.promien/2 >= canvas.height || pong.pilka.y - pong.pilka.promien/2 <= 0) {
        pong.pilka.offsetY = -pong.pilka.offsetY;
    }

    // obsluga odbic pilki od pionowych scian
    if (pong.pilka.x - pong.pilka.promien/2 <= 0 || pong.pilka.x + pong.pilka.promien/2 >= canvas.width) {
      pong.pilka.offsetX = -pong.pilka.offsetX;
    }

        if (pong.gracz.wPrawo && pong.gracz.x > 0) {
            pong.gracz.x -= pong.gracz.offset;
        }

        if (pong.gracz.wLewo && pong.gracz.x + pong.gracz.szerokosc < canvas.width) {
            pong.gracz.x += pong.gracz.offset;
        }

        // odbijanie pilki
        if (czyOdbiciePilki(pong.gracz, pong.pilka)) {
            pong.pilka.offsetY = -pong.pilka.offsetY;

            // jesli w trakcie odbicia rakietka sie rusza, to zmieniamy offset Y (pilka zmienia kat)
            if (pong.gracz.wPrawo) { pong.pilka.offsetY--; }
            if (pong.gracz.wLewo) { pong.pilka.offsetY++; }
        }
    // }

    // zdobycie punktu: gracz L
    if (pong.pilka.y >= canvas.height - pong.gracz.dlugosc) {
        pong.gracz.wynik--;
        pong.stan = 2;
        pong.pauza = true;
    }

    // wygrana gracza i
    // for (i = 0; i < pong.gracz.length; i++) {
        if (pong.gracz.wynik == pong.liczbaZyc) {
            pong.stan = 3;
            pong.pauza = true;
            pong.zwyciezca = i;
        }
    // }
}

// funkcja glowna zawierajaca logike gry
function graj() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graRysuj();

    if (pong.pauza) {
        switch(pong.stan) {
            case 0:
                wyswietlNaglowek('Poruszanie rakietka:strzałki prawo i lewo');
                wyswietlWskazowki('(Wciśnij SPACJĘ)');
                break;
            case 2:
                graReset();
                // wyswietlNaglowek('Punkt!');
                wyswietlWskazowki('(Wciśnij SPACJĘ)');
                break;
            case 3:
                graReset();
                wyswietlNaglowek(pong.gracz[pong.zwyciezca].nazwa + 'wygrywa!');
                wyswietlWskazowki('Ponowna gra: SPACJA');
                break;
            default:
                wyswietlNaglowek('Pauza');
                wyswietlWskazowki('Wznowienie gry: SPACJA');
        }
    } else {
        switch(pong.stan) {
            case 0:
            case 2:
                pong.stan = 1;
                break;
            case 3:
                graInit();
                break;
            default:
                graPrzeksztalc();
        }
    }

    // odswiezanie
    requestAnimationFrame(graj);
}

graInit();
graj();
