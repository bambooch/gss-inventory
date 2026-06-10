package com.gss.inventory.inventory.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.application.OrderService.LineRequest;
import com.gss.inventory.inventory.domain.exception.InsufficientStockException;
import com.gss.inventory.inventory.domain.exception.OrderNotFoundException;
import com.gss.inventory.inventory.domain.model.enums.OrderStatus;
import com.gss.inventory.inventory.domain.model.records.Order;
import com.gss.inventory.inventory.support.InMemoryInventoryItemRepository;
import com.gss.inventory.inventory.support.InMemoryMemberRepository;
import com.gss.inventory.inventory.support.InMemoryOrderRepository;

import org.junit.jupiter.api.Test;

class OrderServiceTest {

    private final InMemoryInventoryItemRepository itemRepository = new InMemoryInventoryItemRepository();
    private final InMemoryOrderRepository orderRepository = new InMemoryOrderRepository();
    private final MemberService memberService = new MemberService(new InMemoryMemberRepository());
    private final OrderService service = new OrderService(orderRepository, itemRepository, memberService);

    @Test
    void createOrderDeductsFromInventory() {
        Order order = service.createOrder(1L, Optional.of(LocalDate.parse("2026-06-15")), "Vježba",
            List.of(new LineRequest(1L, 5)));

        assertThat(order.id()).isNotNull();
        assertThat(order.status()).isEqualTo(OrderStatus.AKTIVNO);
        assertThat(order.lines()).hasSize(1);
        assertThat(itemRepository.findById(1L).orElseThrow().availableQuantity()).isEqualTo(35); // 40 - 5
    }

    @Test
    void createOrderThrowsWhenStockInsufficient() {
        assertThatThrownBy(() -> service.createOrder(1L, Optional.of(LocalDate.parse("2026-06-15")), null,
                List.of(new LineRequest(2L, 999))))
            .isInstanceOf(InsufficientStockException.class);

        // Stock unchanged
        assertThat(itemRepository.findById(2L).orElseThrow().availableQuantity()).isEqualTo(12);
    }

    @Test
    void returnOrderRestoresInventory() {
        Order order = service.createOrder(1L, Optional.of(LocalDate.parse("2026-06-15")), null,
            List.of(new LineRequest(3L, 4)));
        assertThat(itemRepository.findById(3L).orElseThrow().availableQuantity()).isEqualTo(12); // 16 - 4

        Order returned = service.returnOrder(order.id());

        assertThat(returned.status()).isEqualTo(OrderStatus.VRACENO);
        assertThat(returned.returnedAt()).isNotNull();
        assertThat(itemRepository.findById(3L).orElseThrow().availableQuantity()).isEqualTo(16); // restored
    }

    @Test
    void deleteActiveOrderRestoresInventory() {
        Order order = service.createOrder(1L, Optional.of(LocalDate.parse("2026-06-15")), null,
            List.of(new LineRequest(4L, 3)));
        assertThat(itemRepository.findById(4L).orElseThrow().availableQuantity()).isEqualTo(7); // 10 - 3

        service.deleteOrder(order.id());

        assertThat(itemRepository.findById(4L).orElseThrow().availableQuantity()).isEqualTo(10); // restored
        assertThatThrownBy(() -> service.findById(order.id()))
            .isInstanceOf(OrderNotFoundException.class);
    }

    @Test
    void findByIdThrowsWhenMissing() {
        assertThatThrownBy(() -> service.findById(999L))
            .isInstanceOf(OrderNotFoundException.class);
    }
}
