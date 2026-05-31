package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.Order;
import com.gss.inventory.inventory.domain.model.records.OrderLine;
import com.gss.inventory.inventory.domain.repository.OrderRepository;
import com.gss.inventory.inventory.infrastructure.persistence.entity.OrderEntity;
import com.gss.inventory.inventory.infrastructure.persistence.entity.OrderLineEntity;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaOrderRepository implements OrderRepository {

    private final SpringDataOrderJpaRepository repository;

    public JpaOrderRepository(SpringDataOrderJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Order save(Order order) {
        return toDomain(repository.save(toEntity(null, order)));
    }

    @Override
    public Order update(Order order) {
        return toDomain(repository.save(toEntity(order.id(), order)));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Order> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Order> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    private OrderEntity toEntity(Long id, Order order) {
        List<OrderLineEntity> lineEntities = new ArrayList<>(order.lines().stream()
            .map(l -> new OrderLineEntity(l.id(), l.itemId(), l.itemName(), l.quantity()))
            .toList());
        return new OrderEntity(id, order.memberId(), order.memberName(), order.status(),
            order.issuedAt(), order.dueDate(), order.returnedAt(), order.note(), lineEntities);
    }

    private Order toDomain(OrderEntity entity) {
        List<OrderLine> lines = entity.getLines().stream()
            .map(l -> new OrderLine(l.getId(), l.getItemId(), l.getItemName(), l.getQuantity()))
            .toList();
        return new Order(entity.getId(), entity.getMemberId(), entity.getMemberName(), entity.getStatus(),
            entity.getIssuedAt(), entity.getDueDate(), entity.getReturnedAt(), entity.getNote(), lines);
    }
}
