package com.gss.inventory.inventory.domain.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.Order;

public interface OrderRepository {

    Order save(Order order);

    Order update(Order order);

    void deleteById(Long id);

    List<Order> findAll();

    Optional<Order> findById(Long id);
}
