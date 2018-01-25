class Notes {
    constructor() { }

    createNote(noteValues = "") {
        let title = title_note.textContent;
        let text = note_text.textContent;
        let isPinned = false;
        //    console.log(storage.length)
        if (storage) {
            if (storage.length > 2 && loadStorage) {
                title = noteValues.title;
                text = noteValues.text;
                isPinned = noteValues.isPinned;
            }
        }
        if (text || title) {
            let buttons = [];
            let divs = [];
            let j = 0;
            let k = 0;
            let date = new Date().toLocaleDateString(); //dd.mm.rrrr
            let time = new Date().toLocaleTimeString();
            let saveTime = "Utworzono: " + date + " " + time;
            if (storage) {
                if (storage.length > 2 && loadStorage) { saveTime = noteValues.time; }
            }
            //tworzenie elementów
            let note = document.createElement("div");
            let note_body = document.createElement("div");
            let note_footer = document.createElement("div");
            let h5 = document.createElement("h5");
            let p = document.createElement("p");
            let p2 = document.createElement("p");
            let small = document.createElement("small");
            let paint = document.createElement("a");
            let pin = document.createElement("a");
            let x = document.createElement("a");
            for (let i = 1; i <= 9; i++) {
                let btn = document.createElement("button");
                buttons.push(btn);
                if (i <= 5) {
                    let div = document.createElement("div");
                    divs.push(div);
                }
            }
            //tekst
            h5.innerHTML = title;
            p.innerHTML = text;
            small.innerHTML = saveTime;
            //dodawanie klas
            note.classList.add("card"); // note = .card
            note.classList.add("text-left");
            let colorClass;
            if (storage) {
                if (storage.length > 2 && loadStorage) { colorClass = "bg-" + noteValues.color }
            }
            else { colorClass = "bg-link" }
            // console.log(colorClass)
            note.classList.add(colorClass)
            note.style.width = "300px !important"; //card style
            note_body.classList.add("card-body");
            note_footer.classList.add("card-footer");
            h5.classList.add("card-title");
            p.classList.add("card_text");
            p2.classList.add("card_text");
            p2.id = "tags";
            small.classList.add("text-muted");
            pin.classList.add("fa");
            pin.classList.add("fa-thumb-tack");
            x.classList.add("fa");
            x.classList.add("fa-times");
            paint.classList.add("fa");
            paint.classList.add("fa-paint-brush");
            paint.classList.add("dropdown-toggle");
            paint.setAttribute("aria-haspopup", "true");
            paint.setAttribute("aria-expanded", "false");
            paint.setAttribute("aria-hidden", "true");
            paint.setAttribute("href", "#");
            paint.setAttribute("role", "button");
            paint.setAttribute("data-toggle", "dropdown");
            small.classList.add("text-muted");
            buttons.forEach(
                function (btn) {
                    btn.classList.add("btn");
                    btn.classList.add(colors_class[j]);
                    btn.classList.add("btn-circle");
                    j++;
                }
            )
            divs.forEach(
                function (div) {
                    div.classList.add(buttons_class[k])
                    k++;
                }
            )
            divs[4].classList.add("dropdown-menu-left");
            //appendowanie
            // console.log(noteValues.isPinned)
            if (noteValues.isPinned) { menu.appendChild(note); }
            else {
                note_place.appendChild(note);
            }
            note.appendChild(note_body);
            note.appendChild(note_footer);
            note_body.appendChild(h5);
            note_body.appendChild(p);
            note_body.appendChild(p2);
            note_footer.appendChild(small);
            note_footer.appendChild(pin);
            note_footer.appendChild(divs[3]); //div[3] dropdown-menu
            note_footer.appendChild(x);
            divs[3].appendChild(paint);
            divs[3].appendChild(divs[4]); //dropdown
            for (let i = 0; i < 3; i++) {
                divs[4].appendChild(divs[i]);
            }
            for (let i = 0; i < 3; i++) {
                divs[0].appendChild(buttons[i]);
            }
            for (let i = 3; i < 6; i++) {
                divs[1].appendChild(buttons[i]);
            }
            for (let i = 6; i < 9; i++) {
                divs[2].appendChild(buttons[i]);
            }
            title_note.innerHTML = "";
            note_text.innerHTML = "";
            j = 0;
            k = 0;

            x.addEventListener("click", deleteNote);

            buttons.forEach(
                function (btn) {
                    btn.addEventListener('click', changeColor);
                    btn.addEventListener("click", function (e) {
                        e.stopPropagation();
                    })
                }
            )

            //array pushes
            // 1.
            let color = note.classList[2].split("-")[1];
            let notess = {
                "object": note,
                "text": text,
                "title": title,
                "time": saveTime,
                "color": color,
                "isPinned": isPinned
            }
            notes_array.push(notess);
            //    console.log(notes_array)
            //2.
            let comps = {
                "object": note,
                "delete": x,
                "paint": paint,
                "pin": pin,
                "small": small,
                "title": h5,
                "text": p
            }
            note_comps.push(comps);
            ////////////////////////////////////////////
            //  console.log(loadStorage)
            if (storage) {
                if (storage.length > 2 && loadStorage) { changeInnerColor(note) }
            }
            pin.addEventListener("click", PinNote, false);
            pin.params = {
                "note": note,
                "notess": notess
            }

            toLocalStorage();
            // console.log(localStorage.getItem("notePocket"));
            loadStorage = false;
        }
    }
}

