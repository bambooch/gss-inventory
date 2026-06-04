package com.gss.inventory;

import com.gss.inventory.auth.SpringDataUserRepository;
import com.gss.inventory.auth.UserEntity;
import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final InventoryItemService itemService;
    private final MemberService memberService;
    private final SpringDataUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-password}")
    private String defaultAdminPassword;

    @Override
    public void run(ApplicationArguments args) {
        seedDefaultAdminUser();

        if (!itemService.findItems(null).isEmpty()) {
            return;
        }

        // ── Članovi ─────────────────────────────────────────────────────────
        memberService.createMember("Emir Rihić",  "", "GSS Zenica");
        memberService.createMember("Amar Čerim",  "", "GSS Zenica");

        // ── Oprema – prema inventuri magacina (11.3.2024.) ───────────────────
        item("OK Petzl ovalni karabiner",          ItemCategory.KARABINERI,   "Ovalni aluminijski karabiner s navojnom bravom.",              "Magacin GSS", 20);
        item("Petzl Protec zaštita za uže",        ItemCategory.RAZNO,        "Zaštita za uže od oštećenja na ivicama.",                     "Magacin GSS",  4);
        item("Petzl Stop descender",               ItemCategory.SPUSTALICE,   "Samokočeća spuštalica za jedno uže.",                         "Magacin GSS",  3);
        item("Sredstvo za čišćenje užeta",         ItemCategory.RAZNO,        "Sredstvo za čišćenje i njegu užadi.",                         "Magacin GSS",  1);
        item("Petzl Grillon 5m",                   ItemCategory.UZAD_I_TRAKE, "Pozicioni lanyard dužine 5 m za rad na visini.",              "Magacin GSS",  5);
        item("Petzl nožna penjalica desna",        ItemCategory.HVATALJKE,    "Desna nožna hvataljka za napredovanje uz uže.",               "Magacin GSS",  1);
        item("Petzl nožna penjalica lijeva",       ItemCategory.HVATALJKE,    "Lijeva nožna hvataljka za napredovanje uz uže.",              "Magacin GSS",  1);
        item("Petzl nožna gurtna",                 ItemCategory.POJASEVI,     "Nožna gurtna (stirrup) uz nožnu penjalicu.",                  "Magacin GSS",  5);
        item("Pločica Petzl Coeur Stainless 10mm", ItemCategory.SIDRISTA,     "Čelična pločica za polutrajna sidrišta, promjer 10 mm.",      "Magacin GSS", 20);
    }

    private void seedDefaultAdminUser() {
        if (userRepository.count() > 0) return;

        UserEntity admin = new UserEntity();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
        userRepository.save(admin);

        log.warn("================================================================");
        log.warn("Default admin user created (username: admin, password: changeme)");
        log.warn("================================================================");
    }

    private InventoryItem item(String name, ItemCategory category, String description,
            String location, int quantity) {
        return itemService.createItem(name, category, description, location, quantity);
    }
}
