package com.gss.inventory.inventory.infrastructure.persistence.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.model.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "member_name", nullable = false)
    private String memberName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "returned_at")
    private Instant returnedAt;

    @Column(columnDefinition = "TEXT")
    private String note;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderLineEntity> lines = new ArrayList<>();

    protected OrderEntity() {
    }

    public OrderEntity(Long id, Long memberId, String memberName, OrderStatus status, Instant issuedAt,
            LocalDate dueDate, Instant returnedAt, String note, List<OrderLineEntity> lines) {
        this.id = id;
        this.memberId = memberId;
        this.memberName = memberName;
        this.status = status;
        this.issuedAt = issuedAt;
        this.dueDate = dueDate;
        this.returnedAt = returnedAt;
        this.note = note;
        this.lines = lines != null ? lines : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Instant getIssuedAt() {
        return issuedAt;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Instant getReturnedAt() {
        return returnedAt;
    }

    public String getNote() {
        return note;
    }

    public List<OrderLineEntity> getLines() {
        return lines;
    }
}
