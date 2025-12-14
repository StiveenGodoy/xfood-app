class AdminView {
    constructor() {
        this.totalOrdersEl = document.getElementById('admin-total-orders');
        this.totalSalesEl = document.getElementById('admin-total-sales');
        this.tableBody = document.getElementById('admin-orders-table');
    }

    renderDashboard(orders) {
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        this.totalOrdersEl.textContent = totalOrders;
        this.totalSalesEl.textContent = `$${totalSales.toFixed(2)}`;

        this.tableBody.innerHTML = '';
        
        const sortedOrders = [...orders].reverse();

        sortedOrders.forEach(order => {
            const row = document.createElement('tr');
            
            let statusBadge = '';
            if(order.status === 'pending') statusBadge = '<span class="status-badge status-pending">Pendiente</span>';
            else if(order.status === 'preparing') statusBadge = '<span class="status-badge status-preparing">Preparando</span>';
            else if(order.status === 'ready') statusBadge = '<span class="status-badge status-ready">Listo</span>';
            else statusBadge = '<span class="status-badge status-completed">Completado</span>';

            const itemsSummary = order.items.map(i => `${i.quantity} ${i.item.name}`).join(', ');

            row.innerHTML = `
                <td><small>${order.id}</small></td>
                <td>${order.table}</td>
                <td>${order.waiter}</td>
                <td class="text-truncate" style="max-width: 150px;" title="${itemsSummary}">${itemsSummary}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${statusBadge}</td>
            `;
            this.tableBody.appendChild(row);
        });
    }
}