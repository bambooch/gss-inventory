package com.gss.inventory.inventory.application;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.exception.InsufficientStockException;
import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.exception.OrderNotFoundException;
import com.gss.inventory.inventory.domain.model.enums.OrderStatus;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.model.records.Member;
import com.gss.inventory.inventory.domain.model.records.Order;
import com.gss.inventory.inventory.domain.model.records.OrderLine;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.domain.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    /** A single item and the quantity requested when creating an order. */
    public record LineRequest(Long itemId, int quantity) {
    }

    private final OrderRepository orderRepository;
    private final InventoryItemRepository itemRepository;
    private final MemberService memberService;

    public OrderService(OrderRepository orderRepository, InventoryItemRepository itemRepository,
            MemberService memberService) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.memberService = memberService;
    }

    public List<Order> findOrders(OrderStatus status) {
        return orderRepository.findAll().stream()
            .filter(order -> status == null || order.status() == status)
            .toList();
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
    }

    @Transactional
    public Order createOrder(Long memberId, LocalDate dueDate, String note, List<LineRequest> lineRequests) {
        Member member = memberService.findById(memberId);

        List<OrderLine> lines = new ArrayList<>();
        for (LineRequest request : lineRequests) {
            InventoryItem item = itemRepository.findById(request.itemId())
                .orElseThrow(() -> new InventoryItemNotFoundException(request.itemId()));

            if (request.quantity() <= 0) {
                continue;
            }
            if (item.availableQuantity() < request.quantity()) {
                throw new InsufficientStockException(item.name(), request.quantity(), item.availableQuantity());
            }

            itemRepository.update(new InventoryItem(item.id(), item.name(), item.categories(), item.description(),
                item.location(), item.totalQuantity(), item.availableQuantity() - request.quantity(), item.images()));

            lines.add(new OrderLine(null, item.id(), item.name(), request.quantity()));
        }

        Order order = new Order(null, member.id(), member.fullName(), OrderStatus.AKTIVNO,
            Instant.now(), dueDate, null, note, lines);
        return orderRepository.save(order);
    }

    @Transactional
    public Order returnOrder(Long id) {
        Order order = findById(id);
        if (order.status() == OrderStatus.VRACENO) {
            return order;
        }

        restoreStock(order);

        Order returned = new Order(order.id(), order.memberId(), order.memberName(), OrderStatus.VRACENO,
            order.issuedAt(), order.dueDate(), Instant.now(), order.note(), order.lines());
        return orderRepository.update(returned);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = findById(id);
        if (order.status() == OrderStatus.AKTIVNO) {
            restoreStock(order);
        }
        orderRepository.deleteById(id);
    }

    private void restoreStock(Order order) {
        for (OrderLine line : order.lines()) {
            itemRepository.findById(line.itemId()).ifPresent(item -> {
                int restored = Math.min(item.availableQuantity() + line.quantity(), item.totalQuantity());
                itemRepository.update(new InventoryItem(item.id(), item.name(), item.categories(),
                    item.description(), item.location(), item.totalQuantity(), restored, item.images()));
            });
        }
    }
}
