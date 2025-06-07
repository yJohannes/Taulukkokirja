import { initSearchToInput } from './search.js';
import { generateTabs, getTabDropdown, isDropdownTab } from './tab.js';
import { initExplorerButtons } from './buttons.js';

import * as defs from './defs.js';
import * as storage from '../storage/index.js';


function loadExplorerSave()
{
    const $explorer = document.querySelector('#explorer-container');
    const $uls = $explorer.querySelectorAll('.explorer-ul');
    
    // Collapse all dropdowns and unflip arrows
    $uls.forEach($ul => {
        const $lis = $ul.querySelectorAll('li');
        $lis.forEach(($li) => {
            const $tabs = $li.querySelectorAll('.explorer-tab');
            $tabs.forEach(($tab) => {
                const path = $tab.getAttribute('data-path');
                if (isDropdownTab($tab)) {
                    if (storage.getFromStorageList('show-states').includes(path)) {
                        const $dropdown = $li.querySelector('.explorer-ul');
                        $dropdown?.classList.add(defs.SHOW);
                        
                        const $arrowSvg = $tab.querySelector(`svg`);
                        if ($arrowSvg) {
                            $arrowSvg.classList.add(defs.ARROW_FLIPPED);
                        }
                    }

                } else if (storage.getFromStorageList('active-states').includes(path)) {
                    $tab.classList.add('active');
                }                    
            });
        });
    });
}

async function loadExplorerStructure()
{
    const response = await fetch('/api/pages-structure');
    if (!response.ok) {
        console.error("Failed to fetch the page structure");
        return defaultStructure;
    }
    
    const structure = await response.json();
    console.log(structure)
    return structure;
}

async function loadExplorer($parentElement)
{
    try {
        const structure = await loadExplorerStructure();
        const $tabs = generateTabs(structure, $parentElement);
        return $tabs;

    } catch (error) {
        console.error('Failed to fetch the page structure: ', error);
    }

    return null;
};

async function loadExplorerToElement($element)
{    
    const $search = document.getElementById('explorer-search');
    initSearchToInput($search)
    const $ul = await loadExplorer($element);
    $element.appendChild($ul);

    initExplorerButtons();
}

export {
    loadExplorerStructure,
    loadExplorer,
    loadExplorerToElement,
    loadExplorerSave,
};

