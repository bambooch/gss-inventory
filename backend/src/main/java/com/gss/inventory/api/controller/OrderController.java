package com.gss.inventory.api.controller;

import java.util.List;

import com.gss.inventory.api.dto.order.CreateOrderRequest;
import com.gss.inventory.api.dto.order.OrderDetailResponse;
import com.gss.inventory.api.dto.order.OrderLineResponse;
import com.gss.inventory.api.dto.order.OrderSummaryResponse;
import com.gss.inventory.inventory.application.OrderService;
import com.gss.inventory.inventory.application.OrderService.LineRequest;
import com.gss.inventory.inventory.domain.model.enums.OrderStatus;
import com.gss.inventory.inventory.domain.model.records.Order;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Orders")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Operation(summary = "List orders (zaduženja)")
    @GetMapping
    public List<OrderSummaryResponse> getOrders(@RequestParam(required = false) OrderStatus status) {
        return orderService.findOrders(status).stream().map(this::toSummaryResponse).toList();
    }

    @Operation(summary = "Get an order with its line items")
    @GetMapping("/{id}")
    public OrderDetailResponse getOrder(@PathVariable Long id) {
        return toDetailResponse(orderService.findById(id));
    }

    @Operation(summary = "Create an order and deduct items from inventory")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDetailResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        List<LineRequest> lines = request.lines().stream()
            .map(l -> new LineRequest(l.itemId(), l.quantity()))
            .toList();
        Order order = orderService.createOrder(request.memberId(), request.dueDate(), request.note(), lines);
        return toDetailResponse(order);
    }

    @Operation(summary = "Mark an order as returned and restock inventory")
    @PostMapping("/{id}/return")
    public OrderDetailResponse returnOrder(@PathVariable Long id) {
        return toDetailResponse(orderService.returnOrder(id));
    }

    @Operation(summary = "Delete an order")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    private OrderSummaryResponse toSummaryResponse(Order order) {
        int itemCount = order.lines().stream().mapToInt(line -> line.quantity()).sum();
        return new OrderSummaryResponse(order.id(), order.memberId(), order.memberName(),
            order.status().name(), order.issuedAt(), order.dueDate(), order.returnedAt(), itemCount);
    }

    private OrderDetailResponse toDetailResponse(Order order) {
        List<OrderLineResponse> lines = order.lines().stream()
            .map(l -> new OrderLineResponse(l.id(), l.itemId(), l.itemName(), l.quantity()))
            .toList();
        return new OrderDetailResponse(order.id(), order.memberId(), order.memberName(),
            order.status().name(), order.issuedAt(), order.dueDate(), order.returnedAt(), order.note(), lines);
    }
}
