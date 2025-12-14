class CocinaView {
    constructor() {
        this.colPending = document.getElementById('kitchen-list-pending');
        this.colPreparing = document.getElementById('kitchen-list-preparing');
        this.colReady = document.getElementById('kitchen-list-ready');
        
        this.countPending = document.getElementById('kitchen-pending-count');
        this.countPreparing = document.getElementById('kitchen-preparing-count');
        this.countReady = document.getElementById('kitchen-ready-count');
    }

    renderKitchen(orders) {
        this.colPending.innerHTML = '';
        this.colPreparing.innerHTML = '';
        this.colReady.innerHTML = '';

        const pending = orders.filter(o => o.status === 'pending');
        const preparing = orders.filter(o => o.status === 'preparing');
        const ready = orders.filter(o => o.status === 'ready');

        this.countPending.textContent = pending.length;
        this.countPreparing.textContent = preparing.length;
        this.countReady.textContent = ready.length;

        this.renderColumn(this.colPending, pending, 'Iniciar Cocina', 'btn-primary', 'preparing');
        this.renderColumn(this.colPreparing, preparing, 'Marcar Listo', 'btn-success', 'ready');
        this.renderColumn(this.colReady, ready, 'Notificar Mesero', 'btn-secondary disabled', null);
    }

    renderColumn(container, orders, btnText, btnClass, nextStatus) {
        if (orders.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-5"><i class="fa-regular fa-clipboard fa-2x mb-3"></i><br>No hay pedidos</div>';
            return;
        }

        orders.forEach(order => {
            const itemsHtml = order.items.map(i => `<li class="list-group-item px-0 py-1 border-0">${i.quantity}x <b>${i.item.name}</b></li>`).join('');
            
            const card = document.createElement('div');
            card.className = 'kitchen-ticket p-3 w-100';
            card.innerHTML = `
                <div class="d-flex justify-content-between mb-2">
                    <span class="badge bg-dark">Mesa ${order.table}</span>
                    <small class="text-muted">${order.createdAt.split(',')[1]}</small>
                </div>
                <div class="small text-muted mb-2">Waiter: ${order.waiter}</div>
                <ul class="list-group list-group-flush mb-3">${itemsHtml}</ul>
                ${nextStatus ? 
                    `<button class="btn ${btnClass} w-100 btn-sm" onclick="app.pedidoController.cambiarEstado('${order.id}', '${nextStatus}')">${btnText}</button>` 
                    : `<div class="alert alert-success py-1 text-center small mb-0"><i class="fa-solid fa-check"></i>Listo para servir</div>`
                }
            `;
            container.appendChild(card);
        });
    }
}