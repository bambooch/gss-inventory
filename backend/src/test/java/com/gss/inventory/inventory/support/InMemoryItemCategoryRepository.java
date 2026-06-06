package com.gss.inventory.inventory.support;

import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.ItemCategoryRepository;

import org.springframework.stereotype.Repository;

@Repository
public class InMemoryItemCategoryRepository implements ItemCategoryRepository {

    private final List<InventoryItem.Category> categories = new ArrayList<>(List.of(
        new InventoryItem.Category(1L,  "ALATI",                        "Alati"),
        new InventoryItem.Category(2L,  "KARABINERI_PLOCICE_OSMICE_PAW","Karabineri, pločice, osmice, PAW"),
        new InventoryItem.Category(3L,  "KOLOTURE",                     "Koloture"),
        new InventoryItem.Category(4L,  "NOSILA",                       "Nosila"),
        new InventoryItem.Category(5L,  "ODJECA_I_OBUCA",               "Odjeća i obuća"),
        new InventoryItem.Category(6L,  "OPREMA_ZA_MOTORNE_SANKE",      "Oprema za motorne sanke"),
        new InventoryItem.Category(7L,  "OSTALO",                       "Ostalo"),
        new InventoryItem.Category(8L,  "POJASEVI_I_KACIGE",            "Pojasevi i kacige"),
        new InventoryItem.Category(9L,  "RADIO_GPS",                    "Radio i GPS"),
        new InventoryItem.Category(10L, "SPRAVICE",                     "Spravice"),
        new InventoryItem.Category(11L, "TORBE_I_RUKSACI",              "Torbe i ruksaci"),
        new InventoryItem.Category(12L, "UZARIJA",                      "Užarija"),
        new InventoryItem.Category(13L, "ZIMSKA_LICNA_THE_OPREMA",      "Zimska lična THE oprema"),
        // Legacy slugs used in unit tests
        new InventoryItem.Category(14L, "KARABINERI",  "Karabineri"),
        new InventoryItem.Category(15L, "SPUSTALICE",  "Spuštalice"),
        new InventoryItem.Category(16L, "KOLOTURE_OLD","Koloture (staro)"),
        new InventoryItem.Category(17L, "UZAD_I_TRAKE","Užad i trake"),
        new InventoryItem.Category(18L, "KACIGE",      "Kacige"),
        new InventoryItem.Category(19L, "HVATALJKE",   "Hvataljke")
    ));

    @Override
    public List<InventoryItem.Category> findAll() {
        return List.copyOf(categories);
    }

    @Override
    public List<InventoryItem.Category> findAllByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        return categories.stream().filter(c -> ids.contains(c.id())).toList();
    }
}
