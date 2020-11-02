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
    this.doGory    = false;
    this.doDolu    = false;
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
    pong.gracze    = [];
    pong.gracze[0] = new Rakietka('Gracz Lewy',  15, 60, 7, '#07e');
    pong.gracze[1] = new Rakietka('Gracz Prawy', 15, 60, 7, '#07e');
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
    pong.gracze[0].x      = 0;
    pong.gracze[1].x      = canvas.width - pong.gracze[1].szerokosc;
    pong.gracze[0].y      = (canvas.height - pong.gracze[0].dlugosc)/2;
    pong.gracze[1].y      = (canvas.height - pong.gracze[1].dlugosc)/2;
}

// obsluga klawiszy a,z,k,m,spacja - zdarzenie nacisniecia klawisza
function keyDownHandler(e) {
    if (e.keyCode == 65) { pong.gracze[0].doGory = true; } else
    if (e.keyCode == 75) { pong.gracze[1].doGory = true; } else
    if (e.keyCode == 90) { pong.gracze[0].doDolu = true; } else
    if (e.keyCode == 77) { pong.gracze[1].doDolu = true; } else
    if (e.keyCode == 32) { pong.pauza = !pong.pauza }
}

// obsluga klawiszy a,z,k,m - zdarzenie puszczenia klawisza
function keyUpHandler(e) {
    if (e.keyCode == 65) { pong.gracze[0].doGory = false; } else
    if (e.keyCode == 75) { pong.gracze[1].doGory = false; } else
    if (e.keyCode == 90) { pong.gracze[0].doDolu = false; } else
    if (e.keyCode == 77) { pong.gracze[1].doDolu = false; }
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
    ctx.textAlign = "left";
    ctx.fillText(pong.gracze[0].nazwa + ": " + pong.gracze[0].wynik, 20, 20);
    ctx.textAlign = "right";
    ctx.fillText(pong.gracze[1].nazwa + ": " + pong.gracze[1].wynik, canvas.width - 20, 20);
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
    pong.gracze[0].rysuj();
    pong.gracze[1].rysuj();
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

    // obsluga graczy
    for (i = 0; i < pong.gracze.length; i++) {
        // przesuniecie rakietki w gore
        if (pong.gracze[i].doGory && pong.gracze[i].y > 0) {
            pong.gracze[i].y -= pong.gracze[i].offset;
        }

        // przesuniecie rakietki w dol
        if (pong.gracze[i].doDolu && pong.gracze[i].y + pong.gracze[i].dlugosc < canvas.height) {
            pong.gracze[i].y += pong.gracze[i].offset;
        }

        // odbijanie pilki
        if (czyOdbiciePilki(pong.gracze[i], pong.pilka)) {
            pong.pilka.offsetX = -pong.pilka.offsetX;

            // jesli w trakcie odbicia rakietka sie rusza, to zmieniamy offset Y (pilka zmienia kat)
            if (pong.gracze[i].doGory) { pong.pilka.offsetY--; }
            if (pong.gracze[i].doDolu) { pong.pilka.offsetY++; }
        }
    }

    // zdobycie punktu: gracz P
    if (pong.pilka.x < pong.gracze[0].szerokosc) {
        pong.gracze[1].wynik++;
        pong.stan = 2;
        pong.pauza = true;
    }

    // zdobycie punktu: gracz L
    if (pong.pilka.x > canvas.width - pong.gracze[1].szerokosc) {
        pong.gracze[0].wynik++;
        pong.stan = 2;
        pong.pauza = true;
    }

    // wygrana gracza i
    for (i = 0; i < pong.gracze.length; i++) {
        if (pong.gracze[i].wynik == pong.liczbaZyc) {
            pong.stan = 3;
            pong.pauza = true;
            pong.zwyciezca = i;
        }
    }
}

// funkcja glowna zawierajaca logike gry
function graj() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graRysuj();

    if (pong.pauza) {
        switch(pong.stan) {
            case 0:
                wyswietlNaglowek('Poruszanie rakietkami: A,Z oraz K,M');
                wyswietlWskazowki('(Wciśnij SPACJĘ)');
                break;
            case 2:
                graReset();
                wyswietlNaglowek('Punkt!');
                wyswietlWskazowki('(Wciśnij SPACJĘ)');
                break;
            case 3:
                graReset();
                wyswietlNaglowek(pong.gracze[pong.zwyciezca].nazwa + ' wygrywa!');
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