const defaultStructure = {
    "pages": {
        "Matematiikka": {
            "Analyyttinen geometria": {
                "Ellipsi.html": null,
                "Hyperbeli.html": null,
                "Jana.html": null,
                "Suora avaruudessa.html": null,
                "Suora.html": null,
                "Taso avaruudessa.html": null,
                "Ympyrä.html": null
            },
            "Aritmetiikka ja algebra": {
                "Korkeamman asteen yhtälö.html": null,
                "Logaritmi.html": null,
                "Lukujonoja ja summia.html": null,
                "Raja-arvoja.html": null,
                "Reaalilukujen aksioomat.html": null,
                "Toisen asteen yhtälö.html": null
            },
            "Differentiaalilaskenta": {
                "Derivaatan määritelmä.html": null,
                "Derivaatan sovelluksia.html": null,
                "Derivoimiskaavoja.html": null,
                "Derivoimissääntöjä.html": null,
                "Differentiaalin määritelmä.html": null,
                "Logaritminen derivointi.html": null
            },
            "Funktionaalianalyysi": {
                "Hilbertin avaruus.html": null
            },
            "Funktiot ja yhtälöt": {
                "Sarjakehitelmiä.html": null
            },
            "Geometria": {
                "Avaruusgeometria": {
                    "Avaruuskulma.html": null,
                    "Ortogonaaliprojektio.html": null,
                    "Termejä.html": null
                },
                "Yleinen yhteneväisyys ja yhdenmuotoisuus": {
                    "Homotetia ja yhdenmuotoisuus.html": null,
                    "Tasokuvioiden perusliikkeet ja yhtenevyys.html": null
                },
                "Ympyrä": {
                    "Pisteen potenssi ja sekanttilause.html": null
                }
            },
            "Integraalilaskenta": {
                "Integraaliin liittyviä sääntöjä.html": null,
                "Integroimiskaavoja.html": null,
                "Käyrän kaaren pituus.html": null,
                "Osittaisintegrointi.html": null,
                "Pinta-alaintegraaleja.html": null,
                "Tilavuusintegraaleja.html": null
            },
            "Kompleksiluvut": {
                "Kompleksiluvun juuri ja logaritmi.html": null,
                "Määritelmä ja laskutoimitukset.html": null,
                "Polaarinen esitys.html": null
            },
            "Lineaarialgebra": {
                "Määritelmiä ja termejä.html": null,
                "Determinantti": {
                    "Lineaariset yhtälöryhmät.html": null,
                    "Määritelmiä ja merkintöjä.html": null,
                    "Ominaisarvo ja -ominaisvektori.html": null
                },
                "Matriisi": {
                    "Käänteismatriisi.html": null,
                    "Laskutoimitukset.html": null,
                    "Määritelmiä.html": null,
                    "Yhtälöparin muuntaminen matriisimuotoon.html": null
                },
                "Tensori": {
                    "Tensorityyppien nimiä.html": null
                },
                "Vektori": {
                    "Laskutoimitukset.html": null,
                    "Määritelmiä.html": null,
                    "Pistetulo ja ristitulo.html": null,
                    "Projisiot.html": null,
                    "Suuntakulmat ja -kosinit.html": null
                }
            },
            "Logiikka": {
                "Konnektiivit.html": null,
                "Kvanttorit.html": null,
                "Totuusarvotaulukko.html": null
            },
            "Lukuteoria": {
                "Alkuluvut.html": null,
                "Diofantoksen yhtälö.html": null,
                "Jaollisuus.html": null,
                "Kongruenssi.html": null,
                "Lukujen 1–999 alkutekijät.html": null
            },
            "Merkintöjä ja symboleja": {
                "Analyysi.html": null,
                "Aritmetiikka.html": null,
                "Geometria.html": null,
                "Kreikkalaiset aakkoset.html": null,
                "Logiikka ja joukko-oppi.html": null,
                "Todennäköisyyslaskenta.html": null,
                "Vektorit.html": null
            },
            "Numeerisia menetelmiä": {
                "Numeerinen derivointi.html": null,
                "Numeerinen integrointi.html": null,
                "Yhtälön ratkaisu.html": null
            },
            "Talousmatematiikka": {
                "Talousmatematiikan kaavoja.html": null
            },
            "Todennäköisyyslaskenta ja tilastotiede": {
                "Diskreetti todennäköisyysjakauma.html": null,
                "Jatkuva todennäköisyysjakauma.html": null,
                "Kahden diskreetin muuttujan tilastollinen jakauma.html": null,
                "Normaalijakauman kertymäfunktio.html": null,
                "Normaalijakauman tiheysfunktio.html": null,
                "Tilastollisten jakaumien tunnuslukuja.html": null,
                "Kombinatoriikka": {
                    "Binomikertoimet (Pascalin kolmio).html": null,
                    "Kombinatoriikka.html": null,
                    "Newtonin binomikaava.html": null
                }
            },
            "Trigonometria": {
                "Absoluuttinen kulmayksikkö radiaani.html": null,
                "Muistikolmiot.html": null,
                "Muunnoskaavoja.html": null,
                "Trigonometristen funktioiden tarkkoja arvoja.html": null
            }
        },

        "Fysiikka": {
            "Aaltoliike- ja valo-oppi": {
                "Dopplerin ilmiö.html": null,
                "Kaavoja.html": null,
                "Taulukoita": {
                    "Aineiden taitekertoimia.html": null,
                    "Ilman taitekerroin eri aallonpituuksille.html": null,
                    "Näkyvän valon spektri ilmassa.html": null,
                    "Ultraviolettivalon luokittelu.html": null,
                    "Äänen intensiteettitasoja.html": null,
                    "Äänen nopeus väliaineessa.html": null,
                    "Äänen turvallisuusrajat.html": null
                }
            },
            "Atomi-, säteily- ja ydinfysiikka": {
                "Alkuaineiden isotooppeja.html": null,
                "Irrotustöitä.html": null,
                "Kaavoja.html": null,
                "Nukleonit.html": null,
                "Radioaktiivinen hajominen.html": null,
                "Standardimallin alkeishiukkaset.html": null,
                "Säteilyn laatukertoimia.html": null
            },
            "Kvanttifysiikka": {
                "Kaavoja.html": null,
                "Kvanttiluvut.html": null,
                "Schrödingerin yhtälö.html": null
            },
            "Lujuusoppi": {
                "Lujuusopin kaavoja.html": null,
                "Vetokoe.html": null
            },
            "Mekaniikka": {
                "Mekaniikan kaavoja.html": null
            },
            "Nesteet": {
                "Ilmastointi.html": null,
                "Kavitaatio.html": null,
                "Nesteiden kaavoja.html": null,
                "Hydrodynamiikka": {
                    "Lentokoneen siipi.html": null,
                    "Reynoldsin luku ja turbulentti virtaus.html": null,
                    "Tilavuusvirta.html": null,
                    "Tuulivoimala.html": null,
                    "Viskositeetti.html": null
                },
                "Hydrostatiikka": {
                    "Hydrostaattinen tehonsiirto.html": null,
                    "Ilmastointikanava.html": null,
                    "Nestepatsasmanometri.html": null
                }
            },
            "Suhteellisuusteoria": {
                "Suppea suhteellisuusteoria.html": null
            },
            "Suureet, yksiköt ja vakiot": {
                "Johdannaisyksiköt.html": null,
                "Kerrannaisyksiköiden etuliitteet.html": null,
                "Luonnonvakioita.html": null,
                "Muuntokertoimia.html": null,
                "Perusyksiköiden määritelmät.html": null,
                "SI-järjestelmä.html": null
            },
            "Sähkömagnetismi": {
                "Kaavoja.html": null,
                "Maxwellin yhtälöt.html": null,
                "Sähkövuo ja sähkövuon tiheys.html": null,
                "Värähtelypiiri.html": null,
                "Taulukoita": {
                    "Alkuaineiden ominaisuuksia.html": null,
                    "Curie-lämpötiloja.html": null,
                    "Eristeiden ominaisuuksia.html": null,
                    "Ferromagneettisten aineiden ominaisuuksia.html": null,
                    "Metalliseosten ominaisuuksia.html": null,
                    "Suprajohteita.html": null,
                    "Sähköteknisiä piirrosmerkkejä.html": null
                }
            },
            "Taulukoita": {
                "Ilmakehän koostumus.html": null,
                "Putoamiskiihtyvyys merenpinnan tasolla.html": null,
                "Mekaniikka ja termodynamiikka": {
                    "Ilmakehän ominaisuuksia.html": null,
                    "Kiinteiden aineiden ominaisuuksia.html": null,
                    "Kiinteiden alkuaineiden ominaisuuksia.html": null,
                    "Kitkakertoimia.html": null,
                    "Kylläisen vesihöyryn paine ja tiheys.html": null,
                    "Metalliseosten ominaisuuksia.html": null,
                    "Nesteiden ja kaasujen ominaisuuksia.html": null,
                    "Polttoaineiden lämpöarvoja.html": null,
                    "Veden ominaisuuksia.html": null,
                    "Veden tiheys lämpötiloissa.html": null
                }
            },
            "Termodynamiikka": {
                "Aikavakio (lämpömittari).html": null,
                "Entropia ja termodynamiikan toinen pääsääntö.html": null,
                "Fourierin I laki.html": null,
                "Fourierin II laki.html": null,
                "Lämmön siirtyminen.html": null,
                "Lämpöhaude.html": null,
                "Lämpösäteily.html": null,
                "Rajapinnan vaikutus lämmön siirtymiseen.html": null,
                "Takan lämpötilajakauman simulointi.html": null,
                "Termodynamiikan kaavoja.html": null,
                "Termodynamiikan peruskäsitteitä.html": null,
                "Lämpökoneet": {
                    "Jäähdytyskone ja lämpöpumppu.html": null,
                    "Lämpökoneiden kaavoja.html": null,
                    "Lämpövoimakone.html": null
                }
            },
            "Tähtitiede": {
                "Aurinko.html": null,
                "Kirkkaimmat tähdet.html": null,
                "Komeettoja.html": null,
                "Kuu.html": null,
                "Linnunrata.html": null,
                "Lähimmät tähdet.html": null,
                "Maa.html": null,
                "Pikkuplaneettoja ja asteroideja.html": null,
                "Planeetat.html": null,
                "Tähtisumuja.html": null
            }
        },
        "Kemia": {
            "Alkuaineet": {
                "Alkuaineiden jaksollinen järjestelmä.html": null,
                "Alkuaineiden suhteelliset atomimassat (IUPAC 2018).html": null,
                "Atomien ja ionien suhteelliset koot.html": null,
                "Elektronegatiivisuus.html": null,
                "Elektronien sijoittuminen energiatasoille.html": null,
                "Kovalenttisidoksen ioniluonne.html": null,
                "Pääryhmien alkuaineiden ionisoitumisenergioita.html": null,
                "Yleisimmät hapetusluvut.html": null
            },
            "Hapot, emäkset": {
                "Emäsvakioita.html": null,
                "Happo- ja emäsliuosten pitoisuuksia ja tiheyksiä.html": null,
                "Happovakioita.html": null,
                "Veden ionitulo.html": null
            },
            "Hiilen yhdisteitä": {
                "Hiilen yhdisteiden triviaalinimiä ja IUPAC-nimiä.html": null,
                "Yleisesti käytettyjä nimilyhenteitä.html": null
            },
            "Merkintöjä ja kaavoja": {
                "Kreikkalaiset numeeriset etuliitteet.html": null,
                "Laskukaavoja.html": null,
                "Vakioita.html": null
            },
            "Sähkökemia": {
                "Metallien jännitesarja yleisille metalleille.html": null,
                "Standardipotentiaaleja.html": null
            },
            "Yhdisteet": {
                "Anioneja.html": null,
                "Kaasujen ominaisuuksia.html": null,
                "Kationeja.html": null,
                "Kompleksi-ioneja.html": null,
                "Kovalenttisidosten pituuksia ja sidosenergioita.html": null,
                "Liukoisuustuloja.html": null,
                "Mineraaleja.html": null,
                "Muodostumislämpöjä.html": null,
                "Spektrien tulkinta.html": null,
                "Yhdisteiden kauppanimiä ja koostumuksia.html": null
            }
        },
        "Testit": {
            "LaTeX ja kopiointi.html": null,
            "Lorem ipsum.html": null,
            "Tyhjä.html": null
        }
    }
}