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
