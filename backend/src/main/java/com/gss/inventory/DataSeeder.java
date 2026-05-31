package com.gss.inventory;

import java.time.LocalDate;
import java.util.List;

import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.application.OrderService;
import com.gss.inventory.inventory.application.OrderService.LineRequest;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.model.records.Member;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class DataSeeder implements ApplicationRunner {

    private final InventoryItemService itemService;
    private final MemberService memberService;
    private final OrderService orderService;

    public DataSeeder(InventoryItemService itemService, MemberService memberService, OrderService orderService) {
        this.itemService = itemService;
        this.memberService = memberService;
        this.orderService = orderService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!itemService.findItems(null).isEmpty()) {
            return;
        }

        // ── Članovi (members) ────────────────────────────────────────────────
        Member kovac     = memberService.createMember("Adnan Kovač",       "+387 61 234 567", "Spasilački tim A");
        Member spahic    = memberService.createMember("Emina Spahić",      "+387 62 345 678", "Spasilački tim A");
        Member delic     = memberService.createMember("Haris Delić",       "+387 63 456 789", "Spasilački tim B");
        Member music     = memberService.createMember("Amra Mušić",        "+387 61 567 890", "Spasilački tim B");
        Member halilovic = memberService.createMember("Tarik Halilović",   "+387 62 678 901", "Vodič / instruktor");
        Member zukic     = memberService.createMember("Lamija Zukić",      "+387 63 789 012", "Medicinski tim");

        // ── Oprema (inventory) ───────────────────────────────────────────────
        InventoryItem hmsKarabiner   = item("HMS karabiner sa navojem",    ItemCategory.KARABINERI,  "Aluminijski HMS karabiner za osiguravanje, navojna brava.", "Skladište – polica A1", 40);
        InventoryItem karabinerScrew = item("Karabiner sa navojem (D)",    ItemCategory.KARABINERI,  "D-oblik karabiner, navojna brava, 25 kN.",                  "Skladište – polica A1", 60);
        InventoryItem karabinerAuto  = item("Karabiner auto-lock",         ItemCategory.KARABINERI,  "Trostruko automatsko zaključavanje.",                       "Skladište – polica A1", 30);
        item("Maillon Rapide (delta)",    ItemCategory.KARABINERI, "Čelična spojnica za polutrajna sidrišta.",        "Skladište – polica A2", 24);

        InventoryItem stopDescender  = item("Stop descender (Petzl Stop)", ItemCategory.SPUSTALICE,  "Samokočeća spuštalica za jedno uže, spašavanje.",          "Skladište – polica B1", 12);
        item("ID descender",              ItemCategory.SPUSTALICE, "Samokočeća spuštalica s antipanik funkcijom.",    "Skladište – polica B1", 8);
        item("Osmica (figure 8)",         ItemCategory.SPUSTALICE, "Klasična osmica za spuštanje i abseil.",          "Skladište – polica B1", 20);
        item("Rack spuštalica",           ItemCategory.SPUSTALICE, "Rack za duge spustove i teške terete.",           "Skladište – polica B2", 6);

        InventoryItem rescueKolotura = item("Rescue kolotura",             ItemCategory.KOLOTURE,    "Spasilačka kolotura velikog kapaciteta, sačmasti ležaj.",  "Skladište – polica C1", 16);
        item("Tandem Prusik kolotura",    ItemCategory.KOLOTURE,   "Dvostruka kolotura za sajlu i uže do 13 mm.",     "Skladište – polica C1", 10);
        InventoryItem proTraxion     = item("Pro Traxion kolotura",        ItemCategory.KOLOTURE,    "Kolotura s povratnom blokadom za sisteme dizanja.",        "Skladište – polica C1", 8);
        item("Mini kolotura",             ItemCategory.KOLOTURE,   "Lagana kolotura za preusmjeravanje užeta.",       "Skladište – polica C2", 18);

        InventoryItem handAscender   = item("Ručna hvataljka (ascender)",  ItemCategory.HVATALJKE,   "Ručna hvataljka s ergonomskom drškom, lijeva/desna.",      "Skladište – polica D1", 14);
        item("Prsna hvataljka (Croll)",   ItemCategory.HVATALJKE,  "Prsna hvataljka za napredovanje uz uže.",         "Skladište – polica D1", 12);
        item("Tibloc hvataljka",          ItemCategory.HVATALJKE,  "Mini hvataljka za hitne situacije.",              "Skladište – polica D2", 20);

        InventoryItem statickoUze    = item("Statičko uže 10.5 mm (50 m)",  ItemCategory.UZAD_I_TRAKE, "Polustatičko uže za spašavanje i pristup užetom.",        "Skladište – ormar U1", 10);
        item("Statičko uže 11 mm (100 m)", ItemCategory.UZAD_I_TRAKE, "Polustatičko uže za duge spustove.",            "Skladište – ormar U1", 6);
        item("Dinamičko uže 9.8 mm (60 m)", ItemCategory.UZAD_I_TRAKE, "Dinamičko uže za penjanje i osiguranje.",      "Skladište – ormar U2", 8);
        InventoryItem trakaOmca      = item("Trakasta omča 120 cm",        ItemCategory.UZAD_I_TRAKE, "Dyneema omča za sidrenje.",                               "Skladište – ormar U3", 50);
        item("Pomoćno uže 6 mm (Prusik)", ItemCategory.UZAD_I_TRAKE, "Repschnur za Prusik čvorove.",                  "Skladište – ormar U3", 40);

        InventoryItem sitHarness     = item("Sjedeći pojas (sit harness)", ItemCategory.POJASEVI,    "Spasilački sjedeći pojas, podesivi obujmovi.",            "Skladište – polica E1", 18);
        item("Prsni pojas",               ItemCategory.POJASEVI,   "Prsni pojas za kombinaciju sa sjedećim.",         "Skladište – polica E1", 12);
        item("Kombinovani pojas (full body)", ItemCategory.POJASEVI, "Kompletni pojas za evakuaciju unesrećenog.",  "Skladište – polica E2", 8);

        InventoryItem kaciga         = item("Zaštitna kaciga",             ItemCategory.KACIGE,      "Planinarska/spasilačka kaciga, podesiva.",                "Skladište – polica F1", 25);

        InventoryItem akiaNosila     = item("Akia nosila (gondola)",       ItemCategory.NOSILA,      "Spasilačka nosila za snijeg i strme terene.",             "Garaža – stalak N1", 3);
        InventoryItem koshNosila     = item("Koš nosila (basket litter)",  ItemCategory.NOSILA,      "Metalna koš-nosila za vertikalnu evakuaciju.",            "Garaža – stalak N1", 4);
        item("Vakuum madrac",             ItemCategory.NOSILA,     "Imobilizacijski vakuum madrac za kičmu.",         "Garaža – stalak N2", 3);
        item("Spinalna daska",            ItemCategory.NOSILA,     "Daska za imobilizaciju kičme.",                   "Garaža – stalak N2", 4);

        InventoryItem prvaPomoc      = item("Torba prve pomoći",           ItemCategory.MEDICINSKA,  "Kompletna torba prve pomoći za teren.",                   "Vozilo 1 / skladište", 6);
        item("Vratna ogrlica (collar)",   ItemCategory.MEDICINSKA, "Podesiva cervikalna ogrlica.",                    "Vozilo 1 / skladište", 10);
        item("Imobilizacijske udlage",    ItemCategory.MEDICINSKA, "Set udlaga za ekstremitete.",                     "Vozilo 1 / skladište", 8);
        InventoryItem termoDeka      = item("Termo deka (izotermalna)",    ItemCategory.MEDICINSKA,  "Izotermalna folija protiv hipotermije.",                  "Vozilo 1 / skladište", 30);

        item("Friend (mehanički klin)",   ItemCategory.SIDRISTA,   "Mehanički klin za pukotine, razne veličine.",     "Skladište – kutija S1", 16);
        item("Klin (piton)",              ItemCategory.SIDRISTA,   "Čelični klin za sidrenje u stijeni.",             "Skladište – kutija S1", 30);
        item("Ekspres set (quickdraw)",   ItemCategory.SIDRISTA,   "Set za brzo osiguranje.",                         "Skladište – kutija S2", 40);
        InventoryItem vijakZaLed     = item("Vijak za led (ice screw)",    ItemCategory.SIDRISTA,    "Vijak za sidrenje u ledu.",                               "Skladište – kutija S2", 12);

        InventoryItem lavinskiDetektor = item("Lavinski detektor (beacon)", ItemCategory.LAVINSKA,   "Digitalni lavinski transiver, 3 antene.",                "Skladište – ormar L1", 10);
        InventoryItem lavinskaSonda  = item("Lavinska sonda",              ItemCategory.LAVINSKA,    "Sklopiva sonda 240 cm za pretragu lavina.",               "Skladište – ormar L1", 12);
        InventoryItem lavinskaLopata = item("Lavinska lopata",             ItemCategory.LAVINSKA,    "Aluminijska lopata za iskopavanje.",                      "Skladište – ormar L1", 12);

        InventoryItem celonaLampa    = item("Čeona lampa",                 ItemCategory.RASVJETA,    "LED čeona lampa, punjiva, do 400 lm.",                    "Skladište – polica G1", 20);
        item("Reflektor / baklja",        ItemCategory.RASVJETA,   "Prijenosni reflektor za noćne akcije.",           "Skladište – polica G1", 6);

        InventoryItem radioStanica   = item("Radio stanica (VHF)",         ItemCategory.RAZNO,       "Ručna VHF radio stanica za komunikaciju na terenu.",      "Skladište – polica H1", 12);
        item("GPS uređaj",                ItemCategory.RAZNO,      "Ručni GPS za navigaciju i tačke pretrage.",       "Skladište – polica H1", 5);
        item("Vreća za spašavanje",       ItemCategory.RAZNO,      "Transportna vreća za opremu i unesrećenog.",      "Garaža – stalak N3", 6);

        // ── Zaduženja (orders) ───────────────────────────────────────────────
        // Aktivno, rok u budućnosti
        orderService.createOrder(kovac.id(), LocalDate.parse("2026-06-15"),
            "Vježba spašavanja iz kanjona – Tim A.",
            List.of(
                new LineRequest(statickoUze.id(), 2),
                new LineRequest(stopDescender.id(), 2),
                new LineRequest(hmsKarabiner.id(), 8),
                new LineRequest(sitHarness.id(), 4),
                new LineRequest(kaciga.id(), 4)));

        // Aktivno, rok uskoro
        orderService.createOrder(halilovic.id(), LocalDate.parse("2026-06-05"),
            "Obuka novih članova – rad s užetom.",
            List.of(
                new LineRequest(handAscender.id(), 4),
                new LineRequest(karabinerScrew.id(), 10),
                new LineRequest(trakaOmca.id(), 8),
                new LineRequest(kaciga.id(), 6)));

        // ISTEKAO ROK – kasni (dueDate u prošlosti, još aktivno)
        orderService.createOrder(delic.id(), LocalDate.parse("2026-05-20"),
            "Akcija potrage na Bjelašnici – oprema nije vraćena.",
            List.of(
                new LineRequest(akiaNosila.id(), 1),
                new LineRequest(rescueKolotura.id(), 2),
                new LineRequest(proTraxion.id(), 1),
                new LineRequest(radioStanica.id(), 3),
                new LineRequest(celonaLampa.id(), 4)));

        // ISTEKAO ROK – lavinska oprema
        orderService.createOrder(music.id(), LocalDate.parse("2026-05-12"),
            "Zimska obuka – lavinska oprema, kasni povrat.",
            List.of(
                new LineRequest(lavinskiDetektor.id(), 4),
                new LineRequest(lavinskaSonda.id(), 4),
                new LineRequest(lavinskaLopata.id(), 4),
                new LineRequest(vijakZaLed.id(), 6)));

        // Aktivno – medicinski tim
        orderService.createOrder(zukic.id(), LocalDate.parse("2026-06-10"),
            "Dežurstvo na planinarskom maratonu.",
            List.of(
                new LineRequest(prvaPomoc.id(), 2),
                new LineRequest(termoDeka.id(), 10),
                new LineRequest(koshNosila.id(), 1)));

        // Vraćeno – završeno zaduženje (vraća opremu na stanje)
        var returned = orderService.createOrder(spahic.id(), LocalDate.parse("2026-05-25"),
            "Redovna vježba – oprema vraćena.",
            List.of(
                new LineRequest(karabinerAuto.id(), 6),
                new LineRequest(handAscender.id(), 2)));
        orderService.returnOrder(returned.id());
    }

    private InventoryItem item(String name, ItemCategory category, String description,
            String location, int quantity) {
        return itemService.createItem(name, category, description, location, quantity);
    }
}
