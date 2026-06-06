package com.gss.inventory;

import java.util.List;

import com.gss.inventory.auth.SpringDataUserRepository;
import com.gss.inventory.auth.UserEntity;
import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemCategoryEntity;
import com.gss.inventory.inventory.infrastructure.persistence.repository.SpringDataItemCategoryJpaRepository;

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
    private final SpringDataItemCategoryJpaRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-password}")
    private String defaultAdminPassword;

    private static final List<String[]> DEFAULT_CATEGORIES = List.of(
        new String[]{"ALATI",                        "Alati"},
        new String[]{"KARABINERI_PLOCICE_OSMICE_PAW","Karabineri, pločice, osmice, PAW"},
        new String[]{"KOLOTURE",                     "Koloture"},
        new String[]{"NOSILA",                       "Nosila"},
        new String[]{"ODJECA_I_OBUCA",               "Odjeća i obuća"},
        new String[]{"OPREMA_ZA_MOTORNE_SANKE",      "Oprema za motorne sanke"},
        new String[]{"OSTALO",                       "Ostalo"},
        new String[]{"POJASEVI_I_KACIGE",            "Pojasevi i kacige"},
        new String[]{"RADIO_GPS",                    "Radio i GPS"},
        new String[]{"SPRAVICE",                     "Spravice"},
        new String[]{"TORBE_I_RUKSACI",              "Torbe i ruksaci"},
        new String[]{"UZARIJA",                      "Užarija"},
        new String[]{"ZIMSKA_LICNA_THE_OPREMA",      "Zimska lična THE oprema"}
    );

    @Override
    public void run(ApplicationArguments args) {
        seedDefaultAdminUser();
        seedDefaultCategories();

        if (!itemService.findItems(null).isEmpty()) {
            return;
        }

        memberService.createMember("Emir Rihić",  "", "GSS Zenica");
        memberService.createMember("Amar Čerim",  "", "GSS Zenica");
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

    private void seedDefaultCategories() {
        if (categoryRepository.count() > 0) return;

        for (int i = 0; i < DEFAULT_CATEGORIES.size(); i++) {
            String[] cat = DEFAULT_CATEGORIES.get(i);
            categoryRepository.save(new ItemCategoryEntity(null, cat[0], cat[1], i));
        }

        log.info("Seeded {} default categories", DEFAULT_CATEGORIES.size());
    }
}
