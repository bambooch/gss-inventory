package com.gss.inventory.inventory.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.gss.inventory.inventory.domain.model.records.Order;
import com.gss.inventory.inventory.domain.model.records.OrderLine;
import com.gss.inventory.inventory.domain.repository.OrderRepository;

public class InMemoryOrderRepository implements OrderRepository {

    private final List<Order> orders = new ArrayList<>();
    private final AtomicLong idSequence = new AtomicLong(1);
    private final AtomicLong lineIdSequence = new AtomicLong(1);

    @Override
    public Order save(Order order) {
        Order saved = new Order(idSequence.getAndIncrement(), order.memberId(), order.memberName(),
            order.status(), order.issuedAt(), order.dueDate(), order.returnedAt(), order.note(),
            withLineIds(order.lines()));
        orders.add(saved);
        return saved;
    }

    @Override
    public Order update(Order order) {
        Order updated = new Order(order.id(), order.memberId(), order.memberName(), order.status(),
            order.issuedAt(), order.dueDate(), order.returnedAt(), order.note(), withLineIds(order.lines()));
        orders.removeIf(o -> o.id().equals(order.id()));
        orders.add(updated);
        return updated;
    }

    @Override
    public void deleteById(Long id) {
        orders.removeIf(o -> o.id().equals(id));
    }

    @Override
    public List<Order> findAll() {
        return orders;
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orders.stream().filter(o -> o.id().equals(id)).findFirst();
    }

    private List<OrderLine> withLineIds(List<OrderLine> lines) {
        List<OrderLine> result = new ArrayList<>();
        for (OrderLine line : lines) {
            Long id = line.id() != null ? line.id() : lineIdSequence.getAndIncrement();
            result.add(new OrderLine(id, line.itemId(), line.itemName(), line.quantity()));
        }
        return result;
    }
}
