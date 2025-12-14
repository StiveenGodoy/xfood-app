class MeseroView {
    constructor() {
        this.tablesGrid = document.getElementById('tables-grid');
        this.menuSelect = document.getElementById('menu-select');
        this.modalOrderItemsList = document.getElementById('modal-order-items');
        this.modalTotalDisplay = document.getElementById('modal-total-amount');
        this.tableOrdersList = document.getElementById('table-orders-list');
    }

    renderTables(totalTables = 12) {
        this.tablesGrid.innerHTML = '';
        for (let i = 1; i <= totalTables; i++) {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
                <div class="card h-100 text-center py-4 shadow-sm border-0 table-card" onclick="app.pedidoController.seleccionarMesa(${i})">
                    <h3 class="fw-bold">${i}</h3>
                    <small class="text-muted">Mesa</small>
                    <div id="table-badge-${i}" class="badge-notification d-none">!</div>
                </div>
            `;
            this.tablesGrid.appendChild(col);
        }
    }

    fillMenuOptions(menuItems) {
        this.menuSelect.innerHTML = '<option selected disabled>Selecciona un plato...</option>';
        menuItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} - $${item.price}`;
            this.menuSelect.appendChild(option);
        });
    }

    renderModalItems(currentItems, total) {
        this.modalOrderItemsList.innerHTML = '';
        if (currentItems.length === 0) {
            this.modalOrderItemsList.innerHTML = '<li class="list-group-item text-center text-muted py-3 empty-msg">No se han agregado platos aún</li>';
        } else {
            currentItems.forEach((row, index) => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        <span class="fw-bold">${row.quantity}x</span> ${row.item.name}
                        <div class="small text-muted">$${(row.item.price * row.quantity).toFixed(2)}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.pedidoController.eliminarItemModal(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                this.modalOrderItemsList.appendChild(li);
            });
        }
        this.modalTotalDisplay.textContent = total.toFixed(2);
    }

    renderTableOrders(orders) {
        this.tableOrdersList.innerHTML = '';
        if (orders.length === 0) {
            this.tableOrdersList.innerHTML = '<div class="alert alert-light text-center">No hay pedidos activos para esta mesa</div>';
            return;
        }

        orders.forEach(order => {
            let badgeClass = 'bg-secondary';
            if (order.status === 'pending') badgeClass = 'bg-warning text-dark';
            if (order.status === 'preparing') badgeClass = 'bg-primary';
            if (order.status === 'ready') badgeClass = 'bg-success';

            const card = document.createElement('div');
            card.className = 'card shadow-sm border-0';
            
            const itemsHtml = order.items.map(i => `<div>${i.quantity}x ${i.item.name}</div>`).join('');

            card.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <div class="mb-1">
                            <span class="fw-bold text-muted small">${order.id}</span>
                            <span class="badge ${badgeClass} ms-2">${order.status}</span>
                        </div>
                        <div class="small text-muted mb-2">${order.createdAt}</div>
                        <div class="fw-bold">${itemsHtml}</div>
                    </div>
                    ${order.status === 'ready' ? 
                        `<button class="btn btn-outline-success btn-sm" onclick="app.pedidoController.marcarCompletado('${order.id}')">Completar</button>` 
                        : ''}
                </div>
            `;
            this.tableOrdersList.appendChild(card);
        });
    }

    updateTableBadges(ordersActive) {
        document.querySelectorAll('.badge-notification').forEach(el => {
            el.classList.add('d-none');
            el.classList.remove('bg-danger', 'bg-success'); 
        });
        
        ordersActive.forEach(order => {
            const badge = document.getElementById(`table-badge-${order.table}`);
            if (badge) {
                badge.classList.remove('d-none');
                
                if (order.status === 'ready') {
                    badge.classList.add('bg-success');
                    badge.innerHTML = '<i class="fa-solid fa-check"></i>';
                } else {
                    badge.classList.add('bg-danger');
                    badge.innerHTML = '!';
                }
            }
        });
    }

    showNotification(mensaje) {
        const container = document.getElementById('notification-area');
        
        const alert = document.createElement('div');
        alert.className = 'alert alert-light border shadow-sm rounded-3 px-4 py-3 d-flex align-items-center fade show';
        alert.style.pointerEvents = 'auto';
        alert.innerHTML = `
            <i class="fa-solid fa-circle-check text-success fa-lg me-3"></i>
            <div class="fw-bold text-dark">${mensaje}</div>
        `;

        container.appendChild(alert);

        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 200);
        }, 3000);
    }
}