function PinNote(el) {
    let note = el.target.params.note;
    let notess = el.target.params.notess;
    let parent = note.parentNode;
    let name = parent.classList[0];
    //  console.log(name)
    if (!notess.isPinned && name == "card-columns") {
        menu.appendChild(note);
        //     console.log(el.target)
        notess.isPinned = true;
    }
    else if (notess.isPinned && name == "col-3") {
        note_place.appendChild(note);
        notess.isPinned = false;
    }
    console.log(notes_array)
    toLocalStorage();
}
function deleteNote(e) {
    let i = 0;
    let wow = e.target;
    for (let i = 0; i < 2; i++) {
        wow = wow.parentNode;
    }
    notes_array.forEach(
        function (note) {
            if (wow == note.object) {
                notes_array.splice(i, 1);
                wow.remove();
            }
            i++;
        }
    )
    toLocalStorage();
}

function changeColor(e) {
    let wow = e.target;
    let color = wow.classList[1].split("-")[1];
    console.log(color)
    for (let i = 0; i < 5; i++) {
        wow = wow.parentNode;
    }
    notes_array.forEach( //update color on note array
        function (note) {
            if (wow == note.object) {
                note.color = color; //push into notes array
                toLocalStorage();
            }
        }
    )

    let classes = wow.classList;
    let toRemove = removeColors(classes, str_bg);
    //console.log(toRemove)
    wow.classList.remove(toRemove);
    coloring = false;

    color = "bg-" + color;
    // console.log(color)
    wow.classList.add(color);
    changeInnerColor(wow);
    coloring = true;
}

function changeInnerColor(wow) {
    note_comps.forEach( //update color on note array
        function (el) {
            if (wow == el.object) {
                let name = el.object.classList[2];
                switch (name) {
                    case "bg-light":
                    case "bg-link":
                        el.delete.removeAttribute("style")
                        el.paint.removeAttribute("style")
                        el.pin.removeAttribute("style")
                        el.small.removeAttribute("style")
                        el.text.removeAttribute("style")
                        el.title.removeAttribute("style")
                        break;
                    case "bg-secondary":
                    case "bg-dark":
                        el.text.setAttribute("style", "color: white !important")
                        el.title.setAttribute("style", "color: white !important")
                    case "bg-primary":
                    case "bg-success":
                    case "bg-danger":
                    case "bg-warning":
                    case "bg-info":
                        el.delete.setAttribute("style", "color: white !important")
                        el.paint.setAttribute("style", "color: white !important")
                        el.pin.setAttribute("style", "color: white !important")
                        el.small.setAttribute("style", "color: white !important")
                        break;
                }
            }
        }
    )
}

function removeColors(array) {
    let mori = [];
    //  console.log(array)
    for (let i = 0; i < array.length; i++) {
        mori.push(array[i]);
        let cos = mori[i].split("-")[0];
        if (cos == "bg") {
            return array[i];
        }
    }
}

document.addEventListener("DOMContentLoaded", start);

let colors_class = ["btn-light", "btn-dark", "btn-link", "btn-primary", "btn-secondary", "bg-success", "btn-danger", "btn-warning", "btn-info"];
let buttons_class = ["col", "col", "col", "dropup", "dropdown-menu"];
let notes_array = [];
let note_comps = [];
let storage;
let note_place;
let note_div;
let note_text;
let note_menu;
let menu_bars;
let menu;
let main_window;
let title_note;
let done;
let str_bg = "bg-";
let show = false;
let coloring = false;
let loadStorage = true;


function start() {
    let notes = new Notes();
    note_place = document.querySelector(".card-columns")
    note_div = document.querySelector("#sth");
    note_text = document.querySelector("#note");
    title_note = document.querySelector("#title")
    note_menu = document.querySelector("#notes-menu");
    menu_bars = document.querySelector(".fa-bars");
    menu = document.getElementById("menu");
    main_window = document.getElementById("main-window");
    done = document.getElementById("done");
    done.addEventListener("click", notes.createNote);
    note_text.addEventListener("click", makeNotes)
    menu_bars.addEventListener("click", hideMenu);
    document.addEventListener("click", hideNote);
    let przyciski = document.querySelectorAll('.btn-circle');
    if (localStorage.getItem("notePocket")) {
        storage = localStorage.getItem("notePocket");
        fromLocalStorage();
    }
    //localStorage.removeItem("notePocket") // - - to delete from local storage
}

function toLocalStorage() {
    localStorage.setItem('notePocket', JSON.stringify(notes_array));
}

function fromLocalStorage() {
    if (storage.length > 2) {
        //   console.log(storage)
        let not = new Notes();
        let notes = JSON.parse(storage);
        console.log(notes)
        notes.forEach(
            function (note) {
                loadStorage = true;
                not.createNote(note);
            }
        )
    }
}

function hideMenu() {
    if (show == false) {
        menu.style.display = "none";
        main_window.style.margin = "auto";
        menu_bars.style.background = "rgba(58, 74, 167, 1)";
        menu_bars.style.color = "black";
        show = true;
    }
    else {
        /*  menu.style.display = "block";
         main_window.style.margin = "0px";
         menu_bars.style.background = "none";
         menu_bars.style.color = "white"; */
        menu.removeAttribute("style");
        main_window.removeAttribute("style");
        menu_bars.removeAttribute("style");
        show = false;
    }
}

function makeNotes() {
    title_note.style.display = "block";
    note_menu.style.display = "block";
}
function hideNote(e) {
    if (e.target == note_div || e.target == note_text || e.target == title_note || e.target == document.getElementById("ul")) { }
    else if (e.target == main_window || document.getElementById("wwht") || e.target == document.getElementById("col-1") || e.target == document.querySelector(".row")) {
        title_note.removeAttribute("style");
        note_menu.removeAttribute("style");
    }
}

